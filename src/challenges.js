// The 61 user-approved challenges. Risk It was replaced with Closest Tree Challenge.
const item = (name, text, extra = {}) => ({ name, text, ...extra });
export const categories = [
{ id: 'throw', title: 'Throwing Torture', short: 'THROW', color: '#229cf5', challenges: [
item('Wrong Hand','Use your non-dominant hand for all throws.'),
item('Backwards Run-Up','For every throw, start facing backward, turn around, then throw (only when footing is safe).'),
item('One-Leg Wonder','Balance on one foot for each throw.'),
item('Roller Roulette','Attempt a roller on every full throw; putts may be normal.'),
item('Forehand Frenzy','Forehand only all hole, including putts.'),
item('No Run-Up','All throws are standstill.'),
item('Upside Down','Throw discs upside down all hole.'),
item('Low Ceiling','Try to keep every throw below shoulder height.'),
item('Opposite Stance','Use an unfamiliar stance for all throws.'),
item('Two-Finger Grip','Use a two-finger grip on all throws.'),
item('Tomahawk Trouble','Attempt tomahawk throws throughout the hole; use normal putts where overhead throws would be unsafe.'),
item('Kneeling Throw','Throw from one knee for each throw when safe.'),
item('Underhand Toss','Use an underhand release throughout the hole.'),
item('No Follow-Through','No step-through on any throw; use reduced power and maintain balance.'),
item('Fan Grip Only','Use a fan grip on all throws.'),
item('Forehand Putt','All putts must be forehand.'),
item('Floaty Putt','All putts must be gentle lofting putts.'),
item('Disc Golf Dice','Another player randomly chooses a safe throwing style that you use all hole.'),
item("Opponent's Choice",'Another player picks forehand or backhand for this entire hole.')
]},
{ id: 'disc', title: 'Disc Disaster', short: 'DISC', color: '#a76bfa', challenges: [
item('Putter Only','Only putters may be used this hole.'),
item('Worst Disc','An opponent picks a disc you must use all hole.'),
item('No Favorite','Your favorite disc is banned for this hole and the next one.',{ban:2}),
item('Driver Putt','All putts must use a distance driver.'),
item('Putter Drive','Tee off with a putter.'),
item('Low-Speed Only','Only speed 5 or slower discs all hole.'),
item('No Midranges','Midrange discs are banned this hole.'),
item('Disc Jail','Pick one disc to ban for this hole and the next two holes.',{ban:3}),
item('Three-Disc Bag','Select three discs; use only those all hole.'),
item('Only One Disc','Use the same disc for all throws on this hole.'),
item('Slowest Disc','Use the slowest disc in your bag all hole.'),
item('Fastest Disc','Use the fastest disc in your bag all hole.'),
item('Lightest Disc','Use the lightest disc in your bag all hole.'),
item('Heaviest Disc','Use the heaviest disc in your bag all hole.'),
item('No Drivers','Drivers are banned this hole.'),
item('No Putters','Putters are banned this hole.'),
item('Bag Swap','Swap bags with another willing player for the entire hole.'),
item('One Color Only','Choose one color and use only discs of that color this hole.'),
item('Opponent Controls Bag','An opponent selects every disc you use this hole.')
]},
{ id: 'chaos', title: 'Chaos & Comedy', short: 'CHAOS', color: '#3cd4b0', challenges: [
item('Double Doom','Take two additional complete category + challenge spins on THIS hole.',{effect:'extra2'}),
item('Lucky Escape','You are safe from a new punishment on this spin.',{effect:'escape'}),
item('Revenge Spin','Choose another player to receive an extra spin on THIS hole.',{effect:'target'}),
item('Silent Hole','No talking until the hole ends.'),
item('Commentator','Narrate every throw like a sports announcer.'),
item('Robot Throw','Perform your throwing motions like a robot.'),
item('Victory Dance','Do a victory dance before every putt.'),
item('Doom Streak','Take two additional complete spins for THIS hole.',{effect:'extra2'}),
item('Compliment Curse','Compliment an opponent before each throw.'),
item('Slow Motion','Perform all pre-shot routines in slow motion.'),
item('Doom Dealer','Assign this spin’s punishment to another player: they take an extra spin this hole.',{effect:'target'})
]},
{ id: 'risk', title: 'Risk & Reward', short: 'RISK', color: '#ffad47', challenges: [
item('Basket Bounty','Hit metal on a putt this hole to cancel your next-hole punishment. Fail: two spins next hole.',{effect:'risk'}),
item('Saved by Par','Score par or better to cancel your next-hole punishment. Fail: two spins next hole.',{effect:'risk'}),
item('One Stroke Penalty','Add one stroke to your score for this hole.'),
item('Two-Stroke Doom','Add two strokes to your score for this hole.'),
item('No Mulligans','No rethrows on this hole.'),
item('Closest Tree Challenge','Before holing out, deliberately hit the closest safe, accessible tree to the basket with a disc. If no suitable tree exists, reroll this challenge. Do not aim at people or property.'),
item('Par or Punishment','Make par or better this hole; otherwise take two spins NEXT hole.',{effect:'risk'}),
item('Birdie Bounty','Make birdie this hole to erase one previously earned Wheel-of-Doom stroke penalty. Fail: two spins NEXT hole.',{effect:'risk'}),
item('Double or Nothing','Choose two additional challenge spins on this hole OR add one penalty stroke.',{effect:'choice'}),
item('Closest to Pin','Challenge a player to closest-to-pin off the tee; compare safe legal throws.'),
item('No Layups','Attempt direct putts when there is a safe, clear line.'),
item('Doom Immunity','Earn a credit that cancels one future Wheel-of-Doom punishment.',{effect:'immunity'})
]}
];
export const totalChallenges = categories.reduce((n,c)=>n+c.challenges.length,0);
