
import { GoogleGenAI } from "@google/genai";
import type { Command } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = 'gemini-2.5-flash';

const adrianSystemInstruction = `Tu nombre es Adrián. Eres un asistente de IA experto en técnicas de aprendizaje, diseñado para ayudar a estudiantes a procesar y estudiar cualquier texto. Tu función es transformar información pasiva en herramientas de estudio activo.
Personalidad:
- Eficiente y Claro: Ve al grano. Los estudiantes valoran su tiempo.
- Alentador y Positivo: Usa un tono de apoyo. Frases como "¡Claro que sí!", "Aquí lo tienes:", "¡Excelente!".
- Proactivo: No esperes a que el usuario lo pida todo. Si el texto es sobre historia, puedes sugerir que una línea de tiempo sería útil.
`;

export async function analyzeTopic(text: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: `Identifica el tema principal del siguiente texto en 2-5 palabras. Responde únicamente con el tema. Texto: \n\n"${text}"`,
      config: {
        systemInstruction: `Eres un experto en identificar el tema principal de cualquier texto. Tu respuesta debe ser concisa y directa.`,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error analyzing topic:", error);
    return "un tema interesante";
  }
}

export async function generateContent(text: string, command: Command): Promise<string> {
  let userPrompt = "";

  switch (command) {
    case 'summary':
      userPrompt = `Genera un resumen para el siguiente texto.
      Formato:
      1. Idea Principal: Un párrafo corto (2-3 frases) que resuma el concepto central.
      2. Puntos Clave: Una lista con viñetas (5 a 7 puntos) que detallen los argumentos, datos o conceptos más importantes.
      
      Texto:
      ---
      ${text}
      ---
      `;
      break;
    case 'quiz':
      userPrompt = `Genera un quiz para el siguiente texto.
      Formato:
      1. Genera exactamente 5 preguntas de opción múltiple (a, b, c, d).
      2. Las preguntas deben ser claras y basarse en datos importantes del texto.
      3. Al final, incluye una sección claramente separada con una línea horizontal '---'.
      4. La sección de respuestas debe empezar con "**✅ Respuestas Correctas:**" seguido de la lista (ej. 1. c, 2. a, ...).
      
      Texto:
      ---
      ${text}
      ---
      `;
      break;
    case 'flashcards':
      userPrompt = `Genera flashcards para el siguiente texto.
      Formato:
      1. Genera entre 5 y 8 flashcards.
      2. Usa este formato estricto para cada una:
         **FRENTE:** [Término o pregunta concisa]
         **DORSO:** [Definición o respuesta directa]
      3. Separa cada tarjeta con una línea horizontal ('---').
      
      Texto:
      ---
      ${text}
      ---
      `;
      break;
  }

  try {
    const response = await ai.models.generateContent({
        model: model,
        contents: userPrompt,
        config: { systemInstruction: adrianSystemInstruction }
    });
    return response.text;
  } catch (error) {
    console.error(`Error generating ${command}:`, error);
    throw new Error(`No se pudo generar el contenido. Por favor, intenta de nuevo.`);
  }
}
