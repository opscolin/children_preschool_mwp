/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AppSettings {
  mathN: number; // N以内
  mathM: number; // M道题
  poetryX: number; // 每日X首
  poetryY: number; // 累计Y颗星达标
  pinyinZ: number; // 拼音每日Z道练习题
}

export interface Poem {
  id: string;
  title: string;
  author: string;
  dynasty: string;
  content: string[];
  translation?: string;
}

export interface PoemProgress {
  poemId: string;
  stars: number; // 累积星星
  mastered: boolean; // 是否学会了 (stars >= Y)
  lastReviewed?: string; // 上度背诵日期 YYYY-MM-DD
}

export interface MathQuestion {
  id: number;
  num1: number;
  num2: number;
  operator: '+' | '-';
  correctAnswer: number;
  userAnswer?: string;
}

export type PinyinCategory = 'initial' | 'final' | 'syllable';

export interface PinyinItem {
  char: string; // 字母表拼音，例如 b, p, m, f 等，或者带声调
  audioText: string; // 朗读语音文本
  category: PinyinCategory; // 类别
  ipa?: string; // 国际音标或注音等辅助信息
}

export interface PinyinQuizItem {
  id: number;
  correctAnswer: PinyinItem;
  options: PinyinItem[];
  userAnswer?: PinyinItem;
  isCorrect?: boolean;
}
