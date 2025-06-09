import React from 'react';
import { format } from 'date-fns';

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
  return colors[emotion] || 'rgba(128, 128, 128, 0.1)';
};

const LogCard = ({ log, isDarkMode }) => {
  return (
    <div
      className={`p-3 rounded-lg border ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}
      style={{
        background: `linear-gradient(to right, ${getEmotionColor(log.emotion)}, rgba(255, 255, 255, 0.1))`
      }}
    >
      <div className="flex justify-between items-start mb-1">
        <span className={`text-sm font-medium ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {log.emotion}
        </span>
        <span className={`text-xs ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {format(new Date(log.createdAt), 'HH:mm')}
        </span>
      </div>
      <p className={`text-sm truncate ${
        isDarkMode ? 'text-gray-300' : 'text-gray-700'
      }`}>
        {log.emailSubject || 'No subject'}
      </p>
    </div>
  );
};

export default LogCard; 