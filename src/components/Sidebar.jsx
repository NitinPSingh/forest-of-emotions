import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaHome, FaChartBar, FaCog, FaQuestionCircle, FaSun, FaMoon } from 'react-icons/fa';

const Sidebar = ({ isOpen, onToggle, isDarkMode, onThemeToggle }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={onToggle}
        className={`
          fixed top-4 left-4 z-50 
          p-2 rounded-lg
          ${isDarkMode ? 'bg-gray text-white' : 'bg-white text-gray -900'}
          shadow-lg
          lg:hidden
        `}
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Sidebar */}
      <div 
        className={`
          fixed top-0 left-0 h-full
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          w-64
          ${isDarkMode ? 'bg-gray' : 'bg-white'}
          shadow-xl
          z-100
        `}
      >
        {/* Header */}
        <div className={`
          flex items-center justify-between p-4
          border-b
          ${isDarkMode ? 'border-gray' : 'border-gray-200'}
        `}>
          <h2 className={`
            text-lg font-bold
            ${isDarkMode ? 'text-white' : 'text-gray -900'}
          `}>
            Forest of Emotions
          </h2>
          <button 
            onClick={onToggle}
            className={`
              p-2 rounded-lg lg:hidden
              ${isDarkMode ? 'text-gray -400 hover:text-white' : 'text-gray -600 hover:text-gray -900'}
            `}
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {[
            { icon: FaHome, label: 'Forest View', path: '/' },
            { icon: FaChartBar, label: 'Emotion Logs', path: '/logs' },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center space-x-3 p-3 rounded-lg
                ${isActive(item.path)
                  ? isDarkMode 
                    ? 'bg-gray !text-white' 
                    : 'bg-gray !text-gray-900'
                  : isDarkMode 
                    ? '!text-gray-300 hover:bg-gray hover:!text-white' 
                    : '!text-gray-700 hover:bg-gray hover:!text-gray-900'
                }
              `}
            >
              <item.icon className="text-xl" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Theme Toggle */}
        <div className={`
          absolute bottom-0 left-0 right-0
          p-4
          border-t
          ${isDarkMode ? 'border-gray' : 'border-gray-200'}
        `}>
          <button 
            onClick={onThemeToggle}
            className={`
              w-full flex items-center space-x-3 p-3 rounded-lg
              ${isDarkMode 
                ? 'text-gray -300 hover:bg-gray hover:text-white' 
                : 'text-gray -700 hover:bg-gray hover:text-gray -900'
              }
            `}
          >
            {isDarkMode ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
            <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
          onClick={onToggle}
        />
      )}
    </>
  );
};

export default Sidebar; 