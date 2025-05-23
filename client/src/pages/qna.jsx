// SessionQA.jsx
import React, { useEffect, useState } from "react";
import "../css/SessionQA.css";
import { useLocation } from "react-router-dom";

const SessionQA = () => {
    const location = useLocation();
    const sessionId = location.state?.sessionId;
    const [expandedQuestionIndex, setExpandedQuestionIndex] = useState(null);
  const [questions, setQuestions] = useState([]);

useEffect(() => {
  const fetchSessionData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/qna/${sessionId}/qna-get`);
      
      const data = await response.json();
      console.log("Fetched data:", data); // 👈 Log the full object
      if (Array.isArray(data.questions)) {
        setQuestions(data.questions);
        console("first", questions )
      } else if (Array.isArray(data)) {
        setQuestions(data); // fallback if API returns array directly
        console.log("Third", data)
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

return (
  <div className="qa-container">
    <h1>Interview Q&A Summary</h1>
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
      </div>
    </div>
  </div>
)}

  </div>
);


};

export default SessionQA;
