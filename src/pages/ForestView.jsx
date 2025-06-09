import React, { useState, useEffect } from 'react';
import Month3DView from '../components/Month3DView';
import CalendarForest from '../components/CalendarForest';
import LogCard from '../components/LogCard';
import { format } from 'date-fns';
import { API_BASE_URL } from '../config/api';

const ForestView = ({ isDarkMode }) => {
  const [activeView, setActiveView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [forestData, setForestData] = useState([]);
  const [forestLoading, setForestLoading] = useState(true);
  const [selectedTree, setSelectedTree] = useState(null);
  const [logs,setLogs] = useState([])
 const [summaryLogs,setSummaryLogs] = useState([])
  
  useEffect(() => {
    fetchForestData();
  }, [activeView, currentDate]);

  
  useEffect(() => {
    fetchSummary();
  }, [currentDate]);

  const calculateEmotionSummary = (logs) => {
    if (!logs || logs.length === 0) return null;

    
    const emotionCounts = logs.reduce((acc, log) => {
      acc[log.emotion] = (acc[log.emotion] || 0) + 1;
      return acc;
    }, {});

    
    const predominantEmotion = Object.entries(emotionCounts)
      .sort(([, a], [, b]) => b - a)[0];

    
    const totalEmotions = Object.values(emotionCounts).reduce((a, b) => a + b, 0);

    return {
      emotion: predominantEmotion[0],
      intensity: Math.round((predominantEmotion[1] / totalEmotions) * 100),
      emotions: emotionCounts,
      totalEmotions
    };
  };

  const processDataForView = (data, viewType) => {
    if (!data) return [];
    
    switch (viewType) {
      case 'day':
        
        return data.map((log, index) => ({
          ...log,
          position: {
            row: 0,
            col: index
          }
        }));
      
      case 'week':
        
        return data.map(log => {
          const date = new Date(log.createdAt);
          const dayOfWeek = date.getDay(); 
          const timeOfDay = date.getHours();
          return {
            ...log,
            position: {
              row: Math.floor(timeOfDay / 4), 
              col: dayOfWeek
            }
          };
        });
      
      case 'month':
        
        return data.map(log => {
          const date = new Date(log.createdAt);
          const { row, col } = calculateGridPosition(date);
          return {
            ...log,
            position: { row, col }
          };
        });
      
      default:
        return data;
    }
  };

  const fetchForestData = async () => {
    try {
      setForestLoading(true);
      const { start, end } = getDateRange(activeView);
      //console.log("called 1")
      const response = await fetch(
        activeView == "day" ? `${API_BASE_URL}/metrics/all-emotions?startTime=${start.toISOString()}&endTime=${end.toISOString()}`:`${API_BASE_URL}/metrics/predominant-emotion?startTime=${start.toISOString()}&endTime=${end.toISOString()}`
      );
      
      const data = await response.json();
      setLogs(data);
      
      
      const processedData = processDataForView(data, activeView);
      setForestData(processedData);
      
      
      const summary = calculateEmotionSummary(data);
      setSummary(summary);
    } catch (error) {
      console.error('Error fetching forest data:', error);
    } finally {
      setForestLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      setLoading(true);
     // console.log("called 2")
      const now = currentDate || new Date();
      const startTime = new Date(now);
      startTime.setHours(0, 0, 0, 0);
  
      const endTime = new Date(startTime);
      endTime.setDate(endTime.getDate() + 1); // +1 day
  
      const response = await fetch(
        `${API_BASE_URL}/metrics/all-emotions?startTime=${startTime.toISOString()}&endTime=${endTime.toISOString()}`
      );
      const data = await response.json();
      setSummaryLogs(data);
  
      if (data && data.length > 0) {
        const emotionCounts = data.reduce((acc, item) => {
          acc[item.emotion] = (acc[item.emotion] || 0) + item.count;
          return acc;
        }, {});
  
        const predominantEmotion = Object.entries(emotionCounts)
          .sort(([, a], [, b]) => b - a)[0];
  
        const totalEmotions = Object.values(emotionCounts).reduce((a, b) => a + b, 0);
  
        setSummary({
          emotion: predominantEmotion[0],
          intensity: Math.round((predominantEmotion[1] / totalEmotions) * 100),
          emotions: emotionCounts,
          totalEmotions,
          examples: data.map(item => item.exampleEmailSubject).filter(Boolean),
        });
      } else {
        setSummary(null);
      }
    } catch (error) {
      console.error('Error fetching summary:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const getDateRange = (view) => {
    const start = new Date(currentDate);
    const end = new Date(currentDate);

    switch (view) {
      case 'day':
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'week':
        start.setDate(start.getDate() - start.getDay());
        start.setHours(0, 0, 0, 0);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        break;
      case 'month':
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(end.getMonth() + 1);
        end.setDate(0);
        end.setHours(23, 59, 59, 999);
        break;
      default:
        break;
    }

    return { start, end };
  };

  const handleDateSelect = (date) => {
    setCurrentDate(new Date(date));
  };

  const handleTreeSelect = async (tree) => {
    setSelectedTree(tree);
    
    
    const date = new Date(tree.createdAt);
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/metrics/all-emotions?startTime=${startDate.toISOString()}&endTime=${endDate.toISOString()}`
      );
      const data = await response.json();
      setLogs(data);
      
      
      const summary = calculateEmotionSummary(data);
      setSummary(summary);
    } catch (error) {
      console.error('Error fetching summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEmotionColor = (emotion) => {
    const colors = {
      joy: 'rgba(255, 223, 0, 0.1)',      
      trust: 'rgba(0, 128, 0, 0.1)',      
      fear: 'rgba(128, 0, 128, 0.1)',     
      surprise: 'rgba(255, 165, 0, 0.1)', 
      sadness: 'rgba(0, 0, 255, 0.1)',    
      disgust: 'rgba(128, 0, 0, 0.1)',    
      anger: 'rgba(255, 0, 0, 0.1)',      
      anticipation: 'rgba(255, 192, 203, 0.1)', 
      neutral: 'rgba(128, 128, 128, 0.1)' 
    };
    return colors[emotion] || 'rgba(128, 128, 128, 0.1)';
  };

  const calculateGridPosition = (date) => {
    const day = date.getDate();
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const startingDay = firstDayOfMonth.getDay(); 
    
    
    const position = day + startingDay - 1;
    const row = Math.floor(position / 6);
    const col = position % 6;
    
    return { row, col };
  };

  return (
    <div className="p-6 h-screen flex gap-6">
      {/* Main Forest View */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h1 className={`!text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Forest of Emotions
          </h1>
          <div className="flex justify-center items-center space-x-4 ">
            <button
              onClick={() => setActiveView('day')}
              disabled={activeView === 'day'}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                activeView === 'day'
                  ? 'bg-blue-600 text-white cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Day View
            </button>
            <button
              onClick={() => setActiveView('week')}
              disabled={activeView === 'week'}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                activeView === 'week'
                  ? 'bg-blue-600 text-white cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Week View
            </button>
            <button
              onClick={() => setActiveView('month')}
              disabled={activeView === 'month'}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                activeView === 'month'
                  ? 'bg-blue-600 text-white cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Month View
            </button>
          </div>
        </div>
        <div className="flex-1">
          {forestLoading ? (
            <div className={`flex items-center justify-center h-full ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Loading...
            </div>
          ) : (
            <Month3DView 
              isDarkMode={isDarkMode} 
              data={forestData}
              viewType={activeView}
              onDateSelect={handleDateSelect}
              onTreeSelect={handleTreeSelect}
              currentDate={currentDate}
            />
          )}
        </div>
      </div>

      {/* Summary Section */}
      <div className={`w-80 p-4 rounded-lg ${
        isDarkMode ? 'bg-gray' : 'bg-white'
      } shadow-lg`}>
        {selectedTree ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {format(new Date(selectedTree.createdAt), 'MMMM d, yyyy')} Summary
              </h2>
              <button
                onClick={() => {
                  setSelectedTree(null);
                  fetchSummary();
                }}
                className={`
                  p-2 rounded-full
                  ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
                `}
              >
                ✕
              </button>
            </div>
            {loading ? (
              <div className={`text-center py-4 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Loading...
              </div>
            ) : summary ? (
              <div className="space-y-4">
                <div>
                  <h3 className={`text-sm font-medium mb-1 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Predominant Emotion
                  </h3>
                  <p className={`text-lg font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {summary.emotion}
                  </p>
                </div>
                <div>
                  <h3 className={`text-sm font-medium mb-1 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Intensity
                  </h3>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${summary.intensity}%` }}
                    ></div>
                  </div>
                  <p className={`text-sm mt-1 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {summary.intensity}%
                  </p>
                </div>
                <div>
                  <h3 className={`text-sm font-medium mb-1 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Emotion Distribution
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(summary.emotions).map(([emotion, count]) => (
                      <div key={emotion} className="flex justify-between items-center">
                        <span className={`text-sm ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {emotion}
                        </span>
                        <span className={`text-sm ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {Math.round((count / summary.totalEmotions) * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className={`text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Daily Logs
                  </h3>
                  <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2">
                    {summaryLogs.map((log) => (
                      <LogCard key={log.id} log={log} isDarkMode={isDarkMode} />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className={`text-center py-4 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                No data available for this date
              </div>
            )}
          </>
        ) : (
          <>
            <h2 className={`text-xl font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {currentDate.toLocaleDateString()} Summary
            </h2>
            {loading ? (
              <div className={`text-center py-4 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Loading...
              </div>
            ) : summary ? (
              <div className="space-y-4">
                <div>
                  <h3 className={`text-sm font-medium mb-1 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Predominant Emotion
                  </h3>
                  <p className={`text-lg font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {summary.emotion}
                  </p>
                </div>
                <div>
                  <h3 className={`text-sm font-medium mb-1 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Intensity
                  </h3>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${summary.intensity}%` }}
                    ></div>
                  </div>
                  <p className={`text-sm mt-1 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {summary.intensity}%
                  </p>
                </div>
                <div>
                  <h3 className={`text-sm font-medium mb-1 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Emotion Distribution
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(summary.emotions).map(([emotion, count]) => (
                      <div key={emotion} className="flex justify-between items-center">
                        <span className={`text-sm ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {emotion}
                        </span>
                        <span className={`text-sm ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {Math.round((count / summary.totalEmotions) * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className={`text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Daily Logs
                  </h3>
                  <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2">
                    {summaryLogs.map((log) => (
                      <LogCard key={log.id} log={log} isDarkMode={isDarkMode} />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className={`text-center py-4 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                No data available for this date
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ForestView; 