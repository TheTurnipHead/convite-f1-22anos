import React, { useState, useRef, useEffect } from 'react';

// =========================================================================
// IMPORTAÇÕES
// =========================================================================
import f1Logo from '../assets/f1-logo.png'; 
import bgCountdown from '../assets/176320.png';  

const radioData = [
  { id: 1, src: '/radio1.mp3', text: "BOX, BOX, BOX. CONFIRME O SEU SETUP E VENHA DIRETO PARA O PITLANE! TEMOS PREVISÃO DE PISTA CHEIA PARA O EVENTO. CONFIRME O RECEBIMENTO DA MENSAGEM. CAMBIO!" },
  { id: 2, src: '/radio2.mp3', text: "AVISO DA DIREÇÃO DE PROVA! MODO FESTA: ATIVADO! REPITO: ENGINE MODE - PARTY. IT'S HAMMER TIME! TRAGA SUA PARCEIRA PARA O STINT MAIS LONGO DA NOITE. HAHA!" },
  { id: 3, src: '/radio3.mp3', text: "TRACK CONDITIONS ESTÃO PERFEITAS! O NIVEL DE ADERÊNCIA ESTÁ ALTO E O REABASTECIMENTO DE COMBUSTÍVEL ESTÁ TOTALMENTE LIBERADO NO PADDOCK. PIZZA, BOLO E BEBIDAS INCLUSAS! PUSH NOW! AGUARDAMOS VOCÊ NO GRID" },
  { id: 4, src: '/radio-static.mp3', text: "CZSSSHHH... [ SINAL DE RÁDIO INTERMITENTE - COMUNICAÇÃO ENCERRADA ] ...CZSSSHHH" }
];

export default function PainelTelemetria() {
  const [rsvpConfirmed, setRsvpConfirmed] = useState(false);
  const [radioActive, setRadioActive] = useState(false);
  const [currentRadioIndex, setCurrentRadioIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  const audioRef = useRef(null);       
  const bgMusicRef = useRef(null);     
  const motorAudioRef = useRef(null);

  // =========================================================================
  // MÚSICA AUTOMÁTICA AO CARREGAR A TELA
  // =========================================================================
  useEffect(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = 0.15; 
      
      const playPromise = bgMusicRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsMusicPlaying(true);
          })
          .catch((error) => {
            console.log("Auto-play bloqueado ou ficheiro de áudio ausente ainda.");
          });
      }
    }
  }, []);

  // Lógica do Temporizador
  useEffect(() => {
    const targetDate = new Date('2026-10-11T18:30:00');
    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Efeito Máquina de Escrever pro Rádio
  useEffect(() => {
    let timeout;
    if (radioActive) {
      setDisplayedText('');
      const fullText = radioData[currentRadioIndex].text;
      let i = 0;
      const typeWriter = () => {
        if (i < fullText.length) {
          setDisplayedText(fullText.slice(0, i + 1));
          i++;
          timeout = setTimeout(typeWriter, 75);
        }
      };
      typeWriter();
    } else {
      setDisplayedText('');
    }
    return () => clearTimeout(timeout);
  }, [radioActive, currentRadioIndex]);

  // =========================================================================
  // CONTROLOS DE ÁUDIO
  // =========================================================================
  const toggleBgMusic = () => {
    if (isMusicPlaying) {
      bgMusicRef.current.pause();
      setIsMusicPlaying(false);
    } else {
      bgMusicRef.current.play().catch(e => console.log("Áudio de fundo não encontrado."));
      setIsMusicPlaying(true);
    }
  };

  const handleRadioClick = () => {
    if (radioActive) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setRadioActive(false);
      if (isMusicPlaying && bgMusicRef.current) bgMusicRef.current.play();
    } else {
      setRadioActive(true);
      if (isMusicPlaying && bgMusicRef.current) bgMusicRef.current.pause();
      if (audioRef.current) {
        audioRef.current.play().catch(e => console.log("Áudio do rádio não encontrado."));
      }
    }
  };

  const handleAudioEnded = () => {
    setRadioActive(false);
    setCurrentRadioIndex((prevIndex) => (prevIndex < radioData.length - 1 ? prevIndex + 1 : prevIndex));
    if (isMusicPlaying && bgMusicRef.current) bgMusicRef.current.play();
  };

  const handleRSVP = () => {
    setRsvpConfirmed(true);
    
    // Pausa a música suavemente para o motor reinar
    if (isMusicPlaying && bgMusicRef.current) bgMusicRef.current.pause();
    
    if (motorAudioRef.current) {
      motorAudioRef.current.currentTime = 0;
      motorAudioRef.current.play().catch(e => console.log("Áudio do motor não encontrado."));
    }
  };

  // Função disparada quando o som do motor TERMINA
  const handleMotorEnded = () => {
    // A música volta a tocar de fundo!
    if (isMusicPlaying && bgMusicRef.current) {
      bgMusicRef.current.play().catch(e => console.log("Erro ao retomar música."));
    }
  };

  const getBoxMessage = () => {
    if (currentRadioIndex === 0) return "[ ! ] 3 NOVAS MENSAGENS DO BOX";
    if (currentRadioIndex === 1) return "[ ! ] 2 NOVAS MENSAGENS DO BOX";
    if (currentRadioIndex === 2) return "[ ! ] 1 NOVA MENSAGEM DO BOX";
    return "[ ! ] SEM MENSAGENS";
  };

  return (
    <div className="w-full h-[100dvh] bg-[#050505] overflow-hidden relative font-mono select-none">
      
      <div className="absolute top-2 left-2 text-gray-700 text-[10px] z-50 pointer-events-none">
        [v22.0] AUDIO_FIXED
      </div>

      <style>{`
        @keyframes waveform { 0%, 100% { height: 10%; } 50% { height: 100%; } }
        .animate-wave { animation: waveform ease-in-out infinite; }
        
        @keyframes logo-glow {
          0%, 100% { filter: drop-shadow(0 0 3px rgba(0,161,155,0.5)); transform: scale(1); }
          50% { filter: drop-shadow(0 0 15px rgba(0,161,155,1)); transform: scale(1.01); }
        }
        .animate-logo-glow { animation: logo-glow 3s ease-in-out infinite; }
        
        @keyframes blink-red {
          0%, 100% { opacity: 0.2; box-shadow: none; }
          50% { opacity: 1; box-shadow: 0 0 12px #ef4444; }
        }
        .animate-red-light { animation: blink-red 2s infinite; }
        
        @keyframes rain-drop {
          0% { transform: translateY(-5px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(10px); opacity: 0; }
        }
        .animate-rain { animation: rain-drop 1s linear infinite; }
        @keyframes lightning {
          0%, 90%, 100% { opacity: 0; }
          95% { opacity: 1; filter: drop-shadow(0 0 10px #00A19B); }
        }
        .animate-lightning { animation: lightning 4s infinite; }
      `}</style>

      {/* ÁUDIOS */}
      <audio ref={audioRef} src={radioData[currentRadioIndex].src} onEnded={handleAudioEnded} />
      <audio ref={bgMusicRef} src="/music.mp3" loop />
      <audio ref={motorAudioRef} src="/motor.mp3" onEnded={handleMotorEnded} />

      {/* BACKGROUND */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:40px_40px] md:bg-[size:60px_60px] pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/4 w-[50vh] h-[50vh] bg-petronas/10 rounded-full blur-[100px] pointer-events-none"></div>


      {/* ========================================================= */}
      {/* ===================== ÁREA SUPERIOR ===================== */}
      {/* ========================================================= */}

      {/* 1. LADO ESQUERDO: PAINEL TELEMETRIA */}
      <div className="absolute top-[4vh] left-[2vw] md:left-[4vw] z-20 flex flex-col w-[22vw] md:w-[220px] bg-[#0a0a0a]/80 backdrop-blur-md border border-gray-800 rounded-lg overflow-hidden shadow-[0_0_20px_rgba(0,161,155,0.15)]">
        
        <div className="flex flex-col bg-gradient-to-r from-[#111] to-gray-900 border-l-[3px] border-petronas py-3 px-2 md:py-5 md:px-3 gap-2">
          <div className="flex flex-col">
             <span className="text-gray-500 text-[clamp(7px,1vh,9px)] tracking-[0.2em] uppercase">Track Meteo</span>
             <span className="text-white font-bold text-[clamp(8px,1.6vh,16px)] tracking-widest mt-0.5">WET <span className="text-petronas">// 24°C</span></span>
          </div>
          
          <div className="flex items-center gap-1.5 md:gap-2">
             <div className="relative w-[clamp(14px,2.5vh,26px)] h-[clamp(14px,2.5vh,26px)]">
                <svg className="absolute inset-0 text-petronas drop-shadow-[0_0_5px_#00A19B]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.5 9.5c0-2.48-2.02-4.5-4.5-4.5-.96 0-1.85.3-2.58.82C10.74 4.19 9.01 3 7 3 4.24 3 2 5.24 2 8c0 .28.02.55.07.82C1.45 9.53 1 10.45 1 11.5 1 13.43 2.57 15 4.5 15h14c1.93 0 3.5-1.57 3.5-3.5 0-1.02-.43-1.93-1.12-2.58.26-.64.42-1.34.42-2.08z" opacity="0.8"/>
                </svg>
                <div className="absolute -bottom-2 left-1/4 w-[2px] h-[6px] bg-petronas animate-rain" style={{ animationDelay: '0s' }}></div>
                <div className="absolute -bottom-2 left-1/2 w-[2px] h-[6px] bg-petronas animate-rain" style={{ animationDelay: '0.3s' }}></div>
                <div className="absolute -bottom-2 right-1/4 w-[2px] h-[6px] bg-petronas animate-rain" style={{ animationDelay: '0.6s' }}></div>
                <svg className="absolute inset-0 text-white animate-lightning" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
             <span className="text-petronas font-black text-[clamp(10px,2vh,18px)] tracking-widest drop-shadow-[0_0_5px_rgba(0,161,155,0.5)]">80%</span>
          </div>
        </div>

        <div className="flex items-center justify-between py-3 px-2 md:py-4 md:px-3 border-y border-gray-800/50 bg-black/40">
          <div className="flex flex-col">
             <span className="text-gray-500 text-[clamp(5px,1vh,9px)] tracking-[0.2em] uppercase">Audio System</span>
             <span className="text-white font-bold text-[clamp(8px,1.6vh,16px)] tracking-widest mt-0.5 uppercase">Tracklist</span>
          </div>
          <button 
             onClick={toggleBgMusic} 
             className="text-petronas hover:text-white transition-colors bg-gray-900/50 p-1 md:p-1.5 rounded-full border border-gray-700 shadow-[0_0_10px_rgba(0,161,155,0.2)] cursor-pointer"
          >
             {isMusicPlaying ? (
               <svg className="w-[clamp(12px,2.2vh,20px)] h-[clamp(12px,2.2vh,20px)] fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
             ) : (
               <svg className="w-[clamp(12px,2.2vh,20px)] h-[clamp(12px,2.2vh,20px)] fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
             )}
          </button>
        </div>

        <div className="py-4 px-2 md:py-5 md:px-3 bg-gradient-to-r from-gray-900/40 to-transparent border-l-[3px] border-gray-600">
          <p className="text-gray-300 text-[clamp(10px,1.4vh,17px)] leading-tight italic tracking-wide">
            "A sua presença é muito importante pra mim :)"
          </p>
        </div>

      </div>


      {/* 2. CENTRO SUPERIOR: LOGÓTIPO F1 */}
      <div className="absolute top-[2vh] md:top-[4vh] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
        <img 
          src={f1Logo} 
          alt="F1 Custom Logo" 
          className="w-[26vw] md:w-64 max-w-[220px] h-auto object-contain animate-logo-glow"
        />
        <span className="text-[clamp(5px,1vh,9px)] text-gray-400 tracking-[0.3em] uppercase mt-2 font-bold drop-shadow-md text-center">
          Grand Prix Celebration
        </span>
      </div>


      {/* 3. LADO DIREITO: A BOLHA DA CONTAGEM */}
      <div className="absolute top-[1vh] md:top-[1vh] right-[1vw] md:right-[2vw] z-20 flex justify-end">
        <div className="relative w-[35vw] h-[35vh] md:w-[280px] md:h-[280px]">
          <img src={bgCountdown} alt="" className="absolute inset-0 w-full h-full object-fill animate-logo-glow pointer-events-none opacity-90" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-[5%] px-[15%]">
            <span className="text-petronas text-[clamp(5px,1.2vh,12px)] font-bold tracking-[0.2em] uppercase mb-1 md:mb-2">
              LIGHTS OUT EM:
            </span>

            <div className="bg-black border border-gray-800 p-1 md:p-1.5 rounded-lg flex gap-1 md:gap-1.5 mb-2 md:mb-4 shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
              {[1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i} 
                  className="w-1.5 h-1.5 md:w-2.5 md:h-2.5 bg-red-600 rounded-full animate-red-light"
                  style={{ animationDelay: `${i * 0.2}s` }}
                ></div>
              ))}
            </div>

            <div className="flex flex-col items-center leading-[0.9] font-sans font-black tracking-tighter drop-shadow-[0_0_15px_rgba(0,161,155,0.3)]">
              <div className="text-white text-[clamp(25px,5vh,65px)]">
                {timeLeft.days} <span className="text-petronas text-[clamp(12px,2vh,22px)] tracking-widest font-bold uppercase ml-0.5">
                  {timeLeft.days === 1 ? 'DIA' : 'DIAS'}
                </span>
              </div>
              <div className="text-white text-[clamp(20px,4vh,45px)] mt-1.5 md:mt-3">
                {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
              </div>
            </div>

            <span className="text-gray-400 text-[clamp(4px,0.8vh,8px)] tracking-[0.3em] uppercase mt-3 md:mt-5 font-bold">
              11.10.2026 • 18:30 BRT
            </span>
          </div>
        </div>
      </div>


      {/* ========================================================= */}
      {/* ===================== ÁREA INFERIOR ===================== */}
      {/* ========================================================= */}

      {/* GRÁFICO DA TV: TEAM RADIO */}
      <div className={`absolute top-24 right-2 md:top-32 md:right-12 z-50 w-[65vw] max-w-[380px] bg-[#0a0a0a]/95 border border-gray-800 shadow-2xl transition-all duration-500 ease-out transform
        ${radioActive ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0 pointer-events-none'}
      `}>
        <div className="flex bg-gradient-to-r from-[#111] to-gray-900 border-l-[3px] border-petronas p-1.5 md:p-2 items-center">
          <span className="text-petronas font-bold text-[clamp(20px,4vh,30px)] pr-2 border-r border-gray-700/50 z-10 font-sans tracking-tighter">22</span>
          <div className="pl-2 flex flex-col z-10">
             <span className="text-petronas text-[clamp(7px,1vh,10px)] font-bold leading-none tracking-widest">VINÍCIUS</span>
             <span className="text-white text-[clamp(12px,2vh,18px)] font-bold leading-none tracking-wide mt-0.5">TEAM RADIO</span>
          </div>
          <div className="ml-auto flex items-end gap-[2px] h-[clamp(15px,3vh,25px)] z-10 pr-2">
            {[...Array(10)].map((_, i) => (
              <div key={i} className={`w-[2px] bg-petronas ${radioActive ? 'animate-wave' : 'h-1'}`}
                style={{ animationDelay: `${Math.random() * 0.5}s`, animationDuration: `${0.3 + Math.random() * 0.5}s` }}
              ></div>
            ))}
          </div>
        </div>
        <div className="p-3 md:p-4 border-l-[3px] border-petronas/30 min-h-[50px] flex items-center">
           <p className="text-white font-sans text-[clamp(9px,1.8vh,16px)] italic font-bold leading-tight uppercase tracking-wide">
             "{displayedText}"<span className="animate-pulse opacity-50">_</span>
           </p>
        </div>
      </div>

      {/* O ARCO */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-[-15vh] w-[160vw] lg:w-[120vw] h-[45vh] rounded-t-[100%] border-t-[3px] md:border-t-[4px] border-petronas bg-gradient-to-b from-petronas/10 via-petronas/5 to-[#050505] z-10 pointer-events-none shadow-[0_-10px_30px_rgba(0,161,155,0.15)]"></div>

      {/* CÍRCULO CENTRAL */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-[8vh] lg:bottom-[10vh] z-20 flex flex-col items-center">
        <div className="w-[45vh] h-[45vh] max-w-[280px] max-h-[280px] min-w-[150px] min-h-[150px] rounded-full border-[4px] md:border-[6px] border-petronas bg-[#0a0a0a] shadow-[0_0_25px_rgba(0,161,155,0.5),inset_0_0_25px_rgba(0,161,155,0.5)] flex flex-col items-center justify-center">
          <span className="text-gray-400 text-[clamp(8px,1.5vh,14px)] tracking-widest uppercase mb-1 md:mb-2">LAPS</span>
          <span className="text-petronas text-[clamp(56px,12vh,100px)] font-sans font-bold leading-none tracking-tighter drop-shadow-[0_0_20px_#00A19B]">22</span>
          <span className="text-petronas font-bold tracking-widest text-[clamp(10px,2vh,20px)] mt-1.5 md:mt-3 drop-shadow-[0_0_8px_#00A19B]">YEARS</span>
        </div>
      </div>

      {/* BOTÃO TEAM RADIO */}
      <div className="absolute bottom-[6vh] left-[10vw] md:left-[15vw] -translate-x-1/2 z-30 flex flex-col items-center pointer-events-auto">
        <div className={`absolute bottom-[105%] mb-2 px-1.5 py-0.5 rounded text-[5px] md:text-[8px] w-max text-center tracking-widest uppercase shadow-[0_0_10px_rgba(249,115,22,0.3)] transition-all duration-300
          ${currentRadioIndex < 3 ? 'bg-orange-500/20 border border-orange-500/50 text-orange-400 animate-bounce' : 'bg-gray-800/80 border border-gray-700 text-gray-400'}
        `}>
          {getBoxMessage()}
        </div>
        <button 
          className={`relative w-[18vh] h-[18vh] max-w-[110px] max-h-[110px] min-w-[65px] min-h-[65px] rounded-full bg-[#0a0a0a] transition-all flex items-center justify-center group cursor-pointer
            ${radioActive ? 'shadow-[0_0_15px_#f97316,inset_0_0_10px_#f97316]' : 'shadow-[0_0_10px_rgba(249,115,22,0.3)] hover:shadow-[0_0_15px_#f97316]'}
          `}
          onClick={handleRadioClick}
        >
           <div className={`absolute inset-[3px] md:inset-[5px] rounded-full border-[2px] md:border-[3px] ${radioActive ? 'border-orange-500 animate-pulse' : 'border-orange-600/50 group-hover:border-orange-500'}`}></div>
           <div className={`w-[30%] h-[30%] rounded-full border-[2px] border-orange-500/80 ${radioActive ? 'animate-ping bg-orange-500/50' : 'group-hover:animate-pulse'}`}></div>
        </button>
        <p className="text-gray-400 text-[clamp(5px,1.1vh,10px)] mt-1.5 md:mt-2 font-bold tracking-widest uppercase drop-shadow-md">Team Radio</p>
      </div>

      {/* BOTÃO RSVP */}
      <div className="absolute bottom-[6vh] right-[10vw] md:right-[15vw] translate-x-1/2 z-30 flex flex-col items-center pointer-events-auto">
        <div className="relative p-[3px] md:p-[5px] rounded-full bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600 shadow-[0_10px_15px_rgba(0,0,0,0.8)] mt-auto mb-0 md:mt-6">
          <button 
            onClick={handleRSVP}
            disabled={rsvpConfirmed}
            className="relative w-[18vh] h-[18vh] max-w-[110px] max-h-[110px] min-w-[65px] min-h-[65px] rounded-full bg-gradient-to-b from-[#1a1a1a] via-[#0d0d0d] to-black flex flex-col items-center justify-center shadow-[inset_0_-3px_10px_rgba(0,0,0,1)] transition-all cursor-pointer overflow-hidden group border border-black"
          >
            <div 
              className={`absolute inset-[3px] md:inset-[5px] rounded-full border-[2px] md:border-[4px] transition-all duration-700 pointer-events-none
                ${rsvpConfirmed ? 'border-petronas shadow-[0_0_10px_#00A19B,inset_0_0_10px_#00A19B]' : 'border-[#ff1a1a] shadow-[0_0_10px_#ff1a1a,inset_0_0_10px_#ff1a1a] group-hover:shadow-[0_0_20px_#ff1a1a,inset_0_0_20px_#ff1a1a]'}
              `}
            ></div>
            <div className="absolute top-0 w-full h-[45%] bg-gradient-to-b from-white/10 to-transparent rounded-t-full pointer-events-none"></div>
            
            <div className={`relative z-10 flex flex-col items-center justify-center font-bold font-sans tracking-wide transition-colors duration-700
              ${rsvpConfirmed ? 'text-petronas drop-shadow-[0_0_5px_#00A19B]' : 'text-[#ff1a1a] drop-shadow-[0_0_5px_#ff1a1a]'}
            `}>
              <span className="text-[clamp(4px,1vh,10px)] leading-none mb-[2px]">ENGINE</span>
              <span className="text-[clamp(6px,1.4vh,14px)] leading-none">{rsvpConfirmed ? 'ON' : 'START'}</span>
              <div className={`w-[50%] h-[1px] md:h-[2px] my-[2px] transition-colors duration-700
                ${rsvpConfirmed ? 'bg-petronas' : 'bg-[#ff1a1a]'}
              `}></div>
              <span className="text-[clamp(4px,1vh,10px)] leading-none">STOP</span>
            </div>
          </button>
        </div>
        <p className="text-gray-400 text-[clamp(5px,1.1vh,10px)] mt-1.5 md:mt-2 font-bold tracking-widest uppercase text-center drop-shadow-md">RSVP<br/>Confirmar Presença</p>
      </div>

      <div className="absolute bottom-[7vh] left-[30vw] md:left-[32vw] -translate-x-1/2 z-20 flex flex-col items-center text-center w-max">
        <span className="text-petronas text-[clamp(5px,1vh,10px)] tracking-[0.2em] uppercase mb-0.5">Data / Largada</span>
        <div className="flex items-baseline gap-1 md:gap-2">
          <span className="text-white text-[clamp(16px,4vh,40px)] font-bold font-sans">11.10</span>
          <span className="text-gray-300 text-[clamp(9px,2vh,24px)] font-bold">18:30</span>
        </div>
        <div className="mt-1 flex items-center gap-1 border border-green-500/30 bg-green-500/10 px-1.5 py-0.5 md:px-2 md:py-1 rounded w-fit">
           <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e] animate-pulse"></div>
           <span className="text-[clamp(4px,0.8vh,9px)] tracking-widest text-green-400 font-bold">PISTA LIVRE</span>
        </div>
      </div>

      <div className="absolute bottom-[7vh] right-[30vw] md:right-[32vw] translate-x-1/2 z-20 flex flex-col items-center text-center w-max">
        <span className="text-petronas text-[clamp(5px,1vh,10px)] tracking-[0.2em] uppercase mb-0.5">Circuito (Local)</span>
        <div className="text-gray-200 text-[clamp(6px,1.4vh,14px)] font-sans font-bold leading-tight tracking-wider">
          RUA LUPÉRCIO RODRIGUES DE OLIVEIRA<br/>CASA 118<br/>CASA DA MARIE
        </div>
        <div className="mt-1 text-gray-400 text-[clamp(4px,0.8vh,9px)] uppercase tracking-widest border border-gray-700 bg-gray-800/50 px-1.5 py-0.5 rounded font-bold">
          Traje Casual
        </div>
      </div>

    </div>
  );
}