# The Daily Purr

A cat fact a day, delivered by Angus, Leo and Ollie. A little home-screen app for iPhone: free, works offline, and nothing leaves the phone.

## Meet the residents

- **Angus**, the eldest. Serious, dignified, keeps standards. Eats other people's dinners and carries out unannounced sniff inspections.
- **Leo**, Angus's brother from the same litter. Starts the trouble, usually by bopping someone for no reason, then gets scared and hides.
- **Ollie**, the youngest. Pure chaos, two little Dracula fangs, and a firm belief that the middle of the bed is his.

## What it does

- **Fact of the day:** each cat has their own fact every day, told in their own voice, and one of them is "today's cat". Tap a cat to hear from them. The facts stay the same all day and change at midnight.
- **Another and Back:** for when one fact isn't enough, and for going back to the one before. Swiping the speech bubble does the same, and the dots underneath show where you are in today's facts.
- **Listen:** each cat reads their fact aloud in a British voice, with Angus low and slow, Leo quick and nervous, and Ollie squeaky and fast.
- **A fuss:** tap the cat who's talking again to give them a fuss: a purr, some hearts, and the occasional change of expression. The cats keep count, and whoever's being left out this week will say so.
- **Moods:** each cat has a mood for the day under his name. Rulings, complaints and birthdays change it.
- **Special days:** add birthdays and gotcha days in Settings and the cats mark the day. They also know Christmas, New Year, Valentine's Day, Mother's Day, Easter, Halloween, Bonfire Night, Black Cat Day and the cat days.
- **Complaints Department:** a new formal complaint between the residents every day (food theft, unwanted sniffing, bed hogging, unprovoked bopping and more), with the accused's response. You're Management, so **Uphold** or **Dismiss**, and expect a reaction. Complaints against Management get **Apologise** or **Deny everything**. The losing cat often appeals, Management can **File a complaint** of their own, and the points add up to an **Employee of the Month**, announced on the 1st.
- **Favourites:** save facts with ♥.
- **Archive:** every fact she's heard, by day and by cat, and how many of the 402 she's found so far.
- **Weekly quiz:** five questions every Monday, mostly on facts heard recently, with a different cat as quizmaster each week.
- **Album:** add photos of each cat from the phone, pick one as his profile picture, and record his real meow, which he then uses when given a fuss. These stay on the phone.
- **Share:** turns a fact into a picture card for WhatsApp or Instagram.
- **Settings:** add a name for the greeting, read facts aloud automatically, turn sounds on or off, and hear each cat's voice.

402 checked facts and 47 complaints, so it takes months before anything repeats.

## Install on iPhone

1. Open the link in **Safari**.
2. Tap **⋯** (or Share), then **Share › Add to Home Screen**, and keep **Open as Web App** on.
3. Tap **Add**.

## Put it on GitHub

1. Create a public repository, for example `DailyPurr`.
2. Upload everything in this folder, including the `cats` and `icons` folders, and commit.
3. **Settings › Pages**: deploy from the `main` branch, `/ (root)` folder.
4. The link appears after a minute or two: `https://YOUR-GITHUB-NAME.github.io/DailyPurr/`.

## Adding their real meows (optional)

The easiest way is **Album › Record** in the app. Alternatively, record a meow in Voice Memos, rename it `angus-meow.m4a`, `leo-meow.m4a` or `ollie-meow.m4a`, and upload it to the `cats` folder. A recording made in the app takes priority.

## Adding facts and complaints

- **Facts** are in `facts.js` and `facts-more.js`: `{ t: 'The fact.', tag: 'food' }`. The tag decides which lines the cats add, and the tags are listed in the cats' `quips`. Add new facts at the end of `facts-more.js`, never in the middle, so favourites and the archive stay right. To include it in the quiz, add `q: ['Question?', 'Right answer', 'Wrong', 'Wrong']`.
- **Everything else the cats say** (moods, special days, appeals, Employee of the Month, the quiz) is in `extras.js`.
- **Complaints** are in `complaints.js`: `{ from: 'leo', against: 'angus', type: 'Food theft', t: '…', reply: '…' }`. Use `against: 'management'` for complaints about the human (no reply needed).

After changing any file, bump `const VERSION = 'dp-v2'` in `sw.js` (to `dp-v3` and so on), then close and reopen the app twice.

## Files

| File | Purpose |
|---|---|
| `index.html` | The page |
| `styles.css` | Design, light and dark |
| `app.js` | Daily facts, voices, sounds, complaints, quiz, album, special days, sharing |
| `facts.js` | The first facts and each cat's personality and lines |
| `facts-more.js` | More facts, and quiz questions |
| `extras.js` | Moods, special days, appeals, Employee of the Month, quiz lines |
| `complaints.js` | The Complaints Department |
| `cats/` | The cats' photos (and any meow recordings) |
| `sw.js` | Lets it open instantly and work with no signal |
| `manifest.webmanifest`, `icons/` | Home-screen name and icon |

## Notes

- Sound only plays after a tap, and the iPhone's silent switch may mute it.
- Voices use the iPhone's built-in speech. If an enhanced British voice is downloaded under Settings › Accessibility › Spoken Content › Voices, it'll sound even better.
- Favourites, rulings, photos, recordings and settings are stored on the phone only. Clearing Safari's website data, or deleting the app from the home screen, removes them.

## What's new in v2

- Ollie now purrs when given a fuss, like the others (with a little chirp first, because he's Ollie).
- Fixed the other cat's line being read aloud twice.
- **Back**, swiping, and dots for today's facts.
- Special days, moods, fuss jealousy, Management's complaints, appeals, Employee of the Month, the weekly quiz, the archive, the album and the meow recorder.
- 275 more facts (402 in all).
- Fixed a bug where the visit streak would have reset when the clocks went back.
