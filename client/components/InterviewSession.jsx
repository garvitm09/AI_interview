// src/components/InterviewSession.jsx
import { useEffect, useRef, useState } from "react";
import AudioEmotionDetector from "./AudioRecord";
import { startInterviewAnalyzer } from './FaceEyeTracker';

function InterviewSession() {
  const videoRef = useRef();
  const recognitionRef = useRef(null);
  const canvasRef = useRef(null);
  const emotionDisplayRef = useRef(null);
  const eyeContactDisplayRef = useRef(null);
  const metricsIntervalRef = useRef(null);

  const [question, setQuestion] = useState("Tell me about yourself.");
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAIResponse] = useState("");
  const [listening, setListening] = useState(false);
  const [recordedMetrics, setRecordedMetrics] = useState([]);

  useEffect(() => {
    startInterviewAnalyzer(videoRef, canvasRef, emotionDisplayRef, eyeContactDisplayRef);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((r) => r[0].transcript)
          .join("");
        setTranscript(transcript);
      };

      recognitionRef.current = recognition;
    } else {
      alert("Speech Recognition not supported in this browser.");
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      setTranscript("");
      setAIResponse("");
      setRecordedMetrics([]); // reset metrics for new answer
      recognitionRef.current.start();
      setListening(true);

      // Start collecting emotion & eye contact data every second
      metricsIntervalRef.current = setInterval(() => {
        const emotion = emotionDisplayRef.current?.innerText || "";
        const eyeContact = eyeContactDisplayRef.current?.innerText || "";

        setRecordedMetrics((prev) => [
          ...prev,
          {
            timestamp: new Date().toISOString(),
            emotion,
            eyeContact,
          },
        ]);
      }, 1000);
    }
  };
  console.log(recordedMetrics);

  const stopListening = async () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);

      // Stop metrics collection
      clearInterval(metricsIntervalRef.current);

      // Log or process collected metrics (optional)
      console.log("Collected Metrics:", recordedMetrics);

      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      });

      const data = await response.json();
      setAIResponse(data.aiResponse);
      setQuestion(data.nextQuestion);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>AI Interviewer</h1>
      <h2>🧠 AI Question:</h2>
      <p>{question}</p>

      <video ref={videoRef} autoPlay muted width="720" height="560" style={{ border: "1px solid #ccc" }} />
      <canvas ref={canvasRef} style={{ position: "absolute", left: 0, top: 0 }} />

      <div>
        <button onClick={startListening} disabled={listening}>Start Answer</button>
        <button onClick={stopListening} disabled={!listening}>Stop Answer</button>
      </div>

      <h3>🗣️ You:</h3>
      <p>{transcript}</p>

      {aiResponse && (
        <>
          <h3>🤖 AI Response:</h3>
          <p>{aiResponse}</p>
        </>
      )}

      <div style={{ position: "relative", top: "250px", marginLeft: "10px", fontSize: "24px" }}>
        Emotion: <span ref={emotionDisplayRef}>Loading...</span><br />
        Eye Contact: <span ref={eyeContactDisplayRef}>Loading...</span>
      </div>

      <AudioEmotionDetector />
    </div>
  );
}

export default InterviewSession;





// import { useEffect, useRef, useState } from "react";
// import AudioEmotionDetector from "./AudioRecord";
// import { startInterviewAnalyzer } from './FaceEyeTracker'; // adjust if needed

// function InterviewSession() {
//   const videoRef = useRef();
//   const recognitionRef = useRef(null);
//   const canvasRef = useRef(null);
//   const emotionDisplayRef = useRef(null);
//   const eyeContactDisplayRef = useRef(null);
//   const [question, setQuestion] = useState("Tell me about yourself.");
//   const [transcript, setTranscript] = useState("");
//   const [aiResponse, setAIResponse] = useState("");
//   const [listening, setListening] = useState(false);

//   useEffect(() => {
//       startInterviewAnalyzer(videoRef, canvasRef, emotionDisplayRef, eyeContactDisplayRef);
      
//       const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//       if (SpeechRecognition) {
//           const recognition = new SpeechRecognition();
//           recognition.continuous = true;
//           recognition.interimResults = true;
//           recognition.lang = "en-US";

//       recognition.onresult = (event) => {
//         const transcript = Array.from(event.results)
//         .map((r) => r[0].transcript)
//         .join("");
//         setTranscript(transcript);
//     };
    
//     recognitionRef.current = recognition;
// } else {
//     alert("Speech Recognition not supported in this browser.");
// }
// }, []);

//   const startListening = () => {
//       if (recognitionRef.current) {
//       setTranscript("");
//       setAIResponse("");
//       recognitionRef.current.start();
//       setListening(true);
//     }
// };

// const stopListening = async () => {
//     if (recognitionRef.current) {
//         recognitionRef.current.stop();
//         setListening(false);
        
//         const response = await fetch("http://localhost:5000/analyze", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ transcript }),
//     });
    
//     const data = await response.json();
//     setAIResponse(data.aiResponse);
//     setQuestion(data.nextQuestion);
// }
// };

// return (
//     <div style={{ padding: 20 }}>
//       <h1>AI Interviewer</h1>
//       <h2>🧠 AI Question:</h2>
//       <p>{question}</p>

//       <video ref={videoRef} autoPlay muted width="720" height="560" style={{ border: "1px solid #ccc" }} />
//       <canvas ref={canvasRef} style={{ position: "absolute", left: 0, top: 0 }} />
//       <div>
//         <button onClick={startListening} disabled={listening}>Start Answer</button>
//         <button onClick={stopListening} disabled={!listening}>Stop Answer</button>
//       </div>

//       <h3>🗣️ You:</h3>
//       <p>{transcript}</p>

//       {aiResponse && (
//           <>
//           <h3>🤖 AI Response:</h3>
//           <p>{aiResponse}</p>
//         </>
//       )}

//       <div style={{ position: "relative", top: "250px", marginLeft: "10px", fontSize: "24px" }}>
//         Emotion: <span ref={emotionDisplayRef}>Loading...</span><br />
//         Eye Contact: <span ref={eyeContactDisplayRef}>Loading...</span>
//       </div>
//       <AudioEmotionDetector />
//     </div>
//   );
// }
// {console.log(emotionDisplayRef)}

// export default InterviewSession;
