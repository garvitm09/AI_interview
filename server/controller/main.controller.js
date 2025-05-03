const axios = require("axios");
const Session = require("../models/InterviewSession");

const OPENROUTER_API_KEY = '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';


exports.save = async (req, res) => {
  const session = await Session.create({
    userId: req.userId,
    ...req.body,
  });
  res.json(session);
};

exports.history = async (req, res) => {
  const sessions = await Session.find({ userId: req.userId }).sort({ timestamp: -1 });
  res.json(sessions);
};

exports.mainFunction = async (req, res) => {
  const { transcript } = req.body;

  try {
    const prompt = `
You are an AI interviewer for a job position. A candidate answered the question: "${transcript}".
Give a short feedback as an interviewer and suggest the next interview question.
Format your response like:
Feedback: <your analysis>
Next Question: <next question>
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo", // or another model from OpenRouter
        messages: [
          { role: "user", content: prompt }
        ],
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const fullText = response.data.choices[0].message.content;

    const feedbackMatch = fullText.match(/Feedback:\s*(.+)/i);
    const nextQMatch = fullText.match(/Next Question:\s*(.+)/i);

    res.json({
      aiResponse: feedbackMatch ? feedbackMatch[1] : "No feedback found.",
      nextQuestion: nextQMatch ? nextQMatch[1] : "What is your greatest strength?",
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send("AI analysis failed.");
  }
};
