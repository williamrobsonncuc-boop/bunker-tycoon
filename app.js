"use strict";
const E=window.Bunker, $=id=>document.getElementById(id), SAVE="bunker-tycoon:v2";
const ART_NAMES={generator:"Power",pump:"Water",farm:"Farm",pantry:"Food store",tank:"Water tanks",battery:"Batteries",quarters:"Living quarters",workshop:"Workshop",clinic:"Clinic"};
const ICONS={
food:'<path d="M7 14C3 7 11 3 16 7C24 3 31 10 26 21C20 33 7 28 7 14Z" fill="#e7764d"/><path d="M16 8L15 2M15 6C17 1 24 3 22 7Z" fill="#7caa54"/>',
water:'<path d="M16 2C13 8 5 17 5 23A11 11 0 0027 23C27 17 19 8 16 2Z" fill="#67b8db"/><path d="M11 18L9 24" fill="none" stroke="#d5f2f8"/>',
power:'<path d="M19 1L5 19H15L11 33L28 13H18L22 1Z" fill="#f6c74e"/>',
materials:'<path d="M4 12L16 5L28 12V28H4Z" fill="#bb885b"/><path d="M4 12H28M16 12V28M8 17L12 21" fill="none"/>',
medicine:'<rect x="3" y="5" width="26" height="25" rx="5" fill="#f5debd"/><path d="M16 11V25M9 18H23" stroke="#cb6e56" stroke-width="5"/>',
room:'<rect x="3" y="5" width="26" height="24" rx="5" fill="#cfac72"/><path d="M11 29V15H22V29" fill="#f4ddb5"/>'
};
let state=E.initial(),selected=null,paused=false,panel=null,returnFocus=null,peopleSignature="",saveWarning="";
let report={net:{},status:{}};
try{const raw=localStorage.getItem(SAVE)||localStorage.getItem("bunker-tycoon:v1");if(raw)state=E.restore(raw);}
catch(e){saveWarning="A saved shelter could not be loaded. Use Export save to keep this session if storage is unavailable.";}
function node(tag,text=""){const el=document.createElement(tag);el.textContent=text;return el;}
function icon(name,className=""){const el=document.createElementNS("http://www.w3.org/2000/svg","svg");el.setAttribute("viewBox","0 0 32 36");el.setAttribute("aria-hidden","true");el.setAttribute("focusable","false");el.setAttribute("class",className);el.setAttribute("stroke","#292b2b");el.setAttribute("stroke-width","2.5");el.setAttribute("stroke-linecap","round");el.setAttribute("stroke-linejoin","round");el.innerHTML=ICONS[name]||ICONS.room;return el;}
function image(src,className){const img=document.createElement("img");img.src=src;img.alt="";img.className=className;img.draggable=false;return img;}
function portrait(p,className="portrait"){return image("assets/characters/"+(p.child?"child":p.skill)+".svg",className+(p.child?" child":"")+(p.health<100?" recovering":""));}
function message(text){$("message").textContent=text;}
function save(){try{localStorage.setItem(SAVE,JSON.stringify(state));$("save-status").textContent="Saved on this device.";}catch(e){$("save-status").textContent="Automatic saving unavailable. Export a save to keep your progress.";}}
function estimateReport(){const copy=JSON.parse(JSON.stringify(state));report=E.step(copy);}
function showPanel(name,focus=true){
 panel=name;returnFocus=document.activeElement;$("controls").hidden=false;document.querySelector(".layout").classList.add("panel-visible");
 const labels={build:"BUILD & MANAGE",people:"YOUR COMMUNITY",entrance:"SURFACE ACCESS",supplies:"SHELTER SUPPLIES"};
 $("panel-name").textContent=labels[name];
 document.querySelectorAll("[data-panel]").forEach(el=>el.hidden=el.dataset.panel!==name);
 document.querySelectorAll("[data-open]").forEach(b=>{b.setAttribute("aria-expanded",String(b.dataset.open===name));b.setAttribute("aria-controls","controls");});
 if(name==="people"||name==="entrance")renderCommunity();
 if(name==="activities")renderActivities();
 if(focus)document.querySelector('[data-panel="'+name+'"] h2').focus();
}
function closePanel(){
 panel=null;$("controls").hidden=true;document.querySelector(".layout").classList.remove("panel-visible");
 document.querySelectorAll("[data-open]").forEach(b=>b.setAttribute("aria-expanded","false"));
 if(returnFocus&&returnFocus.isConnected)returnFocus.focus();else $("build-button").focus();
}
function updateResources(){
 const cap=E.capacity(state);
 $("resources").replaceChildren(...["food","water","power","materials","medicine"].map(n=>{
 const el=node("div");el.className="resource";const label=node("small",n==="power"?"Energy":n);
 const value=node("strong",String(Math.floor(state.resources[n])));value.title=cap[n]?"Capacity "+cap[n]:"Building materials";
 const v=report.net[n]||0,rate=node("em",(v>=0?"+":"")+v.toFixed(1)+"/s"+(cap[n]?" · /"+cap[n]:""));
 el.append(icon(n,"resource-icon"),label,value,rate);return el;
 }));
 $("population").textContent=state.residents+" residents · "+cap.housing+" beds";
 $("shelter-summary").textContent=state.residents+" residents · "+cap.housing+" beds · "+(paused?"Paused":"Shelter active");
 const morale=$("morale");if(morale){const m=Math.round(state.morale??62);morale.textContent="CIVIL DEFENCE STATUS · "+(m>=75?"SECURE":m>=45?"STABLE":"STRAINED")+" · "+m+"%";morale.dataset.level=m>=75?"secure":m>=45?"stable":"strained";}
 $("arrival-dot").hidden=!state.arrival;
}
function roomResidents(k,t){
 const worker=state.people.find(p=>p.job===k&&!p.child&&p.health===100);
 if(E.JOBS[t])return worker?[worker]:[];
 if(t==="quarters"){
 const quarters=Object.keys(state.cells).filter(k=>state.cells[k]==="quarters"),index=quarters.indexOf(k);
 return state.people.slice(index*4,index*4+4).filter(p=>!p.job||p.child||p.health<100).slice(0,2);
 }return [];
}
function roomScene(k,t){
 const scene=node("span");scene.className="room-scene";scene.setAttribute("aria-hidden","true");
 scene.append(image("assets/rooms/"+t+".svg","room-art"));
 roomResidents(k,t).forEach((p,i)=>scene.append(portrait(p,"room-character"+(i?" secondary":""))));
 return scene;
}
function renderGrid(){
 const scroll=$("map-scroll"),left=scroll.scrollLeft,top=scroll.scrollTop,fragment=document.createDocumentFragment();
 for(let y=0;y<E.DEPTH;y++)for(let x=0;x<E.WIDTH;x++){
 const k=E.key(x,y),t=state.cells[k],def=E.ROOMS[t],b=node("button");
 b.className="cell "+(def?"room":t||"rock")+(!t&&!E.canDig(state,x,y)?" inactive":"")+(!t&&x===3?" shaft-ground":"");
 b.dataset.cell=k;b.setAttribute("aria-pressed",String(Boolean(selected&&selected.x===x&&selected.y===y)));
 if(selected&&selected.x===x&&selected.y===y)b.classList.add("selected");
 if(def){
 b.append(roomScene(k,t));const label=node("span",ART_NAMES[t]);label.className="room-title";
 const badge=icon(t==="generator"||t==="battery"?"power":t==="farm"||t==="pantry"?"food":t==="pump"||t==="tank"?"water":t==="clinic"?"medicine":"room");label.prepend(badge);
 const status=node("b",report.status[k]||(E.JOBS[t]?"Needs worker":"Ready"));status.dataset.status=k;b.append(label,status);
 }else if(t==="shaft"){const label=node("span",String(y+1));label.className="shaft-label";b.append(label);}
 else {const symbol=node("span",t==="empty"?"+":E.canDig(state,x,y)?"＋":"·");symbol.className="ground-icon";
 const label=node("span",t==="empty"?"Build here":E.canDig(state,x,y)?(x===3?"Dig down":"Dig · "+E.digCost(y)):"Earth");label.className="ground-label";b.append(symbol,label);}
 const name=def?E.ROOMS[t].name:t==="shaft"?"Access shaft":t==="empty"?"Empty chamber":E.canDig(state,x,y)?"Excavate for "+E.digCost(y)+" materials":"Unreachable earth";
 b.setAttribute("aria-label","Floor "+(y+1)+", column "+(x+1)+": "+name);
 b.onclick=()=>{selected={x,y};updateSelection();renderPanel();showPanel("build");};fragment.append(b);
 }
 $("grid").replaceChildren(fragment);scroll.scrollLeft=left;scroll.scrollTop=top;
}
function updateSelection(){document.querySelectorAll("[data-cell]").forEach(b=>{
 const on=Boolean(selected&&b.dataset.cell===E.key(selected.x,selected.y));b.classList.toggle("selected",on);b.setAttribute("aria-pressed",String(on));
});}
function renderPanel(){
 $("catalog").replaceChildren();$("dig").hidden=true;
 if(!selected){$("selection").textContent="Choose a chamber";$("detail").textContent="Tap outlined earth to excavate, then build a room. Dig below the central ladder to reach the next floor.";return;}
 const {x,y}=selected,t=state.cells[E.key(x,y)],def=E.ROOMS[t];
 $("selection").textContent=def?def.name:t==="shaft"?"Access shaft":t==="empty"?"Build a room":"Excavate";
 $("detail").textContent=def?def.description:t==="shaft"?"The ladder connects this floor to the entrance. Tap the earth directly below it to dig deeper.":t==="empty"?"Choose a facility for this chamber. New workplaces need an assigned healthy adult.":"Expand beside a chamber or below the lowest ladder. Scroll sideways to explore both wings.";
 if(!t){$("dig").hidden=false;$("dig").textContent="Dig · "+E.digCost(y)+" materials";$("dig").disabled=!E.canDig(state,x,y)||state.resources.materials<E.digCost(y);}
 if(t==="empty")for(const [id,d] of Object.entries(E.ROOMS)){
 const b=node("button"),title=node("strong",ART_NAMES[id]+" · "+d.cost),desc=node("span",d.description);
 b.append(image("assets/rooms/"+id+".svg","catalog-art"),title,desc);b.disabled=state.resources.materials<d.cost;b.dataset.build=id;
 b.onclick=()=>act(()=>E.build(state,x,y,id));$("catalog").append(b);
 }
}
function renderCommunity(){
 const cap=E.capacity(state);$("population").textContent=state.residents+" residents · "+cap.housing+" beds";
 if(panel==="entrance"){
 const box=$("arrival");box.replaceChildren();const f=E.forecast(state);
 if(f){
 box.append(node("strong",state.arrival.name),node("p",state.arrival.story));
 state.arrival.people.forEach(p=>{const row=node("div");row.className="arrival-person";row.append(portrait(p),node("p",p.name+" · "+(p.child?"Child":p.skill)+" · "+(p.health<100?"Needs care ("+Math.floor(p.health)+"%)":"Healthy")));box.append(row);});
 box.append(node("p","After admission: "+f.beds+"/"+f.capacity+" beds · "+f.patients+" patients / "+f.medical+" staffed clinic places."));
 box.append(node("p","Settling supplies: "+f.foodCost+" food + "+f.waterCost+" water. Ongoing demand: +"+f.extraDemand.toFixed(2)+" of each per second."));
 box.append(node("p","Stocks after 60 seconds: about "+Math.floor(f.foodAfter)+" food / "+Math.floor(f.waterAfter)+" water, with current staffing and no further construction."));
 box.append(node("p","Temporary guests occupy beds, may work if healthy, and leave together after 180 active seconds. Waiting groups have no deadline."));
 }else box.append(node("p","Next group in "+Math.max(0,state.nextArrival-state.seconds)+" active seconds."));
 $("community-log").textContent=state.log;
 document.querySelectorAll("[data-choice]").forEach(b=>b.disabled=!f||(["admit","temporary"].includes(b.dataset.choice)?!f.canAdmit:b.dataset.choice==="supplies"&&(state.resources.food<f.foodCost||state.resources.water<f.waterCost)));
 }
 if(panel!=="people")return;
 const signature=JSON.stringify([state.people.map(p=>[p.id,p.job,p.health===100]),state.cells]);
 if(signature!==peopleSignature){
 peopleSignature=signature;$("people").replaceChildren();
 for(const p of state.people){
 const card=node("div");card.className="person";card.append(portrait(p),node("strong",p.name+" · "+(p.child?"Child":p.skill)));
 const health=node("p");health.dataset.person=p.id;card.append(health);
 const label=node("label","Assignment");label.className="hint";const select=document.createElement("select");select.setAttribute("aria-label","Assignment for "+p.name);
 select.append(new Option("Rest / unassigned",""));
 for(const [k,t] of Object.entries(state.cells))if(E.JOBS[t]){
 const o=new Option(ART_NAMES[t]+" · "+k,k);o.disabled=state.people.some(other=>other.id!==p.id&&other.job===k)||(t==="clinic"&&p.skill!=="doctor");select.append(o);
 }
 select.value=p.job||"";select.disabled=p.child||p.health<100;select.onchange=()=>act(()=>E.assign(state,p.id,select.value||null));
 label.append(select);card.append(label);$("people").append(card);
 }
 }
 document.querySelectorAll("[data-person]").forEach(el=>{
 const p=state.people.find(p=>p.id===el.dataset.person);el.textContent=(p.health<100?"Recovering · "+Math.floor(p.health)+"%":"Healthy")+(p.until!==null?" · Guest "+Math.max(0,p.until-state.seconds)+"s":" · Resident");
 });
}
function renderActivities(){
 const box=$("activities");if(!box)return;box.replaceChildren();
 const intro=node("p","Operations keep the shelter feeling like a living installation: decode signals, recover stock, rehearse emergency procedure and watch the perimeter.");
 intro.className="hint";box.append(intro);
 const defs=E.ACTIVITY_DEFS||{},ops=state.activities||{last:{},completed:0,history:[]};
 for(const [id,d] of Object.entries(defs)){
  const card=node("article");card.className="activity-card";
  const title=node("h3",d.name);const desc=node("p",d.brief+" "+d.description);desc.className="activity-copy";
  const meta=node("p");meta.className="activity-meta";const costs=Object.entries(d.cost).map(([k,v])=>v+" "+k).join(" · ");const last=ops.last[id];const ready=last===undefined||state.seconds>=last+d.cooldown;meta.textContent=costs+" · "+(ready?"READY":"STANDBY "+(last+d.cooldown-state.seconds+"s"));
  const b=node("button",ready?"Run operation":"On standby");b.className="primary";b.dataset.activity=id;b.disabled=!ready;
  b.onclick=()=>act(()=>E.activity(state,id));card.append(title,desc,meta,b);box.append(card);
 }
 const completed=node("p","Operations completed: "+ops.completed);completed.className="hint";box.append(completed);
 const archive=node("div");archive.className="lore-archive";archive.append(node("h3","Civil Defence Archive"));
 (state.lore||[]).slice().reverse().forEach(line=>archive.append(node("p",line)));
 box.append(archive);
}
function render(){updateResources();renderGrid();renderPanel();renderCommunity();if(panel==="activities")renderActivities();}
function act(fn){const r=fn();message(r.message);if(r.ok!==false)save();estimateReport();render();}
function centerShaft(){const tile=document.querySelector('[data-cell="3:0"]');if(tile)$("map-scroll").scrollLeft=Math.max(0,tile.offsetLeft-$("grid").offsetLeft+tile.offsetWidth/2-$("map-scroll").clientWidth/2);}
$("center").onclick=centerShaft;
$("zoom").onclick=()=>{const on=document.body.classList.toggle("overview");$("zoom").textContent=on?"Room detail":"Overview";$("zoom").setAttribute("aria-pressed",String(on));requestAnimationFrame(centerShaft);};
$("close-panel").onclick=closePanel;document.addEventListener("keydown",e=>{if(e.key==="Escape"&&panel)closePanel();});
document.querySelectorAll("[data-open]").forEach(b=>{b.setAttribute("aria-expanded","false");b.setAttribute("aria-controls","controls");b.onclick=()=>{if(panel===b.dataset.open)closePanel();else showPanel(b.dataset.open);};});
$("dig").onclick=()=>selected&&act(()=>E.dig(state,selected.x,selected.y));
document.querySelectorAll("[data-choice]").forEach(b=>b.onclick=()=>act(()=>E.decide(state,b.dataset.choice)));
$("medicine").onclick=()=>act(()=>E.medicine(state));
$("salvage").onclick=()=>act(()=>{state.resources.materials=Math.min(1000000,state.resources.materials+25);return {ok:true,message:"Recovered 25 materials."};});
$("pause").onclick=()=>{paused=!paused;$("pause").textContent=paused?"Resume":"Pause";$("pause").setAttribute("aria-pressed",String(paused));updateResources();message(paused?"Paused. You can still plan and build.":"Shelter active.");};
$("export").onclick=()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="bunker-tycoon-save.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
$("import").onchange=async event=>{
 const file=event.target.files[0];if(!file)return;
 try{if(file.size>100000)throw Error("Too large");const next=E.restore(await file.text());
 if(!window.confirm("Replace this bunker with the imported save?"))return;
 state=next;selected=null;peopleSignature="";estimateReport();save();render();message("Shelter restored.");
 }catch(e){message("Could not import this file. The current bunker is unchanged.");}finally{event.target.value="";}
};
let visualSignature="";
setInterval(()=>{
 if(paused||document.hidden)return;report=E.step(state);updateResources();renderCommunity();
 const signature=JSON.stringify(state.people.map(p=>[p.id,p.job,p.health===100]));
 if(signature!==visualSignature){visualSignature=signature;renderGrid();}
 document.querySelectorAll("[data-status]").forEach(el=>{const k=el.dataset.status;el.textContent=report.status[k]||(E.JOBS[state.cells[k]]?"Needs worker":"Ready");});
 if(selected){const {x,y}=selected;$("dig").disabled=!E.canDig(state,x,y)||state.resources.materials<E.digCost(y);document.querySelectorAll("[data-build]").forEach(b=>b.disabled=state.resources.materials<E.ROOMS[b.dataset.build].cost);}
 if(panel==="activities")renderActivities();
 if(report.shortage)message("Supplies are low. Inspect farming, water and power. Residents are safe.");
 if(state.seconds%5===0)save();
},1000);
document.addEventListener("visibilitychange",()=>{if(document.hidden)save();});
window.addEventListener("pagehide",save);
estimateReport();render();requestAnimationFrame(centerShaft);
if(saveWarning)message(saveWarning);else $("save-status").textContent="Autosaves every five active seconds and after changes.";
