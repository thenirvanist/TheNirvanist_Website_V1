import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { apiRequest } from "@/lib/queryClient";

/**
 * useDynamicTranslation - Hook for translating dynamic content from database
 * 
 * This hook handles translation of content fetched from the database using the Deepl API.
 * It includes intelligent caching to avoid repeat API calls and save costs.
 * 
 * @param contentType - Type of content ('journey', 'sage', 'ashram', 'blog')
 * @param contentId - ID of the content item
 * @param fields - Object with field names and original text to translate
 * @param enabled - Whether to enable the translation query (default: true)
 * @returns Query result with translated fields
 */
export function useDynamicTranslation(
  contentType: string,
  contentId: number | string,
  fields: Record<string, string>,
  enabled: boolean = true
) {
  const { currentLanguage, isTranslating, setIsTranslating } = useLanguage();

  // Only translate if language is not English and we have fields to translate
  const shouldTranslate = currentLanguage !== 'en' && 
                          Object.keys(fields).length > 0 && 
                          enabled;

  const translationQuery = useQuery({
    queryKey: [`/api/translate`, contentType, contentId, currentLanguage],
    queryFn: async () => {
      setIsTranslating(true);
      
      try {
        const response = await apiRequest('POST', `/api/translate`, {
          contentType,
          contentId: String(contentId),
          fields,
          targetLanguage: currentLanguage,
        });

        const result = await response.json();
        return result.translatedFields;
      } finally {
        setIsTranslating(false);
      }
    },
    enabled: shouldTranslate,
    staleTime: 24 * 60 * 60 * 1000, // Cache for 24 hours
    gcTime: 7 * 24 * 60 * 60 * 1000, // Keep in cache for 7 days
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Return original fields if not translating, or translated fields if available
  const translatedFields = shouldTranslate && translationQuery.data 
    ? translationQuery.data 
    : fields;

  return {
    translatedFields,
    isLoading: translationQuery.isLoading,
    isError: translationQuery.isError,
    error: translationQuery.error,
    isTranslating: shouldTranslate ? isTranslating : false,
    currentLanguage,
  };
}

/**
 * useTranslatedContent - Convenience hook for translating a single content item
 * 
 * @param content - Content object with fields to translate
 * @param contentType - Type of content
 * @param fieldsToTranslate - Array of field names to translate
 * @returns Content object with translated fields
 */
export function useTranslatedContent<T extends Record<string, any>>(
  content: T | null,
  contentType: string,
  fieldsToTranslate: string[]
): T | null {
  // Extract fields to translate from the content
  const fieldsForTranslation = content 
    ? fieldsToTranslate.reduce((acc, field) => {
        if (content[field] && typeof content[field] === 'string') {
          acc[field] = content[field];
        }
        return acc;
      }, {} as Record<string, string>)
    : {};

  const { translatedFields, isLoading } = useDynamicTranslation(
    contentType,
    content?.id || 0,
    fieldsForTranslation,
    !!content
  );

  if (!content) return null;

  // Merge translated fields back into the content object
  const translatedContent = {
    ...content,
    ...translatedFields,
    _isTranslating: isLoading,
  };

  return translatedContent;
}

/**
 * useTranslatedList - Hook for translating a list of content items
 * 
 * @param items - Array of content items
 * @param contentType - Type of content
 * @param fieldsToTranslate - Array of field names to translate
 * @returns Array of content items with translated fields
 */
export function useTranslatedList<T extends Record<string, any>>(
  items: T[] | null,
  contentType: string,
  fieldsToTranslate: string[]
): T[] | null {
  const { currentLanguage } = useLanguage();

  // If English or no items, return as-is
  if (currentLanguage === 'en' || !items) {
    return items;
  }

  // For non-English languages, translate each item
  // Note: This will make multiple API calls, but they'll be cached
  const translatedItems = items.map((item) => {
    const fieldsForTranslation = fieldsToTranslate.reduce((acc, field) => {
      if (item[field] && typeof item[field] === 'string') {
        acc[field] = item[field];
      }
      return acc;
    }, {} as Record<string, string>);

    const { translatedFields, isLoading } = useDynamicTranslation(
      contentType,
      item.id || 0,
      fieldsForTranslation,
      true
    );

    return {
      ...item,
      ...translatedFields,
      _isTranslating: isLoading,
    };
  });

  return translatedItems;
}