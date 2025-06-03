// // SessionQA.jsx
import React, { useEffect, useState } from "react";
import "../css/SessionQA.css";
import { useLocation, useNavigate } from "react-router-dom";
import SessionMetricsChart from '../components/SessionMetricsChart';
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const SessionQA = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const sessionId = location.state?.sessionId;
  const [expandedQuestionIndex, setExpandedQuestionIndex] = useState(null);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/qna/${sessionId}/qna-get`);
        const data = await response.json();
        if (Array.isArray(data.questions)) {
          setQuestions(data.questions);
        } else if (Array.isArray(data)) {
          setQuestions(data);
        } else {
          console.warn("Unexpected data format", data);
        }
      } catch (error) {
        console.error("Failed to fetch session data", error);
      }
    };

    if (sessionId) {
      fetchSessionData();
    }
  }, [sessionId]);


  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this session?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/qna/${sessionId}/delete-session`, {
        method: "DELETE"
      });

      if (response.ok) {
        toast.success("Session deleted successfully");
        navigate("/dashboardqna");
      } else {
        toast.error("Failed to delete session");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="qa-container">
      <h1>Interview Q&A Summary</h1>
      <button className="delete-session-btn" onClick={handleDelete}>🗑 Delete Session</button>

      {questions.length > 0 ? (
        <div className="qa-grid">
          {questions.map((q, index) => (
            <div className="qa-card" key={index}>
              <h2>{q.question}</h2>
              <p><strong>Answer:</strong> {q.userAnswer}</p>
              <button onClick={() => setExpandedQuestionIndex(index)}>Expand</button>
            </div>
          ))}
        </div>
      ) : (
        <p>Loading or no questions available...</p>
      )}

{expandedQuestionIndex !== null && (
  <div className="modal-overlay">
    <div className="modal-content">
      <button className="modal-close" onClick={() => setExpandedQuestionIndex(null)}>×</button>
      <div className="modal-body">
        <h2>Question: {questions[expandedQuestionIndex].question}</h2>
        <p><strong>User Answer:</strong> {questions[expandedQuestionIndex].userAnswer}</p>
        <p><strong>AI Feedback:</strong> {questions[expandedQuestionIndex].aiFeedback}</p>
        <p><strong>What Went Well:</strong> {questions[expandedQuestionIndex].whatWentWell}</p>
        <p><strong>What Could Be Better:</strong> {questions[expandedQuestionIndex].whatCouldBeBetter}</p>
        <p><strong>Grammar:</strong> {questions[expandedQuestionIndex].grammar}</p>
        <p><strong>Filler Words:</strong> {questions[expandedQuestionIndex].fillerWords}</p>
        <p><strong>Answer Rating:</strong> {questions[expandedQuestionIndex].answerRating}</p>
        <p><strong>Answer Tone:</strong> {questions[expandedQuestionIndex].answerTone}</p>

        <SessionMetricsChart
          questions={questions}
          selectedQuestion={{ data: questions[expandedQuestionIndex], index: expandedQuestionIndex }}
        />
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default SessionQA;





// import React, { useEffect, useState } from "react";
// import "../css/SessionQA.css";
// import { useLocation } from "react-router-dom";
// import SessionMetricsChart from "../components/SessionMetricsChart";
// const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// const SessionQA = () => {
//   const location = useLocation();
//   const sessionId = location.state?.sessionId;
//   const [expandedQuestionIndex, setExpandedQuestionIndex] = useState(null);
//   const [questions, setQuestions] = useState([]);

//   useEffect(() => {
//     const fetchSessionData = async () => {
//       try {
//         const response = await fetch(`${API_BASE_URL}/api/qna/${sessionId}/qna-get`);
//         const data = await response.json();
//         console.log("Fetched data:", data);

//         if (Array.isArray(data.questions)) {
//           setQuestions(data.questions);
//           console.log("First format:", data.questions);
//         } else if (Array.isArray(data)) {
//           setQuestions(data);
//           console.log("Fallback format:", data);
//         } else {
//           console.warn("Unexpected data format", data);
//         }
//       } catch (error) {
//         console.error("Failed to fetch session data", error);
//       }
//     };

//     if (sessionId) {
//       fetchSessionData();
//     }
//   }, [sessionId]);

//   return (
//     <div className="qa-container">
//       <h1>Interview Q&A Summary</h1>

//       {questions.length > 0 ? (
//         <div className="qa-grid">
//           {questions.map((q, index) => (
//             <div className="qa-card" key={index}>
//               <h2>{q.question}</h2>
//               <p><strong>Answer:</strong> {q.userAnswer}</p>
//               <button onClick={() => setExpandedQuestionIndex(index)}>Expand</button>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p>Loading or no questions available...</p>
//       )}

//       {expandedQuestionIndex !== null && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <button className="modal-close" onClick={() => setExpandedQuestionIndex(null)}>×</button>
//             <div className="modal-body">
//               <h2>Question: {questions[expandedQuestionIndex].question}</h2>
//               <p><strong>User Answer:</strong> {questions[expandedQuestionIndex].userAnswer}</p>
//               <p><strong>AI Feedback:</strong> {questions[expandedQuestionIndex].aiFeedback}</p>
//               <p><strong>What Went Well:</strong> {questions[expandedQuestionIndex].whatWentWell}</p>
//               <p><strong>What Could Be Better:</strong> {questions[expandedQuestionIndex].whatCouldBeBetter}</p>
//               <p><strong>Grammar:</strong> {questions[expandedQuestionIndex].grammar}</p>
//               <p><strong>Filler Words:</strong> {questions[expandedQuestionIndex].fillerWords}</p>
//               <p><strong>Answer Rating:</strong> {questions[expandedQuestionIndex].answerRating}</p>
//               <p><strong>Answer Tone:</strong> {questions[expandedQuestionIndex].answerTone}</p>

//               {/* 📊 Metrics Chart below */}
//               <h3>Session Metrics</h3>
//               <SessionMetricsChart questions={questions} />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SessionQA;






// import React, { useEffect, useState } from "react";
// import "../css/SessionQA.css";
// import { useLocation } from "react-router-dom";
// const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
// import SessionMetricsChart from './SessionMetricsChart';

// const SessionQA = () => {
//     const location = useLocation();
//     const sessionId = location.state?.sessionId;
//     const [expandedQuestionIndex, setExpandedQuestionIndex] = useState(null);
//   const [questions, setQuestions] = useState([]);

// useEffect(() => {
//   const fetchSessionData = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/qna/${sessionId}/qna-get`);
      
//       const data = await response.json();
//       console.log("Fetched data:", data); // 👈 Log the full object
//       if (Array.isArray(data.questions)) {
//         setQuestions(data.questions);
//         console("first", questions )
//       } else if (Array.isArray(data)) {
//         setQuestions(data); // fallback if API returns array directly
//         console.log("Third", data)
//       } else {
//         console.warn("Unexpected data format", data);
//       }
//     } catch (error) {
//       console.error("Failed to fetch session data", error);
//     }
//   };

//   if (sessionId) {
//     fetchSessionData();
//   }
// }, [sessionId]);

// return (
//   <div className="qa-container">
//     <h1>Interview Q&A Summary</h1>
//     {questions.length > 0 ? (
//       <div className="qa-grid">
//         {questions.map((q, index) => (
//           <div className="qa-card" key={index}>
//             <h2>{q.question}</h2>
//             <p><strong>Answer:</strong> {q.userAnswer}</p>
//            <button onClick={() => setExpandedQuestionIndex(index)}>Expand</button>
//           </div>
//         ))}
//       </div>
//     ) : (
//       <p>Loading or no questions available...</p>
//     )}

//     {expandedQuestionIndex !== null && (
//   <div className="modal-overlay">
//     <div className="modal-content">
//       <button className="modal-close" onClick={() => setExpandedQuestionIndex(null)}>×</button>
//       <div className="modal-body">
//         <h2>Question: {questions[expandedQuestionIndex].question}</h2>
//         <p><strong>User Answer:</strong> {questions[expandedQuestionIndex].userAnswer}</p>
//         <p><strong>AI Feedback:</strong> {questions[expandedQuestionIndex].aiFeedback}</p>
//         <p><strong>What Went Well:</strong> {questions[expandedQuestionIndex].whatWentWell}</p>
//         <p><strong>What Could Be Better:</strong> {questions[expandedQuestionIndex].whatCouldBeBetter}</p>
//         <p><strong>Grammar:</strong> {questions[expandedQuestionIndex].grammar}</p>
//         <p><strong>Filler Words:</strong> {questions[expandedQuestionIndex].fillerWords}</p>
//         <p><strong>Answer Rating:</strong> {questions[expandedQuestionIndex].answerRating}</p>
//         <p><strong>Answer Tone:</strong> {questions[expandedQuestionIndex].answerTone}</p>
//       </div>
//     </div>
//   </div>
// )}

//   </div>
// );


// };

// export default SessionQA;
