# BUNKER TYCOON — MASTER DEVELOPMENT PROMPT AND GAME BIBLE

Version 1.0 · 16 November 2026 · Planning document
Working creative title: **Underhaven: Bunker Tycoon**. This title is a proposal, has not been checked for existing use, and does not rename the repository.
Canonical repository: https://github.com/williamrobsonncuc-boop/bunker-tycoon

**How to use this document**

Give this entire document to the developer, designer or development assistant working on the game. Treat the instructions below as a continuous product brief. Deliver the next testable milestone, rather than attempting every proposed feature in one pass. Keep a record of decisions and evidence. The World War 3 setting, underground expansion, resource dependencies and civilian admission decisions are established requirements. The specific lore, names, prices, formulas, content counts and production targets below are proposed starting points for playtesting, not claims about an implemented release.

A long brief cannot itself create a successful game. This document is a framework for making decisions, building a polished playable experience, measuring its appeal and deciding where further investment is justified. A worldwide hit is an ambition, not an expected or guaranteed financial result.

---

## 1. Your role and the development mandate

Act as a game director and practical developer responsible for product design, simulation, presentation, technical reliability and release readiness. Apply the disciplines of a professional studio without pretending that a small project has a large studio's staff, funding or capacity.

Create an original mobile management game about building a civilian settlement underground during an ongoing fictional World War 3. Make the player feel responsible, resourceful, curious and increasingly capable. The pleasure comes from watching a community grow, understanding its systems and discovering what lies below it.

Deliver a coherent game whose systems reinforce each other. Avoid a collection of unrelated mechanics added because competitors have them. New features must earn their place by improving the central experience.

The target is a game players recommend because it feels thoughtfully made: readable decisions, satisfying construction, memorable residents, responsive controls, strong art direction, stable saves and an economy that holds up under scrutiny.

**Repository and scope rules**

1. Work only in the bunker-tycoon project and its explicitly selected worktree or branch.
2. Never delete, modify, import or republish Glazed & Confused, donots, supermarket-sweep, either Spire project or any other game as part of this work.
3. Inspect the current source and repository instructions before making changes. Preserve user work and save compatibility.
4. Keep design proposals distinguishable from shipped behaviour. Do not describe a mockup as gameplay or a test harness as a tested mobile build.
5. Make reviewable commits around complete changes. Keep working features available while developing replacements.
6. Do not rewrite the project or change its framework merely to make it appear more professional.
7. Do not introduce payments, advertisements, account services, external subscriptions or paid infrastructure without implementing and validating their real user flow and obtaining any necessary account access.
8. Treat quality gates as required evidence. If browser or device execution is unavailable, report the limit and keep the milestone open.

## 2. The starting point we actually have

At the inspected main commit, 51fc43b861977bfd09bd8af1767d5a1756f37d5f, the repository is a buildless HTML/CSS/JavaScript browser prototype.

Its existing foundation includes:

- A cutaway bunker on seven columns and eight floors.
- Connected sideways excavation and a central shaft extending downwards.
- Nine room types: generator, water treatment, hydroponics, food store, water tanks, battery bank, quarters, workshop and clinic.
- Material, food, water, power and medicine resource quantities.
- Four named starter residents, job assignments, specialist output bonuses and housing.
- Three rotating arrival groups with permanent admission, temporary shelter, supply aid and decline choices.
- Group admission checks, a 60-active-second stock forecast and family-preserving admission.
- Injuries, doctors, treatment and medicine consumption.
- Local saves, JSON import/export and version-one save migration.
- Sixteen existing simulation tests recorded as passing during the preceding development work.

Important limits: the visual presentation is placeholder work; physical-device and visual-browser QA remain outstanding; there is no production app-store package, currency, research, campaign, sanitation, movement simulation, cloud save, purchase system or simulated war-event layer. Current per-second balance values are deliberately fast prototype values.

Do not claim this document implements any of those missing systems. First reproduce the current tests and review the UI. Expand from a verified baseline.

## 3. The game in one sentence

**Build a life beneath a world at war: excavate a buried city, decide whom you can shelter, and turn a fragile bunker into a community that can stand on its own.**

The player is the Keeper of Haven 17, an unfinished civilian refuge under an industrial river valley. The world above changes with the war. The world below changes through the player's decisions.

The immediately recognisable image is a cross-section of dark earth containing a growing network of warm, occupied rooms. Residents move between beds, workshops, farms, clinics and gathering spaces. New excavations reveal structures that existed before the shelter: a railway platform, reservoir, seed archive and abandoned civil-engineering works.

**The three signature experiences**

- **Excavation with discovery:** expansion reveals places that can change how the settlement functions.
- **A human admission dilemma:** arrivals bring abilities, relationships and needs the player must support.
- **A visible, living settlement:** system changes have a clear physical expression in rooms, people and supplies.

If a feature does not strengthen at least one signature experience or support essential reliability, move it behind the first release.

## 4. Audience, tone and the experience promise

Primary audience hypothesis: mobile players who enjoy building, optimisation, discovery and caring for a settlement, including people who find large PC management games overwhelming. Secondary audience: players who like environmental storytelling and personalised spaces.

Do not assume that children are the commercial target because the game has expressive characters. The final content, rating, advertising eligibility and store categorisation must be assessed for the actual build and territories.

Target short sessions of roughly five to twelve minutes for a meaningful decision, with longer sessions possible for layout planning. These are design goals to test, not targets to force through timers.

Deliver:

- Tension without relentless misery.
- Serious circumstances with moments of warmth and dry humour.
- Clear cause and effect without an intimidating spreadsheet wall.
- A sense of agency even when resources are tight.
- A natural stopping point after an expedition, building project or chapter objective.
- A safe return after time away.

The player's emotional arc should move from “Can we get through tonight?” to “We have built somewhere worth protecting.”

## 5. Design pillars and feature filters

**Every important number has a visible cause.** A shortage links to its consumers, blocked producers and available remedies. The player can pause and investigate.

**Residents are people and participants.** Give them names, relationships, routines and personal goals. Their usefulness matters, but their identity extends beyond a production bonus.

**Space tells a story.** Infrastructure, obstacles and discoveries make expansion more interesting than purchasing another identical rectangle.

**Progress creates choices.** A new system offers alternatives or new relationships among existing systems. A tenfold production multiplier alone is not a satisfying chapter unlock.

**The bunker belongs to its player.** Layout, room appearance and community priorities express the player's decisions. Essential survival functions stay readable despite decoration.

**Returning is welcoming.** Avoid absence punishment, expiring daily progress or payment required to rescue a community from a crisis triggered while the app was closed.

Before approving a feature, answer: what decision does it create, what will the player see, what could go wrong, how can they recover, and how will we verify that it improves play?

## 6. World lore: the Greywater setting

The fictional year is 2043. World War 3 has been underway for eight months. The Greywater Basin is a densely built industrial river region with housing districts, rail infrastructure, hospitals, pumping stations and old underground service works.

The setting is recognisable without being a direct reproduction of a real contemporary conflict. Fictional factions and places create room for an original history. Their names are provisional creative labels pending originality and naming checks.

For years, governments argued that linked civilian shelters would be too expensive. The Lantern Programme began construction but was only partly completed. Haven 17 was a maintenance depot and refuge hub awaiting equipment and inspection when the regional power network failed.

The player begins six weeks after an event residents call the Long Blackout. Road routes are unreliable, official information is fragmented, and scattered communities survive through practical cooperation.

The war includes conventional fighting, cyber disruption, interrupted supply routes and limited nuclear escalation elsewhere in the fictional world. Different regions have different conditions. Do not make every surface location permanently radioactive or every event a nuclear attack. Weather, infrastructure damage, communication and displacement provide a wider range of decisions.

**The central narrative question**

Was the Lantern Programme simply abandoned, or were some shelters kept functioning at the expense of others? Environmental evidence reveals a history of difficult decisions, logistical failures and individual acts of care. Avoid reducing the entire story to one cartoon villain or an omnipotent conspiracy.

**The player's role**

The Keeper is a civilian coordinator, not the ruler of a conquering empire. A previous shelter manager left incomplete plans, a radio frequency and a promise: “Keep the light on.”

The player can name the settlement. “Haven 17” remains its original infrastructure designation.

**Background organisations**

| Organisation | Role | Opportunities and tensions |
|---|---|---|
| Lantern Civil Defence | Fragmented former shelter network | Old plans, maintenance records, conflicting procedures |
| Open Roads Relief | Civilian aid and evacuation service | Rescue coordination, medical deliveries, scarce transport |
| Basin Exchange | Trading cooperative between settlements | Practical contracts, trust and disputed priorities |
| Greywater Transit Guild | Surviving rail and tunnel specialists | Exploration access, technical expertise, restoration work |
| Northern Accord | One fictional military alliance in the wider war | Broadcasts, access restrictions, contested infrastructure |
| Meridian Pact | Opposing fictional alliance | The same geopolitical background through different sources |

The last two are distant context. They are not ethnic templates, collectible combat factions or simple moral categories. Civilians can arrive from any background.

**Locations**

Haven 17; Millbank district; Blackglass rail junction; the East Pumping Works; St Anne's Field Clinic; the Verdant Seed Repository; the Old Exchange; and the sealed Lantern communications hub.

Deliver lore through objects, radio exchanges, resident conversations and changes to rooms. A medical volunteer's old shift card can say more than a compulsory page of exposition.

**Opening voice-over proposal**

“The first night, we had four people, a failing generator and a door that would not close. Above us, the radio kept counting losses. Below us, there was earth, darkness and enough room to try. We did not know whether the world would let us build a future. We started with the lights.”

Make this skippable, captioned and short. The first player action follows immediately.

## 7. Campaign and chapter structure

Use authored chapters for the first campaign, with controlled variation inside them. An entirely procedural campaign would increase production and debugging costs before its value is established.

| Chapter | Core question | New decision | Landmark |
|---|---|---|---|
| 1. Keep the Light On | Can the shelter support its first arrivals? | Housing versus utility investment | Restored entrance |
| 2. Roots in Concrete | Can food production outgrow demand? | Farming, water and labour balance | First greenhouse |
| 3. The Waiting Room | Can care keep pace with growth? | Clinic staffing and medicine allocation | Treatment ward |
| 4. The Buried Platform | What should an old station become? | Trade access versus another community use | Railway concourse |
| 5. Signal in the Static | Who else is still out there? | Relief requests and exchange contracts | Radio room |
| 6. A Home, Not a Holding Place | What does long-term life require? | Comfort, education and work patterns | Community hall |
| 7. Pressure Below | How resilient is the system? | Redundancy, repairs and controlled shutdown | Reservoir works |
| 8. The Lantern Line | Can neighbouring shelters cooperate? | Shared civilian infrastructure project | Regional relay |

This is a long-term campaign proposal. Build Chapter 1 to completion before committing to eight chapters.

Chapter endings should produce a moment of satisfaction and a clear next possibility. Let players remain in their current shelter, finish optional tasks and return later. A finished campaign transitions into sandbox play rather than forcibly resetting their colony.



## 8. The core loop, from touch to campaign

The immediate interaction loop is: inspect a need, choose a response, commit a change and watch the result.

The session loop is: collect the shelter report, resolve one arrival or project, adjust production, complete a useful improvement and choose the next goal.

The chapter loop is: establish capacity, face an understandable new constraint, make a lasting choice and unlock a new relationship among systems.

The long-term loop is: transform the shelter's physical layout, develop residents, uncover the buried city's history and extend help beyond the entrance.

Do not make tapping every producer the default way to receive output. Production should flow automatically when workers, inputs and storage permit it. Player attention belongs on decisions, not collection chores.

Avoid escalating costs solely to consume time. If construction duration exists, let players make worthwhile decisions during it. A construction queue must not become the game's entire economy.

**A reference five-minute session**

The player returns to a stable shelter report. Water reserves are lower than the chosen safety target because a newly expanded greenhouse is drawing more water. They inspect the dependency, improve pump staffing and postpone another farm. A family arrives with an electrician and an injured adult. The admission preview shows enough beds but limited treatment capacity. The player admits them, assigns a free doctor, and begins excavating a room near the clinic for a future ward. The session ends after the patient is settled and a new discovery outline appears below.

Everything in that sequence should be observable, reversible where appropriate and understandable without a wiki.

## 9. Excavation, rooms and the underground map

Keep the side-view cutaway and connected sideways expansion. Digging down requires a connected vertical access route. Spaces must be reachable before they become operational.

For the next slice, retain the existing central-shaft grid. Later, make map dimensions configurable without hard-coded UI assumptions. Do not promise an infinite world: choose a finite, authored map with expansion margins and measure its cost.

**Proposed spatial vocabulary**

- Standard room module: two visual grid units wide and one floor high in a future art layout.
- Utility shaft: one unit wide, connecting floors.
- Excavated passage: traversable space that can be converted into a supported room.
- Landmark: a larger authored footprint with multiple possible uses.
- Obstacle: rock, flooding or damaged works requiring a clearly stated prerequisite.

These are proposed visual units, not instructions to invalidate the current save grid. A migration plan must precede any conversion.

Construction preview must show cost, footprint, connectivity, staffing and expected inputs/outputs. Invalid placements explain why. Dragging a preview never spends resources. Confirming spends once.

Early rooms may connect to power and water automatically through the shaft network. Manual pipe routing should be a later, optional depth layer only if testing shows it improves the game.

Avoid a simulation in which every single supply crate needs pathfinding before production works. Calculate functional access at room or floor level. Use visible carrying animations to communicate flow unless detailed logistics becomes a deliberate, tested mechanic.

**Building lifecycle**

Planned → confirmed → construction → completed → staffed/idle → operating → blocked/repair needed.

Each transition has a saved state and a visible explanation. Cancelling a valid project refunds an explicitly displayed amount. Decorations are separate from structural room data.

Relocating a room should be possible for a stated cost after onboarding. If relocation would block the only clinic or sever access, pause and show the consequence. Do not trap players permanently because they misunderstood the first layout.

## 10. Room catalogue and connected systems

Use a small initial set, then unlock facilities as their decisions become relevant.

| Facility | Inputs or constraints | Output or benefit | Trade-off |
|---|---|---|---|
| Generator | Healthy operator; later fuel and upkeep | Electricity | Running cost, noise, maintenance |
| Water treatment | Operator, power, source access | Clean water | Electricity demand and storage |
| Hydroponics | Farmer, water, light and power | Food | Competes for water and workers |
| Food store | Space, construction | Food reserve capacity | Capacity creates no food by itself |
| Water tanks | Space, construction | Water reserve capacity | Ties up space and materials |
| Battery room | Charging surplus | Outage reserve | Cannot replace generation |
| Living quarters | Beds, upkeep, suitable access | Housing and rest | More residents also need supplies |
| Workshop | Technician, power, salvage | Parts and repairs | Diverts workers from essentials |
| Clinic | Doctor, power, medicine | Treatment | Limited concurrent capacity |
| Sanitation room | Water, maintenance | Hygiene and illness prevention | Adds a visible baseline utility demand |
| Kitchen | Food, water, staff | Meal quality and efficient preparation | Staffing and power expense |
| Radio room | Operator, power | Signals, contracts and relief requests | Broader obligations and opportunities |
| Classroom | Tutor, space | Adult training; children's routine and wellbeing | Long-term benefit rather than immediate output |
| Community hall | Space and upkeep | Social life, meetings and comfort | Uses valuable build area |
| Research room | Trained staff, power, evidence | Practical technologies | Specialist opportunity cost |
| Depot | Staff, packing supplies | Expedition preparation and trade handling | Ties up goods before departure |

Do not implement all sixteen for the first slice. Preserve the existing nine and improve how they feel; introduce sanitation and the kitchen only when their value can be tested.

**Storage rules**

Production pauses when useful output storage is full. Do not consume a full set of inputs to create zero useful output. If partial-batch production is supported, charge inputs proportionally and document the rule.

Show capacity, current reserve and the relevant time horizon. “Enough water for about twelve active minutes at current demand” is often more useful than a number alone. Label estimates and their assumptions.

**Maintenance**

Introduce predictable wear with a visible condition meter. Maintenance reserves parts and labour. Offer scheduled upkeep, planned shutdown or temporary reduced output. A failure must have warning, a cause and a recovery route.

Never secretly make breakdown probability depend on whether the player buys something.

## 11. Resident model and character types

Represent a resident as a persistent person with a stable ID, name, age category, background, skills, health state, role, relationships, needs, personal objective and visual identity. Do not calculate worth as a single human-value score.

Separate a person's profession, current job and personality. A former teacher may run a pump today, train an adult tomorrow and still have the same identity.

**Profession families**

| Type | Shelter contribution | Development path |
|---|---|---|
| Grower | Hydroponics and crop planning | Horticulturist; seed specialist |
| Water technician | Pumps and filtration | Utility systems specialist |
| Electrician | Generation and batteries | Power-network specialist |
| Mechanic | Parts, repairs and equipment | Fabrication technician |
| Medic | Nursing and basic treatment | Further training under a qualified clinician |
| Doctor | Clinical care and treatment planning | Clinic leadership |
| Cook | Meal preparation and food efficiency | Community kitchen lead |
| Logistics coordinator | Storage, packing and exchange | Depot management |
| Builder | Excavation and construction projects | Structural works specialist |
| Radio operator | Communications and coordination | Relief liaison |
| Teacher | Training and education | Learning programme lead |
| Generalist | Basic facility roles with training | Player-selected practical specialism |

Competence should improve through use and planned learning. Training takes staff time and equipment; it is not a real-time wait sold through premium skips. Avoid a sprawling skill tree for every person.

Children do not perform production work. Their place in the shelter is represented through care, family relationships, schooling and ordinary life. Older adults and people with disabilities can have relevant abilities and adaptations; do not assume age or disability makes a person unproductive.

**Personality examples**

Methodical, sociable, patient, private, inventive, anxious under loud noise, fond of plants, good at mentoring. Traits should produce small, readable preferences and story moments. Avoid stacking random penalties until residents become disposable.

A person's injury or acute illness can temporarily limit work. Build a clear recovery pathway. Chronic needs should not be used as surprise traps or automatically imply job exclusion.

**Core cast**

| Person | Established or proposed role | Personal thread |
|---|---|---|
| Ada | Starter engineer | Keeps repairing an old lamp from her former workshop |
| Noor | Starter water specialist | Wants the shelter to trust the quality of its drinking water |
| Rose | Starter grower | Records the first successful harvest in a battered notebook |
| Leon | Starter doctor | Wants treatment decisions to be transparent and humane |
| Mara Vale | Arriving farmer | Wants her family settled before taking a permanent post |
| Eli Vale | Arriving injured engineer | Recovers, then helps interpret old railway systems |
| Kit Vale | Arriving child | Draws the shelter as it changes; artwork appears on walls |
| Sam | Arriving doctor | Brings practical field-clinic experience |
| Nuri | Arriving water technician | Recognises a pumping-work diagram |
| Ivo | Proposed later transit specialist | Knows a buried route but needs proof it is usable |
| Tess | Proposed radio operator | Collects civilian messages and reconstructs a missing contact |
| Mina | Proposed teacher | Helps turn temporary accommodation into a community |

Do not require all these characters in every run. The first four and existing arrival groups remain the initial continuity.

**Relationships**

Support a few meaningful links: family, friend, mentor and colleague. Introduce their consequences through scenes and preferences, not dozens of hidden coefficients. Joining family members must stay together unless the player explicitly chooses a supported alternative.

People need distinctive silhouettes and readable animation, not photorealistic faces. Do not make a different body type imply a statistical advantage.

## 12. Arrivals and the admission decision

An arrival is a group-level event with named members, known skills, immediate needs, stated uncertainty and possible follow-up stories.

Before deciding, present:

- Who is waiting and why they reached the shelter.
- Number of beds and accessible places required.
- Skills known at arrival; clearly identify information still unknown.
- Food and water required to settle the group.
- Additional ongoing consumption.
- Current injuries, treatment requirement and available clinic capacity.
- Resource forecast assuming no other changes.
- Suitable vacancies and whether specialist facilities actually exist.
- Any family or group constraints.

Do not auto-assign new people to jobs or quietly assume that their full potential output immediately offsets consumption.

**Four initial choices**

Permanent admission adds the whole group to the roster if basic capacity and arrival supplies are available. Temporary shelter provides accommodation and care under a clearly stated onward-evacuation arrangement. Supply aid spends an explicit bundle without adding residents. Decline spends nothing and records the decision without inventing a confirmed fate.

In the current prototype, temporary guests leave after 180 active seconds. Keep that rule working until a replacement is implemented. For the polished game, pause and let the player confirm a viable onward arrangement if transport becomes a story event. Do not eject a family into an unexpected danger because an invisible timer expired.

Pending groups should not disappear merely because the player closes the game. If a future timed story event exists, it must be introduced, understandable and compatible with the game's absence rules.

**A meaningful example**

The shelter has eight beds, six residents, one clinic and low water reserves. Three people arrive, including a water specialist and an injured parent. Their future contribution does not create a bed immediately. The player can expand quarters, find temporary care capacity, provide aid or decline. Showing the conflict is the game; forcing a purchase is not.

**Consequences**

Use changes in workload, reserves, relationships and future stories. Avoid simplistic virtue points. Helping may lead to a later contact, but every aid decision should not secretly guarantee profitable repayment. Humanitarian choices should remain comprehensible even without an economic reward.

## 13. Work, rest and daily life

The first improved staffing system should keep one assignment per adult and one worker per standard facility, matching the current prototype. Add a clear overview of staffed, idle, recovering and unavailable residents.

Matching skill gives a moderate, visible benefit. Generalists can handle ordinary roles with lower efficiency. Clinical roles retain explicitly modelled qualification requirements.

Later introduce automatic shift coverage at a group level. The player sets staffing priorities and coverage targets rather than manually waking each resident. Rest is planned capacity, not a punishment for being offline.

The production formula should read approximately:

**Useful output = base output × staffed fraction × skill modifier × room condition × available-input fraction.**

Do not multiply eight hidden modifiers. If output changes, the room inspector lists every contributing factor.

Residents walk, sit, eat, work, sleep, talk and receive care. Animation follows simulation state without making the engine depend on the exact location of every sprite. At maximum population, simplify off-screen routines.

**Personal objectives**

Restore a family photo, grow a particular crop, organise a shared meal or finish a training task. Rewards can be a decoration, relationship scene, practical improvement or journal entry. Personal objectives should develop identity without becoming a daily chore list.

## 14. Healthcare, hygiene and difficulty

Healthcare is fictional game simulation, not real clinical advice. Use understandable states such as stable, recovering, needs treatment and fully recovered.

The first clinic system uses the existing model: one qualified doctor, one patient at a time, power and medicine consumed while treatment advances. Improve queue visibility before adding new diseases.

Triage should be inspectable. If priority rules exist, show them and allow supported adjustment. Never hide that a room has stopped because medicine ran out.

Sanitation can later connect overcrowding, water access and room condition. Begin with a small set of well-explained risks and prevention choices. Do not introduce an epidemic immediately after the player learns basic food production.

**Difficulty proposal**

- Story: broad recovery margins, clear warnings and forgiving shortages.
- Standard: meaningful reserve planning and a manageable event cadence.
- Challenge, later: tighter logistics and more constrained resources.

No mode simulates harm while the player is absent. For the first commercial release, resident death is excluded from the core loop; shortages affect wellbeing and productivity with recovery routes. If a later scenario changes that rule, it needs a separate, explicit product decision and full design review.

Difficulty should change resources, warning windows and constraints, not make controls less informative.



## 15. The economy and in-world currency

Use **Lantern Credits**, abbreviated **LC**, as the proposed earned currency. The Basin Exchange records them as claims on goods and services exchanged between civilian settlements. Paper vouchers, stamped account cards and radio-confirmed balances give the currency a physical identity in the world.

Lantern Credits are fictional game money. They are not cryptocurrency, do not represent ownership of a real asset and have no cash-out value.

Keep one main currency. Food, water, materials, medicine and stored energy remain physical resources. Later fuel and manufactured parts may appear when they support a tested decision. Research evidence and blueprints are unlock conditions, not another universal spendable currency.

**Sources of LC**

- Fulfilled exchange contracts with explicit goods, quantity, deadline rules and payment.
- Selling approved surplus through limited trading capacity.
- Completing authored community projects that provide a stated grant.
- Recovering finite pre-war exchange reserves in discoveries.
- Producing specialised goods after the workshop chain is introduced.

**Sinks of LC**

- Imported components and equipment purchases.
- External transport and licensed network services represented in fiction.
- Room upgrades that require goods supplied by other settlements.
- Optional decorations purchased with earned currency.
- Specialist expedition supplies sourced outside the shelter.

Do not charge residents rent for sleeping in a refugee shelter. Do not create currency merely because more people exist. Their contribution is useful work, knowledge and community life.

For room construction, distinguish locally consumed materials from externally procured kits. If an LC cost exists, explain what it purchases. Do not charge credits for the same components twice under different labels.

**Avoid currency deadlocks**

The player must be able to restore essential production without currency if they reach a recovery state. Keep a finite, explicitly tutorial-only relief grant and a repeatable low-yield manual recovery route. The latter costs active work or time and cannot be sold back for a profitable loop.

The current unlimited +25 materials button is a developer convenience. Move it behind a clearly labelled debug setting before a commercial balance test. Do not remove it until recovery gameplay exists.

**Reserve-aware trade**

A suggested offer excludes food, water and medicine below the player's safety target. Selling a protected reserve requires an explicit confirmation describing the consequence. Contracts do not auto-drain essential stocks while the app is hidden.

Prices should be understandable. Start with a small published price table and authored offers. A fully dynamic economy is not needed until its extra decisions justify the balancing cost.

## 16. Time model and starting balance specification

The current prototype consumes resources per active real second. Do not silently display those values as daily consumption. Choose and document one future time model before rebalancing.

**Proposed campaign clock**

One real active minute equals one in-world hour; twenty-four active minutes equal one in-world day. Pause freezes this clock. App suspension freezes it in the first release candidate.

This is a starting hypothesis. Test whether a shorter or longer day improves comprehension and pacing. The UI should always distinguish active play time from the fictional calendar.

Store rates in data as per-in-world-hour quantities and convert through one tested clock service. Do not scatter sixty-based conversions throughout code.

**Illustrative balance table: to tune, not ship untested**

| Item | Proposed base value | Explanation |
|---|---|---|
| Adult consumption | 1 food + 1 water / world hour | Baseline before kitchen improvements |
| Child consumption | 0.7 food + 0.7 water / world hour | A different need, never a labour bonus |
| Staffed generator | 12 energy / world hour | Fuel excluded from first slice |
| Staffed treatment plant | 10 water / world hour; consumes 3 energy | One worker |
| Staffed hydroponics | 10 food / world hour; consumes 4 water + 4 energy | One worker |
| Staffed workshop | 2 parts / world hour; consumes 2 materials + 2 energy | Introduced after production basics |
| Active clinic | +8 health / world hour; consumes 1 medicine + 2 energy | One doctor and one treatment place |
| Quarters module | 4 beds | No production on its own |
| Store module | +100 relevant resource capacity | Includes an upgrade path |
| Matching profession | +25% useful production | Preserve the current understandable bonus initially |

The first four adults consume 4 food and 4 water per world hour. With the base farm and plant operating, food net is +6 and water net is +2 after the farm's water use, before additional systems. Generator surplus is +5 energy before a clinic or workshop operates. This gives the initial shelter a comprehensible, positive baseline.

Specialist bonuses change output and must be reflected in forecasts. If base and specialist numbers are both shown, label them.

**Illustrative starter stock**

300 materials, 60 food, 60 water, 30 stored energy, 8 medicine and 180 LC. Construction costs should permit one meaningful early choice and a recovery option. Do not retroactively replace a player's existing stock with these proposal values.

An example new quarters kit might cost 50 materials + 30 LC; a clinic 80 materials + 50 LC; food storage 35 materials + 20 LC. These values require simulated and observed testing. Their purpose is to establish relative costs, not assert a proven economy.

**Balancing method**

Run scenarios with conservative, balanced and expansion-heavy choices. Measure time to first meaningful choice, stockout, recovery and completed project. Try all available early builds and verify that at least two sensible strategies remain viable.

Check that new residents increase demand immediately while new output requires a suitable facility and assignment. More residents cannot be an automatic positive multiplier.

Avoid endless exponentials that erase earlier systems. A room upgrade should improve a relevant constraint, not turn twenty small upgrades into meaningless numbers.

Every economy change records old value, new value, expected result and test evidence. Keep balance in versioned data with a migration policy.

## 17. Research, upgrades and resident development

Research should solve practical problems introduced by play.

Use a small branching tree with visible prerequisites:

- Water: efficient filtration versus larger reserve capacity.
- Food: crop efficiency versus meal preparation.
- Energy: reliable generation versus improved storage.
- Care: treatment throughput versus reduced medicine use.
- Settlement: room comfort versus training capacity.
- Exploration: route surveying versus hauling capacity.

A choice can delay another path without permanently ruining the shelter. Explain respecialisation or later access where supported.

Research consumes staff effort, a known resource bundle and recovered evidence. It should not be an unexplained premium-currency meter. New technologies create decisions: solar recovery equipment changes exposure to surface conditions; upgraded filters change medicine and maintenance priorities; a new lift changes access and hauling.

A building upgrade has three clearly different layers:

1. Functional improvement.
2. Visible physical change.
3. Optional appearance customisation.

Do not sell functional superiority in an appearance pack.

Skills progress through a few readable levels, with training opportunities and mentorship. Avoid a roster full of tiny random stat differences that players cannot meaningfully assess.

## 18. Exploration and the buried world

Excavation is the game's signature discovery system. Standard ground expands the settlement. Landmark outlines suggest something worth planning around.

Before entering a discovery, show what is known, what remains uncertain, required equipment, expected labour and recoverable risks. Let the player prepare. Exploration outcome uses an authored scenario plus controlled variation; do not repeatedly roll until the player spends a premium item.

**The first landmark: Millbank Platform**

The player uncovers a sealed stairwell and an old platform sign. A recorded announcement repeats an evacuation instruction from the Long Blackout. The platform has reusable space, a damaged access route and a contact for the Transit Guild.

After stabilising the shelter, choose its primary restoration:

| Use | Benefit | Cost and opportunity |
|---|---|---|
| Exchange concourse | Access to civilian trade contracts | Staff, power and external access upkeep |
| Emergency accommodation | More flexible arrival capacity | Food, water and sanitation demand |
| Community greenhouse | Large food-growing project | Water, power and growing equipment |

For the first vertical slice, implement one restoration path and show the other two as future design options only if the UI clearly identifies their status. Never place non-working “available” options in front of testers.

Make restoration visible: rubble cleared, lights repaired, benches repurposed, the first trader or meal arriving. Return to this landmark through resident stories.

**Later discovery catalogue**

A seed archive, reservoir, abandoned control room, small clinic store, maintenance workshop, communications hub and school shelter. Each must introduce a useful option, a story or both. A new room skin alone is not a major discovery.

**Surface expeditions**

Add after the buried-platform loop works. A small team leaves the staffing pool and takes equipment and reserve supplies. A route shows duration, known risk, objectives and possible outcomes.

Allow pause and recovery. Resolve authored danger at player-facing checkpoints. Do not kill residents while the game is closed. If return-home progression is eventually allowed offline, safe return can complete without applying unattended hostile events.

Expeditions must not become a separate combat game requiring another production team.

## 19. The World War 3 event layer

The war influences the shelter through infrastructure, communications, displacement and supply conditions. It remains present without replacing management with constant alarms.

Use an event director with cooldowns, intensity limits and knowledge of the player's current capability. An event's prerequisites and effects belong in data.

| Event | Warning | Choice | Possible consequence |
|---|---|---|---|
| Regional power loss | Radio advisory | Reserve energy or continue normal operations | Trade service interruption |
| Damaged pumping route | Utility report | Repair, ration or use reserves | Temporary water bottleneck |
| Evacuation convoy | Advance message | Prepare beds, supplies or aid | Arrival group |
| Quiet transport window | Confirmed route status | Send a team or conserve staff | Supplies and exploration |
| Medical appeal | Named relief contact | Fulfil partially, fully or decline | Resource use and future contact |
| Nearby contamination alert | Measured fictional world warning | Suspend surface activity, inspect filters | Restricted access and equipment need |
| Rumour of ceasefire | Unverified broadcast | Investigate or wait | New information rather than immediate certainty |

Weather and contamination are fictional game systems with simplified rules; do not present them as real shelter engineering advice.

Avoid stacking two major crises before the player has recovered from the first. Do not alter danger according to spending behaviour. A difficult situation should create an actionable choice, not a shop prompt.

Use the radio to distinguish confirmed reports, rumours and missing information. Do not present a deliberately uncertain report as an exact forecast.

## 20. First fifteen minutes: the playable proof

The vertical slice should tell a complete small story and include the three signature experiences. The times below are approximate beats, not forced waits.

| Active time | Beat | Interaction and evidence |
|---|---|---|
| 0:00–0:30 | The lights | Restore power with one clear action; immediate visual and audio response |
| 0:30–2:00 | Read the shelter | Inspect food/water, see starter jobs and select a reachable chamber |
| 2:00–4:00 | Make room | Excavate and build a useful facility with clear preview |
| 4:00–6:00 | The Vale family | Read names, skills, beds and treatment forecast |
| 6:00–8:00 | Choose and adapt | Admit or aid; see the actual resource and staffing result |
| 8:00–10:00 | Care and capacity | Staff a clinic or improve reserves; understand why output changes |
| 10:00–13:00 | Something below | Discover the platform outline and begin its first restoration step |
| 13:00–15:00 | A first home | Complete a visible improvement; choose a next objective and save safely |

A player who declines the first family still has a viable tutorial path. A player who pauses for ten minutes does not fail an invisible clock. A player who builds a less efficient but valid room receives a recovery path rather than an instruction to restart.

**Slice content ceiling**

One shelter map, the nine existing room types with coherent presentation, the four starters, two authored arrival sequences, one medical recovery, one landmark reveal, one restoration objective, one radio event and one satisfying chapter completion.

A slice can contain fewer rooms if that makes the opening clearer, but do not remove existing functionality without handling its data and saves.

The slice passes when independent players can explain why resources changed, what the arrival decision cost and what they want to do next. It does not pass merely because every button runs.



## 21. Art direction and visual identity

Creative direction: **civilian engineering becoming a home**.

Use graphite earth, worn concrete, painted steel, warm practical lighting and living green plants. Avoid copying another franchise's retro-futuristic suits, mascot, room silhouettes, signage or icon language.

**Proposed palette**

| Role | Starting colour | Use |
|---|---|---|
| Deep earth | #19211F | Surrounding terrain and background |
| Structural slate | #354742 | Infrastructure and secondary surfaces |
| Warm ivory | #E8E4D5 | Main text and practical signs |
| Lamp amber | #E5B76B | Selection, warmth and small highlights |
| Growing green | #80A879 | Farming and healthy production |
| Water blue | #6AA6B8 | Water and storage identity |
| Care coral | #C8867B | Clinic identity and restrained urgency |
| Warning ochre | #D7A34B | A warning, paired with icon and text |

These are starting art swatches. Measure actual text contrast in the implemented interface. Do not assume a colour looks accessible because it appears in this table.

Rooms should read from a zoomed-out view through shape, lighting and equipment. At close view, small details reveal resident life. Every core room has at least three recognisable states: functioning, idle/blocked and under construction.

**Character visual rules**

Use stylised, expressive proportions with readable silhouettes. Civilian clothing varies by profession, taste and available equipment. Repeatable body rigs and modular outfits keep production manageable. Avoid a unique animation system for each person.

Show the doctor treating someone, the grower tending crops and the engineer inspecting machinery. Do not imply detailed physical simulation that the economy does not actually model.

**Asset production list for the slice**

A terrain kit; shaft and doorway kit; nine room environments; starter character set; modular civilian outfit pieces; about eight shared action animations; a portrait treatment; a coherent icon set; platform landmark art; utility effects; and construction effects.

Track source file, author, usage rights, export settings and in-game references. Temporary assets are labelled in development. Resolve consistency and rights before release.

Use generated concepts if useful, then establish an editable production process and consistent final style. Do not assume a set of unrelated generated room pictures will function as a game art pipeline.

## 22. Audio, feedback and tactile feel

The shelter should sound inhabited without becoming noisy.

Layer soft ventilation, distant machinery, water movement, footsteps and occasional conversation. Room selection gently emphasises its local sound. Production failure changes the relevant sound or light state instead of triggering endless alarms.

Music begins sparse and gains warmth as the community stabilises. A major discovery has its own restrained musical motif. Do not spend on full voice acting before the core loop works.

**Interaction feedback**

- Tap: immediate highlight and a clear selected state.
- Excavation preview: boundary, cost and requirement.
- Confirmation: one short sound, dust and a persistent physical change.
- First harvest: a brief animation and a readable stock change.
- New arrival: a distinctive, optional radio/entrance cue.
- Treatment complete: a quiet acknowledgement and roster update.
- Chapter complete: a meaningful view of the changed shelter, not five consecutive reward screens.

Haptics are optional, brief and independently adjustable. Provide separate volume controls for music, effects, ambient sound and voice if used. Caption important sounds and radio messages.

Use motion and sound to clarify cause and effect. Never require them to understand essential information.

## 23. Mobile interface and accessibility

Default product hypothesis: portrait orientation, because the shelter grows vertically and should be usable in short sessions. Validate this on actual phones before locking the camera and art pipeline. Support wide screens thoughtfully later.

In the opening, fit the core shelter into a readable view. Expansion introduces controlled panning and pinch zoom. Add explicit zoom buttons and a floor overview so gestures are not the only navigation route.

A persistent compact resource strip shows the most important reserves. A tap opens detailed rates, consumers and trend. Do not place five tiny numbers and unlabeled symbols above a crowded map.

**Main navigation**

Shelter; Residents; Entrance; Projects; Radio, when unlocked. Settings and save management remain easy to find. The shop is not a primary survival control.

Selecting a room opens a bottom sheet on phones with purpose, actual output, inputs, staff, blockers and available actions. On wide screens it can become a side panel. Keep the selected room visible when possible.

Use readable text, generous touch targets, platform-appropriate safe areas and scalable UI. Test with larger font settings. Do not use colour as the sole signal for shortages, job availability or health.

Every meaningful control has a name, state and sensible focus order. Provide a structured list view for management tasks where a visual cutaway is difficult to navigate. Support keyboard and assistive navigation where the platform makes it available, and document remaining gaps honestly.

**Accessibility options**

Reduced motion; disabled screen shake; independent flash reduction; adjustable text size; contrast options; captions; volume channels; optional haptics; manual alternatives to drag-only controls; confirmation for consequential actions; and a visible pause control.

A colourblind filter alone is insufficient. Shape, label and position should also communicate meaning.

Avoid scrolling that accidentally places a room. Give preview, confirm and cancel distinct states. Use undo for reversible placements where technically safe.

## 24. Engagement and the reason to return

Interpret “addictive” as engaging enough that players choose to return because the game is enjoyable and they have a plan.

Build anticipation around discoveries, improved layouts, resident goals and growing capability. A reward should be connected to a player's action whenever possible.

Controlled surprises may include a different civilian story, an unusual decoration, an archive clue or a changed trade opportunity. Essential progress is reliable. Do not put a necessary doctor or critical blueprint behind random rolls.

No paid random survivor recruitment. No slot-machine presentation. No daily streak that destroys accumulated progress after an absence. No covert personalisation based on emotional vulnerability.

**Useful return reasons**

“I know where I want to build the next clinic.”
“I want to see what the station restoration becomes.”
“I want Eli to finish recovering and help with the railway.”
“I have a plan to support the next arrival group.”

**Notification policy**

Opt-in after the player understands the relevant feature. Ask for the type they want: completed planned project, expedition ready for review or major content update. Respect quiet hours and provide straightforward controls.

Do not send invented danger, “your residents miss you” guilt messages or an arbitrary notification merely because the app has not been opened.

**Offline behaviour**

For the next milestone, keep the existing pause-on-hidden behaviour. State it clearly.

Any later safe offline production needs a separate design and tests: capped beneficial output, no unattended disasters, no health deterioration, no forced contract failure, clear storage rules and clock-tamper handling. Purchases cannot be the only way to extend ordinary absence tolerance.

## 25. Technical architecture and engine decision

A professional result comes from reliable architecture and evidence, not a particular engine logo.

Continue the current JavaScript prototype while proving the slice. Separate simulation, content, rendering and platform services so the next client decision can be made with measured information.

Before choosing final native packaging or a game engine, build a short representative technical test: a busy shelter, scrolling, zooming, resident animations, saving and suspension on target phones. Compare the existing approach with one credible alternative only if a measured limitation warrants it.

Write an architecture decision record covering development effort, visual pipeline, device performance, accessibility, store integration, maintenance and migration cost. Verify current official engine documentation and licensing at the time of that choice. Do not select a new stack solely from preference or the promise of being “industry standard.”

**Proposed module boundaries**

| Layer | Responsibility |
|---|---|
| Simulation | Authoritative resources, residents, buildings, jobs, events and clock |
| Commands | Validate and apply player actions atomically |
| Content data | Room definitions, arrivals, events, recipes, costs and localised text IDs |
| Forecasts | Read-only prediction from a cloned snapshot and stated assumptions |
| Presentation | Map, animation, input, panels, sound and accessibility |
| Persistence | Schema versions, validation, migration, backups and export |
| Platform adapter | Purchases, lifecycle, optional cloud save, crash reporting |
| Developer tooling | Scenario runner, balance reports, test saves and debug views |

The rendering layer does not directly add currency or modify health. A purchase callback never edits the save without passing through the entitlement and persistence flow.

**Simulation requirements**

Use a fixed authoritative simulation step independent of rendering frame rate. Command processing and system order are stable and documented. Use seeded randomness for reproducible authored variation. Floating-point or fixed-point decisions must have explicit rounding, bounds and resource-conservation tests.

Forecasts never modify live residents, arrivals, jobs or resources. A paused game can still display a forecast. Recalculate only when relevant state changes or at a controlled frequency; do not run large simulations on every animation frame.

Construction, admission, trade and aid commands are atomic: either apply the whole supported transaction or leave state unchanged. Use stable IDs and validate every referenced entity.

Visible movement may update at frame rate while needs and production update at the simulation step. Reduce detail for off-screen characters and unselected rooms.

**Data contracts**

A resident record includes ID, content definition, relationships, age category, health, skills, current assignment, temporary-stay status and progression. A room instance includes ID, type, grid position, upgrade level, construction state, condition, assigned capacity and utility connectivity. An event includes ID, prerequisites, known information, choices, state changes and follow-up references.

Use validated content definitions and localisation keys. Avoid text embedded in logic and random IDs that change on every load.

## 26. Saves, migration and player trust

A management game can lose its audience through one save-corruption bug. Treat persistence as a critical system from the first paid build.

Keep a versioned save schema. Validate before accepting an import. Use bounds, type checks, legal assignments, unique IDs, connectivity and finite resource quantities. Size limits must reflect actual supported campaign saves rather than an arbitrary prototype value.

For browser work, handle storage failures and browser eviction honestly. Export remains available. For native work, use an appropriate persistent location and robust atomic-write or transaction support.

Keep a last-known-good backup before migration. Do not overwrite the only valid save when parsing or a migration fails. Migrate using copies, verify the result and record the new version only after successful persistence.

A corrupted save offers recovery options and a diagnostic explanation. “Start over” is never the only automatic outcome while a valid backup exists.

Separate earned resources, progression and purchase entitlements. Restoring a purchase should restore access, not overwrite a more recent shelter. A cloud conflict presents both candidates or follows an explicitly safe merge rule; never silently replace the newer meaningful progress using a timestamp alone.

**Important lifecycle tests**

Build room → force close → reopen.
Admit family → background during save → reopen.
Import malformed or oversized JSON.
Load a version-one or version-two save after an update.
Finish treatment on the exact tick temporary guests leave.
Restore content purchases on a fresh installation.
Handle full storage, lost connection and clock changes.
Recover from an interrupted migration.

Document which of these are actually tested on devices.

## 27. Performance and production budgets

The following are proposed internal targets, not universal industry thresholds or claims already achieved.

| Area | Starting target | Verification |
|---|---|---|
| Frame rate | 60 fps on selected midrange reference devices; a stable 30 fps low-power mode where appropriate | Frame-time captures in a busy shelter |
| Frame budgets | About 16.7 ms at 60 fps and 33.3 ms at 30 fps | Track spikes and percentile frame times |
| Touch response | Visible acknowledgement within 100 ms in normal play | Device measurement |
| Resume | Playable shelter within about two seconds on reference hardware | Suspend/resume runs |
| Cold load | First usable interaction within about five seconds after local assets are available | Cold-start tests |
| Initial size | Aim below 150 MB where the final art/audio plan permits | Store package and asset reports |
| Stability | Aim for at least 99.8% crash-free sessions in a sufficiently sized release cohort | Production-quality telemetry and exclusions documented |
| Save reliability | No known reproducible progress-loss issue | Recovery and lifecycle test suite |
| Thermal behaviour | Thirty-minute busy session remains usable without sustained severe degradation | Physical-phone profiling |

Choose and record actual reference devices before claiming compliance: at least an older supported Android device, a mainstream Android device and a supported iPhone. Test the declared minimum OS, not just the newest simulator.

Google's public guidance discusses a 30 fps baseline for many games and the trade-offs around higher frame rates. Its separate Level Up programme has additional criteria. Check the current requirements for the chosen distribution programmes; this table does not certify eligibility.

Measure resident counts and room counts at the proposed release maximum. Avoid a population promise before the animation, memory, save and UI costs are known.

Provisional first-campaign ceiling: 40 active residents and roughly 30 built rooms. This is a profiling scenario, not a fixed gameplay promise. Increase only after the interface and device tests support it.

Batch draws, reuse assets, cull off-screen detail, pool frequent effects and update UI incrementally. Prevent autoplaying screen-wide effects from turning a successful shelter into a laggy one.



## 28. Commercial model: a product players can trust

Recommended first hypothesis: a free opening chapter, a clearly priced permanent campaign unlock, and optional substantial expansion maps after the base game proves itself.

This is a proposed model to test, not a claim that premium conversion will be sufficient. Compare it with a straightforward paid edition or a fair free-to-play model using actual player evidence and realistic support costs. Do not mix incompatible models casually.

**Initial offer design**

The free chapter demonstrates real building, arrival decisions and a discovery. It ends at a satisfying chapter boundary. Explain the extent of free content before installation or at the appropriate store/product surface.

The paid unlock delivers a complete, clearly described base campaign and sandbox entitlement. Never imply it includes every future expansion unless that is the actual commercial promise.

Cosmetic packs, if offered, show their exact contents and preview them in the bunker. Earned decorations remain appealing. Cosmetics do not improve medical outcomes or resource production.

Expansion maps require new decisions, landmarks and a meaningful amount of authored play. A colour swap is not a substantive expansion.

**Pricing research**

Prototype several clearly labelled price concepts before selecting a live price. As an initial research range, explore a base unlock equivalent to roughly £4.99–£9.99, without treating that range as a market fact or an approved price. Ask what content players believe it includes, then test actual purchasing behaviour in a supported release environment.

Research local affordability, platform price tiers, taxes and competing value before finalising regional pricing. Do not convert every region mechanically from UK pounds.

No subscription at launch. It adds a recurring delivery promise that a small team may not support. No paid random items or premium survivor recruitment. No artificial food shortage designed to sell relief.

Avoid advertising in the first polished slice. If an ad-supported model is later tested, the experience must remain complete without watching ads and each reward must be explicitly optional. Never interrupt an admission or healthcare decision with an interstitial.

**Purchase implementation quality**

Use the platform's supported purchase system and current rules for the relevant territory and distribution channel. Handle cancellation, pending payment, duplicate callbacks, restoration, refund/revocation and reinstall. Grant access once and persist it safely.

A “Restore purchases” control and clear entitlement status are release requirements for applicable purchases. Do not treat a client-side Boolean as proof of payment. Implement the appropriate verification and entitlement design without overbuilding an entire account platform prematurely.

Keep the full shop and entitlement implementation behind the first complete core loop. Commerce must not be the most polished system in an unfinished game.

## 29. Business mathematics and income planning

Treat commercial success as a measured outcome. A small breakout game is evidence that breakouts can happen, not a reproducible distribution strategy or a personal earnings forecast.

Record development, art, audio, testing, tools, support, localisation, store costs, advertising, refunds and ongoing maintenance. Track cash timing as well as accounting profit. Owner labour has a cost even when no salary is paid yet.

Use clearly distinguished quantities:

- Gross consumer spending.
- Developer receipts after applicable store deductions, tax handling and refunds.
- Contribution after direct support, service and acquisition costs.
- Operating profit after ongoing business costs.
- Owner take-home after the relevant personal/business tax treatment and reserves.

Do not describe gross receipts as salary.

**Illustrative unlock economics**

Assume a 2% paid-unlock rate among new installs and £5 developer receipts per buyer after the relevant transaction deductions. These are invented scenario inputs, not forecasts or industry averages.

| New installs in a month | New buyers under that assumption | Developer receipts before marketing and operating costs |
|---|---:|---:|
| 10,000 | 200 | £1,000 |
| 50,000 | 1,000 | £5,000 |
| 100,000 | 2,000 | £10,000 |

At those assumptions, unlock receipts average £0.10 per new install. That £0.10 is not a sensible advertising budget per install: support costs, overhead, uncertainty and profit still need to fit below it. The same one-time purchase cannot be counted again every month from the same buyer.

Model worse, central and better cases. Include acquisition sources, actual unlock conversion, refund rate, regional mix, later expansion conversion and development costs. Do not assume a speculative future expansion rescues an unprofitable base launch.

For paid acquisition, compare measured net contribution over a defined horizon with cost per acquired install, using the same cohort and region. Separate observed revenue from projections. A viral video with views but few installs is not a profitable channel by itself.

A large audience is helpful only if reaching and serving it is economically sustainable. Protect a limited research budget and set stop/review points before spending.

For the owner's employment decisions, use sustained actual income, costs, reserves and personal needs in a private plan. Do not commit private financial details to the public game repository. Launch-week revenue is not proof of a stable livelihood.

## 30. Marketing, positioning and international growth

The first marketing job is to explain why someone should care in seconds.

**Positioning proposal**

“Build a home underground while war changes the world above.”

Support that with actual footage of a growing shelter, a meaningful arrival decision and a surprising buried structure. The store page should communicate management and discovery without suggesting a shooter.

**Creative tests**

1. A small shelter becomes an inhabited underground neighbourhood.
2. A family reaches the entrance and the admission forecast changes.
3. Excavation reveals the old platform.
4. A player fixes a water bottleneck and the greenhouse comes alive.
5. Two different layouts support different community priorities.

Produce short, readable clips with real gameplay. Label concept art or mock footage when used for early research. Store screenshots and ads must reflect the shipped product.

Use the creator's film and editing strengths for framing, pacing, sound and simple visual storytelling. Avoid lengthy cinematic production before the game's real play is worth showing.

**Distribution plan**

Begin with a small playable test and a concise explanation. Recruit target players beyond friends. Ask permission before using their footage or quotes. Follow the rules of communities where the game is discussed.

Prepare a press kit with icon, screenshots, gameplay video, short description, developer contact, release status and supported devices. Contact creators whose audiences already enjoy management games, using individual relevance rather than mass spam.

Measure each channel from impression to store visit, install, tutorial completion, return and purchase. Keep organic and paid traffic separate.

**International readiness**

Externalise text from the first content expansion. Use locale-aware numbers, dates and pluralisation. Avoid text baked into art and allow longer translations. Plan right-to-left layout and font coverage if those languages enter scope.

Start with strong English copy and add professionally reviewed localisations where interest and support capacity justify them. Do not promise simultaneous worldwide service coverage before testing.

Avoid war advertising that opportunistically attaches the game to a current tragedy. The fictional setting and focus on civilians provide an identity that does not depend on real-world outrage.

## 31. Analytics and research that answer decisions

Collect the smallest useful set of events with the appropriate disclosures and consent handling. Core play must not depend on personalised tracking.

A proposed event vocabulary:

| Event | Useful question |
|---|---|
| session_started / session_ended | How do session patterns change by build? |
| tutorial_step_completed | Where does onboarding lose players? |
| excavation_confirmed | Do players understand expansion? |
| room_built / room_blocked | Which facilities create confusion? |
| assignment_changed | Is staffing usable? |
| arrival_viewed / arrival_decision | Are forecasts read and choices understood? |
| shortage_started / shortage_resolved | Is difficulty creating decisions or frustration? |
| treatment_started / completed | Can players operate care systems? |
| landmark_found / restored | Does the signature discovery work? |
| chapter_completed | Does the slice deliver a satisfying arc? |
| entitlement_offer_viewed / purchased / restored | Does the paid product communicate value and work? |
| save_failed / recovery_used | Is persistence dependable? |

Use anonymous or pseudonymous identifiers where appropriate. Never transmit free-text player content, sensitive personal information or resident names supplied by users just because an event can include them.

**Research sequence**

First, observe roughly ten independent players. This is usability research, not a market forecast. Ask them to think aloud without guiding every action.

Next, run a larger versioned test with sufficient people from the intended audience to identify recurring patterns. Record device, acquisition source and build. Friends and paid testers should be identifiable research groups.

Measure return rates only after the relevant time windows have passed. Define day-one, day-seven and day-thirty retention precisely and keep the definition stable. Show sample size and uncertainty; a handful of returning players cannot validate worldwide demand.

Working usability targets can include at least eight of ten observed players completing the core construction/admission flow with no major intervention, and explaining one actual resource trade-off. These are internal starting goals, not industry benchmarks or statistical proof.

Do not use long sessions as the sole success measure. A player who completes a satisfying goal and leaves contentedly may have had a better experience than one stuck in a confusing loop.

## 32. Testing, release quality and definition of done

Use unit tests for simulation rules, integration tests for systems interacting, UI tests for critical flows and real-device testing for performance and lifecycle behaviour.

Preserve the existing sixteen tests as a starting point. Expand where mechanics introduce new failure modes; avoid test counts as a quality proxy.

**Required scenario coverage**

- Admission fits beds and settling supplies, or changes nothing.
- A family cannot be partly admitted by a failed transaction.
- New arrivals increase consumption even before assignment.
- A job requires a legal, available worker and valid room.
- A clinic cannot produce treatment from missing inputs.
- A forecast never changes the actual waiting group or resident health.
- A temporary group leaves consistently with assignments and patient queues cleaned up.
- Production respects input, output and capacity conservation.
- Trading cannot sell protected reserves by an accidental action.
- Currency does not appear or disappear through duplicate callbacks.
- Pausing and rendering frame rate do not alter economic outcomes.
- Save migration succeeds or preserves the last valid save.
- Corrupted and maliciously structured imports fail safely.
- A chapter is completable through every supported early admission choice.
- The game recovers from the designed worst reasonable shortage.
- Text remains usable with longer translations and larger font settings.

**Per-feature definition of done**

The behaviour is implemented, user-facing states are complete, errors are understandable, data saves and loads, relevant tests pass, accessibility has been checked, and performance impact has been measured where material. Art and sound are either final for the milestone or explicitly tracked placeholders.

A button is not finished if its failure state silently does nothing. A purchase is not finished because a test callback grants content. A polished scene is not a verified game if its save disappears after suspension.

**Release blockers**

Known reproducible save loss; duplicate charges or lost entitlements; an unwinnable required tutorial route; unreadable core controls on supported phones; severe repeatable crashes; a material mismatch between store media and gameplay; unlicensed required assets; and missing essential user-facing privacy/support information.

Maintain a severity-ranked bug list and require a release candidate build with recorded evidence, not a vague statement that testing “looks fine.”



## 33. Production milestones and approval evidence

Use milestone gates instead of assuming that adding enough features eventually produces quality.

| Stage | Deliverable | Evidence required before expanding |
|---|---|---|
| Baseline | Reproduced prototype and current tests | Known issues recorded; browser and device verification status explicit |
| First playable | Reliable construction, jobs, arrivals and treatment | Independent players understand the flow; saves survive lifecycle tests |
| Vertical slice | Fifteen-minute chapter with a landmark and representative art/audio | The central experience works on phones and gives players a next goal |
| Alpha | Planned base-game systems and campaign content integrated | Complete playthroughs; no missing critical route |
| Beta | Content polish, balancing, localisation and commerce | Device coverage, purchase tests, recovery tests and support readiness |
| Limited release | Controlled audience with real commercial conditions | Retention, stability and economics measured by cohort |
| Wider release | Broader territories and marketing | Supportable quality and credible contribution economics |
| Expansion | Meaningful new map/content | Existing game remains healthy and production capacity is demonstrated |

Do not call a browser mockup “alpha” solely because it contains many screens. Stages describe evidence and completeness.

Make estimates after breaking the next milestone into work packages. Distinguish effort from calendar time and include art, QA, rework and release work. Do not promise a studio-grade commercial game in an arbitrary weekend.

## 34. The immediate implementation backlog

The first work package is deliberately constrained. A large vision does not authorise a destabilising full rewrite.

**P0 — Verify and protect the foundation**

Reproduce the current sixteen tests. Inspect the actual UI on desktop and a phone-sized viewport. Record the absent native/device coverage. Check saves when backgrounding, importing and moving temporary guests. Fix any actual blocking bug found before extending systems.

Acceptance: an updated verification record, reproducible launch instructions and no regression in the existing flow. If execution is unavailable, the work remains unverified rather than being declared complete.

**P1 — Make the decision loop usable**

Create a compact resident overview and entrance decision panel. Clearly distinguish required beds, settling supplies, consumption, staffing opportunities and patients. Show both staffed clinic capacity and actual ability to treat with current inputs. Keep generalist and specialist assignment differences visible.

Acceptance: a new player can admit or aid the first group, understand the cost and assign a valid worker without developer explanation.

**P2 — Establish the data and time contract**

Move room rates, costs, arrival definitions and skills into validated data. Define the campaign clock and resource units. Write a migration strategy before applying new economy values. Preserve prototype saves and explain any unavoidable conversion.

Acceptance: one authoritative time conversion, documented production order, validated data and deterministic forecasts.

**P3 — Add Lantern Credits without breaking survival**

Add an earned-currency ledger, one finite introduction grant and one real trade contract. Separate materials from externally procured components. Add reserve-aware trade checks and a non-profitable recovery route.

Acceptance: the player can earn, spend and save LC; failed transactions change nothing; no buy/sell or repeat-claim exploit; essentials can be restored without a purchase.

**P4 — Build one landmark discovery**

Implement the platform reveal and one restoration project with a clear visual transformation. Integrate its story with the existing characters and current map.

Acceptance: the discovery is playable from a fresh save, works after loading halfway through and changes a meaningful future choice.

**P5 — Apply representative production art and sound**

Replace the first chapter's core placeholders with a coherent room kit, characters, lighting, icons and feedback. Keep a list of remaining temporary assets.

Acceptance: the busiest slice stays readable and responsive on reference phones. Quality is judged in motion and play, not only in a screenshot.

Complete these as separate reviewable increments. Reorder them if observed player problems justify it, and record why.

## 35. Scope control and the deliberate “later” list

Do not build these before the first slice proves the core game:

Real-time multiplayer; PvP raiding; global alliances; user chat; player trading markets; player-generated content sharing; blockchain; a stock market; large-scale combat; open-world surface navigation; breeding systems; hundreds of unique professions; voice acting for every resident; dozens of near-identical currencies; daily live-event obligations; multiple concurrent maps; and an elaborate backend before it serves a demonstrated need.

Some may never belong in this game. A professional project has the judgement to leave them out.

**Feature admission template**

State the player problem, proposed decision, expected benefit, required content, technical dependencies, support cost, failure modes and acceptance evidence. Estimate ongoing work, not only first implementation. Name the milestone that would lose time if this feature enters scope.

“Other successful games have it” is not sufficient justification.

## 36. Risk register and response

| Risk | Early sign | Response |
|---|---|---|
| Too similar to an existing bunker game | Testers describe only the competitor | Strengthen discovery, visual identity and civilian decision loop |
| Management becomes chores | Players tap repeatedly without planning | Automate routine production; improve meaningful choices |
| Interface overwhelms | Players cannot explain a shortage | Reduce simultaneous information; add causal inspection |
| Theme becomes exhausting | Players disengage from relentless distress | Add calm, agency, warmth and recovery |
| Scope outgrows capacity | Features start but do not finish | Return to the slice ceiling and remove weak dependencies |
| Monetisation lacks demand | Interest does not convert to purchases | Test offer/value; reduce costs; reassess model |
| Marketing is uneconomic | Acquisition exceeds credible contribution | Improve product/creative fit or stop the channel |
| Saves lose trust | Rollbacks or unexplained missing progress | Stop rollout; fix persistence and recovery |
| Art lacks consistency | Rooms or characters look unrelated | Enforce the asset bible and review in-game |
| Performance degrades with success | Busy shelters stutter or overheat | Profile at target maximums and simplify expensive detail |
| Content is expensive to sustain | Every event needs custom code | Use tested data-driven templates and fewer better events |

Review risks at milestone boundaries. A risk log is useful only if it changes decisions.

## 37. Development records and working practices

Keep the master brief, current scope, decision log, content data, known issues and verification notes versioned with the project. A future developer should be able to understand the game without reconstructing private conversations.

Use a small source-control workflow appropriate to the team. For substantial changes, isolate work on a branch, keep a reviewable diff and preserve a known working state. Use automated checks once a real execution environment is available. Do not claim CI is running before an actual workflow exists and reports results.

Record asset licences and dependency versions. Keep secrets out of source and screenshots. Add services through bounded adapters, with a documented reason for each dependency.

Keep user-specific income, account information and personal context out of public design documents. Marketing and world fiction do not need private biographical details.

**A useful milestone report contains**

What players can now do; what changed; why it improves the core loop; how it was verified; what remains uncertain; and the single highest-value next step. Report actual facts, not a percentage-complete estimate detached from evidence.

## 38. The response contract for a development assistant

When using this master prompt to continue development:

1. Read the repository and identify the exact current revision.
2. Summarise the implemented state and the next milestone in plain language.
3. Choose the smallest complete work package that advances the signature experience.
4. Implement it within the bunker repository and preserve existing work.
5. Verify behaviour through appropriate simulation, UI and device checks.
6. Fix observed failures before adding more scope.
7. Save changes in a reviewable form and provide clear access to the result.
8. Explain the playable outcome and any verification limits.
9. Update the design or decision log if evidence changes the proposal.
10. Continue authorised reversible work without repeatedly asking for routine implementation permission.

Do not replace implementation with a list of future promises. Do not replace testing with a screenshot. Do not replace product judgement with adding every feature in this document.

If a blocker prevents a required check, complete independent work, identify the blocker precisely and retain a reproducible state. Never invent a deployment URL, tester result, store approval, user metric or revenue figure.

## 39. Questions to resolve through evidence

These remain open rather than silently becoming promises:

- Does portrait play remain comfortable as the shelter grows?
- Is the core audience more interested in logistical depth, personalisation or narrative discovery?
- How much detail makes residents memorable without creating roster fatigue?
- Does landmark restoration distinguish the game strongly enough?
- Does the campaign unlock model support the content players expect?
- Which phones and operating systems can the final pipeline support?
- What population and map size remain readable and performant?
- Which languages justify launch support?
- How much additional play is needed before someone sees purchase value?
- Can a small team finish and support the proposed campaign economically?

Answer these through the slice, observed play and limited commercial testing. Avoid pretending that a longer design document resolves them.

## 40. Primary references and policy review

These sources inform implementation checks; they do not certify the game's quality, legal status or commercial potential. Public pages and store rules can change. Recheck the applicable requirements at implementation and submission.

1. Apple App Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
   Relevant to product presentation, permitted purchase arrangements, paid random-item disclosures and other review requirements.
2. Apple In-App Purchase: https://developer.apple.com/in-app-purchase/
   Relevant to entitlement delivery and restoring applicable purchases.
3. Android technical quality: https://developer.android.com/quality/technical
   Relevant to responsiveness, rendering, battery and device quality.
4. Android game slow-session measurement: https://developer.android.com/games/optimize/vitals/slow-session
   Relevant to measuring frame pacing rather than relying on an average fps label.
5. Google Play testing requirements for new personal developer accounts: https://support.google.com/googleplay/android-developer/answer/14151465
   Relevant only where those account-specific requirements apply; confirm actual eligibility and current process in the account.
6. Apple accessibility design guidance: https://developer.apple.com/design/human-interface-guidelines/accessibility
   A starting point for platform accessibility review, alongside actual device and assistive-technology testing.

Sources reviewed for this planning document on 16 November 2026. Numerical budgets, example prices, economic scenarios, lore, names and design choices in this document are project proposals, not statements taken from these sources.

## 41. Final creative directive

Build a game where a player can point to a room and remember why it exists.

“That greenhouse let us welcome the next family.”
“That clinic got Eli back on his feet.”
“That old platform connected us to another shelter.”
“That empty chamber became somewhere people could live.”

Make the world legible, the people memorable, the decisions consequential and the interface dependable. Earn repeat play through a settlement worth returning to.

The immediate objective is one polished chapter that proves those promises. The route to an international business is to validate that chapter, build economically around the evidence and maintain the quality players were promised.
