import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";

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
    const prompt = `Crie um ícone de avatar de alta resolução e qualidade épica para um jogador com o apelido '${nickname}'. O apelido '${nickname}' deve ser o foco principal, estilizado de forma criativa e integrado artisticamente na imagem. Estilo: ${style}. A imagem deve ser detalhada, vibrante e adequada para um perfil de jogo online. Pense em uma arte digital polida.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const candidate = response.candidates?.[0];

    if (!candidate) {
      if (response.promptFeedback?.blockReason) {
        throw new Error(`Geração bloqueada por segurança: ${response.promptFeedback.blockReason}`);
      }
      if (response.text) {
         throw new Error(`A API retornou uma mensagem inesperada: ${response.text}`);
      }
      throw new Error("A API não retornou nenhum resultado. Tente um apelido diferente.");
    }

    for (const part of candidate.content?.parts || []) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        const mimeType = part.inlineData.mimeType;
        return `data:${mimeType};base64,${base64ImageBytes}`;
      }
    }
    
    throw new Error("A API não conseguiu gerar uma imagem para este apelido. Por favor, tente um apelido diferente.");

  } catch (error) {
    console.error("Erro ao chamar a API Gemini:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Falha ao se comunicar com a API do Gemini.");
  }
};