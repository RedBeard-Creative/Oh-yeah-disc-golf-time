# Oh Yeah Disc Golf Time! 🥏 — Wheel of Doom

Playable React + Vite game with five wheels (Wheel of Fate plus four category wheels) and 61 approved challenges.

## Play in StackBlitz
[Open this repository in StackBlitz](https://stackblitz.com/~/github.com/RedBeard-Creative/Oh-yeah-disc-golf-time)

Or locally run `npm install` and `npm run dev`.

## Rules
- Every player spins before every hole.
- First spin selects a category, second spin selects a challenge.
- Every challenge applies for the whole hole, except longer bans.
- Failed risk challenges schedule **two spins on the NEXT hole only**. Current-hole spin counts do not change on failure.
- A pending risk challenge not marked success/failure is counted as failed when clicking Next Hole.
- Double Doom and Doom Streak add two further spins on the current hole.
- Disc Jail lasts three holes, No Favorite lasts two.
- Wheel history and multiplayer match state are kept in browser local storage. Each browser/device has its own state.
- Challenge definitions are in `src/challenges.js`.

## Recent edits
- Replaced Risk It with Closest Tree Challenge.
- Add and delete players; animate both spin stages; record results.
- Separate current required spins from next-hole debt to prevent the same-hole double-punishment bug.

Play safely: skip or reroll a challenge if conditions make it dangerous or impossible.
