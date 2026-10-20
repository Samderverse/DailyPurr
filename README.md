# The Daily Purr

A cat fact a day, delivered by Angus, Leo and Ollie. A little home-screen app for iPhone: free, works offline, and nothing leaves the phone.

## Meet the residents

- **Angus**, the eldest. Serious, dignified, keeps standards. Eats other people's dinners and carries out unannounced sniff inspections.
- **Leo**, Angus's brother from the same litter. Starts the trouble, usually by bopping someone for no reason, then gets scared and hides.
- **Ollie**, the youngest. Pure chaos, two little Dracula fangs, and a firm belief that the middle of the bed is his.

## What it does

- **Fact of the day:** each cat has their own fact every day, told in their own voice, and one of them is "today's cat". Tap a cat to hear from them. The facts stay the same all day and change at midnight.
- **Another:** for when one fact isn't enough.
- **Listen:** each cat reads their fact aloud in a British voice, with Angus low and slow, Leo quick and nervous, and Ollie squeaky and fast.
- **A fuss:** tap the cat who's talking again to give them a fuss: a purr, some hearts, and the occasional change of expression.
- **Complaints Department:** a new formal complaint between the residents every day (food theft, unwanted sniffing, bed hogging, unprovoked bopping and more), with the accused's response. You're Management, so **Uphold** or **Dismiss**, and expect a reaction. Complaints against Management get **Apologise** or **Deny everything**.
- **Favourites:** save facts with ♥.
- **Share:** turns a fact into a picture card for WhatsApp or Instagram.
- **Settings:** add a name for the greeting, read facts aloud automatically, turn sounds on or off, and hear each cat's voice.

127 checked facts and 47 complaints, so it takes weeks before anything repeats.

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

Record a meow or purr in Voice Memos, share it as a file, and rename it `angus-meow.m4a`, `leo-meow.m4a` or `ollie-meow.m4a`. Upload it to the `cats` folder and that cat will use it when given a fuss, instead of the built-in purr.

## Adding facts and complaints

- **Facts** are in `facts.js`: `{ t: 'The fact.', tag: 'food' }`. The tag decides which lines the cats add, and the tags are listed at the top of the cats' `quips`.
- **Complaints** are in `complaints.js`: `{ from: 'leo', against: 'angus', type: 'Food theft', t: '…', reply: '…' }`. Use `against: 'management'` for complaints about the human (no reply needed).

After changing any file, bump `const VERSION = 'dp-v1'` in `sw.js` (to `dp-v2` and so on), then close and reopen the app twice.

## Files

| File | Purpose |
|---|---|
| `index.html` | The page |
| `styles.css` | Design, light and dark |
| `app.js` | Daily facts, voices, sounds, complaints, favourites, sharing |
| `facts.js` | The facts and each cat's personality and lines |
| `complaints.js` | The Complaints Department |
| `cats/` | The cats' photos (and any meow recordings) |
| `sw.js` | Lets it open instantly and work with no signal |
| `manifest.webmanifest`, `icons/` | Home-screen name and icon |

## Notes

- Sound only plays after a tap, and the iPhone's silent switch may mute it.
- Voices use the iPhone's built-in speech. If an enhanced British voice is downloaded under Settings › Accessibility › Spoken Content › Voices, it'll sound even better.
- Favourites, rulings and settings are stored on the phone only.
