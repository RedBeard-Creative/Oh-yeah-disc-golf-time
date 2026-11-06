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

## Real map shapes & wall physics

Each world now has its own **physical outer silhouette**, not just a different background or a hexagonal cabinet. Its visible 2.5D metallic wall follows the same line segments used by ball collision physics.

| Map | Real playfield shape |
| --- | --- |
| MAP01 Neon Foundry | Wide classic bowl with sloping shoulders and bottom drain |
| MAP02 Summer Sky | Offset snail/wave outline with alternating left and right notches |
| MAP03 Twilight Fair | Butterfly/twin-loop outline, broader chambers with a waist |
| MAP04 Desert Circuit | Pronounced hourglass silhouette narrowing in the center |
| MAP05 Nebula Orbit | Rounded stadium / orbital arena with a tapering lower bowl |
| MAP06 Cyber District | Double-tower silhouette, central upper notch and split playfield |
| MAP07 Frostpeak | Stair-step tower outline with multiple shelves and inward cutouts |

The arena outside each silhouette is visibly darkened, and **solid balls collide against that world's actual metal perimeter** instead of the old identical rectangular walls. The low-resolution printed grid is also shape-aware: sockets too close to a wall cannot accept a bumper.

**Existing purchases aren't erased when changing maps.** If a bumper is at a peg that cannot fit within a narrower map, it is temporarily *parked* (inactive on that world), appears faintly in Build mode, and remains owned. Move it to an available peg or switch back to a wider map. The shop tells you how many bumpers are parked.

Guided upper rails still deliberately carry balls above the free-moving playfield. Ghost balls retain their special wall-passing effect.

## Beta Test Lab — $100,000,000 sandbox

Open the floating **☰ menu → Beta Test Lab → 🚀 BETA TEST · $100M**. The game switches to an entirely **separate beta save slot**, while preserving the current normal save.

- Gives you **at least $100,000,000** of in-game cash.
- Permanently unlocks all seven worlds **within beta**.
- Unlocks all eight powered machines and raises research to at least Level 6.
- All 17 bumper types, eight ball types, and nine rail types remain available in their shops, so you can arrange them however you like. Rails and bumpers are **not automatically installed**; that would clutter and overlap your custom designs.
- Use **↩ NORMAL SAVE** to return to your untouched regular game. Your beta layout stays saved separately for next time.
- Beta mode is automatically restored after a reload if you left the browser while testing.
- Clicking **Reset All Progress while in Beta** resets only the beta sandbox and returns to the normal save. Normal Reset All Progress still works normally when you are in the normal slot.

Data keys: normal `nexus-pinball-tycoon-v2`, beta `nexus-pinball-tycoon-v2-beta-sandbox`, active save selector `nexus-pinball-tycoon-v2-active-slot`. There is no online account sync—saves are local to the browser.

## Reset your progress

Open the floating **☰ menu**, scroll to **Save management**, then click **🗑 RESET ALL PROGRESS**. A browser confirmation warns that this is permanent.

Reset erases **cash, score and high score, map unlocks, purchased bumpers, rails, machines, research, prestige, contracts, efficiency data, and all three blueprints**. It returns the current browser save to MAP01, **$280**, one basic steel ball, and no upgrades.

This is different from **Reset Round** (restarts the moving balls) and **Reset Build** (sells equipment for partial refunds). Reset writes to the active save slot immediately, so the fresh start persists after reload. If Beta is active, its separate sandbox is reset and you return to normal without deleting your normal save. Other historical game versions' separate save keys are not changed.

## Bumper types (17)

| Type | Reference price | Behavior |
| --- | ---: | --- |
| Basic | $120 | Large ordinary bumper; **first copy $60**, earns at least $2 per hit |
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

### Independent escalating bumper prices

**The first copy of every bumper type costs 50% of its old reference price.** Buying more copies of that *specific type* increases only its own next-copy price by roughly 35% each time (up to a cap of 4× its reference price). For example:

| Copies already owned | Next Basic | Next Power |
| --- | ---: | ---: |
| 0 | $60 | $140 |
| 1 | $81 | $189 |
| 2 | $109 | $255 |
| 3 | $148 | $344 |

Buying a Basic never increases the Power price. Selling one reduces only that type's future price; you can't profit by repeatedly buying and refunding because **refunds are based on the original amount actually paid**. Old saves with pre-update bumpers are treated as having paid their historical reference prices. Upgrades scale from the item's paid price, and blueprint swaps correctly calculate the cost of every copy separately.

**Earnings are approximately 35% higher on ordinary positive bumper-hit payouts, rounded up to whole dollars**, so early small hits feel more useful. Maintenance, the six-ball cap and the protected $75 minimum remain.

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
- Earn small but faster payouts from bumper hits (35% bonus, rounded up). Weak rounds still charge maintenance and may remove extra balls.
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

The suite has **203 passing checks** at the time of this update. They cover all seven differently shaped physical wall outlines and collision bounces, the full progress reset and reload, $100M beta sandbox switching and normal-save protection, type-specific escalating bumper pricing and refunds, earnings bonuses, map unlocks and migration, seasonal gradients, raised rails, all 17 bumper types, eight ball choices, eight machines, nine rail locations including a custom rail, scoring, flippers, respawning, cash protections, blueprints, saves, and long-running simulations.

Important limitation: the suite runs browser-style UI and Canvas mocks, not an actual visible Chrome/StackBlitz session, so it does **not** guarantee pixel-perfect visuals or real-device performance. Open the game in a new browser tab for the visual and feel test.

### Collision fix

Solid bumpers now **always resolve their physical collision even during their scoring cooldown**. A cooldown may suppress repeated score awards, but no longer makes the bumper temporarily non-solid. The Ultra Phase target is intentionally pass-through.

