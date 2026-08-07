import axios from "axios";

export const askAi = async (messages) => {
  try {
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error("Message array is empty.");
    }

    console.log("===== OpenRouter Debug =====");
    console.log("API Key exists:", !!process.env.OPENROUTER_API_KEY);
    console.log("API Key length:", process.env.OPENROUTER_API_KEY?.length);
    console.log(
      "API Key prefix:",
      process.env.OPENROUTER_API_KEY?.substring(0, 12),
    );
    console.log("Model:", "openai/gpt-4o-mini");

    const res = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: messages,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );
    const content = res?.data?.choices?.[0]?.message?.content;

    if (!content || !content.trim()) {
      throw new Error("AI returned empty response.");
    }

    return content;
  } catch (error) {
    console.error("OpenRouter Error:", error.response?.data || error.message);
    throw new Error("OpenRouter API Error");
  }
};
