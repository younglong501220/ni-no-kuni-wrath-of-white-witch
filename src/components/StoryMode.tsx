import React, { useState } from 'react';
import { PlayerStats, StoryNode, HeartType } from '../types/game';
import { STORY_NODES } from '../data/storyData';
import { sound } from '../utils/audio';
import { ASSETS } from '../assets';
import { Sparkles, Compass, Send, BookOpen, Wand2, Shield, Heart } from 'lucide-react';

interface StoryModeProps {
  playerStats: PlayerStats;
  onUpdatePlayerStats: (stats: Partial<PlayerStats>) => void;
  onGainHeart: (type: HeartType) => void;
  onTriggerBattle: (bossId: string) => void;
  onOpenGrimoire: () => void;
  onOpenHeartBottle: () => void;
}

export const StoryMode: React.FC<StoryModeProps> = ({
  playerStats,
  onUpdatePlayerStats,
  onGainHeart,
  onTriggerBattle,
  onOpenGrimoire,
  onOpenHeartBottle,
}) => {
  const [currentNodeId, setCurrentNodeId] = useState<string>('prologue_start');
  const [customInput, setCustomInput] = useState('');
  const [inventory, setInventory] = useState<string[]>([
    '《魔法大典》殘頁',
    '小滴的眼淚',
    '心靈之瓶（空）',
    '古舊的魔杖',
  ]);
  const [adventureLog, setAdventureLog] = useState<string[]>([
    '微風鎮的午後，母親的布偶甦醒化身為妖精小滴。',
  ]);
  const [customDialogueResponse, setCustomDialogueResponse] = useState<string | null>(null);

  const currentNode: StoryNode = STORY_NODES[currentNodeId] || STORY_NODES['prologue_start'];

  const handleSelectChoice = (choiceIndex: number) => {
    sound.playClick();
    const choice = currentNode.choices[choiceIndex];
    if (!choice) return;

    // Apply effects
    if (choice.effect) {
      if (choice.effect.hpChange || choice.effect.mpChange) {
        onUpdatePlayerStats({
          hp: Math.min(playerStats.maxHp, Math.max(1, playerStats.hp + (choice.effect.hpChange || 0))),
          mp: Math.min(playerStats.maxMp, Math.max(0, playerStats.mp + (choice.effect.mpChange || 0))),
        });
      }
      if (choice.effect.gainHeart) {
        sound.playHeartMend();
        onGainHeart(choice.effect.gainHeart);
      }
      if (choice.effect.gainItem) {
        setInventory((prev) => (prev.includes(choice.effect!.gainItem!) ? prev : [...prev, choice.effect!.gainItem!]));
        setAdventureLog((prev) => [...prev, `獲得道具：${choice.effect!.gainItem}`]);
      }
      if (choice.effect.triggerBattle) {
        onTriggerBattle(choice.effect.triggerBattle);
        return;
      }
    }

    if (choice.leadToNodeId === 'arena_node') {
      onTriggerBattle('forest_guardian');
      return;
    }

    setCustomDialogueResponse(null);
    setCurrentNodeId(choice.leadToNodeId);
  };

  const handleCustomActionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    sound.playClick();
    const input = customInput.trim();
    setCustomInput('');

    // Intelligent responses from Drippy / Oliver based on player input
    if (input.includes('出發') || input.includes('走') || input.includes('二之國') || input.includes('門') || input.includes('1')) {
      setCustomDialogueResponse('小滴：「沒錯小子！這才是魔法師的氣魄！快翻開《魔法大典》，我們念咒出發啦！」');
      setCurrentNodeId('learn_gateway_node');
    } else if (input.includes('媽媽') || input.includes('母親') || input.includes('遺物') || input.includes('找') || input.includes('3')) {
      setCustomDialogueResponse('小滴：「翻翻看抽屜！肯定能找到有用的東西，說不定還有心靈之瓶呢！」');
      setCurrentNodeId('search_room_node');
    } else if (input.includes('誰') || input.includes('靈魂') || input.includes('什麼地方') || input.includes('為什麼') || input.includes('2')) {
      setCustomDialogueResponse('小滴：「看你一臉懵懂的樣子，我就好好跟你說說二之國和雙生子的秘密吧！」');
      setCurrentNodeId('ask_drippy_node');
    } else if (input.includes('火') || input.includes('魔法') || input.includes('杖')) {
      sound.playSpellCast();
      setCustomDialogueResponse(`奧利佛揮舞魔杖：「${input}！」魔杖尖端迸發出陣陣溫暖的光星。小滴驚訝地喊：「小子，你的魔力資質果然非同凡響！」`);
    } else {
      setCustomDialogueResponse(`小滴眨了眨燈籠眼睛：「『${input}』？哈哈！真有你的風格！不過別磨蹭啦，跟著小滴大爺準沒錯！」`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Hero Visual Banner & Status HUD */}
      <div className="relative rounded-2xl overflow-hidden border border-[#52442e]/60 bg-[#16212b] shadow-xl">
        {/* Banner Image */}
        <div className="h-56 sm:h-72 w-full relative overflow-hidden bg-[#243340]">
          <img
            src={ASSETS.heroBanner}
            alt="二之國奧利佛與妖精小滴"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          {/* Measured Scrim for legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#16212b] via-[#16212b]/60 to-transparent" />

          {/* Banner Overlaid Title & Meta */}
          <div className="absolute bottom-4 left-6 right-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#eed392] mb-1">
                <Compass className="w-3.5 h-3.5" />
                <span>{currentNode.location}</span>
                <span aria-hidden="true">·</span>
                <span>{currentNode.chapter}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#faf0d7] drop-shadow-md">
                二之國：命運的交織與純潔的心靈
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenGrimoire();
                }}
                className="px-3.5 py-1.5 text-xs font-medium text-[#f6de9d] bg-[#293c4e]/85 hover:bg-[#344b60] border border-[#d49c3d]/50 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#d49c3d]" />
                <span>查閱魔法大典</span>
              </button>
              <button
                onClick={() => {
                  sound.playHeartMend();
                  onOpenHeartBottle();
                }}
                className="px-3.5 py-1.5 text-xs font-medium text-emerald-200 bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-500/40 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Heart className="w-3.5 h-3.5 text-emerald-400" />
                <span>心靈之瓶</span>
              </button>
            </div>
          </div>
        </div>

        {/* Character Status HUD (Authentic RPG Status Box) */}
        <div className="bg-[#121b22] px-6 py-4 border-t border-[#3b4b59]/60 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Player unit info */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm text-[#f5dfa3] flex items-center gap-1.5">
                <Wand2 className="w-4 h-4 text-[#d49c3d]" />
                主角：{playerStats.name} (Oliver)
              </span>
              <span className="text-[#a4b5c4]">LV {playerStats.level}</span>
            </div>
            {/* HP / MP Bars */}
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-rose-300">HP {playerStats.hp}/{playerStats.maxHp}</span>
                <span className="text-sky-300">MP {playerStats.mp}/{playerStats.maxMp}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="h-1.5 bg-[#25333f] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 transition-all duration-300"
                    style={{ width: `${(playerStats.hp / playerStats.maxHp) * 100}%` }}
                  />
                </div>
                <div className="h-1.5 bg-[#25333f] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-500 transition-all duration-300"
                    style={{ width: `${(playerStats.mp / playerStats.maxMp) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Familiar unit info */}
          <div className="space-y-1 border-t md:border-t-0 md:border-l border-[#2e3e4e] md:pl-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm text-[#b7e4c7] flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#52b788]" />
                首要使魔：小咪俠 (Mitey)
              </span>
              <span className="text-[#a4b5c4]">LV 3 戰士型</span>
            </div>
            <div className="text-[11px] text-[#97a9b8] pt-1">
              <span>HP 75/75</span>
              <span className="mx-1.5 text-[#4a5f70]">·</span>
              <span>物攻 18</span>
              <span className="mx-1.5 text-[#4a5f70]">·</span>
              <span>物防 14</span>
              <span className="mx-1.5 text-[#4a5f70]">·</span>
              <span className="text-[#f4a261]">特技: 裂空斬</span>
            </div>
          </div>

          {/* Partner & Items */}
          <div className="space-y-1 border-t md:border-t-0 md:border-l border-[#2e3e4e] md:pl-4">
            <div className="font-semibold text-sm text-[#f4a261] flex items-center gap-1.5">
              <span>🏮</span>
              夥伴：大妖精小滴（碎碎念引路中）
            </div>
            <div className="text-[11px] text-[#97a9b8] truncate">
              隨身裝備：古舊魔杖、純潔之心靈、魔法大典
            </div>
          </div>
        </div>
      </div>

      {/* Main Story Narrative Box (Warm Parchment Aesthetic) */}
      <div className="bg-[#fbf7ea] text-[#342416] rounded-xl p-6 sm:p-8 border-4 border-[#c8963e]/70 shadow-2xl relative">
        {/* Storybook Corner Decorations */}
        <div className="absolute top-2 left-2 text-[#c8963e] text-xs pointer-events-none">❖</div>
        <div className="absolute top-2 right-2 text-[#c8963e] text-xs pointer-events-none">❖</div>
        <div className="absolute bottom-2 left-2 text-[#c8963e] text-xs pointer-events-none">❖</div>
        <div className="absolute bottom-2 right-2 text-[#c8963e] text-xs pointer-events-none">❖</div>

        {/* Narrative Paragraphs */}
        <div className="space-y-3.5 font-serif text-base sm:text-lg leading-relaxed text-[#2c1d12] border-b border-[#ddcbb1] pb-6">
          {currentNode.narrative.map((p, idx) => (
            <p key={idx} className="indent-4 tracking-normal">
              {p}
            </p>
          ))}
        </div>

        {/* Drippy Voice Box */}
        {currentNode.drippyQuote && (
          <div className="my-5 p-4 bg-[#f2e7cb] border-l-4 border-[#d49c3d] rounded-r-lg flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-full bg-[#f8de7e] border border-[#d49c3d] flex-shrink-0 flex items-center justify-center text-xl shadow-sm">
              🏮
            </div>
            <div>
              <div className="text-xs font-bold text-[#8a5d20] mb-0.5">
                大妖精小滴（提燈搖晃）：
              </div>
              <p className="text-sm font-medium text-[#442c15] leading-snug">
                {currentNode.drippyQuote}
              </p>
            </div>
          </div>
        )}

        {/* Custom Input Response Feedback (if any) */}
        {customDialogueResponse && (
          <div className="my-4 p-3.5 bg-[#eaf4e6] border border-[#9fc490] rounded-lg text-sm text-[#274a1e] flex items-center gap-2 animate-in fade-in">
            <Sparkles className="w-4 h-4 text-[#588157] flex-shrink-0" />
            <span>{customDialogueResponse}</span>
          </div>
        )}

        {/* Action Choices Section */}
        <div className="mt-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#795548] mb-3 flex items-center gap-1.5">
            <span>🎮</span>
            請做出你的行動（點擊選項推進冒險）：
          </h3>

          <div className="grid grid-cols-1 gap-2.5">
            {currentNode.choices.map((choice, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectChoice(idx)}
                className="w-full text-left p-3.5 rounded-lg bg-[#efe3c5] hover:bg-[#e6d5b0] border border-[#cfba95] text-[#2c1d12] font-medium text-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-sm flex items-start gap-2.5 group"
              >
                <span className="w-6 h-6 rounded-full bg-[#c8963e] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 group-hover:bg-[#a67425] transition-colors">
                  {idx + 1}
                </span>
                <span className="flex-1 leading-snug">{choice.text}</span>
              </button>
            ))}
          </div>

          {/* Mode 1 Freedom Custom Action Input */}
          <div className="mt-5 pt-4 border-t border-[#dfceb6]">
            <form onSubmit={handleCustomActionSubmit} className="space-y-2">
              <label className="block text-xs font-semibold text-[#6d4c41]">
                【自訂自由行動】輸入你想對小滴說的話，或想在場景中執行的任何動作：
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="例：緊握魔杖對著窗外揮動 / 問小滴二之國有什麼好吃的 / 抱起小咪俠..."
                  className="flex-1 px-3.5 py-2 rounded-lg bg-white border border-[#c4ae8f] text-sm text-[#3e2723] focus:outline-none focus:ring-2 focus:ring-[#c8963e]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#c8963e] hover:bg-[#b07d2c] text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>執行</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Bag & Adventure History Record */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Inventory */}
        <div className="bg-[#18232c] border border-[#3b4b5a] rounded-xl p-5">
          <h4 className="text-sm font-serif font-bold text-[#eed392] mb-3 flex items-center gap-2">
            <span>🎒</span>
            冒險行囊與關鍵道具
          </h4>
          <div className="flex flex-wrap gap-2">
            {inventory.map((item, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded bg-[#243340] border border-[#3c5063] text-xs text-[#e4edea]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Adventure Milestones */}
        <div className="bg-[#18232c] border border-[#3b4b5a] rounded-xl p-5">
          <h4 className="text-sm font-serif font-bold text-[#eed392] mb-3 flex items-center gap-2">
            <span>📜</span>
            冒險歷程記錄
          </h4>
          <div className="space-y-1.5 max-h-24 overflow-y-auto pr-2 text-xs text-[#9eb2c2]">
            {adventureLog.map((log, idx) => (
              <div key={idx} className="flex items-start gap-1.5">
                <span className="text-[#d49c3d]">›</span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
