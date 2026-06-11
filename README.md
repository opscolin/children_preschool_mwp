# KidLeap - 幼小衔接互动学习助手 🎒

> **KidLeap** is a premium, highly tactile interactive learning assistant designed specifically for young children transitioning from kindergarten to elementary school. It features immersive Pinyin, Math, and Classical Chinese Poetry learning modules with adaptive AI-like high-fidelity audio feedback.

---

## 🌟 主要功能 / Core Modules

* **拼音乐园 (Pinyin Paradise)**: Interactive browser for Initials, Finals, and Syllables. Uses highly optimized, humanlike expressive child-tones (like Microsoft Xiaoyi/Xiaoxiao) for reading and phonetic listening quizes.
* **口算大冒险 (Math Adventure)**: Focus-designed active mathematics training with a large, kid-friendly customized keypad. Parameters are dynamically configurable (range up to N, total M questions).
* **古诗背诵阁 (Poetry Gallery)**: Curated ancient classical poems. Features flexible configuration for daily recitation progress (target milestones of 10, 20, 30, or 50 total star awards) with real-time feedback.
* **极简自适应界面 (Fluid Immersive Layout)**: Hidden layout scrollbars for full focus, vibrant color indicators, and fully responsive cards tailored for desktops, iPads, and mobile mockup previews.

---

## 🚀 启动指南 / Getting Started

### 1. 安装依赖 / Install Dependencies
```bash
npm install
```

### 2. 开发模式 / Development Mode
```bash
npm run dev
```

### 3. 构建发布 / Static Build
```bash
npm run build
```

---

## 📖 详细指南 / Detailed Documentation

👉 对于本项目的详细技术设计、教学理念以及全部家长设置说明，请直接参阅中文特别手册：  
**[👉 README_zh.md (点击查看中文详解说明书)](./Readme_zh.md)**

---

## 🛠 技术底座 / Technical Stack

- **框架**: React 18 + Vite + TypeScript
- **动画**: `motion` (Framer Motion) 精致物理微交互
- **样式**: Tailwind CSS (免去繁杂滚动条，保持浸润式卡片体验)
- **图标**: Lucide React
- **发音引擎**: Web Speech API Neural Voice Selector (智选拟人化暖心童声)
