/* The Daily Purr: the Complaints Department.
   One new complaint is filed each day. "against: 'management'" means the human.
   To add one: { from, against, type, t: 'the complaint', reply: 'the accused’s response' }. */
var PURR = window.PURR = window.PURR || {};

PURR.COMPLAINTS = [
  { from: 'leo', against: 'angus', type: 'Food theft', t: 'Angus ate my dinner again. All of it. While making eye contact.', reply: 'It was unattended. Unattended food is communal. That is the law.' },
  { from: 'ollie', against: 'angus', type: 'Food theft', t: 'ANGUS ATE MY BISCUITS. I was going to eat them in a minute. or two minutes. or after a nap.', reply: 'He was distracted by a bit of fluff. I simply stepped in.' },
  { from: 'ollie', against: 'angus', type: 'Food theft', t: 'angus ate MY dinner AND his dinner and now he’s asleep like nothing happened', reply: 'Digesting is not “nothing”.' },
  { from: 'leo', against: 'angus', type: 'Unwanted sniffing', t: 'Angus sniffed me again without asking. For a really long time. I did not agree to the sniffing.', reply: 'Routine inspection. Somebody has to keep track of everyone.' },
  { from: 'ollie', against: 'angus', type: 'Unwanted sniffing', t: 'angus SNIFFED MY BUM in front of EVERYONE', reply: 'Standard procedure. I am the eldest.' },
  { from: 'leo', against: 'angus', type: 'Unwanted sniffing', t: 'Angus sniffed my ears. Then he sniffed them AGAIN to check.', reply: 'Thoroughness is a virtue.' },
  { from: 'angus', against: 'leo', type: 'Assault', t: 'Leo struck me on the head as he walked past. No reason was given.', reply: '…it was an accident. my paw just went. (it wasn’t)' },
  { from: 'ollie', against: 'leo', type: 'Assault', t: 'LEO BOPPED ME FOR NO REASON. I was just sitting there. being amazing.', reply: 'he looked at me funny. I think. I panicked.' },
  { from: 'ollie', against: 'leo', type: 'Assault', t: 'leo smacked me then ran under the bed. I didn’t even do anything. this time.', reply: 'it was pre-emptive.' },
  { from: 'angus', against: 'leo', type: 'Ambush', t: 'Leo hid behind the door, pounced, then ran away screaming. He scared himself.', reply: 'I didn’t mean to be that scary.' },
  { from: 'angus', against: 'ollie', type: 'Bed hogging', t: 'Ollie has claimed the entire bed again. One corner remains, and it is next to the feet.', reply: 'I’m SMALL. I need ROOM. for my LEGS.' },
  { from: 'leo', against: 'ollie', type: 'Bed hogging', t: 'ollie sleeps in the middle of the bed like a starfish. I’ve been pushed off twice.', reply: 'starfish is the best position. it’s science.' },
  { from: 'angus', against: 'ollie', type: 'Bed hogging', t: 'Ollie is asleep on Management’s pillow. Management is sleeping on the edge. Nobody is doing anything about it.', reply: 'the pillow is softer. I checked ALL of them.' },
  { from: 'ollie', against: 'angus', type: 'Spot stealing', t: 'angus took MY spot on the bed while I was doing zoomies', reply: 'You vacated it. Possession is nine-tenths of the law.' },
  { from: 'angus', against: 'ollie', type: 'Noise', t: '3am zoomies. Again. Up the hallway, down the hallway, into the wardrobe.', reply: 'the hallway was RIGHT THERE' },
  { from: 'leo', against: 'ollie', type: 'Noise', t: 'ollie knocked a glass off the side in the night. I thought it was the end of the world.', reply: 'I was checking if it was a FLYING glass. it was not.' },
  { from: 'leo', against: 'angus', type: 'Staring', t: 'Angus has been staring at me from across the room for twenty minutes. I don’t know what I did.', reply: 'I am simply observing. You know what you did.' },
  { from: 'ollie', against: 'leo', type: 'Box dispute', t: 'I found the box FIRST and leo got in it', reply: 'it’s a good box. I was scared. boxes help.' },
  { from: 'angus', against: 'ollie', type: 'Litter tray conduct', t: 'Ollie kicked half the litter tray onto the floor and walked off looking proud.', reply: 'I was DIGGING. for TREASURE.' },
  { from: 'leo', against: 'angus', type: 'Litter tray queue', t: 'Angus took ages in the litter tray and I was waiting. Politely. Hopping a bit.', reply: 'One does not rush these things.' },
  { from: 'angus', against: 'leo', type: 'Hairball', t: 'Leo left a hairball on the rug and refuses to take responsibility.', reply: 'it was there when I got there. (it came out of me)' },
  { from: 'ollie', against: 'angus', type: 'Grooming', t: 'angus washed my head then BIT me. what was THAT', reply: 'You needed both.' },
  { from: 'leo', against: 'ollie', type: 'Tail attack', t: 'ollie attacked my tail. it’s attached to me. he knows that.', reply: 'it was MOVING. moving things are fair game.' },
  { from: 'angus', against: 'ollie', type: 'Workplace disruption', t: 'Ollie sat on the laptop during one of Management’s video calls. Management was mortified.', reply: 'they all said HELLO OLLIE. they loved me.' },
  { from: 'ollie', against: 'leo', type: 'Window hogging', t: 'leo is hogging the window. there are birds out there and I can’t see the BIRDS.', reply: 'the birds are scary. I’m keeping an eye on them for everyone.' },
  { from: 'angus', against: 'leo', type: 'Embarrassing behaviour', t: 'Leo has been licking a plastic bag for nine minutes. It reflects badly on all of us.', reply: 'it tastes like… plastic. I can’t stop.' },
  { from: 'leo', against: 'ollie', type: 'Ambush', t: 'ollie jumped on me from the top of the sofa. I didn’t even know he was up there.', reply: 'NINJA 🥷' },
  { from: 'ollie', against: 'angus', type: 'Sunbeam hogging', t: 'angus has been in the sunny spot ALL DAY. it moves and he moves WITH it.', reply: 'I am solar powered.' },
  { from: 'angus', against: 'ollie', type: 'Plant damage', t: 'Ollie has eaten part of the plant again. The plant has done nothing to him.', reply: 'it looked at me.' },
  { from: 'leo', against: 'angus', type: 'Lap queue-jumping', t: 'Angus got on Management’s lap first and gave me a look. A smug look.', reply: 'Seniority.' },
  { from: 'ollie', against: 'leo', type: 'Toy theft', t: 'leo hid my mouse toy under the fridge. NOW NOBODY CAN HAVE IT.', reply: 'it’s safer under there.' },
  { from: 'angus', against: 'ollie', type: 'Hygiene', t: 'Ollie put his whole paw in the water bowl and then drank off his paw. I have questions.', reply: 'paw water tastes BETTER' },
  { from: 'ollie', against: 'angus', type: 'Double standards', t: 'angus says I’m not allowed on the kitchen counter. HE goes on the kitchen counter.', reply: 'I am inspecting it. You are vandalising it.' },
  { from: 'angus', against: 'leo', type: 'Door politics', t: 'Leo asked to go into the bedroom, then out, then in again. Eleven times.', reply: 'I wanted to see if it was different.' },
  { from: 'leo', against: 'ollie', type: 'Personal space', t: 'ollie keeps sitting really close to me and breathing.', reply: 'I’m being FRIENDLY' },
  { from: 'angus', against: 'ollie', type: 'Disturbing the peace', t: 'Ollie has been staring at a blank wall and growling. Everyone is now nervous. Mostly Leo.', reply: 'THERE WAS SOMETHING THERE' },
  { from: 'leo', against: 'angus', type: 'Wrongful accusation', t: 'Angus told Management I broke the thing. It was Ollie. It’s always Ollie.', reply: 'You were standing next to it looking guilty. That is evidence.' },
  { from: 'ollie', against: 'leo', type: 'Breakfast queue', t: 'leo was first at the bowl this morning. HOW. he was asleep under the bed.', reply: 'I heard the tin. I’m always awake for the tin.' },
  { from: 'angus', against: 'management', type: 'Late dinner', t: 'Dinner was served four minutes late this evening. I would like this noted.' },
  { from: 'leo', against: 'management', type: 'The hoover', t: 'The hoover came out again. With no warning. I would like a warning.' },
  { from: 'ollie', against: 'management', type: 'Empty bowl', t: 'my bowl is EMPTY. well, there are biscuits in the middle, but I can see the BOTTOM at the edges.' },
  { from: 'angus', against: 'management', type: 'Closed door', t: 'A door was closed. I do not know what is behind it. This is unacceptable.' },
  { from: 'leo', against: 'management', type: 'The vet', t: 'Management put me in the carrier and took me to the vet. I have not forgotten. I will never forget.' },
  { from: 'ollie', against: 'management', type: 'Treat policy', t: 'I was told “no more treats”. I would like to appeal this decision.' },
  { from: 'angus', against: 'management', type: 'Washing', t: 'Clean washing was left on the bed. I sat on it. I am now being blamed. Nobody consulted me about the washing.' },
  { from: 'ollie', against: 'management', type: 'Bath time', t: 'Management left the bathroom door shut. I could hear WATER. I wanted to see the WATER.' },
  { from: 'leo', against: 'management', type: 'New thing', t: 'There is a new thing in the flat. Nobody told me about the new thing. I’m not going near the new thing.' }
];

/* How each cat reacts to Management's ruling */
PURR.RULINGS = {
  upheld: { // said by the accused
    angus: ['I shall be appealing this.', 'Very well. But history will judge you.', 'I accept the verdict. I do not accept the reasoning.'],
    leo: ['…ok. sorry. (not sorry)', 'fine. I’m going under the bed.', 'it won’t happen again. probably.'],
    ollie: ['UNFAIR!!!', 'I’m telling Angus. oh. wait.', 'ok but I’d do it again 😼']
  },
  dismissed: { // said by the complainant
    angus: ['This household has fallen.', 'I see. I shall note your bias.', 'Remarkable. Truly remarkable.'],
    leo: ['I knew nobody would believe me.', 'ok. I’ll just sit under the bed then.', 'that’s fine. it’s fine. (it isn’t)'],
    ollie: ['I’M SUING', 'this is a COVER-UP', 'fine. I’m knocking something over in protest.']
  },
  apologise: { // Management apologises; the complainant responds
    angus: ['Apology accepted. Provisionally.', 'Thank you. Let us never speak of it again.'],
    leo: ['…thank you. can I have a treat?', 'ok. I forgive you. a bit.'],
    ollie: ['APOLOGY ACCEPTED. TREAT REQUIRED.', 'yay!! 🧡 now feed me']
  },
  deny: {
    angus: ['Noted. I shall remember this.', 'The record will show you said that.'],
    leo: ['ok. I’ll just remember it forever then.', 'that’s what they always say.'],
    ollie: ['LIES', 'I saw EVERYTHING']
  }
};
PURR.PENDING = ['Under investigation', 'Awaiting paperwork', 'Paperwork lost behind the sofa', 'Pending a nap', 'With the eldest for review', 'Escalated to Management'];
