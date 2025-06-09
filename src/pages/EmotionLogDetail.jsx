import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { API_BASE_URL } from '../config/api';

const EmotionLogDetail = ({ isDarkMode }) => {
  const { id } = useParams();
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogDetail();
  }, [id]);

  const fetchLogDetail = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/emotion-logs/${id}`);
      const data = await response.json();
      setLog(data);
    } catch (error) {
      console.error('Error fetching log detail:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className={`text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Loading...
        </div>
      </div>
    );
  }

  if (!log) {
    return (
      <div className="p-6">
        <div className={`text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Log not found
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className={`!text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {log.emailSubject}
        </h1>
        <Link
          to="/logs"
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            isDarkMode
              ? 'bg-gray-700 text-white hover:bg-gray-600'
              : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
          }`}
        >
          Back to Logs
        </Link>
      </div>

      <div className={`rounded-lg border ${isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'}`}>
        {/* Gmail-style header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-2">
                <h2 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {log.fromName || 'Unknown Sender'}
                </h2>
                <span className={`px-2 py-1 text-xs rounded-full ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                  {log.emotion}
                </span>
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {log.fromEmail}
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                to {log.toEmail}
              </div>
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {format(new Date(log.date || log.createdAt), 'MMM d, yyyy h:mm a')}
            </div>
          </div>
        </div>

        {/* Gmail-style body */}
        <div className="p-4">
          <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-900'} whitespace-pre-wrap font-sans leading-relaxed text-left`}>
            {log.emailBody}
          </div>
        </div>

        {/* Analysis if available */}
        {log.analysis && (
          <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} p-4`}>
            <h3 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Emotion Analysis
            </h3>
            <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <div className="mb-4">
                <div className="font-medium mb-1">Primary Emotion:</div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                    {log.analysis[0]?.label || 'unknown'}
                  </span>
                  <span className="text-xs opacity-75">
                    Confidence: {((log.analysis[0]?.score || 0) * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
              
              <div>
                <div className="font-medium mb-1">All Detected Emotions:</div>
                <div className="grid grid-cols-2 gap-2">
                  {log.analysis.map((item, index) => (
                    <div key={index} className={`flex justify-between items-center p-2 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                      <span>{item.label}</span>
                      <span className="text-xs opacity-75">
                        {((item.score || 0) * 100).toFixed(2)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmotionLogDetail;