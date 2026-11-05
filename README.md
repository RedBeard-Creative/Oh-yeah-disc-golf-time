# G32 — Pinball Tycoon MEGA

**Build your own pinball machines, experiment with gravity, buy weird bumpers and ball abilities, and gradually earn money.** This version combines the earlier Neon Pinball / Pinball Tycoon iterations into one fullscreen browser game.

## Play

**[Launch the game in StackBlitz](https://stackblitz.com/github/RedBeard-Creative/Oh-yeah-disc-golf-time)**

Click the preview's **open in new tab** icon to remove StackBlitz's editor/sidebar. In the game click **⛶** to ask the browser for fullscreen. The floating **☰** menu contains maps, parts, powers, progress and tools.

The game's complete code is in `index.html`; no server calls are needed to play. It keeps progress in the browser's local storage. The updated game **continues to use the V2 save key** (`nexus-pinball-tycoon-v2`) to load earlier V2 money and parts when compatible.

## Seven maps — MAP01 through MAP07

- **MAP01 Gravity U Deluxe:** continuous guided U-shaped launch (up / over / down), then free pinball play.
- **MAP02 Spiral Madness:** guided spiral launch path.
- **MAP03 Infinity Eight:** guided figure-eight launch path.
- **MAP04 Hourglass:** physical converging barriers and a narrowed passage.
- **MAP05 Orbital Station:** physically calculated inward gravity-well field.
- **MAP06 Twin Tables:** divided field with central opening and two additional flippers.
- **MAP07 Gravity Tower:** two upper barriers and extra upper flippers.

These are all visual/gameplay variations inside the shared table canvas. The U, spiral and figure-eight are deliberately **guided pathways**, not free-body rotating-gravity simulations. Balls on those paths are on a separate upper track layer and do not collide with lower-layer bumpers until they exit the guide. No maps above MAP07 are included.

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
