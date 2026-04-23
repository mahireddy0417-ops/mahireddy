/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Point {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 };

export default function SnakeGame({ onScoreUpdate }: { onScoreUpdate: (score: number) => void }) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);
  const directionRef = useRef<Point>(INITIAL_DIRECTION);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(p => p.x === newFood.x && p.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood({ x: 5, y: 5 });
    setIsGameOver(false);
    setScore(0);
    onScoreUpdate(0);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + directionRef.current.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + directionRef.current.y + GRID_SIZE) % GRID_SIZE,
      };

      // Collision with self
      if (prevSnake.some(p => p.x === newHead.x && p.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Eat food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(prev => {
          const newScore = prev + 10;
          onScoreUpdate(newScore);
          return newScore;
        });
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, isGameOver, isPaused, generateFood, onScoreUpdate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (directionRef.current.y === 0) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
          if (directionRef.current.y === 0) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
          if (directionRef.current.x === 0) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
          if (directionRef.current.x === 0) directionRef.current = { x: 1, y: 0 };
          break;
        case ' ':
          setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const gameLoop = (timestamp: number) => {
      if (!lastUpdateRef.current) lastUpdateRef.current = timestamp;
      const deltaTime = timestamp - lastUpdateRef.current;

      const speed = Math.max(50, 150 - Math.floor(score / 50) * 10);

      if (deltaTime > speed) {
        moveSnake();
        lastUpdateRef.current = timestamp;
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [moveSnake, score]);

  return (
    <div id="snake-container" className="relative flex flex-col items-center">
      <div className="mb-4 flex justify-between w-full max-w-[400px] px-4 font-mono">
        <div className="text-cyan-400">SCORE: {score.toString().padStart(4, '0')}</div>
        <div className="text-pink-500">{isPaused ? 'PAUSED' : 'PLAYING'}</div>
      </div>

      <div 
        className="relative grid bg-black border-2 border-indigo-500/80 rounded-md overflow-hidden"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          width: 'min(90vw, 400px)',
          aspectRatio: '1/1'
        }}
      >
        {/* Background Text Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none select-none">
          <span className="text-4xl font-bold font-mono tracking-widest text-indigo-500 uppercase blur-[0.5px]">
            snake game
          </span>
        </div>

        {/* Render Snake */}
        {snake.map((p, i) => (
          <div
            key={`${i}-${p.x}-${p.y}`}
            className="absolute rounded-[4px] transition-all duration-100"
            style={{
              left: `${(p.x / GRID_SIZE) * 100}%`,
              top: `${(p.y / GRID_SIZE) * 100}%`,
              width: `${(1 / GRID_SIZE) * 92}%`, // Leave a tiny gap
              height: `${(1 / GRID_SIZE) * 92}%`,
              margin: '2%',
              background: i === 0 
                ? 'rgb(34, 211, 238)' // head: cyan-400
                : 'rgb(79, 70, 229)', // body: indigo-600
              boxShadow: i === 0 
                ? '0 0 15px rgb(34, 211, 238)' 
                : 'none',
              zIndex: i === 0 ? 10 : 5
            }}
          />
        ))}

        {/* Render Food */}
        <motion.div
          animate={{
            scale: [0.8, 1.1, 0.8],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute rounded-full bg-pink-500"
          style={{
            left: `${(food.x / GRID_SIZE) * 100}%`,
            top: `${(food.y / GRID_SIZE) * 100}%`,
            width: `${100 / GRID_SIZE}%`,
            height: `${100 / GRID_SIZE}%`,
            boxShadow: '0 0 15px rgb(236, 72, 153)'
          }}
        />

        {/* Game Over / Pause Overlays */}
        <AnimatePresence>
          {(isGameOver || isPaused) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            >
              <div className="text-center p-8 bg-black/80 border border-indigo-500/50 rounded-2xl shadow-2xl">
                {isGameOver ? (
                  <>
                    <h2 className="text-4xl font-bold text-pink-500 mb-2 font-mono tracking-tighter">GAME OVER</h2>
                    <p className="text-indigo-300 mb-6 font-mono">FINAL SCORE: {score}</p>
                    <button
                      id="reset-btn"
                      onClick={resetGame}
                      className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-mono transition-colors shadow-[0_0_15px_rgba(79,70,229,0.4)]"
                    >
                      TRY AGAIN
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="text-4xl font-bold text-cyan-400 mb-2 font-mono tracking-tighter">PAUSED</h2>
                    <p className="text-indigo-300 mb-6 font-mono px-4">PRESS [SPACE] TO RESUME</p>
                    <button
                      id="resume-btn"
                      onClick={() => setIsPaused(false)}
                      className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full font-mono transition-colors shadow-[0_0_15px_rgba(8,145,178,0.4)]"
                    >
                      RESUME
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 text-white/40 text-[11px] font-mono tracking-[0.4em] uppercase text-center w-full">
        Use arrows to move • Space to pause
      </div>
    </div>
  );
}
