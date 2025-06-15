const axios = require("axios");
const User = require('../models/User');
const Session = require('../models/InterviewSession');
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

exports.mainFunction = async (req, res) => {
  const { transcript } = req.body;
  const { role } = req.body;
  const { experience } = req.body;
  const { type } = req.body
  const { userInfo } = req.body
  
  try {
    const prompt = `
    You are an AI interviewer for the job position of ${role}. The candidate has ${experience} years of work experience. This is a ${type} interview.
    They have just answered an interview question: "${transcript}".
    Your tasks are:
    Provide constructive feedback on the answer, focusing on relevance, technical/behavioral depth, structure, and clarity.
    Give an answer rating and domain knowledge rating on a scale that makes sense for this role (e.g., 1–10).
    Identify the tone of the candidate’s answer (e.g., confident, nervous, articulate, vague).
    Generate a next question that:
    Sounds natural and conversational, as if asked by a human interviewer.
    Aligns with the job role: ${role}
    Matches the candidate’s experience level: ${experience}
    Is relevant to the type of interview: ${type} (e.g., behavioral, technical, HR)
    Follows logically from the previous answer and helps assess further suitability for the role.
    For entry-level, ask foundational or scenario-based questions.
    For 1–2 years experience, include questions about past projects, decision-making, or tools used.
    For 2+ years experience, include depth-oriented or leadership/impact-focused questions.
    Point out grammatical mistakes if there were any and also give out count of filler words used
    Give your response in points rather than a paragraph for easy readability.
    Format your response exactly as follows:
    Feedback: <your analysis in bullet points>  
    What went well: <your analysis in bullet points>  
    What could be better: <your analysis in bullet points>  
    Suggested Answer: <Give an example of a possible great answer according to you>
    Grammar: <grammar in bullet points>  
Filler words: <fillers>  
Answer rating: <answer rating>  
Domain knowledge rating: <domain knowledge rating>  
Tone of answer: <answer tone>  
Next question: <next question asked in a natural, conversational tone>  


`;

console.log(OPENROUTER_API_KEY)
const response = await axios.post(
  "https://openrouter.ai/api/v1/chat/completions",
  {
        model: "openai/gpt-3.5-turbo", 
        messages: [
          { role: "user", content: prompt }
        ],
      },
      {
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      }
    );
    
    const fullText = response.data.choices[0].message.content;

    const feedbackMatch = fullText.match(/Feedback:\s*([\s\S]*?)\n\s*\n/i);
    const feedback = feedbackMatch ? feedbackMatch[1].trim() : null;

    const nextQMatch = fullText.match(/Next Question:\s*(.+)/i);

    const wentWellMatch = fullText.match(/What went well:\s*([\s\S]*?)\n\s*\n/i);
    const wentWell = wentWellMatch ? wentWellMatch[1].trim() : null;

    const improvementMatch = fullText.match(/What could be better:\s*([\s\S]*?)\n\s*\n/i);
    const imporvement = improvementMatch ? improvementMatch[1].trim() : null;

    const grammarMatch = fullText.match(/Grammar:\s*([\s\S]*?)\n\s*\n/i);
    const grammar = grammarMatch ? grammarMatch[1].trim() : null; 

    const sugMatch = fullText.match(/Suggested Answer:\s*([\s\S]*?)\n\s*\n/i);
    const suggested = sugMatch ? sugMatch[1].trim() : null;
    

    const fillerWordsMatch = fullText.match(/Filler words:\s*(.+)/i);
    const answerRatingMatch = fullText.match(/Answer rating:\s*(.+)/i);
    const domainMatch = fullText.match(/Domain knowledge rating:\s*(.+)/i);
    const toneMatch = fullText.match(/Tone of answer:\s*(.+)/i); 
    return res.json({
      feedback,
      wentWell,
      improvement: imporvement,
      grammar,
      suggested,
      fillerWords: fillerWordsMatch ? fillerWordsMatch[1] : null,
      answerRating: answerRatingMatch ? answerRatingMatch[1] : null,
      answerTone: toneMatch ? toneMatch[1] : null,
      domainRating: domainMatch ? domainMatch[1] : null,
      nextQuestion: nextQMatch ? nextQMatch[1] : null,
    });
  }  catch (error) {
    console.error("🔥 ERROR in /analyze route:", error);
    res.status(500).json({
      error: error.message || "Internal Server Error",
      stack: error.stack,
    });
  }
};


exports.startInterviewSession = async (req, res) => {
  const { email, role, experience, type } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const session = await Session.create({
    userId: user._id,
    role,
    experience,
    type,
    questions: [],
  });

  res.json({ sessionId: session._id });
};

exports.recordInterviewStep = async (req, res) => {
  const { sessionId, transcript, questionAsked, aiFeedback, wentWell, improvement, grammar, fillerWords, suggested, answerRating, answerTone, nextQuestion, domainRating, metrics } = req.body;

  const session = await Session.findById(sessionId);
  if (!session) return res.status(404).json({ message: "Session not found" });
  console.log(metrics)
  session.questions.push({
    question: questionAsked,
    userAnswer: transcript,
    aiFeedback,
    suggested,
    whatWentWell: wentWell,
    whatCouldBeBetter: improvement,
    grammar,
    fillerWords,
    answerRating,
    domainRating,
    answerTone,
    metrics
  });

  await session.save();

  res.json({ message: "Saved", nextQuestion });
};

exports.checkSessionName = async (req, res) => {
  const { sessionName, userId } = req.body;
  const existing = await Session.findOne({ userId, name: sessionName });
  res.json({ exists: !!existing });
};


exports.setSessionName = async (req, res) => {
  const { sessionId, sessionName } = req.body;
  await Session.findByIdAndUpdate(sessionId, { name: sessionName });
  res.json({ success: true });
};
