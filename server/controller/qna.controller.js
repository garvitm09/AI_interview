const axios = require("axios");
const UserModel = require('../models/User.js');
const Session = require('../models/InterviewSession');

exports.qnaget = async (req, res) => {
    console.log("this one")
  const session = await Session.findById(req.params.sessionId);
  if (!session) return res.status(404).json({ message: "Session not found" });
  // res.json(session.questions.map(q => ({
  //   question: q.question,
  //   userAnswer: q.userAnswer
  // })));
  res.json(session.questions)
};



exports.getSessionsByUser =  async (req, res) => {
  const { email } = req.params;
  const { sort = "recent", search = "", filter = "All" } = req.query;

  try {
    const user = await UserModel.findOne({ email }).lean();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const userId = user._id;
    let query = { userId };
    // Filtering by Completed / Upcoming
    if (filter === "Completed") {
      query["questions.0.aiFeedback"] = { $exists: true };
    } else if (filter === "Upcoming") {
      query["questions.0"] = { $exists: false };
    }

    // Searching by experience or role
    if (search) {
      query["$or"] = [
        { role: { $regex: search, $options: "i" } },
        { experience: { $regex: search, $options: "i" } }
      ];
    }

    let sessions = await Session.find(query).lean();

    // Sorting
    if (sort === "alphabetical") {
      sessions.sort((a, b) => a.role.localeCompare(b.role));
    } else {
      sessions.sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));
    }

    res.status(200).json({ sessions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
};

// routes/qna.js or wherever you handle sessions
exports.deleteQna = async (req, res) => {
  try {
    const { sessionId } = req.params;
    await Session.findByIdAndDelete(sessionId);
    res.status(200).json({ message: "Session deleted" });
  } catch (error) {
    console.error("Delete failed", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



