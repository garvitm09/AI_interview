import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FaceEyeTracker from "../components/FaceEyeTracker";
import AudioEmotionDetector from "../components/AudioRecord";
import { useAuth } from '../components/AuthContext';
import '../css/interviewsession.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function InterviewSession() {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, experience, type, sessionId } = location.state || {};
  const { userInfo } = useAuth();
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [question, setQuestion] = useState("Tell me about yourself.");
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAIResponse] = useState("");
  const [listening, setListening] = useState(false);
  const [audioStream, setAudioStream] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [sessionName, setSessionName] = useState("");
  const [error, setError] = useState("");

  const faceEmotionStatsRef = useRef({});
  const recordedMetricsRef = useRef({});
  const recognitionRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Speech Recognition not supported.");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        const text = Array.from(event.results)
          .map((r) => r[0].transcript)
          .join(" ");
        setTranscript(text);
        window.dispatchEvent(new CustomEvent("newTranscript", { detail: text }));
      };

      recognitionRef.current = recognition;
    };

    init();
  }, []);

  const startListening = () => {
    setTranscript("");
    setAIResponse("");
    setStartTime(Date.now());
    recognitionRef.current.start();
    setListening(true);
  };

  const stopListening = async () => {
    recognitionRef.current.stop();
    setEndTime(Date.now());
    setListening(false);

    console.log({transcript, role, experience, type, userInfo})
    const response = await fetch(`${API_BASE_URL}0/api/interview/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript, role, experience, type, userInfo }),
    });

    const data = await response.json();
    setAIResponse(data.feedback);
    setQuestion(data.nextQuestion);

    await fetch(`${API_BASE_URL}/api/interview/record-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        transcript,
        type,
        questionAsked: question,
        aiFeedback: data.feedback,
        suggested: data.suggested,
        wentWell: data.wentWell,
        improvement: data.improvement,
        grammar: data.grammar,
        fillerWords: data.fillerWords,
        answerRating: data.answerRating,
        domainRating: data.domainRating,
        answerTone: data.answerTone,
        nextQuestion: data.nextQuestion,
        metrics: {
          ...recordedMetricsRef.current,
          facialEmotion: faceEmotionStatsRef.current.facialEmotionPercentages,
          eyeContact: faceEmotionStatsRef.current.eyeContactPercentage
        }
      }),
    });
  };

  const handleSubmitSessionName = async () => {
    if (!sessionName.trim()) {
      setError("Session name cannot be empty.");
      toast.error("Session name cannot be empty.");
      return;
    }

    // Check for duplicate name
    const res = await fetch(`${API_BASE_URL}/api/interview/check-session-name`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionName, userId: userInfo._id }),
    });

    const data = await res.json();
    if (data.exists) {
      setError("A session with this name already exists.");
       toast.error("Session name already exists.");
      return;
    }

    // Name is unique → Save name and navigate
    await fetch(`${API_BASE_URL}/api/interview/set-session-name`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, sessionName }),
    });

  toast.success("Session name saved!");
  setTimeout(() => {
    navigate("/session-qna", { state: { sessionId } });
  }, 1500);
  };

  return (
    <div className="interview-app">
      <main className="main-content">
        <section className="question-section">
          <h2 className="section-heading">Question:</h2>
          <p className="ai-question">{question}</p>
        </section>

        <section className="video-section">
          <div className="video-container">
            <FaceEyeTracker
              listening={listening}
              onFaceMetrics={(data) => {
                faceEmotionStatsRef.current.facialEmotionPercentages = data.facialEmotionPercentages;
                faceEmotionStatsRef.current.eyeContactPercentage = data.eyeContactPercentage;
              }}
            />
          </div>

          <AudioEmotionDetector
            listening={listening}
            audioStream={audioStream}
            startTime={startTime}
            endTime={endTime}
            onData={(data) => {
              recordedMetricsRef.current = data;
            }}
          />
        </section>

        <section className="controls-section">
          <button
            className={`control-button ${listening ? 'disabled' : 'start'}`}
            onClick={startListening}
            disabled={listening}
          >
            🎙️ Start Listening
          </button>
          <button
            className={`control-button ${!listening ? 'disabled' : 'stop'}`}
            onClick={stopListening}
            disabled={!listening}
          >
            ⏹️ Stop Listening
          </button>
        </section>

        <section className="answer-section">
          <h2 className="section-heading">Your Answer:</h2>
          <div className="answer-content">
            {transcript ? <p>{transcript}</p> : <p className="placeholder-text">Your response will appear here as you speak...</p>}
          </div>
        </section>

        {aiResponse && (
          <section className="feedback-section">
            <h2 className="section-heading">AI Feedback:</h2>
            <ul className="feedback-list">
              {aiResponse.split("- ").filter(Boolean).map((item, index) => (
                <li key={index} className="feedback-item">{item.trim()}</li>
              ))}
            </ul>
          </section>
        )}

        <div className="end-interview-container">
          <button className="end-interview-button" onClick={() => setShowPopup(true)}>
            End Interview
          </button>
        </div>

        {showPopup && (
          <div className="popup-overlay">
            <div className="popup">
              <h3>Name your session</h3>
              <input
                type="text"
                placeholder="Enter session name"
                value={sessionName}
                onChange={(e) => {
                  setSessionName(e.target.value);
                  setError("");
                }}
              />
              {error && <p className="error-text">{error}</p>}
              <div className="popup-actions">
                <button onClick={handleSubmitSessionName}>Submit</button>
                <button onClick={() => setShowPopup(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
        <ToastContainer position="top-right" autoClose={3000} />

      </main>
    </div>
  );
}










// import React, { useEffect, useRef, useState } from "react";
// import { useLocation } from "react-router-dom";
// import FaceEyeTracker from "../components/FaceEyeTracker";
// import AudioEmotionDetector from "../components/AudioRecord";
// import { useAuth } from '../components/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import '../css/interviewsession.css';

// export default function InterviewSession() {
//   const navigate = useNavigate()
//   const location = useLocation();
//   const { role, experience, type, sessionId } = location.state || {};
//   const { userInfo } = useAuth();
//   const [startTime, setStartTime] = useState(null);
//   const [endTime, setEndTime] = useState(null);
//   const [question, setQuestion] = useState("Tell me about yourself.");
//   const [transcript, setTranscript] = useState("");
//   const [aiResponse, setAIResponse] = useState("");
//   const [listening, setListening] = useState(false);
//   const [audioStream, setAudioStream] = useState(null);
//   const faceEmotionStatsRef = useRef({});
//   const recordedMetricsRef = useRef({});
//   const recognitionRef = useRef(null);

//   // Initialize getUserMedia and SpeechRecognition
//   useEffect(() => {
//     const init = async () => {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       setAudioStream(stream);

//       const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//       if (!SpeechRecognition) {
//         alert("Speech Recognition not supported.");
//         return;
//       }

//       const recognition = new SpeechRecognition();
//       recognition.continuous = true;
//       recognition.interimResults = true;
//       recognition.lang = "en-US";

//       recognition.onresult = (event) => {
//         const text = Array.from(event.results)
//           .map((r) => r[0].transcript)
//           .join(" ");
//         setTranscript(text);

//         // Dispatch transcript for AudioEmotionDetector
//         window.dispatchEvent(new CustomEvent("newTranscript", { detail: text }));
//       };

//       recognitionRef.current = recognition;
//     };

//     init();
//   }, []);

//   const startListening = () => {
//     setTranscript("");
//     setAIResponse("");
//     setStartTime(Date.now());
//     recognitionRef.current.start();
//     setListening(true);
//   };

//   const stopListening = async () => {
//     recognitionRef.current.stop();
//     setEndTime(Date.now());
//     setListening(false);

//     const response = await fetch("http://localhost:5000/api/interview/analyze", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ transcript, role, experience,type, userInfo }),
//     });
//     const data = await response.json();
//     setAIResponse(data.feedback);
//     setQuestion(data.nextQuestion);
    
//     console.log("Sending metrics:", recordedMetricsRef.current);
//     await fetch("http://localhost:5000/api/interview/record-session", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         sessionId,
//         transcript,
//         type,
//         questionAsked: question,
//         aiFeedback: data.feedback,
//         suggested: data.suggested,
//         wentWell: data.wentWell,
//         improvement: data.improvement,
//         grammar: data.grammar,
//         fillerWords: data.fillerWords,
//         answerRating: data.answerRating,
//         domainRating: data.domainRating,
//         answerTone: data.answerTone,
//         nextQuestion: data.nextQuestion,
//         metrics: {
//           ...recordedMetricsRef.current, // audio: {emotion, volume, wpm}
//           facialEmotion: faceEmotionStatsRef.current.facialEmotionPercentages, // {Confident, Nervous, Neutral}
//           eyeContact: faceEmotionStatsRef.current.eyeContactPercentage // number
//         }
//       }),
//     });
//   };

//   const endInterview = () => {
//     console.log("here")
//     navigate("/session-qna", { state: { sessionId } });
//     alert("Interview session ended. Implementation needed for session summary.");
//   };

//   return (
//     <div className="interview-app">


//       <main className="main-content">
//         <section className="question-section">
//           <h2 className="section-heading">Question:</h2>
//           <p className="ai-question">{question}</p>
//         </section>

//         <section className="video-section">
//           <div className="video-container">
//             <FaceEyeTracker
//               listening={listening}
//               onFaceMetrics={(data) => {
//                 console.log("🧠 Received facial data:", data);
//                 faceEmotionStatsRef.current.facialEmotionPercentages = data.facialEmotionPercentages;
//                 faceEmotionStatsRef.current.eyeContactPercentage = data.eyeContactPercentage;
//               }}
//             />
//           </div>
          
//           <AudioEmotionDetector
//             listening={listening}
//             audioStream={audioStream}
//             startTime={startTime}
//             endTime={endTime}
//             onData={(data) => {
//               console.log("📊 Final metrics from AudioEmotionDetector:", data);
//               recordedMetricsRef.current = data;
//             }}
//           />
//         </section>

//         <section className="controls-section">
//           <button 
//             className={`control-button ${listening ? 'disabled' : 'start'}`}
//             onClick={startListening} 
//             disabled={listening}
//           >
//             <span className="button-icon">🎙️</span> Start Listening
//           </button>
//           <button 
//             className={`control-button ${!listening ? 'disabled' : 'stop'}`}
//             onClick={stopListening} 
//             disabled={!listening}
//           >
//             <span className="button-icon">⏹️</span> Stop Listening
//           </button>
//         </section>

//         <section className="answer-section">
//           <h2 className="section-heading">Your Answer:</h2>
//           <div className="answer-content">
//             {transcript ? (
//               <p>{transcript}</p>
//             ) : (
//               <p className="placeholder-text">Your response will appear here as you speak...</p>
//             )}
//           </div>
//         </section>

//         {aiResponse && (
//           <section className="feedback-section">
//             <h2 className="section-heading">AI Feedback:</h2>
//             <ul className="feedback-list">
//               {aiResponse.split("- ").filter(Boolean).map((item, index) => (
//                 <li key={index} className="feedback-item">{item.trim()}</li>
//               ))}
//             </ul>
//           </section>
//         )}

//         <div className="end-interview-container">
//           <button className="end-interview-button" onClick={endInterview}>
//             End Interview
//           </button>
//         </div>
//       </main>
//     </div>
//   );
// }
