// Run all code only after HTML content is loaded
document.addEventListener("DOMContentLoaded", () => {

  /* -------------------------------------------
     DEVELOPMENT ONLY: Manual task generation
     ------------------------------------------- */
  document.getElementById("generateTasksBtn").addEventListener("click", () => {
    generateDailyTasksIfNeeded();
    generateWeeklyTasksIfNeeded();
    resetWeeklyTasksIfNeeded();
    location.reload();
  });

  /* -------------------------------------------
     Grab references to HTML elements
     ------------------------------------------- */
  const taskInput = document.getElementById("taskInput");
  const taskTypeSelect = document.getElementById("taskType");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const dailyTaskList = document.getElementById("daily-tasks");
  const weeklyTaskList = document.getElementById("weekly-tasks");
  const dailyHistoryList = document.getElementById("daily-history");
  const weeklyHistoryList = document.getElementById("weekly-history");
  const backupBtn = document.getElementById("backupBtn");
  const restoreBtn = document.getElementById("restoreBtn");
  const restoreInput = document.getElementById("restoreInput");
  const toggleCompletedCheckbox = document.getElementById("toggle-completed");

  /* -------------------------------------------
     DAILY OUTREACH MESSAGES HARDCODED FOR LEARNING
     ------------------------------------------- */
  const dailyOutreachMessages = {
    "2025-08-09": [
      "Howie — Hi friend, thinking of you today. Grateful for you in our lives.",
      "Rich, Cait, Dana, Mike, Devin, CJ — Hi Hillsman fam! Just sending warm love from Denver — hope life with little ones is bringing joy (and some sleep too!). Would love to hear how you all are doing whenever you have a moment!",
      "Roman Fam — Hi all — just wanted to send some summer love across the miles. Hope you’re staying cool and finding time to recharge. ☀️💛"
    ],
    "2025-08-10": [
      "Danielle — Sundays with you feel like home.",
      "Rachel & Bryn — Hope the weekend’s been kind. Miss you two!"
    ],
    "2025-08-11": [
      "Tenaya — Where’s your soul roaming this month? You always inspire me.",
      "Peter & Rich — Hi Peter & Rich! Just wanted to send you both a warm hello from Denver. You’re often on our minds — hope life is treating you well and that the Michigan getaway has been peaceful!",
      "Erin — Hey Erin — sending a calm check‑in. Hope clinic hours aren’t too wild and you’re feeling supported this week. 🌿",
      "Lori — Hi Lori — hope your Monday is off to a good start. Thinking of you and sending calm energy your way today. 💛"
    ],
    "2025-08-12": [
      "Shawn — It’s been a while! Hope your world is feeling steady and good.",
      "Josh — Hey bro — any interest in a late‑summer concert or quick evening fish? 🎵🎣",
      "Tara — Hi Tara— hope you’re having a good week so far. Always thinking of you, Aaron, Wyatt and Monroe — hope everyone is soaking in the summer. 🌞"
    ],
    "2025-08-13": [
      "Danielle — Your strength keeps me grounded. Just wanted to say that.",
      "Jim — Hi Jim — hope your week’s going alright so far. Just thinking of you and wanted to say a quick hello. ☀️"
    ],
    "2025-08-14": [
      "Justin — Time for another game night? Let’s pick a day soon.",
      "Kelsea — Just wanted to check in. Thinking of our SAS memories lately.",
      "Mara — Hey Mara — hope the lead‑up to fall semester at UCCS is feeling smooth. Anything fun on your radar? 🎓✨",
      "Kat — Hey Kat — I was thinking of you and wondering how your work and the practice are coming along. You’ve always had such a vision — I hope it’s feeling aligned right now.",
      "Tyler — Hey man — hope all’s well out there. Sending some love from our crew this week. 👋"
    ],
    "2025-08-15": [
      "Gaven — Want to grab a coffee soon? I miss our convos.",
      "Carly & Ethan — Hi friends — hope August is full of small joys and peaceful moments.",
      "Russell & Anthony — Hey you two! Just thinking back to that sunny golf day with you and smiling. Hope all is well — sending love from our crew to yours.",
      "Aaron — Hi Aaron— no pressure to reply, just wanted to say we’re thinking of you. Always hope you’re doing well. ✌️"
    ],
    "2025-08-16": [
      "Danielle — Watching you parent our kids is one of my greatest joys.",
      "Lyn — Sending you some Denver sunshine and a hello!",
      "Nadia — Hey Nadia— hope things are going well. Always enjoy hearing what you’re up to and appreciate the calm energy you bring. 💫"
    ],
    "2025-08-17": [
      "Rhonda — Thinking of you, sis. Just checking in and sending love.",
      "Steve & Fam — Hi Hillsman fam! Just sending a warm Denver hello. We’re thinking of you all and hope life is going smoothly. Would love to catch up sometime or hear how things are going!"
    ],
    "2025-08-18": [
      "Danielle — Starting the week knowing you’re by my side makes everything feel lighter.",
      "Danielle’s Family Group Text — Sending love from all of us in Denver. Hope everyone is finding some joy this month.",
      "Lori — Morning — hope your week is beginning with something simple and peaceful. We’re doing well over here and wanted to send a little hello. 🌿"
    ],
    "2025-08-19": [
      "Mike — Been a while since we caught up — want to reconnect this month?",
      "Miya — Hi Miya — thinking of you as the school year ramps up at Kent Denver. Hope it’s a gentle start. 🍎📚",
      "Tara — Hey — how’s everything going this week? Thinking of you and the girls and sending good vibes your way. 💛"
    ],
    "2025-08-20": [
      "Amanda — Hey old friend! Just sending a warm hello your way.",
      "Jim — Hey Jim — hope the week’s treating you well. We’ve had you on our minds and wanted to send a little check-in. 🌿"
    ],
    "2025-08-21": [
      "Josh & Lauren — How’s parent life treating you lately? You’re doing an amazing job.",
      "Tyler — Hope you’re doing well — summer flying by, huh? Miss seeing you. Hope things feel good down your way. 🌞"
    ],
    "2025-08-22": [
      "Danielle — I hope you know how much your love changes my world.",
      "Matt Arvidson — Open to a quick catch‑up soon? Would love to hear how Asher, Selah, and Asa are doing. 🌲",
      "Aaron — Hope your week’s winding down well. Just a quick note from me — sending some calm and positive vibes. 🌾"
    ],
    "2025-08-23": [
      "RJ — What’s been the most fun thing about being 7 this summer?",
      "Nadia — Sending some kind thoughts your way today. Hope you and Tyler are having a good weekend. 🌸"
    ],
    "2025-08-24": [
      "Howie — Sending you strength and love for the week ahead. We’re thinking of you.",
      "Danielle — You bring light to every part of my life.",
      "Rob B — Hey Rob! How’s Italy wedding prep feeling these days? Cheering you two on from Denver. 🇮🇹💍"
    ],
    "2025-08-25": [
      "Rachel & Bryn — Hope this week brings ease and a few good laughs.",
      "Gaven — Want to plan a hang in September? Let me know what’s good for you.",
      "Lori — Hi Lori — just a quick check-in. Hope you’re getting moments of joy and rest this week. 💐"
    ],
    "2025-08-26": [
      "Carly & Ethan — Hope you’re both doing great. Want to do something soon?",
      "Danielle — I love being your partner, your teammate, your person.",
      "Ben, Justin and RJ — Hope everyone’s doing well! Any interest in a game night soon? Doesn’t have to be Gloomhaven — I’d settle for rolling dice and eating chips together.",
      "Robb — Was thinking of you when I saw some dirt bikes near Denver 🏍️😆. How’s life in CB this month?",
      "Tara — Hi Tara — just a little note to say we’re thinking of your crew this week. Hope everyone’s hanging in. 😊"
    ],
    "2025-08-27": [
      "Carmen & Petee — Hi friends! Just checking in and sending some love from Denver.",
      "Jim — Good morning — hope you’ve had some peaceful moments this week. Just wanted to let you know we’re thinking of you. 💛"
    ],
    "2025-08-28": [
      "Dan & Megan — No expectations, just wanted to say I’m thinking of you both.",
      "Al — If you had a free weekend tomorrow, what would your perfect day look like?",
      "Jacob Herold — Heard a brass line today that made me think of you. Hoping to make your gig at Dazzle on Oct 9th coming up? 🎺🎶",
      "Tyler — Hey — just a check-in. Thinking of you and Nadia and hoping you’re getting some good, calm days. 💛"
    ],
    "2025-08-29": [
      "Joseph & Rachel — Sending you care and hope as this new IVF chapter unfolds.",
      "Josh — Hope work’s treating you alright. Want to pencil a fall golf morning soon? ⛳️",
      "Aaron — Thinking of you and your family today. Hope it’s a peaceful one. 👋"
    ],
    "2025-08-30": [
      "Danielle’s Family Group Text — Hi everyone! Love and hugs from our crew in Denver.",
      "Nadia — Hi there — just a little note to say you’re on our mind this week. Hope it’s been a good one. 💛"
    ],
    "2025-08-31": [
      "Danielle — You’re my home. Grateful for every day with you.",
      "Stace — How’s the end of summer feeling for you? Miss you!"
    ],
    "2025-09-01": [
      "Danielle — Labor Day = lounging with you and loving it.",
      "Danielle’s Family Text Chain — Sending hugs from Denver this Labor Day weekend! Hope everyone’s soaking up some rest.",
      "Lori — Wishing you a good start to your week. No agenda, just wanted to say hi and let you know we’re thinking of you. 💛"
    ],
    "2025-09-02": [
      "Danielle — Back-to-school vibes got me reflecting — I’d choose to learn life with you every time.",
      "Howie — Thinking of you this new season. Sending steady strength.",
      "Tara — Hey — sending a quick check-in and some love from our family to yours. Hope this week’s been a smooth one. 🌼"
    ],
    "2025-09-03": [
      "Danielle — You’ve already made my fall feel full. Just wanted you to know.",
      "Josh & Lauren — How’s the shift into September treating you three? Thinking of you!",
      "Matt Arvidson — Hey Matt! Any late-summer camping trips with the kids? Always miss those Montana vibes. 🏕️",
      "Jim — Hey Jim— sending a midweek hello your way. Hope you’ve had time for something enjoyable this week. 😊"
    ],
    "2025-09-04": [
      "Ben — Want to do something together with the boys this month? Would love to reconnect.",
      "Rachel & Bryn — Miss seeing you two! Let’s pick a date to hang soon.",
      "Tyler — Quick hello from us — hope you’re both doing alright. Sending some good energy your way as summer winds down. 🌿"
    ],
    "2025-09-05": [
      "Danielle — Fall Fridays feel better with you in my arms.",
      "Vince — How’s life your way lately? Any new adventures in the air?",
      "Rhonda — Hi sis! Just checking in and hoping life’s feeling okay on your end. No pressure to respond — just saying hey. 😊",
      "Weberg Family Contingent — Hi Weberg fam — hope everyone’s well and enjoying the last bit of summer. Thinking of you all! ☀️💛",
      "Aaron — Just wanted to say hey. Hope your week had a few good moments in it. 💛"
    ],
    "2025-09-06": [
      "Gaven — Want to grab coffee or lunch this weekend or next? Always good seeing you.",
      "RJ — How’s school kicking off? I need your cool weather snack recommendation.",
      "Al — Hey man, sending you some solid big-brother appreciation today. Thanks for always being you.",
      "Nadia — Hey — hope the weekend brings a little rest and something joyful. Appreciate all you bring to this family. 😊"
    ],
    "2025-09-07": [
      "Danielle — Sundays are made for slow moments and soft love. You bring both."
    ],
    "2025-09-08": [
      "Mom — Love you, Mom. Let’s talk this week.",
      "Heather — Hope fall is treating you gently so far."
    ],
    "2025-09-09": [
      "Danielle — Grateful for you in every season — but something about autumn suits us best.",
      "Carly & Ethan — Let’s get the kids together sometime soon! Fall’s too fun to miss.",
      "Robb — Hey man, any fun fall hikes or rides in CB yet? 🍂 Would love to get out there soon."
    ],
    "2025-09-10": [
      "Stace — You crossed my mind today. Sending love — let’s catch up this weekend."
    ],
    "2025-09-11": [
      "Danielle — Thank you for being my soft place to land, especially on hard days."
    ],
    "2025-09-12": [
      "Justin — Game night crew is due! What weekend works for you?",
      "Joseph — Thinking of you and Rachel. Sending quiet hope your way today.",
      "Erin — Hi Erin — just checking in as the seasons change. Hope work isn’t too crazy and you’re getting some time to breathe. 🌿"
    ],
    "2025-09-13": [
      "Danielle — You’re the warmth in this cooling season.",
      "Yaqub — Let’s do a deep dive sometime soon — what’s been stirring your heart lately?",
      "Josh — Hey bro — any concerts or games you’re eyeing this fall? Would be fun to link up. 🎵🏈"
    ],
    "2025-09-14": [
      "Danielle — Wanna go for a long walk today? I miss your voice even when we’re side by side.",
      "Lyn — I saw something that reminded me of one of our old jokes — made me laugh and think of you. Hope all’s good your way. 😊",
      "Matt Arvidson — Matt! Happy birthday 🎂 Any good fishing spots hitting this fall? Dreams of how I could use a river day come up often. 🎣"
    ],
    "2025-09-15": [
      "Amanda — Been a long while — would love to hear what life’s looking like lately.",
      "Mike — Sending a little reconnection energy your way — you good for a fall catch-up?"
    ],
    "2025-09-16": [
      "Danielle — Your steadiness is my peace. Thank you.",
      "Danielle’s Family Text Chain — Sending early autumn love to all of you. Thinking of everyone.",
      "Mara — Hey Mara — hope classes are settling in at UCCS. Anything fun you’re looking forward to this semester? 🎓✨"
    ],
    "2025-09-17": [
      "Joseph & Rachel — Thinking of you both. You are strong and surrounded by so much love.",
      "Ruthann — Just checking in to see how things are in your world. Hope the work, the clients, and the balance are all flowing well."
    ],
    "2025-09-18": [
      "Danielle — Can we sneak away for a date this weekend? Just us, no rush.",
      "Roman Fam — Thinking of everyone today and feeling grateful for this thread. Hope you’re all easing into fall in good health and spirits. 🍂🍁",
      "Rob B — How’s wedding prep going? You two must be juggling a lot — rooting for you! 🇮🇹💍"
    ],
    "2025-09-19": [
      "Nick — Let’s catch up this month! Miss hearing how you’re doing.",
      "Howie — Checking in, my friend. Hope this week’s been gentle."
    ],
    "2025-09-20": [
      "Danielle — You + fall colors = perfect pairing.",
      "Kelsea — Been thinking about SAS memories — hope your fall’s off to a good start."
    ],
    "2025-09-21": [
      "Danielle — Can I make you breakfast today? You deserve slow love."
    ],
    "2025-09-22": [
      "Danielle — First day of fall. Let’s fall in love all over again this season.",
      "Joseph & Rachel — Welcoming a new season and hoping it brings you fresh peace and light.",
      "Al — Got any music, shows, or podcasts in your rotation I should try out?",
      "Miya — Hi Miya — how’s the new school year groove at Kent Denver? Hoping it’s not too hectic. 🍎"
    ],
    "2025-09-23": [
      "Tenaya — What’s inspiring you these days? Fall always makes me think of your creative spirit.",
      "Ben, Justin and RJ — Miss you guys. The silence from our game table has been deafening. Let's change that this month?"
    ],
    "2025-09-24": [
      "Danielle — Thank you for being my person — even in the busy moments.",
      "Jacob Herold — Hey Jacob — been listening to some live jazz lately. Got any gigs coming up? 🎺🎶"
    ],
    "2025-09-25": [
      "Carmen & Petee — Thinking of you both — would love to connect soon!"
    ],
    "2025-09-26": [
      "Danielle — You’re my favorite part of every day — even when I don’t say it."
    ],
    "2025-09-27": [
      "Danielle — Let’s do something spontaneous today. Just us.",
      "Dan & Megan — Thinking of your family this season — hope you’re all well."
    ],
    "2025-09-28": [
      "Danielle — Sundays with you feel like the definition of peace.",
      "Robb — Had to ask…how’s the snow outlook shaping up for ski season? 🎿❄️ You always know before anyone else."
    ],
    "2025-09-29": [
      "Jordan — You’ve been on my mind. Let’s stay in touch even as seasons change.",
      "Mark — Thinking about our work time together — grateful for what we built."
    ],
    "2025-09-30": [
      "Danielle — Last day of the month, and all I want is more of us in the next one.",
      "Josh — Hope September’s closing on a good note for you. Want to pencil in a ski day this winter? ⛷️"
    ],
    "2025-10-01": [
      "Danielle — New month, new air, same love that grounds me.",
      "Joseph & Rachel — Thinking of you both — may this new month bring some peace and softness."
    ],
    "2025-10-02": [
      "Vince — Hey friend, got any fall plans or cozy traditions this year?",
      "Danielle’s Family Text Chain — Sending Denver love your way — may this season bring more kindness and calm."
    ],
    "2025-10-03": [
      "Danielle — Even the chill in the air can’t compete with the warmth of you."
    ],
    "2025-10-04": [
      "RJ — Fall is here! What’s the coolest part of the season so far?",
      "Howie — Hope today brings ease and comfort. Thinking of you, always."
    ],
    "2025-10-05": [
      "Mom — Love you always. Let’s talk soon.",
      "Danielle — Sundays are best spent loving you."
    ],
    "2025-10-06": [
      "Ben — Been thinking of you, cousin. Want to catch up soon? Maybe a walk or coffee?",
      "Rachel & Bryn — Hey you two! Let’s do something soon before the season flies by."
    ],
    "2025-10-07": [
      "Carly & Ethan — You crossed my mind today — hope the family’s enjoying fall."
    ],
    "2025-10-08": [
      "Danielle — Halfway through the week and still falling for you."
    ],
    "2025-10-09": [
      "Stace — Hi sister. What’s something good this month brought you so far?",
      "Josh & Lauren — You two hanging in? Parenthood looks good on you.",
      "Al — Been a while since I’ve seen your face. Send a selfie or a shot of something that made you laugh?"
    ],
    "2025-10-10": [
      "Danielle — Let’s do something spontaneous this weekend — just us."
    ],
    "2025-10-11": [
      "Joseph — Checking in on you both. Sending warmth your way.",
      "Ben, Justin and RJ — Spooky season feels like the perfect excuse for monsters, chaos, and friendship. Want to pick a night to play again?"
    ],
    "2025-10-12": [
      "Danielle — Another Sunday to remind you how deeply I love being your partner.",
      "Roman Fam — Happy October, everyone! 🎃 Sending some cozy energy your way — and curious what’s bringing you joy this month?"
    ],
    "2025-10-13": [
      "Shawn — How’s the season treating you? Let’s reconnect if you’re around.",
      "Amanda — Hey! Would love to hear what life looks like these days."
    ],
    "2025-10-14": [
      "Justin — We overdue for a catch-up. Let’s hang soon.",
      "Danielle’s Family Text Chain — Sending some fall family energy from Denver! Miss you all."
    ],
    "2025-10-15": [
      "Danielle — In every season, I choose you."
    ],
    "2025-10-16": [
      "Dan & Megan — Just a small check-in to say I’m thinking of you both. No expectations."
    ],
    "2025-10-17": [
      "Danielle — Let’s wrap the week in gratitude — and maybe some wine."
    ],
    "2025-10-18": [
      "Gaven — You around next week for a beer or walk?",
      "Mike — Thinking of grad school days — let’s catch up this fall if you’re free."
    ],
    "2025-10-19": [
      "Danielle — Sundays were made for resting next to you."
    ],
    "2025-10-20": [
      "Joseph & Rachel — Still with you in hope and care. How’s this week starting off?",
      "Tenaya — What’s something magical you’ve seen or felt lately? Miss your spirit."
    ],
    "2025-10-21": [
      "Heather — Just checking in. Hope fall is being good to you."
    ],
    "2025-10-22": [
      "Danielle — Still amazed at how you love so generously."
    ],
    "2025-10-23": [
      "Carmen & Petee — Hey friends — wanted to send a quick hello and see how fall’s been for you.",
      "Rhonda — Hey Rhonda — fall always makes me nostalgic. Hope you’re well and catching some moments of peace. 🍂"
    ],
    "2025-10-24": [
      "Danielle — What’s something we can do together that would feel joyful this weekend?",
      "Lyn — Hey sis! 🍂 Hope you’re doing okay as the season shifts. Sending you a little love from Denver."
    ],
    "2025-10-25": [
      "RJ — Have you jumped into a pile of leaves yet? You’d be the king of fall fun."
    ],
    "2025-10-26": [
      "Danielle — Thanks for loving me even on the messy days. You’re my greatest calm.",
      "Al — What’s one thing you’re really into right now? Hobby, idea, random YouTube rabbit hole?"
    ],
    "2025-10-27": [
      "Barb — Thinking of you this season — your wisdom always sticks with me.",
      "Yaqub — You’ve been solid, brother. What’s a value you’re holding tight lately?"
    ],
    "2025-10-28": [
      "Nick — You and the fam crossed my mind today. Let’s catch up sometime this fall."
    ],
    "2025-10-29": [
      "Danielle — Let’s make some memories this Halloween weekend. Just us and the little monsters."
    ],
    "2025-10-30": [
      "Danielle’s Family Text Chain — Sending Halloween hugs from Denver — hope you’re all finding time to laugh and connect.",
      "Joseph & Rachel — Holding you in my heart as this month wraps up. You two are so strong."
    ],
    "2025-10-31": [
      "Danielle — Happy Halloween, love. You’re the treat I never stop being grateful for.",
      "Howie — Happy Halloween, my friend. You’re always in our hearts today and every day."
    ],
    "2025-11-01": [
      "Danielle — New month. New gratitude. Same deep love for you.",
      "RJ — What’s your Halloween candy ranking this year?"
    ],
    "2025-11-02": [
      "Danielle — Thank you for always making home feel safe and full.",
      "Mom — Love you, Mom. Let’s plan a call this week."
    ],
    "2025-11-03": [
      "Joseph & Rachel — Sending warmth and grace as the holidays approach. You’re not alone.",
      "Heather — You’ve been on my heart lately. Hope November brings a bit of peace."
    ],
    "2025-11-04": [
      "Carly & Ethan — Let’s plan a cozy get-together sometime this month. Miss you two."
    ],
    "2025-11-05": [
      "Danielle — Grateful today, especially, that I get to do life with you.",
      "Danielle’s Family Text Chain — Love from Denver! May this season bring more connection and calm."
    ],
    "2025-11-06": [
      "Barb — Wishing you peace and light as the year winds down. You’re always appreciated."
    ],
    "2025-11-07": [
      "Danielle — What can I take off your plate this weekend? I want you to rest.",
      "Al — You were on my mind today. Anything on your heart or in your world that you wanna share?"
    ],
    "2025-11-08": [
      "Howie — Thinking of you, friend. Sending warmth as the days get colder."
    ],
    "2025-11-09": [
      "Danielle — Sundays with you are my sanctuary.",
      "Lyn — Hi Lyn — I’m grateful for you this month. Hope you’re feeling peace and comfort as we head toward the holidays. 🍁💛"
    ],
    "2025-11-10": [
      "Tenaya — What’s filling your spirit lately? Let’s catch up soon.",
      "Peter & Rich — Hey you two ❤️ I’ve been thinking about how much I appreciated living with Peter after college — truly such a grounding and loving time in my life. Sending a big thank-you and lots of love your way."
    ],
    "2025-11-11": [
      "Stace — Love you, sis. What are you grateful for this season?",
      "Josh & Lauren — Sending a warm November hug to your growing fam."
    ],
    "2025-11-12": [
      "Danielle — You still take my breath away — every single day."
    ],
    "2025-11-13": [
      "Justin — Ready for another game night? Let’s pick a date.",
      "Rachel & Bryn — How’s your fall been? Miss your energy."
    ],
    "2025-11-14": [
      "Danielle — Let’s plan a slow night soon. Just you, me, and nothing urgent.",
      "Ruthann — Thinking of you and your private practice journey — would love to hear any wins or growing edges lately!"
    ],
    "2025-11-15": [
      "Nick — Let’s find a moment to catch up before the holiday chaos kicks in."
    ],
    "2025-11-16": [
      "Danielle — You give our kids the kind of love that shapes their world. I see it every day."
    ],
    "2025-11-17": [
      "Joseph — You’ve been carrying a lot. Don’t forget to lean when you need to."
    ],
    "2025-11-18": [
      "Mike — Been a while. Want to connect before the end of the year?",
      "Vince — Thinking of our last real talk. Let’s keep that going."
    ],
    "2025-11-19": [
      "Danielle — Even on the hard days, I choose you over and over.",
      "Ben, Justin and RJ — Thankful for this group — even if we’ve been a little MIA. Let’s reconnect this month if we can."
    ],
    "2025-11-20": [
      "Carmen & Petee — Thinking of you both. Hope fall’s been kind.",
      "Russell & Anthony — Hope you're both doing great! Danielle and I were just saying we miss hanging with you. Game night sometime this season?"
    ],
    "2025-11-21": [
      "Danielle — I want to make this Thanksgiving extra meaningful with you. Let’s dream up something simple and special."
    ],
    "2025-11-22": [
      "RJ — Are you ready for pie season? You’re definitely a pumpkin pie guy, right?",
      "Rhonda — Grateful for you this season, even from afar. Hope you’re feeling supported and cared for. 🧡"
    ],
    "2025-11-23": [
      "Danielle — Slowing down with you today feels like exactly what I need.",
      "Roman Fam — Just wanted to say how thankful I am to be part of this family. Even across distance, your presence matters. 🧡 Hope everyone’s safe and well."
    ],
    "2025-11-24": [
      "Dan & Megan — Sending gentle thoughts. If you ever need space or a friend, I’m here.",
      "Al — What are you grateful for this season — serious or funny? I’ll go first if you want."
    ],
    "2025-11-25": [
      "Amanda — Grateful for the history we share. Just wanted to say that."
    ],
    "2025-11-26": [
      "Danielle — You’re what I’m most thankful for. Always."
    ],
    "2025-11-27": [
      "Family Text Chain — Happy Thanksgiving from us in Denver. So grateful to be part of this family.",
      "Danielle — You and the kids are the heart of everything I give thanks for."
    ],
    "2025-11-28": [
      "Howie — Hope yesterday brought some joy your way. Thinking of you warmly."
    ],
    "2025-11-29": [
      "Danielle — Let’s get outside and breathe in this season together."
    ],
    "2025-11-30": [
      "Danielle — Another month of loving you. I’ll never stop being grateful for that."
    ],
    "2025-12-01": [
      "Danielle — December’s here — and all I want is more time wrapped up with you.",
      "Joseph & Rachel — Sending strength and care as the year closes. You’re held in so much love."
    ],
    "2025-12-02": [
      "RJ — What’s at the top of your winter wish list?",
      "Howie — Thinking of you today — your kindness shines especially bright this season."
    ],
    "2025-12-03": [
      "Danielle — Let’s start a new December tradition. Just us.",
      "Danielle’s Family Text Chain — Wishing everyone a December full of peace and playful moments from snowy Denver."
    ],
    "2025-12-04": [
      "Ben — Want to squeeze in some cousin time this month? Let’s find a cozy day."
    ],
    "2025-12-05": [
      "Danielle — You’re the calm at the center of this busy season. Thank you.",
      "Rachel & Bryn — Let’s plan something festive soon — miss you guys!",
      "Kat — Was just chatting about bluegrass and Telluride came up — thought of you right away. Maybe one year we’ll both make it back out there."
    ],
    "2025-12-06": [
      "Stace — Thinking of you this season. Want to do a sibling call soon?",
      "Vince — How’s the holiday season looking on your end? You doing okay?"
    ],
    "2025-12-07": [
      "Danielle — Coffee, cuddles, and calm — I vote for all three today.",
      "Carly & Ethan — Any fun holiday events you’re taking the kids to this year?"
    ],
    "2025-12-08": [
      "Heather — Wishing you a gentle start to the month. You’ve been in my thoughts."
    ],
    "2025-12-09": [
      "Justin — We need a holiday-themed game night. Let’s pick a date.",
      "Josh & Lauren — How’s baby’s first holiday season going? Sending love and extra naps."
    ],
    "2025-12-10": [
      "Danielle — You’re the greatest gift I’ve ever received.",
      "Mom — Love you, Mom. Let’s set a time to catch up this week."
    ],
    "2025-12-11": [
      "Joseph — Thinking of you both. Let me know how I can support.",
      "Barb — Grateful for the wisdom you’ve shared with me this year.",
      "Al — Happy December, Al. Got any weird family traditions or random memories from our childhood popping up?"
    ],
    "2025-12-12": [
      "Danielle — Let’s make space for stillness this weekend — just us."
    ],
    "2025-12-13": [
      "Dan & Megan — Hoping your holiday season is gentle and full of quiet joys.",
      "Rhonda — Sending you warmth and peace for the holidays. Thinking of you this time of year. 🎄✨"
    ],
    "2025-12-14": [
      "Danielle — Slow mornings with you are the best part of any month.",
      "Rich & Fam — Thinking of you all! Sending a big Denver hug from our family to yours. Hope parenting, life, and winter rhythms are going okay! Miss connecting with you."
    ],
    "2025-12-15": [
      "Tenaya — How’s the end of your year shaping up? You always inspire me to pause and reflect.",
      "Amanda — Would love to hear what’s bringing you peace this season."
    ],
    "2025-12-16": [
      "Mike — Holidays always remind me of old friends. Want to reconnect before the new year?",
      "Joseph & Rachel — Two weeks left in this year. Sending you hope and ease."
    ],
    "2025-12-17": [
      "Danielle — You’ve made this year magic in more ways than you know.",
      "Lyn — Wishing you a cozy, meaningful holiday season. Thinking of you and sending warmth. 🎄✨"
    ],
    "2025-12-18": [
      "Carmen & Petee — Wishing your family warmth, laughter, and quiet peace this season.",
      "Ben, Justin and RJ — Holiday wish: roll dice, slay baddies, and laugh too loud. Any chance we get a game in before the year ends?"
    ],
    "2025-12-19": [
      "Danielle — Let’s have a night in and watch something cozy. No stress, just us."
    ],
    "2025-12-20": [
      "Shawn — You’re someone I’m always grateful to have crossed paths with. Want to catch up?",
      "Nick — Hope your crew is gearing up for a fun holiday — let’s talk soon."
    ],
    "2025-12-21": [
      "Danielle — Winter solstice — longest night, but your love is the light I live in.",
      "Steve & Fam — Hope everything in the Chicago/Michigan Hillsman branch is going beautifully. You all have crossed our minds lately — sending hugs from all of us here."
    ],
    "2025-12-22": [
      "Gaven — Wanna meet up before the holidays? Would love to reconnect.",
      "Yaqub — Appreciate our convos, man. What’s something grounding you right now?"
    ],
    "2025-12-23": [
      "Danielle — Thank you for holding so much this year. I see it all. And I love you."
    ],
    "2025-12-24": [
      "Danielle — No gift compares to the life we’re building.",
      "Family Text Chain — Wishing you all a peaceful Christmas Eve from our hearts to yours."
    ],
    "2025-12-25": [
      "Danielle — Merry Christmas, my love. You’ve made every day feel like a miracle.",
      "Howie — Merry Christmas, my friend. Holding you close today."
    ],
    "2025-12-26": [
      "Danielle — Let’s keep the cozy glow going a little longer. You’re my favorite part of the holidays.",
      "Joseph & Rachel — Thinking of you both. May the love around you bring peace today."
    ],
    "2025-12-27": [
      "Danielle — You make winter warm.",
      "Lyn & Rhonda — Wishing you both a bright end to the year. Love from all of us.",
      "Roman Fam — Hope the holidays were gentle and meaningful for each of you. Sending warmth as we close out the year. 🎄❄️"
    ],
    "2025-12-28": [
      "Danielle — Sunday love, end-of-year reflection: you’re my best decision again and again.",
      "Al — Love you, bro. Let’s make 2026 a good one — want to find a weekend to catch up next year?"
    ],
    "2025-12-29": [
      "Jordan — Thinking of you and grateful for our time working together. Let’s keep in touch.",
      "Mark — Hope your holidays have been restful. I’d love to catch up sometime soon."
    ],
    "2025-12-30": [
      "Danielle — Let’s end this year by doing something meaningful — just you and me."
    ],
    "2025-12-31": [
      "Danielle — Thank you for growing with me this year. I can’t wait for what’s next.",
      "Danielle’s Family Text Chain — Happy New Year’s Eve! May 2026 bring more peace and joy for all of us."
    ],
};

  /* -------------------------------------------
     Date/Time Utilities — all in LOCAL time (MDT)
     ------------------------------------------- */
  function getTodayStr() {
    return new Date().toISOString().split("T")[0];
  }

  function isAfterFiveAM() {
    return new Date().getHours() >= 5;
  }

  function isNewDay() {
    const lastGenerated = localStorage.getItem("lastGeneratedDate");
    return (!lastGenerated || lastGenerated !== getTodayStr());
  }

  function isNewWeekMonday() {
    const now = new Date();
    const lastWeeklyReset = localStorage.getItem("lastWeeklyResetDate");
    const todayStr = getTodayStr();
    // Monday = 1 in getDay()
    return (!lastWeeklyReset || lastWeeklyReset !== todayStr) && now.getDay() === 1;
  }

  /* -------------------------------------------
     Outreach message cleanup — only after 5am
     ------------------------------------------- */
  (function deleteOldOutreachIfNeeded() {
    if (!isAfterFiveAM()) return; // only act after 5AM local
    const todayStr = getTodayStr();

    Object.keys(dailyOutreachMessages).forEach(date => {
      if (date < todayStr) delete dailyOutreachMessages[date];
    });

    const remainingDates = Object.keys(dailyOutreachMessages).filter(date => date >= todayStr);
    const lastAlert = localStorage.getItem("lastMessageAlertDate");

    if (remainingDates.length <= 10 && lastAlert !== todayStr) {
      alert(`⚠️ Only ${remainingDates.length} days of Daily Text Outreach messages left.\nPlease update soon.`);
      localStorage.setItem("lastMessageAlertDate", todayStr);
    }
  })();

  /* -------------------------------------------
     Default template tasks
     ------------------------------------------- */
  const DAILY_TASKS = ["Music", "Art", "Journaling", "Self-Compassion", "Exercise"];
  const WEEKLY_TASKS = ["Disc Golf", "Time with Dani", "Swim", "One Beer"];

  /* -------------------------------------------
     Initial load logic
     ------------------------------------------- */
  generateDailyTasksIfNeeded();
  generateWeeklyTasksIfNeeded();
  resetWeeklyTasksIfNeeded();
  loadTasksFromStorage();
  loadMotivationalQuote();
  updateProgressTracker();

  /* -------------------------------------------
     Show/hide completed tasks using .hidden class
     ------------------------------------------- */
  if (toggleCompletedCheckbox) {
    toggleCompletedCheckbox.addEventListener("change", () => {
      const showCompleted = toggleCompletedCheckbox.checked;
      document.querySelectorAll("li.completed").forEach(li => {
        li.classList.toggle("hidden", !showCompleted);
      });
    });
  }

  /* -------------------------------------------
     Add new custom task
     ------------------------------------------- */
  addTaskBtn.addEventListener("click", () => {
    const taskText = taskInput.value.trim();
    const taskType = taskTypeSelect.value;
    if (taskText === "") return;

    const newTask = { text: taskText, type: taskType, completed: false, completedAt: null };
    saveTaskToStorage(newTask);

    // Clear lists then reload from storage
    dailyTaskList.innerHTML = "";
    weeklyTaskList.innerHTML = "";
    loadTasksFromStorage();

    taskInput.value = "";
  });

  /* -------------------------------------------
     Backup & Restore
     ------------------------------------------- */
  backupBtn.addEventListener("click", () => {
    const tasks = localStorage.getItem("tasks");
    const blob = new Blob([tasks], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tasks-backup.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  restoreBtn.addEventListener("click", () => restoreInput.click());

  restoreInput.addEventListener("change", event => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const tasks = JSON.parse(e.target.result);
        if (Array.isArray(tasks)) {
          localStorage.setItem("tasks", JSON.stringify(tasks));
          location.reload();
        } else {
          alert("Invalid backup file.");
        }
      } catch {
        alert("Error reading backup file.");
      }
    };
    reader.readAsText(file);
  });

  /* -------------------------------------------
     DOM Builders
     ------------------------------------------- */
  function addTaskToDOM(taskObj) {
    const li = document.createElement("li");
    const wrapper = document.createElement("div");
    wrapper.classList.add("task-wrapper");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = taskObj.completed;

    const [titleLine, ...messageLines] = taskObj.text.split("<br>");
    const titleSpan = document.createElement("span");
    titleSpan.innerHTML = titleLine;
    titleSpan.classList.add("task-text");

    if (messageLines.length > 0) {
      const messageDiv = document.createElement("div");
      messageDiv.classList.add("outreach-message");
      messageDiv.innerHTML = messageLines.join("<br>");
      wrapper.appendChild(titleSpan);
      wrapper.appendChild(messageDiv);
    } else {
      wrapper.appendChild(titleSpan);
    }

    wrapper.insertBefore(checkbox, wrapper.firstChild);

    if (taskObj.text.startsWith("Daily Text Outreaches:")) {
      li.classList.add("highlight-outreach");
    }

    if (taskObj.type === "custom") {
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.classList.add("delete-btn");
      deleteBtn.addEventListener("click", () => {
        li.remove();
        removeTaskFromStorage(taskObj);
        updateProgressTracker();
        renderCompletedHistory();
      });

      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.classList.add("edit-btn");
      editBtn.addEventListener("click", () => startEditingTask(titleSpan, taskObj));

      wrapper.appendChild(editBtn);
      wrapper.appendChild(deleteBtn);
    }

    li.appendChild(wrapper);

    const timestamp = document.createElement("div");
    timestamp.classList.add("task-timestamp");

    function updateTaskStyle() {
      if (taskObj.completed) {
        li.classList.add("completed");
        if (taskObj.completedAt) {
          const dt = new Date(taskObj.completedAt);
          timestamp.textContent = `✅ Completed at ${dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
        }
      } else {
        li.classList.remove("completed");
        timestamp.textContent = "";
      }
      const showCompleted = toggleCompletedCheckbox?.checked;
      li.classList.toggle("hidden", taskObj.completed && !showCompleted);
    }

    updateTaskStyle();

    checkbox.addEventListener("change", () => {
      taskObj.completed = checkbox.checked;
      taskObj.completedAt = checkbox.checked ? new Date().toISOString() : null;
      updateTaskStyle();
      updateTaskInStorage(taskObj);
      updateProgressTracker();
      renderCompletedHistory();
    });

    li.appendChild(timestamp);

    if (taskObj.type === "daily") dailyTaskList.appendChild(li);
    else if (taskObj.type === "weekly") weeklyTaskList.appendChild(li);
  }

  /* -------------------------------------------
     Progress Tracker
     ------------------------------------------- */
  function updateProgressTracker() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const dailyTasks = tasks.filter(t => t.type === "daily");
    const weeklyTasks = tasks.filter(t => t.type === "weekly");

    const dailyCompleted = dailyTasks.filter(t => t.completed).length;
    const weeklyCompleted = weeklyTasks.filter(t => t.completed).length;

    const dailyTotal = dailyTasks.length;
    const weeklyTotal = weeklyTasks.length;

    document.getElementById("progress-tracker").textContent =
      `Daily: ${dailyCompleted}/${dailyTotal} | Weekly: ${weeklyCompleted}/${weeklyTotal}`;
    checkForDailyCompletionCelebration();
  }

  /* -------------------------------------------
     Storage Helpers
     ------------------------------------------- */
  function saveTaskToStorage(task) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function loadTasksFromStorage() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    // Sort: incomplete first, completed sorted by completion time
    tasks.sort((a, b) => {
      if (a.completed === b.completed) {
        if (!a.completed) return 0;
        return new Date(b.completedAt) - new Date(a.completedAt);
      }
      return a.completed ? 1 : -1;
    });
    tasks.forEach(addTaskToDOM);
    renderCompletedHistory();
  }

  function removeTaskFromStorage(taskToDelete) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const updated = tasks.filter(t => !(t.text === taskToDelete.text && t.type === taskToDelete.type));
    localStorage.setItem("tasks", JSON.stringify(updated));
  }

  function updateTaskInStorage(updatedTask) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const index = tasks.findIndex(t => t.text === updatedTask.text && t.type === updatedTask.type);
    if (index !== -1) {
      tasks[index] = updatedTask;
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }

  /* -------------------------------------------
     Generation / Reset Functions with 5AM MDT rule
     ------------------------------------------- */
  function resetWeeklyTasksIfNeeded() {
    if (isNewWeekMonday() && isAfterFiveAM()) {
      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      const updated = tasks.map(task => task.type === "weekly"
        ? { ...task, completed: false, completedAt: null }
        : task
      );
      localStorage.setItem("tasks", JSON.stringify(updated));
      localStorage.setItem("lastWeeklyResetDate", getTodayStr());
    }
  }

  function generateDailyTasksIfNeeded() {
    if (isNewDay() && isAfterFiveAM()) {
      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      DAILY_TASKS.forEach(taskText => {
        if (!tasks.some(t => t.text === taskText && t.type === "daily")) {
          tasks.push({ text: taskText, type: "daily", completed: false, completedAt: null });
        }
      });

      // Add outreach messages if present for today
      const messages = dailyOutreachMessages[getTodayStr()];
      if (messages?.length > 0) {
        tasks.push({
          text: "Daily Text Outreaches:<br>" + messages.map(msg => `• ${msg}`).join("<br>"),
          type: "daily",
          completed: false,
          completedAt: null
        });
      }

      localStorage.setItem("tasks", JSON.stringify(tasks));
      localStorage.setItem("lastGeneratedDate", getTodayStr());
    }
  }

  function generateWeeklyTasksIfNeeded() {
    if (isNewWeekMonday() && isAfterFiveAM()) {
      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      WEEKLY_TASKS.forEach(taskText => {
        if (!tasks.some(t => t.text === taskText && t.type === "weekly")) {
          tasks.push({ text: taskText, type: "weekly", completed: false, completedAt: null });
        }
      });
      localStorage.setItem("tasks", JSON.stringify(tasks));
      localStorage.setItem("lastWeeklyGeneratedDate", getTodayStr());
    }
  }

  /* -------------------------------------------
     History Rendering
     ------------------------------------------- */
  function renderCompletedHistory() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    dailyHistoryList.innerHTML = "";
    weeklyHistoryList.innerHTML = "";
    tasks.filter(t => t.type === "daily" && t.completed).forEach(task => {
      const li = document.createElement("li");
      li.textContent = `${task.text} (Completed at ${new Date(task.completedAt).toLocaleString()})`;
      dailyHistoryList.appendChild(li);
    });
    tasks.filter(t => t.type === "weekly" && t.completed).forEach(task => {
      const li = document.createElement("li");
      li.textContent = `${task.text} (Completed at ${new Date(task.completedAt).toLocaleString()})`;
      weeklyHistoryList.appendChild(li);
    });
  }

  /* -------------------------------------------
     Task Editing
     ------------------------------------------- */
  function startEditingTask(span, taskObj) {
    const originalText = span.textContent;
    const input = document.createElement("input");
    input.type = "text";
    input.value = originalText;
    input.classList.add("edit-input");

    span.replaceWith(input);
    input.focus();

    input.addEventListener("blur", finishEdit);
    input.addEventListener("keydown", e => { if (e.key === "Enter") finishEdit(); });

    function finishEdit() {
      const newText = input.value.trim();
      if (newText && newText !== taskObj.text) {
        taskObj.text = newText;
        updateTaskInStorage(taskObj);
      }
      span.textContent = taskObj.text;
      input.replaceWith(span);
    }
  }

  /* -------------------------------------------
     Celebration when all daily tasks complete
     ------------------------------------------- */
  function checkForDailyCompletionCelebration() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const dailyTasks = tasks.filter(t => t.type === "daily");
    const allCompleted = dailyTasks.length > 0 && dailyTasks.every(t => t.completed);
    const today = getTodayStr();
    if (allCompleted && localStorage.getItem("dailyCelebrationShown") !== today) {
      showCelebration();
      localStorage.setItem("dailyCelebrationShown", today);
    }
  }

  function showCelebration() {
    alert("🎉 Congrats! You completed all your daily tasks!");
    const confetti = document.createElement("div");
    confetti.innerHTML = "🎊🎈🎉";
    confetti.classList.add("celebration");
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 3000);
  }

  /* -------------------------------------------
     SPA Routing — now uses .hidden instead of style
     ------------------------------------------- */
  const pageChecklist = document.getElementById("page-checklist");
  const pageReview = document.getElementById("page-review");
  const navTabs = document.querySelectorAll(".nav-tab");

  function handleRouteChange() {
    const hash = window.location.hash || "#/checklist";
    if (hash === "#/review") {
      pageChecklist.classList.add("hidden");
      pageReview.classList.remove("hidden");
      navTabs.forEach(tab => tab.classList.toggle("active-tab", tab.dataset.target === "#/review"));
    } else {
      pageChecklist.classList.remove("hidden");
      pageReview.classList.add("hidden");
      navTabs.forEach(tab => tab.classList.toggle("active-tab", tab.dataset.target === "#/checklist"));
    }
  }

  navTabs.forEach(tab => {
    tab.addEventListener("click", () => location.hash = tab.dataset.target);
  });

  window.addEventListener("hashchange", handleRouteChange);
  handleRouteChange(); // initial load

  /* ------------------------------------------- */
}); // end DOMContentLoaded