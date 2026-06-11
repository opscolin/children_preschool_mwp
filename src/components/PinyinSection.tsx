/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, Shuffle, ArrowRight, RefreshCw, Layers, Sparkles, Check, X, Award, Settings, Music, BookOpen 
} from 'lucide-react';
import { PinyinItem, PinyinQuizItem, AppSettings } from '../types';
import { PINYIN_INITIALS, PINYIN_FINALS, PINYIN_SYLLABLES, playPinyinAudio, speakText } from '../data/pinyin';

interface PinyinSectionProps {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
}

export default function PinyinSection({ settings, updateSettings }: PinyinSectionProps) {
  // Navigation inside this tab: 'study' (认读/跟读) | 'practice' (听音练习)
  const [subTab, setSubTab] = useState<'study' | 'practice'>('study');
  
  // Study variables
  const [currentCategory, setCurrentCategory] = useState<'initial' | 'final' | 'syllable'>('initial');
  const [isRandomMode, setIsRandomMode] = useState<boolean>(false);
  const [pinyinList, setPinyinList] = useState<PinyinItem[]>(PINYIN_INITIALS);

  // Settings Configuration states
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [tempZ, setTempZ] = useState<number>(settings.pinyinZ);

  // Practice/Listening Quiz variables
  const [quizQuestions, setQuizQuestions] = useState<PinyinQuizItem[]>([]);
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
  const [selectedOpt, setSelectedOpt] = useState<PinyinItem | null>(null);

  // Sync settings
  useEffect(() => {
    setTempZ(settings.pinyinZ);
  }, [settings]);

  // Handle category changes and order/shuffle modes in study panel
  useEffect(() => {
    let source: PinyinItem[];
    if (currentCategory === 'initial') source = PINYIN_INITIALS;
    else if (currentCategory === 'final') source = PINYIN_FINALS;
    else source = PINYIN_SYLLABLES;

    if (isRandomMode) {
      setPinyinList([...source].sort(() => 0.5 - Math.random()));
    } else {
      setPinyinList(source);
    }
  }, [currentCategory, isRandomMode]);

  // Practice: Generate Z questions for listening practice.
  const startPinyinPractice = () => {
    const allPinyins = [...PINYIN_INITIALS, ...PINYIN_FINALS, ...PINYIN_SYLLABLES];
    const questions: PinyinQuizItem[] = [];

    for (let i = 0; i < settings.pinyinZ; i++) {
      const target = allPinyins[Math.floor(Math.random() * allPinyins.length)];
      
      const otherOptions = allPinyins
        .filter((item) => item.char !== target.char)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      
      const options = [target, ...otherOptions].sort(() => 0.5 - Math.random());

      questions.push({
        id: i + 1,
        correctAnswer: target,
        options,
        userAnswer: undefined,
        isCorrect: undefined
      });
    }

    setQuizQuestions(questions);
    setQuizIndex(0);
    setQuizAnswered(false);
    setSelectedOpt(null);
    setQuizFinished(false);
    setQuizScore(0);
    
    if (questions.length > 0) {
      setTimeout(() => {
        playPinyinAudio(questions[0].correctAnswer);
      }, 500);
    }
  };

  const replayPracticeSound = () => {
    const currentQ = quizQuestions[quizIndex];
    if (currentQ) {
      playPinyinAudio(currentQ.correctAnswer);
    }
  };

  const handleSelectOption = (item: PinyinItem) => {
    if (quizAnswered) return;
    
    setSelectedOpt(item);
    setQuizAnswered(true);

    const currentQ = quizQuestions[quizIndex];
    const isCorrect = item.char === currentQ.correctAnswer.char;

    const updatedQs = [...quizQuestions];
    updatedQs[quizIndex].userAnswer = item;
    updatedQs[quizIndex].isCorrect = isCorrect;
    setQuizQuestions(updatedQs);

    const voiceFeedback = isCorrect ? '真聪明！答对啦！' : '哎呀，选错啦，继续加油哦！';
    speakText(voiceFeedback, 0.9);
  };

  const handleNextQuizQuestion = () => {
    if (quizIndex < quizQuestions.length - 1) {
      setQuizIndex((prev) => prev + 1);
      setQuizAnswered(false);
      setSelectedOpt(null);
      
      setTimeout(() => {
        playPinyinAudio(quizQuestions[quizIndex + 1].correctAnswer);
      }, 300);
    } else {
      let rights = 0;
      quizQuestions.forEach((q) => {
        if (q.isCorrect) rights++;
      });
      const scorePercentage = Math.round((rights / quizQuestions.length) * 100);
      setQuizScore(scorePercentage);
      setQuizFinished(true);
    }
  };

  const applyConfig = () => {
    updateSettings({
      pinyinZ: tempZ
    });
    setShowConfig(false);
  };

  return (
    <div className="relative flex flex-col h-full bg-transparent overflow-hidden">
      {/* Settings Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/30 backdrop-blur-md border-b border-white/40 shadow-xs relative z-10">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-emerald-500/10 text-emerald-700 border border-white/40 rounded-xl">
            <Music className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-emerald-950 text-sm">拼音乐园</h2>
            <p className="text-[10px] text-emerald-800 font-semibold">
              拼音认读与每日听读练习
            </p>
          </div>
        </div>
        
        <button 
          id="btn_pinyin_settings"
          onClick={() => setShowConfig(!showConfig)}
          className="flex items-center space-x-1 px-2.5 py-1 text-[10px] font-bold text-emerald-950 bg-white/50 border border-white/60 hover:bg-white/80 rounded-xl transition-all shadow-2xs"
        >
          <Settings className="w-3 h-3" />
          <span>练习参数</span>
        </button>
      </div>

      {/* Internal configuration slider - Absolute z-index overlay to prevent overlap */}
      <AnimatePresence>
        {showConfig && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-[49px] inset-x-0 z-50 bg-white/95 backdrop-blur-2xl border-b border-emerald-100 px-4 py-4 space-y-4 shadow-xl rounded-b-2xl overflow-hidden"
          >
            <div className="space-y-3">
              <h3 className="text-[10px] font-black text-emerald-900/60 uppercase tracking-wider font-sans">听音练习题目设置</h3>
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600">听音测试题目数量 (Z)</label>
                <select 
                  value={tempZ} 
                  onChange={(e) => setTempZ(parseInt(e.target.value))}
                  className="w-full text-xs rounded-xl border border-white/60 bg-white/50 p-2 text-emerald-950 font-bold focus:ring-2 focus:ring-emerald-300 outline-none"
                >
                  <option value={3}>每日 3 道题</option>
                  <option value={5}>每日 5 道题</option>
                  <option value={10}>每日 10 道题</option>
                  <option value={15}>每日 15 道题</option>
                </select>
              </div>

              <div className="flex space-x-2 pt-1">
                <button
                  onClick={applyConfig}
                  className="flex-1 py-1.5 text-xs font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition shadow-xs"
                >
                  确定修改
                </button>
                <button
                  onClick={() => {
                    setTempZ(settings.pinyinZ);
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

      {/* Sub Tabs Toggle */}
      <div className="px-4 mt-3 flex relative z-10">
        <div className="bg-white/30 backdrop-blur-md border border-white/40 p-1 rounded-2xl flex w-full shadow-2xs">
          <button 
            onClick={() => setSubTab('study')}
            className={`flex-1 py-2 text-[11px] font-extrabold rounded-xl text-center transition flex items-center justify-center space-x-1.5 ${
              subTab === 'study' 
                ? 'bg-white/80 text-emerald-900 border border-white shadow-xs' 
                : 'text-gray-500 hover:text-gray-755'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span>顺序字母表跟读</span>
          </button>
          <button 
            onClick={() => {
              setSubTab('practice');
              startPinyinPractice();
            }}
            className={`flex-1 py-2 text-[11px] font-extrabold rounded-xl text-center transition flex items-center justify-center space-x-1.5 ${
              subTab === 'practice' 
                ? 'bg-white/80 text-emerald-950 border border-white shadow-xs animate-pulse-subtle' 
                : 'text-gray-500 hover:text-gray-755'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5 text-indigo-650" />
            <span>听音点击大练习</span>
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 flex flex-col overflow-y-auto">
        {subTab === 'study' ? (
          /* Alphabet card browser page */
          <div className="space-y-4 max-w-4xl mx-auto w-full">
            {/* Category selection */}
            <div className="flex justify-between items-center bg-white/40 backdrop-blur-md border border-white/50 rounded-2xl p-2 shadow-xs">
              <div className="flex space-x-1">
                {(['initial', 'final', 'syllable'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCurrentCategory(cat)}
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-xl transition ${
                      currentCategory === cat 
                        ? 'bg-emerald-600 border border-emerald-500 text-white shadow-xs' 
                        : 'text-emerald-900/80 hover:bg-emerald-100/40'
                    }`}
                  >
                    {cat === 'initial' ? '23声母' : cat === 'final' ? '24韵母' : '16整体认读'}
                  </button>
                ))}
              </div>

              {/* Order / Random toggle */}
              <button
                onClick={() => setIsRandomMode(!isRandomMode)}
                className={`flex items-center space-x-1 px-2.5 py-1 text-[10px] font-black rounded-xl border transition ${
                  isRandomMode 
                    ? 'bg-amber-100/50 text-amber-700 border-amber-300' 
                    : 'bg-white/50 text-gray-400 border-white/60 shadow-inner'
                }`}
              >
                <Shuffle className="w-3 h-3 text-amber-500" />
                <span>{isRandomMode ? '随机跟读' : '顺序跟读'}</span>
              </button>
            </div>

            {/* Quick guide text */}
            <p className="text-[9px] font-extrabold text-emerald-800/80 text-center flex justify-center items-center space-x-1">
              <span>💡 小提示：手指点击下方声韵母卡片，就可以收听标准配音拼读啦！</span>
            </p>

            {/* Interactive Grid of Cards */}
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 sm:gap-3">
              {pinyinList.map((item, index) => (
                <motion.button
                  key={`${item.char}-${index}`}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: Math.min(index * 0.012, 0.2) }}
                  onClick={() => playPinyinAudio(item)}
                  type="button"
                  className="bg-white/45 backdrop-blur-md border border-white/60 hover:border-emerald-300 hover:bg-white/80 text-gray-800 rounded-2xl py-3 flex flex-col items-center justify-center shadow-2xs transition-all relative group"
                >
                  <Volume2 className="w-2.5 h-2.5 text-emerald-300 absolute top-1.5 right-1.5 opacity-60 group-hover:opacity-100" />
                  
                  <span className="text-lg font-black text-emerald-900 font-mono">
                    {item.char}
                  </span>
                  
                  <span className="text-[8px] text-gray-450 font-black mt-1 bg-white/60 px-1 py-0.5 rounded-md">
                    {item.audioText}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          /* Practice/Quiz listening section built dynamically */
          <div className="flex-1 flex flex-col justify-between w-full max-w-md mx-auto">
            {!quizFinished ? (
              <>
                {quizQuestions.length > 0 && (
                  <div className="flex-1 flex flex-col justify-between space-y-4">
                    {/* Header score tracker and pronunciation speaker button */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-emerald-800 bg-white/70 border border-white/60 px-3 py-1 rounded-full shadow-2xs">
                          听音辨字测试
                        </span>
                        <span className="text-emerald-950 font-black">
                          {quizIndex + 1} <span className="text-emerald-450 font-normal">/</span> {settings.pinyinZ} 题
                        </span>
                      </div>

                      {/* Question panel card - Glassmorphic design */}
                      <div className="bg-white/45 backdrop-blur-xl border border-white/50 rounded-3xl py-7 px-4 shadow-lg flex flex-col items-center text-center relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-100/30 rounded-full blur-xl animate-pulse" />
                        
                        <p className="text-xs text-emerald-950 font-bold flex items-center space-x-1.5 mb-3.5 z-10">
                          <span>👂 大耳朵听一听，然后选出拼音</span>
                        </p>

                        <button
                          onClick={replayPracticeSound}
                          className="w-16 h-16 bg-white border border-white/70 hover:border-emerald-300 text-emerald-600 rounded-full flex items-center justify-center shadow-md active:scale-95 hover:bg-emerald-50 transition-all mb-3 relative z-10"
                        >
                          <Volume2 className="w-7 h-7 stroke-[2.5]" />
                          <div className="absolute inset-0 rounded-full bg-emerald-400 opacity-20 animate-ping" />
                        </button>

                        <span className="text-[10px] text-emerald-700 font-bold z-10">
                          点击喇叭重复播放
                        </span>
                      </div>
                    </div>

                    {/* Question option card grids */}
                    <div className="grid grid-cols-2 gap-3">
                      {quizQuestions[quizIndex]?.options.map((opt) => {
                        const isChosen = selectedOpt?.char === opt.char;
                        const correctItem = quizQuestions[quizIndex].correctAnswer;
                        const isCorrectAnswer = opt.char === correctItem.char;

                        let cardStyle = "bg-white/50 border border-white/60 text-emerald-950 shadow-2xs";
                        if (quizAnswered) {
                          if (isCorrectAnswer) {
                            cardStyle = "bg-green-100/60 backdrop-blur-md border border-green-500 text-green-800 shadow-xs";
                          } else if (isChosen) {
                            cardStyle = "bg-rose-100/60 backdrop-blur-md border border-rose-500 text-rose-800 shadow-xs";
                          } else {
                            cardStyle = "bg-white/20 border border-white/30 text-gray-300 opacity-50";
                          }
                        } else {
                          cardStyle = "bg-white/60 border border-white/65 hover:border-emerald-300 active:bg-emerald-50 shadow-2xs";
                        }

                        return (
                          <motion.button
                            key={opt.char}
                            disabled={quizAnswered}
                            onClick={() => handleSelectOption(opt)}
                            className={`py-4 rounded-2xl flex flex-col justify-center items-center font-bold text-center transition-all ${cardStyle}`}
                          >
                            <span className="text-xl font-black font-mono">
                              {opt.char}
                            </span>
                            <span className="text-[9px] mt-0.5 font-bold">
                              拼音: {opt.audioText}
                            </span>

                            {/* Check or X state badge */}
                            {quizAnswered && isCorrectAnswer && (
                              <Check className="w-4 h-4 text-green-600 mt-1.5 stroke-[3]" />
                            )}
                            {quizAnswered && isChosen && !isCorrectAnswer && (
                              <X className="w-4 h-4 text-rose-500 mt-1.5 stroke-[3]" />
                            )}
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Action buttons to go next task */}
                    <div className="pt-2">
                      <button
                        onClick={handleNextQuizQuestion}
                        disabled={!quizAnswered}
                        className={`w-full py-2.5 px-4 text-xs font-black rounded-xl shadow-xs transition flex items-center justify-center space-x-1.5 ${
                          quizAnswered 
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                            : 'bg-white/30 text-gray-400 border border-white/20 cursor-not-allowed'
                        }`}
                      >
                        <span>{quizIndex < quizQuestions.length - 1 ? '下一题' : '拼音通关结算'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Practice finished score tallies screen card */
              <div className="flex-1 flex flex-col justify-center items-center py-4 text-center w-full max-w-md mx-auto">
                <motion.div 
                  initial={{ scale: 0.92, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-full bg-white/45 backdrop-blur-2xl border border-white/55 rounded-[2.5rem] p-5 flex flex-col items-center shadow-lg"
                >
                  <div className="relative mb-3.5">
                    <div className="w-16 h-16 bg-emerald-500/10 border border-white/60 rounded-full flex items-center justify-center text-emerald-500 shadow shadow-emerald-100/50">
                      <Award className="w-9 h-9" />
                    </div>
                  </div>

                  <h3 className="font-extrabold text-base text-emerald-950">
                    听音大练习通关啦！
                  </h3>
                  
                  <div className="mt-1.5 mb-3">
                    <span className="text-4xl font-black text-emerald-600">{quizScore}</span>
                    <span className="text-sm font-bold text-gray-500"> 分</span>
                  </div>

                  <p className="text-[10px] text-gray-500 mb-5 font-bold">
                    今日挑战 {settings.pinyinZ} 道拼音题目，大获全胜！
                  </p>

                  <button
                    onClick={startPinyinPractice}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center space-x-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>再次挑战</span>
                  </button>
                </motion.div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
