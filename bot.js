/* =========================================================
   Barney's crew bot — answers from the race plan. No internet needed
   once the page has loaded. Reads the fuel log via window.FUEL.
========================================================= */
(function () {
  const FUEL = window.FUEL;
  const maps = q => `https://www.google.com/maps/search/?api=1&query=${q}`;

  /* ---------- the plan ---------- */
  const STOPS = [
    { id: 'start', name: 'Start', place: 'Gardens Rugby Club', km: 0, t19: '04:00', t24: '04:00', cut: null, ll: '-33.94455,18.41444',
      hand: ['Flask 1 · OpenFuel (front)', 'Flask 2 · Revive (front)', 'Flask 3 · OpenFuel (pack)', 'Flask 4 · Revive (pack)', 'Headlamp ON, spare battery in the pack', 'Bib on the front, mandatory kit checked'],
      table: [], food: ['1 bar', '1 waffle', '1 Salted Maple gel'], sachets: ['1 OpenFuel', '1 Revive'],
      cue: 'He runs straight through Signal Hill. Next time we see him is Kloof Nek, about three hours away. Calm and underdressed. No caffeine.',
      mood: 'Nervous. Pretends he isn’t. Four toilet trips, minimum.',
      leg: 'Road out of Gardens, round Lion’s Head and Signal Hill, then contour trail to Kloof Nek. Starts dark, sunrise 05:32.' },
    { id: 'kn', name: 'Kloof Nek', place: 'Kloof Nek roundabout, foot of Tafelberg Rd', km: 20.5, t19: '06:52', t24: '07:33', cut: '08:00', ll: '-33.9431736,18.3958429',
      hand: ['Swap all 4 flasks for full ones', 'Headlamp off him, into the pack', 'Wind jacket within reach · sunscreen'],
      table: ['Half a waffle if he’s peckish'], food: ['2 bars', '1 waffle', '1 Salted Maple gel'], sachets: ['2 OpenFuel', '1 Revive'],
      cue: 'Cut-off 08:00. In and out. No crew for 4–5 hours, so he leaves fully loaded. This is not the place for a chat.',
      mood: 'About to find out about Platteklip.',
      leg: 'Straight up Platteklip Gorge (~950 m in 5 km of stairs), across the exposed summit, then over 1,000 m of technical descent to the beach.' },
    { id: 'll', name: 'Llandudno', place: 'Llandudno Primary School', km: 41.7, t19: '10:53', t24: '12:32', cut: null, ll: '-34.00984,18.34572',
      hand: ['Swap all 4 flasks for full ones', 'Ice in the cap / cold water on the neck if hot', 'Sunscreen top-up', 'Feet: ask, don’t look unless he says yes'],
      table: ['Salted baby potatoes (a handful)', 'Sips of cold Coke only if he asks'], food: ['1 bar', '1 waffle', '1 Salted Maple gel'], sachets: ['1 OpenFuel', '1 Revive (+1 if it’s hot)'],
      cue: 'He’s just done a kilometre of downhill. Hottest, most exposed leg next. Revive and salt. Ahead? He cruises. Behind? He eats more. Either way, calm.',
      mood: 'Quads have left the chat. Will stand like a newborn giraffe and say he’s fine.',
      leg: 'Coast, then up and over Suther Peak and the Karbonkelberg traverse. Remote, no signal, little shade.' },
    { id: 'hb', name: 'Hout Bay', place: 'Hout Bay beach · official drop bag', km: 57.8, t19: '13:51', t24: '16:12', cut: '18:30', ll: '-34.0453617,18.3598543',
      hand: ['Swap all 4 flasks for full ones', 'Chair: 5 minutes maximum', 'Socks, shirt if soaked, lube, tape hotspots', 'Headlamp + spare battery + warm layer INTO the pack'],
      table: ['Proper meal: Kauai PB Bomb smoothie + 2-min noodles, in a cup he can walk out with', 'First Chocolate gel'], food: ['2 Chocolate gels', '1 bar', '1 waffle'], sachets: ['2 OpenFuel', '1 Revive'],
      cue: 'The pivot. From here: ahead + feeling good + runnable trail = “Okay dude, let’s go. Let it run.” Otherwise steady.',
      mood: 'Past halfway in distance, all the way through his patience.',
      leg: 'The long one: beach, East Fort, the old manganese mine, then over the mountain (~930 m up in 14 km). Vineyards to SARDA.' },
    { id: 'sa', name: 'SARDA', place: '71 Brommersvlei Rd, Constantia', km: 77, t19: '17:47', t24: '21:11', cut: '23:00', ll: '-34.01344,18.45107',
      hand: ['Swap all 4 flasks for full ones', 'HEADLAMP ON (or in hand if still light)', 'Long-sleeve + buff', 'Gloves in the pack'],
      table: ['Warm salted potatoes', 'Flat Coke'], food: ['2 Chocolate gels', '1 waffle'], sachets: ['1 OpenFuel', '1 Revive'],
      cue: 'Dusk (sunset 19:46). Layers on, light on, food in. Quiet and quick. The night shift starts here.',
      mood: 'Starting to negotiate with himself. He’s losing.',
      leg: 'Greenbelts, then Nursery Ravine and Newlands Forest. Roots and rocks. Dark on a slow day.' },
    { id: 'nw', name: 'Newlands', place: 'Newlands Forest Picnic Site, off the M3', km: 88.3, t19: '20:14', t24: '00:34', cut: '03:00', ll: '-33.9656806,18.4536606',
      hand: ['Swap all 4 flasks for full ones', 'Fresh headlamp battery, whether he thinks he needs it or not', 'Dry buff + gloves', 'Jelly sweets in a pocket'],
      table: ['Flat Coke or warm broth'], food: ['2 Chocolate gels', '1 waffle'], sachets: ['1 OpenFuel', '1 Revive'],
      cue: 'His lowest point. Short, warm, relentless. Calm voices. Caffeine and Coke handle the sleepies. Nobody says “only 11 km”.',
      mood: 'Will try to sell you on quitting. Do not buy.',
      leg: 'Contour path past Dead Man’s Tree, then down to Gardens. Dark. Eleven km that takes 2½–3½ hours.' },
    { id: 'fi', name: 'Finish', place: 'Gardens Rugby Club', km: 99.2, t19: '23:00', t24: '04:00', cut: '06:00', ll: '-33.94455,18.41444',
      hand: ['Dry, warm clothes and a beanie', 'Recovery drink + Coke', 'A chair. Finally.', 'A cold beer (Ally’s department)', 'A hug he didn’t ask for'],
      table: [], food: [], sachets: [],
      cue: 'Mission complete. He’ll go from “I’m fine” to “can’t feel my legs” in 90 seconds. Warm kit ready before he crosses the line.',
      mood: 'Will say “never again”. Will sign up again by Tuesday.', leg: '' }
  ];
  const HOURLY = {
    kn: ['Hr 1: OpenFuel flask 1 + waffle', 'Hr 2: OpenFuel flask 2 + bar', 'Signal Hill: refill an empty, add the OpenFuel sachet', 'Hr 3: that OpenFuel + Salted Maple gel'],
    ll: ['Hr 1 (Platteklip): OpenFuel flask 1 + bar, chewed slowly', 'Hr 2 (on top): OpenFuel flask 2 + bar', 'Table Mountain: refill + OpenFuel sachet', 'Hr 3: OpenFuel + waffle', 'Hr 4 (descent): OpenFuel sachet 2 + Salted Maple gel'],
    hb: ['At the Llandudno table: salted potatoes', 'Hr 1: OpenFuel flask 1 + bar', 'Hr 2: OpenFuel flask 2 + waffle, lots of Revive (hot)', 'Rocket Road: refill + OpenFuel sachet', 'Hr 3: OpenFuel + Salted Maple gel'],
    sa: ['At the Hout Bay table: smoothie + noodles', 'Hr 1: OpenFuel flask 1 + Chocolate gel ☕', 'Hr 2 (the climb): OpenFuel flask 2 + bar', 'Constantia Glen: refill + OpenFuel sachet', 'Hr 3: OpenFuel + waffle', 'Hr 4: OpenFuel sachet 2 + Chocolate gel ☕'],
    nw: ['At the SARDA table: warm potatoes + flat Coke', 'Hr 1: OpenFuel flask 1 + waffle', 'Hr 2: OpenFuel flask 2 + Chocolate gel ☕', 'Last 30 min: OpenFuel sachet + Chocolate gel ☕'],
    fi: ['At the Newlands table: Coke or broth', 'Hr 1: OpenFuel flask 1 + Chocolate gel ☕', 'Hr 2: OpenFuel flask 2 + waffle', 'Hr 3: OpenFuel sachet + Chocolate gel ☕. Last one.']
  };

  /* ---------- helpers ---------- */
  const mins = t => { const [h, m] = t.split(':').map(Number); let v = h * 60 + m; if (h < 4) v += 1440; return v; };
  const clock = v => { v = ((Math.round(v) % 1440) + 1440) % 1440; return String(Math.floor(v / 60)).padStart(2, '0') + ':' + String(v % 60).padStart(2, '0'); };
  const dur = v => { v = Math.round(v); return Math.floor(v / 60) + 'h' + String(v % 60).padStart(2, '0'); };
  const ul = a => '<ul>' + a.map(x => `<li>${x}</li>`).join('') + '</ul>';
  const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const START_M = 240;

  const ALIAS = [
    ['start', /\b(start|gun|beginning)\b/],
    ['kn', /\b(kloof|kn|kloofnek)\b/],
    ['ll', /\b(llandudno|landudno|llan|lland)\b/],
    ['hb', /\b(hout ?bay|hb|houtbay|halfway)\b/],
    ['sa', /\b(sarda|constantia|alphen)\b/],
    ['nw', /\b(newlands|newland|nw)\b/],
    ['fi', /\b(finish|end|finish line|the line)\b/]
  ];
  function stopIn(q) { for (const [id, re] of ALIAS) if (re.test(q)) return STOPS.find(s => s.id === id); return null; }
  function sig(q) { return /\bsignal\b/.test(q); }

  // live state from the log
  function live() {
    const S = FUEL.state(), L = FUEL.LEGS;
    let lastIdx = -1; L.forEach((l, i) => { if (S.arr[l.id]) lastIdx = i; });
    const next = L[lastIdx + 1] ? STOPS.find(s => s.id === L[lastIdx + 1].id) : null;
    const last = lastIdx >= 0 ? STOPS.find(s => s.id === L[lastIdx].id) : STOPS[0];
    let ratio = null;
    if (lastIdx >= 0) {
      const actual = (S.arr[L[lastIdx].id] - FUEL.START) / 6e4, plan = mins(last.t19) - START_M;
      if (actual > 0 && plan > 0) ratio = actual / plan;
    }
    return { S, lastIdx, last, next, ratio, arrived: lastIdx >= 0 ? S.arr[L[lastIdx].id] : null };
  }
  function eta(stop, lv) {
    if (!lv.ratio) return null;
    return START_M + (mins(stop.t19) - START_M) * lv.ratio;
  }
  function paceLine(lv) {
    if (!lv.ratio || lv.lastIdx < 0) return '';
    const s = lv.last, actual = START_M + (lv.arrived - FUEL.START) / 6e4, d = actual - mins(s.t19);
    if (Math.abs(d) <= 15) return `He hit ${s.name} at ${FUEL.fmtT(lv.arrived)}, bang on the 19 h plan.`;
    if (d < 0) return `He hit ${s.name} at ${FUEL.fmtT(lv.arrived)}, ${dur(-d)} ahead of the 19 h plan.`;
    const d24 = actual - mins(s.t24);
    return `He hit ${s.name} at ${FUEL.fmtT(lv.arrived)}, ${dur(d)} behind the 19 h plan` + (d24 <= 0 ? `, still ${dur(-d24)} ahead of 24 h.` : `, and ${dur(d24)} behind 24 h. Watch the cut-offs.`);
  }
  const nextOr = (q, lv) => stopIn(q) || lv.next || STOPS[1];

  /* ---------- answers ---------- */
  const A = {
    packet(s) {
      if (s.id === 'fi') return `<b>Finish.</b> No packet. Have ready:${ul(s.hand)}${s.cue}`;
      return `<b>${s.name}</b> · km ${s.km}<br><b>Hand over:</b>${ul(s.hand)}` +
        (s.table.length ? `<b>At the table:</b>${ul(s.table)}` : '') +
        `<b>Packet for the next leg:</b>${ul([...s.food, ...s.sachets.map(x => x.replace(/^(\d+) (\S+)(.*)$/, (m, n, w, r) => `${n} ${w} sachet${n > 1 ? 's' : ''}${r}`))])}` +
        `Plus the 4 full flasks (2 OpenFuel, 2 Revive). Running slow? Add 1 OpenFuel sachet and 1 food item${s.km >= 57 ? ', plus a Chocolate gel' : ''}.<br><i>${s.cue}</i>`;
    },
    when(s, lv) {
      let t = `<b>${s.name}</b> · km ${s.km}<br>19 h plan: <b>${s.t19}</b><br>24 h plan: <b>${s.t24}</b><br>Cut-off: <b>${s.cut || 'none'}</b>`;
      const e = eta(s, lv);
      if (e && lv.lastIdx >= 0 && STOPS.indexOf(s) > STOPS.findIndex(x => x.id === lv.last.id))
        t += `<br><br>On his actual pace so far: about <b>${clock(e)}</b>. ${paceLine(lv)}`;
      else if (s.id !== 'start') t += `<br><br>Be there 30 min before the 19 h time: <b>${clock(mins(s.t19) - 30)}</b>.`;
      if (s.cut) { const buf = mins(s.cut) - mins(s.t24); t += `<br>The 24 h plan is ${dur(buf)} inside the cut-off.`; }
      return t;
    },
    where(s) {
      return `<b>${s.name}</b>: ${s.place}.<br><a href="${maps(s.ll)}" target="_blank" rel="noopener">Open in Google Maps ↗</a><br>Crew help only inside 100 m of the station.`;
    },
    status(lv) {
      const o = FUEL.overall();
      if (!o.h) return 'Nothing’s been logged yet. Once you tap “He’s here” at a stop and tick what he ate, I can tell you how he’s doing.';
      const [, say] = FUEL.mood(o.gph);
      return `${paceLine(lv)}<br><br>Fuel so far: <b>${Math.round(o.c)} g carbs</b> in ${dur(o.h * 60)} = <b>${Math.round(o.gph)} g/h</b> (target 75).<br>Sodium ${Math.round(o.naph)} mg/h · caffeine ${Math.round(o.caf)} mg.<br><br><b>${say}</b>` +
        (lv.next ? `<br>Next up: ${lv.next.name}, about ${clock(eta(lv.next, lv))}.` : '');
    },
    eatNow(lv) {
      const l = lv.next || STOPS[1], h = HOURLY[l.id];
      let elapsed = '';
      if (lv.arrived) { const m = (Date.now() - lv.arrived) / 6e4; if (m > 0 && m < 600) elapsed = `He left ${lv.last.name} about ${dur(m)} ago, so he should be on hour ${Math.floor(m / 60) + 1}.<br>`; }
      return `<b>Leg to ${l.name}</b><br>${elapsed}${ul(h)}Rule of thumb: one OpenFuel flask + one food item every hour. Revive to thirst on top.`;
    }
  };

  const INTENTS = [
    { re: /(confus|puffy|swollen|chest|collapse|faint|pass(ed)? out|unconscious|can.?t breathe|bleed|broke|fractur|hypotherm|shiver|head ?(injury|knock)|fell|fall(en)?\b|ambulance|medic|emergency|seizure)/,
      a: () => '<b>Not a crew problem. Get race medical now.</b><br>Confused, puffy hands, chest pain, hard breathing, uncontrollable shivering, a head knock or a bad fall: find the nearest race official or medic, and call the race emergency number on his bib. In a life-threatening emergency call <a href="tel:112">112</a> from a cell phone or <a href="tel:10177">10177</a> for an ambulance. Nobody negotiates on this one.' },
    { re: /(cramp)/, a: () => '<b>Cramping</b><br>Sodium and ease off: Revive + a salty potato or biltong, and a short walk. It’s electrolytes or pace, not weakness. Hand him an extra Revive sachet for the next leg. If it’s locking up and not easing in 10–15 minutes, medic.' },
    { re: /(bonk|dizzy|empty|light.?headed|wobbly|no energy|flat|shaky|hit the wall)/, a: () => '<b>Bonking</b><br>He’s under-fuelled. Fast sugar now: a gel plus flat Coke. Keep him walking, don’t sit him down. About 15 minutes and he’s a person again. Then check the log: if he’s under 60 g/h, he’s been skipping food. Watch him eat the next one.' },
    { re: /(nause|sick|vomit|puk|throw(ing)? up|stomach|gut|can.?t eat|won.?t eat|not eating|sweet|sloshy|bloat)/, a: () => '<b>Stomach trouble · can’t face sweet</b><br>Switch to savoury: broth, salted potato, flat Coke, a bit of waffle. Small sips of the flask, not gulps. Walk him out of the station, don’t force a full meal. It usually passes in 20–30 minutes. If he’s vomiting repeatedly and can’t keep fluid down, that’s a medic.' },
    { re: /(sleep|asleep|drowsy|tired|yawn|eyes clos|nod(ding)? off|zombie)/, a: () => '<b>Falling asleep</b><br>A Chocolate gel (35 mg caffeine), a sip of Coke, cold water on the face, and a few minutes of slightly faster walking. No “closing my eyes for a sec.” If it’s before Hout Bay, it’s not caffeine time yet. It’s food time.' },
    { re: /(quit|dnf|drop out|give up|giving up|done|stop racing|pull out|wants? to stop|can.?t go on|over it)/, a: () => '<b>He wants to quit</b><br>Feed him first. 90% of “I’m done” is low blood sugar. Gel, Coke, walk him 10 minutes out of the station, then ask again. Only a real injury is a reason to stop. Don’t argue, don’t give speeches. Calm voice: “Eat this. Walk with me.” He’ll be grateful tomorrow. He’ll be annoyed tonight. Both fine.' },
    { re: /(blister|feet|foot|toe|hot ?spot|chaf|rub)/, a: () => '<b>Feet · chafing</b><br>Ask, don’t look, unless he says yes. Hotspot: dry it, tape it, fresh socks. Chafing: lube. Hout Bay is the planned sock and lube stop. A blister doesn’t end races. Faffing with one for 20 minutes does.' },
    { re: /(hot|heat|sun ?burn|overheat|boiling|temperature)/, a: () => '<b>Heat</b><br>Ice in the cap, cold water on the neck, sunscreen top-up, extra Revive sachet. Llandudno → Hout Bay is the hottest, most exposed leg. If he’s stopped sweating, is confused or has goosebumps in the heat, that’s heat illness: medic.' },
    { re: /(cold|freez|wind|rain|wet|jacket|layer|warm)/, a: () => '<b>Cold · wet · wind</b><br>Wind jacket within reach from Kloof Nek. From SARDA: long-sleeve, buff, gloves in the pack. Newlands: dry buff and gloves. If he’s shivering hard and can’t stop, get him warm and find a medic.' },
    { re: /(pee|urine|wee|piss)/, a: () => '<b>Pee check</b><br>Not peeing, or dark pee: he’s behind on fluid and salt. One extra flask and an extra Revive over the next hour. Clear and frequent with puffy hands: too much water, not enough salt. That second one is a medic.' },
    { re: /(cut.?off|cutoff)/, a: (q, lv) => { const s = stopIn(q); if (s) return A.when(s, lv);
        return '<b>Cut-offs</b>' + ul(STOPS.filter(s => s.cut).map(s => `${s.name}: <b>${s.cut}</b> · 24 h plan ${s.t24} (${dur(mins(s.cut) - mins(s.t24))} spare)`)) + 'SARDA’s km and cut-off are to be confirmed at the race briefing.' + (lv.ratio ? '<br><br>' + paceLine(lv) : ''); } },
    { re: /(slow|behind|late|miss)/, a: (q, lv) => { const s = stopIn(q); if (s && /cut/.test(q)) return A.when(s, lv);
        return '<b>Behind pace</b><br>Don’t chase it. Slower means more hours on his feet, which means more fuel, not less. Add 1 OpenFuel sachet and 1 food item to every leg (plus a Chocolate gel after Hout Bay). Keep stops short.<br><br><b>Cut-offs:</b>' + ul(STOPS.filter(s => s.cut).map(s => `${s.name}: ${s.cut} (24 h plan ${s.t24})`)) + (lv.ratio ? paceLine(lv) : ''); } },
    { re: /(ahead|fast|too quick|pace|speed|push)/, a: (q, lv) => '<b>Pace calls</b><br>On time (within ~15 min of 19 h): “Michael, you’re on time. Perfect. Hold this effort, don’t change a thing.”<br>Ahead before 50 km: “Cruise, Michael, hold the pace. Being ahead now is a trap.”<br>Ahead after 50 km, feeling good, runnable trail: “Okay dude, let’s go. Let it run.”<br>' + (lv.ratio ? '<br>' + paceLine(lv) : '') },
    { re: /(what (do|should) (we|i) say|motivat|encourag|pep talk|cheer|what to say|banned|don.?t say)/, a: () => '<b>What to say</b><br>One voice, one line, calm. “Michael, you’re on time. Hold this effort.” Or: “Eat this. Walk with me.”<br><b>Never say:</b> “You’re nearly there”, “Only 20 km to go”, “You look tired”, “I could never do that”, or “Is it fun?”' },
    { re: /(weather|forecast|wind speed)/, a: () => '<b>Weather</b><br>I can’t see live weather, so check a weather app for Cape Town and Table Mountain. The plan either way: heat and sun on the coast from Llandudno to Hout Bay (ice, sunscreen, extra Revive), cold and wind on the summit and after dark (jacket from Kloof Nek, layers and gloves from SARDA).' },
    { re: /(caffeine|coffee|coke|cola|chocolate gel|choc gel)/, a: () => '<b>Caffeine</b><br>Nothing before Hout Bay. From Hout Bay: one Chocolate gel (35 mg) every 1–2 hours through the night, plus flat Coke from SARDA. The crew holds the Chocolate gels and rations them. He’ll beg for one at Llandudno. The answer is no.' },
    { re: /(smoothie|noodle|kauai|meal|proper food|real food)/, a: () => '<b>Hout Bay meal</b><br>Kauai Peanut Butter Bomb smoothie (keep it cold) + 2-minute noodles with hot water, in a cup he can walk out with. Chair for 5 minutes max. Also the first Chocolate gel.' },
    { re: /(signal hill)/, a: () => '<b>Signal Hill (km 12)</b><br>Not a crew stop. He runs straight through, refills one empty flask with water and drops in his OpenFuel sachet. 19 h: ~05:42 · 24 h: ~06:07. Supporters can cheer there; the crew goes to Kloof Nek.' },
    { re: /(100 ?m|help (him )?on (the )?course|(on|along) the (trail|course|mountain|route|way)|between (the )?(stops|stations)|meet him|pacer|penalt|outside|allowed|rule)/, a: () => '<b>The 100 m rule</b><br>We only help him within 100 m of a crew station. Help anywhere else is a 30-minute penalty. Not even a jelly baby.' },
    { re: /(drill|routine|what do (we|i) do|procedure|how .* stop work|process)/, a: () => '<b>The station drill</b>' + ul(['T–30: in position, mix 2 OpenFuel + 2 Revive, lay out the packet', 'T–5: everyone inside the 100 m zone, hands free', '0:00: take all 4 flasks, hand over 4 full ones', '0:20: one voice gives him time vs plan and one line', '0:40: “What did you eat?” Count wrappers. Log it here.', '1:00: packet into the pack, that stop’s kit done', '2:00: walk him out. Hout Bay gets 6 min, everywhere else 2–4.']) },
    { re: /(spare|run out|ran out|forgot|lost|left (it|the)|extra|backup)/, a: () => '<b>Spare bag</b> (travels with the crew all day)' + ul(['2 waffles', '1 Salted Maple gel', '2 Chocolate gels', '5 OpenFuel sachets', '1 Revive sachet']) + 'Anything missing from a packet comes out of here. He never leaves a stop with less than 1 OpenFuel and 1 Revive sachet.' },
    { re: /(flask|sachet|openfuel|open fuel|revive|mix|drink|fluid|water|electrolyte|salt|sodium)/, a: () => '<b>Flasks</b><br>He carries 4 × 500 ml, all pre-mixed: 2 OpenFuel (~60 g carbs) and 2 Revive (electrolytes, no carbs). At every crew stop, <b>swap all four for full ones</b>. Don’t top up. Swap. At water points he refills an empty and drops in a sachet. He always carries at least 1 spare OpenFuel and 1 Revive sachet.' },
    { re: /(how (is|are) (he|his|barney|michael)|how.?s (he|his|barney|michael)|status|on track|fuel(l)?ing|carbs|eaten so far|update)/, a: (q, lv) => A.status(lv) },
    { re: /(track|life ?360|where is he|where.?s he|location|gps)/, a: (q, lv) => 'Check Life360 for where he is right now.' + (lv.ratio ? '<br>' + paceLine(lv) + (lv.next ? ` Next: ${lv.next.name} at about <b>${clock(eta(lv.next, lv))}</b>.` : '') : '') },
    { re: /(eat (now|next)|what should he (eat|have)|hour|plan for (the )?(leg|section)|next food|consume)/, a: (q, lv) => A.eatNow(lv) },
    { re: /(when|time|eta|arriv|due|expect|what time|get to|reach)/, a: (q, lv) => A.when(nextOr(q, lv), lv) },
    { re: /(where|address|park|directions|map|location|get there|drive)/, a: (q, lv) => A.where(nextOr(q, lv)) },
    { re: /(packet|bag|give|hand|need|bring|kit|pack|ready|prepare|prep|stop|station)/, a: (q, lv) => A.packet(nextOr(q, lv)) },
    { re: /(mood|vibe|state of mind|how will he be)/, a: (q, lv) => { const s = nextOr(q, lv); return `<b>${s.name} mood forecast:</b> ${s.mood}`; } },
    { re: /(leg|section|terrain|route|course|climb|trail)/, a: (q, lv) => { const s = stopIn(q) || lv.last || STOPS[0]; const i = STOPS.indexOf(s); const n = STOPS[i + 1];
        return n ? `<b>${s.name} → ${n.name}</b> · ${(n.km - s.km).toFixed(1)} km · ${dur(mins(n.t19) - mins(s.t19))} on 19 h, ${dur(mins(n.t24) - mins(s.t24))} on 24 h.<br>${s.leg}` : 'That’s the finish. There is no next leg. There is a beer.'; } },
    { re: /^(hi|hey|hello|howzit|sup|yo|morning|evening)\b/, a: () => 'Howzit. Ask me what’s in a packet, when he’s due somewhere, how his fuelling looks, or what to do when something goes wrong.' },
    { re: /(thank|thanks|cheers|legend|shot)/, a: () => 'Pleasure. Go count some wrappers.' }
  ];

  INTENTS.forEach(it => { it.re = new RegExp('\\b' + it.re.source); });

  function answer(raw) {
    const q = ' ' + raw.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9' :]/g, ' ').replace(/\s+/g, ' ') + ' ';
    const lv = live();
    // a bare station name ("sarda?") = everything about that stop
    const s = stopIn(q);
    if (sig(q) && !/(cramp|sick|quit)/.test(q)) return INTENTS.find(i => i.re.source.includes('signal hill')).a(q, lv);
    for (const it of INTENTS) if (it.re.test(q)) return it.a(q, lv);
    if (s) return A.packet(s) + '<br><br>' + A.when(s, lv);
    return 'Not sure about that one. I only know the race plan, the packets, the timings and what to do when he falls apart. Try one of these:';
  }

  /* ---------- UI ---------- */
  const CHIPS = ['What’s in the next packet?', 'When’s he due next?', 'How’s his fuelling?', 'What should he eat now?', 'He’s cramping', 'He wants to quit', 'He can’t eat', 'Cut-offs', 'Where’s SARDA?'];
  const root = document.createElement('div');
  root.innerHTML = `
    <button class="bot-fab" id="botFab" aria-label="Ask the crew bot"><span>Ask for help</span></button>
    <div class="bot" id="bot" role="dialog" aria-label="Crew bot" aria-hidden="true">
      <div class="bot__head"><img src="barney.webp" alt=""><div><b>Crew bot</b><small>Knows the plan. Doesn’t know fear.</small></div><button id="botX" aria-label="Close">×</button></div>
      <div class="bot__log" id="botLog"></div>
      <div class="bot__chips" id="botChips"></div>
      <form class="bot__in" id="botForm"><input id="botQ" autocomplete="off" placeholder="Ask anything about race day…"><button aria-label="Send">→</button></form>
    </div>`;
  document.body.appendChild(root);
  const $ = id => document.getElementById(id);
  const log = $('botLog');
  function add(html, who) {
    const d = document.createElement('div'); d.className = 'msg m-' + who; d.innerHTML = html; log.appendChild(d);
    log.scrollTop = log.scrollHeight;
  }
  function chips() { $('botChips').innerHTML = CHIPS.map(c => `<button type="button">${c}</button>`).join(''); }
  function ask(q) {
    if (!q.trim()) return;
    add(esc(q), 'me');
    setTimeout(() => add(answer(q), 'b'), 180);
  }
  function open() { $('bot').classList.add('on'); $('bot').setAttribute('aria-hidden', 'false'); document.body.classList.add('bot-open');
    if (!log.children.length) add('Howzit. I know the whole race plan: packets, timings, cut-offs, and what to do when he falls apart. I also read the fuel log on this page. What do you need?', 'b'); }
  function close() { $('bot').classList.remove('on'); $('bot').setAttribute('aria-hidden', 'true'); document.body.classList.remove('bot-open'); }
  $('botFab').onclick = open; $('botX').onclick = close;
  document.querySelectorAll('[data-open-bot]').forEach(b => b.onclick = open);
  $('botChips').addEventListener('click', e => { const b = e.target.closest('button'); if (b) ask(b.textContent); });
  $('botForm').addEventListener('submit', e => { e.preventDefault(); const q = $('botQ').value; $('botQ').value = ''; ask(q); });
  chips();
  window.BOT = { answer, open };
})();
