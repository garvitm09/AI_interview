require("dotenv").config();
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");


const serviceAccount = {
  type: "service_account",
  project_id:  "companion-642f2",
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: "firebase-adminsdk-fbsvc@companion-642f2.iam.gserviceaccount.com",
  client_id: "107358089868210607423",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40companion-642f2.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

const app = express();
const port = process.env.PORT || 5000;
const interviewRoutes = require("./routes/interview");
const qnaRoutes = require("./routes/qna")
const auth = require('./routes/auth');

app.set('trust proxy', true); 
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  next();
});

const allowedOrigins = [
  'http://localhost:5173',
  'https://ai-interview-client-dfapbpw84-garvit-mathurs-projects.vercel.app',
  'https://ai-interview-client-woad.vercel.app',
  'https://ai-interview-client-garvit-mathurs-projects.vercel.app',
  'https://ai-interview-client-git-main-garvit-mathurs-projects.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));



app.use(express.json());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
require('./Middlewares/db');

app.use('/auth', auth);
app.use("/api/interview", interviewRoutes);
app.use('/api/qna', qnaRoutes)
app.post('/auth/google', async (req, res) => {
  const authHeader = req.headers.authorization || '';
  const idToken = authHeader.startsWith('Bearer ') ? authHeader.split('Bearer ')[1] : null;

  if (!idToken) return res.status(401).send('Unauthorized: No token provided');

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    res.json({ success: true, uid: decoded.uid, email: decoded.email });
  } catch (err) {
    console.error(err);
    res.status(401).send('Unauthorized');
  }
});
app.get("/check-user", async (req, res) => {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) return res.status(401).send("Unauthorized");

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    res.send({ uid: decoded.uid });
  } catch (err) {
    res.status(401).send("Invalid token");
  }
});
app.listen(port, () => {
  console.log(`🧠 AI server running on http://localhost:${port}`);
});
