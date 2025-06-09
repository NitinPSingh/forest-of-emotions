import React from 'react';
import { FaCalendarDay, FaCalendarWeek, FaCalendarAlt } from 'react-icons/fa';

const ViewSelector = ({ activeView, onViewChange, isDarkMode }) => {
  const views = [
    { id: 'day', icon: FaCalendarDay, label: 'Day' },
    { id: 'week', icon: FaCalendarWeek, label: 'Week' },
    { id: 'month', icon: FaCalendarAlt, label: 'Month' }
  ];

  return (
    <div className="flex flex-row-reverse gap-2 p-2">
      {views.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => onViewChange(id)}
          className={`flex items-center space-x-2 px-2 py-1 rounded-lg transition-colors ${
            activeView === id
              ? 'bg-blue-500 text-white'
              : isDarkMode
              ? 'bg-gray-700 text-gray -200 hover:bg-gray-600'
              : 'bg-gray-100 text-slate-300 hover:bg-gray-200'
          }`}
        >
          <Icon className="text-lg" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
};

export default ViewSelector; 