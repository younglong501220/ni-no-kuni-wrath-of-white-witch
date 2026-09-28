import { Familiar, Enemy, MagicSpell, HeartPiece } from '../types/game';
import { ASSETS } from '../assets';

export const INITIAL_FAMILIARS: Familiar[] = [
  {
    id: 'mitey',
    name: '小咪俠',
    title: '勇者幼戰士',
    species: '戰士系幻獸 (Mitey)',
    element: 'physical',
    level: 3,
    hp: 75,
    maxHp: 75,
    atk: 18,
    def: 14,
    matk: 8,
    mdef: 9,
    image: ASSETS.familiarMitey,
    favoriteFood: '香濃巧克力',
    affinity: 35,
    description: '身穿小巧板金甲、手持迷你劍盾的熱血戰士。揮舞長劍勇猛無比，是新手魔法師最信任的第一使魔！',
    skills: [
      {
        id: 'slash',
        name: '裂空斬 (Cutloose)',
        type: 'attack',
        costMp: 0,
        power: 16,
        description: '躍身而起斬下一記迅捷的弧光劍氣，造成物理傷害。'
      },
      {
        id: 'warcry',
        name: '戰士吶喊 (War Cry)',
        type: 'buff',
        costMp: 8,
        power: 0,
        description: '發出激昂的咆哮，短時間內提升自身物理攻擊力 30%。'
      }
    ]
  },
  {
    id: 'thumbelemur',
    name: '指猴僧',
    title: '靈巧林行者',
    species: '靈長系幻獸 (Thumbelemur)',
    element: 'wood',
    level: 2,
    hp: 60,
    maxHp: 60,
    atk: 14,
    def: 10,
    matk: 16,
    mdef: 12,
    image: ASSETS.familiarMitey,
    favoriteFood: '甜心布丁',
    affinity: 20,
    description: '在樹冠上輕靈跳躍的小精靈猴，動作敏捷且具備草木魔力，能引發林木旋風。',
    skills: [
      {
        id: 'leaf_blade',
        name: '飛葉疾刃',
        type: 'attack',
        costMp: 6,
        power: 20,
        description: '甩動尾巴射出鋒利的翠綠樹葉，造成木屬性魔法傷害。'
      }
    ]
  },
  {
    id: 'seed_sprite',
    name: '春萌妖精',
    title: '治癒的花苞',
    species: '植物系幻獸 (Seed Sprite)',
    element: 'water',
    level: 3,
    hp: 55,
    maxHp: 55,
    atk: 9,
    def: 11,
    matk: 22,
    mdef: 18,
    image: ASSETS.familiarMitey,
    favoriteFood: '彩虹水果塔',
    affinity: 50,
    description: '頭頂盛開著小睡蓮的溫柔妖精，能引導甘霖滋潤傷口並緩解疲勞。',
    skills: [
      {
        id: 'dew_drop',
        name: '甘霖露珠',
        type: 'buff',
        costMp: 12,
        power: 25,
        description: '釋放清泉之氣，為全體隊員回復 25 點體力。'
      }
    ]
  }
];

export const INITIAL_SPELLS: MagicSpell[] = [
  {
    id: 'fireball',
    name: '火球術 (Fireball)',
    japanese: 'ファイアボール',
    costMp: 12,
    element: 'fire',
    description: '從魔杖尖端射出旋轉燃燒的熾熱火球，對敵人造成可觀的火焰傷害。對植物與木系魔獸有克制特效！',
    runeName: '火炎之印'
  },
  {
    id: 'frostbite',
    name: '冰霜術 (Frostbite)',
    japanese: 'フロスト',
    costMp: 14,
    element: 'water',
    description: '凝結空氣中的寒氣化作銳利冰錐刺向對手，有機率降低敵人的攻擊速度。',
    runeName: '寒冰之印'
  },
  {
    id: 'healing_touch',
    name: '治癒之光 (Healing Touch)',
    japanese: 'ヒールタッチ',
    costMp: 10,
    element: 'heal',
    description: '以心靈純潔的魔力喚起溫暖的金光，立即恢復奧利佛或使魔 35 點體力。',
    runeName: '生命之印'
  },
  {
    id: 'pulse',
    name: '星辰脈衝 (Pulse)',
    japanese: 'パルス',
    costMp: 22,
    element: 'light',
    description: '奧利佛高舉魔杖，召喚星穹光束轟擊戰場，造成強大的全場光屬性衝擊波！',
    runeName: '星穹之印'
  }
];

export const INITIAL_HEARTS: Record<string, HeartPiece> = {
  kindness: {
    id: 'kindness',
    name: '善良的心靈碎片',
    english: 'Kindness',
    color: '#22c55e',
    glowColor: 'rgba(34, 197, 94, 0.4)',
    count: 1,
    description: '散發著柔和翡翠綠光的結晶。能安撫因失去善良而狂暴嗜血的心靈殘缺者。',
    source: '奧利佛在微風鎮對母親的思念與心靈之瓶的共鳴。'
  },
  courage: {
    id: 'courage',
    name: '勇氣的心靈碎片',
    english: 'Courage',
    color: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    count: 1,
    description: '如晨曦初升般的明亮琥珀光球。能驅散恐懼，讓膽怯退縮之人重新挺起胸膛。',
    source: '跨入次元光門時，奧利佛下定決心拯救母親的堅毅勇氣。'
  },
  enthusiasm: {
    id: 'enthusiasm',
    name: '熱情的心靈碎片',
    english: 'Enthusiasm',
    color: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.4)',
    count: 1,
    description: '如同烈火跳動的玫瑰赤紅碎片。能喚醒沉睡怠惰的靈魂，重新點燃追求夢想的熱血。',
    source: '叮咚戴爾城揮汗鍛造神劍的貓人熱血鐵匠大叔。'
  },
  belief: {
    id: 'belief',
    name: '信念的心靈碎片',
    english: 'Belief',
    color: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    count: 0,
    description: '宛如澄澈夜空的璀璨天青石結晶。能破除暗黑魔導士的虛妄幻象，堅定追尋奇蹟的信仰。',
    source: '探索古代賢者神殿獲得。'
  }
};

export const BOSS_ENEMIES: Enemy[] = [
  {
    id: 'forest_guardian',
    name: '狂暴森之守衛',
    title: '失心的林木守護者',
    hp: 150,
    maxHp: 150,
    atk: 18,
    def: 12,
    requiredHeart: 'kindness',
    heartMissingDesc: '【心靈殘缺：失去善良】眼瞳泛著漆黑狂暴兇光，已分不清敵友。',
    mendThreshold: 45, // <45 HP can be mended!
    image: ASSETS.forestGuardianBoss,
    specialMoveName: '古樹撼地重擊 (Earth Slam)',
    expReward: 60
  },
  {
    id: 'corrupted_golem',
    name: '熔火崩岩魔像',
    title: '失控的熔岩石獸',
    hp: 220,
    maxHp: 220,
    atk: 25,
    def: 20,
    requiredHeart: 'courage',
    heartMissingDesc: '【心靈殘缺：失去勇氣】被暗黑恐懼吞噬，狂亂地噴吐熔岩。',
    mendThreshold: 60,
    image: ASSETS.forestGuardianBoss,
    specialMoveName: '炙熱熔岩噴發 (Magma Burst)',
    expReward: 95
  },
  {
    id: 'shadow_cat_phantom',
    name: '暗黑夢魘之影',
    title: '魔導士的詛咒傀儡',
    hp: 280,
    maxHp: 280,
    atk: 32,
    def: 18,
    requiredHeart: 'enthusiasm',
    heartMissingDesc: '【心靈殘缺：失去熱情】冷酷麻木的虛空幽靈，企圖奪走世界色彩。',
    mendThreshold: 75,
    image: ASSETS.forestGuardianBoss,
    specialMoveName: '幽冥靈魂撕裂 (Soul Rend)',
    expReward: 140
  }
];

export const FAMILIAR_TREATS = [
  {
    id: 'choc',
    name: '勇氣黑巧克力',
    icon: '🍫',
    statBonus: '+2 物理攻擊 (ATK)',
    type: 'atk',
    desc: '苦甜濃郁的頂級可可豆製作，使魔吃了渾身充滿力量！'
  },
  {
    id: 'flan',
    name: '星光焦糖布丁',
    icon: '🍮',
    statBonus: '+2 魔法攻擊 (MATK)',
    type: 'matk',
    desc: '入口即化的夢幻甜品，能大幅活化使魔體內的魔力迴路。'
  },
  {
    id: 'cake',
    name: '巨木榛果蛋糕',
    icon: '🍰',
    statBonus: '+2 物理防禦 (DEF)',
    type: 'def',
    desc: '採集深幽之森頂級堅果烘焙而成，強健使魔的筋骨板甲。'
  },
  {
    id: 'sundae',
    name: '彩虹冰淇淋聖代',
    icon: '🍨',
    statBonus: '+2 魔法防禦與親密度',
    type: 'mdef',
    desc: '五彩繽紛的清涼點心，能增加與使魔之間的親密羈絆！'
  }
];
