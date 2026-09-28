import React, { useState } from 'react';
import { Familiar } from '../types/game';
import { INITIAL_FAMILIARS, FAMILIAR_TREATS } from '../data/battleData';
import { sound } from '../utils/audio';
import { Shield, Sparkles, Heart, Award, ChevronRight, Zap } from 'lucide-react';

export const FamiliarSanctuary: React.FC = () => {
  const [familiars, setFamiliars] = useState<Familiar[]>(INITIAL_FAMILIARS);
  const [selectedFamiliarId, setSelectedFamiliarId] = useState<string>('mitey');
  const [treatStock, setTreatStock] = useState<Record<string, number>>({
    choc: 5,
    flan: 4,
    cake: 4,
    sundae: 6,
  });
  const [feedNotification, setFeedNotification] = useState<string | null>(null);

  const activeFamiliar =
    familiars.find((f) => f.id === selectedFamiliarId) || familiars[0];

  const handleFeedTreat = (treatId: string) => {
    if ((treatStock[treatId] || 0) <= 0) {
      sound.playClick();
      setFeedNotification('點心儲備用完囉！可以在冒險中擊敗魔獸獲取更多！');
      return;
    }

    sound.playHeal();
    setTreatStock((prev) => ({
      ...prev,
      [treatId]: Math.max(0, prev[treatId] - 1),
    }));

    // Raise familiar stats
    setFamiliars((prev) =>
      prev.map((f) => {
        if (f.id !== activeFamiliar.id) return f;
        let nextAtk = f.atk;
        let nextMatk = f.matk;
        let nextDef = f.def;
        let nextMdef = f.mdef;
        let nextAffinity = Math.min(100, f.affinity + 8);

        if (treatId === 'choc') nextAtk += 2;
        if (treatId === 'flan') nextMatk += 2;
        if (treatId === 'cake') nextDef += 2;
        if (treatId === 'sundae') {
          nextMdef += 2;
          nextAffinity = Math.min(100, f.affinity + 15);
        }

        return {
          ...f,
          atk: nextAtk,
          matk: nextMatk,
          def: nextDef,
          mdef: nextMdef,
          affinity: nextAffinity,
        };
      })
    );

    const treat = FAMILIAR_TREATS.find((t) => t.id === treatId);
    setFeedNotification(
      `😋 ${activeFamiliar.name} 開心地吃下了【${treat?.name}】！能力提升：${treat?.statBonus}！`
    );

    setTimeout(() => {
      setFeedNotification(null);
    }, 3000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-[#18232c] border border-[#3e4f60] rounded-xl p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#283949] border border-[#d49c3d]/50 flex items-center justify-center text-2xl">
            🐾
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold text-[#f5dfa3]">
              使魔之林 · 幻獸飼育庭院 (Familiar Sanctuary)
            </h1>
            <p className="text-xs text-[#9bb0c1]">
              心靈共鳴的幻獸生靈 · 投餵特製點心增強屬性並提升羈絆親密度
            </p>
          </div>
        </div>

        {/* Familiar Selector Tabs */}
        <div className="flex items-center gap-2">
          {familiars.map((f) => (
            <button
              key={f.id}
              onClick={() => {
                sound.playClick();
                setSelectedFamiliarId(f.id);
              }}
              className={`px-3 py-1.5 rounded-lg border text-xs font-serif font-medium transition-all flex items-center gap-1.5 ${
                selectedFamiliarId === f.id
                  ? 'bg-[#d49c3d] text-white border-amber-300 font-bold shadow-sm'
                  : 'bg-[#152028] text-[#9eb2c2] border-[#2f3f4e] hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{f.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Familiar Profile & Treat Kitchen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Familiar Card (5 cols) */}
        <div className="lg:col-span-5 bg-[#141e26] border-2 border-[#d49c3d]/60 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#2d3f4e] pb-3 mb-4">
            <div>
              <span className="text-xs text-[#d49c3d] font-bold">
                {activeFamiliar.species}
              </span>
              <h2 className="text-2xl font-serif font-bold text-[#f5dfa3]">
                {activeFamiliar.name}
              </h2>
            </div>
            <span className="px-2.5 py-1 rounded bg-[#20313e] border border-[#374c5e] text-xs font-mono text-[#f1c40f]">
              LV {activeFamiliar.level}
            </span>
          </div>

          {/* Visual Artwork */}
          <div className="relative aspect-square rounded-xl overflow-hidden border border-[#3b4c5d] bg-[#1a2732] mb-5">
            <img
              src={activeFamiliar.image}
              alt={activeFamiliar.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-3 right-3 p-2 rounded bg-black/60 backdrop-blur-sm text-xs text-[#f1ede1] flex items-center justify-between">
              <span>喜愛點心：{activeFamiliar.favoriteFood}</span>
              <span className="text-rose-400 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                親密羈絆 {activeFamiliar.affinity}%
              </span>
            </div>
          </div>

          {/* Stats Breakdown */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-[#1b2834] p-3 rounded-lg border border-[#2b3c4c]">
              <div className="text-[#889cb0] mb-0.5">物理攻擊力 (ATK)</div>
              <div className="text-lg font-mono font-bold text-[#e67e22] tabular-nums">
                {activeFamiliar.atk}
              </div>
            </div>
            <div className="bg-[#1b2834] p-3 rounded-lg border border-[#2b3c4c]">
              <div className="text-[#889cb0] mb-0.5">魔法攻擊力 (MATK)</div>
              <div className="text-lg font-mono font-bold text-[#3498db] tabular-nums">
                {activeFamiliar.matk}
              </div>
            </div>
            <div className="bg-[#1b2834] p-3 rounded-lg border border-[#2b3c4c]">
              <div className="text-[#889cb0] mb-0.5">物理防禦力 (DEF)</div>
              <div className="text-lg font-mono font-bold text-[#2ecc71] tabular-nums">
                {activeFamiliar.def}
              </div>
            </div>
            <div className="bg-[#1b2834] p-3 rounded-lg border border-[#2b3c4c]">
              <div className="text-[#889cb0] mb-0.5">魔法防禦力 (MDEF)</div>
              <div className="text-lg font-mono font-bold text-[#9b59b6] tabular-nums">
                {activeFamiliar.mdef}
              </div>
            </div>
          </div>

          <p className="text-xs text-[#9bb0c1] leading-relaxed mt-4 pt-3 border-t border-[#263745]">
            {activeFamiliar.description}
          </p>
        </div>

        {/* Feeding Kitchen & Skill Tree (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Treat Kitchen */}
          <div className="bg-[#18232c] border border-[#3b4b5a] rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-serif font-bold text-[#f5dfa3] flex items-center gap-2">
                  <span>🍰</span>
                  甜點投餵廚房（Feed Treats）
                </h3>
                <p className="text-xs text-[#8c9fae]">
                  投餵對應屬性點心，永久增加使魔能力與羈絆星數
                </p>
              </div>
              <span className="text-xs text-[#d49c3d] font-bold">點心廚房</span>
            </div>

            {/* Notification */}
            {feedNotification && (
              <div className="mb-4 p-3 bg-emerald-950/70 border border-emerald-500/50 rounded-lg text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{feedNotification}</span>
              </div>
            )}

            {/* Treats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FAMILIAR_TREATS.map((treat) => {
                const stock = treatStock[treat.id] || 0;
                return (
                  <div
                    key={treat.id}
                    className="p-3.5 bg-[#121c23] border border-[#2b3a47] rounded-xl flex items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl p-1.5 rounded-lg bg-[#1a2732] border border-[#2e4050]">
                        {treat.icon}
                      </div>
                      <div>
                        <div className="font-semibold text-xs text-[#f1ede2]">
                          {treat.name}
                        </div>
                        <div className="text-[11px] text-[#22c55e] font-medium">
                          {treat.statBonus}
                        </div>
                        <div className="text-[10px] text-[#718596] line-clamp-1">
                          剩餘存量：{stock} 個
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleFeedTreat(treat.id)}
                      disabled={stock <= 0}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[#d49c3d] hover:bg-[#b8822b] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
                    >
                      投餵
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Familiar Skills and Evolution Lore */}
          <div className="bg-[#18232c] border border-[#3b4b5a] rounded-2xl p-6 shadow-xl">
            <h3 className="text-base font-serif font-bold text-[#f5dfa3] mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              固有技能與心靈特技
            </h3>

            <div className="space-y-2.5">
              {activeFamiliar.skills.map((skill) => (
                <div
                  key={skill.id}
                  className="p-3 bg-[#111a21] border border-[#263745] rounded-lg flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-sm text-[#f6de9d] flex items-center gap-2">
                      <span>{skill.name}</span>
                      <span className="text-[10px] text-[#869ab0] font-normal">
                        ({skill.type === 'attack' ? '物理攻擊' : '強化特技'})
                      </span>
                    </div>
                    <div className="text-[11px] text-[#9bb0c1] mt-0.5">
                      {skill.description}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono text-sky-400">
                      {skill.costMp > 0 ? `${skill.costMp} MP` : '無消耗'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Metamorphosis Evolution Lore */}
            <div className="mt-4 p-3.5 bg-[#231d2b] border border-[#5a3a70] rounded-xl text-xs flex items-center justify-between gap-4">
              <div>
                <div className="font-semibold text-[#f1c40f] flex items-center gap-1.5 mb-0.5">
                  <Award className="w-4 h-4 text-yellow-400" />
                  <span>使魔形態蛻變（Metamorphosis）</span>
                </div>
                <div className="text-[#c2afd6] text-[11px]">
                  當親密度達到 100% 且使用【星滴結晶】時，小咪俠將可進化為【狂暴金甲小咪】！
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded bg-[#3c244f] border border-[#78469e] text-[#f5daff] shrink-0 font-medium">
                準備中
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
