/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Track {
  id: number;
  title: string;
  artist: string;
  duration: string;
  color: string;
}

const DUMMY_TRACKS: Track[] = [
  { id: 1, title: "Neon Pulse", artist: "CyberSynth AI", duration: "3:45", color: "from-cyan-500 to-blue-600" },
  { id: 2, title: "Midnight Grid", artist: "RetroByte", duration: "4:20", color: "from-pink-500 to-purple-600" },
  { id: 3, title: "Static Dream", artist: "Neural Wave", duration: "2:55", color: "from-indigo-500 to-cyan-500" },
];

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  // Simulated progress
  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setProgress(prev => (prev >= 100 ? 0 : prev + 0.5));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  return (
    <div className="w-full max-w-[400px] bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl">
      <div className="flex items-center gap-4 mb-8">
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${currentTrack.color} flex items-center justify-center shadow-lg relative overflow-hidden group`}>
          <Music2 className="text-white w-8 h-8 relative z-10" />
          <motion.div 
            animate={isPlaying ? { rotate: 360 } : {}}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" 
          />
        </div>
        <div className="flex-1 overflow-hidden">
          <motion.h3 
            key={currentTrack.title}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-white font-bold truncate text-lg tracking-tight"
          >
            {currentTrack.title}
          </motion.h3>
          <p className="text-white/50 text-sm font-mono tracking-wider">{currentTrack.artist}</p>
        </div>
        <div className="flex gap-1 h-8 items-end">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={isPlaying ? { height: [8, 24, 12, 32, 16] } : { height: 4 }}
              transition={{ 
                duration: 0.6, 
                repeat: Infinity, 
                delay: i * 0.1,
                ease: "easeInOut"
              }}
              className={`w-1 rounded-full bg-gradient-to-t ${currentTrack.color}`}
            />
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            className={`h-full bg-gradient-to-r ${currentTrack.color} shadow-[0_0_10px_rgba(255,255,255,0.2)]`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 font-mono text-[10px] text-white/30 tracking-tighter">
          <span>0:45</span>
          <span>{currentTrack.duration}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <button id="volume-btn" className="p-2 text-white/40 hover:text-white transition-colors">
          <Volume2 className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-4">
          <button 
            id="prev-btn"
            onClick={prevTrack}
            className="p-3 text-white/60 hover:text-white transition-colors"
          >
            <SkipBack className="w-6 h-6 fill-current" />
          </button>
          
          <button 
            id="play-pause-btn"
            onClick={togglePlay}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isPlaying ? 'bg-white text-black' : 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.5)]'}`}
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current translate-x-0.5" />}
          </button>

          <button 
            id="next-btn"
            onClick={nextTrack}
            className="p-3 text-white/60 hover:text-white transition-colors"
          >
            <SkipForward className="w-6 h-6 fill-current" />
          </button>
        </div>

        <div className="w-9" /> {/* Spacer for symmetry */}
      </div>
    </div>
  );
}
