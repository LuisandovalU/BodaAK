import { InferenceClient } from "@huggingface/inference";

const rawToken = import.meta.env.PUBLIC_HF_TOKEN || import.meta.env.HF_TOKEN;
const token = typeof rawToken === 'string' ? rawToken.trim() : rawToken;

export const client = new InferenceClient(token);

export async function consultarModelo(promptUsuario: string): Promise<string> {
  try {
    const chatCompletion = await client.chatCompletion({
      model: "deepseek-ai/DeepSeek-R1:free",
      messages: [
        { role: "user", content: promptUsuario },
      ],
    });

    return chatCompletion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Error al conectar con Hugging Face:", error);
    throw error;
  }
}
