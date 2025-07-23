import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatResponse {
  message: string;
  intent: 'journey_inquiry' | 'meetup_question' | 'spiritual_guidance' | 'general_info' | 'booking_help';
  confidence: number;
}

const SPIRITUAL_CONTEXT = `
You are a compassionate AI guide for The Nirvanist, a spiritual tourism company. Your role is to:

1. Provide information about spiritual journeys, retreats, and experiences
2. Share wisdom from spiritual traditions with humility and respect
3. Guide users toward appropriate resources and experiences
4. Maintain a tone that is calming, inspiring, authentic, and trustworthy

Key offerings:
- Sacred journeys to Himalayas, Bali, India (typically $299-$399 + expenses)
- Global spiritual meetups (weekly online satsangs)
- Sage wisdom and teachings
- Ashram information and connections

Always respond with empathy and avoid being overly mystical or corporate. If asked about specific bookings or complex spiritual questions beyond your knowledge, guide them to contact a human guide.
`;

export async function getChatbotResponse(
  userMessage: string,
  conversationHistory: ChatMessage[] = []
): Promise<ChatResponse> {
  try {
    const messages: ChatMessage[] = [
      { role: 'system', content: SPIRITUAL_CONTEXT },
      ...conversationHistory.slice(-6), // Keep last 6 messages for context
      { role: 'user', content: userMessage }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      response_format: { type: "json_object" },
      max_tokens: 500
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No response content received");
    }

    const result = JSON.parse(content);

    return {
      message: result.message || "I'm here to help guide your spiritual journey. How can I assist you today?",
      intent: result.intent || 'general_info',
      confidence: Math.max(0, Math.min(1, result.confidence || 0.8))
    };

  } catch (error) {
    console.error("OpenAI API error:", error);
    
    // Fallback response for errors
    return {
      message: "I'm experiencing a moment of silence right now. Please try again in a moment, or feel free to contact our human guides for immediate assistance.",
      intent: 'general_info',
      confidence: 0.5
    };
  }
}

export async function analyzeUserIntent(message: string): Promise<{
  intent: string;
  entities: string[];
  confidence: number;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Analyze the user's message and extract intent and entities. 
          
          Possible intents: journey_inquiry, meetup_question, spiritual_guidance, booking_help, sage_info, ashram_info, general_info
          
          Extract entities like: locations, dates, spiritual practices, names of sages/teachers, specific journeys.
          
          Respond with JSON in this format: { "intent": "string", "entities": ["array"], "confidence": number }`,
        },
        {
          role: "user",
          content: message,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');

    return {
      intent: result.intent || 'general_info',
      entities: result.entities || [],
      confidence: Math.max(0, Math.min(1, result.confidence || 0.7))
    };
  } catch (error) {
    console.error("Intent analysis error:", error);
    return {
      intent: 'general_info',
      entities: [],
      confidence: 0.5
    };
  }
}

export async function generateSpiritualInsight(topic: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a wise spiritual guide. Provide a brief, inspiring insight about the given topic. 
          Draw from various spiritual traditions while being respectful and inclusive. 
          Keep the response under 200 words and make it practical for daily life.`,
        },
        {
          role: "user",
          content: `Share wisdom about: ${topic}`,
        },
      ],
      max_tokens: 300,
    });

    return response.choices[0].message.content || "In silence, we find the deepest wisdom.";
  } catch (error) {
    console.error("Spiritual insight generation error:", error);
    return "The journey inward is the most profound journey of all.";
  }
}
