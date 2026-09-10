import { GoogleGenAI, GenerateContentParameters, GenerateContentResponse } from '@google/genai';

let aiInstance: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not defined. Ensure it is configured in the environment.');
    }
    aiInstance = new GoogleGenAI({
      apiKey: apiKey || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Executes Gemini generateContent with automatic retry and model fallback.
 * Gracefully mitigates transient 503 UNAVAILABLE (high demand spikes) and 429 rate limits.
 */
export async function generateContentWithRetry(
  params: GenerateContentParameters,
  fallbackModels: string[] = ['gemini-flash-latest', 'gemini-3.1-flash-lite']
): Promise<GenerateContentResponse | null> {
  const ai = getGeminiClient();
  const primaryModel = params.model || 'gemini-3.8-flash';
  const modelsToTry = [primaryModel, ...fallbackModels.filter((m) => m !== primaryModel)];

  for (let i = 0; i < modelsToTry.length; i++) {
    const currentModel = modelsToTry[i];
    try {
      const response = await ai.models.generateContent({
        ...params,
        model: currentModel,
      });
      return response;
    } catch (err: any) {
      const isUnavailable =
        err?.status === 'UNAVAILABLE' ||
        err?.status === 503 ||
        err?.code === 503 ||
        err?.message?.includes('503') ||
        err?.message?.includes('high demand') ||
        err?.message?.includes('RESOURCE_EXHAUSTED') ||
        err?.message?.includes('429');

      if (isUnavailable) {
        console.warn(
          `Model ${currentModel} temporarily busy/unavailable (503). Retrying with alternative model (${i + 1}/${modelsToTry.length})...`
        );
        if (i < modelsToTry.length - 1) {
          await sleep(500 * (i + 1));
          continue;
        }
      } else {
        console.warn(`Gemini generation message for model ${currentModel}:`, err?.message || err);
      }
    }
  }

  return null;
}
