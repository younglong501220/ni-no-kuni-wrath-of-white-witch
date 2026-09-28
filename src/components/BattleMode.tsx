import React, { useState, useEffect, useRef } from 'react';
import { PlayerStats, Familiar, Enemy, CombatLog, GleamOrb, HeartPiece } from '../types/game';
import { BOSS_ENEMIES, INITIAL_FAMILIARS, INITIAL_SPELLS } from '../data/battleData';
import { sound } from '../utils/audio';
import { ASSETS } from '../assets';
import {
  Shield,
  Zap,
  Heart,
  Flame,
  Droplets,
  RotateCcw,
  Sparkles,
  Award,
  ChevronRight,
  User,
  Sword,
} from 'lucide-react';

interface BattleModeProps {
  playerStats: PlayerStats;
  onUpdatePlayerStats: (stats: Partial<PlayerStats>) => void;
  heartPieces: Record<string, HeartPiece>;
  onMendHeartSuccess: (enemyId: string, heartType: string) => void;
  initialBossId?: string;
  onReturnToStory: () => void;
}

export const BattleMode: React.FC<BattleModeProps> = ({
  playerStats,
  onUpdatePlayerStats,
  heartPieces,
  onMendHeartSuccess,
  initialBossId = 'forest_guardian',
  onReturnToStory,
}) => {
  // Current Boss
  const [selectedBossIndex, setSelectedBossIndex] = useState<number>(() => {
    const idx = BOSS_ENEMIES.findIndex((b) => b.id === initialBossId);
    return idx >= 0 ? idx : 0;
  });
  const enemyData = BOSS_ENEMIES[selectedBossIndex];

  // Battle State
  const [enemyHp, setEnemyHp] = useState<number>(enemyData.hp);
  const [currentUnit, setCurrentUnit] = useState<'oliver' | 'familiar'>('familiar');
  const [activeFamiliar, setActiveFamiliar] = useState<Familiar>(INITIAL_FAMILIARS[0]);
  const [isGuarding, setIsGuarding] = useState<boolean>(false);
  const [enemyTelegraph, setEnemyTelegraph] = useState<string | null>(null);
  const [isEnemyTurn, setIsEnemyTurn] = useState<boolean>(false);
  const [battleOver, setBattleOver] = useState<'victory' | 'defeat' | null>(null);
  const [isMendedVictory, setIsMendedVictory] = useState<boolean>(false);
  const [hasMiracleGlint, setHasMiracleGlint] = useState<boolean>(false);
  const [gleams, setGleams] = useState<GleamOrb[]>([]);

  // Logs
  const [logs, setLogs] = useState<CombatLog[]>([
    {
      id: '1',
      sender: 'system',
      message: `🌲 進入了二之國深幽秘境！${enemyData.name} 狂暴地咆哮著擋住了去路！`,
    },
    {
      id: '2',
      sender: 'drippy',
      message: '小滴：「小子！指揮使魔小咪俠迎戰，別忘了用你的魔杖火球和防禦！」',
    },
  ]);

  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Reset when boss changes
  const resetBattle = (bossIdx: number = selectedBossIndex) => {
    const boss = BOSS_ENEMIES[bossIdx];
    setSelectedBossIndex(bossIdx);
    setEnemyHp(boss.hp);
    setIsGuarding(false);
    setEnemyTelegraph(null);
    setIsEnemyTurn(false);
    setBattleOver(null);
    setIsMendedVictory(false);
    setHasMiracleGlint(false);
    setGleams([]);
    onUpdatePlayerStats({
      hp: playerStats.maxHp,
      mp: playerStats.maxMp,
    });
    setLogs([
      {
        id: String(Date.now()),
        sender: 'system',
        message: `⚔️ 戰鬥重新展開！面對 ${boss.name} (${boss.title})！`,
      },
      {
        id: String(Date.now() + 1),
        sender: 'drippy',
        message: `小滴：「當牠 HP 降至 ${boss.mendThreshold} 以下時，立刻給予【${heartPieces[boss.requiredHeart]?.name || '心靈碎片'}】！」`,
      },
    ]);
  };

  const addLog = (
    sender: CombatLog['sender'],
    message: string,
    type?: CombatLog['type']
  ) => {
    setLogs((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(7),
        sender,
        message,
        type,
      },
    ]);
  };

  // Spawn random gleaming orbs (Green HP or Blue MP or Gold Miracle)
  const spawnGleams = (chanceMultiplier: number = 1) => {
    const rand = Math.random() * chanceMultiplier;
    if (rand > 0.4) {
      const type: GleamOrb['type'] = rand > 0.85 ? 'gold' : rand > 0.6 ? 'hp' : 'mp';
      const newOrb: GleamOrb = {
        id: Math.random().toString(36).substring(7),
        type,
        x: Math.floor(Math.random() * 70) + 15,
        y: Math.floor(Math.random() * 50) + 30,
      };
      setGleams((prev) => [...prev.slice(-3), newOrb]);
    }
  };

  const handlePickGleam = (orb: GleamOrb) => {
    sound.playGleamPickup(orb.type === 'gold');
    if (orb.type === 'hp') {
      const heal = 25;
      onUpdatePlayerStats({ hp: Math.min(playerStats.maxHp, playerStats.hp + heal) });
      addLog('system', `💚 奧利佛拾取了【生命綠色光珠】，恢復了 ${heal} 點 HP！`, 'glint');
    } else if (orb.type === 'mp') {
      const restore = 20;
      onUpdatePlayerStats({ mp: Math.min(playerStats.maxMp, playerStats.mp + restore) });
      addLog('system', `💙 奧利佛拾取了【魔力湛藍光珠】，恢復了 ${restore} 點 MP！`, 'glint');
    } else if (orb.type === 'gold') {
      setHasMiracleGlint(true);
      addLog('drippy', '🌟 小滴：「哇啊啊！是傳說中的【金色奇蹟光珠】！快使用奇蹟極限技！」', 'glint');
    }
    setGleams((prev) => prev.filter((g) => g.id !== orb.id));
  };

  // Enemy Turn Action
  const triggerEnemyTurn = () => {
    setIsEnemyTurn(true);

    setTimeout(() => {
      if (enemyHp <= 0) {
        setIsEnemyTurn(false);
        return;
      }

      // Check if boss uses special telegraphed move or normal strike
      let rawDamage = Math.floor(Math.random() * 10) + enemyData.atk;
      let moveName = '揮舞重拳猛烈打擊';

      if (Math.random() > 0.6) {
        rawDamage = Math.floor(enemyData.atk * 1.5);
        moveName = enemyData.specialMoveName;
      }

      // If player is guarding, reduce by 65%
      let finalDamage = rawDamage;
      if (isGuarding) {
        sound.playGuardSuccess();
        finalDamage = Math.max(3, Math.floor(rawDamage * 0.35));
        addLog(
          'player',
          `🛡️ 完美格擋！${currentUnit === 'familiar' ? activeFamiliar.name : '奧利佛'} 成功架盾抵禦了衝擊，僅受到 ${finalDamage} 點減免傷害！`,
          'damage'
        );
      } else {
        sound.playSlash();
        addLog(
          'enemy',
          `💥 ${enemyData.name} 發動了【${moveName}】，造成了 ${finalDamage} 點巨大衝擊！`,
          'damage'
        );
      }

      const nextHp = Math.max(0, playerStats.hp - finalDamage);
      onUpdatePlayerStats({ hp: nextHp });
      setIsGuarding(false);
      setIsEnemyTurn(false);

      if (nextHp <= 0) {
        setBattleOver('defeat');
        addLog(
          'drippy',
          '💀 小滴：「小子！！奧利佛倒下了……小滴帶著你趕緊撤回微風鎮安全處！」',
          'warning'
        );
      }
    }, 900);
  };

  // Player Actions:
  // 1. Familiar Physical Slash
  const handleFamiliarSlash = () => {
    if (isEnemyTurn || battleOver) return;
    sound.playSlash();
    const dmg = Math.floor(Math.random() * 8) + activeFamiliar.atk;
    const nextEnemyHp = Math.max(0, enemyHp - dmg);
    setEnemyHp(nextEnemyHp);
    addLog(
      'familiar',
      `⚔️ 使魔 ${activeFamiliar.name} 躍身施展【裂空斬】，白刃劍氣劈砍對手造成 ${dmg} 點物理傷害！`,
      'damage'
    );

    spawnGleams(1.2);

    if (nextEnemyHp <= 0) {
      handlePureDefeatVictory();
    } else {
      triggerEnemyTurn();
    }
  };

  // 2. Oliver Spells
  const handleCastSpell = (spellId: string) => {
    if (isEnemyTurn || battleOver) return;
    const spell = INITIAL_SPELLS.find((s) => s.id === spellId);
    if (!spell) return;

    if (playerStats.mp < spell.costMp) {
      addLog('drippy', `❌ MP 不足！詠唱 ${spell.name} 需要 ${spell.costMp} 點 MP！`, 'warning');
      return;
    }

    onUpdatePlayerStats({ mp: playerStats.mp - spell.costMp });

    if (spell.element === 'heal') {
      sound.playHeal();
      const healAmount = 35;
      const nextHp = Math.min(playerStats.maxHp, playerStats.hp + healAmount);
      onUpdatePlayerStats({ hp: nextHp });
      addLog('player', `💖 奧利佛揮舞魔杖詠唱【${spell.name}】，溫暖金光籠罩全場，回復了 ${healAmount} 點 HP！`, 'heal');
      triggerEnemyTurn();
      return;
    }

    sound.playSpellCast();
    let dmg = 0;
    if (spell.id === 'fireball') {
      dmg = Math.floor(Math.random() * 15) + 30; // Strong against plant guardian
      addLog('player', `🔥 奧利佛詠唱【火球術】！熾熱火焰旋渦吞噬了對手，造成 ${dmg} 點火焰克制傷害！`, 'damage');
    } else if (spell.id === 'frostbite') {
      dmg = Math.floor(Math.random() * 12) + 24;
      addLog('player', `❄️ 奧利佛詠唱【冰霜術】！銳利寒冰尖刺貫穿對手，造成 ${dmg} 點急凍傷害！`, 'damage');
    } else if (spell.id === 'pulse') {
      dmg = Math.floor(Math.random() * 20) + 45;
      addLog('player', `🌌 奧利佛引動【星辰脈衝】！璀璨星穹星光轟頂，造成爆裂性 ${dmg} 點光屬性傷害！`, 'damage');
    }

    spawnGleams(1.5);
    const nextEnemyHp = Math.max(0, enemyHp - dmg);
    setEnemyHp(nextEnemyHp);

    if (nextEnemyHp <= 0) {
      handlePureDefeatVictory();
    } else {
      triggerEnemyTurn();
    }
  };

  // 3. Miracle Overdrive (Golden Gleam)
  const handleMiracleOverdrive = () => {
    if (!hasMiracleGlint || isEnemyTurn || battleOver) return;
    sound.playSpellCast();
    setHasMiracleGlint(false);
    const dmg = 80;
    const nextEnemyHp = Math.max(0, enemyHp - dmg);
    setEnemyHp(nextEnemyHp);
    addLog(
      'player',
      `🌟 奧利佛與小咪俠引發【奇蹟共鳴·蒼穹星之極限斬】！天地失色，轟出 ${dmg} 點毀滅極限傷害！`,
      'glint'
    );

    if (nextEnemyHp <= 0) {
      handlePureDefeatVictory();
    } else {
      triggerEnemyTurn();
    }
  };

  // 4. Guard
  const handleGuard = () => {
    if (isEnemyTurn || battleOver) return;
    sound.playClick();
    setIsGuarding(true);
    addLog(
      'player',
      `🛡️ ${currentUnit === 'familiar' ? activeFamiliar.name : '奧利佛'} 進入【專注格擋】架構，下一擊傷害減少 65%！`
    );
    triggerEnemyTurn();
  };

  // 5. Heart Mending (The signature Ni no Kuni mechanic!)
  const handleMendHeart = () => {
    if (isEnemyTurn || battleOver) return;

    if (enemyHp > enemyData.mendThreshold) {
      sound.playClick();
      addLog(
        'drippy',
        `⚠️ 小滴：「不行啊小子！${enemyData.name} 的狂暴心靈防壁還太厚！必須把牠的 HP 削弱到 ${enemyData.mendThreshold} 以下才能注入碎片！」`,
        'warning'
      );
      return;
    }

    const requiredPiece = heartPieces[enemyData.requiredHeart];
    if (!requiredPiece || requiredPiece.count <= 0) {
      sound.playClick();
      addLog(
        'drippy',
        `❌ 心靈之瓶中缺少【${requiredPiece?.name || '對應碎片'}】！無法完成心靈修補！`,
        'warning'
      );
      return;
    }

    // Success Mending!
    sound.playHeartMend();
    setEnemyHp(0);
    setIsMendedVictory(true);
    setBattleOver('victory');
    onMendHeartSuccess(enemyData.id, enemyData.requiredHeart);

    addLog(
      'player',
      `✨ 奧利佛高高舉起心靈之瓶，念動賢者真言：「以心之名——【給予心靈（Give Heart）】！」`,
      'victory'
    );
    addLog(
      'drippy',
      `🌟 璀璨的【${requiredPiece.name}】化為千萬點星光注入 ${enemyData.name} 胸口！狂暴紫氣徹底洗滌消散！`,
      'victory'
    );
    addLog(
      'system',
      `🎉 ${enemyData.name} 恢復了清明的眼神與本善之心，向你深深低頭致敬！獲得心靈修補最高評價與羈絆加成！`,
      'victory'
    );
    sound.playVictory();
  };

  const handlePureDefeatVictory = () => {
    sound.playVictory();
    setBattleOver('victory');
    setIsMendedVictory(false);
    addLog('system', `🎉 ${enemyData.name} 倒下了！戰鬥獲得完全勝利！`, 'victory');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Boss Selection & Battle Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#141e26] border border-[#344655] rounded-xl px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="text-xl">⚔️</span>
          <div>
            <h2 className="text-base font-serif font-bold text-[#f2e6cb]">
              二之國使魔戰鬥模式 (Ni no Kuni Battle Arena)
            </h2>
            <div className="text-xs text-[#8da0af]">
              即時指令 · 使魔切換 · 屬性魔法 · 心靈修補
            </div>
          </div>
        </div>

        {/* Boss Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#9eb2c2] hidden sm:inline">切換挑戰魔獸：</span>
          <div className="flex rounded-lg overflow-hidden border border-[#3b4e61] bg-[#1a2732] p-0.5">
            {BOSS_ENEMIES.map((b, idx) => (
              <button
                key={b.id}
                onClick={() => resetBattle(idx)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                  selectedBossIndex === idx
                    ? 'bg-[#d49c3d] text-white font-bold shadow-sm'
                    : 'text-[#9eb2c2] hover:text-white'
                }`}
              >
                {b.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Battle Arena Stage */}
      <div className="relative bg-[#192b23] border-4 border-[#c8963e]/80 rounded-2xl p-6 shadow-2xl overflow-hidden min-h-[380px] flex flex-col justify-between">
        {/* Enchanted Forest / Arena Background Details */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#13231c]/90 via-[#182e24]/70 to-[#0e1914] pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#22c55e]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Floating Gleam Orbs (Pickups) */}
        {gleams.map((orb) => (
          <button
            key={orb.id}
            onClick={() => handlePickGleam(orb)}
            style={{ left: `${orb.x}%`, top: `${orb.y}%` }}
            className={`absolute z-30 p-2 rounded-full cursor-pointer animate-bounce transition-transform transform hover:scale-125 shadow-lg ${
              orb.type === 'hp'
                ? 'bg-emerald-500 text-white shadow-emerald-500/50'
                : orb.type === 'mp'
                ? 'bg-sky-500 text-white shadow-sky-500/50'
                : 'bg-amber-400 text-slate-900 shadow-amber-400/80 animate-pulse'
            }`}
            title={
              orb.type === 'hp'
                ? '點擊吸收：綠色生命光珠 (+25 HP)'
                : orb.type === 'mp'
                ? '點擊吸收：藍色魔力光珠 (+20 MP)'
                : '點擊吸收：金色奇蹟光珠 (極限技覺醒!)'
            }
          >
            <Sparkles className="w-5 h-5" />
          </button>
        ))}

        {/* Top Arena Units Status Rows */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Player & Familiar Box */}
          <div className="bg-[#121b22]/90 border border-[#3b4c5d] rounded-xl p-4 shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-[#273847] border border-[#d49c3d]/60 flex items-center justify-center text-sm">
                  {currentUnit === 'familiar' ? '⚔️' : '🧙'}
                </span>
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#f6de9d] flex items-center gap-2">
                    {currentUnit === 'familiar' ? activeFamiliar.name : playerStats.name}
                    <span className="text-xs text-[#9bb0c1] font-normal">
                      (目前操作：{currentUnit === 'familiar' ? '使魔' : '奧利佛'})
                    </span>
                  </h3>
                  <div className="text-[11px] text-[#869ab0]">
                    太陽之星 · 純潔魔法使與勇者使魔
                  </div>
                </div>
              </div>

              {/* Unit Switch Button */}
              <button
                onClick={() => {
                  sound.playClick();
                  setCurrentUnit((prev) => (prev === 'familiar' ? 'oliver' : 'familiar'));
                }}
                className="px-2.5 py-1 text-xs font-medium rounded border border-[#d49c3d]/50 bg-[#293c4e] text-[#f6de9d] hover:bg-[#344c62] transition-colors"
              >
                切換操作 ({currentUnit === 'familiar' ? '換奧利佛' : '換使魔'})
              </button>
            </div>

            {/* HP Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-rose-400 font-semibold flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5" /> HP
                </span>
                <span className="text-[#e2ebf3] tabular-nums">
                  {playerStats.hp} / {playerStats.maxHp}
                </span>
              </div>
              <div className="h-3 bg-[#1d2730] rounded-full overflow-hidden border border-[#2e3e4e]">
                <div
                  className="h-full bg-gradient-to-r from-rose-600 to-rose-400 transition-all duration-300"
                  style={{ width: `${(playerStats.hp / playerStats.maxHp) * 100}%` }}
                />
              </div>

              {/* MP Bar */}
              <div className="flex justify-between text-xs font-mono pt-1">
                <span className="text-sky-400 font-semibold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" /> MP
                </span>
                <span className="text-[#e2ebf3] tabular-nums">
                  {playerStats.mp} / {playerStats.maxMp}
                </span>
              </div>
              <div className="h-3 bg-[#1d2730] rounded-full overflow-hidden border border-[#2e3e4e]">
                <div
                  className="h-full bg-gradient-to-r from-sky-600 to-sky-400 transition-all duration-300"
                  style={{ width: `${(playerStats.mp / playerStats.maxMp) * 100}%` }}
                />
              </div>
            </div>

            {/* Defense State Pill */}
            {isGuarding && (
              <div className="mt-2.5 py-1 px-2.5 rounded bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs flex items-center gap-1.5 animate-pulse">
                <Shield className="w-3.5 h-3.5" />
                <span>格擋防禦狀態已啟動（承受傷害 -65%）</span>
              </div>
            )}
          </div>

          {/* Enemy Boss Box */}
          <div className="bg-[#1b171a]/90 border border-[#5d3b45] rounded-xl p-4 shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-[#3b242a] border border-rose-500/50 flex items-center justify-center text-sm">
                  👹
                </span>
                <div>
                  <h3 className="font-serif font-bold text-sm text-rose-200">
                    {enemyData.name}
                  </h3>
                  <div className="text-[11px] text-[#be9fa7]">
                    {enemyData.title}
                  </div>
                </div>
              </div>

              {/* Mending Status */}
              <div className="text-right">
                <span className="text-xs px-2 py-0.5 rounded bg-rose-950/80 border border-rose-600/50 text-rose-300">
                  {enemyHp <= enemyData.mendThreshold ? '✨ 可進行心靈修補！' : '防壁堅固'}
                </span>
              </div>
            </div>

            {/* Enemy HP Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-rose-400 font-semibold flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5" /> 敵方生命
                </span>
                <span className="text-[#e2ebf3] tabular-nums">
                  {enemyHp} / {enemyData.maxHp}
                </span>
              </div>
              <div className="h-3 bg-[#1d2730] rounded-full overflow-hidden border border-[#4e2e38] relative">
                <div
                  className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 transition-all duration-300"
                  style={{ width: `${(enemyHp / enemyData.maxHp) * 100}%` }}
                />
                {/* Mending Threshold Marker */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-yellow-300 shadow"
                  style={{ left: `${(enemyData.mendThreshold / enemyData.maxHp) * 100}%` }}
                  title="心靈修補閾值"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#a99097] pt-1">
                <span>{enemyData.heartMissingDesc}</span>
                <span className="text-yellow-400 font-mono">
                  HP &lt; {enemyData.mendThreshold} 可心靈修補
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Battle Field Visuals */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 py-4 px-2">
          {/* Player Unit Representation */}
          <div className="flex flex-col items-center">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-[#d49c3d] shadow-xl bg-[#14232c] relative transform hover:scale-105 transition-transform">
              <img
                src={
                  currentUnit === 'familiar'
                    ? activeFamiliar.image
                    : ASSETS.heroBanner
                }
                alt={currentUnit === 'familiar' ? activeFamiliar.name : 'Oliver'}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-black/60 text-center py-0.5 text-xs text-[#f4eed9] font-serif">
                {currentUnit === 'familiar' ? activeFamiliar.name : '奧利佛'}
              </div>
            </div>
          </div>

          {/* Versus Crest */}
          <div className="flex flex-col items-center text-center">
            <span className="text-2xl font-serif font-black text-[#e8c67a] drop-shadow-md">
              VS
            </span>
            {enemyHp <= enemyData.mendThreshold && enemyHp > 0 && (
              <span className="mt-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white animate-pulse shadow-md">
                ✨ 舉起心靈之瓶給予心靈！
              </span>
            )}
          </div>

          {/* Enemy Boss Visual Representation */}
          <div className="flex flex-col items-center">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-rose-500 shadow-xl bg-[#2b171c] relative transform hover:scale-105 transition-transform">
              <img
                src={enemyData.image}
                alt={enemyData.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-black/60 text-center py-0.5 text-xs text-rose-200 font-serif">
                {enemyData.name}
              </div>
            </div>
          </div>
        </div>

        {/* Live Combat Log Console */}
        <div
          ref={logContainerRef}
          className="relative z-10 bg-[#0d161d]/90 border border-[#2b3c4c] rounded-xl p-3.5 h-28 overflow-y-auto space-y-1.5 text-xs font-mono shadow-inner my-2"
        >
          {logs.map((log) => (
            <div
              key={log.id}
              className={`leading-relaxed ${
                log.type === 'damage'
                  ? 'text-rose-300'
                  : log.type === 'heal'
                  ? 'text-emerald-300'
                  : log.type === 'glint'
                  ? 'text-amber-300 font-bold'
                  : log.type === 'victory'
                  ? 'text-yellow-200 font-bold'
                  : log.type === 'warning'
                  ? 'text-amber-400'
                  : 'text-[#9cb2c4]'
              }`}
            >
              {log.message}
            </div>
          ))}
        </div>

        {/* Command Action Buttons */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
          {/* Action 1: Physical Cut / Slash */}
          <button
            onClick={handleFamiliarSlash}
            disabled={isEnemyTurn || !!battleOver}
            className="p-3 rounded-xl bg-gradient-to-b from-[#e67e22] to-[#d35400] hover:from-[#f39c12] hover:to-[#e67e22] text-white font-bold text-xs sm:text-sm border border-amber-300/40 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
          >
            <Sword className="w-4 h-4" />
            <span>使魔物理斬擊</span>
          </button>

          {/* Action 2: Magic Fireball */}
          <button
            onClick={() => handleCastSpell('fireball')}
            disabled={isEnemyTurn || !!battleOver || playerStats.mp < 12}
            className="p-3 rounded-xl bg-gradient-to-b from-[#c0392b] to-[#962d22] hover:from-[#e74c3c] hover:to-[#c0392b] text-white font-bold text-xs sm:text-sm border border-rose-300/40 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
          >
            <Flame className="w-4 h-4" />
            <span>火球術 (12 MP)</span>
          </button>

          {/* Action 3: Healing Light */}
          <button
            onClick={() => handleCastSpell('healing_touch')}
            disabled={isEnemyTurn || !!battleOver || playerStats.mp < 10}
            className="p-3 rounded-xl bg-gradient-to-b from-[#27ae60] to-[#1e8449] hover:from-[#2ecc71] hover:to-[#27ae60] text-white font-bold text-xs sm:text-sm border border-emerald-300/40 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
          >
            <Heart className="w-4 h-4" />
            <span>治癒之光 (10 MP)</span>
          </button>

          {/* Action 4: Heart Mending */}
          <button
            onClick={handleMendHeart}
            disabled={isEnemyTurn || !!battleOver}
            className={`p-3 rounded-xl text-white font-bold text-xs sm:text-sm border shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 ${
              enemyHp <= enemyData.mendThreshold
                ? 'bg-gradient-to-b from-[#8e44ad] via-[#9b59b6] to-[#6c3483] border-yellow-300 animate-pulse shadow-purple-500/50'
                : 'bg-[#4a3456] border-[#6b5179] text-[#d6c4de]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>給予心靈碎片</span>
          </button>

          {/* Secondary Row: Frost, Guard, Pulse, Overdrive */}
          <button
            onClick={() => handleCastSpell('frostbite')}
            disabled={isEnemyTurn || !!battleOver || playerStats.mp < 14}
            className="p-2.5 rounded-lg bg-[#1f4058] hover:bg-[#285473] text-[#cae9ff] text-xs font-medium border border-[#3b668a] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
          >
            <Droplets className="w-3.5 h-3.5 text-sky-400" />
            <span>冰霜術 (14 MP)</span>
          </button>

          <button
            onClick={() => handleCastSpell('pulse')}
            disabled={isEnemyTurn || !!battleOver || playerStats.mp < 22}
            className="p-2.5 rounded-lg bg-[#31254a] hover:bg-[#433266] text-[#e0d4f7] text-xs font-medium border border-[#5b4685] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-yellow-300" />
            <span>星辰脈衝 (22 MP)</span>
          </button>

          <button
            onClick={handleGuard}
            disabled={isEnemyTurn || !!battleOver || isGuarding}
            className="p-2.5 rounded-lg bg-[#443825] hover:bg-[#5a4a31] text-[#f7e6c4] text-xs font-medium border border-[#786343] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>格擋防禦 (-65%傷)</span>
          </button>

          <button
            onClick={handleMiracleOverdrive}
            disabled={!hasMiracleGlint || isEnemyTurn || !!battleOver}
            className={`p-2.5 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
              hasMiracleGlint
                ? 'bg-amber-400 hover:bg-amber-300 text-slate-900 border-amber-200 animate-bounce'
                : 'bg-[#2b2518] border-[#443a26] text-[#7d7054] cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{hasMiracleGlint ? '奇蹟極限技！(READY)' : '奇蹟光珠(未拾取)'}</span>
          </button>
        </div>
      </div>

      {/* Victory / Defeat Modal Dialog */}
      {battleOver && (
        <div className="bg-[#18232c] border border-[#d49c3d] rounded-xl p-6 text-center shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="text-4xl mb-2">
            {battleOver === 'victory' ? (isMendedVictory ? '💖' : '🏆') : '💀'}
          </div>
          <h3 className="text-xl font-serif font-bold text-[#f5dfa3] mb-1">
            {battleOver === 'victory'
              ? isMendedVictory
                ? '心靈修補奇蹟！完美的純潔勝利！'
                : '勇者降伏！戰鬥勝利！'
              : '奧利佛體力不支……'}
          </h3>
          <p className="text-xs text-[#a2b5c6] max-w-md mx-auto mb-5">
            {battleOver === 'victory'
              ? `${enemyData.name} 感受到了心靈深處的溫暖，消除了暗黑魔導士的陰影。獲得了 ${enemyData.expReward} EXP 與森林古老賢者的敬意！`
              : '不要灰心，返回微風鎮重整裝備與藥水，再次挑戰吧！'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => resetBattle()}
              className="px-5 py-2 text-xs font-bold text-white bg-[#d49c3d] hover:bg-[#b5802a] rounded-lg transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>再戰一場</span>
            </button>

            {selectedBossIndex < BOSS_ENEMIES.length - 1 && battleOver === 'victory' && (
              <button
                onClick={() => resetBattle(selectedBossIndex + 1)}
                className="px-5 py-2 text-xs font-bold text-slate-900 bg-[#f4a261] hover:bg-[#e76f51] rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>挑戰下一隻魔獸：{BOSS_ENEMIES[selectedBossIndex + 1].name}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={() => {
                sound.playClick();
                onReturnToStory();
              }}
              className="px-5 py-2 text-xs font-medium text-[#c5d5e2] hover:text-white bg-[#263747] hover:bg-[#32475a] rounded-lg transition-colors"
            >
              返回故事冒險
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
