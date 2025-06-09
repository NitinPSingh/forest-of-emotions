import React, { useState, useEffect } from 'react';
import Month3DView from './Month3DView';
import Week2DView from './Week2DView';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameMonth } from 'date-fns';

const CalendarForest = ({ isDarkMode, viewType, currentDate, data, onDateSelect }) => {
  const [selectedWeek, setSelectedWeek] = useState(0);

  // Generate calendar data based on view type
  const generateCalendarData = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start, end });

    // Create a map of date to emotion data
    const dateToEmotion = new Map();
    if (data && Array.isArray(data)) {
      data.forEach(item => {
        const date = format(new Date(item.createdAt), 'yyyy-MM-dd');
        dateToEmotion.set(date, item);
      });
    }

    // Generate calendar data with emotion information
    return days.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const emotionData = dateToEmotion.get(dateStr);
      return {
        date: day,
        emotion: emotionData?.emotion || null,
        intensity: emotionData?.intensity || 0,
        emailSubject: emotionData?.emailSubject || null,
        isCurrentMonth: isSameMonth(day, currentDate)
      };
    });
  };

  // Group calendar data into weeks
  const getWeeks = () => {
    const calendarData = generateCalendarData();
    const weeks = [];
    let week = [];

    calendarData.forEach(day => {
      week.push(day);
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    });

    if (week.length > 0) {
      // Pad the last week to have 7 days
      while (week.length < 7) {
        week.push({
          date: null,
          emotion: null,
          intensity: 0,
          emailSubject: null,
          isCurrentMonth: false
        });
      }
      weeks.push(week);
    }

    return weeks;
  };

  const weeks = getWeeks();
  const currentWeek = weeks[selectedWeek] || [];

  return (
    <div className="h-full">
      {viewType === 'month' ? (
        <Month3DView 
          isDarkMode={isDarkMode}
          data={data}
          onDateSelect={onDateSelect}
        />
      ) : viewType === 'week' ? (
        <Week2DView 
          isDarkMode={isDarkMode}
          weekLogs={currentWeek}
          weeks={weeks}
          selectedWeek={selectedWeek}
          setSelectedWeek={setSelectedWeek}
          onDateSelect={onDateSelect}
        />
      ) : (
        <div className="h-full flex items-center justify-center">
          <div className={`p-4 rounded-lg ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}>
            <h3 className="text-lg font-semibold mb-2">Day View</h3>
            {data && data.length > 0 ? (
              <div className="space-y-2">
                {data.map((item, index) => (
                  <div 
                    key={index}
                    className={`p-2 rounded ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                    }`}
                  >
                    <p className="font-medium">{item.emotion}</p>
                    <p className="text-sm opacity-75">{item.exampleEmailSubject}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No data available for this day</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarForest; 