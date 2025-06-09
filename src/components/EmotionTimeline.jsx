import React from 'react';
import './EmotionTimeline.css';

const EmotionTimeline = ({ logs = [] }) => {
  const getEmotionColor = (emotion) => {
    const colors = {
      joy: 'rgba(255, 223, 0, 0.1)',      // Yellow
      trust: 'rgba(0, 128, 0, 0.1)',      // Green
      fear: 'rgba(128, 0, 128, 0.1)',     // Purple
      surprise: 'rgba(255, 165, 0, 0.1)', // Orange
      sadness: 'rgba(0, 0, 255, 0.1)',    // Blue
      disgust: 'rgba(128, 0, 0, 0.1)',    // Maroon
      anger: 'rgba(255, 0, 0, 0.1)',      // Red
      anticipation: 'rgba(255, 192, 203, 0.1)', // Pink
      excitement: 'rgba(255, 69, 0, 0.1)', // Orange Red
      neutral: 'rgba(128, 128, 128, 0.1)' // Gray
    };
    return colors[emotion] || colors.neutral;
  };

  if (!Array.isArray(logs) || logs.length === 0) {
    return (
      <div className="timeline-container">
        <h2>Emotion Timeline</h2>
        <div className="empty-state">
          <p>No emotion logs yet. Send an email to see your emotional journey!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="timeline-container">
      <h2>Emotion Timeline</h2>
      <div className="timeline">
        {logs.map((log, index) => (
          <div key={log.id || index} className="timeline-item">
            <div 
              className="emotion-dot"
              style={{ backgroundColor: getEmotionColor(log.emotion) }}
            />
            <div className="timeline-content">
              <h3>{new Date(log.createdAt).toLocaleDateString()}</h3>
              <p className="emotion">{log.emotion}</p>
              <p className="subject">{log.emailSubject}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmotionTimeline; 