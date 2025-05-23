// src/pages/DropdownPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import '../css/Interview.css';

const DropdownPage = () => {
  const [role, setRole] = useState('');
  const [type, setType] = useState('')
  const { userInfo } = useAuth();
  const [experience, setExperience] = useState('');
  const navigate = useNavigate();

  const handleStartInterview = async () => {
    if (!role || !experience) {
      alert("Please select a role and enter experience.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/interview/start-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userInfo.email, role, type, experience }),
      });
  
      const data = await response.json();
      navigate('/session', {
        state: { role, experience,type, sessionId: data.sessionId },
      });
    } catch (error) {
      console.error("Failed to start session", error);
      alert("Error starting session");
    }
  };

  return (
<div className="interview-page">
  <div className="dropdown-container">
    <h2>Candidate Info</h2>

    <label htmlFor="role" className="dropdown-label">Select Role:</label>
    <select id="role" value={role} onChange={(e) => setRole(e.target.value)} className="dropdown-select">
      <option value="">-- Select --</option>
      <option value="Frontend Developer">Frontend Developer</option>
      <option value="Backend Developer">Backend Developer</option>
      <option value="Fullstack Developer">Full Stack Developer</option>
      <option value="UI/UX Designer">UI/UX Designer</option>
    </select>

    <label htmlFor="type" className="dropdown-label">Interview Type:</label>
    <select id="type" value={type} onChange={(e) => setType(e.target.value)} className="dropdown-select">
      <option value="">-- Select --</option>
      <option value="technical">Technical</option>
      <option value="behavioral">Behavioral</option>
      <option value="hr">HR</option>
    </select>

    <label htmlFor="experience" className="dropdown-label">Years of Experience:</label>
    <input
      type="number"
      id="experience"
      value={experience}
      onChange={(e) => setExperience(e.target.value)}
      className="dropdown-input"
      placeholder="e.g. 3"
      min="0"
    />

    <button onClick={handleStartInterview} className="dropdown-button">
      Start Interview
    </button>
  </div>
</div>

  );
};

export default DropdownPage;


