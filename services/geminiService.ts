import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("A variável de ambiente API_KEY não está configurada.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateIcon = async (nickname: string, style: string): Promise<string> => {
  if (!nickname) {
    throw new Error("O apelido é obrigatório para gerar um ícone.");
  }
   if (!style) {
    throw new Error("O estilo é obrigatório para gerar um ícone.");
  }

  try {
    const ai = getAiClient();
    const prompt = `Um ícone de avatar épico e de alta resolução para um jogador, com o apelido '${nickname}' estilizado de forma criativa e artística no centro. Estilo visual: ${style}. Detalhado, vibrante, arte digital polida, ideal para um perfil de jogo.`;

    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png',
        aspectRatio: '1:1',
      },
    });

    const generatedImage = response.generatedImages?.[0];

    if (!generatedImage?.image?.imageBytes) {
       throw new Error("A API não conseguiu gerar uma imagem para este apelido. Por favor, tente um apelido diferente.");
    }

    const base64ImageBytes: string = generatedImage.image.imageBytes;
    return `data:image/png;base64,${base64ImageBytes}`;

  } catch (error) {
    console.error("Erro ao chamar a API Gemini:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Falha ao se comunicar com a API do Gemini.");
  }
};
