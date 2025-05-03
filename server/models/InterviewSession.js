const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  timestamp: { type: Date, default: Date.now },
  questions: [
    {
      text: String,
      answer: String,
      transcript: String,
      emotion: String,
      eyeContact: Boolean,
    }
  ],
  score: {
    eyeContact: Number,
    emotionVariance: String,
    speed: String,
  }
});

module.exports = mongoose.model("InterviewSession", SessionSchema);
