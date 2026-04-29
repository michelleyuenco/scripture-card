// Real demo content for Aug 7 + Aug 8 from the reference image.
// Other dates fall back to a graceful "demo content coming" state but still
// render the full page layout so the design reads correctly.

const DEVOTIONALS = {
  "08-07": {
    dateLabel: "八月七日",
    dateEn: "August 7",
    title: "祝福那反對你的人",
    verseRef: "使徒行傳 2:44–45",
    verseTrans: "新譯本",
    verse: "所有信的人都在一起，凡物公用，並且變賣產業和財物，按照各人的需要分給他們。",
    body: [
      "沒有人像早期教會信徒那樣慷慨。這些早期的基督徒不只是獻上他們的金錢，更非常慷慨地獻出他們的所有。",
      "如果我們同樣慷慨，我們的教會會怎麼樣？聖經說我們是管家，或者是經理，要管理上帝給我們的一切。我們有責任在運用我們的資源和時間，去建立上帝的國度。",
      "上帝給你資源不只是為了你自己的享樂，而是要改變這個世界。上帝的祝福不是讓你藏起來。祂祝福你是為了讓你去祝福他人。當你給予別人，你是在騰出空間讓上帝賜予你更多。",
      "這是一個充滿盼望和鼓勵人心的真理，我們要時時記住。畢竟，我們不是只有在感恩節或聖誕節時才要慷慨。你要建立你教會裏的信徒、你社區裏的人、與及上帝特意放在你生命中的人。",
    ],
    reflection: "你今天可以祝福生命中的哪些人？",
  },
  "08-08": {
    dateLabel: "八月八日",
    dateEn: "August 8",
    title: "當你等候時，上帝正在作工",
    verseRef: "詩篇 5:3",
    verseTrans: "新普及譯本",
    verse: "上主啊，清晨求你聆聽我的聲音；我每天清晨向你懇求，並滿懷期望地等候。",
    body: [
      "當你祈求上帝的幫助，你會滿心期待地等候。",
      "你所祈求的上帝，是一個信守祂應許的上帝。祂是一個良善的天父，永遠會供應你所需要的。當你滿心期待地等候，你藉着相信上帝會實現祂的應許而展現了你的信心。",
      "期待不等同應份。應份是說：「我會從上帝那裏得到我的所需，因為我配得，是我賺回來的。這個星期我讀了五遍聖經、去了教會兩次，所以上帝需要提供我的所需。」期待是說：「上帝會供應我的所需，因為祂正正是這樣的上帝。」",
      "滿心期待地等候並不簡單，尤其是當你覺得無力的時候。當你相信在你的婚姻、事業或人際關係或就不可能的事、卻感覺祂的時機太慢，就很難繼續信靠祂。",
      "不要氣餒，不要放棄！即使你不知道為什麼上帝還沒有回應你的禱告，你也可以信靠祂會時守祂的應許。上帝永遠掌權，祂永遠不會錯到算錯。沒有人比祂更有力量。你最大的問題在祂看來都是小問題。",
      "當你等待的時候，上帝正在作工。祂在建立你的信心，教導你關於祂的真理，使你更親近祂，塑造你更像基督。上帝比你更知道你需要學習什麼。",
      "遵循大衛的例子——一直向上帝祈求，並滿心期待地等候祂的回應。",
    ],
    reflection: "今天有什麼是你正在等候上帝的？你願意以期待而不是要求的心去信靠祂嗎？",
  },
};

// Generic placeholder for any date the user picks that we don't have content for.
// Still uses the full layout — just signals it's a preview build.
function getDevotional(month, day) {
  const key = `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  if (DEVOTIONALS[key]) return DEVOTIONALS[key];

  const monthNames = ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"];
  const enMonths = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const cnDay = (n) => {
    const ch = ["零","一","二","三","四","五","六","七","八","九","十"];
    if (n <= 10) return ch[n];
    if (n < 20) return "十" + ch[n - 10];
    if (n === 20) return "二十";
    if (n < 30) return "二十" + ch[n - 20];
    if (n === 30) return "三十";
    return "三十" + ch[n - 30];
  };

  return {
    dateLabel: `${monthNames[month - 1]}${cnDay(day)}日`,
    dateEn: `${enMonths[month - 1]} ${day}`,
    title: "為這一日感恩",
    verseRef: "詩篇 118:24",
    verseTrans: "新譯本",
    verse: "這是耶和華所定的日子，我們要在這一日歡喜快樂。",
    body: [
      "（此為示範頁面 — 完整 365 日內容將於正式版本載入。）",
      "每一日都是上帝精心預備的禮物。在你的生日這天，祂特別將這段話留給你——不是因為你做了什麼，而是因為祂愛你。",
      "今天，把這一日交還給祂。讓祂引導你的腳步，讓祂的話語成為你心中的指南。",
      "你不需要走得很快，只需要走得正確。一日有一日的恩典，一日有一日的話語。",
    ],
    reflection: "這一日，你想對上帝說什麼？",
    isPlaceholder: true,
  };
}

window.DEVOTIONALS = DEVOTIONALS;
window.getDevotional = getDevotional;
