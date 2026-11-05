# G32 — Neon Pinball V3

A **full-size arcade pinball game**, independent of the watch screen. Runs in any modern desktop or mobile browser, and in StackBlitz.

## Play

**[Open it in StackBlitz](https://stackblitz.com/github/RedBeard-Creative/Oh-yeah-disc-golf-time)**

- **Space** — launch ball via the right-side plunger lane.
- **A / Left arrow** — hold the left flipper up.
- **D / Right arrow** — hold the right flipper up.
- **N** — nudge (3 per game).
- **P** — pause.
- Touchscreen: press the large flipper controls or the lower part of each side of the playfield.
- Restart, mute, launch and pause buttons are alongside the table.

## V3 features

- Enlarged responsive pinball table with higher-resolution canvas (720 × 1008 drawing buffer, 600 × 840 game units).
- 11 colored reactive bumpers with varying point values.
- Five purple bonus targets: hit all for a 2,000 point bank bonus.
- Four prize targets: 750-point bonus, multiplier upgrade, 2,500-point jackpot and an extra ball.
- Hit all four prize targets to earn an additional 5,000 points.
- Bumper combos and multiplier upgrades.
- **Real drain gap** between the two flippers.
- Each flipper moves once per fixed simulation update and calculates the collision impulse from its moving surface; flippers remain raised while keys/buttons are held.
- Three balls to start; up to five via extra-ball prizes.
- Persistent high score stored locally in the browser.
- Standalone HTML/CSS/JS without runtime external dependencies.

## Local use

Save the root `index.html` and open it in a modern browser. No build tools are needed for direct play.

The earlier disc golf game remains recoverable through Git history but is no longer the default page.

## Project Nexus

This is a browser prototype of **G32 Neon Pinball**. The S06 AMOLED watch hardware is a separate project. Adapting the game to that screen would require embedded C++ graphics and more optimization.

## Full-screen mode and floating menu (V4)

The arcade page now removes the permanent sidebar and header so the whole game view is used for pinball.

- Click **☰** at the upper right to open the semi-transparent overlay with score, high score, controls and prize rules. Press **M** to toggle it, or **Esc** to close it.
- Click **⛶** to request browser fullscreen, or press **F**. If you're using a StackBlitz embedded preview, first click the preview's **open in new tab** icon so the browser can display the game without the IDE.
- The entire playfield fits within the viewport without cutting off the flippers.
- On touchscreens, use the small lower-left and lower-right **FLIP** buttons or the corresponding lower sides of the playfield.
- Keyboard controls remain **Space** to launch, **A/D** or **←/→** for flippers, **N** to nudge and **P** to pause.

The underlying pinball physics and V3 scoring are preserved.
