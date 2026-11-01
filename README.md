# Oh Yeah Disc Golf Time! — HTML Edition 🥏

The Disc Golf Wheel of Doom is now a **plain HTML + CSS + JavaScript** game. No React, no complex build setup needed.

## Edit in VS Code
1. Clone or download this GitHub repository.
2. Open the folder in Visual Studio Code.
3. Install the **Live Server** extension (or use any simple local web server).
4. Right-click `index.html` and select **Open with Live Server**.

The source files are:
- `index.html` — Page layout
- `style.css` — Visual styling
- `app.js` — Wheel animation, randomness, players, match logic
- `src/challenges.js` — All 61 challenges and the SAFE spots

## StackBlitz
[Open this repository in StackBlitz](https://stackblitz.com/~/github.com/RedBeard-Creative/Oh-yeah-disc-golf-time)

You can also run `npm install` then `npm run dev` in VS Code or StackBlitz. Only Vite is needed for development; no React dependency.

## Rules
- Every player spins before each hole.
- Wheel of Fate chooses one of four category wheels.
- Each category wheel has its challenges plus an equally likely SAFE SPOT.
- A failed risk challenge schedules **two required spins on the next hole only**, never an immediate extra spin.
- Unanswered risk outcomes are treated as failed on advancing to the next hole.
- Double Doom and Doom Streak each add two spins on the current hole.
- No Favorite lasts two holes; Disc Jail lasts three.
- The game saves players and match progress in browser localStorage. Each phone keeps its own state.
- Spins use a browser cryptographic random number generator with unbiased sampling when available.

Play safely. Reroll throws that would endanger anyone or cannot be completed on that hole.
