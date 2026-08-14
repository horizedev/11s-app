import type { Locale } from "@/lib/i18n/types";

export type ConversationSkillKind = "small-talk" | "one-on-one";

type SkillCopy = {
  title: string;
  description: string;
  practice: string;
};

export type ConversationSkill = {
  id: string;
  en: SkillCopy;
  "zh-TW": SkillCopy;
};

export const SMALL_TALK_SKILLS: ConversationSkill[] = [
  {
    id: "share-ask-thread",
    en: {
      title: "Share, ask, then thread",
      description:
        "Offer one small real observation, ask an open question, then follow the noun they give you.",
      practice:
        "“I tried a new coffee place this weekend. What has made your routine better lately?”",
    },
    "zh-TW": {
      title: "先分享，再提問，再順著聊",
      description:
        "先說一點真實的小近況，問一個開放問題，再順著對方提到的名詞往下聊。",
      practice:
        "「我週末試了一間新咖啡店。你最近有什麼讓日常變得更好的小事嗎？」",
    },
  },
  {
    id: "specific-curiosity",
    en: {
      title: "Trade “How are you?” for one detail",
      description:
        "A precise invitation feels easier to answer and gives the conversation somewhere to go.",
      practice:
        "“What has taken up more of your attention than you expected this week?”",
    },
    "zh-TW": {
      title: "用一個細節取代「最近好嗎？」",
      description:
        "具體的邀請更容易回答，也能讓對話自然有方向。",
      practice: "「這週有什麼事比你原本預期更占心力？」",
    },
  },
  {
    id: "two-door-question",
    en: {
      title: "Open two comfortable doors",
      description:
        "Offer two light directions so the other person can choose the one that feels easiest.",
      practice:
        "“Has something at work been interesting lately, or has life outside work been more fun?”",
    },
    "zh-TW": {
      title: "留兩扇舒服的門",
      description:
        "給兩個輕鬆的方向，讓對方自己選擇想先聊哪一邊。",
      practice: "「你最近是工作上有什麼新鮮事，還是工作外有更好玩的近況？」",
    },
  },
  {
    id: "recent-surprise",
    en: {
      title: "Ask for a recent surprise",
      description:
        "Surprises invite a story without asking someone to summarize their whole life.",
      practice: "“What surprised you recently—in a good way or a strange way?”",
    },
    "zh-TW": {
      title: "問一個最近的意外",
      description:
        "意外容易帶出故事，不會要求對方把整段人生濃縮成一句近況。",
      practice: "「最近有什麼讓你意外的事？好的或奇怪的都可以。」",
    },
  },
  {
    id: "recommendation-swap",
    en: {
      title: "Swap one recommendation",
      description:
        "Recommendations reveal taste and energy while keeping the stakes low.",
      practice: "“What is one thing you have enjoyed enough lately to recommend?”",
    },
    "zh-TW": {
      title: "交換一個推薦",
      description:
        "推薦能看見一個人的品味和能量，又不會讓話題太有壓力。",
      practice: "「最近有沒有一件你喜歡到想推薦給別人的東西？」",
    },
  },
  {
    id: "energy-not-busyness",
    en: {
      title: "Ask about energy, not busyness",
      description:
        "Energy questions tend to produce a more human answer than another question about being busy.",
      practice: "“What has been giving you energy lately?”",
    },
    "zh-TW": {
      title: "問能量，不問忙不忙",
      description:
        "比起再問一次忙不忙，能量問題通常能帶出更有人味的回答。",
      practice: "「最近有什麼事讓你充電？」",
    },
  },
  {
    id: "micro-story-bridge",
    en: {
      title: "Use a micro-story as a bridge",
      description:
        "A two-sentence story gives the other person something concrete to respond to.",
      practice:
        "“I got lost on a walk yesterday and found a great bookstore. Have you stumbled onto anything good lately?”",
    },
    "zh-TW": {
      title: "用一個微型故事搭橋",
      description:
        "兩句話的小故事給對方一個具體、好接的回應點。",
      practice:
        "「我昨天散步迷路，結果發現一間很棒的書店。你最近有沒有意外遇到什麼好事？」",
    },
  },
  {
    id: "follow-their-noun",
    en: {
      title: "Follow their nouns",
      description:
        "When they name a person, project, place, or hobby, use it as the next thread instead of changing topics.",
      practice:
        "They mention a class: “What made you choose that one?”",
    },
    "zh-TW": {
      title: "順著對方提到的名詞聊",
      description:
        "對方提到人、專案、地方或興趣時，用它當下一條主線，而不是立刻換話題。",
      practice: "對方提到一門課時，可以問：「是什麼讓你選這門課？」",
    },
  },
  {
    id: "ask-for-a-take",
    en: {
      title: "Invite a take, not expertise",
      description:
        "Ask for a perspective rather than a definitive answer so the exchange stays relaxed.",
      practice: "“I keep hearing about this. What is your take on it?”",
    },
    "zh-TW": {
      title: "邀請觀點，不考專業",
      description:
        "問對方怎麼看，而不是要求標準答案，氣氛會更放鬆。",
      practice: "「我最近一直聽到這個話題。你怎麼看？」",
    },
  },
  {
    id: "future-spark",
    en: {
      title: "Find a small future spark",
      description:
        "Near-future anticipation is easy to answer and often opens a joyful thread.",
      practice: "“Is there anything small you are quietly looking forward to?”",
    },
    "zh-TW": {
      title: "找一個近期的小期待",
      description:
        "不遠的期待很好回答，也常能開出一條輕鬆、有喜感的主線。",
      practice: "「接下來有沒有一件你默默期待的小事？」",
    },
  },
  {
    id: "notice-the-setting",
    en: {
      title: "Notice the setting together",
      description:
        "A shared place, event, or moment gives you a natural first topic with no research required.",
      practice: "“This place has such a different pace today. Is this your kind of setting?”",
    },
    "zh-TW": {
      title: "從眼前的場景開始",
      description:
        "共同的地點、活動或時刻，是不需要準備就能自然開啟的話題。",
      practice: "「今天這裡的節奏很不一樣。這是你喜歡的場景嗎？」",
    },
  },
  {
    id: "learning-hook",
    en: {
      title: "Ask about learning in progress",
      description:
        "People often enjoy naming something they are figuring out before it becomes polished.",
      practice: "“Have you been learning anything that is more interesting than you expected?”",
    },
    "zh-TW": {
      title: "聊聊正在學的事",
      description:
        "很多人喜歡聊還在摸索、還沒變成熟練成果的東西。",
      practice: "「你最近有沒有在學什麼，比原本想像中更有趣？」",
    },
  },
  {
    id: "compare-notes",
    en: {
      title: "Compare notes, do not perform",
      description:
        "Share one small experience first so your question feels like an exchange rather than an interview.",
      practice:
        "“I have been trying to protect my evenings better. Do you have a ritual that helps you switch off?”",
    },
    "zh-TW": {
      title: "交換近況，不要像面試",
      description:
        "先分享一點自己的經驗，提問就會更像交流，而不是訪問。",
      practice:
        "「我最近在練習保留晚上的時間。你有沒有什麼儀式，能幫自己切換下班模式？」",
    },
  },
  {
    id: "gentle-choice",
    en: {
      title: "Offer an easy choice",
      description:
        "A choice lowers the effort of starting and can lead into a fuller story.",
      practice: "“Would you rather talk about something you are enjoying or something you are figuring out?”",
    },
    "zh-TW": {
      title: "給一個好選的選項",
      description:
        "選項能降低開場的負擔，也常會帶出更完整的故事。",
      practice: "「你比較想聊最近享受的事，還是正在摸索的事？」",
    },
  },
  {
    id: "shared-tempo",
    en: {
      title: "Match the tempo before depth",
      description:
        "Start light when the moment is light; earn the deeper question after you sense their pace.",
      practice:
        "Begin with “How has your week been feeling?” before moving to a more specific thread.",
    },
    "zh-TW": {
      title: "先對齊節奏，再往深處聊",
      description:
        "當下輕鬆就先輕鬆；感受到對方的節奏後，再慢慢問更深的問題。",
      practice: "先問「這週過得是什麼感覺？」再接到更具體的主線。",
    },
  },
  {
    id: "headline-to-human",
    en: {
      title: "Turn a headline into a human question",
      description:
        "Use news as a light bridge to perspective, never as a test of whether someone kept up.",
      practice:
        "“I saw that story about the new technology. Has anything in that space changed how you think?”",
    },
    "zh-TW": {
      title: "把新聞轉成關於人的問題",
      description:
        "把新聞當成觀點交流的輕橋，不要拿來考對方有沒有跟上。",
      practice:
        "「我看到那則關於新科技的消息。那個領域最近有沒有改變你的一些想法？」",
    },
  },
  {
    id: "one-good-follow-up",
    en: {
      title: "Ask one good follow-up",
      description:
        "The best signal of interest is usually one attentive follow-up, not five new questions.",
      practice: "“What part of that mattered most to you?”",
    },
    "zh-TW": {
      title: "只要一個好的追問",
      description:
        "真正有興趣的訊號，通常是一個仔細的追問，不是連續丟出五個新問題。",
      practice: "「那件事裡，對你最重要的是哪一部分？」",
    },
  },
  {
    id: "soft-landing",
    en: {
      title: "Give the topic a soft landing",
      description:
        "A warm close lets a good exchange end without abruptly abandoning the person or topic.",
      practice:
        "“I am glad you told me that. I will be curious to hear how it develops.”",
    },
    "zh-TW": {
      title: "替話題留一個柔軟收尾",
      description:
        "溫暖的收尾，讓一段好交流不會突然把人和話題丟在半空中。",
      practice: "「謝謝你跟我說這個。我會很想知道後來怎麼發展。」",
    },
  },
  {
    id: "weekend-window",
    en: {
      title: "Open the weekend window",
      description:
        "The recent or upcoming weekend is easy to answer and usually hides a story.",
      practice:
        "“Did anything good happen this weekend—or are you still recovering from it?”",
    },
    "zh-TW": {
      title: "打開週末這扇窗",
      description:
        "剛過去或即將到來的週末很好回答，裡面也常藏著故事。",
      practice: "「這個週末有沒有發生什麼好事——還是還在恢復中？」",
    },
  },
  {
    id: "taste-question",
    en: {
      title: "Ask for a taste, not a list",
      description:
        "One favorite is easier to name than a full ranking, and taste questions reveal personality.",
      practice:
        "“What is one restaurant you would happily go back to this week?”",
    },
    "zh-TW": {
      title: "問一個最愛，而不是清單",
      description:
        "說出一個最愛比排出名次容易，品味問題也容易看見個性。",
      practice: "「有哪一間餐廳，是你這週會想再回去的？」",
    },
  },
  {
    id: "seasonal-shift",
    en: {
      title: "Notice the season changing",
      description:
        "Weather and seasonal shifts are shared ground everyone is experiencing together.",
      practice:
        "“This weather turned fast. Do you like this time of year, or are you counting down to the next season?”",
    },
    "zh-TW": {
      title: "聊聊季節的變化",
      description:
        "天氣和季節的轉換，是大家都正在經歷的共同話題。",
      practice: "「天氣說變就變。你喜歡這個季節，還是已經在倒數下一個了？」",
    },
  },
  {
    id: "small-win",
    en: {
      title: "Celebrate a small win",
      description:
        "Small wins are easy to share and often carry more emotion than big achievements.",
      practice: "“What is a small win from this week that made you smile?”",
    },
    "zh-TW": {
      title: "慶祝一個小勝利",
      description:
        "小小的勝利很好分享，往往比大成就更有溫度。",
      practice: "「這週有沒有一個讓你嘴角上揚的小勝利？」",
    },
  },
  {
    id: "media-diet",
    en: {
      title: "Swap media diets",
      description:
        "What someone watches, reads, or listens to reveals what currently holds their attention.",
      practice:
        "“What have you been watching or listening to that you did not expect to enjoy?”",
    },
    "zh-TW": {
      title: "交換最近在追的內容",
      description:
        "一個人在看什麼、聽什麼，最能看出他現在被什麼吸引。",
      practice: "「你最近有沒有在追什麼意外好看的劇或 podcast？」",
    },
  },
  {
    id: "return-to-thread",
    en: {
      title: "Reopen an old thread",
      description:
        "Remembering what they mentioned before shows you listened—and gives instant material.",
      practice:
        "“Last time you mentioned a big trip coming up. How is the planning going?”",
    },
    "zh-TW": {
      title: "重開一條舊主線",
      description:
        "記得對方上次提過的事，表示你有在聽，也直接有話題可聊。",
      practice: "「上次你說要出一趟遠門——計劃進行得怎麼樣了？」",
    },
  },
  {
    id: "compliment-question",
    en: {
      title: "Pair a compliment with a question",
      description:
        "A genuine, specific compliment plus a curious question warms the exchange instantly.",
      practice:
        "“That was a sharp way to explain it. How did you come to see it that way?”",
    },
    "zh-TW": {
      title: "稱讚加上一個問題",
      description:
        "真誠又具體的稱讚，配上好奇的提問，能立刻讓氣氛暖起來。",
      practice: "「你剛剛那個說法很精準。你怎麼會這樣想？」",
    },
  },
  {
    id: "light-hypothetical",
    en: {
      title: "Try a light hypothetical",
      description:
        "Low-stakes imagination questions are playful and reveal preferences without prying.",
      practice:
        "“If you could teleport anywhere for dinner tonight, where would you go?”",
    },
    "zh-TW": {
      title: "來一個輕鬆的假設題",
      description:
        "不帶壓力的想像題很好玩，也能看見偏好而不探人隱私。",
      practice: "「如果今晚可以瞬移到任何地方吃晚餐，你會去哪？」",
    },
  },
  {
    id: "skill-curiosity",
    en: {
      title: "Ask about a skill they have",
      description:
        "People light up when asked how they got good at something visible.",
      practice:
        "“You are so organized. Was that always true, or did you build the habit?”",
    },
    "zh-TW": {
      title: "好奇對方的拿手本事",
      description:
        "被問到「你怎麼練出來的」，多數人眼睛都會亮起來。",
      practice: "「你做事好有條理。是天生如此，還是後來練出來的？」",
    },
  },
  {
    id: "shared-observation",
    en: {
      title: "Make a small shared observation",
      description:
        "A gentle remark about the moment you are both in creates instant common ground.",
      practice: "“This line is moving faster than I expected. Do you come here often?”",
    },
    "zh-TW": {
      title: "說一個共同的現場觀察",
      description:
        "對彼此正在經歷的現場說一句輕巧的觀察，馬上就有共同點。",
      practice: "「這隊伍前進得比我想像中快。你常來這裡嗎？」",
    },
  },
  {
    id: "week-ahead",
    en: {
      title: "Look one week ahead",
      description:
        "Near-future plans are concrete, easy to answer, and often open the next thread.",
      practice:
        "“Anything on the calendar next week that you are actually excited about?”",
    },
    "zh-TW": {
      title: "看看下週的行事曆",
      description:
        "近期的計畫具體、好回答，也常能延伸出下一條話題。",
      practice: "「下週行事曆上，有沒有什麼你真心期待的事？」",
    },
  },
  {
    id: "food-memory",
    en: {
      title: "Ask for a food memory",
      description:
        "Food memories are sensory and warm, and almost everyone has one ready.",
      practice: "“What is a dish that instantly reminds you of home?”",
    },
    "zh-TW": {
      title: "問一個食物記憶",
      description:
        "食物的記憶有味道、有溫度，幾乎人人都有一道現成的答案。",
      practice: "「有沒有哪一道菜，一吃就讓你想起家？」",
    },
  },
  {
    id: "weekday-ritual",
    en: {
      title: "Ask about a daily ritual",
      description:
        "Rituals reveal how someone takes care of themselves without getting too personal.",
      practice: "“Do you have a morning ritual you actually look forward to?”",
    },
    "zh-TW": {
      title: "聊聊日常的小儀式",
      description:
        "儀式感能看見一個人怎麼照顧自己，又不會太私密。",
      practice: "「你有沒有什麼早晨儀式，是真心期待的？」",
    },
  },
  {
    id: "change-of-pace",
    en: {
      title: "Ask about the pace of life",
      description:
        "Contrasts between busy and slow seasons give people room to be honest.",
      practice: "“Has this season felt fast or slow for you?”",
    },
    "zh-TW": {
      title: "聊聊生活的節奏",
      description:
        "快與慢的對比，給對方空間說出真實的近況。",
      practice: "「最近這陣子對你來說，是快還是慢？」",
    },
  },
  {
    id: "gratitude-snapshot",
    en: {
      title: "Ask for a gratitude snapshot",
      description:
        "A light gratitude question lifts the mood without feeling forced.",
      practice: "“What is one thing this week that you are quietly grateful for?”",
    },
    "zh-TW": {
      title: "問一個小小的感謝",
      description:
        "輕巧的感謝題能提亮氣氛，又不會顯得刻意。",
      practice: "「這週有沒有一件讓你默默感謝的小事？」",
    },
  },
];

export const ONE_ON_ONE_SKILLS: ConversationSkill[] = [
  {
    id: "shared-purpose",
    en: {
      title: "Start with a shared purpose",
      description:
        "Name what would make the conversation useful for both of you before discussing the details.",
      practice:
        "“By the end of this, I hope we are clear on what would help most. Does that sound right?”",
    },
    "zh-TW": {
      title: "先說清楚共同目的",
      description:
        "進入細節前，先說出這次對話對雙方最有用的結果。",
      practice:
        "「我希望聊完後，我們能更清楚什麼最有幫助。這樣的方向對你合適嗎？」",
    },
  },
  {
    id: "open-reflect-explore",
    en: {
      title: "Open, reflect, then explore",
      description:
        "Use an open question, reflect one important part of the answer, then ask one layer deeper.",
      practice:
        "“What feels most important right now?” Then: “It sounds like clarity matters. What would create it?”",
    },
    "zh-TW": {
      title: "開放提問、回應重點、再探索",
      description:
        "先問開放問題，回應答案裡一個重要部分，再往下一層探索。",
      practice:
        "先問「現在最重要的是什麼？」再說：「聽起來你很需要清楚的方向。什麼會幫你得到它？」",
    },
  },
  {
    id: "newest-follow-up",
    en: {
      title: "Begin with the newest open loop",
      description:
        "The most recent promise or follow-up is usually the strongest bridge into continuity.",
      practice: "“Last time we agreed you would try ___. What changed after that?”",
    },
    "zh-TW": {
      title: "先接住最新的待跟進事項",
      description:
        "最近一次的承諾或跟進，通常是延續感最強的開場橋樑。",
      practice: "「上次我們說你會試試 __。後來有什麼變化？」",
    },
  },
  {
    id: "observation-not-assumption",
    en: {
      title: "Offer an observation, not an assumption",
      description:
        "Describe what you noticed and invite correction instead of assigning a motive or feeling.",
      practice:
        "“I noticed the timeline changed twice. How has that been landing for you?”",
    },
    "zh-TW": {
      title: "說觀察，不替對方下結論",
      description:
        "描述你看見的事，邀請對方修正，而不是替他推測動機或感受。",
      practice: "「我注意到時程改了兩次。這件事對你來說感覺怎麼樣？」",
    },
  },
  {
    id: "one-level-deeper",
    en: {
      title: "Go only one level deeper",
      description:
        "A single thoughtful follow-up often creates more trust than immediately solving the problem.",
      practice: "“What makes that part especially difficult?”",
    },
    "zh-TW": {
      title: "每次只往下一層",
      description:
        "一個有心的追問，通常比立刻替對方解題更能建立信任。",
      practice: "「那一部分為什麼特別不容易？」",
    },
  },
  {
    id: "one-win-one-tension-one-ask",
    en: {
      title: "Use one win, one tension, one ask",
      description:
        "A compact agenda balances progress, reality, and the help needed without turning the 1:1 into a report.",
      practice:
        "“I want to share one win, one tension, and one place where your perspective would help.”",
    },
    "zh-TW": {
      title: "一個成果、一個張力、一個請求",
      description:
        "精簡的結構兼顧進度、現況和需要的支持，又不會讓一對一變成報告。",
      practice:
        "「我想分享一個成果、一個正在拉扯的地方，和一個希望聽你看法的問題。」",
    },
  },
  {
    id: "permission-before-feedback",
    en: {
      title: "Ask permission before feedback",
      description:
        "A quick consent check makes feedback easier to receive and keeps the conversation collaborative.",
      practice: "“Would it be useful if I shared one observation?”",
    },
    "zh-TW": {
      title: "回饋前先徵詢同意",
      description:
        "簡短確認對方是否想聽，能讓回饋更容易被接住，也更像合作。",
      practice: "「如果我分享一個觀察，現在對你有幫助嗎？」",
    },
  },
  {
    id: "name-the-impact",
    en: {
      title: "Name the impact, not just the action",
      description:
        "Specific impact helps a person understand why a behavior or contribution mattered.",
      practice:
        "“When you brought the tradeoff forward early, the team could decide with much more confidence.”",
    },
    "zh-TW": {
      title: "說出影響，不只描述行為",
      description:
        "具體的影響能讓對方知道，為什麼某個行動或貢獻真的重要。",
      practice:
        "「你很早就把取捨提出來，團隊才能更有把握地做決定。」",
    },
  },
  {
    id: "future-back",
    en: {
      title: "Work backward from a useful future",
      description:
        "Picture a better next month or quarter, then ask what needs to happen now.",
      practice:
        "“If this felt meaningfully better in six weeks, what would be different?”",
    },
    "zh-TW": {
      title: "從想要的未來倒推",
      description:
        "先想像下個月或下個季度更好的樣子，再問現在需要做什麼。",
      practice: "「如果六週後這件事明顯變好了，會有哪些不同？」",
    },
  },
  {
    id: "invite-ownership",
    en: {
      title: "Invite ownership before advice",
      description:
        "Ask what they want to try before offering your own solution.",
      practice: "“What direction feels most like yours to try first?”",
    },
    "zh-TW": {
      title: "建議前，先邀請主動性",
      description:
        "在提出自己的解法前，先問對方想嘗試什麼。",
      practice: "「哪個方向最像是你想先試試看的？」",
    },
  },
  {
    id: "temperature-check",
    en: {
      title: "Take the temperature",
      description:
        "When a topic becomes charged, pause to learn how the conversation is landing.",
      practice: "“Can we pause for a second—how is this landing for you?”",
    },
    "zh-TW": {
      title: "確認此刻的溫度",
      description:
        "話題開始變緊時，先停一下，理解這段對話對對方的感受。",
      practice: "「我們先停一下——這段對話現在對你來說感覺怎麼樣？」",
    },
  },
  {
    id: "summary-check",
    en: {
      title: "Summarize to test understanding",
      description:
        "A short summary gives the other person an easy chance to correct or refine the shared picture.",
      practice:
        "“Let me check I have this right: the priority is ___, and the blocker is ___?”",
    },
    "zh-TW": {
      title: "用摘要確認彼此理解",
      description:
        "簡短摘要讓對方很容易修正或補充你們共同理解的畫面。",
      practice: "「我確認一下我有沒有理解對：優先的是 __，卡住的是 __，對嗎？」",
    },
  },
  {
    id: "name-the-tradeoff",
    en: {
      title: "Make the tradeoff visible",
      description:
        "Naming competing goods moves the conversation beyond a false choice of right versus wrong.",
      practice:
        "“It sounds like we are balancing speed with confidence. Which matters more here?”",
    },
    "zh-TW": {
      title: "把取捨攤開來看",
      description:
        "說出彼此拉扯的好處，能讓對話跳脫非對即錯的假選擇。",
      practice: "「聽起來我們在速度和把握之間取捨。這次哪一邊更重要？」",
    },
  },
  {
    id: "constructive-silence",
    en: {
      title: "Let a useful silence happen",
      description:
        "After a meaningful question, wait long enough for the person to think rather than rescuing the pause.",
      practice:
        "Ask the question, count to five internally, and keep a calm, attentive posture.",
    },
    "zh-TW": {
      title: "讓有用的停頓發生",
      description:
        "問完重要問題後，留足夠時間讓對方思考，不要急著把空白填滿。",
      practice: "問完後在心裡數五秒，保持平靜、專心的姿態。",
    },
  },
  {
    id: "separate-person-from-problem",
    en: {
      title: "Put the problem on the table",
      description:
        "Frame a hard topic as something both people can examine together, not as a flaw in either person.",
      practice: "“How can we make this handoff work better for both of us?”",
    },
    "zh-TW": {
      title: "把問題放到桌上，而不是放在人身上",
      description:
        "把難題框成雙方能一起檢視的事，不要變成某一個人的缺點。",
      practice: "「我們可以怎麼讓這次交接對彼此都更順？」",
    },
  },
  {
    id: "support-preference",
    en: {
      title: "Ask how support should look",
      description:
        "The right support is not always advice; ask whether they need a sounding board, help, or a decision.",
      practice:
        "“Would it help most to think this through together, remove a blocker, or make a call?”",
    },
    "zh-TW": {
      title: "問清楚需要哪一種支持",
      description:
        "好的支持不一定是給建議；先問對方需要一起想、排除阻礙，還是協助做決定。",
      practice: "「你現在最需要的是一起想想、排除阻礙，還是幫忙做一個決定？」",
    },
  },
  {
    id: "close-commitments",
    en: {
      title: "Close with visible commitments",
      description:
        "End by naming who will do what and when, so care turns into follow-through.",
      practice:
        "“I will send the draft by Thursday, and you will let me know which option feels strongest.”",
    },
    "zh-TW": {
      title: "用看得見的承諾收尾",
      description:
        "結尾說清楚誰會做什麼、何時做，讓關心真的變成後續行動。",
      practice: "「我星期四前會送出草稿；你再告訴我哪個選項最有感。」",
    },
  },
  {
    id: "bridge-next-time",
    en: {
      title: "Leave a bridge for next time",
      description:
        "Capture the thread you want to revisit so the next 1:1 starts with continuity instead of recall.",
      practice:
        "“Let us come back to how that experiment felt after your next review.”",
    },
    "zh-TW": {
      title: "替下一次留一座橋",
      description:
        "留下想再回來談的主線，讓下一次一對一從延續開始，不用重新回想。",
      practice: "「你下次檢討後，我們再回來聊聊那個實驗感覺怎麼樣。」",
    },
  },
  {
    id: "align-expectations",
    en: {
      title: "Align on expectations early",
      description:
        "Naming what good looks like prevents quiet disappointment on both sides.",
      practice: "“What would a great outcome from this project look like to you?”",
    },
    "zh-TW": {
      title: "提早對齊期待",
      description:
        "先把「好」的樣子說清楚，能避免雙方默默失望。",
      practice: "「這個專案做到什麼樣子，你會覺得很棒？」",
    },
  },
  {
    id: "energy-check",
    en: {
      title: "Check energy before agenda",
      description:
        "A quick read on energy and workload shapes how the whole conversation should go.",
      practice: "“Before we dive in—how are your energy levels this week?”",
    },
    "zh-TW": {
      title: "先看能量，再談議題",
      description:
        "先讀一下對方的能量與負荷，整場對話的方向會更準。",
      practice: "「開始之前——你這週的能量狀態怎麼樣？」",
    },
  },
  {
    id: "ask-specific-feedback",
    en: {
      title: "Ask for one specific feedback",
      description:
        "A narrow question earns usable feedback instead of a polite generality.",
      practice:
        "“What is one thing I could do differently that would make your work easier?”",
    },
    "zh-TW": {
      title: "要一個具體的回饋",
      description:
        "範圍小的問題，才能換來用得上的回饋，而不是客套的稱讚。",
      practice: "「有沒有一件事，是我換個做法就能讓你工作更順的？」",
    },
  },
  {
    id: "clarify-decision",
    en: {
      title: "Clarify who decides",
      description:
        "Many tensions dissolve the moment decision rights become explicit.",
      practice:
        "“For this call, do you want to decide, or would you like a recommendation from me?”",
    },
    "zh-TW": {
      title: "說清楚誰來決定",
      description:
        "很多張力，在決定權說清楚的那一刻就消散了。",
      practice: "「這個決定，你想自己拍板，還是希望我先給個建議？」",
    },
  },
  {
    id: "growth-edge",
    en: {
      title: "Name a growth edge",
      description:
        "Putting one growth edge on the table invites support instead of vague encouragement.",
      practice:
        "“The skill I am working on is ___. Where have you seen me get closer?”",
    },
    "zh-TW": {
      title: "說出一個成長邊界",
      description:
        "把一個想突破的點放上桌，換來的是實質支持，而不是模糊的鼓勵。",
      practice: "「我最近在練的是 __。你有看到我哪裡更接近了嗎？」",
    },
  },
  {
    id: "specific-appreciation",
    en: {
      title: "Offer specific appreciation",
      description:
        "Concrete appreciation lands deeper than a general thank-you.",
      practice: "“The way you handled that escalation saved us a week. I noticed.”",
    },
    "zh-TW": {
      title: "給出具體的感謝",
      description:
        "具體的感謝，比一句籠統的「辛苦了」更有份量。",
      practice: "「你上次處理那個突發狀況，幫我們省了一週。我有看見。」",
    },
  },
  {
    id: "confirm-priorities",
    en: {
      title: "Confirm the priority stack",
      description:
        "A thirty-second priority check prevents weeks of quiet misalignment.",
      practice: "“My top three are ___, ___, ___. Does that match your picture?”",
    },
    "zh-TW": {
      title: "確認優先順序",
      description:
        "三十秒的優先順序確認，能省掉好幾週的默默錯位。",
      practice: "「我手上的前三名是 __、__、__。跟你想的一樣嗎？」",
    },
  },
  {
    id: "remove-obstacle",
    en: {
      title: "Ask what to remove",
      description:
        "Asking what to take away often helps more than asking what to add.",
      practice: "“What is one thing I could take off your plate this month?”",
    },
    "zh-TW": {
      title: "問該拿走什麼",
      description:
        "問「能拿走什麼」，往往比問「要加什麼」更有幫助。",
      practice: "「這個月有沒有一件事，是我可以幫你從桌上拿走的？」",
    },
  },
  {
    id: "career-horizon",
    en: {
      title: "Look one horizon further",
      description:
        "Occasionally zooming out keeps weekly work connected to a larger direction.",
      practice: "“When you picture two years from now, what do you want to be true?”",
    },
    "zh-TW": {
      title: "往更遠的地平線看",
      description:
        "偶爾拉遠視角，能讓每週的工作和更大的方向連起來。",
      practice: "「想像兩年後的你，希望什麼事情已經成真？」",
    },
  },
  {
    id: "repair-moment",
    en: {
      title: "Repair a rough moment",
      description:
        "Naming a rough interaction briefly and warmly restores trust faster than ignoring it.",
      practice: "“I did not love how I handled that moment. Can we reset?”",
    },
    "zh-TW": {
      title: "修補一個粗糙的時刻",
      description:
        "簡短而溫暖地點出一次不順的互動，比假裝沒事更能重建信任。",
      practice: "「我不太滿意自己當時的處理方式。我們可以重新來過嗎？」",
    },
  },
  {
    id: "share-context-up",
    en: {
      title: "Share context generously",
      description:
        "People make better judgments when they understand the why behind your ask.",
      practice: "“Here is the context behind my question—does that change your read?”",
    },
    "zh-TW": {
      title: "大方分享脈絡",
      description:
        "理解提問背後的原因，對方才給得出更好的判斷。",
      practice: "「先跟你說我為什麼這樣問——這會改變你的判斷嗎？」",
    },
  },
  {
    id: "listen-longer",
    en: {
      title: "Listen one beat longer",
      description:
        "Staying quiet a moment after they finish often reveals the real point.",
      practice:
        "After they finish, wait. Often the most important sentence comes next.",
    },
    "zh-TW": {
      title: "多聽一拍",
      description:
        "對方說完後多留一拍，真正的重點常在這時出現。",
      practice: "對方說完後，先別接話。最重要的一句，往往才正要出現。",
    },
  },
  {
    id: "one-thing-today",
    en: {
      title: "Find the one thing",
      description:
        "If everything matters, nothing does—help surface the single most useful topic.",
      practice: "“If we only solved one thing today, which one would help you most?”",
    },
    "zh-TW": {
      title: "找出那一件事",
      description:
        "樣樣都重要，就等於都不重要——幫彼此挑出最有用的那一題。",
      practice: "「如果今天只能解決一件事，哪一件對你幫助最大？」",
    },
  },
  {
    id: "check-assumption",
    en: {
      title: "Check one assumption",
      description:
        "Testing a single assumption out loud prevents building plans on a guess.",
      practice: "“I have been assuming ___. Is that actually right?”",
    },
    "zh-TW": {
      title: "驗證一個假設",
      description:
        "把一個假設說出來驗證，能避免整個計畫建在猜測上。",
      practice: "「我一直以為 __。真的是這樣嗎？」",
    },
  },
  {
    id: "end-with-gratitude",
    en: {
      title: "End with one honest thank-you",
      description:
        "A specific thank-you closes the loop and makes the next 1:1 easier to start.",
      practice: "“Thanks for being direct about ___. That helped more than you know.”",
    },
    "zh-TW": {
      title: "用一句真誠的感謝收尾",
      description:
        "具體的感謝能收好這次循環，也讓下一次一對一更好開口。",
      practice: "「謝謝你對 __ 這麼坦白。那對我的幫助比你想像的大。」",
    },
  },
];

export function getConversationSkills(kind: ConversationSkillKind) {
  return kind === "small-talk" ? SMALL_TALK_SKILLS : ONE_ON_ONE_SKILLS;
}

export function getSkillCopy(skill: ConversationSkill, locale: Locale) {
  return skill[locale];
}
