/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, Star, RefreshCw, Layers, Sparkles, AlertCircle, BookOpenCheck, Settings, Eye, EyeOff, CheckCircle, RotateCcw 
} from 'lucide-react';
import { Poem, PoemProgress, AppSettings } from '../types';
import { CLASSIC_POEMS } from '../data/poems';
import { speakText } from '../data/pinyin';

interface PoetryRecitationProps {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
}

export default function PoetryRecitation({ settings, updateSettings }: PoetryRecitationProps) {
  // Saved poem progress (mastery record)
  const [progresses, setProgresses] = useState<PoemProgress[]>(() => {
    const saved = localStorage.getItem('poetry_progresses');
    return saved ? JSON.parse(saved) : [];
  });

  // Today's selected poems list
  const [dailyPoems, setDailyPoems] = useState<Poem[]>([]);
  const [expandedPoemId, setExpandedPoemId] = useState<string | null>(null);
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [isPoemDatabaseExhausted, setIsPoemDatabaseExhausted] = useState<boolean>(false);

  // Parent/dashboard view mode: 'daily' | 'all_mastery'
  const [viewMode, setViewMode] = useState<'daily' | 'all_mastery'>('daily');

  // Temp local config inputs
  const [tempX, setTempX] = useState<number>(settings.poetryX);
  const [tempY, setTempY] = useState<number>(settings.poetryY);

  useEffect(() => {
    setTempX(settings.poetryX);
    setTempY(settings.poetryY);
  }, [settings]);

  // Save progress when it changes
  useEffect(() => {
    localStorage.setItem('poetry_progresses', JSON.stringify(progresses));
  }, [progresses]);

  // Load or generate today's random poems
  useEffect(() => {
    loadDailyPoems();
  }, [progresses, settings.poetryX, settings.poetryY]);

  const loadDailyPoems = (force: boolean = false) => {
    // 1. Get all poems that are NOT mastered yet
    const masteredIds = progresses
      .filter((p) => p.stars >= settings.poetryY)
      .map((p) => p.poemId);

    const availablePoems = CLASSIC_POEMS.filter((p) => !masteredIds.includes(p.id));

    if (availablePoems.length === 0) {
      setIsPoemDatabaseExhausted(true);
      setDailyPoems([]);
      return;
    } else {
      setIsPoemDatabaseExhausted(false);
    }

    // 2. Check if we already chose daily poems for today in localStorage
    const todayDate = new Date().toDateString(); // e.g. "Thu Jun 11 2026"
    
    if (force) {
      localStorage.removeItem('poetry_selected_daily');
      localStorage.removeItem('poetry_selected_date');
    }
    
    const savedDailyStr = force ? null : localStorage.getItem('poetry_selected_daily');
    const savedDailyDate = force ? null : localStorage.getItem('poetry_selected_date');

    if (savedDailyDate === todayDate && savedDailyStr) {
      try {
        const parsedIds: string[] = JSON.parse(savedDailyStr);
        // Make sure none of these became mastered after previous selection
        const filterAvailableIds = parsedIds.filter(id => !masteredIds.includes(id));
        
        if (filterAvailableIds.length > 0) {
          const poemsList = CLASSIC_POEMS.filter(p => filterAvailableIds.includes(p.id));
          // If Count changed, we may want to recreate - but only return if it matches current config poetryX
          if (poemsList.length === settings.poetryX) {
            setDailyPoems(poemsList);
            return;
          }
        }
      } catch (e) {
        console.error("Error reading saved daily poems", e);
      }
    }

    // 3. Otherwise, pick fresh randomized X poems from available list
    const shuffled = [...availablePoems].sort(() => 0.5 - Math.random());
    const count = Math.min(settings.poetryX, shuffled.length);
    const selected = shuffled.slice(0, count);

    setDailyPoems(selected);
    
    // Save selection to localStorage so it stays consistent throughout the same day
    const selectedIds = selected.map((p) => p.id);
    localStorage.setItem('poetry_selected_daily', JSON.stringify(selectedIds));
    localStorage.setItem('poetry_selected_date', todayDate);
  };

  // Give standard stars review
  const handleRateStars = (poemId: string, starRatingValue: number) => {
    setProgresses((prev) => {
      const idx = prev.findIndex((p) => p.poemId === poemId);
      const todayDate = new Date().toLocaleDateString('zh-CN');

      if (idx > -1) {
        const current = prev[idx];
        const newStars = current.stars + starRatingValue;
        const updated = [...prev];
        updated[idx] = {
          ...current,
          stars: newStars,
          mastered: newStars >= settings.poetryY,
          lastReviewed: todayDate,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            poemId,
            stars: starRatingValue,
            mastered: starRatingValue >= settings.poetryY,
            lastReviewed: todayDate,
          },
        ];
      }
    });

    // Play kids friendly voice evaluation feedback
    let ratingWord = '优秀！';
    if (starRatingValue === 1) ratingWord = '一般！继续努力。';
    if (starRatingValue === 2) ratingWord = '良好！非常好一些了。';
    if (starRatingValue === 3) ratingWord = '优秀！太棒啦，给你三颗星！';
    
    speakText(`打分${ratingWord}`, 0.88);
  };

  // Get cumulative stars for a poem
  const getPoemCumulativeStars = (poemId: string): number => {
    const progress = progresses.find((p) => p.poemId === poemId);
    return progress ? progress.stars : 0;
  };

  // Reset mastered progress entirely
  const handleResetProgress = () => {
    if (window.confirm('您确定要重置所有古诗的背诵进度（清除所有已获得星星）吗？')) {
      setProgresses([]);
      localStorage.removeItem('poetry_selected_daily');
      localStorage.removeItem('poetry_selected_date');
      alert('已成功清除所有星星记录！所有的诗词均已重置为：学习中。');
    }
  };

  const applyConfig = () => {
    updateSettings({
      poetryX: tempX,
      poetryY: tempY
    });
    // Clear selections cache to force regenerate right after targets are changed
    localStorage.removeItem('poetry_selected_daily');
    localStorage.removeItem('poetry_selected_date');
    setShowConfig(false);
  };

  return (
    <div className="relative flex flex-col h-full bg-transparent overflow-hidden">
      {/* Header section with setup and title */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/30 backdrop-blur-md border-b border-white/40 shadow-xs relative z-10">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-orange-500/10 text-orange-700 border border-white/40 rounded-xl">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-orange-950 text-sm">每日背古诗</h2>
            <p className="text-[10px] text-orange-800 font-semibold">
              每日{settings.poetryX}首 · 累计{settings.poetryY}星即学会
            </p>
          </div>
        </div>
        
        <button 
          id="btn_poetry_settings"
          onClick={() => setShowConfig(!showConfig)}
          className="flex items-center space-x-1 px-2.5 py-1 text-[10px] font-bold text-orange-950 bg-white/50 border border-white/60 hover:bg-white/80 rounded-xl transition-all shadow-2xs"
        >
          <Settings className="w-3 h-3" />
          <span>诗词参数</span>
        </button>
      </div>

      {/* Settings Panel - Absolute overlay layout */}
      <AnimatePresence>
        {showConfig && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-[49px] inset-x-0 z-50 bg-white/95 backdrop-blur-2xl border-b border-orange-100 px-4 py-4 space-y-4 shadow-xl rounded-b-2xl overflow-hidden"
          >
            <div className="space-y-3">
              <h3 className="text-[10px] font-black text-orange-900/60 uppercase tracking-wider font-sans">每日背诵目标设置</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600">每日背诵数量 (X)</label>
                  <select 
                    value={tempX} 
                    onChange={(e) => setTempX(parseInt(e.target.value))}
                    className="w-full text-xs rounded-xl border border-white/60 bg-white/50 p-2 text-orange-950 font-bold focus:ring-2 focus:ring-orange-300 outline-none"
                  >
                    <option value={1}>每天 1 首</option>
                    <option value={2}>每天 2 首</option>
                    <option value={3}>每天 3 首</option>
                    <option value={5}>每天 5 首</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600">达标总星数 (Y)</label>
                  <select 
                    value={tempY} 
                    onChange={(e) => setTempY(parseInt(e.target.value))}
                    className="w-full text-xs rounded-xl border border-white/60 bg-white/50 p-2 text-orange-950 font-bold focus:ring-2 focus:ring-orange-300 outline-none"
                  >
                    <option value={10}>累计获得 10 颗星</option>
                    <option value={20}>累计获得 20 颗星</option>
                    <option value={30}>累计获得 30 颗星</option>
                    <option value={50}>累计获得 50 颗星</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-2 pt-1">
                <button
                  onClick={applyConfig}
                  className="flex-1 py-1.5 text-xs font-bold text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition shadow-xs"
                >
                  确定修改
                </button>
                <button
                  onClick={() => {
                    setTempX(settings.poetryX);
                    setTempY(settings.poetryY);
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

      {/* Main View Mode Selector */}
      <div className="px-4 mt-3 flex">
        <div className="bg-white/30 backdrop-blur-md border border-white/40 p-1 rounded-2xl flex w-full shadow-2xs">
          <button 
            onClick={() => setViewMode('daily')}
            className={`flex-1 py-2 text-[11px] font-extrabold rounded-xl text-center transition flex items-center justify-center space-x-1.5 ${
              viewMode === 'daily' 
                ? 'bg-white/80 text-orange-900 border border-white shadow-xs' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-650" />
            <span>今日必背古诗</span>
          </button>
          <button 
            onClick={() => setViewMode('all_mastery')}
            className={`flex-1 py-2 text-[11px] font-extrabold rounded-xl text-center transition flex items-center justify-center space-x-1.5 ${
              viewMode === 'all_mastery' 
                ? 'bg-white/80 text-orange-900 border border-white shadow-xs' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-650" />
            <span>背诵进度看板</span>
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 flex flex-col overflow-y-auto">
        {viewMode === 'daily' ? (
          <>
            {isPoemDatabaseExhausted ? (
              <div className="my-auto flex flex-col items-center justify-center text-center p-5 bg-white/45 backdrop-blur-md border border-white/50 rounded-[2rem] shadow-md max-w-md mx-auto">
                <div className="p-3.5 bg-orange-100/40 rounded-full text-orange-650 border border-white/60 mb-3">
                  <BookOpenCheck className="w-10 h-10 stroke-[2]" />
                </div>
                <h3 className="font-extrabold text-base text-orange-950">全部超级大满贯！</h3>
                <p className="text-xs text-slate-500 mt-2 max-w-xs leading-relaxed">
                  你太棒了！古诗词库里的所有诗词你都成功学会了！你可以让爸爸妈妈重置进度，重新挑战哦！
                </p>
                <button
                  onClick={handleResetProgress}
                  className="mt-5 px-4 py-2 bg-orange-600 text-white font-bold text-xs rounded-xl hover:bg-orange-700 shadow-sm transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>重置所有背诵进度</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4 max-w-4xl mx-auto w-full">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[10px] font-black text-orange-900/60 uppercase tracking-widest">
                    今日任务 ({dailyPoems.length} 首)
                  </span>
                  <button 
                    onClick={() => loadDailyPoems(true)}
                    className="flex items-center space-x-1 text-xs font-bold text-orange-700 bg-white/40 px-2 py-0.5 border border-white/50 rounded-xl hover:bg-white/60 cursor-pointer"
                  >
                    <RefreshCw className="w-2.5 h-2.5" />
                    <span>换一组</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dailyPoems.map((poem, index) => {
                    const cumStars = getPoemCumulativeStars(poem.id);
                    const isMastered = cumStars >= settings.poetryY;
                    const isExpanded = expandedPoemId === poem.id;

                    return (
                      <motion.div 
                        key={poem.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08 }}
                        className="bg-white/45 backdrop-blur-xl border border-white/50 rounded-2xl p-4 shadow-sm flex flex-col relative overflow-hidden h-fit"
                      >
                        {/* Mastered ribbon badge if any */}
                        {isMastered && (
                          <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[9px] font-black px-2.5 py-0.5 rounded-bl-xl flex items-center space-x-0.5 shadow-xs">
                            <CheckCircle className="w-2.5 h-2.5" />
                            <span>已学完</span>
                          </div>
                        )}

                      {/* Header with Title Author Dynasty */}
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-extrabold text-base text-gray-800 tracking-tight">{poem.title}</h3>
                          <p className="text-[10px] font-bold text-gray-450 mt-1">
                            [{poem.dynasty}] · {poem.author}
                          </p>
                        </div>

                        {/* Stars accumulation guide */}
                        <div className="flex flex-col items-end">
                          <span className="text-[9px] font-black text-orange-700 bg-orange-100/50 border border-orange-200/40 px-2   rounded-full mb-1">
                            {cumStars} / {settings.poetryY} 星
                          </span>
                          <div className="flex space-x-px">
                            {Array.from({ length: Math.min(settings.poetryY, 5) }).map((_, starIdx) => (
                              <Star 
                                key={starIdx} 
                                className={`w-3.5 h-3.5 ${
                                  starIdx < cumStars ? 'text-amber-500 fill-amber-500' : 'text-gray-200'
                                }`} 
                              />
                            ))}
                            {settings.poetryY > 5 && (
                              <span className="text-[10px] font-bold text-gray-400 ml-1">...</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Reveal entire poem content */}
                      <AnimatePresence initial={false}>
                        {isExpanded ? (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 pt-3 border-t border-white/40 space-y-3"
                          >
                            {/* Poem recitation cards lines */}
                            <div className="text-center py-2.5 bg-white/30 rounded-xl space-y-1.5 border border-dashed border-orange-200/50">
                              {poem.content.map((line, idx) => (
                                <p key={idx} className="font-serif font-black text-orange-950 text-sm tracking-widest leading-relaxed">
                                  {line}
                                </p>
                              ))}
                            </div>

                            {/* Vernacular children translation */}
                            {poem.translation && (
                              <div className="bg-amber-50/50 border border-amber-200/30 rounded-xl p-3">
                                <h4 className="text-[10px] font-bold text-amber-950 mb-0.5 flex items-center space-x-1">
                                  <span>💡 译诗意 (宝贝好懂)</span>
                                </h4>
                                <p className="text-[10px] text-amber-900/80 leading-relaxed font-semibold">
                                  {poem.translation}
                                </p>
                              </div>
                            )}

                            {/* Parent Grading Stars Console */}
                            <div className="bg-white/60 rounded-xl p-3 border border-orange-100/40 text-center space-y-1.5">
                              <p className="text-[10px] font-black text-orange-950">
                                自主评定：小朋友背诵如何？
                              </p>
                              
                              <div className="grid grid-cols-4 gap-1.5">
                                <button
                                  onClick={() => handleRateStars(poem.id, 0)}
                                  className="py-1 text-[9px] font-black rounded-lg border bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 transition shadow-2xs"
                                >
                                  未会 (0星)
                                </button>
                                <button
                                  onClick={() => handleRateStars(poem.id, 1)}
                                  className="py-1 text-[9px] font-black rounded-lg border bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 transition flex items-center justify-center space-x-0.5 shadow-2xs"
                                >
                                  <span>一般</span>
                                  <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                                </button>
                                <button
                                  onClick={() => handleRateStars(poem.id, 2)}
                                  className="py-1 text-[9px] font-black rounded-lg border bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100 transition flex items-center justify-center space-x-0.5 shadow-2xs"
                                >
                                  <span>良好</span>
                                  <span className="flex space-x-px">
                                    <Star className="w-2 h-2 fill-sky-500 text-sky-500" />
                                    <Star className="w-2 h-2 fill-sky-500 text-sky-500" />
                                  </span>
                                </button>
                                <button
                                  onClick={() => handleRateStars(poem.id, 3)}
                                  className="py-1 text-[9px] font-black rounded-lg border bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 transition flex items-center justify-center space-x-0.5 shadow-2xs"
                                >
                                  <span>优秀</span>
                                  <span className="flex space-x-px">
                                    <Star className="w-2 h-2 fill-emerald-550 text-emerald-550" />
                                    <Star className="w-2 h-2 fill-emerald-550 text-emerald-550" />
                                  </span>
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>

                      {/* Expand Toggle Button */}
                      <button
                        onClick={() => setExpandedPoemId(isExpanded ? null : poem.id)}
                        className={`mt-3 w-full py-2 text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 border transition-all ${
                          isExpanded 
                            ? 'bg-white/40 border-neutral-300 text-neutral-600' 
                            : 'bg-orange-500/10 border-orange-200 text-orange-850 hover:bg-orange-100/70'
                        }`}
                      >
                        {isExpanded ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>隐藏全诗</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>查阅全诗 & 评定等级</span>
                          </>
                        )}
                      </button>
                    </motion.div>
                  );
                })}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Parents dashboard view - listing all stats and masteries */
          <div className="space-y-4 max-w-4xl mx-auto w-full">
            {/* Quick stats board */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/40 backdrop-blur-md border border-white/55 rounded-2xl p-3 flex flex-col justify-center items-center text-center shadow-2xs">
                <span className="text-2xl font-black text-orange-600">
                  {progresses.filter((p) => p.stars >= settings.poetryY).length}
                </span>
                <span className="text-[10px] text-gray-500 font-bold mt-1">已学会古诗 (首)</span>
              </div>
              <div className="bg-white/40 backdrop-blur-md border border-white/55 rounded-2xl p-3 flex flex-col justify-center items-center text-center shadow-2xs">
                <span className="text-2xl font-black text-indigo-600">
                  {CLASSIC_POEMS.length - progresses.filter((p) => p.stars >= settings.poetryY).length}
                </span>
                <span className="text-[10px] text-gray-500 font-bold mt-1">未通关古诗 (首)</span>
              </div>
            </div>

            {/* List of ALL poems in dataset with current progresses */}
            <div className="bg-white/45 backdrop-blur-xl border border-white/50 rounded-2xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-3 border-b border-white pb-2">
                <h4 className="text-[10px] font-black text-orange-950 uppercase tracking-wider">全部古诗词库对照</h4>
                <button
                  onClick={handleResetProgress}
                  className="text-[10px] font-extrabold text-rose-600 hover:text-rose-705 flex items-center space-x-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>清除进度</span>
                </button>
              </div>

              {/* Responsive 2 column lists for all poems list on larger viewports */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 max-h-[420px] overflow-y-auto pr-1">
                {CLASSIC_POEMS.map((poem) => {
                  const pRecord = progresses.find((p) => p.poemId === poem.id);
                  const stars = pRecord ? pRecord.stars : 0;
                  const isMastered = stars >= settings.poetryY;

                  return (
                    <div 
                      key={poem.id} 
                      className="flex justify-between items-center py-1.5 border-b border-white/30 last:border-0"
                    >
                      <div>
                        <span className="text-xs font-bold text-gray-800">{poem.title}</span>
                        <span className="text-[9px] text-gray-400 ml-1.5">[{poem.dynasty} · {poem.author}]</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {isMastered ? (
                          <span className="text-[9px] bg-emerald-500/15 text-emerald-800 px-2 py-0.5 rounded-full font-black border border-emerald-350/20">
                            已学会 ({stars}星)
                          </span>
                        ) : (
                          <span className="text-[9px] bg-gray-500/10 text-gray-500 px-2 py-0.5 rounded-full font-bold border border-gray-300/10">
                            学习中 ({stars}/{settings.poetryY}星)
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
