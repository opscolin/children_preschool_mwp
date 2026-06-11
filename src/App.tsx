/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calculator, BookOpen, Music, Settings, Star, GraduationCap, Heart, HelpCircle 
} from 'lucide-react';
import { AppSettings } from './types';
import MathQuiz from './components/MathQuiz';
import PoetryRecitation from './components/PoetryRecitation';
import PinyinSection from './components/PinyinSection';

const DEFAULT_SETTINGS: AppSettings = {
  mathN: 20, // 20以内
  mathM: 10, // 10道题
  poetryX: 2, // 每日2首
  poetryY: 10, // 累计10颗星达标
  pinyinZ: 5, // 拼音每日5道练习题
};

export default function App() {
  // App-wide active tab: 'math' | 'poetry' | 'pinyin'
  const [activeTab, setActiveTab] = useState<'math' | 'poetry' | 'pinyin'>('math');

  // Load set parameters
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('applet_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  // Calculate local time child friendly greeting
  const [greeting, setGreeting] = useState<string>('你好鸭！');

  useEffect(() => {
    localStorage.setItem('applet_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 9) setGreeting('早上好，元气满满！☀️');
    else if (hour < 13) setGreeting('中午好，记得午休哦！🍱');
    else if (hour < 18) setGreeting('下午好，一起来学习吧！🍵');
    else setGreeting('晚上好，今天收获满满！🌙');
  }, []);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
    }));
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-4 px-2 sm:py-8 select-none font-sans"
      style={{
        background: 'radial-gradient(circle at 0% 0%, #e0e7ff 0%, #fef2f2 50%, #fff7ed 100%)'
      }}
    >
      
      {/* High-fidelity responsive mockup container - perfect for PC, Pad, and Mobile */}
      <div 
        id="app_h5_container"
        className="w-full max-w-sm md:max-w-2xl lg:max-w-3xl xl:max-w-4xl h-[760.0px] sm:h-[820.0px] md:h-[860.0px] max-h-[96vh] bg-white/30 backdrop-blur-2xl border border-white/50 rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(100,116,139,0.25)] flex flex-col relative overflow-hidden transition-all duration-300"
      >
        {/* Dynamic camera notch sensor for the mock cell shell */}
        <div className="absolute top-0 inset-x-0 h-6 bg-slate-800/10 backdrop-blur-xs flex justify-center items-center z-50">
          <div className="w-20 h-3.5 bg-slate-950/20 rounded-full flex justify-between px-3 items-center">
            <span className="w-1 h-1 bg-slate-400/80 rounded-full" />
            <span className="w-6 h-1 bg-slate-400/50 rounded-full" />
            <span className="w-1 h-1 bg-indigo-400/80 rounded-full" />
          </div>
        </div>

        {/* Top Kid Banner / Personalized Mascot Greeting - Glossy styling */}
        <div className="pt-8 px-4 pb-3 bg-white/40 backdrop-blur-xl border-b border-white/40 text-indigo-950 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-lg shadow-sm border border-white/50 animate-bounce">
              👶
            </div>
            <div>
              <h1 className="text-xs font-black tracking-wider bg-gradient-to-br from-indigo-800 to-purple-800 bg-clip-text text-transparent flex items-center space-x-1 uppercase">
                <span>奇妙学习屋</span>
                <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
              </h1>
              <p className="text-[9px] text-indigo-700/80 font-bold">
                {greeting}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1 bg-white/60 px-2.5 py-1 rounded-full border border-white/80 text-[9px] font-extrabold text-indigo-700 shadow-xs">
            <Heart className="w-2.5 h-2.5 fill-rose-500 text-rose-500" />
            <span>学习伴学</span>
          </div>
        </div>

        {/* Internal Core Views Area */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {activeTab === 'math' && (
              <motion.div
                key="math"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="h-full w-full"
              >
                <MathQuiz 
                  settings={settings} 
                  updateSettings={updateSettings} 
                />
              </motion.div>
            )}

            {activeTab === 'poetry' && (
              <motion.div
                key="poetry"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="h-full w-full"
              >
                <PoetryRecitation 
                   settings={settings} 
                   updateSettings={updateSettings} 
                />
              </motion.div>
            )}

            {activeTab === 'pinyin' && (
              <motion.div
                key="pinyin"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="h-full w-full"
              >
                <PinyinSection 
                  settings={settings} 
                  updateSettings={updateSettings} 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* H5 Standard Bottom Tab Navigation Bar - Frosted look */}
        <div className="bg-white/50 backdrop-blur-xl border-t border-white/60 py-2.5 px-4 flex justify-around items-center text-center shadow-md relative z-40">
          
          {/* Tab Math */}
          <button
            id="tab_math"
            onClick={() => setActiveTab('math')}
            className="flex-1 flex flex-col items-center justify-center space-y-1 relative"
          >
            <div className={`p-2 rounded-xl transition-all ${
              activeTab === 'math' 
                ? 'bg-indigo-500/10 text-indigo-700 shadow-xs border border-white/50' 
                : 'text-gray-500 hover:text-gray-600'
            }`}>
              <Calculator className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className={`text-[10px] font-extrabold tracking-wide transition-all ${
              activeTab === 'math' ? 'text-indigo-800 font-black' : 'text-gray-500/80'
            }`}>
              趣味口算
            </span>
            {activeTab === 'math' && (
              <motion.div 
                layoutId="activeIndicator" 
                className="absolute bottom-[-10.0px] w-5 h-1 bg-indigo-600 rounded-full shadow-xs" 
              />
            )}
          </button>

          {/* Tab Poetry */}
          <button
            id="tab_poetry"
            onClick={() => setActiveTab('poetry')}
            className="flex-1 flex flex-col items-center justify-center space-y-1 relative"
          >
            <div className={`p-2 rounded-xl transition-all ${
              activeTab === 'poetry' 
                ? 'bg-orange-500/10 text-orange-700 shadow-xs border border-white/50' 
                : 'text-gray-500 hover:text-gray-600'
            }`}>
              <BookOpen className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className={`text-[10px] font-extrabold tracking-wide transition-all ${
              activeTab === 'poetry' ? 'text-orange-800 font-black' : 'text-gray-500/80'
            }`}>
              古诗背诵
            </span>
            {activeTab === 'poetry' && (
              <motion.div 
                layoutId="activeIndicator" 
                className="absolute bottom-[-10.0px] w-5 h-1 bg-orange-500 rounded-full shadow-xs" 
              />
            )}
          </button>

          {/* Tab Pinyin */}
          <button
            id="tab_pinyin"
            onClick={() => setActiveTab('pinyin')}
            className="flex-1 flex flex-col items-center justify-center space-y-1 relative"
          >
            <div className={`p-2 rounded-xl transition-all ${
              activeTab === 'pinyin' 
                ? 'bg-emerald-500/10 text-emerald-700 shadow-xs border border-white/50' 
                : 'text-gray-500 hover:text-gray-600'
            }`}>
              <Music className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className={`text-[10px] font-extrabold tracking-wide transition-all ${
              activeTab === 'pinyin' ? 'text-emerald-800 font-black' : 'text-gray-500/80'
            }`}>
              拼音启蒙
            </span>
            {activeTab === 'pinyin' && (
              <motion.div 
                layoutId="activeIndicator" 
                className="absolute bottom-[-10.0px] w-5 h-1 bg-emerald-500 rounded-full shadow-xs" 
              />
            )}
          </button>

        </div>
      </div>
    </div>
  );
}
