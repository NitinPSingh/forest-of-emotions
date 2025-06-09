import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { API_BASE_URL } from '../config/api';

const ITEMS_PER_PAGE = 10; // Hardcoded items per page

const EmotionLogs = ({ isDarkMode }) => {
  const [logs, setLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, [currentPage]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/emotion-logs?page=${currentPage}&limit=${ITEMS_PER_PAGE}`
      );
      const data = await response.json();
      setLogs(data.data || []);
      setTotalItems(data.pagination.totalRecords || 0);
      setTotalPages(data.pagination.totalPages || 1);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Emotion Logs
      </h1>
      
      {loading ? (
        <div className={`text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Loading...
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className={`min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              <thead className={isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}>
                <tr>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Date
                  </th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Email Subject
                  </th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Emotion
                  </th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700 bg-gray-900' : 'divide-gray-200 bg-white'}`}>
                {logs.map((log) => (
                  <tr key={log.id} className={isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}>
                    <td className={`px-6 py-4 whitespace-nowrap  text-left text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-900'
                    }`}>
                      {format(new Date(log.createdAt), 'MMM d, yyyy HH:mm')}
                    </td>
                    <td className={`px-6 py-4 text-left text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-900'
                    }`}>
                      <div className="max-w-md text-left">
                        <p className="font-medium">{log.emailSubject || 'N/A'}</p>
                        {/* <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {log.emailBody ? log.emailBody.substring(0, 100) + '...' : 'No content'}
                        </p> */}
                      </div>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-left ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-900'
                    }`}>
                      <span className={`px-2 py-1 rounded-full text-xs text-left font-medium ${
                        isDarkMode 
                          ? 'bg-blue-900 text-blue-200' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {log.emotion}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link
                        to={`/logs/${log.id}`}
                        className={`text-blue-500 hover:text-blue-700 ${
                          isDarkMode ? 'text-blue-400 hover:text-blue-300' : ''
                        }`}
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="mt-4 flex justify-between items-center">
            <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} of {totalItems} entries
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  isDarkMode
                    ? 'bg-gray-800 text-white disabled:bg-gray-700 disabled:text-gray-400'
                    : 'bg-gray-200 text-gray-900 disabled:bg-gray-100 disabled:text-gray-400'
                }`}
              >
                Previous
              </button>
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  isDarkMode
                    ? 'bg-gray-800 text-white disabled:bg-gray-700 disabled:text-gray-400'
                    : 'bg-gray-200 text-gray-900 disabled:bg-gray-100 disabled:text-gray-400'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EmotionLogs;