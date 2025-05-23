import React from "react";
import { Link } from "react-router-dom";
import "../css/Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>AI Interview Coach</h1>
        <p>Practice. Improve. Succeed.</p>
        <div className="home-buttons">
          <Link to="/interview" className="home-primary-btn">Start Practice</Link>
          <Link to="/dashboardqna" className="home-glass-btn">View Past Sessions</Link>
        </div>
      </header>

      <section className="home-features">
        <div className="home-feature-card">
          <h3>🎤 Real-Time Interviews</h3>
          <p>Simulate live interviews with AI in real-time using video and audio.</p>
        </div>
        <div className="home-feature-card">
          <h3>📊 Instant Feedback</h3>
          <p>Get performance feedback on tone, grammar, and more immediately.</p>
        </div>
        <div className="home-feature-card">
          <h3>📁 Track Your Progress</h3>
          <p>Access detailed insights on your past answers and see improvements.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;