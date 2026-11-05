# G32 — Pinball Tycoon V2

A custom-built neon pinball tycoon game. **Build, play, upgrade, earn money and explore unusual gravity.**

[**Launch in StackBlitz**](https://stackblitz.com/github/RedBeard-Creative/Oh-yeah-disc-golf-time)

The game runs from the repository's self-contained `index.html`. Open the StackBlitz preview in a separate browser tab to use the full window, then click ⛶ for browser fullscreen.

## Three table modes

- **Classic** — traditional downward gravity.
- **Gravity U** — a continuously animated, guided upside-down-U start: the ball travels up the left edge, curves across the top, and comes down the right before entering the customizable playfield. The gravity-direction labels follow this path. This part is a guided route, not fully simulated rotating gravitational physics.
- **Flip Field** — a free-moving pinball table with a gravity vector that smoothly rotates over time.

You may switch modes from the floating ☰ menu. Your owned bumper placements and rails are shared across modes.

## Build mode — snap bumpers onto pegs

1. Click **🛠 BUILD** (or **B**) to pause the game.
2. Open the floating menu and select a bumper.
3. Click an available peg in the **7 × 7 regular socket grid** on the playfield.
4. Click an owned bumper to select it, then **Upgrade**, **Sell** or **Move** it.
5. Click **✓ PLAY** to continue.

Placement refuses overlapping bumpers, built-in starter bumpers, and rail mounting lanes. Upgrades have three levels. The table allows up to 26 purchased bumpers.

### Five bumper types

| Bumper | Shop cost | Size | Money per hit | What it does |
| --- | ---: | --- | ---: | --- |
| Basic | $120 | Large | +$1 | Easy to hit, ordinary bounce |
| Power | $280 | Medium | +$2 | Stronger bounce |
| Grab & Roll | $650 | Small | +$3 | Briefly captures then releases a ball horizontally toward the opposite side |
| Ultra Phase | $1,050 | Tiny | +$5 | Pass-through bumper, deliberately does not bounce the ball |
| Ball Spawner | $1,600 | Small | +$2 | Spawns another ball when struck (cooldown and six-ball cap apply) |

Money income increases with bumper upgrade level.

## Two rail slots

Buy the **left** and/or **right** rail for $900 each in the floating menu. A ball entering the corresponding capture gate is guided through the rail, triggers four visible pass-through markers (small score/$ rewards), then reaches the rail prize button (+$15 plus bonus points) and exits smoothly.

Rail mounting lanes are protected so newly purchased rails cannot overlap occupied edge sockets.

## Tycoon economy

- Start with **$280**, two permanent starter bumpers and one automatically moving ball.
- Earn only **$1–$5 per ordinary hit**, plus a little more from upgrades and rail bonuses.
- Buy extra balls using **+ BALL**, starting at $20 and increasing as more balls are active. Six is the maximum.
- One ball is **always available**: when a ball drains, a new one automatically appears.
- After a weak scoring round, there is a small maintenance fee, based in part on the total cost of installed bumpers. If you're losing money, extra balls disappear progressively. At low funds, all extras are removed.
- Your cash **cannot go below $75**. You cannot purchase anything that would breach the protected minimum.
- Selling bumpers refunds part of the purchase price (including part of upgrade investment).

Your game and table configuration save in the browser using `localStorage` under `nexus-pinball-tycoon-v2`. It is a new V2 save, leaving the old V1 save untouched. Clearing site storage deletes this V2 progress.

## Controls

- **A / Left arrow** — left flipper, hold to keep raised.
- **D / Right arrow** — right flipper, hold to keep raised.
- **Space** — buy/drop an additional ball (not necessary to launch the free ball).
- **B** — toggle Build mode.
- **M** — toggle floating menu.
- **F** — request browser fullscreen.
- On touchscreens, use the bottom flipper buttons.
- The floating menu includes sound toggle, workshop reset (with refunds), and round reset.

## Collision physics

Fixed timestep simulation at **240 updates per second**, ball speed capped to 970 board units/second, small incremental flipper angles and circle/capsule collision separation. These reduce tunneling when objects collide. Only Ultra Phase bumpers and the guided rail paths deliberately let balls pass through certain targets.

## Development notes

This is a browser-based HTML/CSS/JavaScript prototype. The target Nexus S06 smartwatch hardware is a **separate embedded port**, not yet programmed.

Future ideas: camera-positioned rails, unlockable table shapes, visual gravity vector editor, drag/drop shop interface, combo missions and more.
