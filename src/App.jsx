import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ForestView from './pages/ForestView';
import EmotionLogs from './pages/EmotionLogs';
import EmotionLogDetail from './pages/EmotionLogDetail';
import './App.css';

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`
      min-h-screen min-w-screen
      ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}
    `}>
      <Sidebar 
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isDarkMode={isDarkMode}
        onThemeToggle={() => setIsDarkMode(!isDarkMode)}
      />

      <main className={`
        transition-all duration-300
        ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}
        lg:ml-64
      `}>
        <Routes>
          <Route path="/" element={<ForestView isDarkMode={isDarkMode} />} />
          <Route path="/logs" element={<EmotionLogs isDarkMode={isDarkMode} />} />
          <Route path="/logs/:id" element={<EmotionLogDetail isDarkMode={isDarkMode} />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
