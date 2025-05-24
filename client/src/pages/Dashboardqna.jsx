import React, { useEffect, useState } from "react";
import "../css/Dashboard.css";
import { useNavigate } from "react-router-dom";


const Dashboardqna = () => {
  const [sessions, setSessions] = useState([]);
  const [filter, setFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("recent");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const fetchSessions = async () => {
    const email = localStorage.getItem("userEmail");
    console.log
    const res = await fetch(
      `${API_BASE_URL}/api/qna/sessions/${email}?sort=${sortOrder}&search=${search}&filter=${filter}`
    );
    const data = await res.json();
    setSessions(data.sessions);
  };

  useEffect(() => {
    fetchSessions();
  }, [filter, sortOrder, search]);

  return (
    <div className="dashboard-container">
      <h1>Sessions Dashboard</h1>
      <div className="dashboard-controls">
        <div className="filter-buttons">
          {['All', 'Completed', 'Upcoming'].map(type => (
            <button
              key={type}
              className={filter === type ? "active" : ""}
              onClick={() => setFilter(type)}
            >
              {type}
            </button>
          ))} 
        </div>
        <div className="search-sort">
          <input
            type="text"
            placeholder="Search sessions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="dropdown">
            <label>Sort by:</label>
            <select
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value)}
            >
              <option value="recent">Recent</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      <div className="session-list">
        {sessions.map((session, index) => (
          <div className="session-card" key={index}>
            <div className="session-role">{session.type}</div>
            <div className="session-title">
              {session.role || "Session"}
            </div>
            <div className="session-details">
              {session.experience} year experience · {session.questions[0]?.userAnswer?.split(" ").length / 2 || 0} minutes · {new Date(session.startedAt).toLocaleString()}
            </div>
            <button className="expand-btn"
              onClick={() => navigate(`/session-qna`, { state: { sessionId: session._id  }})}>Expand</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboardqna;
