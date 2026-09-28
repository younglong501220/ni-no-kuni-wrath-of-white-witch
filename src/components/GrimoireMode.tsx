import React, { useState } from 'react';
import { GRIMOIRE_CHAPTERS } from '../data/grimoireData';
import { sound } from '../utils/audio';
import { ASSETS } from '../assets';
import { BookOpen, Sparkles, Wand2, Compass, Shield } from 'lucide-react';

export const GrimoireMode: React.FC = () => {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [activeSpellRune, setActiveSpellRune] = useState<string | null>(null);

  const currentChapter = GRIMOIRE_CHAPTERS[activeChapterIndex];

  const handleCastRune = (runeName: string) => {
    sound.playSpellCast();
    setActiveSpellRune(runeName);
    setTimeout(() => {
      setActiveSpellRune(null);
    }, 2200);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Grimoire Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#18232c] border border-[#3e4f60] rounded-xl p-5 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#283949] border border-[#d49c3d]/50 flex items-center justify-center text-[#e9c46a]">
            <BookOpen className="w-6 h-6 text-[#d49c3d]" />
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold text-[#f5dfa3] flex items-center gap-2">
              《魔法大典》（The Wizard's Companion）
            </h1>
            <p className="text-xs text-[#9bb0c1]">
              二之國古賢者流傳千百年的神聖魔導典籍 · 記載禁忌咒文、使魔譜系與心靈真理
            </p>
          </div>
        </div>

        {/* Chapter Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#101920] rounded-lg border border-[#2d3e4e]">
          {GRIMOIRE_CHAPTERS.map((ch, idx) => (
            <button
              key={ch.id}
              onClick={() => {
                sound.playClick();
                setActiveChapterIndex(idx);
              }}
              className={`px-3 py-1.5 text-xs font-serif font-medium rounded-md transition-colors ${
                activeChapterIndex === idx
                  ? 'bg-[#d49c3d] text-white font-bold shadow-sm'
                  : 'text-[#9eb2c2] hover:text-[#f4eed9]'
              }`}
            >
              {ch.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grimoire Book Open Spread */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Grimoire Antique Art & Rune Circle (4 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#141e26] border-2 border-[#c8963e]/60 rounded-2xl p-5 shadow-xl">
            <h3 className="text-sm font-serif font-bold text-[#e5c97b] mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#f4a261]" />
              魔導典籍原典手繪插圖
            </h3>

            <div className="rounded-xl overflow-hidden border border-[#3b4b5a] relative aspect-[4/3] bg-[#22313d] mb-4">
              <img
                src={ASSETS.wizardsCompanionBook}
                alt="魔法大典古老書頁"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-3 right-3 text-[11px] text-[#f4ebd0] font-serif">
                傳說由大賢者以古代精靈語所書寫的純金羊皮紙手抄本
              </div>
            </div>

            {/* Interactive Rune Caster */}
            <div className="bg-[#0f171d] rounded-xl p-4 border border-[#2b3a47] text-center relative overflow-hidden">
              <div className="text-xs font-semibold text-[#eed599] mb-1">
                【心靈共鳴法陣】點擊詠唱符文
              </div>
              <p className="text-[11px] text-[#7d93a6] mb-3">
                揮動魔杖描繪幾何同心圓，引導魔力波動
              </p>

              {/* Runic SVG Circle */}
              <div className="relative inline-block my-2">
                <svg
                  width="130"
                  height="130"
                  viewBox="0 0 130 130"
                  className={`mx-auto transition-all duration-700 ${
                    activeSpellRune ? 'animate-spin drop-shadow-[0_0_20px_#e9c46a]' : ''
                  }`}
                >
                  <circle
                    cx="65"
                    cy="65"
                    r="58"
                    fill="none"
                    stroke="#d49c3d"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                  />
                  <circle
                    cx="65"
                    cy="65"
                    r="46"
                    fill="none"
                    stroke="#e9c46a"
                    strokeWidth="1"
                  />
                  <polygon
                    points="65,22 102,87 28,87"
                    fill="none"
                    stroke="#d49c3d"
                    strokeWidth="1.5"
                  />
                  <polygon
                    points="65,108 102,43 28,43"
                    fill="none"
                    stroke="#e9c46a"
                    strokeWidth="1"
                  />
                  <circle
                    cx="65"
                    cy="65"
                    r="10"
                    fill="none"
                    stroke="#f4a261"
                    strokeWidth="2"
                  />
                </svg>

                {activeSpellRune && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-xs font-bold text-yellow-200 bg-black/70 px-2 py-0.5 rounded animate-ping">
                      {activeSpellRune}！
                    </span>
                  </div>
                )}
              </div>

              {/* Spell Triggers */}
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  onClick={() => handleCastRune('開啟之門 (Gateway)')}
                  className="px-2.5 py-1.5 rounded bg-[#20313f] hover:bg-[#2c4356] border border-[#3f576e] text-xs text-[#eed599] font-medium transition-colors"
                >
                  詠唱：開啟之門
                </button>
                <button
                  onClick={() => handleCastRune('心靈光華 (Heart Beam)')}
                  className="px-2.5 py-1.5 rounded bg-[#20313f] hover:bg-[#2c4356] border border-[#3f576e] text-xs text-[#eed599] font-medium transition-colors"
                >
                  詠唱：給予心靈
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Chapter Content & Parchment Pages (7 cols) */}
        <div className="lg:col-span-7 bg-[#fdfaf0] text-[#342416] rounded-2xl p-6 sm:p-8 border-4 border-[#c8963e]/80 shadow-2xl relative">
          <div className="border-b border-[#ddcbb1] pb-4 mb-6">
            <span className="text-xs uppercase font-serif font-bold text-[#8c672b] tracking-wider">
              {currentChapter.subtitle}
            </span>
            <h2 className="text-2xl font-serif font-bold text-[#3d2716] mt-1">
              {currentChapter.title}
            </h2>
          </div>

          {/* Chapter Articles */}
          <div className="space-y-6 max-h-[520px] overflow-y-auto pr-3 font-serif">
            {currentChapter.content.map((sec, idx) => (
              <div key={idx} className="space-y-2.5 border-b border-[#ede1cd] pb-5 last:border-b-0">
                <h3 className="text-lg font-bold text-[#5c3a21] flex items-center gap-2">
                  <span className="text-xs text-[#c8963e]">◆</span>
                  <span>{sec.heading}</span>
                </h3>

                <div className="space-y-2 text-sm sm:text-base leading-relaxed text-[#3d2b1f]">
                  {sec.paragraphs.map((p, pIdx) => (
                    <p key={pIdx} className="indent-4">
                      {p}
                    </p>
                  ))}
                </div>

                {/* Metadata Pills */}
                {sec.metadata && (
                  <div className="bg-[#f4ebd6] rounded-lg p-3 mt-3 border border-[#dec9ab] space-y-1">
                    {sec.metadata.map((m, mIdx) => (
                      <div key={mIdx} className="flex items-center text-xs">
                        <span className="font-bold text-[#795548] w-20 shrink-0">
                          {m.label}：
                        </span>
                        <span className="text-[#3e2723]">{m.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
