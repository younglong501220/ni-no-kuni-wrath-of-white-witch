import React from 'react';
import { HeartPiece, HeartType } from '../types/game';
import { X, Sparkles, Heart } from 'lucide-react';
import { sound } from '../utils/audio';

interface HeartBottleModalProps {
  isOpen: boolean;
  onClose: () => void;
  heartPieces: Record<string, HeartPiece>;
  onUseHeartPreview?: (type: HeartType) => void;
}

export const HeartBottleModal: React.FC<HeartBottleModalProps> = ({
  isOpen,
  onClose,
  heartPieces,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#18232c] border border-[#d49c3d]/50 rounded-xl max-w-2xl w-full p-6 text-[#f3eed9] shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#d49c3d]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#22c55e]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#3c4a56] pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#273847] border border-[#d49c3d]/40 flex items-center justify-center text-[#e9c46a]">
              <Sparkles className="w-5 h-5 text-[#f4a261]" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-[#f8df9e] flex items-center gap-2">
                心靈之瓶 (Heart Bottle)
              </h2>
              <p className="text-xs text-[#9bb0c1]">
                採集世間溢出之光，治癒被暗黑魔導士奪走心靈的無辜生靈
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 text-[#9bb0c1] hover:text-white rounded-lg hover:bg-[#253646] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bottle Visual Representation */}
        <div className="bg-[#111921] border border-[#2b3947] rounded-lg p-5 mb-6 text-center">
          <div className="relative inline-block my-2">
            {/* Flask SVG */}
            <svg width="90" height="130" viewBox="0 0 90 130" className="mx-auto drop-shadow-[0_0_15px_rgba(212,156,61,0.25)]">
              {/* Neck & Cork */}
              <rect x="35" y="8" width="20" height="12" rx="3" fill="#a47148" stroke="#f4a261" strokeWidth="1.5" />
              <rect x="33" y="20" width="24" height="6" fill="#c8963e" />
              {/* Flask Body */}
              <path
                d="M 33 26 L 33 45 C 33 45, 12 70, 12 95 C 12 118, 30 126, 45 126 C 60 126, 78 118, 78 95 C 78 70, 57 45, 57 26 Z"
                fill="rgba(30, 48, 65, 0.75)"
                stroke="#d49c3d"
                strokeWidth="2.5"
              />
              {/* Liquid / Crystals inner glow */}
              <circle cx="45" cy="85" r="28" fill="url(#bottleGlow)" opacity="0.8" />
              <defs>
                <radialGradient id="bottleGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f8df9e" stopOpacity="0.8" />
                  <stop offset="60%" stopColor="#22c55e" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </radialGradient>
              </defs>
              {/* Inner sparkles */}
              <circle cx="38" cy="80" r="3" fill="#22c55e" className="animate-pulse" />
              <circle cx="52" cy="74" r="3.5" fill="#f59e0b" className="animate-pulse" />
              <circle cx="45" cy="95" r="3" fill="#ef4444" className="animate-pulse" />
              <circle cx="36" cy="98" r="2.5" fill="#38bdf8" className="animate-pulse" />
            </svg>
          </div>
          <p className="text-xs text-[#a0afbe] max-w-md mx-auto">
            當遭遇暴戾狂躁、自暴自棄或心如死灰之人時，先削弱其防禦，再用魔杖發動【給予心靈】，將缺損的碎片回補。
          </p>
        </div>

        {/* Fragments Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {Object.values(heartPieces).map((piece) => {
            const hasPiece = piece.count > 0;
            return (
              <div
                key={piece.id}
                className={`p-3.5 rounded-lg border transition-all ${
                  hasPiece
                    ? 'bg-[#1b2733] border-[#3e4f60]'
                    : 'bg-[#141d24]/60 border-[#25323d] opacity-55'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full inline-block shadow-sm"
                      style={{
                        backgroundColor: piece.color,
                        boxShadow: hasPiece ? `0 0 8px ${piece.color}` : 'none',
                      }}
                    />
                    <span className="font-serif font-semibold text-sm text-[#f1ede2]">
                      {piece.name}
                    </span>
                  </div>
                  <span className="text-xs font-mono tabular-nums px-2 py-0.5 rounded bg-[#101920] border border-[#2e3e4e] text-[#e5c97b]">
                    x {piece.count}
                  </span>
                </div>
                <p className="text-xs text-[#9bb0c1] leading-relaxed mb-1.5">
                  {piece.description}
                </p>
                <div className="text-[11px] text-[#6d8294] italic">
                  來源：{piece.source}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[#2f3d4b]">
          <div className="text-xs text-[#8ca1b3] flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-[#ef4444]" />
            <span>心靈的連繫是二之國最強大的魔法</span>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-1.5 text-xs font-medium text-white bg-[#d49c3d] hover:bg-[#b9842c] rounded-md transition-colors"
          >
            關閉心靈之瓶
          </button>
        </div>
      </div>
    </div>
  );
};
