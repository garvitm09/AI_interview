require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT;
const interviewRoutes = require("./routes/interview");
const qnaRoutes = require("./routes/qna")
const auth = require('./routes/auth');

const allowedOrigins = [
  'https://ai-interview-client-dfapbpw84-garvit-mathurs-projects.vercel.app',
  'https://ai-interview-client-woad.vercel.app',
  'https://ai-interview-client-garvit-mathurs-projects.vercel.app',
  'https://ai-interview-client-git-main-garvit-mathurs-projects.vercel.app'
];

// app.use(cors());
app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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
