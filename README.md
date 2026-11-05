# G32 — Neon Pinball Tycoon

Make your own pinball machine and play it in your browser!

## Play in StackBlitz

[**Open Pinball Tycoon**](https://stackblitz.com/github/RedBeard-Creative/Oh-yeah-disc-golf-time)

Open the StackBlitz preview in a separate browser tab for a distraction-free view. Use the **⛶** fullscreen button if desired.

## Build your own table

1. Click **🛠 BUILD** (upper-right) or press **B**. The game pauses while you edit.
2. Choose a bumper in the floating shop:
   - **Classic** — $350, 150 points per hit
   - **Power** — $750, 350 points, stronger bounce
   - **Gold** — $1,500, 800 points
3. The shop closes. **Click or tap a clear location on the pinball table to place it**. The outlined region is the buildable area; a ghost shows valid/invalid placement.
4. Click a placed bumper to select it, then use **Upgrade** or **Sell** in the menu.
5. Click **✓ PLAY** / **DONE BUILDING** or press **B** to resume the game.
6. Earn cash while playing: **7% of your scoring points** become shop cash, in addition to your arcade score.

Each bumper has three levels; upgrading increases its point value. You can place up to **20 custom bumpers**. You start with $1,500 and three permanent starter bumpers. You cannot overlap existing bumpers, prizes, or the flipper area.

**Cash and your table layout save automatically in your browser's localStorage.** Clearing site data may remove the save. New Game resets balls/score but keeps your workshop progress.

## Controls

- **Space** — launch ball from right-hand plunger lane
- **A / Left arrow** — hold left flipper
- **D / Right arrow** — hold right flipper
- **B** — toggle build mode
- **M** — show/hide floating menu
- **F** — request fullscreen
- **N** — nudge (3 per game)
- **P** — pause
- On touch devices, tap the lower sides of the playfield or the FLIP buttons.

Other features: neon bumper physics, five target-bank goals, four bonus prize targets, point multipliers, extra balls, and locally saved high scores.

## Development

This is an HTML/JavaScript Canvas browser prototype, independent of physical smartwatch hardware. The next version can add draggable/movable bumpers, more shop items, factory upgrades and unlockable tables. The previous disc-golf game is still available in Git history.

