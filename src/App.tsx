/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  const [highScore, setHighScore] = useState(0);

  const handleScoreUpdate = (score: number) => {
    if (score > highScore) setHighScore(score);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden relative selection:bg-cyan-500/30">
      {/* Immersive Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-600/10 rounded-full blur-[150px]" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-cyan-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Main Layout */}
      <main className="relative z-10 container mx-auto px-4 py-8 h-screen flex flex-col xl:flex-row items-center justify-center gap-12">
        
        {/* Left Section: Info & Branding */}
        <section className="hidden xl:flex flex-col gap-6 w-[300px]">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex flex-col gap-2"
          >
            <h1 className="text-6xl font-black italic tracking-tighter leading-none bg-gradient-to-br from-white via-indigo-300 to-indigo-600 bg-clip-text text-transparent uppercase">
              Neon<br/>Snake
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 to-transparent rounded-full" />
            <p className="text-white/40 font-mono text-xs mt-2 uppercase tracking-[0.2em]">
              Retro-Active Dynamics // V1.0.4
            </p>
          </motion.div>

          <motion.div 
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm"
          >
            <div className="text-[10px] text-indigo-400 font-mono tracking-widest uppercase mb-1">Session Peak</div>
            <div className="text-3xl font-bold font-mono text-white/90 tracking-tighter">{highScore.toString().padStart(5, '0')}</div>
          </motion.div>

          <div className="mt-auto pointer-events-none opacity-20">
            <div className="text-[8px] font-mono leading-relaxed">
              {"{ SYSTEM_INITIALIZED }"} <br/>
              {"{ ENCRYPTION_ACTIVE }"} <br/>
              {"{ WAVEFORM_SYNC_STABLE }"} <br/>
              {"{ INPUT_LISTENER_ACTIVE }"} <br/>
            </div>
          </div>
        </section>

        {/* Center Section: Game */}
        <section className="flex-1 flex justify-center items-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 20 }}
            className="relative"
          >
            {/* Mobile Title View */}
            <div className="xl:hidden text-center mb-8">
              <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase mb-2">NEON SNAKE</h1>
              <div className="text-[10px] text-pink-500 font-mono tracking-[0.3em] uppercase">Beats sync v1.0</div>
            </div>

            <SnakeGame onScoreUpdate={handleScoreUpdate} />
          </motion.div>
        </section>

        {/* Right Section: Player & Stats */}
        <section className="flex flex-col items-center xl:items-end gap-8 w-full xl:w-auto">
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <MusicPlayer />
          </motion.div>
          
          <div className="hidden xl:flex gap-4">
             <div className="w-12 h-12 rounded-2xl border border-white/5 bg-white/5 flex items-center justify-center text-xs font-mono text-white/20">
               01
             </div>
             <div className="w-12 h-12 rounded-2xl border border-white/5 bg-white/5 flex items-center justify-center text-xs font-mono text-white/20">
               02
             </div>
             <div className="w-12 h-12 rounded-2xl border border-white/5 bg-white/5 flex items-center justify-center text-xs font-mono text-white/20">
               03
             </div>
          </div>
        </section>
      </main>

      {/* Decorative Overlays */}
      <div className="fixed top-0 left-0 w-full h-[100px] bg-gradient-to-b from-black/80 to-transparent pointer-events-none z-20" />
      <div className="fixed bottom-0 left-0 w-full h-[100px] bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-20" />
      
      {/* Scanline Effect */}
      <div className="fixed inset-0 pointer-events-none z-30 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
    </div>
  );
}

