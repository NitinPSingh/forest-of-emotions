import React from 'react';
import { format } from 'date-fns';

const Week2DView = ({ isDarkMode, weekLogs, weeks, selectedWeek, setSelectedWeek, onDateSelect }) => {
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getEmotionColor = (emotion) => {
    const colors = {
      joy: '#FFD700',
      sadness: '#4682B4',
      anger: '#FF4500',
      fear: '#800080',
      surprise: '#FF69B4',
      trust: '#32CD32',
      disgust: '#8B4513',
      anticipation: '#FFA500',
      neutral: '#A9A9A9'
    };
    return colors[emotion] || '#A9A9A9';
  };

  return (
    <div className="h-full flex flex-col">
      {/* Week Selector */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setSelectedWeek(prev => Math.max(0, prev - 1))}
          disabled={selectedWeek === 0}
          className={`px-3 py-1 rounded ${
            isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray -800'
          } disabled:opacity-50`}
        >
          Previous Week
        </button>
        <span className={isDarkMode ? 'text-white' : 'text-gray -800'}>
          Week {selectedWeek + 1}
        </span>
        <button
          onClick={() => setSelectedWeek(prev => Math.min(weeks.length - 1, prev + 1))}
          disabled={selectedWeek === weeks.length - 1}
          className={`px-3 py-1 rounded ${
            isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray -800'
          } disabled:opacity-50`}
        >
          Next Week
        </button>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-7 gap-2 flex-1">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={`text-center p-2 ${
              isDarkMode ? 'text-gray-400' : 'text-gray -600'
            }`}
          >
            {day}
          </div>
        ))}
        
        {weekLogs.map((day, index) => (
          <div
            key={index}
            onClick={() => day.date && onDateSelect(day.date)}
            className={`relative rounded-lg p-2 cursor-pointer transition-all ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-md hover:shadow-lg ${
              !day.date ? 'opacity-50' : ''
            }`}
          >
            {day.date ? (
              <>
                <div className="text-sm mb-1">
                  {format(day.date, 'd')}
                </div>
                {day.emotion && (
                  <div
                    className="w-full h-2 rounded-full"
                    style={{ backgroundColor: getEmotionColor(day.emotion) }}
                  />
                )}
                {day.emailSubject && (
                  <div className="text-xs mt-1 truncate">
                    {day.emailSubject}
                  </div>
                )}
              </>
            ) : (
              <div className="text-gray -400">-</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Week2DView; 