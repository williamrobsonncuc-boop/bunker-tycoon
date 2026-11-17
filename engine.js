"use strict";
(function(root) {
const WIDTH=7, DEPTH=8, VERSION=7;
const ROOMS={
  generator:{name:"Generator",icon:"⚡",cost:90,color:"#d3a544",description:"Produces 6 power/s.",power:6},
  pump:{name:"Water treatment",icon:"💧",cost:80,color:"#59aac4",description:"Uses 1 power/s to make 2 water/s."},
  farm:{name:"Hydroponics",icon:"🌱",cost:100,color:"#81b675",description:"Uses 2 power + 1 water/s to make 2 food/s."},
  pantry:{name:"Food store",icon:"▤",cost:60,color:"#c58e67",description:"Adds 150 food capacity."},
  tank:{name:"Water tanks",icon:"◉",cost:60,color:"#669cba",description:"Adds 150 water capacity."},
  battery:{name:"Battery bank",icon:"▥",cost:70,color:"#b19ccc",description:"Adds 100 power capacity."},
  quarters:{name:"Living quarters",icon:"⌂",cost:80,color:"#d18d90",description:"Adds space for 4 residents."},
  workshop:{name:"Workshop",icon:"⚒",cost:100,color:"#c5aa7d",description:"Uses 2 power/s to recover 1 material/s."}
};
ROOMS.clinic={name:"Clinic",icon:"✚",cost:120,color:"#c57979",description:"One assigned doctor treats one patient. Uses 1 power + 0.05 medicine/s."};
for(const t of ["generator","pump","farm","workshop"])ROOMS[t].description+=" Requires one healthy adult assigned here; matching skills give +25% output.";
const key=(x,y)=>x+":"+y;
function initial(){
 const cells={};
 cells[key(3,0)]="shaft"; cells[key(2,0)]="generator"; cells[key(4,0)]="pump";
 cells[key(1,0)]="farm"; cells[key(5,0)]="quarters";
 return community({version:VERSION,cells,resources:{materials:400,food:80,water:80,power:40},residents:4,seconds:0});
}
function capacity(s){
 const c={food:120,water:120,power:60,housing:0,medicine:100,medical:0};
 Object.values(s.cells).forEach(t=>{
 if(t==="clinic")c.medical++;if(t==="pantry")c.food+=150;if(t==="tank")c.water+=150;
 if(t==="battery")c.power+=100;if(t==="quarters")c.housing+=4;
 });if(s.landmark?.restored){c.food+=50;c.water+=50;c.power+=50;}return c;
}
function digCost(y){return 20+y*10;}
function canDig(s,x,y){
 if(!Number.isInteger(x)||!Number.isInteger(y)||x<0||x>=WIDTH||y<0||y>=DEPTH||s.cells[key(x,y)])return false;
 if(x===3)return y>0&&s.cells[key(x,y-1)]==="shaft";
 return Boolean(s.cells[key(x-1,y)]||s.cells[key(x+1,y)]);
}
function dig(s,x,y){
 if(!canDig(s,x,y))return {ok:false,message:"Excavate beside a room, or extend the central shaft downwards."};
 const cost=digCost(y);if(s.resources.materials<cost)return {ok:false,message:"Not enough materials. Recover supplies at the entrance."};
 s.resources.materials-=cost;s.cells[key(x,y)]=x===3?"shaft":"empty";
 return {ok:true,message:x===3?"New floor connected. Dig sideways to expand.":"Chamber excavated. Choose a room to build."};
}
function build(s,x,y,type){
 if(!ROOMS[type]||s.cells[key(x,y)]!=="empty")return {ok:false,message:"Choose an excavated, empty chamber."};
 if(s.resources.materials<ROOMS[type].cost)return {ok:false,message:"Not enough materials."};
 s.resources.materials-=ROOMS[type].cost;s.cells[key(x,y)]=type;
 return {ok:true,message:ROOMS[type].name+" built."};
}
function invite(s){return decide(s,"admit");}
function step(s){
 const r=s.resources,c=capacity(s), before={...r};
 const status={}; const entries=Object.entries(s.cells);
 const production={food:0,water:0,power:0,materials:0};
 function add(name,amount){const gain=Math.max(0,Math.min(amount,(c[name]??1000000)-r[name]));r[name]+=gain;production[name]+=gain;}
 for(const [k,t] of entries)if(t==="generator"){
 const w=worker(s,k);if(!w){status[k]="Needs worker";continue;}
 add("power",6*efficiency(w,t));status[k]="Generating power";
}
 for(const type of ["pump","farm","workshop"]){
  for(const [k,t] of entries.filter(e=>e[1]===type)){
   const w=worker(s,k);if(!w){status[k]="Needs worker";continue;}
   const out=t==="pump"?"water":t==="farm"?"food":"materials";
   const cost=t==="pump"?1:2;
   if(r[out]>=(c[out]??1000000)){status[k]="Storage full";continue;}
   if(r.power<cost){status[k]="Needs power";continue;}
   if(t==="farm"&&r.water<1){status[k]="Needs water";continue;}
   r.power-=cost;if(t==="farm")r.water--;
   add(out,(t==="workshop"?1:2)*efficiency(w,t));status[k]="Operating";
  }
 }
 const patients=s.people.filter(p=>p.health<100);
 const treated=new Set();
 for(const [k,t] of entries)if(t==="clinic"){
  const w=worker(s,k);
  if(!w||w.skill!=="doctor"){status[k]="Needs doctor";continue;}
  const p=patients.find(p=>!treated.has(p.id));
  if(!p){status[k]="No patients";continue;}
  if(r.power<1||r.medicine<0.05){status[k]="Needs power / medicine";continue;}
  r.power--;r.medicine=Math.max(0,r.medicine-0.05);p.health=Math.min(100,p.health+0.5);treated.add(p.id);status[k]="Treating "+p.name;
 }
 const need=s.people.reduce((n,p)=>n+(p.child?0.08:0.12),0);
 r.food=Math.max(0,r.food-need);r.water=Math.max(0,r.water-need);
 s.seconds++;
 const leaving=s.people.filter(p=>p.until!==null&&p.until<=s.seconds);
 if(leaving.length){s.people=s.people.filter(p=>!leaving.includes(p));s.log="Temporary guests continued to the civilian evacuation point.";s.residents=s.people.length;}
 if(!s.arrival&&s.seconds>=s.nextArrival)s.arrival=makeArrival(s.arrivalIndex);
 if(!s.event&&s.seconds>0&&s.seconds%180===0)s.event=makeEvent(s.eventIndex);
 if(!s.request&&s.seconds>0&&s.seconds%240===0)s.request=makeRequest(s.requestIndex);
 return {status,production,net:Object.fromEntries(Object.keys(r).map(k=>[k,r[k]-before[k]])),shortage:r.food===0||r.water===0};
}
function restore(raw){
 const s=JSON.parse(raw);
 if(!s||![1,2,3,4,5,6,VERSION].includes(s.version)||!s.cells||!s.resources||!Number.isInteger(s.residents)||s.residents<1||s.residents>224||!Number.isInteger(s.seconds)||s.seconds<0)throw Error("Unsupported save");
 for(const n of ["materials","food","water","power"])if(!Number.isFinite(s.resources[n])||s.resources[n]<0||s.resources[n]>1000000)throw Error("Invalid resources");
 const cells={};
 for(const [k,t] of Object.entries(s.cells)){
  const [x,y]=k.split(":").map(Number);
  if(key(x,y)!==k||!Number.isInteger(x)||!Number.isInteger(y)||x<0||x>=WIDTH||y<0||y>=DEPTH||!["shaft","empty",...Object.keys(ROOMS)].includes(t)||(x===3)!==(t==="shaft"))throw Error("Invalid chamber");
  cells[k]=t;
 }
 if(cells["3:0"]!=="shaft")throw Error("Missing entrance");
 // Every excavated cell must be connected to the entrance.
 const seen=new Set(["3:0"]),queue=[[3,0]];
 while(queue.length){const [x,y]=queue.shift();for(const [a,b] of [[x-1,y],[x+1,y],...(x===3?[[x,y-1],[x,y+1]]:[])]){
 const k=key(a,b);if(cells[k]&&!seen.has(k)){seen.add(k);queue.push([a,b]);}
 }}
 if(seen.size!==Object.keys(cells).length)throw Error("Disconnected chambers");
 let clean={version:VERSION,cells,resources:{...s.resources},residents:s.residents,seconds:s.seconds};
 if(s.version===1)clean=community(clean);else {validateCommunity(s,cells);Object.assign(clean,{people:s.people.map(p=>({...p,trait:typeof p.trait==="string"&&p.trait?p.trait:"steady"})),arrivalIndex:s.arrivalIndex,arrival:s.arrival?{...s.arrival,people:s.arrival.people.map(p=>({...p,trait:typeof p.trait==="string"&&p.trait?p.trait:"steady"}))}:null,nextArrival:s.nextArrival});}
 if(!Number.isFinite(s.morale))clean.morale=62;else clean.morale=Math.max(0,Math.min(100,s.morale));
 clean.activities=normaliseActivities(s.activities);clean.daily=normaliseDaily(s.daily);clean.landmark=normaliseLandmark(s.landmark);normaliseEventState(s);normaliseRequest(s);clean.request=s.request;clean.requestIndex=s.requestIndex;clean.requestLog=s.requestLog;clean.event=s.event;clean.eventIndex=s.eventIndex;clean.eventLog=s.eventLog;clean.chapter=normaliseChapter(s.chapter);clean.lore=Array.isArray(s.lore)?s.lore.filter(v=>typeof v==="string").slice(-8):[];clean.log=typeof s.log==="string"?s.log.slice(0,200):"";
 const cap=capacity(clean);if(clean.residents>cap.housing)throw Error("Insufficient housing");
 for(const n of ["food","water","power"])clean.resources[n]=Math.min(clean.resources[n],cap[n]);
 return clean;
}

const JOBS={generator:"engineer",pump:"water",farm:"farmer",workshop:"engineer",clinic:"doctor"};
const TRAITS=["steady","resourceful","empathetic","observant","restless","young"];
const SKILLS=["engineer","water","farmer","doctor","general"];
function person(id,name,skill,health=100,child=false,trait="steady"){return {id,name,skill,health,child,trait,job:null,until:null};}
function makeArrival(index){
 const groups=[
 {name:"The Vale family",story:"A family displaced by fighting needs shelter together.",people:[person("a","Mara","farmer",100,false,"resourceful"),person("b","Eli","engineer",60,false,"steady"),person("c","Kit","general",100,true,"young")]},
 {name:"Civilian medical team",story:"Two volunteers have left an evacuated field hospital.",people:[person("a","Sam","doctor",100,false,"empathetic"),person("b","Nuri","water",100,false,"observant")]},
 {name:"Evacuated neighbours",story:"Three neighbours reached your entrance after their district lost power.",people:[person("a","Jo","general",80,false,"restless"),person("b","Ren","farmer",100,false,"resourceful"),person("c","Alex","engineer",100,false,"observant")]}
 ];
 const g=groups[index%groups.length];return {name:g.name,story:g.story,people:g.people.map(p=>({...p,id:"arrival-"+index+"-"+p.id}))};
}
const REQUEST_DEFS=[
 {id:"space",person:"Mara",title:"A room of our own",body:"Mara asks for a proper family room so Kit can sleep without sharing the access corridor.",choices:{grant:{label:"Set aside materials",cost:{materials:30},result:"The Vale family gets a quiet corner and morale rises.",morale:5},defer:{label:"Defer the request",cost:{},result:"Mara accepts the delay, but the family feels the strain.",morale:-2}}},
 {id:"medicine",person:"Eli",title:"Eli needs a proper recovery plan",body:"Eli has been working around an old injury. Leon recommends a supervised recovery shift.",choices:{support:{label:"Prioritise recovery",cost:{medicine:2},result:"Eli rests safely and the clinic earns the community's trust.",morale:4},defer:{label:"Keep the clinic rationed",cost:{},result:"The treatment plan is postponed until supplies improve.",morale:-2}}},
 {id:"radio",person:"Noor",title:"Noor heard something on the radio",body:"Noor believes the repeating signal contains a name, not just a route marker.",choices:{listen:{label:"Give Noor the radio shift",cost:{power:2},result:"The message resolves into a human voice from the basin.",morale:5},defer:{label:"Keep the channel clear",cost:{},result:"The signal fades into static.",morale:0}}}
];
function normaliseRequest(s){s.request=s.request&&typeof s.request==="object"&&REQUEST_DEFS.some(r=>r.id===s.request.id)?s.request:null;s.requestIndex=Number.isSafeInteger(s.requestIndex)&&s.requestIndex>=0?s.requestIndex:0;s.requestLog=Array.isArray(s.requestLog)?s.requestLog.filter(v=>typeof v==="string").slice(-8):[];return s;}
function makeRequest(index){return REQUEST_DEFS[index%REQUEST_DEFS.length];}
function resolveRequest(s,choice){
 normaliseRequest(s);if(!s.request)return {ok:false,message:"No resident request is waiting."};const def=REQUEST_DEFS.find(r=>r.id===s.request.id),pick=def?.choices?.[choice];if(!pick)return {ok:false,message:"Unknown request response."};
 for(const [n,cost] of Object.entries(pick.cost))if((s.resources[n]||0)<cost)return {ok:false,message:"Response needs "+cost+" "+n+"."};
 for(const [n,cost] of Object.entries(pick.cost))s.resources[n]-=cost;s.morale=Math.max(0,Math.min(100,(s.morale??62)+(pick.morale||0)));s.requestLog.push(def.title+" · "+pick.result);s.requestLog=s.requestLog.slice(-8);s.lore=(s.lore||[]).concat(def.title+" · "+pick.result).slice(-8);s.request=null;s.requestIndex++;s.log=pick.result;return {ok:true,message:pick.result};
}
const EVENT_DEFS=[
 {id:"ventilation",title:"VENTILATION FAULT",body:"A pressure alarm is flickering in the east service duct. The air is still safe, but the filter room is losing efficiency.",choices:{repair:{label:"Repair immediately",cost:{materials:20,power:2},result:"The filter bank is stabilised. The shelter breathes easier.",morale:4},defer:{label:"Defer for now",cost:{},result:"The alarm is logged for the next maintenance window.",morale:-4}}},
 {id:"radio",title:"UNMARKED RADIO BURST",body:"A short transmission repeats the Lantern Programme handshake. It may be a nearby civilian team—or a decoy.",choices:{decode:{label:"Decode the burst",cost:{power:3},result:"The signal resolves into a safe-route marker.",morale:3},archive:{label:"Archive without decoding",cost:{},result:"The fragment is stored for a better-equipped team.",morale:0}}},
 {id:"inspection",title:"SURFACE INSPECTION",body:"Fresh marks surround the hatch. Nothing has entered the shelter, but the perimeter needs attention.",choices:{watch:{label:"Send a watch team",cost:{power:2,materials:8},result:"The hatch is secure and a maintenance cache is recovered.",morale:3,reward:{materials:16}},lockdown:{label:"Lock down the entrance",cost:{},result:"The shelter goes quiet until the next shift.",morale:-1}}}
];
function normaliseLandmark(l){return {discovered:Boolean(l&&l.discovered),restored:Boolean(l&&l.restored)};}
function discoverLandmark(s){
 s.landmark=normaliseLandmark(s.landmark);if(s.landmark.discovered)return {ok:false,message:"The Millbank platform is already mapped."};if((s.activities?.completed||0)<2||s.resources.materials<120||s.resources.power<10)return {ok:false,message:"Map two operations and reserve 120 materials + 10 power before surveying Millbank."};
 s.resources.materials-=120;s.resources.power-=10;s.landmark.discovered=true;s.morale=Math.min(100,(s.morale??62)+6);s.lore=(s.lore||[]).concat("MILLBANK PLATFORM LOCATED · A sealed municipal rail interchange lies beneath the eastern cut.").slice(-8);s.log="Millbank platform located. The old interchange can be restored.";return {ok:true,message:s.log};
}
function restoreLandmark(s){
 s.landmark=normaliseLandmark(s.landmark);if(!s.landmark.discovered)return {ok:false,message:"Survey the buried platform before restoring it."};if(s.landmark.restored)return {ok:false,message:"Millbank platform is already operational."};if(s.residents<8||s.resources.materials<180||s.resources.power<20)return {ok:false,message:"Restoration needs 8 residents, 180 materials and 20 power."};
 s.resources.materials-=180;s.resources.power-=20;s.landmark.restored=true;s.morale=Math.min(100,(s.morale??62)+12);s.lore=(s.lore||[]).concat("MILLBANK PLATFORM RESTORED · Haven 17 can now exchange people, supplies and news with the wider basin.").slice(-8);s.log="Millbank platform restored. Haven 17 has a future beyond its walls.";return {ok:true,message:s.log};
}
function normaliseEventState(s){s.event=s.event&&typeof s.event==="object"&&EVENT_DEFS.some(e=>e.id===s.event.id)?s.event:null;s.eventIndex=Number.isSafeInteger(s.eventIndex)&&s.eventIndex>=0?s.eventIndex:0;s.eventLog=Array.isArray(s.eventLog)?s.eventLog.filter(v=>typeof v==="string").slice(-8):[];return s;}
function makeEvent(index){return EVENT_DEFS[index%EVENT_DEFS.length];}
function resolveEvent(s,choice){
 normaliseEventState(s);if(!s.event)return {ok:false,message:"There is no active alert."};const def=EVENT_DEFS.find(e=>e.id===s.event.id),pick=def?.choices?.[choice];if(!pick)return {ok:false,message:"Unknown response."};
 for(const [n,cost] of Object.entries(pick.cost))if((s.resources[n]||0)<cost)return {ok:false,message:"Response needs "+cost+" "+n+"."};
 for(const [n,cost] of Object.entries(pick.cost))s.resources[n]-=cost;
 if(pick.reward)for(const [n,gain] of Object.entries(pick.reward))s.resources[n]=Math.min(1000000,s.resources[n]+gain);
 s.morale=Math.max(0,Math.min(100,(s.morale??62)+(pick.morale||0)));s.eventLog.push(def.title+" · "+pick.result);s.eventLog=s.eventLog.slice(-8);s.lore=(s.lore||[]).concat(def.title+" · "+pick.result).slice(-8);s.event=null;s.eventIndex++;s.log=pick.result;return {ok:true,message:pick.result};
}
const CHAPTER_OBJECTIVES=[
 {id:"reception",name:"Open the doors",brief:"Make the first admission decision.",done:s=>s.arrivalIndex>=1},
 {id:"operations",name:"Find a rhythm",brief:"Complete one shelter operation.",done:s=>(s.activities?.completed||0)>=1},
 {id:"clinic",name:"Protect the vulnerable",brief:"Build a clinic for the community.",done:s=>Object.values(s.cells).includes("clinic")},
 {id:"community",name:"A community of eight",brief:"Reach eight residents.",done:s=>s.residents>=8}
];
function normaliseChapter(c){return {id:"first-blackout",claimed:Boolean(c&&c.claimed)};}
function chapterStatus(s){return CHAPTER_OBJECTIVES.map(o=>({id:o.id,name:o.name,brief:o.brief,done:Boolean(o.done(s))}));}
function claimChapter(s){
 s.chapter=normaliseChapter(s.chapter);const goals=chapterStatus(s);if(s.chapter.claimed)return {ok:false,message:"Chapter already completed. The next briefing is not yet available."};if(!goals.every(g=>g.done))return {ok:false,message:"Complete the remaining chapter objectives before filing the report."};
 s.chapter.claimed=true;s.resources.materials=Math.min(1000000,s.resources.materials+100);s.morale=Math.min(100,s.morale+10);s.lore=(s.lore||[]).concat("Chapter One complete · The first blackout is over, but Haven 17 has become a permanent community.").slice(-8);s.log="Chapter One complete. Haven 17 is ready for the next briefing.";return {ok:true,message:s.log};
}
function normaliseDaily(d){const out={lastDay:null,streak:0,total:0};if(!d||typeof d!=="object")return out;if(d.lastDay===null||Number.isSafeInteger(d.lastDay))out.lastDay=d.lastDay;if(Number.isSafeInteger(d.streak)&&d.streak>=0)out.streak=d.streak;if(Number.isSafeInteger(d.total)&&d.total>=0)out.total=d.total;return out;}
function dailyClaim(s,day){
 if(!Number.isSafeInteger(day)||day<0)return {ok:false,message:"Daily supply date is invalid."};
 s.daily=normaliseDaily(s.daily);if(s.daily.lastDay===day)return {ok:false,message:"Daily supply drop already claimed. Check back tomorrow."};
 const gap=s.daily.lastDay===null?1:day-s.daily.lastDay;s.daily.streak=gap===1?s.daily.streak+1:1;s.daily.lastDay=day;s.daily.total++;
 const rewards=[["materials",45],["food",35],["water",35],["medicine",4]],pick=rewards[(s.daily.total-1)%rewards.length],cap=capacity(s);
 const gained=Math.min(pick[1],Math.max(0,(cap[pick[0]]??1000000)-s.resources[pick[0]]));s.resources[pick[0]]+=gained;s.morale=Math.min(100,(s.morale??62)+2);
 s.log="Daily civil-defence supply drop received: "+gained+" "+pick[0]+".";
 return {ok:true,message:s.log,reward:{resource:pick[0],amount:gained},streak:s.daily.streak};
}
const ACTIVITY_DEFS={
 radio:{name:"Long-range radio",brief:"Decode a surviving civil-defence broadcast.",cost:{power:3},cooldown:90,reward:"intel",description:"A quiet signal can reveal who is still out there.",lore:"The emergency network still repeats a three-note handshake from the old Civil Defence Authority."},
 salvage:{name:"Salvage sortie",brief:"Send a two-person team to the rail cut.",cost:{power:4,materials:10},cooldown:150,reward:"materials",description:"Recover sealed crates before the surface patrols return.",lore:"The buried Millbank platform was designed as a logistics interchange, not a shelter. Someone stocked it anyway."},
 drill:{name:"Civil defence drill",brief:"Run a timed shelter and fire-control exercise.",cost:{power:2},cooldown:120,reward:"morale",description:"Practice now, when the alarms are quiet.",lore:"Haven 17 was one of 312 municipal sites in the Lantern Programme. The paperwork survived; the chain of command did not."},
 patrol:{name:"Perimeter watch",brief:"Check the hatch, vents and drainage line.",cost:{power:5},cooldown:180,reward:"materials",description:"A watch team keeps the entrance from becoming a blind spot.",lore:"The surface is not empty. Footprints keep appearing outside the hatch after rain."}
};
function freshActivities(){return {last:{},completed:0,history:[]};}
function normaliseActivities(a){const out=freshActivities();if(!a||typeof a!=="object")return out;if(a.last&&typeof a.last==="object")for(const [k,v] of Object.entries(a.last))if(ACTIVITY_DEFS[k]&&Number.isSafeInteger(v)&&v>=0)out.last[k]=v;out.completed=Number.isSafeInteger(a.completed)&&a.completed>=0?a.completed:0;out.history=Array.isArray(a.history)?a.history.filter(v=>typeof v==="string").slice(-8):[];return out;}
function activity(s,id){
 const d=ACTIVITY_DEFS[id];if(!d)return {ok:false,message:"Unknown operation."};
 s.activities=normaliseActivities(s.activities);const ready=(s.activities.last[id]??-Infinity)+d.cooldown;
 if(s.seconds<ready)return {ok:false,message:d.name+" is on standby for "+(ready-s.seconds)+" seconds."};
 for(const [n,cost] of Object.entries(d.cost))if((s.resources[n]||0)<cost)return {ok:false,message:"Operation needs "+cost+" "+n+"."};
 for(const [n,cost] of Object.entries(d.cost))s.resources[n]-=cost;
 let message="";
 if(d.reward==="intel"){s.morale=Math.min(100,s.morale+4);message="Signal decoded. A route marker was added to the civil-defence map.";}
 if(d.reward==="materials"){const gain=id==="salvage"?28:18;s.resources.materials=Math.min(1000000,s.resources.materials+gain);message=id==="salvage"?"Sortie returned with "+gain+" materials and a sealed ration manifest.":"Perimeter team recovered "+gain+" materials from a maintenance cache.";}
 if(d.reward==="morale"){s.morale=Math.min(100,s.morale+12);message="Drill complete. Response time improved; morale rises.";}
 s.activities.last[id]=s.seconds;s.activities.completed++;s.activities.history.push(d.name+" · "+message);s.activities.history=s.activities.history.slice(-8);s.lore=(s.lore||[]).concat(d.lore).slice(-8);s.log=message;return {ok:true,message};
}
function community(s){
 s.resources.medicine=20;s.people=[];
 const starters=[["Ada","engineer","2:0","steady"],["Noor","water","4:0","observant"],["Rose","farmer","1:0","resourceful"],["Leon","doctor",null,"empathetic"]];
 for(let i=0;i<s.residents;i++){const p=person("resident-"+i,starters[i]?.[0]||"Resident "+(i+1),starters[i]?.[1]||"general");
 const job=starters[i]?.[2];p.trait=starters[i]?.[3]||"steady";if(job&&JOBS[s.cells[job]])p.job=job;s.people.push(p);}
 s.arrivalIndex=0;s.arrival=makeArrival(0);s.nextArrival=s.seconds;s.morale=62;s.activities=freshActivities();s.daily={lastDay:null,streak:0,total:0};s.landmark={discovered:false,restored:false};s.request=null;s.requestIndex=0;s.requestLog=[];s.event=null;s.eventIndex=0;s.eventLog=[];s.chapter={id:"first-blackout",claimed:false};s.lore=["2043 · Greywater Basin. The Long Blackout cut the region off from the surface.","Haven 17 was built under a decommissioned rail interchange by the Lantern Programme.","The first rule of the shelter is simple: every admission is a promise the systems must keep."];s.log="World War 3 continues above. This civilian shelter is independent of the fighting.";
 return s;
}
function worker(s,k){return s.people.find(p=>p.job===k&&!p.child&&p.health>=100);}
function efficiency(p,t){return p.skill===JOBS[t]?1.25:1;}
function assign(s,id,k){
 const p=s.people.find(p=>p.id===id);
 if(!p)return {ok:false,message:"Resident not found."};
 if(k===null){p.job=null;return {ok:true,message:p.name+" is resting."};}
 if(p.child||p.health<100)return {ok:false,message:"Children and recovering residents cannot work."};
 if(!JOBS[s.cells[k]])return {ok:false,message:"Choose a working facility."};
 if(s.cells[k]==="clinic"&&p.skill!=="doctor")return {ok:false,message:"A clinic needs a trained doctor."};
 if(s.people.some(other=>other.id!==id&&other.job===k))return {ok:false,message:"That facility is already staffed."};
 p.job=k;return {ok:true,message:p.name+" assigned to "+ROOMS[s.cells[k]].name+"."};
}
function forecast(s){
 if(!s.arrival)return null;
 const people=s.arrival.people,cap=capacity(s),n=people.length;
 const demand=people.reduce((v,p)=>v+(p.child?0.08:0.12),0);
 const doctors=Object.entries(s.cells).filter(([k,t])=>t==="clinic"&&worker(s,k)?.skill==="doctor").length;
 const projected=JSON.parse(JSON.stringify(s));
 projected.people.push(...JSON.parse(JSON.stringify(people)));projected.residents=projected.people.length;projected.arrival=null;projected.nextArrival=projected.seconds+1000;
 projected.resources.food=Math.max(0,projected.resources.food-n*5);projected.resources.water=Math.max(0,projected.resources.water-n*5);
 for(let i=0;i<60;i++)step(projected);
 return {foodAfter:projected.resources.food,waterAfter:projected.resources.water,count:n,beds:s.residents+n,capacity:cap.housing,foodCost:n*5,waterCost:n*5,
 extraDemand:demand,patients:s.people.concat(people).filter(p=>p.health<100).length,
 medical:doctors,canAdmit:s.residents+n<=cap.housing&&s.resources.food>=n*5&&s.resources.water>=n*5};
}
function decide(s,choice){
 if(!s.arrival)return {ok:false,message:"No group is waiting. New arrivals appear after 120 active seconds."};
 if(!["admit","temporary","supplies","decline"].includes(choice))return {ok:false,message:"Unknown decision."};
 const f=forecast(s),group=s.arrival;
 if(["admit","temporary"].includes(choice)&&!f.canAdmit)return {ok:false,message:"The whole group needs "+f.count+" free beds and "+f.foodCost+" food + water."};
 if(choice==="supplies"&&(s.resources.food<f.foodCost||s.resources.water<f.waterCost))return {ok:false,message:"Insufficient supplies for this group."};
 if(choice!=="decline"){s.resources.food-=f.foodCost;s.resources.water-=f.waterCost;}
 if(choice==="admit"||choice==="temporary"){
  for(const p of group.people)s.people.push({...p,until:choice==="temporary"?s.seconds+180:null});
  s.residents=s.people.length;
 }
 s.log=choice==="admit"?group.name+" joined the community. Assign healthy adults to facilities.":choice==="temporary"?group.name+" sheltered for 180 active seconds before onward evacuation.":choice==="supplies"?group.name+" received supplies and continued to an evacuation point.":group.name+" left the entrance. Their onward journey is unknown.";
 s.arrival=null;s.arrivalIndex++;s.nextArrival=s.seconds+120;
 return {ok:true,message:s.log};
}
function medicine(s){
 if(s.resources.materials<20||s.resources.medicine>95)return {ok:false,message:"Needs 20 materials and space for 5 medicine."};
 s.resources.materials-=20;s.resources.medicine+=5;return {ok:true,message:"Exchanged 20 materials for 5 medicine through the relief network."};
}
function validateCommunity(s,cells){
 if(!Number.isFinite(s.resources.medicine)||s.resources.medicine<0||s.resources.medicine>100)throw Error("Invalid medicine");
 if(!Array.isArray(s.people)||s.people.length!==s.residents||!Number.isSafeInteger(s.arrivalIndex)||s.arrivalIndex<0||!Number.isSafeInteger(s.nextArrival)||s.nextArrival<0)throw Error("Invalid community");
 const ids=new Set(),jobs=new Set();
 function check(p,arrival=false){
  if(!p||typeof p.id!=="string"||p.id.length>80||ids.has(p.id)||typeof p.name!=="string"||!p.name.length||p.name.length>60||!SKILLS.includes(p.skill)||typeof p.child!=="boolean"||!Number.isFinite(p.health)||p.health<0||p.health>100||!(p.until===null||Number.isSafeInteger(p.until)&&p.until>s.seconds))throw Error("Invalid person");
  ids.add(p.id);
  if(p.job!==null){
   if(arrival||p.child||p.health<100||typeof p.job!=="string"||!JOBS[cells[p.job]]||jobs.has(p.job)||(cells[p.job]==="clinic"&&p.skill!=="doctor"))throw Error("Invalid assignment");
   jobs.add(p.job);
  }
  if(arrival&&p.until!==null)throw Error("Invalid guest");
 }
 s.people.forEach(p=>check(p));
 if(s.arrival!==null){
  const expected=makeArrival(s.arrivalIndex);
  if(JSON.stringify(s.arrival)!==JSON.stringify(expected))throw Error("Invalid arrival");
  s.arrival.people.forEach(p=>check(p,true));
 }
}

const api={JOBS,TRAITS,ACTIVITY_DEFS,EVENT_DEFS,REQUEST_DEFS,CHAPTER_OBJECTIVES,chapterStatus,claimChapter,activity,dailyClaim,resolveEvent,resolveRequest,discoverLandmark,restoreLandmark,assign,forecast,decide,medicine,WIDTH,DEPTH,ROOMS,key,initial,capacity,digCost,canDig,dig,build,invite,step,restore};
if(typeof module!=="undefined"&&module.exports)module.exports=api;else root.Bunker=api;
})(typeof globalThis!=="undefined"?globalThis:this);
