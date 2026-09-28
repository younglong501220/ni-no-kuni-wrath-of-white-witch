/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameTab, PlayerStats, HeartPiece, HeartType } from './types/game';
import { INITIAL_HEARTS } from './data/battleData';
import { TopNav } from './components/TopNav';
import { StoryMode } from './components/StoryMode';
import { BattleMode } from './components/BattleMode';
import { GrimoireMode } from './components/GrimoireMode';
import { FamiliarSanctuary } from './components/FamiliarSanctuary';
import { HeartBottleModal } from './components/HeartBottleModal';
import { sound } from './utils/audio';

export default function App() {
  const [currentTab, setCurrentTab] = useState<GameTab>('story');
  const [isHeartBottleOpen, setIsHeartBottleOpen] = useState(false);
  const [activeBattleBossId, setActiveBattleBossId] = useState<string>('forest_guardian');

  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    name: '奧利佛',
    title: '純潔之子',
    level: 1,
    hp: 60,
    maxHp: 60,
    mp: 35,
    maxMp: 35,
    exp: 0,
    nextExp: 100,
    wand: '老舊的魔杖',
    equippedFamiliarId: 'mitey',
  });

  const [heartPieces, setHeartPieces] = useState<Record<string, HeartPiece>>(INITIAL_HEARTS);

  const handleUpdatePlayerStats = (stats: Partial<PlayerStats>) => {
    setPlayerStats((prev) => ({
      ...prev,
      ...stats,
    }));
  };

  const handleGainHeart = (type: HeartType) => {
    setHeartPieces((prev) => {
      const piece = prev[type];
      if (!piece) return prev;
      return {
        ...prev,
        [type]: {
          ...piece,
          count: piece.count + 1,
        },
      };
    });
  };

  const handleMendHeartSuccess = (enemyId: string, heartType: string) => {
    // When enemy heart is successfully mended, player gets EXP and gains a level!
    setPlayerStats((prev) => {
      const nextExp = prev.exp + 60;
      const willLevelUp = nextExp >= prev.nextExp;
      return {
        ...prev,
        level: willLevelUp ? prev.level + 1 : prev.level,
        maxHp: willLevelUp ? prev.maxHp + 15 : prev.maxHp,
        hp: willLevelUp ? prev.maxHp + 15 : prev.hp,
        maxMp: willLevelUp ? prev.maxMp + 10 : prev.maxMp,
        mp: willLevelUp ? prev.maxMp + 10 : prev.mp,
        exp: willLevelUp ? nextExp - prev.nextExp : nextExp,
        nextExp: willLevelUp ? prev.nextExp + 50 : prev.nextExp,
      };
    });
  };

  const handleTriggerBattle = (bossId: string) => {
    sound.playSpellCast();
    setActiveBattleBossId(bossId);
    setCurrentTab('battle');
  };

  const handleResetGame = () => {
    setPlayerStats({
      name: '奧利佛',
      title: '純潔之子',
      level: 1,
      hp: 60,
      maxHp: 60,
      mp: 35,
      maxMp: 35,
      exp: 0,
      nextExp: 100,
      wand: '老舊的魔杖',
      equippedFamiliarId: 'mitey',
    });
    setHeartPieces(INITIAL_HEARTS);
    setCurrentTab('story');
  };

  // Count total heart pieces collected
  const totalHeartsCount = Object.values(heartPieces).reduce((acc, h) => acc + h.count, 0);

  return (
    <div className="min-h-screen bg-[#111921] text-[#f4eed9] flex flex-col font-sans selection:bg-[#d49c3d] selection:text-white">
      {/* Universal Top Navigation Header */}
      <TopNav
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onOpenHeartBottle={() => setIsHeartBottleOpen(true)}
        onResetGame={handleResetGame}
        heartPiecesCount={totalHeartsCount}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 pb-16">
        {currentTab === 'story' && (
          <StoryMode
            playerStats={playerStats}
            onUpdatePlayerStats={handleUpdatePlayerStats}
            onGainHeart={handleGainHeart}
            onTriggerBattle={handleTriggerBattle}
            onOpenGrimoire={() => setCurrentTab('grimoire')}
            onOpenHeartBottle={() => setIsHeartBottleOpen(true)}
          />
        )}

        {currentTab === 'battle' && (
          <BattleMode
            playerStats={playerStats}
            onUpdatePlayerStats={handleUpdatePlayerStats}
            heartPieces={heartPieces}
            onMendHeartSuccess={handleMendHeartSuccess}
            initialBossId={activeBattleBossId}
            onReturnToStory={() => setCurrentTab('story')}
          />
        )}

        {currentTab === 'grimoire' && <GrimoireMode />}

        {currentTab === 'familiars' && <FamiliarSanctuary />}
      </main>

      {/* Heart Bottle Modal */}
      <HeartBottleModal
        isOpen={isHeartBottleOpen}
        onClose={() => setIsHeartBottleOpen(false)}
        heartPieces={heartPieces}
      />

      {/* Footer */}
      <footer className="border-t border-[#293847] bg-[#0c131a] py-6 px-4 text-center text-xs text-[#7d93a6]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif font-semibold text-[#c8963e]">
              二之國：白色聖灰的女王
            </span>
            <span aria-hidden="true">·</span>
            <span>LEVEL-5 & STUDIO GHIBLI 經典奇幻致敬</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-[#637788]">
            <span>純潔之子奧利佛</span>
            <span aria-hidden="true">·</span>
            <span>大妖精小滴</span>
            <span aria-hidden="true">·</span>
            <span>心靈之瓶與使魔共鳴</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
