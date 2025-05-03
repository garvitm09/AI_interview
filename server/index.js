require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const port = 5000;
const interviewRoutes = require("./routes/interview");

const auth = require('./routes/auth');
app.use(cors());
app.use(express.json());

require('./Middlewares/db');

app.use('/', interviewRoutes)
app.use('/auth', auth);
app.use("/api/interview", interviewRoutes);app.use("/api/interview", interviewRoutes);

app.listen(port, () => {
  console.log(`🧠 AI server running on http://localhost:${port}`);
});
