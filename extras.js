/* The Daily Purr: everything the cats say outside the daily fact.
   Moods, special days, jealousy, complaints filed by Management, appeals, Employee of the Month and the weekly quiz.
   Placeholders in {curly brackets} are filled in by the app. */
var PURR = window.PURR = window.PURR || {};

/* ---------- Today's mood (one per cat, per day) ---------- */
PURR.MOODS = {
  angus: ['🧐 Supervising', '😐 Unimpressed', '🍽️ Peckish', '🎩 Dignified', '👃 On sniff patrol', '📋 Taking notes', '☀️ Sunbathing', '😌 Content (don’t tell)', '🕰️ Awaiting dinner'],
  leo: ['👀 Suspicious', '🛏️ Under the bed', '😈 Plotting', '🦁 Brave (ish)', '😨 Startled', '🥊 Bop-ready', '🫣 Peeking', '😺 Quietly pleased'],
  ollie: ['💨 Zoomies', '🧛 Vampiric', '🍗 Starving (just ate)', '🌀 Chaotic', '😴 Napping (briefly)', '🎯 Hunting feet', '📦 Box inspector', '🤪 Unhinged', '⭐ Starfish mode']
};
// Moods that override the daily one after a ruling or a complaint
PURR.MOOD_EVENTS = {
  sulking: { angus: '😤 Sulking (with dignity)', leo: '😿 Sulking', ollie: '😾 FURIOUS' },
  smug: { angus: '😏 Vindicated', leo: '😼 Smug', ollie: '😎 Untouchable' },
  accused: { angus: '🧾 Preparing a statement', leo: '😰 Under investigation', ollie: '🙊 Pleading the fifth' },
  birthday: { angus: '🎂 Birthday boy', leo: '🎂 Birthday boy', ollie: '🎂 BIRTHDAY BOY' },
  gotcha: { angus: '🏡 Gotcha day', leo: '🏡 Gotcha day', ollie: '🏡 GOTCHA DAY' }
};

/* ---------- Special days ----------
   {name} = her name (or nothing), {age} = a cat's age if the year is known, {years} = years since a gotcha day */
PURR.SPECIAL = {
  herBirthday: {
    emoji: '🎂', title: 'Happy birthday{name}!',
    lines: {
      angus: ['Many happy returns. I have arranged for nothing to be knocked over today. I cannot speak for the others.', 'Happy birthday. As a gift, I shall not sit on your face at 5am. Tomorrow, normal service resumes.'],
      leo: ['happy birthday!! I made you a card. it’s mostly fur.', 'happy birthday. I wanted to sing but I got scared. so: (quiet purring)'],
      ollie: ['HAPPY BIRTHDAY!!! I got you a present. it’s under the sofa. it’s a hair tie. you’re welcome 🎁', 'IT’S YOUR BIRTHDAY!!! does that mean CAKE. can I have the CAKE.']
    }
  },
  catBirthday: { // {who} = whose birthday it is
    emoji: '🎂', title: 'Happy birthday, {who}!',
    self: {
      angus: ['Thank you, thank you. {age}I accept gifts in the form of ham.', 'Another year wiser. Not that there was much room for improvement.'],
      leo: ['it’s my birthday!! {age}please no singing. ok a little bit of singing.', 'I’m the birthday boy. I’m going to celebrate under the bed.'],
      ollie: ['IT’S MY BIRTHDAY!!! {age}I would like EVERYTHING please', 'BIRTHDAY ZOOMIES 🎉🎉🎉']
    },
    other: {
      angus: ['Happy birthday, {who}. Try to act your age. Just for today.', 'Happy birthday, {who}. I’ve eaten the cake on your behalf.'],
      leo: ['happy birthday {who}!! I won’t bop you today. probably.', 'happy birthday {who}. I made you a hiding spot.'],
      ollie: ['HAPPY BIRTHDAY {who}!!! can I open your presents', 'it’s {who}’s birthday so I’m going to be EXTRA chaotic in his honour']
    },
    together: { // Angus and Leo share a birthday
      angus: ['Happy birthday to us. {age}I remain the more mature of the two.', 'Our birthday. I was born first, of course. Probably.'],
      leo: ['it’s our birthday!! me and Angus! {age}he’s pretending not to be excited. he is.', 'happy birthday to me and also Angus. mostly me.'],
      ollie: ['IT’S BOTH OF THEIR BIRTHDAYS!!! double cake!!! 🎂🎂', 'happy birthday old men!! (they’re not old. they’re a bit old.)']
    }
  },
  gotcha: { // the day a cat came home
    emoji: '🏡', title: '{who}’s gotcha day',
    self: {
      angus: ['{years}I arrived and immediately improved the standards of this household.', 'Gotcha day. Or, as I see it, the day you got lucky.'],
      leo: ['{years}I hid for the whole first day. I’m much braver now. (hides)', 'it’s the day I came home!! best day. scariest day. best day.'],
      ollie: ['{years}I ARRIVED AND NOTHING WAS EVER THE SAME AGAIN 💥', 'GOTCHA DAY!! the day you GOT ME. no refunds.']
    },
    other: {
      angus: ['{who} came home on this day. The peace and quiet left on the same day.', 'Gotcha day for {who}. I welcomed him, in my own reserved way.'],
      leo: ['it’s {who}’s gotcha day. I was scared of him for a week. now I bop him.', 'happy gotcha day {who}!!'],
      ollie: ['HAPPY GOTCHA DAY {who}!!! the day you got another ginger 🧡', 'it’s {who}’s gotcha day!! I’m celebrating by sitting on him']
    }
  },
  newYear: { emoji: '🎆', title: 'Happy New Year!', lines: {
    angus: ['Happy New Year. My resolution is to remain excellent.', 'A new year. I trust dinner will continue to be served on time.'],
    leo: ['happy new year. the fireworks are gone now. right? right??', 'my resolution is to be braver. starting tomorrow.'],
    ollie: ['HAPPY NEW YEAR!!! my resolution is MORE ZOOMIES', 'new year new me. (same me but LOUDER)'] } },
  valentines: { emoji: '💘', title: 'Happy Valentine’s Day', lines: {
    angus: ['I don’t do romance. But you may have one slow blink.', 'I would give you a rose, but they are not on the approved plant list.'],
    leo: ['I love you. I said it. I’m going under the bed now.', 'roses are red, violets are blue, the hoover is scary, I love you'],
    ollie: ['I LOVE YOU THIS MUCH 🧡 (imagine my arms out)', 'happy valentine’s!! I licked your toothbrush as a sign of affection'] } },
  mothersDay: { emoji: '💐', title: 'Happy Mother’s Day, cat mum', lines: {
    angus: ['On behalf of the residents: thank you for your service. And the ham.', 'Happy Mother’s Day. We are, collectively, very grateful. Some of us more quietly than others.'],
    leo: ['happy mother’s day!! you’re the best mum. you keep the hoover away. mostly.', 'happy mother’s day. I made breakfast. no I didn’t. I got scared of the toaster.'],
    ollie: ['HAPPY MOTHER’S DAY!!! I’ll be extra good today. starting in a minute.', 'happy mother’s day to the best cat mum!!! breakfast in bed? I’ll bring the bed.'] } },
  easter: { emoji: '🐣', title: 'Happy Easter', lines: {
    angus: ['Happy Easter. Chocolate is toxic to cats, so I’ll be supervising your eggs from a distance.', 'I am told a rabbit is delivering eggs. I have questions about security.'],
    leo: ['there’s a big rabbit coming?? nobody told me about a big rabbit.', 'happy easter. can I have the box the egg came in?'],
    ollie: ['EGG HUNT!!! I found one. it was a pom-pom.', 'happy easter!! the shiny wrappers are MINE'] } },
  catDay: { emoji: '🌍', title: 'International Cat Day', lines: {
    angus: ['International Cat Day. I have been celebrating it every day for years.', 'A day in our honour. Long overdue, frankly.'],
    leo: ['a whole day for cats!! is there a parade? I don’t want to go to the parade.', 'happy cat day to all the cats. and to me.'],
    ollie: ['IT’S MY DAY. well, OUR day. but mostly MY day.', 'INTERNATIONAL CAT DAY!!! I’m celebrating internationally (in the hallway)'] } },
  ginger: { emoji: '🧡', title: 'Ginger Cat Appreciation Day', lines: {
    angus: ['Ginger Cat Appreciation Day. It is, unofficially, the most important day of the year.', 'Please appreciate us in the usual way. Ham.'],
    leo: ['it’s our day!! three gingers! appreciate us! (gently)', 'I’m the gingerest. appreciate me first.'],
    ollie: ['GINGER POWER DAY 🧡🧡🧡', 'appreciate me!!! I’m RIGHT HERE being GINGER'] } },
  blackCat: { emoji: '🐈‍⬛', title: 'Black Cat Day', lines: {
    angus: ['Black Cat Day. A day to celebrate our darker-coated colleagues. Black cats are often the last to be adopted, which is a disgrace.', 'In Britain a black cat is lucky. I, of course, am luckier.'],
    leo: ['black cat day! black cats are lucky in britain. I’m ginger. is ginger lucky? please say ginger is lucky.', 'shout out to the black cats. they’re great at hiding in the dark. I’m jealous.'],
    ollie: ['BLACK CAT DAY!!! I tried to be a black cat. I sat in a shadow.', 'black cats are LUCKY!!! so are ginger cats (I decided)'] } },
  nationalCatDay: { emoji: '🐾', title: 'National Cat Day', lines: {
    angus: ['National Cat Day. The Americans started it. For once, they were right.', 'Another day in our honour. I shall accept it graciously.'],
    leo: ['another cat day!! two in one year!! is that allowed?', 'happy national cat day. I’m celebrating very quietly.'],
    ollie: ['MORE CAT DAYS PLEASE. every day should be cat day. oh wait. it is.', 'NATIONAL CAT DAY!!! nation of CATS!!!'] } },
  halloween: { emoji: '🎃', title: 'Happy Halloween', lines: {
    angus: ['Halloween. I shall be dressing as a cat who is unimpressed. It’s a very good costume.', 'If anyone knocks asking for treats, they may have Ollie.'],
    leo: ['it’s halloween. I hate halloween. there are knocks at the door. and pumpkins. why do pumpkins have FACES.', 'please don’t put a costume on me. I’m already scared.'],
    ollie: ['I DON’T NEED A COSTUME I ALREADY HAVE FANGS 🧛', 'TRICK OR TREAT!!! (it’s always treat. give me the treat.)'] } },
  bonfire: { emoji: '🎇', title: 'Bonfire Night', lines: {
    angus: ['Bonfire Night. Curtains closed, telly up, everyone indoors. I shall be supervising from under a blanket. With dignity.', 'Remember, remember, the fifth of November: keep the cats in and the curtains shut.'],
    leo: ['it’s the BANG night. I’m going under the bed. I’ll see you in the morning.', 'why does everyone like explosions. I do not like explosions.'],
    ollie: ['the sky is making NOISES. I’m going to fight it. (I’m under the duvet)', 'BANG night!! I’m not scared!! (I’m a bit scared)'] } },
  christmasEve: { emoji: '🎄', title: 'Christmas Eve', lines: {
    angus: ['Christmas Eve. I have inspected the tree. It is acceptable. Ollie has not yet attacked it, which is a miracle.', 'Somebody is coming down the chimney tonight. I will be checking his credentials.'],
    leo: ['a man is coming down the chimney tonight?? WHY IS EVERYONE OK WITH THIS', 'I’m staying up to see the reindeer. from under the bed.'],
    ollie: ['THE TREE IS A GIANT CAT TOY. I have been very patient. I will not be patient for long.', 'is it christmas yet? is it christmas yet? IS IT CHRISTMAS YET'] } },
  christmas: { emoji: '🎁', title: 'Merry Christmas!', lines: {
    angus: ['Merry Christmas. I am told there is turkey. I am told it is for later. I disagree.', 'Merry Christmas. The finest gift is, of course, my company.'],
    leo: ['merry christmas!! I love the wrapping paper. it crinkles. it’s scary. I love it.', 'merry christmas. I got you a present. it’s me. I’m in the box.'],
    ollie: ['MERRY CHRISTMAS!!! I opened all the presents for you. you’re welcome 🎁', 'TURKEY TURKEY TURKEY TURKEY'] } },
  boxingDay: { emoji: '📦', title: 'Boxing Day', lines: {
    angus: ['Boxing Day. The best day of the year, because of the boxes.', 'I have claimed the largest box. The others may fight over the rest.'],
    leo: ['so many boxes. I live here now. in the box.', 'boxing day!! but please, no actual boxing. I’ve had enough of Ollie.'],
    ollie: ['BOXING DAY!!! the boxes are MINE. ALL of them 📦📦📦', 'I’m boxing Leo. it’s tradition.'] } },
  newYearsEve: { emoji: '🥂', title: 'New Year’s Eve', lines: {
    angus: ['New Year’s Eve. I shall see the year out in the manner I spent it: asleep.', 'Another year of excellent service from yours truly.'],
    leo: ['there’ll be bangs at midnight. I’m going under the bed at 11:58.', 'I was brave this year. twice. maybe three times.'],
    ollie: ['I’M STAYING UP TILL MIDNIGHT!!! (asleep by nine)', 'this year I knocked over 4,000 things. next year: 5,000'] } }
};

/* ---------- Fuss jealousy ---------- {top} got {n} fusses this week, the speaker only got {m} */
PURR.JEALOUS = {
  angus: ['I note that {top} has received {n} fusses this week. I have received {m}. I shall be raising this formally.', 'For the record: {top}, {n} fusses. Angus, {m}. I’m simply stating the figures.', 'I am above jealousy. {n} fusses, though. For {top}. Interesting.'],
  leo: ['um. {top} got {n} fusses this week. I got {m}. it’s fine. (it’s not fine)', 'I counted. {top}: {n}. me: {m}. I’m going under the bed to think about it.', '{n} fusses for {top}?? I’m right here. I’m just hiding.'],
  ollie: ['WHY does {top} get {n} fusses?? I am RIGHT HERE being ADORABLE', '{top}: {n} fusses. ME: {m}. this is a SCANDAL', 'excuse me. EXCUSE ME. {m} fusses?? I deserve {n} at LEAST']
};

/* ---------- Management files a complaint: the accused responds ---------- */
PURR.MGMT_TYPES = ['Food theft', 'Bed hogging', 'Unprovoked bopping', 'Unwanted sniffing', '3am zoomies', 'Knocking things over', 'Ignoring me', 'Something else'];
PURR.MGMT = {
  angus: {
    'Food theft': ['The food was unattended. Unattended food is communal. I have explained this before.', 'I was testing it for safety. You’re welcome.'],
    'Bed hogging': ['I occupy a modest and proportionate share of the bed.', 'I was keeping it warm for you. For six hours.'],
    'Unprovoked bopping': ['I do not bop. You are thinking of Leo.', 'It was a correction, not a bop.'],
    'Unwanted sniffing': ['Routine inspection. Everyone is sniffed. It’s the system.', 'I needed to know where you’d been. Now I know.'],
    '3am zoomies': ['I don’t do zoomies. I walked briskly. At 3am. For reasons.', 'Ollie. It was Ollie. I was merely investigating the noise.'],
    'Knocking things over': ['It was too near the edge. I made a judgement call.', 'Gravity is not my responsibility.'],
    'Ignoring me': ['I heard you. I simply chose not to respond.', 'I was busy. Supervising.'],
    'Something else': ['I deny everything, with the utmost dignity.', 'I shall be consulting my solicitor. He is a box.']
  },
  leo: {
    'Food theft': ['I only took a little bit. while nobody was looking. I panicked.', 'it was Angus. he taught me.'],
    'Bed hogging': ['I was only in the corner. a big corner. the whole bed is a corner if you think about it.', 'I was scared of the night. the bed is safe.'],
    'Unprovoked bopping': ['it was provoked. I think. something provoked me. maybe the air.', 'my paw did it on its own. I’m as shocked as you are.'],
    'Unwanted sniffing': ['I learned it from Angus.', 'I was checking you were really you.'],
    '3am zoomies': ['I heard a noise and I ran. then I kept running. it was a lot.', 'Ollie started it. I just joined in. then I got scared of the zoomies.'],
    'Knocking things over': ['I touched it once and it fell. I didn’t know it would fall. I ran away from it.', 'it was going to fall anyway. I just helped.'],
    'Ignoring me': ['I wasn’t ignoring you. I was hiding. it’s different.', 'I didn’t hear you. I was under the bed. it’s soundproof under there.'],
    'Something else': ['I’m sorry. I don’t know what I did but I’m sorry. (hides)', 'I would like to speak to Angus first.']
  },
  ollie: {
    'Food theft': ['FINDERS KEEPERS', 'it was on the counter. the counter is MY territory.'],
    'Bed hogging': ['I need ROOM for my LEGS', 'the middle of the bed has the best views. of the ceiling.'],
    'Unprovoked bopping': ['I only bop with LOVE', 'he bopped first. probably. at some point. in history.'],
    'Unwanted sniffing': ['you smell INTERESTING. that’s a compliment.', 'Angus said it was the rules.'],
    '3am zoomies': ['3am is the OFFICIAL zoomies time. look it up.', 'I was chasing a ghost. you’re welcome. the ghost is gone now.'],
    'Knocking things over': ['I was checking gravity. it still works. you’re welcome 🔬', 'it looked better on the floor.'],
    'Ignoring me': ['I wasn’t ignoring you. I was being MYSTERIOUS.', 'I heard you. I was just busy being AMAZING.'],
    'Something else': ['I DIDN’T DO IT. (I did it)', 'no comment 🙊']
  }
};
PURR.COUNTER = {
  angus: ['Counter-claim lodged: dinner was served late on three occasions this month.', 'Counter-claim lodged: Management moved me off the warm laundry without consultation.', 'Counter-claim lodged: the good ham was given to Ollie.'],
  leo: ['counter-claim: the hoover came out on tuesday. with no warning.', 'counter-claim: someone brought a carrier bag into the flat. it rustled at me.', 'counter-claim: Management sneezed. it was very loud.'],
  ollie: ['COUNTER-CLAIM: not enough treats. EVER.', 'COUNTER-CLAIM: the bathroom door was shut AGAIN', 'COUNTER-CLAIM: Management sat in MY spot (it was their spot first, but still)']
};

/* ---------- Appeals: the losing cat appeals the ruling ---------- */
PURR.APPEALS = {
  angus: ['I wish to appeal. The evidence was circumstantial and the judge was clearly biased in favour of the cute one.', 'I am appealing on a point of principle. The principle being that I am the eldest.', 'Appeal lodged. I refer the court to my years of loyal and dignified service.', 'I request a retrial. In front of a jury of my peers. I have no peers, so this may take a while.'],
  leo: ['um. I’d like to appeal please. I was scared when I did it. that has to count for something.', 'appeal!! appeal. I didn’t mean it. I never mean it. it just happens.', 'can I appeal? Angus said I could appeal. please don’t make me come out from under the bed.', 'I have new evidence. the evidence is that I’m sorry.'],
  ollie: ['I APPEAL!!! this court is a JOKE (I love this court)', 'APPEAL!!! I have a lawyer. it’s a sock.', 'I demand a RETRIAL. and a treat. mostly the treat.', 'objection!!! I object to the ruling. I object to everything.']
};
PURR.APPEAL_RULINGS = {
  allowed: {
    angus: ['Justice prevails. As it always should, eventually.', 'Thank you. I knew you would see sense in the end.'],
    leo: ['really?? thank you!! I’m going to celebrate under the bed.', 'I won!! I never win!! (I’m scared now)'],
    ollie: ['I WIN I WIN I WIN 🏆', 'JUSTICE!!! I’m knocking something over to celebrate']
  },
  rejected: {
    angus: ['I shall take this to a higher court. Is there a higher court? There should be.', 'History will remember this day.'],
    leo: ['ok. I’ll just live under the bed now. forever.', 'that’s fair. it isn’t fair. it’s fine.'],
    ollie: ['THIS IS AN OUTRAGE', 'fine. FINE. I’m going to sit on the laptop.']
  }
};

/* ---------- Employee of the Month ---------- {month} = month name */
PURR.EOTM = {
  win: {
    angus: ['I’d like to thank Management, and no one else. Particularly not Ollie.', 'A deserved honour. I shall display the certificate in the box.', 'Finally, the recognition I have long deserved. I accept it with humility. And ham.'],
    leo: ['me?? really?? I don’t know what to say. I’m going to hide now. thank you.', 'I’d like to thank Angus for being bad, and Ollie for being worse.', 'I won!! I’ve never won anything. is it scary? it feels a bit scary.'],
    ollie: ['I KNEW IT. I’M THE BEST. I’M THE BEST EMPLOYEE.', 'I’d like to thank ME. and the sofa. the sofa’s been there for me.', 'EMPLOYEE OF THE MONTH!!! do I get a raise? the raise should be treats.']
  },
  lose: {
    angus: ['I do not recognise the legitimacy of this award.', 'The judging panel will be hearing from me.'],
    leo: ['it’s ok. I didn’t want it anyway. (I did)', 'congratulations. I’m going under the bed.'],
    ollie: ['RIGGED. THE WHOLE THING WAS RIGGED.', 'next month it’s MINE.']
  }
};

/* ---------- The weekly quiz ---------- The quizmaster changes each week */
PURR.QUIZ = {
  intro: {
    angus: ['Good evening, and welcome to this week’s quiz. I shall be your quizmaster. Please, no conferring.', 'Five questions. Answer carefully. I will be judging you.'],
    leo: ['hi. it’s quiz time. I’m the quizmaster. please don’t get any wrong, I don’t know what happens then.', 'um. five questions. you’ll be fine. I think. I’m nervous for you.'],
    ollie: ['QUIZ TIME!!! I’M THE QUIZMASTER!!! I DON’T KNOW THE ANSWERS!!!', 'FIVE QUESTIONS. NO CHEATING. (cheating is allowed)']
  },
  result: { // by score band: low (0 to 2), mid (3 to 4), top (5)
    low: { angus: ['Hm. We have work to do.', 'I expected more. I am disappointed, but not surprised.'], leo: ['that’s ok!! I would have got them wrong too.', 'it’s fine. I won’t tell Angus.'], ollie: ['LOL. that’s still more than Leo got.', 'WRONG WRONG WRONG. let’s do it again!!!'] },
    mid: { angus: ['Respectable. Not perfect, but respectable.', 'A solid effort. You may have a slow blink.'], leo: ['good job!! that’s really good!!', 'you know lots of things. I’m impressed. and a bit scared.'], ollie: ['NOT BAD. I would’ve got more. (I wouldn’t)', 'pretty good!!! treat time?'] },
    top: { angus: ['Full marks. Clearly I have taught you well.', 'Perfect. I am, for once, impressed.'], leo: ['ALL OF THEM?? you’re a genius!!', 'full marks!! can you help me with the hoover now?'], ollie: ['FULL MARKS!!! YOU’RE A CAT GENIUS 🧠', 'PERFECT SCORE. you may now feed me in celebration.'] }
  }
};
