import React from 'react';

const EmptyChatContainer = () => {
  return (
    <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-gray-200 dark:bg-gray-800">
      <div className="text-center p-4 sm:p-6 max-w-md">
        <div className="mb-4 sm:mb-6">
          <div className="text-4xl sm:text-5xl mb-2">💬</div>
          <h3 className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-gray-200">
            <span className="text-teal-600 dark:text-teal-400">Chater</span> Web Chat App
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
            Your seamless communication starts here.
          </p>
        </div>
        
        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 mt-2 sm:mt-4">
          <p>Select a chat or start a new conversation</p>
        </div>
      </div>
    </div>
  );
};

export default EmptyChatContainer;