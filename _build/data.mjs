export const PHONE = '765-592-5970';
export const TEL = 'tel:+17655925970';
export const SMS = 'sms:+17655925970';
export const FB = 'https://www.facebook.com/people/Aerial-Hunter/61583336984487/';

export const counties = [
  { id: 'parke', name: 'Parke', seat: 'Rockville', home: true, note: 'Home county. Rockville, Montezuma, Marshall, Rosedale, Bloomingdale, Mecca, Bridgeton and the country roads between.' },
  { id: 'vermillion', name: 'Vermillion', seat: 'Newport', note: 'West across the Wabash, from Clinton up to Cayuga.' },
  { id: 'fountain', name: 'Fountain', seat: 'Covington', note: 'North of Parke, along the Wabash and Coal Creek.' },
  { id: 'montgomery', name: 'Montgomery', seat: 'Crawfordsville', note: 'Northeast, including the Sugar Creek country around Shades.' },
  { id: 'putnam', name: 'Putnam', seat: 'Greencastle', note: 'East, from Big Walnut Creek to the Cagles Mill area.' },
  { id: 'clay', name: 'Clay', seat: 'Brazil', note: 'Southeast, around Brazil and Center Point.' },
  { id: 'vigo', name: 'Vigo', seat: 'Terre Haute', note: 'South, Terre Haute and the farm ground around it.' }
];

const deerTL = [
  ['Phase 01', 'First call', 'Tell us when and where you shot, what you saw, and the last direction the deer went. We tell you honestly whether a flight is likely to help.'],
  ['Phase 02', 'Meet up', 'We meet you where you shot from. You walk us through the sign; we check airspace, wind and weather.'],
  ['Phase 03', 'Launch', 'The Matrice 4T goes up above the tree line. The search starts from the last sign and works outward.'],
  ['Phase 04', 'Sweep', 'A methodical grid over timber, fencerows, standing crops and creek bottoms, watching for a warm shape on cool ground.'],
  ['Phase 05', 'Confirm', 'A heat signature is checked on the zoom camera and marked, with a distance from the laser rangefinder.'],
  ['Phase 06', 'Walk-in', 'We guide you straight to the deer. You tag and recover it on ground you have permission to enter.']
];
const petTL = [
  ['Phase 01', 'First call', 'Describe your pet, where and when it was last seen, and how it behaves around strangers. Have a recent photo ready.'],
  ['Phase 02', 'Plan', 'We talk through the likely places: fencerows, creek banks, outbuildings, the field edges near home.'],
  ['Phase 03', 'Launch', 'The drone flies high and quiet so it doesn’t push a frightened animal further away.'],
  ['Phase 04', 'Sweep', 'Thermal passes over open ground and woods edges, where a warm body stands out against cool grass.'],
  ['Phase 05', 'Confirm', 'Any heat signature is checked on the zoom camera before anyone moves, so you don’t chase a deer or a raccoon.'],
  ['Phase 06', 'Reunite', 'We talk you in quietly. You make the approach, low and calm, and let your pet come to you.']
];
const herdTL = [
  ['Phase 01', 'First call', 'Tell us about the ground: rough acreage, what is on it, and what you want to know or see.'],
  ['Phase 02', 'Plan', 'We agree on boundaries and timing. Thermal headcounts work best when the air is cool, early or after dark.'],
  ['Phase 03', 'Flight', 'Photo, video and thermal passes over pasture, timber and water, flown in a set pattern so nothing is counted twice.'],
  ['Phase 04', 'Review', 'We go through the footage for counts, strays, fence breaks, washouts and anything else worth a look.'],
  ['Phase 05', 'Deliver', 'You get what you asked for: the count, the photos and video, and notes on anything that needs attention.']
];

export const services = [
  {
    slug: 'deer-recovery', n: '01', name: 'Deer Recovery', short: 'Deer recovery', cls: 'svc-deer',
    hero: 'thermal-deer', alt: 'Thermal drone view of a bedded deer glowing white beside a fallen log',
    kicker: 'Thermal drone deer recovery',
    title: 'Find the deer the blood trail lost.',
    lede: 'When a deer runs after the shot and the sign runs out, a thermal drone can sweep timber, standing corn and creek bottoms from above, where a blood trail can’t lead you.',
    meta: [['For', 'Lost and injured deer'], ['When', 'Night and low light'], ['Ground', 'Fields, woods, hills, creek bottoms'], ['Pricing', '$250 up to 2 hours']],
    focus: 'Every hunter has lost one. The sign dries up, the light goes, the cover gets thick. On a thermal camera a deer that is still warm stands out against cooler ground, even under leafless timber after dark. We fly the area methodically, confirm what we find, and guide you to it. You make the recovery. We do the looking.',
    zoom: 'Found.',
    chapters: [
      ['The call', 'Call as soon as you know you need help. We ask when and where you shot, what you saw, the last direction of travel, and whose land the deer may have crossed onto.', 'pilot-dusk'],
      ['Arrival', 'We meet you where you shot from. You show us the sign; we check the airspace, the wind and the weather, and plan a search pattern from the last good blood.', 'dusk-drone'],
      ['The thermal sweep', 'The Matrice 4T flies a grid outward from the last sign. Body heat shows white against cool leaves and soil, through leafless timber, fencerows and the edges of standing crops.', 'thermal-deer'],
      ['The find', 'When a heat signature turns up, we check it on the zoom camera, mark it, and take a distance with the laser rangefinder, so nobody walks out to a raccoon.', 'hud'],
      ['Recovery', 'We talk you in to the deer. You tag and recover it yourself, on land you have permission to enter, under Indiana DNR rules.', 'recovery-real']
    ],
    tl: deerTL,
    tlTitle: 'From the shot to the truck bed.',
    now: [
      ['Note the time', 'Write down when you shot. How long ago it was shapes how we plan the search.'],
      ['Mark two spots', 'Where you shot from, and where you last saw or heard the deer. A pin on your phone map is perfect.'],
      ['Back out quietly', 'Don’t push a wounded deer. Pressure can move it further, into thicker cover or across a property line.'],
      ['Line up permission', 'If the deer may have crossed onto a neighbor’s ground, ask them now. We can’t recover on land without it.'],
      ['Keep the area clear', 'People and dogs show up on thermal too. The fewer warm bodies wandering the woods, the cleaner the search.']
    ],
    limits: ['Dense evergreens, cedar thickets and full leaf canopy can hide a heat signature.', 'Rain, fog and strong wind can ground a flight.', 'As a downed deer cools, it gets harder to pick out. The sooner we search, the better.'],
    other: ['lost-pet-recovery', 'herd-land-surveying']
  },
  {
    slug: 'lost-pet-recovery', n: '02', name: 'Lost Pet Recovery', short: 'Lost pet recovery', cls: 'svc-pet',
    hero: 'thermal-dog', alt: 'Thermal drone view of a dog standing in tall grass near a fencerow',
    kicker: 'Thermal search for lost pets',
    title: 'Bring them home, even after dark.',
    lede: 'A frightened dog in a fencerow, or a cat out in a hayfield, is hard to spot from the road. From above, a warm body in cool grass is a lot easier to pick out.',
    meta: [['For', 'Dogs, cats, horses, livestock'], ['When', 'Night and early morning'], ['Ground', 'Fields, woods, creek banks'], ['Pricing', '$150 per hour']],
    focus: 'Lost pets don’t behave like they do at home. Scared dogs go quiet and hide; cats tuck into cover and wait. A thermal drone can check fields, fencerows and woods edges quickly and quietly, without anyone crashing through the brush. When we see a warm shape, we confirm it on the zoom camera, then help you make a calm approach.',
    zoom: 'Home.',
    chapters: [
      ['The call', 'Tell us what your pet looks like, where and when it was last seen, and how it acts around strangers. A recent photo helps us confirm a sighting.', 'pilot-dusk'],
      ['Arrival', 'We start from the last-seen spot and the routes animals tend to follow: creek banks, fencerows, tree lines and field edges.', 'woods-dusk'],
      ['The thermal sweep', 'The drone stays high and quiet so it doesn’t spook a nervous animal. Thermal works best in the cool of night and early morning.', 'thermal-dog'],
      ['The find', 'Every heat signature is checked on the zoom camera first. Deer, coyotes and raccoons are warm too, so we make sure before anyone moves.', 'hud'],
      ['Reunion', 'We guide you in quietly. Don’t call or chase: get low, stay calm and let your pet come to you.', 'dusk-drone']
    ],
    tl: petTL,
    tlTitle: 'From the first call to the front porch.',
    now: [
      ['Leave a scent trail', 'Put a worn shirt, bedding or their crate outside, where they were last seen or at home.'],
      ['Check close to home', 'Garages, barns, crawl spaces and under porches. Frightened pets often hide nearby.'],
      ['Tell the neighbors', 'Post on local lost-pet pages and let nearby farms know. Ask them to call you, not chase.'],
      ['Get a photo ready', 'A clear recent photo helps us confirm it’s your pet on the zoom camera.'],
      ['Don’t chase', 'If you spot them, sit down and stay quiet. Chasing can send a scared animal running.']
    ],
    limits: ['Thermal can’t see through roofs, barns, culverts or thick brush. A hiding cat may be out of view.', 'Warm days wash out contrast. Night and early morning work best.', 'Rain, fog and strong wind can ground a flight.'],
    other: ['deer-recovery', 'herd-land-surveying']
  },
  {
    slug: 'herd-land-surveying', n: '03', name: 'Herd & Land Surveying', short: 'Herd & land surveying', cls: 'svc-herd',
    hero: 'cattle-aerial', alt: 'Aerial view of a herd of beef cattle in a pasture beside a creek',
    kicker: 'Herd counts and aerial land checks',
    title: 'Count the herd. See the whole farm.',
    lede: 'Count cattle across back pasture, look for strays, check fence lines after a storm, or get a clear aerial view of your ground, without driving every acre.',
    meta: [['For', 'Farms, landowners, hunting ground'], ['When', 'Day or night'], ['Ground', 'Pasture, timber, ponds, fence lines'], ['Pricing', 'Call for more information']],
    focus: 'Some questions are easier to answer from 300 feet up. How many head are in the back eighty? Where did that fence go down? Did the creek take part of the bank? We fly a set pattern over your ground, with regular and thermal cameras, and hand you the answers along with the photos and video.',
    zoom: 'Count.',
    chapters: [
      ['The call', 'Tell us roughly how many acres, what is on the ground, and what you need: a count, a fence check, a stray search or just good aerial footage.', 'pilot-dusk'],
      ['The plan', 'We agree on boundaries and timing. Thermal headcounts work best in cool air, early in the morning or after dark, when animals stand out clearly.', 'land-ortho'],
      ['The flight', 'Photo, video and thermal passes over pasture, timber and water, flown in a set pattern so nothing gets counted twice.', 'thermal-herd'],
      ['The review', 'We go through the footage for counts, strays, fence breaks, washouts and anything else worth a closer look.', 'hud'],
      ['Delivery', 'You get what you asked for: headcounts, photos and video, and notes on anything that needs attention.', 'cattle-aerial']
    ],
    tl: herdTL,
    tlTitle: 'From the first call to the finished count.',
    now: [
      ['Know your boundaries', 'A rough map or the corners of the ground you want flown. A screenshot from your phone’s map is fine.'],
      ['Say what you need', 'A headcount, a stray search, fence lines, ponds and drainage, or photos and video.'],
      ['Pick a time', 'Thermal counts work best early or after dark. Photos and video look best in daylight.'],
      ['Tell the neighbors', 'If the flight runs close to a property line, a quick heads-up keeps everyone comfortable.']
    ],
    limits: ['This isn’t a licensed land survey. For legal boundaries, hire a licensed surveyor.', 'Heavy timber canopy can hide animals underneath.', 'Rain, fog and strong wind can ground a flight.'],
    deliver: ['Herd headcounts', 'Stray searches', 'Fence line checks', 'Pond & drainage views', 'Aerial photos', 'Aerial video', 'Thermal night counts'],
    other: ['deer-recovery', 'lost-pet-recovery']
  }
];

export const faqs = [
  ['deer', 'Is it legal to use a drone to find a deer in Indiana?', 'Yes, to recover one. Indiana law (IC 14-22-6-16) lets a person fly a drone with infrared to locate and recover a legally taken animal. What’s not allowed is using a drone to scout, locate or detect game as an aid to taking it, from 14 days before the season through the end of legal hunting hours on its last day. The law also doesn’t let anyone enter or recover on someone else’s land without the landowner’s permission. Rules change, so check the current Indiana DNR regulations each season.', ['Indiana DNR: deer hunting equipment', 'https://www.in.gov/dnr/fish-and-wildlife/hunting-and-trapping/deer-hunting/deer-hunting-equipment']],
  ['deer', 'How soon should I call?', 'As soon as you know you might need help, even if you plan to wait before searching. We can talk through timing on the phone. Thermal works on temperature difference, so a deer is easiest to pick out while it is still warmer than its surroundings, and that contrast fades over time.'],
  ['deer', 'Do I need landowner permission?', 'Yes. We need permission to recover a deer on any property, and the hunter does too. If the deer may have crossed onto a neighbor’s ground, ask them before we arrive. It saves a lot of time.'],
  ['deer', 'Can thermal see through the trees?', 'Not through solid cover. Leafless hardwoods let a lot of heat through the gaps, which is why late season and night searches work well. Dense evergreens, cedar thickets and full summer canopy can hide an animal completely.'],
  ['pet', 'Can you find my cat or dog?', 'Often, if they are out in the open: fields, fencerows, woods edges and creek banks. Thermal can’t see through roofs, barns, culverts or thick brush, so a pet hiding under something may be out of view. We’ll tell you honestly what we think the odds are when you call.'],
  ['pet', 'Will the drone scare my pet?', 'We fly high and keep the drone quiet over the animal. Once we find them, we guide you in on foot and you do the approach.'],
  ['survey', 'Is this a legal land survey?', 'No. “Land surveying” here means aerial views, headcounts and checks of your ground. For legal property boundaries, use a licensed land surveyor.'],
  ['survey', 'Can you count cattle at night?', 'Yes. Thermal headcounts work best in cool air, early in the morning or after dark, when animals show up clearly against the ground.'],
  ['drone', 'What does “Part 107 certified” mean?', 'Part 107 is the FAA’s rulebook for commercial drone flights. A certified remote pilot has passed the FAA knowledge test and keeps current with recurrent training. Flying at night also requires that training plus anti-collision lighting on the drone.'],
  ['drone', 'What weather can you fly in?', 'Not in rain, heavy fog or strong wind. Cool, still, dry nights give the best thermal picture. If the weather is against a good search, we’ll tell you straight.'],
  ['drone', 'What drone do you use?', 'A DJI Matrice 4T, an enterprise drone built for search work. It carries a 640 × 512 thermal camera, zoom cameras, a laser rangefinder and a near-infrared auxiliary light. See the gear page for more.'],
  ['price', 'How much does a search cost?', 'Deer Recovery is $250 for up to 2 hours, plus $100 per hour for each additional hour, a $50 finder’s fee (dead or alive), and a $1 per mile travel fee after 50 miles from Rockville. Lost Pet Recovery is $150 per hour, with the same $1 per mile travel fee after 50 miles from Rockville. Herd & Land Surveying depends on the job; call for more information.'],
  ['price', 'What areas do you cover?', 'Parke County and the surrounding counties: Vermillion, Fountain, Montgomery, Putnam, Clay and Vigo. Further out? Call and ask.']
];
export const faqCats = [['all', 'All'], ['deer', 'Deer'], ['pet', 'Pets'], ['survey', 'Surveying'], ['drone', 'Drone & rules'], ['price', 'Pricing & area']];
