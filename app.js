"use strict";
const E=window.Bunker, $=id=>document.getElementById(id), SAVE="bunker-tycoon:v2";
let state=E.initial(), selected=null, paused=false, report={net:{},status:{}}, saveWarning="";
try {const raw=localStorage.getItem(SAVE)||localStorage.getItem("bunker-tycoon:v1");if(raw)state=E.restore(raw);}catch(e){saveWarning="Save could not be loaded. A fresh shelter is shown; export it before closing if storage is unavailable.";}

function node(tag,text){const el=document.createElement(tag);el.textContent=text;return el;}
let peopleSignature="";
function renderCommunity(){
 const box=$("arrival");box.replaceChildren();
 const f=E.forecast(state);
 if(f){
 box.append(node("strong",state.arrival.name),node("p",state.arrival.story));
 state.arrival.people.forEach(p=>box.append(node("p",p.name+" · "+(p.child?"Child":p.skill)+" · "+(p.health<100?"Needs treatment ("+p.health+"%)":"Healthy"))));
 box.append(node("p","After admission: "+f.beds+"/"+f.capacity+" beds; "+f.patients+" patients / "+f.medical+" staffed treatment places."));
 box.append(node("p","Arrival supplies: "+f.foodCost+" food + "+f.waterCost+" water. Additional consumption: "+f.extraDemand.toFixed(2)+" food and water each second."));
 box.append(node("p","Estimated stocks after 60 active seconds: "+Math.floor(f.foodAfter)+" food / "+Math.floor(f.waterAfter)+" water. Assumes admission now, current staffing, no new assignments or construction."));
 box.append(node("p","Temporary guests use the same beds and supplies, may work if healthy, and leave together after 180 active seconds. Unresolved arrivals wait without a deadline."));
 }else box.append(node("p","Entrance quiet. Next group in "+Math.max(0,state.nextArrival-state.seconds)+" active seconds."));
 $("community-log").textContent=state.log;
 document.querySelectorAll("[data-choice]").forEach(b=>{
 b.disabled=!f||(["admit","temporary"].includes(b.dataset.choice)?!f.canAdmit:b.dataset.choice==="supplies"&&(state.resources.food<f.foodCost||state.resources.water<f.waterCost));
 });
 const signature=JSON.stringify([state.people.map(p=>[p.id,p.job,p.health===100]),state.cells]);
 if(signature!==peopleSignature){
 peopleSignature=signature;$("people").replaceChildren();
 for(const p of state.people){
 const card=node("div","");card.className="person";
 card.append(node("strong",p.name+" · "+(p.child?"Child":p.skill)));
 const health=node("p","");health.dataset.person=p.id;card.append(health);
 const label=node("label","Assignment for "+p.name);label.className="hint";
 const select=document.createElement("select");select.setAttribute("aria-label","Assignment for "+p.name);
 select.append(new Option("Rest / unassigned",""));
 for(const [k,t] of Object.entries(state.cells))if(E.JOBS[t]){
 const o=new Option(E.ROOMS[t].name+" · "+k,k);
 o.disabled=state.people.some(other=>other.id!==p.id&&other.job===k)||(t==="clinic"&&p.skill!=="doctor");
 select.append(o);
 }
 select.value=p.job||"";select.disabled=p.child||p.health<100;
 select.onchange=()=>act(()=>E.assign(state,p.id,select.value||null));label.append(select);card.append(label);$("people").append(card);
 }
 }
 document.querySelectorAll("[data-person]").forEach(el=>{
 const p=state.people.find(p=>p.id===el.dataset.person);
 el.textContent=(p.health<100?"Recovering · "+Math.floor(p.health)+"%":"Healthy")+(p.until!==null?" · Guest: "+Math.max(0,p.until-state.seconds)+"s remaining":" · Permanent resident");
 });
}
function refreshCommunity(){renderCommunity();}

function message(text){$("message").textContent=text;}
function save(){try{localStorage.setItem(SAVE,JSON.stringify(state));$("save-status").textContent="Progress saved on this device.";}catch(e){$("save-status").textContent="Automatic saving unavailable. Use Export save to keep your progress.";}}
function updateResources(){
 const cap=E.capacity(state);
 $("resources").replaceChildren(...["materials","food","water","power","medicine"].map(n=>{
 const el=document.createElement("div");el.className="resource";
 const label=document.createElement("small");label.textContent=n.toUpperCase();
 const value=document.createElement("strong");value.textContent=Math.floor(state.resources[n])+(cap[n]?" / "+cap[n]:"");
 const rate=document.createElement("em");const v=report.net[n]||0;rate.textContent=(v>=0?"+":"")+v.toFixed(1)+" / second";
 el.append(label,value,rate);return el;
 }));
 $("population").textContent=state.residents+" residents / "+cap.housing+" beds";
}
function renderGrid(){
 const fragment=document.createDocumentFragment();
 for(let y=0;y<E.DEPTH;y++)for(let x=0;x<E.WIDTH;x++){
 const k=E.key(x,y), t=state.cells[k], def=E.ROOMS[t],b=document.createElement("button");
 b.className="cell "+(def?"room":t||"rock")+(!t&&!E.canDig(state,x,y)?" inactive":"")+(selected&&selected.x===x&&selected.y===y?" selected":"");
 if(def)b.style.setProperty("--accent",def.color);
 const icon=document.createElement("i");icon.textContent=def?def.icon:t==="shaft"?"↕":t==="empty"?"+":E.canDig(state,x,y)?"⛏":"·";
 const label=document.createElement("span");label.textContent=def?def.name:t==="shaft"?"Access shaft":t==="empty"?"Build room":E.canDig(state,x,y)?"Dig · "+E.digCost(y):"Bedrock";
 const status=document.createElement("b");status.dataset.status=k;status.textContent=report.status[k]||"";
 b.append(icon,label,status);b.setAttribute("aria-label","Floor "+(y+1)+", column "+(x+1)+": "+label.textContent);
 b.onclick=()=>{selected={x,y};renderGrid();renderPanel();};fragment.append(b);
 }$("grid").replaceChildren(fragment);
}
function renderPanel(){
 $("catalog").replaceChildren();$("dig").hidden=true;
 if(!selected)return;
 const {x,y}=selected,t=state.cells[E.key(x,y)],def=E.ROOMS[t];
 $("selection").textContent=def?def.name:t==="shaft"?"Access shaft":t==="empty"?"An empty chamber":"Unexcavated ground";
 $("detail").textContent=def?def.description:t==="shaft"?"Connects this floor to the surface. Dig below the lowest shaft to reach a new floor.":t==="empty"?"Choose a facility. Every room has a job in your growing community.":"Dig beside an existing chamber, or down from the central shaft.";
 if(!t){$("dig").hidden=false;$("dig").textContent="Excavate · "+E.digCost(y)+" materials";$("dig").disabled=!E.canDig(state,x,y)||state.resources.materials<E.digCost(y);}
 if(t==="empty")for(const [id,d] of Object.entries(E.ROOMS)){
 const b=document.createElement("button"),title=document.createElement("strong"),desc=document.createElement("span");
 title.textContent=d.icon+" "+d.name+" · "+d.cost;desc.textContent=d.description;b.append(title,desc);b.disabled=state.resources.materials<d.cost;
 b.onclick=()=>act(()=>E.build(state,x,y,id));$("catalog").append(b);
 }
}
function render(){updateResources();renderGrid();renderPanel();renderCommunity();}
function act(fn){const r=fn();message(r.message);save();render();}
$("dig").onclick=()=>selected&&act(()=>E.dig(state,selected.x,selected.y));
document.querySelectorAll("[data-choice]").forEach(b=>b.onclick=()=>act(()=>E.decide(state,b.dataset.choice)));
$("medicine").onclick=()=>act(()=>E.medicine(state));
$("salvage").onclick=()=>act(()=>{state.resources.materials=Math.min(1000000,state.resources.materials+25);return {message:"Recovered 25 building materials from entrance supplies."};});
$("pause").onclick=()=>{paused=!paused;$("pause").textContent=paused?"Resume":"Pause";message(paused?"Simulation paused. You can still plan and build.":"Simulation resumed.");};
$("export").onclick=()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="bunker-tycoon-save.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
$("import").onchange=async event=>{
 const file=event.target.files[0];if(!file)return;
 try{if(file.size>100000)throw Error("Too large");const next=E.restore(await file.text());
 if(!window.confirm("Replace this bunker with the imported save?"))return;
 state=next;selected=null;report={net:{},status:{}};save();render();message("Bunker restored.");
 }catch(e){message("Could not import this file. Your current bunker is unchanged.");}finally{event.target.value="";}
};
setInterval(()=>{
 if(paused||document.hidden)return;report=E.step(state);updateResources();refreshCommunity();
 document.querySelectorAll("[data-status]").forEach(el=>el.textContent=report.status[el.dataset.status]||"");
 // Refresh affordability without rebuilding controls or moving keyboard focus.
 if(selected){const {x,y}=selected;$("dig").disabled=!E.canDig(state,x,y)||state.resources.materials<E.digCost(y);
 const buttons=$("catalog").querySelectorAll("button");Object.values(E.ROOMS).forEach((d,i)=>{if(buttons[i])buttons[i].disabled=state.resources.materials<d.cost;});}
 if(report.shortage)message("Supplies are low. Check water treatment, farming and power. Residents are safe.");
 if(state.seconds%5===0)save();
},1000);
document.addEventListener("visibilitychange",()=>{if(document.hidden)save();});
window.addEventListener("pagehide",save);
render();if(saveWarning){message(saveWarning);$("save-status").textContent=saveWarning;}else $("save-status").textContent="Autosaves every five seconds and after building.";
