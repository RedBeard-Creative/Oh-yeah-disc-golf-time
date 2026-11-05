# G32 — Pinball Tycoon MEGA

**Build your own pinball machines, experiment with gravity, buy weird bumpers and ball abilities, and gradually earn money.** This version combines the earlier Neon Pinball / Pinball Tycoon iterations into one fullscreen browser game.

## Play

**[Launch the game in StackBlitz](https://stackblitz.com/github/RedBeard-Creative/Oh-yeah-disc-golf-time)**

Click the preview's **open in new tab** icon to remove StackBlitz's editor/sidebar. In the game click **⛶** to ask the browser for fullscreen. The floating **☰** menu contains maps, parts, powers, progress and tools.

The game's complete code is in `index.html`; no server calls are needed to play. It keeps progress in the browser's local storage. The updated game **continues to use the V2 save key** (`nexus-pinball-tycoon-v2`) to load earlier V2 money and parts when compatible.

## Seven maps, unlocks, and environment art

You begin with **MAP01** unlocked. The others can be purchased one at a time from the **World Map** section of the floating menu. Clicking a locked map attempts to buy it; if there is not enough money (including the $75 protected minimum), it stays locked and displays the shortfall. Unlocks are permanent and are saved automatically.

| Map | Theme / background | Unlock cost | Gameplay |
| --- | --- | ---: | --- |
| MAP01 — Gravity U Deluxe | Neon Foundry; subdued gears and steel | **Free, starts unlocked** | Guided U-shaped start and classic flippers |
| MAP02 — Spiral Madness | Summer Sky; faded translucent clouds and soft hills | **$650** | Curving spiral launch path |
| MAP03 — Infinity Eight | Twilight Fair; subdued festival lights | **$1,400** | Figure-eight guided loop |
| MAP04 — Hourglass | Desert Circuit; dusty sand gradients and dunes | **$2,750** | Converging solid walls |
| MAP05 — Orbital Station | Nebula Orbit; soft star field and planet rings | **$4,800** | Real inward gravity-well force |
| MAP06 — Twin Tables | Cyber District; faint skyline and grid reflections | **$7,600** | Divided field and extra upper flippers |
| MAP07 — Gravity Tower | Frostpeak; pale snowy mountains and falling ice specks | **$11,500** | Tiered obstacles and upper flipper platforms |

**The artwork uses layered Canvas gradients, gently transparent landscape shapes and faded atmospheric details**, not bright solid-white line art. In particular, Summer Sky's clouds are translucent filled clusters.

**Raised 2.5D rails** replace floating neon lines. The table edges, MAP01–03 guide tracks, Hourglass walls, Twin Tables dividers, Gravity Tower platforms, and every purchased rail have dark lower shadows, metallic sidewalls, beveled highlights, recessed riding channels, and raised entry/exit rings. This is simulated depth drawn in 2D Canvas—not a WebGL 3D world.

The U, Spiral, and Infinity Eight starts are deliberately **guided paths**, not free-body rotating gravity. Balls riding those elevated rails are intentionally on a guided layer until exiting into the main physics playfield; the other maps have their own collision walls or gravity effects. No maps above MAP07 are included.

New saves start in MAP01. Existing V2 saves retain money and equipment where compatible. A world that was active in an older save is preserved as unlocked; previously selected worlds cannot be obtained for free by loading an old blueprint.

## Bumper types (17)

| Type | Shop cost | Behavior |
| --- | ---: | --- |
| Basic | $120 | Large ordinary bumper; +$1 per hit |
| Power | $280 | Strong bounce |
| Grab & Roll | $650 | Captures briefly then ejects sideways |
| Ultra Phase | $1,050 | Tiny pass-through scoring target |
| Ball Spawner | $1,600 | Spawns extra balls (six-ball max and cooldown) |
| Magnet | $450 | Attracts nearby balls |
| Teleport | $1,800 | Paired teleport bumpers transfer balls |
| Splitter | $2,500 | Occasionally duplicates a ball |
| Rotator | $550 | Moves in a circular orbit around its mounted socket |
| Freeze | $700 | Slows a ball |
| Multiplier | $1,200 | 2× income for six seconds |
| Shockwave | $900 | Pushes nearby balls outward |
| Chain Lightning | $2,000 | Triggers scoring at nearby bumpers |
| Conveyor | $650 | Briefly captures, shifts then ejects sideways |
| Growing | $900 | Increases its physical collision radius after hits, then resets |
| Combo | $1,500 | Awards a bonus for quick repeated hits |
| Gravity Well | $2,200 | Local attraction field |

All kinds support three upgrade levels (increase their point and/or money rewards). Placement uses evenly spaced sockets, with overlap checks including the rotating bumper's sweep area.

## Ball types (8)

**Steel**, **Fire** (quick-hit combo earnings), **Ice** (slower), **Heavy** (larger and faster gravity), **Plasma** (nearby special activation bonus), **Superball** (higher restitution), **Ghost** (wraps past the left/right boundary and skips triangular guides), and **Golden** (bonus income on hits).

Select a ball in the Ball Lab. Paid balls use that selection. The always-available free replacement ball is Steel.

## Rail types (9)

Left, Right, Top Loop, Bottom Rescue, Spiral, Cross-Map, Underground, Split, and **Custom Rail**. Every purchased rail has a visible entrance, a guided route, four pass-through scoring markers, a jackpot endpoint, and an exit. The Split Rail uses the diverter setting to vary its path and payout.

For a Custom Rail, choose its shop button in Build mode and click two pegs to set the entrance and exit. Build costs and the protected $75 cash minimum still apply.

## Eight machines and hotkeys

| Key | Machine | Effect |
| --- | --- | --- |
| 1 | Gravity Switch | Reverse downward gravity briefly |
| 2 | Rail Diverter | Switch the split-rail path |
| 3 | Magnet Pulse | Pull balls toward the center temporarily |
| 4 | Emergency Flipper | Add upper flippers and give a recovery push |
| 5 | Jackpot Button | Claim a prize after sufficient bumper hits |
| 6 | Multiball Trigger | Spawn bonus balls after charging it with hits |
| 7 | Speed Gate | Accelerate balls through a central area, plus manual boost |
| 8 | Ball Elevator | Guide a low ball to the upper field |

Click a machine to purchase it, then press its number to activate it. Some owned machines also have passive effects. Active ones have cooldowns.

## Mouse & building controls

- **B** toggles Build/Play. Build pauses the pinball balls.
- **Drag a bumper from the shop** onto a table peg, or select one and click an empty peg.
- **Drag an owned bumper** to move it onto another valid peg.
- **Right-click a bumper** to Upgrade / Move / Sell / Info.
- **Mouse wheel** zooms the table during Build mode.
- **Middle mouse drag** pans it.
- **Shift-click** selects several bumpers; use batch Upgrade or Sell in the menu.
- **Brush** places multiple selected bumpers while dragging across pegs (each purchased separately).
- **Trajectory preview** draws an approximate launch curve while hovering; it is not a predictive physics simulator.
- **A / D** or **left/right arrows** hold the flippers; **Space** buys an extra ball.
- Touch users get dedicated flipper buttons.
- **M** toggles the menu, **F** fullscreen.

### Economy and progression

- Start with $280 and a Steel ball. Free balls automatically respawn on draining.
- Earn small amounts from bumper hits. Weak rounds charge maintenance, sometimes taking away extra balls.
- Extra balls can be purchased; the count is capped at six. The balance has a firm **$75 floor**.
- **Contracts** award a one-time cash bonus when the stated hit/rail target is met.
- **Research** buys levels that give occasional bonus cash.
- **Table Value** reports total investment.
- **Efficiency** identifies the highest-earning bumper types.
- **Blueprints** provide three slots. Switching layout sells existing equipment at partial refunds and repurchases the new layout; there is no free duplication.
- **Prestige** is available after 50,000 score, three contracts and $5,000 cash. It resets the current workshop for a permanent earning bonus.

## QA notes

The merged game passed JavaScript parsing and interaction/simulation checks covering all seven map selections, shop generation, buying all 17 bumper types, selecting all eight ball types, unlocking eight machines, rail purchases including the two-socket custom rail, render execution, research, blueprints, and saved-data reloads. **These are scripted simulation checks, not an exhaustive hands-on graphical browser playtest.** Feedback from actual play is welcome, especially about balance, collision behavior and the map paths.

Collision handling uses a fixed **240 Hz simulation step**, bounded ball speeds, continuous small-step flipper rotation and separation for solid circles/capsules. Deliberately non-solid interactions include Phase bumpers and elevated guided rail/loop paths.

## Next improvements

- A true 2D gravity-vector editor for bespoke maps, rather than guide-only loops.
- More realistic split-table geometry and distinct map-specific art.
- A genuine predictive trajectory preview that accounts for built equipment.
- Optimization for the Waveshare S06 smartwatch after the browser version is stable. This is **not yet running on watch hardware**.
## Automated regression tests

Run the no-dependency smoke suite from the repository root:

```bash
node tests/smoke.cjs
```

The suite has **122 passing checks** at the time of this update. They cover all seven map selections, map unlock purchases and save migration, distinct background gradients, raised rail drawing, all 17 bumper types, all eight ball choices, eight purchasable machines, nine rail locations including a custom rail, bumper scoring/rebounding, flipper motion, automatic ball respawning, the protected cash floor, blueprints, saved data, and long-running finite ball positions on each map.

Important limitation: the suite runs browser-style UI and Canvas mocks, not an actual visible Chrome/StackBlitz session, so it does **not** guarantee pixel-perfect visuals or real-device performance. Open the game in a new browser tab for the visual and feel test.

### Collision fix

Solid bumpers now **always resolve their physical collision even during their scoring cooldown**. A cooldown may suppress repeated score awards, but no longer makes the bumper temporarily non-solid. The Ultra Phase target is intentionally pass-through.

