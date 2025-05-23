import React from "react";
import "../css/Insight.css";

const SessionDetailModal = ({ session, onClose }) => {
  if (!session) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{session.question}</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>

        <div className="modal-content">
          <div className="modal-row">
            <div className="modal-label">Question</div>
            <div className="modal-value">{session.question}</div>
          </div>

          <div className="modal-row">
            <div className="modal-label">Original Answer</div>
            <div className="modal-value">{session.answer}</div>
          </div>

          <div className="modal-row">
            <div className="modal-label">Suggested Answer</div>
            <div className="modal-value suggested">{session.suggestedAnswer}</div>
          </div>

          <div className="modal-meta">
            <div><strong>Experience Level:</strong> {session.experience}</div>
            <div><strong>Response Duration:</strong> {session.duration}</div>
            <div><strong>Session Date:</strong> {session.date}</div>
          </div>

          <div className="modal-actions">
            <button className="edit-button">Edit Response</button>
            <button className="close-button-small" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionDetailModal;
