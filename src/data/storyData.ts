import { StoryNode } from '../types/game';

export const STORY_NODES: Record<string, StoryNode> = {
  prologue_start: {
    id: 'prologue_start',
    chapter: '序章：微風鎮的眼淚與妖精降臨',
    location: '微風鎮 · 奧利佛的臥室',
    narrative: [
      '你站在現實世界（微風鎮）的臥室裡，眼眶泛紅地抱著母親留給你的布偶。',
      '窗外灑下微風鎮傍晚溫暖的夕陽，但房內卻顯得無比寂靜冷清。',
      '突然，你無比思念母親的眼淚滴落在布偶上，布偶發出溫暖的金色光芒！',
      '鼻子上的黃銅小提燈晃了晃——竟然活靈活現地動了起來！'
    ],
    drippyQuote: '哇啊啊！悶死我啦！小子，別哭了！我是二之國的大妖精小滴！聽著，在二之國，有一個和你母親靈魂相連的偉大賢者艾莉西亞！如果能去那裡拯救她，或許你的母親……！',
    choices: [
      {
        text: '【學習魔法】翻開《魔法大典》，學習開啟異世界通道的禁忌魔法【開啟之門（Gateway）】。',
        actionId: 'learn_gateway',
        leadToNodeId: 'learn_gateway_node',
        effect: {
          gainItem: '魔法大典（初級頁面）',
          mpChange: 15,
        }
      },
      {
        text: '【詢問細節】向小滴詢問：「靈魂相連是什麼意思？二之國究竟是個什麼樣的地方？」',
        actionId: 'ask_drippy',
        leadToNodeId: 'ask_drippy_node',
      },
      {
        text: '【準備行李】在房間裡搜索，看看有沒有媽媽留下的遺物或能用作冒險道具的物品。',
        actionId: 'search_room',
        leadToNodeId: 'search_room_node',
        effect: {
          gainItem: '母親的懷錶與心靈之瓶',
          gainHeart: 'kindness',
        }
      },
      {
        text: '【緊握魔杖】凝視手中古舊的魔杖，深吸一口氣，下定決心踏上旅程。',
        actionId: 'resolve_journey',
        leadToNodeId: 'resolve_node',
        effect: {
          gainHeart: 'courage',
        }
      }
    ]
  },

  ask_drippy_node: {
    id: 'ask_drippy_node',
    chapter: '序章：兩個世界的靈魂雙生子',
    location: '微風鎮 · 奧利佛的臥室',
    narrative: [
      '小滴雙手叉腰，提燈在空中一晃一晃，露出一副「真拿你沒辦法」的得意神情。',
      '「聽好了小子！這個世界上的人，在另一個世界都有一個靈魂相連的『雙生子』！」',
      '「你的母親艾莉，在二之國的對應者正是對抗暗黑魔導士的偉大賢者艾莉西亞大人！」',
      '「但現在二之國被邪惡魔導士下了詛咒，許多人的心靈碎片被奪走，變成失去熱情或善良的『心之殘缺者』……」',
      '「艾莉西亞大人被封印了，只要你去拯救她，心靈連繫的奇蹟就可能讓你的母親甦醒！」'
    ],
    drippyQuote: '所以別像個愛哭鬼一樣啦！拿起魔杖，你可是天生具備強大魔法潛能的純潔之子啊！',
    choices: [
      {
        text: '「我明白了！小滴，教我如何打開通往二之國的大門！」',
        actionId: 'learn_gateway',
        leadToNodeId: 'learn_gateway_node',
      },
      {
        text: '「在出發前，我想在房間裡找找媽媽留下的物品。」',
        actionId: 'search_room',
        leadToNodeId: 'search_room_node',
        effect: {
          gainItem: '母親的手縫護身符',
          gainHeart: 'kindness',
        }
      }
    ]
  },

  search_room_node: {
    id: 'search_room_node',
    chapter: '序章：母親的遺物與心靈之瓶',
    location: '微風鎮 · 奧利佛的書桌與衣櫃',
    narrative: [
      '你輕輕拉開書桌抽屜，在厚厚的圖畫紙下，發現了一只精緻的水晶空瓶，瓶口雕刻著太陽與月亮的紋樣。',
      '小滴眼睛一亮：「唷！這不是【心靈之瓶（Heart Bottle）】嗎？！還有媽媽常為你打理的懷錶！」',
      '當你緊握心靈之瓶時，心中對母親那份純粹的溫柔與善意化作一團翠綠色的光芒，緩緩流入瓶中——',
      '✨ 獲得了【善良的心靈碎片（Kindness）】！'
    ],
    drippyQuote: '太棒了小子！這瓶子能儲存人們溢出的心靈力量，拿來治癒那些被奪走心靈的悲慘傢伙最有用啦！',
    choices: [
      {
        text: '翻開古老手冊，開始學習【開啟之門（Gateway）】！',
        actionId: 'learn_gateway',
        leadToNodeId: 'learn_gateway_node',
      }
    ]
  },

  learn_gateway_node: {
    id: 'learn_gateway_node',
    chapter: '第一章：命運的交界與開啟之門',
    location: '微風鎮 · 荒廢的城鎮廣場水池',
    narrative: [
      '你翻開厚重的《魔法大典》，書頁在微風中無風自翻，停在散發金芒的一頁。',
      '上面繪製著神秘的同心圓魔法符文【開啟之門（Gateway）】。',
      '在小滴的引導下，你們來到微風鎮無人的老噴泉前。你舉起魔杖，集中精神在心頭默念咒文……',
      '轟！虛空中泛起如同水波般的金色漣漪，一道通往異世界的巨大光之門轟然洞開！',
      '微風與青草的香氣撲面而來，兩個世界交織的光芒將你與小滴徹底包圍！'
    ],
    drippyQuote: '抓緊啦小子！穿過這道門，前面就是傳說中的魔法大陸——二之國！',
    choices: [
      {
        text: '踏入光芒之門，降臨二之國的青翠草原【夏之大地（Summerlands）】！',
        actionId: 'enter_ninokuni',
        leadToNodeId: 'summerlands_entry',
        effect: {
          gainHeart: 'courage',
        }
      }
    ]
  },

  summerlands_entry: {
    id: 'summerlands_entry',
    chapter: '第一章：夏之大地與使魔的共鳴',
    location: '二之國 · 夏之大地平原',
    narrative: [
      '當光芒消散，眼前是一片望不到邊際的蔚藍天空與翠綠丘陵！',
      '遠方的群山之上，座落著壯麗的童話城堡——貓妖精與犬妖精的國度【叮咚戴爾城】。',
      '但在進入王國之前，一隻身穿迷你鎧甲、手持小木盾與佩劍的小精靈從灌木叢中跳出！',
      '那是【小咪俠（Mitey）】！牠眨著大眼睛看著你，感受到你心靈的純淨，主動跳到你的肩頭！'
    ],
    drippyQuote: '哇哈哈！這不是戰士型使魔小咪俠嗎！小子，你天生就有馴服使魔的心靈共鳴天賦啊！以後牠就是你的第一位戰鬥夥伴啦！',
    choices: [
      {
        text: '「請多指教，小咪俠！」伸出手與使魔碰拳，前往【深幽之森】尋找巨木長老。',
        actionId: 'enter_deep_wood',
        leadToNodeId: 'deep_wood_gate',
        effect: {
          gainItem: '夥伴：使魔小咪俠加入隊伍！',
        }
      }
    ]
  },

  deep_wood_gate: {
    id: 'deep_wood_gate',
    chapter: '第二章：深幽之森的異變',
    location: '深幽之森 · 古木入口',
    narrative: [
      '古樹參天的深幽之森瀰漫著幽靜的霧氣與發光的螢火蟲。',
      '傳說森林深處的【巨木長老】守護著這片大地，並知曉通往貓王國的古老秘密。',
      '然而，空氣中卻傳來沉重的震動聲與野獸的怒吼！',
      '原本溫和的【森林守衛】雙眼泛著不祥的漆黑紫光，巨木巨石化作的雙臂狂暴地砸向四周樹木！'
    ],
    drippyQuote: '糟了！那傢伙被暗黑魔導士奪走了【善良之心】！現在牠眼裡只有破壞！小子，我們必須打倒牠的狂暴狀態，再用【心靈之瓶】把善良還給牠！',
    choices: [
      {
        text: '【進入戰鬥】拔出魔杖，召喚使魔小咪俠，迎戰【狂暴森之守衛】！',
        actionId: 'trigger_guardian_battle',
        leadToNodeId: 'after_guardian_battle',
        effect: {
          triggerBattle: 'forest_guardian',
        }
      },
      {
        text: '【觀察弱點】先讓小滴分析守衛的行動模式，尋找破綻。',
        actionId: 'observe_boss',
        leadToNodeId: 'observe_boss_node',
      }
    ]
  },

  observe_boss_node: {
    id: 'observe_boss_node',
    chapter: '第二章：小滴的戰術秘傳',
    location: '深幽之森 · 樹冠掩蔽處',
    narrative: [
      '你與小滴伏在灌木後仔細觀察。',
      '森林守衛揮拳後有短暫的遲鈍破綻，且胸口刻印著古木核心，對【火球術】十分畏懼！',
      '小滴壓低聲音說：「記住戰鬥要訣！當牠準備重擊時立刻按【防禦（Guard）】降低傷害！」',
      '「戰場上會掉落綠色（回復HP）與藍色（回復MP）的光珠，還有千載難逢的【金色奇蹟光珠】！」',
      '「最重要的是：當把牠 HP 打到 40 以下時，立刻使用【心靈之瓶】注入善良碎片，就能徹底解救牠！」'
    ],
    drippyQuote: '準備好了嗎奧利佛？讓這個大塊頭清醒過來吧！',
    choices: [
      {
        text: '【迎戰森林守衛】展開戰鬥！',
        actionId: 'trigger_guardian_battle',
        leadToNodeId: 'after_guardian_battle',
        effect: {
          triggerBattle: 'forest_guardian',
        }
      }
    ]
  },

  after_guardian_battle: {
    id: 'after_guardian_battle',
    chapter: '第三章：巨木長老的祝福與新啟程',
    location: '深幽之森 · 聖泉巨木',
    narrative: [
      '狂暴的守衛身上黑氣消散，翠綠的善良光芒在胸膛重新亮起。',
      '巨木長老緩緩睜開慈祥的雙眼，整座森林的花朵同時盛開！',
      '「純潔的心靈救世主啊……謝謝你拯救了森之守護者。這本《魔法大典》的遺失書頁，交予汝等。」',
      '你接過古老書頁，大典中解鎖了更多強大的精靈魔法與使魔煉化配方！',
      '前方的森林大道豁然開朗，直通宏偉繁榮的【叮咚戴爾城】！'
    ],
    drippyQuote: '小子，幹得漂亮！貓妖精的國度就在眼前，聽說那裡的貓國王陛下最近也變得怪怪的，我們快去瞧瞧！',
    choices: [
      {
        text: '翻閱剛解鎖的《魔法大典》，檢視新的魔法與使魔。',
        actionId: 'open_grimoire',
        leadToNodeId: 'dingdongdell_arrival',
        effect: {
          gainItem: '魔法大典：解鎖火球術與治癒秘文',
        }
      },
      {
        text: '馬不停蹄啟程，前往貓之國度【叮咚戴爾城】！',
        actionId: 'goto_dingdongdell',
        leadToNodeId: 'dingdongdell_arrival',
        effect: {
          gainHeart: 'enthusiasm',
        }
      }
    ]
  },

  dingdongdell_arrival: {
    id: 'dingdongdell_arrival',
    chapter: '第四章：貓妖精的王國——叮咚戴爾城',
    location: '叮咚戴爾城 · 噴水廣場',
    narrative: [
      '穿過高聳的白色城門，石板路上到處是長著貓耳與貓尾巴的親切市民！',
      '烤魚攤位香氣四溢，水道中的游魚活蹦亂跳，宛如一幅童話繪卷。',
      '然而，王宮門口的侍衛卻愁眉苦臉地嘆氣：',
      '「偉大的貓王尼亞達路十四世陛下……突然對任何事情都提不起勁，整天躺在王座上發呆，連最愛的小魚乾都不碰了！」',
      '小滴拍了拍腦門：「果然！國王陛下也是被奪走了【熱情之心（Enthusiasm）】的心之殘缺者！」'
    ],
    drippyQuote: '小子！我們要去尋找擁有滿滿熱情的人，向他借取熱情碎片，然後去王宮治癒國王陛下！',
    choices: [
      {
        text: '前往城鎮的工匠街，尋找整天揮汗打造神兵的熱血鐵匠大叔！',
        actionId: 'find_blacksmith',
        leadToNodeId: 'blacksmith_quest',
      },
      {
        text: '在王國競技場中挑戰更多使魔對手，強化小咪俠的戰力！',
        actionId: 'arena_training',
        leadToNodeId: 'arena_node',
      }
    ]
  },

  blacksmith_quest: {
    id: 'blacksmith_quest',
    chapter: '第四章：滿溢的熱情之心',
    location: '叮咚戴爾城 · 蒸氣鐵匠鋪',
    narrative: [
      '鐵匠鋪裡傳來鏗鏘有力的打鐵聲，火花四濺！',
      '熱血沸騰的貓人鐵匠大叔揮舞著巨錘：「哈哈哈！為了打造出二之國最強的勇者之劍，老夫就算三天三夜不睡覺也充滿幹勁啦！」',
      '小滴小聲對你說：「看見沒！這大叔胸口燃燒的玫瑰色光芒，熱情都快滿出來溢出整個鋪子啦！」',
      '奧利佛輕念【借取心靈（Take Heart）】咒語，溫暖的赤紅光球自鐵匠胸口分出一小縷，飛入了心靈之瓶！',
      '✨ 成功獲得了【熱情的心靈碎片（Enthusiasm）】！'
    ],
    drippyQuote: '好耶！這下我們就能去王宮，把這份熱情注入貓國王體內，解開他的心靈枷鎖了！',
    choices: [
      {
        text: '前往叮咚戴爾王宮，拯救貓國王尼亞達路！',
        actionId: 'heal_king',
        leadToNodeId: 'king_healed_node',
        effect: {
          gainItem: '王室通行證與賢者之杖',
        }
      }
    ]
  },

  king_healed_node: {
    id: 'king_healed_node',
    chapter: '終曲：奇蹟之光與無盡的旅途',
    location: '叮咚戴爾王宮 · 貓之王座',
    narrative: [
      '在王宮大殿，奧利佛高高舉起心靈之瓶，念動【給予心靈（Give Heart）】之咒！',
      '璀璨的熱情紅芒射入貓國王胸膛，國王陛下一躍而起，鬍鬚抖動，雙眼神采奕奕！',
      '「喵哈哈哈哈！本王感覺全身充滿了力量！來人啊！賞賜這位年輕的魔法師奧利佛最高榮譽！」',
      '國王賜予你象徵純潔魔法師的披風與王室徽記，並指引了前往艾莉西亞賢者神殿的方向。',
      '窗外，微風吹拂著二之國的無垠大地。你知道，尋找母親靈魂的旅程才剛剛展開，但你的身邊已有最可靠的小滴與忠誠使魔夥伴！'
    ],
    drippyQuote: '小子，做得好啊！這才只是偉大冒險的起點呢，繼續邁進吧，二之國的純潔救世主！',
    choices: [
      {
        text: '【重溫冒險】返回序章微風鎮，嘗試不同的選擇與自由對話！',
        actionId: 'restart_story',
        leadToNodeId: 'prologue_start',
      },
      {
        text: '【前往使魔戰鬥模式】在戰鬥競技場挑戰強大的遠古巨獸！',
        actionId: 'switch_to_battle',
        leadToNodeId: 'arena_node',
      }
    ]
  },

  arena_node: {
    id: 'arena_node',
    chapter: '番外：叮咚戴爾競技場',
    location: '叮咚戴爾 · 幻獸鬥技場',
    narrative: [
      '競技場中人聲鼎沸，來自各地的馴魔師與古代魔獸在此切磋技藝！',
      '在這裡，你可以隨時切換使魔出戰、嘗試火球術與冰霜法術、收集掉落的奇蹟光珠！'
    ],
    drippyQuote: '想要磨練戰鬥技巧嗎小子？儘管放馬過來吧！',
    choices: [
      {
        text: '返回故事章節',
        actionId: 'back_to_story',
        leadToNodeId: 'dingdongdell_arrival',
      }
    ]
  }
};
