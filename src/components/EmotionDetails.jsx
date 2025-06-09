import React from 'react';
import { format } from 'date-fns';

const EmotionDetails = ({ emotionLogs, isDarkMode, viewTitle }) => {
  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-r ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} overflow-y-auto`}>
      <div className="p-6">
        <div className="mb-6">
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {viewTitle}
          </h3>
          <div className="space-y-6">
            {emotionLogs.map((log, index) => (
              <div 
                key={index} 
                className={`rounded-lg ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-gray-50 hover:bg-gray-100'
                } transition-colors duration-200`}
              >
                {/* Email Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img 
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${log.emailSubject}`} 
                          alt={log.emailSubject}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {log.fromName || 'Unknown Sender'}
                        </h4>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {log.fromEmail || 'No email address'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isDarkMode 
                          ? 'bg-blue-900 text-blue-200' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {log.emotion}
                      </span>
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {format(new Date(log.createdAt), 'MMM d, yyyy HH:mm')}
                      </span>
                    </div>
                  </div>
                  <h3 className={`text-lg font-semibold mt-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {log.emailSubject || 'No Subject'}
                  </h3>
                </div>

                {/* Email Body */}
                <div className="p-4">
                  <div className={`prose ${isDarkMode ? 'prose-invert' : ''} max-w-none`}>
                    <div className={`whitespace-pre-wrap ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {log.emailBody || 'No content available'}
                    </div>
                  </div>
                </div>

                {/* Email Footer */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between">
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      To: {log.toEmail || 'No recipient'}
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Message ID: {log.messageId || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmotionDetails; 