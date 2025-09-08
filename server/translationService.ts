import { db } from "./db";
import { translationCache, TranslationCache, InsertTranslationCache } from "@shared/schema";
import { eq, and } from "drizzle-orm";

/**
 * TranslationService - Handles dynamic content translation with Deepl API and caching
 * 
 * Features:
 * - Integrates with Deepl API for high-quality translations
 * - Caches translations in database to avoid repeat API calls
 * - Supports all major content types (journeys, sages, ashrams, blog posts)
 * - Handles multiple text fields per content item
 * - Cost optimization through intelligent caching
 */
export class TranslationService {
  private deeplApiKey: string | undefined;
  private deeplApiUrl = "https://api-free.deepl.com/v2/translate";

  constructor() {
    this.deeplApiKey = process.env.DEEPL_API_KEY;
    
    // If using paid plan, use this URL instead:
    // this.deeplApiUrl = "https://api.deepl.com/v2/translate";
  }

  /**
   * Language code mapping from our system to Deepl API format
   */
  private getDeeplLanguageCode(languageCode: string): string {
    const mapping: Record<string, string> = {
      'en': 'EN',
      'fr': 'FR', 
      'de': 'DE',
      'es': 'ES',
      'zh': 'ZH',
      'ar': 'AR',
      'ru': 'RU',
      'pt': 'PT',
    };
    
    return mapping[languageCode] || 'EN';
  }

  /**
   * Check if translation exists in cache
   */
  private async getCachedTranslation(
    contentType: string,
    contentId: number,
    fieldName: string,
    language: string
  ): Promise<TranslationCache | null> {
    try {
      const [cached] = await db
        .select()
        .from(translationCache)
        .where(
          and(
            eq(translationCache.contentType, contentType),
            eq(translationCache.contentId, contentId),
            eq(translationCache.fieldName, fieldName),
            eq(translationCache.language, language)
          )
        )
        .limit(1);

      return cached || null;
    } catch (error) {
      console.error('Error fetching cached translation:', error);
      return null;
    }
  }

  /**
   * Store translation in cache
   */
  private async storeCachedTranslation(
    data: InsertTranslationCache
  ): Promise<void> {
    try {
      await db
        .insert(translationCache)
        .values({
          ...data,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: [
            translationCache.contentType,
            translationCache.contentId,
            translationCache.fieldName,
            translationCache.language,
          ],
          set: {
            translatedText: data.translatedText,
            updatedAt: new Date(),
          },
        });
    } catch (error) {
      console.error('Error storing cached translation:', error);
      // Don't throw - caching failure shouldn't break the translation
    }
  }

  /**
   * Call Deepl API to translate text
   */
  private async translateWithDeepl(
    text: string,
    targetLanguage: string
  ): Promise<string> {
    if (!this.deeplApiKey) {
      console.warn('DEEPL_API_KEY not configured, returning original text');
      return text;
    }

    if (!text.trim()) {
      return text;
    }

    try {
      const response = await fetch(this.deeplApiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `DeepL-Auth-Key ${this.deeplApiKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          text: text,
          target_lang: this.getDeeplLanguageCode(targetLanguage),
          source_lang: 'EN', // Assuming source is always English
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Deepl API error (${response.status}):`, errorText);
        return text; // Return original text on API error
      }

      const result = await response.json();
      
      if (result.translations && result.translations.length > 0) {
        return result.translations[0].text;
      }
      
      return text;
    } catch (error) {
      console.error('Error calling Deepl API:', error);
      return text; // Return original text on error
    }
  }

  /**
   * Translate a single field with caching
   * 
   * @param contentType - Type of content (journey, sage, ashram, blog)
   * @param contentId - ID of the content item
   * @param fieldName - Name of the field being translated
   * @param originalText - Original text to translate
   * @param targetLanguage - Target language code
   * @returns Translated text (from cache or fresh from API)
   */
  public async translateField(
    contentType: string,
    contentId: number,
    fieldName: string,
    originalText: string,
    targetLanguage: string
  ): Promise<string> {
    // Return original text for English or if text is empty
    if (targetLanguage === 'en' || !originalText?.trim()) {
      return originalText;
    }

    // Check cache first
    const cached = await this.getCachedTranslation(
      contentType,
      contentId,
      fieldName,
      targetLanguage
    );

    if (cached) {
      console.log(`Using cached translation for ${contentType}:${contentId}:${fieldName}:${targetLanguage}`);
      return cached.translatedText;
    }

    // Translate with Deepl API
    console.log(`Translating with Deepl API: ${contentType}:${contentId}:${fieldName}:${targetLanguage}`);
    const translatedText = await this.translateWithDeepl(originalText, targetLanguage);

    // Store in cache (fire and forget)
    this.storeCachedTranslation({
      contentType,
      contentId,
      fieldName,
      language: targetLanguage,
      originalText,
      translatedText,
    });

    return translatedText;
  }

  /**
   * Translate multiple fields of a content item
   * 
   * @param contentType - Type of content
   * @param contentId - ID of the content item  
   * @param fields - Object with field names as keys and text as values
   * @param targetLanguage - Target language code
   * @returns Object with same structure but translated text
   */
  public async translateMultipleFields(
    contentType: string,
    contentId: number,
    fields: Record<string, string>,
    targetLanguage: string
  ): Promise<Record<string, string>> {
    const translatedFields: Record<string, string> = {};

    // Process fields in parallel for better performance
    await Promise.all(
      Object.entries(fields).map(async ([fieldName, text]) => {
        if (typeof text === 'string') {
          translatedFields[fieldName] = await this.translateField(
            contentType,
            contentId,
            fieldName,
            text,
            targetLanguage
          );
        } else {
          translatedFields[fieldName] = text; // Keep non-string values as-is
        }
      })
    );

    return translatedFields;
  }

  /**
   * Get Deepl API usage statistics (if API key is configured)
   */
  public async getApiUsage(): Promise<{ character_count: number; character_limit: number } | null> {
    if (!this.deeplApiKey) {
      return null;
    }

    try {
      const response = await fetch('https://api-free.deepl.com/v2/usage', {
        headers: {
          'Authorization': `DeepL-Auth-Key ${this.deeplApiKey}`,
        },
      });

      if (response.ok) {
        return await response.json();
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching Deepl usage:', error);
      return null;
    }
  }

  /**
   * Clear cached translations for a specific content item
   * Useful when content is updated and needs fresh translations
   */
  public async clearCacheForContent(
    contentType: string,
    contentId: number
  ): Promise<void> {
    try {
      await db
        .delete(translationCache)
        .where(
          and(
            eq(translationCache.contentType, contentType),
            eq(translationCache.contentId, contentId)
          )
        );
      
      console.log(`Cleared translation cache for ${contentType}:${contentId}`);
    } catch (error) {
      console.error('Error clearing translation cache:', error);
    }
  }
}