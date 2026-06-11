/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PinyinItem } from '../types';

export const PINYIN_INITIALS: PinyinItem[] = [
  { char: 'b', audioText: '波', category: 'initial', ipa: '[b]' },
  { char: 'p', audioText: '坡', category: 'initial', ipa: '[pʰ]' },
  { char: 'm', audioText: '摸', category: 'initial', ipa: '[m]' },
  { char: 'f', audioText: '佛', category: 'initial', ipa: '[f]' },
  { char: 'd', audioText: '得', category: 'initial', ipa: '[t]' },
  { char: 't', audioText: '特', category: 'initial', ipa: '[tʰ]' },
  { char: 'n', audioText: '讷', category: 'initial', ipa: '[n]' },
  { char: 'l', audioText: '勒', category: 'initial', ipa: '[l]' },
  { char: 'g', audioText: '哥', category: 'initial', ipa: '[k]' },
  { char: 'k', audioText: '科', category: 'initial', ipa: '[kʰ]' },
  { char: 'h', audioText: '喝', category: 'initial', ipa: '[x]' },
  { char: 'j', audioText: '鸡', category: 'initial', ipa: '[tɕ]' },
  { char: 'q', audioText: '七', category: 'initial', ipa: '[tɕʰ]' },
  { char: 'x', audioText: '西', category: 'initial', ipa: '[ɕ]' },
  { char: 'zh', audioText: '知', category: 'initial', ipa: '[ʈʂ]' },
  { char: 'ch', audioText: '吃', category: 'initial', ipa: '[ʈʂʰ]' },
  { char: 'sh', audioText: '狮', category: 'initial', ipa: '[ʂ]' },
  { char: 'r', audioText: '日', category: 'initial', ipa: '[ʐ]' },
  { char: 'z', audioText: '滋', category: 'initial', ipa: '[ts]' },
  { char: 'c', audioText: '雌', category: 'initial', ipa: '[tsʰ]' },
  { char: 's', audioText: '思', category: 'initial', ipa: '[s]' },
  { char: 'y', audioText: '衣', category: 'initial', ipa: '[j]' },
  { char: 'w', audioText: '乌', category: 'initial', ipa: '[w]' }
];

export const PINYIN_FINALS: PinyinItem[] = [
  // 单韵母
  { char: 'a', audioText: '啊', category: 'final', ipa: '[a]' },
  { char: 'o', audioText: '喔', category: 'final', ipa: '[o]' },
  { char: 'e', audioText: '鹅', category: 'final', ipa: '[ɤ]' },
  { char: 'i', audioText: '衣', category: 'final', ipa: '[i]' },
  { char: 'u', audioText: '乌', category: 'final', ipa: '[u]' },
  { char: 'ü', audioText: '迂', category: 'final', ipa: '[y]' },
  // 复韵母
  { char: 'ai', audioText: '哀', category: 'final', ipa: '[ai]' },
  { char: 'ei', audioText: '欸', category: 'final', ipa: '[ei]' },
  { char: 'ui', audioText: '威', category: 'final', ipa: '[uei]' },
  { char: 'ao', audioText: '熬', category: 'final', ipa: '[au]' },
  { char: 'ou', audioText: '欧', category: 'final', ipa: '[ou]' },
  { char: 'iu', audioText: '优', category: 'final', ipa: '[iou]' },
  { char: 'ie', audioText: '耶', category: 'final', ipa: '[iɛ]' },
  { char: 'üe', audioText: '约', category: 'final', ipa: '[yɛ]' },
  { char: 'er', audioText: '耳', category: 'final', ipa: '[aɚ]' },
  // 前鼻韵母
  { char: 'an', audioText: '安', category: 'final', ipa: '[an]' },
  { char: 'en', audioText: '恩', category: 'final', ipa: '[ən]' },
  { char: 'in', audioText: '因', category: 'final', ipa: '[in]' },
  { char: 'un', audioText: '温', category: 'final', ipa: '[uən]' },
  { char: 'ün', audioText: '晕', category: 'final', ipa: '[yn]' },
  // 后鼻韵母
  { char: 'ang', audioText: '昂', category: 'final', ipa: '[aŋ]' },
  { char: 'eng', audioText: '哼的韵母', category: 'final', ipa: '[əŋ]' },
  { char: 'ing', audioText: '英', category: 'final', ipa: '[iŋ]' },
  { char: 'ong', audioText: '轰的韵母', category: 'final', ipa: '[uŋ]' }
];

export const PINYIN_SYLLABLES: PinyinItem[] = [
  { char: 'zhi', audioText: '织', category: 'syllable', ipa: '[ʈʂɪ]' },
  { char: 'chi', audioText: '吃', category: 'syllable', ipa: '[ʈʂʰɪ]' },
  { char: 'shi', audioText: '狮', category: 'syllable', ipa: '[ʂɪ]' },
  { char: 'ri', audioText: '日', category: 'syllable', ipa: '[ʐɪ]' },
  { char: 'zi', audioText: '姿', category: 'syllable', ipa: '[tsɪ]' },
  { char: 'ci', audioText: '词', category: 'syllable', ipa: '[tsʰɪ]' },
  { char: 'si', audioText: '丝', category: 'syllable', ipa: '[sɪ]' },
  { char: 'yi', audioText: '衣', category: 'syllable', ipa: '[i]' },
  { char: 'wu', audioText: '乌', category: 'syllable', ipa: '[u]' },
  { char: 'yu', audioText: '鱼', category: 'syllable', ipa: '[y]' },
  { char: 'ye', audioText: '夜', category: 'syllable', ipa: '[iɛ]' },
  { char: 'yue', audioText: '月', category: 'syllable', ipa: '[yɛ]' },
  { char: 'yuan', audioText: '圆', category: 'syllable', ipa: '[yɛn]' },
  { char: 'yin', audioText: '因', category: 'syllable', ipa: '[in]' },
  { char: 'yun', audioText: '云', category: 'syllable', ipa: '[yn]' },
  { char: 'ying', audioText: '鹰', category: 'syllable', ipa: '[iŋ]' }
];

// Speech Synthesis Voice caching to avoid repeatedly querying list
let voicesCached: SpeechSynthesisVoice[] = [];

function getAllVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  if (voicesCached.length > 0) return voicesCached;
  
  const voices = window.speechSynthesis.getVoices();
  if (voices && voices.length > 0) {
    voicesCached = voices;
    return voices;
  }
  return [];
}

// Listen to voice list loading asynchronously in certain modern browser engines
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    voicesCached = window.speechSynthesis.getVoices();
  };
}

/**
 * Gets the best available child-teaching or expressive storytelling Chinese voice.
 * Prioritizes famous child-friendly and educational neural voices found in Edge/Chrome,
 * then falls back to natural/online Mandarin voices, then system standard voices.
 */
export function getBestCNVoice(): SpeechSynthesisVoice | null {
  const voices = getAllVoices();
  if (voices.length === 0) return null;

  // 1. Filter Chinese voices (Simplified/Mandarin/zh-CN/zh)
  const cnVoices = voices.filter(v => {
    const lang = v.lang.toLowerCase().replace('_', '-');
    return lang.startsWith('zh-cn') || lang === 'zh' || lang.startsWith('zh-hans') || lang === 'zh-sg';
  });

  if (cnVoices.length === 0) {
    // If no zh-CN, look for any generic zh voice
    const anyZh = voices.filter(v => v.lang.toLowerCase().startsWith('zh'));
    if (anyZh.length > 0) return anyZh[0];
    return null;
  }

  // 2. Rank preferred child & educational voices
  // Microsoft Xiaoyi: friendly youth/kid tone, Microsoft Xiaoxiao: ultimate emotional children-storyteller voice, Microsoft Xiaorui: educational voice
  const preferredNamesKeywords = [
    'xiaoyi',   // 晓伊 (Young/child friendly)
    'xiaoxiao', // 晓晓 (Great children storyteller)
    'yunxi',    // 云希 (Lively boy voice)
    'xiaorui',  // 晓睿 (Designed for educational reading)
    'xiaoni',   // 晓倪 (Childish cute girl voice)
    'tingting', // Apple Standard Ting-Ting
    'google',   // Google Mandarin neural
    'liaoliao'  // Apple LiaoLiao
  ];

  for (const keyword of preferredNamesKeywords) {
    const matched = cnVoices.find(v => v.name.toLowerCase().includes(keyword));
    if (matched) return matched;
  }

  // Fallback to Microsoft voices
  const msVoice = cnVoices.find(v => v.name.toLowerCase().includes('microsoft'));
  if (msVoice) return msVoice;

  // Fallback to local high-fidelity local service
  const localVoice = cnVoices.find(v => v.localService);
  if (localVoice) return localVoice;

  return cnVoices[0];
}

/**
 * Speaks a custom piece of text using the premium child-suited Chinese voice engine.
 * @param text Chinese text to speak
 * @param rate Speech speed (slower pace by default for easy children understanding)
 * @param pitch Default voice pitch (adjusted higher for standard voices to mimic kid vibe)
 */
export function speakText(text: string, rate = 0.85, pitch = 1.18) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this environment.');
    return;
  }

  // Stop any active reading to prevent overlap queuing lag
  window.speechSynthesis.cancel();

  // Create customized utterance
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-CN';

  const childVoice = getBestCNVoice();
  if (childVoice) {
    utterance.voice = childVoice;
    const nameLower = childVoice.name.toLowerCase();
    
    // Xiaoyi, Xiaoxiao, and Xiaoni are natural child/girl voices with beautiful built-in pitches
    if (nameLower.includes('xiaoyi') || nameLower.includes('xiaoxiao') || nameLower.includes('xiaoni')) {
      utterance.pitch = 1.05; // maintain natural childlike high fidelity
      utterance.rate = rate;
    } else {
      utterance.pitch = pitch; // lift standard voices up for a cleaner, warm, youthful vibe
      utterance.rate = rate;
    }
  } else {
    utterance.pitch = pitch;
    utterance.rate = rate;
  }

  window.speechSynthesis.speak(utterance);
}

// Helper to speak a pinyin sound using Web Speech API or friendly alert fallback.
export function playPinyinAudio(pinyin: PinyinItem) {
  const textToSpeak = getSpeechTextForPinyin(pinyin);
  // Slower rate (0.72) is specifically vital for infants learning exact spelling sounds
  speakText(textToSpeak, 0.72, 1.2);
}

function getSpeechTextForPinyin(pinyin: PinyinItem): string {
  // Let's speak custom helpful text so it speaks perfectly for children
  if (pinyin.category === 'initial') {
    return `声母，${pinyin.char}，读作，${pinyin.audioText}`;
  } else if (pinyin.category === 'final') {
    return `韵母，${pinyin.char}，读作，${pinyin.audioText}`;
  } else {
    return `整体认读音节，${pinyin.char}，读作，${pinyin.audioText}`;
  }
}
