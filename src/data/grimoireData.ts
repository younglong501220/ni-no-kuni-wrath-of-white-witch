export interface GrimoireChapter {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  content: {
    heading: string;
    paragraphs: string[];
    runeSvg?: string;
    metadata?: { label: string; value: string }[];
  }[];
}

export const GRIMOIRE_CHAPTERS: GrimoireChapter[] = [
  {
    id: 'magic_spells',
    title: '魔法咒印篇',
    subtitle: '古賢者傳承的秘術符文',
    iconName: 'Wand2',
    content: [
      {
        heading: '開啟之門（Gateway / ゲートウェイ）',
        paragraphs: [
          '跨越世界障壁的至高禁忌魔法。必須由內心毫無雜念、具備純潔靈魂的「純潔之子」揮動合格的魔杖方可施展。',
          '在空間的薄弱節點（如鏡面、古老水池或林間空地）描繪出雙同心圓符文，以思念為引導，即可在現實世界與二之國之間開啟光之通道。'
        ],
        runeSvg: 'gateway',
        metadata: [
          { label: '魔法學派', value: '時空界隈秘術' },
          { label: '魔力消耗', value: '心靈共鳴（無常規MP消耗）' },
          { label: '詠唱媒介', value: '老舊的魔杖、魔法大典' }
        ]
      },
      {
        heading: '借取心靈（Take Heart）與 給予心靈（Give Heart）',
        paragraphs: [
          '二之國的萬物生靈皆由心靈的力量所維繫。當某個人的心靈碎片被暗黑魔導士奪走，就會陷入恐懼、冷漠、暴戾或無精打采的「心之殘缺」狀態。',
          '持有【心靈之瓶】的偉大魔法師，能從某位熱情洋溢、善良慈愛或無畏勇敢的人身上借出一縷滿溢的心靈光輝，並將其注入心之殘缺者體內，令其恢復健康與光明。'
        ],
        runeSvg: 'heart',
        metadata: [
          { label: '核心道具', value: '心靈之瓶（Heart Bottle）' },
          { label: '心靈要素', value: '善良、勇氣、熱情、信念' },
          { label: '施法準則', value: '不可強取，只能採集自願溢出之光' }
        ]
      },
      {
        heading: '元素法術三昧：火球、冰霜與星穹脈衝',
        paragraphs: [
          '【火球術】：凝聚大氣中活躍的火精靈，對木系植物生物造成雙倍灼燒破壞。',
          '【冰霜術】：以極低溫急凍空氣中的水分子，壓制火系魔物的烈焰並延緩敵人的攻勢。',
          '【星辰脈衝】：引動太虛星辰之力的全場光明爆破，是奧利佛獨有的天賦魔導威能。'
        ],
        runeSvg: 'elements',
        metadata: [
          { label: '施法要點', value: '掌握敵方屬性剋制，事半功倍' }
        ]
      }
    ]
  },
  {
    id: 'familiars_compendium',
    title: '使魔全書篇',
    subtitle: '心靈共鳴孕育的幻獸夥伴',
    iconName: 'Sparkles',
    content: [
      {
        heading: '何為使魔（Familiars / イマージェン）？',
        paragraphs: [
          '使魔是誕生於人心深處情感與自然精靈共鳴的奇妙生靈。只有具備純潔靈魂與心靈之琴的魔法師才能馴服並指揮牠們。',
          '使魔與主人共享心靈視界。在戰鬥中，主人可以將魔力傳輸給使魔，使魔也能代替主人抵擋猛烈的物理攻勢。'
        ],
        metadata: [
          { label: '使魔星象', value: '太陽（物理）、月亮（魔法）、星星（敏捷）、雙子（全能）' },
          { label: '飼育方式', value: '投餵點心甜品提升對應能力值' }
        ]
      },
      {
        heading: '代表性使魔：小咪俠（Mitey）與它的進化',
        paragraphs: [
          '小咪俠是夏之大地最著名的太陽星象使魔。身穿厚實板甲的小個子劍士，性格剛毅忠誠，面對比自己巨大十倍的強敵也絕不退縮。',
          '當小咪俠等級提升並食用進化之星滴（Star Drop）時，將能蛻變為高階形態【狂暴小咪】或【聖光守護者】！'
        ],
        metadata: [
          { label: '最愛食物', value: '香濃巧克力（+攻擊力）' },
          { label: '特技必殺', value: '裂空斬 (Cutloose)' }
        ]
      }
    ]
  },
  {
    id: 'world_history',
    title: '兩界靈魂志',
    subtitle: '微風鎮與二之國的命運交織',
    iconName: 'Globe',
    content: [
      {
        heading: '靈魂雙生子理論（Soulmates）',
        paragraphs: [
          '微風鎮（一之國）與二之國看似處於不同次元，但兩界的靈魂卻如同鏡花水月般彼此牽絆。在一個世界受傷或沉睡的人，其在另一個世界的雙生子命運也會蒙上陰影。',
          '奧利佛的母親艾莉，在二之國對應著掌握世界光輝的偉大賢者艾莉西亞。拯救艾莉西亞賢者，是救回母親靈魂的唯一希望。'
        ],
        metadata: [
          { label: '微風鎮對應', value: '現代寧靜小鎮，老爺車與洋房' },
          { label: '二之國對應', value: '叮咚戴爾、格羅巴德、哈姆林帝國' }
        ]
      },
      {
        heading: '大妖精小滴的傳說',
        paragraphs: [
          '掛著黃銅燈籠的大妖精小滴，曾是妖精之國最吵鬧卻最富智慧的引路人。因觸怒暗黑魔導士傑達（Shadar）而被詛咒變成了布偶，沉睡多年。',
          '直到奧利佛純真真摯的眼淚落在他身上，古老詛咒才被奇蹟般地打破！'
        ]
      }
    ]
  }
];
