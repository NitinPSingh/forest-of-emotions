import React from 'react';
import { format } from 'date-fns';

const TreeSummary = ({ selectedTree, isDarkMode, onClose }) => {
  if (!selectedTree) return null;

  return (
    <div className={`
      fixed right-0 top-0 h-full w-80
      transform transition-transform duration-300 ease-in-out
      ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
      shadow-lg z-40
    `}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className={`
            text-lg font-semibold
            ${isDarkMode ? 'text-white' : 'text-gray -800'}
          `}>
            Emotion Details
          </h3>
          <button
            onClick={onClose}
            className={`
              p-2 rounded-full
              ${isDarkMode ? 'text-gray -400 hover:text-white' : 'text-gray -500 hover:text-gray -800'}
            `}
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className={`
              text-sm font-medium mb-1
              ${isDarkMode ? 'text-gray -300' : 'text-gray -600'}
            `}>
              Email Subject
            </h4>
            <p className={`
              text-base
              ${isDarkMode ? 'text-white' : 'text-gray -800'}
            `}>
              {selectedTree.emailSubject}
            </p>
          </div>

          <div>
            <h4 className={`
              text-sm font-medium mb-1
              ${isDarkMode ? 'text-gray -300' : 'text-gray -600'}
            `}>
              Emotion
            </h4>
            <p className={`
              text-base capitalize
              ${isDarkMode ? 'text-white' : 'text-gray -800'}
            `}>
              {selectedTree.emotion}
            </p>
          </div>

          <div>
            <h4 className={`
              text-sm font-medium mb-1
              ${isDarkMode ? 'text-gray -300' : 'text-gray -600'}
            `}>
              Date
            </h4>
            <p className={`
              text-base
              ${isDarkMode ? 'text-white' : 'text-gray -800'}
            `}>
              {format(new Date(selectedTree.createdAt), 'MMMM d, yyyy')}
            </p>
          </div>

          {selectedTree.intensity && (
            <div>
              <h4 className={`
                text-sm font-medium mb-1
                ${isDarkMode ? 'text-gray -300' : 'text-gray -600'}
              `}>
                Intensity
              </h4>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${selectedTree.intensity * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TreeSummary; 