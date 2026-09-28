import React from 'react';
import { GameTab } from '../types/game';
import { Volume2, VolumeX, Music, RotateCcw } from 'lucide-react';
import { sound } from '../utils/audio';

interface TopNavProps {
  currentTab: GameTab;
  onSelectTab: (tab: GameTab) => void;
  onOpenHeartBottle: () => void;
  onResetGame: () => void;
  heartPiecesCount: number;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenHeartBottle,
  onResetGame,
  heartPiecesCount,
}) => {
  const [isMuted, setIsMuted] = React.useState(sound.isMuted());
  const [bgmActive, setBgmActive] = React.useState(sound.isBgmActive());

  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const handleToggleBgm = () => {
    const active = sound.toggleBgm();
    setBgmActive(active);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#162029]/95 backdrop-blur-md border-b border-[#3e3424]/60 px-4 md:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => {
            sound.playClick();
            onSelectTab('story');
          }}
          className="text-lg md:text-xl font-serif tracking-wide text-[#e8c67a] hover:text-[#f8df9e] transition-colors flex items-center gap-2 text-left"
        >
          <span className="text-xl">✨</span>
          <span className="font-semibold font-['Cinzel',serif]">二之國：白色聖灰的女王</span>
        </button>

        {/* Zone 2: 4-5 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#c4b998]">
          <button
            onClick={() => {
              sound.playClick();
              onSelectTab('story');
            }}
            className={`pb-1 transition-colors relative ${
              currentTab === 'story'
                ? 'text-[#f6de9d] font-semibold'
                : 'hover:text-[#f2e6cb]'
            }`}
          >
            故事冒險
            {currentTab === 'story' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d49c3d]" />
            )}
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onSelectTab('battle');
            }}
            className={`pb-1 transition-colors relative ${
              currentTab === 'battle'
                ? 'text-[#f6de9d] font-semibold'
                : 'hover:text-[#f2e6cb]'
            }`}
          >
            使魔戰鬥
            {currentTab === 'battle' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d49c3d]" />
            )}
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onSelectTab('grimoire');
            }}
            className={`pb-1 transition-colors relative ${
              currentTab === 'grimoire'
                ? 'text-[#f6de9d] font-semibold'
                : 'hover:text-[#f2e6cb]'
            }`}
          >
            魔法大典
            {currentTab === 'grimoire' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d49c3d]" />
            )}
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onSelectTab('familiars');
            }}
            className={`pb-1 transition-colors relative ${
              currentTab === 'familiars'
                ? 'text-[#f6de9d] font-semibold'
                : 'hover:text-[#f2e6cb]'
            }`}
          >
            使魔庭院
            {currentTab === 'familiars' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d49c3d]" />
            )}
          </button>

          <button
            onClick={() => {
              sound.playHeartMend();
              onOpenHeartBottle();
            }}
            className="pb-1 transition-colors text-[#99e2b4] hover:text-[#c7f9cc] flex items-center gap-1.5"
          >
            <span>心靈之瓶</span>
            <span className="text-xs text-[#a3b18a] tabular-nums">({heartPiecesCount}片)</span>
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2">
          {/* Audio Controls */}
          <button
            onClick={handleToggleBgm}
            title={bgmActive ? '關閉吉卜力風背景弦樂' : '開啟吉卜力風背景弦樂'}
            className={`p-2 rounded border text-xs transition-colors flex items-center gap-1.5 ${
              bgmActive
                ? 'border-[#c8963e] bg-[#c8963e]/20 text-[#f5d996]'
                : 'border-[#3d4f5d] bg-[#1e2a34] text-[#a4b2be] hover:text-white'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-xs">{bgmActive ? 'BGM 演奏中' : 'BGM 伴奏'}</span>
          </button>

          <button
            onClick={handleToggleMute}
            title={isMuted ? '解除靜音' : '靜音音效'}
            className="p-2 rounded border border-[#3d4f5d] bg-[#1e2a34] text-[#a4b2be] hover:text-white transition-colors"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onResetGame();
            }}
            title="重設故事與冒險"
            className="p-2 rounded border border-[#3d4f5d] bg-[#1e2a34] text-[#a4b2be] hover:text-[#e76f51] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mobile nav row */}
      <div className="flex md:hidden items-center justify-around pt-2.5 mt-2 border-t border-[#3e3424]/40 text-xs font-medium text-[#c4b998]">
        <button
          onClick={() => {
            sound.playClick();
            onSelectTab('story');
          }}
          className={`${currentTab === 'story' ? 'text-[#f6de9d] font-bold' : ''}`}
        >
          故事冒險
        </button>
        <button
          onClick={() => {
            sound.playClick();
            onSelectTab('battle');
          }}
          className={`${currentTab === 'battle' ? 'text-[#f6de9d] font-bold' : ''}`}
        >
          使魔戰鬥
        </button>
        <button
          onClick={() => {
            sound.playClick();
            onSelectTab('grimoire');
          }}
          className={`${currentTab === 'grimoire' ? 'text-[#f6de9d] font-bold' : ''}`}
        >
          魔法大典
        </button>
        <button
          onClick={() => {
            sound.playClick();
            onSelectTab('familiars');
          }}
          className={`${currentTab === 'familiars' ? 'text-[#f6de9d] font-bold' : ''}`}
        >
          使魔庭院
        </button>
        <button
          onClick={() => {
            sound.playHeartMend();
            onOpenHeartBottle();
          }}
          className="text-[#99e2b4]"
        >
          心靈之瓶
        </button>
      </div>
    </header>
  );
};
