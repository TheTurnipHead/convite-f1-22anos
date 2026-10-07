import { useState, useEffect } from 'react';
import VideoIntro from './components/VideoIntro';
import PainelTelemetria from './components/PainelTelemetria';

function App() {
  const [isLandscape, setIsLandscape] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);

    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  return (
    <div className="w-screen h-screen bg-black overflow-hidden flex items-center justify-center">

      {!isLandscape && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black text-petronas p-8 text-center">
          <svg className="w-16 h-16 animate-pulse mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
          </svg>
          <h1 className="text-2xl font-bold uppercase tracking-widest mb-2">Modo Corrida</h1>
          <p className="text-sm text-gray-400">Vire o celular para a horizontal para dar a largada.</p>
        </div>
      )}

      {isLandscape && (
        <>
          {!introFinished ? (
            <VideoIntro onFinish={() => setIntroFinished(true)} />
          ) : (
            <PainelTelemetria />
          )}
        </>
      )}
    </div>
  );
}

export default App;