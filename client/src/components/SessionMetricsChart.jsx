import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import '../css/SessionMetricsChart.css';

// Internal WPMBar Component
const WPMBar = ({ wpm }) => {
  const getWpmColor = (wpm) => {
    if (wpm < 120) return '#f44336'; // Too slow
    if (wpm <= 160) return '#4caf50'; // Ideal
    return '#ff9800'; // Too fast
  };

  return (
    <div className="wpm-bar-container">
      <div className="wpm-labels">
        <span>Too Slow</span>
        <span>Ideal (120–160)</span>
        <span>Too Fast</span>
      </div>
      <div className="wpm-bar">
        <div
          className="wpm-bar-fill"
          style={{
            width: `${Math.min(wpm, 200) / 2}%`,
            backgroundColor: getWpmColor(wpm)
          }}
        >
          {wpm} WPM
        </div>
      </div>
    </div>
  );
};
export default function SessionMetricsChart({ questions, selectedQuestion = null }) {
  const metricsData = selectedQuestion
    ? [{
        wpm: selectedQuestion.data.metrics?.wpm ?? 0,
      }]
    : [{
        wpm:
          questions.reduce((acc, q) => acc + (q.metrics?.wpm ?? 0), 0) /
          (questions.length || 1),
      }];

  const facialEmotion = selectedQuestion
    ? selectedQuestion.data.metrics?.facialEmotion || {}
    : (() => {
        const total = questions.length || 1;
        const sum = questions.reduce(
          (acc, q) => {
            const f = q.metrics?.facialEmotion || {};
            acc.Confident += f.Confident ?? 0;
            acc.Nervous += f.Nervous ?? 0;
            acc.Neutral += f.Neutral ?? 0;
            return acc;
          },
          { Confident: 0, Nervous: 0, Neutral: 0 }
        );
        return {
          Confident: sum.Confident / total,
          Nervous: sum.Nervous / total,
          Neutral: sum.Neutral / total,
        };
      })();

  const speechEmotion = selectedQuestion
    ? selectedQuestion.data.metrics?.speechEmotion || {}
    : (() => {
        const total = questions.length || 1;
        const sum = questions.reduce(
          (acc, q) => {
            const s = q.metrics?.speechEmotion || {};
            acc.Happy += s.Happy ?? 0;
            acc.Sad += s.Sad ?? 0;
            acc.Angry += s.Angry ?? 0;
            acc.Neutral += s.Neutral ?? 0;
            return acc;
          },
          { Happy: 0, Sad: 0, Angry: 0, Neutral: 0 }
        );
        return {
          Happy: sum.Happy / total,
          Sad: sum.Sad / total,
          Angry: sum.Angry / total,
          Neutral: sum.Neutral / total,
        };
      })();

  const facialData = Object.entries(facialEmotion).map(([emotion, value]) => ({
    name: emotion,
    value: Math.round(value),
  }));

  const speechData = Object.entries(speechEmotion).map(([emotion, value]) => ({
    name: emotion,
    value: Math.round(value),
  }));

  const COLORS = ['#4caf50', '#f44336', '#ff9800', '#2196f3'];

  return (
    <div className="charts-wrapper">
      <h2>{selectedQuestion ? `Metrics for Q${selectedQuestion.index + 1}` : "Interview Session Metrics"}</h2>

      {/* WPM Bar */}
      <div className="wpm-section">
        <h3>Speaking Pace (WPM)</h3>
        <WPMBar wpm={metricsData[0].wpm} />
      </div>

      {/* Pie Charts */}
      <div className="pie-charts-section">
        <div className="pie-chart-block">
          <h3>Facial Emotion</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={facialData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {facialData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
