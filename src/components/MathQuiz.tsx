/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Minus, RefreshCw, Trophy, Check, X, Award, Settings, Sparkles, Volume2, HelpCircle 
} from 'lucide-react';
import { MathQuestion, AppSettings } from '../types';
import { speakText } from '../data/pinyin';

interface MathQuizProps {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
}

export default function MathQuiz({ settings, updateSettings }: MathQuizProps) {
  const [questions, setQuestions] = useState<MathQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentInput, setCurrentInput] = useState<string>('');
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [history, setHistory] = useState<{ date: string; score: number; ratio: string }[]>(() => {
    const saved = localStorage.getItem('math_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Temporary config states before applying
  const [tempN, setTempN] = useState<number>(settings.mathN);
  const [tempM, setTempM] = useState<number>(settings.mathM);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Generate equations
  const generateQuestions = (n: number, m: number) => {
    const list: MathQuestion[] = [];
    for (let i = 0; i < m; i++) {
      const isAddition = Math.random() > 0.5;
      let num1 = 0;
      let num2 = 0;
      let operator: '+' | '-' = '+';
      let answer = 0;

      if (isAddition) {
        operator = '+';
        // Sum needs to be <= N, so:
        answer = Math.floor(Math.random() * (n + 1)); // 0 to N
        num1 = Math.floor(Math.random() * (answer + 1)); // 0 to answer
        num2 = answer - num1;
      } else {
        operator = '-';
        num1 = Math.floor(Math.random() * (n + 1)); // 0 to N
        num2 = Math.floor(Math.random() * (num1 + 1)); // 0 to num1, so result is non-negative
        answer = num1 - num2;
      }

      list.push({
        id: i + 1,
        num1,
        num2,
        operator,
        correctAnswer: answer,
        userAnswer: undefined
      });
    }
    setQuestions(list);
    setCurrentIndex(0);
    setCurrentInput('');
    setIsFinished(false);
    setScore(0);
  };

  // Run on mount or math configuration changes
  useEffect(() => {
    generateQuestions(settings.mathN, settings.mathM);
  }, [settings.mathN, settings.mathM]);

  // Sync settings when they change externally
  useEffect(() => {
    setTempN(settings.mathN);
    setTempM(settings.mathM);
  }, [settings]);

  // Perform confetti celebration animation when 100 points
  useEffect(() => {
    if (isFinished && score === 100 && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;

      const colors = ['#FF6B6B', '#4DABF7', '#51CF66', '#FCC419', '#FF922B', '#845EF7', '#F06595'];
      const particles: any[] = [];

      for (let i = 0; i < 150; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height - canvas.height,
          size: Math.random() * 8 + 5,
          color: colors[Math.floor(Math.random() * colors.length)],
          speedX: Math.random() * 4 - 2,
          speedY: Math.random() * 5 + 4,
          rotation: Math.random() * 360,
          rotationSpeed: Math.random() * 6 - 3
        });
      }

      let animationFrameId: number;

      const drawConfetti = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let active = false;

        particles.forEach((p) => {
          if (p.y < canvas.height) {
            active = true;
            p.y += p.speedY;
            p.x += p.speedX;
            p.rotation += p.rotationSpeed;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();
          }
        });

        if (active) {
          animationFrameId = requestAnimationFrame(drawConfetti);
        }
      };

      drawConfetti();

      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    }
  }, [isFinished, score]);

  // Handle number pad inputs
  const handleNumClick = (val: string) => {
    if (currentInput.length >= 4) return; // Prevent unreasonable lengths
    setCurrentInput((prev) => prev + val);
  };

  const handleClear = () => {
    setCurrentInput('');
  };

  const handleBackspace = () => {
    setCurrentInput((prev) => prev.slice(0, -1));
  };

  // Submit current answer
  const handleSubmit = () => {
    if (currentInput === '') return;

    const updatedQuestions = [...questions];
    updatedQuestions[currentIndex].userAnswer = currentInput;
    setQuestions(updatedQuestions);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setCurrentInput('');
    } else {
      // Calculate grade
      let correctCount = 0;
      updatedQuestions.forEach((q) => {
        if (parseInt(q.userAnswer || '', 10) === q.correctAnswer) {
          correctCount++;
        }
      });
      const calculatedScore = Math.round((correctCount / questions.length) * 100);
      setScore(calculatedScore);
      setIsFinished(true);

      // Save to history
      const newHistoryItem = {
        date: new Date().toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
        score: calculatedScore,
        ratio: `${correctCount}/${questions.length}`
      };
      const updatedHistory = [newHistoryItem, ...history.slice(0, 9)];
      setHistory(updatedHistory);
      localStorage.setItem('math_history', JSON.stringify(updatedHistory));
    }
  };

  // Play a simple reward/interaction ding sound with synthesis if audio is clicked
  const playRewardSound = () => {
    const text = score === 100 ? '恭喜你！得了100分！你太棒啦！' : `真棒！你获得了${score}分！继续加油哦！`;
    speakText(text, 0.85);
  };

  const applyConfig = () => {
    updateSettings({
      mathN: tempN,
      mathM: tempM
    });
    generateQuestions(tempN, tempM);
    setShowConfig(false);
  };

  return (
    <div className="relative flex flex-col h-full bg-transparent overflow-hidden">
      {/* Settings Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/30 backdrop-blur-md border-b border-white/40 shadow-xs relative z-10">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-indigo-500/10 text-indigo-700 border border-white/40 rounded-xl">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-indigo-950 text-sm">口算大冒险</h2>
            <p className="text-[10px] text-indigo-800 font-semibold">
              {settings.mathN}以内 · 共{settings.mathM}道题
            </p>
          </div>
        </div>
        
        <button 
          id="btn_math_settings"
          onClick={() => setShowConfig(!showConfig)}
          className="flex items-center space-x-1 px-2.5 py-1 text-[10px] font-bold text-indigo-900 bg-white/50 border border-white/60 hover:bg-white/80 rounded-xl transition-all shadow-2xs"
        >
          <Settings className="w-3 h-3" />
          <span>参数配置</span>
        </button>
      </div>

      {/* Config Drawer/Panel - Overlay layout to avoid page-cuts */}
      <AnimatePresence>
        {showConfig && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-[49px] inset-x-0 z-50 bg-white/95 backdrop-blur-2xl border-b border-indigo-100 px-4 py-4 space-y-4 shadow-xl rounded-b-2xl overflow-hidden"
          >
            <div className="space-y-3">
              <h3 className="text-[10px] font-black text-indigo-900/60 uppercase tracking-wider">家长参数设定</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600">运算范围 (N以内)</label>
                  <select 
                    value={tempN} 
                    onChange={(e) => setTempN(parseInt(e.target.value))}
                    className="w-full text-xs rounded-xl border border-white/60 bg-white/50 p-2 text-indigo-950 font-bold focus:ring-2 focus:ring-indigo-300 outline-none"
                  >
                    <option value={10}>10以内加减法</option>
                    <option value={20}>20以内加减法</option>
                    <option value={50}>50以内加减法</option>
                    <option value={100}>100以内加减法</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600">题目数量 (M道题)</label>
                  <select 
                    value={tempM} 
                    onChange={(e) => setTempM(parseInt(e.target.value))}
                    className="w-full text-xs rounded-xl border border-white/60 bg-white/50 p-2 text-indigo-950 font-bold focus:ring-2 focus:ring-indigo-300 outline-none"
                  >
                    <option value={5}>每天 5 道题</option>
                    <option value={10}>每天 10 道题</option>
                    <option value={15}>每天 15 道题</option>
                    <option value={20}>每天 20 道题</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-2 pt-1">
                <button
                  onClick={applyConfig}
                  className="flex-1 py-1.5 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition shadow-xs"
                >
                  确定修改
                </button>
                <button
                  onClick={() => {
                    setTempN(settings.mathN);
                    setTempM(settings.mathM);
                    setShowConfig(false);
                  }}
                  className="px-3 py-1.5 text-xs font-bold text-gray-500 bg-white/20 border border-white/40 hover:bg-white/40 rounded-lg"
                >
                  取消
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container - Scrollable layer */}
      <div className="flex-1 flex flex-col p-4 relative justify-between overflow-y-auto">
        {!isFinished ? (
          <>
            {/* Answer Cards & Score Tracker */}
            <div className="w-full max-w-md mx-auto flex flex-col items-center">
              {/* Progress and indicators */}
              <div className="w-full flex items-center justify-between mb-3 px-1">
                <span className="text-[10px] font-black text-indigo-700 bg-white/70 border border-white/60 px-3 py-1 rounded-full shadow-2xs">
                  闯关中
                </span>
                <span className="text-xs font-black text-indigo-950">
                  {currentIndex + 1} <span className="text-indigo-400 font-normal">/</span> {settings.mathM} 题
                </span>
              </div>

              {/* Progress Line */}
              <div className="w-full h-1.5 bg-indigo-900/10 rounded-full overflow-hidden mb-4">
                <motion.div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentIndex) / settings.mathM) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Question Screen - Frosted Glass Card */}
              <motion.div 
                key={currentIndex}
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full bg-white/45 backdrop-blur-xl border border-white/50 rounded-[2rem] py-8 px-4 shadow-lg flex flex-col items-center justify-center relative overflow-hidden"
              >
                {/* Back waves or circles for depth */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-100/30 rounded-full blur-xl" />
                <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-purple-100/30 rounded-full blur-xl" />

                <div className="flex items-center space-x-3 text-3xl font-black text-indigo-950">
                  <span>{questions[currentIndex]?.num1}</span>
                  <span className="text-indigo-500 font-black">
                    {questions[currentIndex]?.operator === '+' ? <Plus className="w-5 h-5 stroke-[3.5]" /> : <Minus className="w-5 h-5 stroke-[3.5]" />}
                  </span>
                  <span>{questions[currentIndex]?.num2}</span>
                  <span className="text-indigo-400 font-light">=</span>
                  
                  {/* Dynamic answer container - Frosted cutout */}
                  <div className="w-16 h-12 bg-white/50 border border-indigo-200/60 rounded-xl flex items-center justify-center text-indigo-700 font-black shadow-inner">
                    {currentInput !== '' ? (
                      <motion.span 
                        key={currentInput}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="p-1"
                      >
                        {currentInput}
                      </motion.span>
                    ) : (
                      <HelpCircle className="w-5 h-5 text-indigo-350 animate-pulse" />
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Custom Interactive Keypad suitable for young children - Glossy styling */}
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-3 shadow-md border border-white/45 space-y-2 mt-4 w-full max-w-md mx-auto">
              <div className="grid grid-cols-3 gap-2 text-base font-bold">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleNumClick(num.toString())}
                    className="py-2.5 bg-white/60 active:bg-indigo-100 hover:bg-white/80 border border-white/50 text-indigo-900 rounded-xl flex items-center justify-center shadow-2xs transition-colors font-extrabold"
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={handleClear}
                  className="py-2.5 bg-rose-100/50 text-rose-700 border border-rose-200/50 hover:bg-rose-100 text-xs font-bold rounded-xl flex items-center justify-center"
                >
                  清除
                </button>
                <button
                  onClick={() => handleNumClick('0')}
                  className="py-2.5 bg-white/60 active:bg-indigo-100 text-indigo-900 rounded-xl flex items-center justify-center border border-white/50 font-extrabold"
                >
                  0
                </button>
                <button
                  onClick={handleBackspace}
                  className="py-2.5 bg-neutral-100/60 text-neutral-600 active:bg-neutral-200 hover:bg-neutral-100 text-xs font-bold rounded-xl flex items-center justify-center"
                >
                  退格
                </button>
              </div>

              {/* Enter Button */}
              <button
                disabled={currentInput === ''}
                onClick={handleSubmit}
                className={`w-full py-2.5 px-4 text-xs font-extrabold text-center rounded-xl transition-all flex items-center justify-center space-x-2 ${
                  currentInput !== '' 
                    ? 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-md text-white shadow-xs' 
                    : 'bg-white/30 text-gray-400 border border-white/20 cursor-not-allowed'
                }`}
              >
                <span>确认答案</span>
              </button>
            </div>
          </>
        ) : (
          <div className="relative flex-1 flex flex-col justify-center items-center py-4">
            {/* Canvas overlay for confetti */}
            {score === 100 && (
              <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none" />
            )}

            <motion.div 
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full bg-white/40 backdrop-blur-2xl border border-white/55 rounded-[2.5rem] shadow-xl p-5 flex flex-col items-center relative z-20 text-center"
            >
              {/* Score visual */}
              <div className="relative mb-3.5">
                {score === 100 ? (
                  <motion.div 
                    initial={{ rotate: -10, scale: 0.8 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                    className="w-20 h-20 bg-amber-500/10 border border-amber-300/60 rounded-full flex items-center justify-center text-amber-500 shadow-md relative"
                  >
                    <Trophy className="w-10 h-10 stroke-[2.5]" />
                    <motion.div 
                      className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full"
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      满分!
                    </motion.div>
                  </motion.div>
                ) : (
                  <div className="w-20 h-20 bg-indigo-500/10 border border-white/60 rounded-full flex items-center justify-center text-indigo-600 shadow">
                    <Award className="w-10 h-10" />
                  </div>
                )}
              </div>

              <h3 className="font-extrabold text-lg text-indigo-950">
                {score === 100 ? '哇，太厉害了！' : '不错哟，继续努力！'}
              </h3>
              
              <div className="mt-1.5 mb-3">
                <span className="text-4xl font-black text-indigo-600">{score}</span>
                <span className="text-sm font-bold text-gray-500"> 分</span>
              </div>

              {/* TTS Voice praise */}
              <button 
                onClick={playRewardSound}
                className="flex items-center space-x-1 px-2.5 py-1 bg-white/70 border border-white hover:bg-indigo-50 hover:text-indigo-700 text-indigo-600 text-[10px] font-bold rounded-full transition mb-3.5 shadow-2xs"
              >
                <Volume2 className="w-3 h-3 text-indigo-500" />
                <span>听夸奖语音</span>
              </button>

              {/* Detailed review list */}
              <div className="w-full text-left bg-white/40 border border-white/50 rounded-2xl p-3.5 mb-4 max-h-40 overflow-y-auto">
                <h4 className="text-[9px] font-black text-indigo-900/60 mb-2 uppercase tracking-wide">答题详细结果</h4>
                <div className="space-y-1 text-xs">
                  {questions.map((q, idx) => {
                    const isCorrect = parseInt(q.userAnswer || '', 10) === q.correctAnswer;
                    return (
                      <div key={q.id} className="flex justify-between items-center py-1 border-b border-white/30 last:border-0 text-slate-700">
                        <span className="font-bold text-[10px]">
                          第 {idx + 1} 题：{q.num1} {q.operator} {q.num2} = ?
                        </span>
                        <div className="flex items-center space-x-1">
                          <span className={`font-mono font-bold ${isCorrect ? 'text-green-600' : 'text-rose-600'}`}>
                            {q.userAnswer}
                          </span>
                          {!isCorrect && (
                            <span className="text-[9px] text-slate-400 font-medium">
                              (正确: {q.correctAnswer})
                            </span>
                          )}
                          {isCorrect ? (
                            <Check className="w-3.5 h-3.5 text-green-500 stroke-[3]" />
                          ) : (
                            <X className="w-3.5 h-3.5 text-rose-500 stroke-[3]" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="w-full">
                <button
                  onClick={() => generateQuestions(settings.mathN, settings.mathM)}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow transition flex items-center justify-center space-x-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>再来一次</span>
                </button>
              </div>
            </motion.div>

            {/* Micro History under score */}
            {history.length > 0 && (
              <div className="w-full max-w-sm mt-3 text-slate-500 px-2 text-[10px]">
                <p className="font-extrabold mb-1 text-slate-900/60 uppercase tracking-widest text-[9px]">本季口算历史记录</p>
                <div className="flex flex-col space-y-1">
                  {history.slice(0, 2).map((hist, i) => (
                    <div key={i} className="flex justify-between bg-white/30 border border-white/50 rounded-lg p-2 text-slate-600">
                      <span>{hist.date}</span>
                      <span className="font-bold text-indigo-700">{hist.score} 分 ({hist.ratio})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
