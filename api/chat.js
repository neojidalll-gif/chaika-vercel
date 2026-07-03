import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
Ты персональный голосовой ассистент Чайка.
Отвечай коротко, живо, по-русски.
Ты помогаешь с кино, криптой, бытом, творчеством и техническими задачами.
Не говори длинными полотнами, потому что ответ будет озвучивать колонка.
`;

export default async function handler(req, res) {
  try {
    const { text } = req.body || {};

    if (!text) {
      return res.status(400).json({ error: "Нет текста запроса" });
    }

    const response = await client.responses.create({
      model: "gpt-5.5",
      instructions: SYSTEM_PROMPT,
      input: text,
    });

    return res.status(200).json({
      text: response.output_text.slice(0, 900),
    });
  } catch (e) {
    return res.status(500).json({
      error: String(e.message || e),
    });
  }
}