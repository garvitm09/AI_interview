require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT;
const interviewRoutes = require("./routes/interview");
const qnaRoutes = require("./routes/qna")
const auth = require('./routes/auth');

app.use(cors({ 
  origin: 'https://ai-interview-client-woad.vercel.app/login',
  credentials: true
}));

app.use(express.json());

require('./Middlewares/db');

app.use('/auth', auth);
app.use("/api/interview", interviewRoutes);
app.use('/api/qna', qnaRoutes)

app.listen(port, () => {
  console.log(`🧠 AI server running on http://localhost:${port}`);
});
