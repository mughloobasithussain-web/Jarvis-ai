import React, { useState, useRef, useEffect } from 'react';
import { Camera, Zap, ZapOff, RefreshCw, Circle, Image as ImageIcon } from 'lucide-react';
import { playShutterSound } from '../../utils/soundEffects';

interface CameraAppProps {
  onTakePhoto?: () => void;
}

export const CameraApp: React.FC<CameraAppProps> = ({ onTakePhoto }) => {
  const [flash, setFlash] = useState(false);
  const [mode, setMode] = useState<'PHOTO' | 'VIDEO' | 'PORTRAIT'>('PHOTO');
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&q=80',
  ]);
  const [shutterFlash, setShutterFlash] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);

  // Attempt to initialize real webcam stream if allowed, else use aesthetic simulated viewfinder
  useEffect(() => {
    let stream: MediaStream | null = null;
    navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'user' }, audio: false })
      .then((s) => {
        stream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          setCameraActive(true);
        }
      })
      .catch(() => {
        // Fallback to simulated high-tech viewfinder
        setCameraActive(false);
      });

    return () => {
      stream?.getTracks().forEach(t => t.stop());
    };
  }, []);

  const handleCapture = () => {
    playShutterSound();
    setShutterFlash(true);
    setTimeout(() => setShutterFlash(false), 150);

    // Save snapshot
    const placeholderPhoto = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80';
    setPhotos(prev => [placeholderPhoto, ...prev]);
    onTakePhoto?.();
  };

  return (
    <div className="h-full bg-black text-white flex flex-col justify-between relative overflow-hidden select-none">
      {/* Flash overlay animation */}
      {shutterFlash && <div className="absolute inset-0 bg-white z-40 animate-out fade-out duration-150" />}

      {/* Top Camera Controls */}
      <div className="z-10 p-3 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
        <button
          onClick={() => setFlash(!flash)}
          className={`p-2 rounded-full ${flash ? 'bg-amber-400 text-black' : 'bg-black/40 text-white'}`}
        >
          {flash ? <Zap className="w-4 h-4 fill-black" /> : <ZapOff className="w-4 h-4" />}
        </button>

        <div className="px-2.5 py-0.5 rounded-full bg-black/50 text-[10px] font-mono text-neutral-300 border border-white/10">
          RAW • 48MP
        </div>

        <div className="text-[10px] font-mono text-cyan-400">
          JARVIS VISION
        </div>
      </div>

      {/* Viewfinder Center */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden bg-neutral-900">
        {cameraActive ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 flex flex-col items-center justify-center p-6 text-center">
            {/* Viewfinder Reticle */}
            <div className="w-48 h-48 border border-white/20 rounded-2xl relative flex items-center justify-center">
              <div className="w-4 h-4 border-t-2 border-l-2 border-cyan-400 absolute top-2 left-2" />
              <div className="w-4 h-4 border-t-2 border-r-2 border-cyan-400 absolute top-2 right-2" />
              <div className="w-4 h-4 border-b-2 border-l-2 border-cyan-400 absolute bottom-2 left-2" />
              <div className="w-4 h-4 border-b-2 border-r-2 border-cyan-400 absolute bottom-2 right-2" />
              <div className="w-2 h-2 rounded-full bg-cyan-400/80 animate-ping" />
            </div>
            <div className="mt-4 text-xs font-mono text-neutral-400">
              JARVIS AI OPTICS ENGAGED
            </div>
          </div>
        )}
      </div>

      {/* Mode Selector */}
      <div className="z-10 py-2 flex items-center justify-center gap-6 text-xs font-semibold tracking-wider font-mono bg-black/60">
        {(['PHOTO', 'PORTRAIT', 'VIDEO'] as const).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`transition-colors ${mode === m ? 'text-amber-400' : 'text-neutral-500 hover:text-white'}`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Bottom Shutter Area */}
      <div className="z-10 pb-6 pt-2 px-8 flex items-center justify-between bg-black">
        {/* Gallery Preview Thumbnail */}
        <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/20 bg-neutral-900">
          {photos[0] && (
            <img src={photos[0]} alt="Recent capture" className="w-full h-full object-cover" />
          )}
        </div>

        {/* Big Shutter Button */}
        <button
          onClick={handleCapture}
          className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center active:scale-95 transition-transform"
        >
          <div className="w-13 h-13 rounded-full bg-white active:bg-neutral-300" />
        </button>

        {/* Flip Cam */}
        <button
          onClick={() => setCameraActive(prev => !prev)}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
