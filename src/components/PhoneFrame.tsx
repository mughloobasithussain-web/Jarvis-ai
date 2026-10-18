import React from 'react';
import { Wifi, Battery, Moon, Zap, Radio, Bell } from 'lucide-react';
import { PhoneSettings, ActiveCall, MusicTrack, JarvisExecutionStep } from '../types/phone';
import { DynamicIsland } from './DynamicIsland';

interface PhoneFrameProps {
  children: React.ReactNode;
  settings: PhoneSettings;
  activeCall: ActiveCall | null;
  musicPlaying: boolean;
  currentTrack: MusicTrack | null;
  jarvisActive: boolean;
  jarvisStatus: 'idle' | 'listening' | 'wake_detected' | 'processing' | 'speaking';
  jarvisTaskTitle?: string;
  activeSteps?: JarvisExecutionStep[];
  onOpenApp: (appId: any) => void;
  onEndCall: () => void;
  onHomeClick: () => void;
  onPowerButtonClick: () => void;
  onOpenControlCenter: () => void;
  onOpenNotifications: () => void;
  onJarvisClick: () => void;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  settings,
  activeCall,
  musicPlaying,
  currentTrack,
  jarvisActive,
  jarvisStatus,
  jarvisTaskTitle,
  activeSteps,
  onOpenApp,
  onEndCall,
  onHomeClick,
  onPowerButtonClick,
  onOpenControlCenter,
  onOpenNotifications,
  onJarvisClick,
}) => {
  const currentTime = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  // Choose wallpaper style
  const getWallpaperClass = () => {
    switch (settings.wallpaper) {
      case 'cyber':
        return 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900 via-neutral-950 to-black';
      case 'aurora':
        return 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900 via-teal-950 to-black';
      case 'sunset':
        return 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-900 via-purple-950 to-black';
      case 'obsidian':
        return 'bg-gradient-to-b from-neutral-900 to-black';
      case 'deep-space':
      default:
        return 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950 via-neutral-950 to-black';
    }
  };

  return (
    <div className="relative mx-auto my-auto flex items-center justify-center p-2">
      {/* Real Flashlight Radiance Glow behind the phone when flashlight is ON */}
      {settings.flashlight && (
        <div className="absolute -top-12 -left-12 -right-12 h-64 bg-amber-400/30 rounded-full blur-3xl pointer-events-none animate-pulse" />
      )}

      {/* Physical Hardware Buttons on Left Bezel */}
      <div className="absolute -left-2.5 top-28 flex flex-col gap-3">
        {/* Action Button */}
        <button
          onClick={onPowerButtonClick}
          title="Action Button (Jarvis)"
          className="w-1.5 h-7 bg-neutral-700 hover:bg-cyan-500 rounded-l-md transition-colors"
        />
        {/* Volume Up */}
        <button
          onClick={() => {}}
          title="Volume Up"
          className="w-1.5 h-11 bg-neutral-700 hover:bg-neutral-600 rounded-l-md transition-colors"
        />
        {/* Volume Down */}
        <button
          onClick={() => {}}
          title="Volume Down"
          className="w-1.5 h-11 bg-neutral-700 hover:bg-neutral-600 rounded-l-md transition-colors"
        />
      </div>

      {/* Physical Power / Siri Button on Right Bezel */}
      <div className="absolute -right-2.5 top-36">
        <button
          onClick={onPowerButtonClick}
          title="Press & hold to activate Jarvis"
          className="w-1.5 h-16 bg-neutral-700 hover:bg-cyan-500 rounded-r-md transition-colors"
        />
      </div>

      {/* Main Titanium Chassis */}
      <div className="w-[360px] h-[730px] max-w-full bg-neutral-900 rounded-[52px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border-[3px] border-neutral-700/80 relative flex flex-col justify-between overflow-hidden ring-1 ring-white/15">
        {/* Screen Bezel and Inner Glass Container */}
        <div
          className={`w-full h-full rounded-[44px] overflow-hidden relative flex flex-col justify-between ${getWallpaperClass()} transition-all duration-300`}
          style={{ filter: `brightness(${settings.brightness}%)` }}
        >
          {/* Top Status Bar & Dynamic Island */}
          <div className="pt-2 px-6 flex items-center justify-between text-white z-30 select-none">
            {/* Left Status Bar: Time & Tap for Notifications */}
            <div
              onClick={onOpenNotifications}
              className="w-20 text-xs font-semibold tracking-tight cursor-pointer hover:text-cyan-300 transition-colors flex items-center gap-1"
              title="Click to view notifications"
            >
              <span>{currentTime}</span>
              {settings.dnd && <Moon className="w-2.5 h-2.5 text-purple-400 fill-purple-400" />}
            </div>

            {/* Center Dynamic Island */}
            <div className="flex-1 flex justify-center">
              <DynamicIsland
                jarvisActive={jarvisActive}
                jarvisStatus={jarvisStatus}
                jarvisTaskTitle={jarvisTaskTitle}
                activeSteps={activeSteps}
                activeCall={activeCall}
                musicPlaying={musicPlaying}
                currentTrack={currentTrack}
                onOpenApp={onOpenApp}
                onEndCall={onEndCall}
                onJarvisClick={onJarvisClick}
              />
            </div>

            {/* Right Status Bar: 5G, Wi-Fi, Battery & Tap for Control Center */}
            <div
              onClick={onOpenControlCenter}
              className="w-20 flex items-center justify-end gap-1.5 cursor-pointer hover:text-cyan-300 transition-colors"
              title="Click to open Control Center"
            >
              <Radio className="w-3 h-3 text-white" />
              {settings.wifi ? <Wifi className="w-3 h-3 text-white" /> : <span className="text-[9px] text-neutral-500">5G</span>}
              <div className="flex items-center gap-0.5">
                <span className="text-[10px] font-mono font-medium">94%</span>
                <Battery className={`w-3.5 h-3.5 ${settings.lowPowerMode ? 'text-amber-400 fill-amber-400' : 'text-white'}`} />
              </div>
            </div>
          </div>

          {/* Screen Body */}
          <div className="flex-1 relative overflow-hidden flex flex-col">
            {children}
          </div>

          {/* Bottom Home Indicator Bar */}
          <div
            onClick={onHomeClick}
            title="Swipe up or click to go to Home Screen"
            className="pb-2 pt-1 flex justify-center cursor-pointer group z-30"
          >
            <div className="w-32 h-1 bg-white/70 group-hover:bg-cyan-400 rounded-full transition-all group-hover:w-36 group-hover:h-1.5 shadow-sm" />
          </div>
        </div>
      </div>
    </div>
  );
};
