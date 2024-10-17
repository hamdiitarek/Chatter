import React from 'react';

const EmptyChatContainer = () => {
  return (
    <div className="absolute top-0 left-[35vw] lg:left-[30vw] xl:left-[25vw] w-[65vw] lg:w-[70vw] xl:w-[75vw] h-screen bg-neutral-50 flex flex-col items-center justify-center"> 
      {/* Changed position, left, and width, and bg-white */}
      <div>
        {/* Text Below the Animation */}
        <div className="text-black text-center mt-4"> {/* Changed text color */}
          <h3 className="text-lg font-medium">
            <span className="text-teal-500">Chater</span> Web Chat App
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            Your seamless communication starts here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmptyChatContainer;