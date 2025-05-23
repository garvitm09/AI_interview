// models/InterviewSession.js
const mongoose = require("mongoose");

const qaSchema = new mongoose.Schema({
  question: String,
  userAnswer: String,
  aiFeedback: String,
  whatWentWell: String,
  whatCouldBeBetter: String,
  suggested: String,
  grammar: String,
  fillerWords: String,
  answerRating: String,
  domainRating: String,
  answerTone: String,
  metrics: {
    emotion: String,         // from audio
    volume: Number,          // from audio
    wpm: Number,             // from audio
    facialEmotion: {
      Confident: Number,
      Nervous: Number,
      Neutral: Number
    },
    eyeContact: Number       // percentage
  }
});

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  role: String,
  name: { type: String, required: false },
  experience: String,
  questions: [qaSchema],
  startedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("InterviewSession", sessionSchema);
