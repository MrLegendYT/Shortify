import { GoogleGenAI, Type } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateSmartAlias = async (url: string): Promise<string> => {
  try {
    const ai = getAiClient();
    
    const prompt = `
      Analyze the following URL and generate a short, catchy, UNIQUE, and URL-safe alias (slug) for it.
      URL: ${url}
      
      Constraints:
      - Max 20 characters.
      - Use alphanumeric characters and hyphens.
      - No spaces.
      - To ensure uniqueness, consider combining 2 relevant words or appending a short number (e.g. 'cool-pizza-23' or 'react-docs-v2').
      - Do NOT use very common single words like 'news' or 'shop' as they will be taken.
      - Return ONLY the slug string.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                slug: {
                    type: Type.STRING,
                    description: "The generated URL-safe slug"
                }
            }
        }
      }
    });

    const json = JSON.parse(response.text || '{}');
    const slug = json.slug?.toLowerCase();
    
    // Fallback if AI returns empty
    return slug || `link-${Math.random().toString(36).substring(2, 7)}`;

  } catch (error) {
    console.error("Error generating alias:", error);
    // Fallback if AI fails
    return `u-${Math.random().toString(36).substring(2, 8)}`;
  }
};