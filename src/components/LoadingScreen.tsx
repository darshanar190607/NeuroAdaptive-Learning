
import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <>
      <style>{`
        @keyframes clockwise { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes counter-clockwise { 0% { transform: rotate(0deg); } 100% { transform: rotate(-360deg); } }
      `}</style>
      <div className="flex flex-col justify-center items-center h-screen bg-gray-900 font-sans">
        <div className="relative h-[150px] w-[200px] bg-[#111] rounded-lg shadow-[0px_0px_0px_1px_rgba(255,255,255,0.1)] overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full rounded-lg z-10 shadow-[inset_0px_0px_20px_black] transition-colors duration-200"></div>
          
          <div className="gear one absolute h-[60px] w-[60px] shadow-[0px_-1px_0px_0px_#888,0px_1px_0px_0px_black] rounded-[30px] top-[12px] left-[10px]">
            <div className="gear-inner relative h-full w-full bg-[#3b82f6] rounded-[30px] border border-solid border-[rgba(255,255,255,0.1)] animate-[counter-clockwise_3s_infinite_linear]">
              <div className="bar"></div><div className="bar"></div><div className="bar"></div>
            </div>
          </div>
          <div className="gear two absolute h-[60px] w-[60px] shadow-[0px_-1px_0px_0px_#888,0px_1px_0px_0px_black] rounded-[30px] top-[61px] left-[60px]">
            <div className="gear-inner relative h-full w-full bg-[#8b5cf6] rounded-[30px] border border-solid border-[rgba(255,255,255,0.1)] animate-[clockwise_3s_infinite_linear]">
              <div className="bar"></div><div className="bar"></div><div className="bar"></div>
            </div>
          </div>
          <div className="gear three absolute h-[60px] w-[60px] shadow-[0px_-1px_0px_0px_#888,0px_1px_0px_0px_black] rounded-[30px] top-[110px] left-[10px]">
            <div className="gear-inner relative h-full w-full bg-[#ec4899] rounded-[30px] border border-solid border-[rgba(255,255,255,0.1)] animate-[counter-clockwise_3s_infinite_linear]">
              <div className="bar"></div><div className="bar"></div><div className="bar"></div>
            </div>
          </div>
          <div className="gear four large absolute h-[120px] w-[120px] shadow-[0px_-1px_0px_0px_#888,0px_1px_0px_0px_black] rounded-[60px] top-[13px] left-[128px]">
            <div className="gear-inner relative h-full w-full bg-purple-500 rounded-[60px] border border-solid border-[rgba(255,255,255,0.1)] animate-[counter-clockwise_6s_infinite_linear]">
              <div className="bar"></div><div className="bar"></div><div className="bar"></div><div className="bar"></div><div className="bar"></div><div className="bar"></div>
            </div>
          </div>
          
          <div className="gear:after"></div>
          <div className="gear.large:after"></div>
          
          <style jsx="true">{`
            .gear:after { content: ""; position: absolute; height: 36px; width: 36px; border-radius: 36px; background: #111; top: 50%; left: 50%; margin-left: -18px; margin-top: -18px; z-index: 3; box-shadow: 0px 0px 10px rgba(255,255,255,0.1), inset 0px 0px 10px rgba(0,0,0,0.1), inset 0px 2px 0px 0px #090909, inset 0px -1px 0px 0px #888; }
            .gear.large:after { height: 96px; width: 96px; border-radius: 48px; margin-left: -48px; margin-top: -48px; }
            .gear-inner .bar { background: #555; height: 16px; width: 76px; position: absolute; left: 50%; margin-left: -38px; top: 50%; margin-top: -8px; border-radius: 2px; border-left: 1px solid rgba(255,255,255,0.1); border-right: 1px solid rgba(255,255,255,0.1); }
            .large .gear-inner .bar { margin-left: -68px; width: 136px; }
            .gear-inner .bar:nth-child(2) { transform: rotate(60deg); }
            .gear-inner .bar:nth-child(3) { transform: rotate(120deg); }
            .gear-inner .bar:nth-child(4) { transform: rotate(90deg); }
            .gear-inner .bar:nth-child(5) { transform: rotate(30deg); }
            .gear-inner .bar:nth-child(6) { transform: rotate(150deg); }
          `}</style>
        </div>
        <h1 className="text-2xl font-bold text-gray-300 mt-6 tracking-widest">NeuroBright</h1>
        <p className="text-gray-500">Initializing BCI Interface...</p>
      </div>
    </>
  );
};

export default LoadingScreen;

