import React from 'react';

export const LoadingAnimation: React.FC = () => {
  return (
    <div className="relative w-40 h-40">
      <div className="animate-orbit w-full h-full">
        {/* Satellites */}
        <div className="absolute top-0 left-1/2 -ml-2 w-4 h-4 rounded-full bg-purple-500 satellite" style={{ animationDelay: '0s' }}></div>
        <div className="absolute bottom-[-5%] left-[15%] w-4 h-4 rounded-full bg-cyan-400 satellite" style={{ animationDelay: '0.3s' }}></div>
        <div className="absolute bottom-[-5%] right-[15%] w-4 h-4 rounded-full bg-purple-500 satellite" style={{ animationDelay: '0.6s' }}></div>
      </div>
      {/* Central Core */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-16 h-16 bg-cyan-500 rounded-full animate-pulse-core shadow-[0_0_35px_10px] shadow-cyan-500/50"></div>
      </div>
    </div>
  );
};