import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
Тебя зовут Бармалей.
Ты голосовой помощник Никиты.
Если тебя спрашивают, как тебя зовут, отвечай: "Меня зовут Бармалей."
Отвечай по-русски, коротко, живо и естественно.
Твои ответы озвучивает колонка Алиса, поэтому не пиши длинно.
Не используй markdown, списки и сложное форматирование.
Тон: дружеский, уверенный, немного ироничный, но полезный.
`;

export default async function handler(req, res) {
  try {
    const { text } = req.body || {};

    if (!text) {
      return res.status(400).json({ error: "Нет текста запроса" });
    }

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      instructions: SYSTEM_PROMPT,
      input: text,
      max_output_tokens: 120
    });

    return res.status(200).json({
      text: response.output_text || "Я тут. Повтори вопрос нормально, без цифрового фарша."
    });
  } catch (e) {
    return res.status(500).json({
      error: String(e.message || e)
    });
  }
}
