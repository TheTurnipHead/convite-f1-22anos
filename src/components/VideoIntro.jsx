import React, { useState, useRef } from 'react';
import videoF1 from '../assets/intro.mp4';

export default function VideoIntro({ onFinish }) {
  const [hasStarted, setHasStarted] = useState(false);
  const [isIgniting, setIsIgniting] = useState(false);
  const videoRef = useRef(null);
  const introMotorRef = useRef(null); // Referência para o som do motor na intro

  const handleStart = async () => {
    if (isIgniting) return; 
    setIsIgniting(true);
    
    // Toca o som do motor assim que aperta
    if (introMotorRef.current) {
      introMotorRef.current.play().catch(e => console.log("Áudio do motor não encontrado."));
    }
    
    // Tenta forçar a tela cheia
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      } else if (document.documentElement.webkitRequestFullscreen) { /* Safari */
        await document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) { /* IE11 */
        await document.documentElement.msRequestFullscreen();
      }
    } catch (e) {
      console.log("O navegador bloqueou o Fullscreen automático:", e);
    }
    
    setTimeout(() => {
      setHasStarted(true);
    }, 2000);
  };

  if (!hasStarted) {
    return (
      <div className="fixed inset-0 z-50 bg-[#050505] flex flex-col items-center justify-center select-none overflow-hidden">
        
        {/* Áudio escondido do Motor */}
        <audio ref={introMotorRef} src="/motor.mp3" />

        <p className="text-gray-500 font-mono text-[10px] md:text-sm mb-16 tracking-[0.3em] uppercase">
          {isIgniting ? 'Iniciando telemetria...' : 'System ready. Press to ignite.'}
        </p>

        <div className="relative p-[6px] md:p-[8px] rounded-full bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600 shadow-[0_15px_35px_rgba(0,0,0,0.8),inset_0_-2px_5px_rgba(0,0,0,0.5)]">
          
          <button 
            onClick={handleStart}
            disabled={isIgniting}
            className="relative w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-b from-[#1a1a1a] via-[#0d0d0d] to-black flex flex-col items-center justify-center shadow-[inset_0_-8px_20px_rgba(0,0,0,1)] transition-all cursor-pointer overflow-hidden group border-[1px] border-black"
          >
            <div 
              className={`absolute w-[120px] h-[120px] md:w-[184px] md:h-[184px] rounded-full border-[6px] md:border-[8px] transition-all duration-700 ease-in-out pointer-events-none
                ${isIgniting 
                  ? 'border-petronas shadow-[0_0_30px_#00A19B,inset_0_0_30px_#00A19B]' 
                  : 'border-[#ff1a1a] shadow-[0_0_20px_#ff1a1a,inset_0_0_20px_#ff1a1a] group-hover:shadow-[0_0_40px_#ff1a1a,inset_0_0_40px_#ff1a1a] group-hover:border-[#ff3333]'}
              `}
            ></div>

            <div className="absolute top-0 w-full h-[45%] bg-gradient-to-b from-white/10 to-transparent rounded-t-full pointer-events-none"></div>

            <div className={`relative z-10 flex flex-col items-center justify-center font-bold font-sans tracking-wide transition-colors duration-700
              ${isIgniting 
                ? 'text-petronas drop-shadow-[0_0_8px_#00A19B]' 
                : 'text-[#ff1a1a] drop-shadow-[0_0_8px_#ff1a1a] group-hover:text-[#ff3333] group-hover:drop-shadow-[0_0_12px_#ff3333]'}
            `}>
              <span className="text-[18px] md:text-[26px] leading-none mb-1">ENGINE</span>
              <span className="text-[20px] md:text-[28px] leading-none">START</span>
              
              <div className={`w-[60px] md:w-[90px] h-[2px] my-1.5 md:my-2 transition-colors duration-700
                ${isIgniting ? 'bg-petronas shadow-[0_0_5px_#00A19B]' : 'bg-[#ff1a1a] shadow-[0_0_5px_#ff1a1a] group-hover:bg-[#ff3333]'}
              `}></div>
              
              <span className="text-[18px] md:text-[26px] leading-none">STOP</span>
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden select-none">
      <video
        ref={videoRef}
        className="w-full h-full object-cover pointer-events-none"
        autoPlay
        playsInline
        onEnded={onFinish}
      >
        <source src={videoF1} type="video/mp4" />
      </video>
    </div>
  );
}