"use strict";
const E=require("./engine.js");
let count=0;
function test(name,fn){fn();count++;console.log("PASS "+name);}
function assert(value,message="Assertion failed"){if(!value)throw Error(message);}
function rejects(fn){let threw=false;try{fn();}catch(e){threw=true;}assert(threw);}
test("excavation follows connected rooms and central shaft",()=>{
 const s=E.initial();assert(!E.dig(s,0,2).ok);assert(E.dig(s,3,1).ok);
 assert(E.dig(s,2,1).ok);assert(!E.dig(s,2,2).ok);assert(!E.canDig(s,-1,0));
});
test("failed construction preserves materials and occupied rooms",()=>{
 const s=E.initial(),before=JSON.stringify(s);assert(!E.build(s,2,0,"farm").ok);
 assert(JSON.stringify(s)===before);E.dig(s,3,1);E.dig(s,2,1);s.resources.materials=0;
 assert(!E.build(s,2,1,"farm").ok);assert(s.cells["2:1"]==="empty");
});
test("storage facilities increase only corresponding capacities",()=>{
 const s=E.initial();E.dig(s,0,0);const c=E.capacity(s);
 assert(E.build(s,0,0,"pantry").ok);assert(E.capacity(s).food===c.food+150);
 assert(E.capacity(s).water===c.water);
});
test("production depends on power and water",()=>{
 const s=E.initial();s.cells["2:0"]="empty";s.resources.power=0;s.resources.food=30;
 const r=E.step(s);assert(r.status["1:0"]==="Needs power");assert(s.resources.food<30);
 s.resources.power=10;s.resources.water=0;s.cells["4:0"]="empty";
 assert(E.step(s).status["1:0"]==="Needs water");
});
test("long simulation respects resource bounds and resident safety",()=>{
 const s=E.initial();for(let i=0;i<20000;i++)E.step(s);
 const c=E.capacity(s);for(const n of ["food","water","power"])assert(s.resources[n]>=0&&s.resources[n]<=c[n]);
 s.cells["1:0"]="empty";s.cells["4:0"]="empty";
 for(let i=0;i<2000;i++)E.step(s);assert(s.residents===4);assert(s.resources.food===0);
});
test("save round trip preserves progress",()=>{
 const s=E.initial();E.dig(s,3,1);E.dig(s,4,1);E.build(s,4,1,"tank");E.step(s);
 assert(JSON.stringify(E.restore(JSON.stringify(s)))===JSON.stringify(s));
});
test("invalid and disconnected saves are rejected",()=>{
 rejects(()=>E.restore("bad"));const s=E.initial();s.cells["0:7"]="farm";rejects(()=>E.restore(JSON.stringify(s)));
 delete s.cells["0:7"];s.resources.food=-1;rejects(()=>E.restore(JSON.stringify(s)));
});

test("admission is atomic and keeps families together",()=>{
 const s=E.initial(),before=JSON.stringify(s);assert(!E.decide(s,"admit").ok);assert(JSON.stringify(s)===before);
 E.dig(s,0,0);E.build(s,0,0,"quarters");assert(E.forecast(s).beds===7);
 assert(E.decide(s,"admit").ok);assert(s.residents===7);assert(s.people.some(p=>p.child));
 assert(s.people.filter(p=>p.id.startsWith("arrival-")).every(p=>p.job===null));
 assert(s.resources.food===65);assert(!E.decide(s,"admit").ok);
});
test("arrival choices consume appropriate resources",()=>{
 const s=E.initial();assert(E.decide(s,"supplies").ok);assert(s.residents===4&&s.resources.food===65);
 for(let i=0;i<120;i++)E.step(s);assert(s.arrival.name==="Civilian medical team");
 const food=s.resources.food;assert(E.decide(s,"decline").ok);assert(s.resources.food===food);
});
test("temporary guests leave together and save their expiry",()=>{
 const s=E.initial();E.dig(s,0,0);E.build(s,0,0,"quarters");assert(E.decide(s,"temporary").ok);
 const restored=E.restore(JSON.stringify(s));for(let i=0;i<180;i++)E.step(restored);
 assert(restored.residents===4);assert(restored.people.every(p=>p.until===null));assert(restored.arrival!==null);
});
test("staffing enforces availability, skill and one worker per room",()=>{
 const s=E.initial();assert(!E.assign(s,"resident-3","1:0").ok);
 E.assign(s,"resident-2",null);const food=s.resources.food;assert(E.step(s).status["1:0"]==="Needs worker");assert(s.resources.food<food);
 assert(E.assign(s,"resident-3","1:0").ok);assert(E.step(s).production.food===2);
 E.assign(s,"resident-3",null);E.assign(s,"resident-2","1:0");assert(E.step(s).production.food===2.5);
});
test("patients need staffed clinic, power and medicine to recover",()=>{
 const s=E.initial();E.dig(s,0,0);E.build(s,0,0,"quarters");E.decide(s,"admit");
 const child=s.people.find(p=>p.child),patient=s.people.find(p=>p.health<100);
 assert(!E.assign(s,child.id,"4:0").ok);assert(!E.assign(s,patient.id,"4:0").ok);
 E.dig(s,6,0);s.resources.materials=200;assert(E.build(s,6,0,"clinic").ok);
 assert(!E.assign(s,"resident-2","6:0").ok);assert(E.assign(s,"resident-3","6:0").ok);
 const before=patient.health;s.resources.medicine=0;E.step(s);assert(patient.health===before);
 assert(E.medicine(s).ok);E.step(s);assert(patient.health>before);
 s.resources.medicine=20;for(let i=0;i<100;i++)E.step(s);assert(patient.health===100);
});
test("forecasts leave state untouched and predict stock levels",()=>{
 const s=E.initial();E.dig(s,0,0);E.build(s,0,0,"quarters");
 const before=JSON.stringify(s),f=E.forecast(s);assert(JSON.stringify(s)===before);
 E.decide(s,"admit");for(let i=0;i<60;i++)E.step(s);
 assert(Math.abs(s.resources.food-f.foodAfter)<0.000001);assert(Math.abs(s.resources.water-f.waterAfter)<0.000001);
});
test("version one saves migrate without losing buildings or supplies",()=>{
 const s=E.initial();const legacy={version:1,cells:s.cells,resources:{materials:123,food:70,water:60,power:30},residents:4,seconds:42};
 const r=E.restore(JSON.stringify(legacy));assert(r.version===7&&r.people.length===4&&r.resources.materials===123&&r.seconds===42&&r.activities.completed===0&&r.daily.total===0&&r.chapter.claimed===false);
});
test("tampered people and assignments are rejected",()=>{
 const s=E.initial();s.people[1].id=s.people[0].id;rejects(()=>E.restore(JSON.stringify(s)));
 const t=E.initial();t.people[1].job=t.people[0].job;rejects(()=>E.restore(JSON.stringify(t)));
 const u=E.initial();u.arrival.people[0].health=-1;rejects(()=>E.restore(JSON.stringify(u)));
});
test("medical forecasts never heal the actual waiting group",()=>{
 const s=E.initial();s.resources.materials=1000;
 E.dig(s,0,0);E.build(s,0,0,"quarters");E.dig(s,6,0);E.build(s,6,0,"clinic");E.assign(s,"resident-3","6:0");
 const before=JSON.stringify(s);E.forecast(s);assert(JSON.stringify(s)===before);
});
test("daily supply drops are once per day and persist streaks",()=>{
 const s=E.initial();const first=E.dailyClaim(s,20000);assert(first.ok&&s.daily.total===1&&s.daily.streak===1);assert(!E.dailyClaim(s,20000).ok);const second=E.dailyClaim(s,20001);assert(second.ok&&s.daily.streak===2&&s.daily.total===2);assert(s.resources.food<=E.capacity(s).food);
});
test("chapter objectives and resident traits are persistent",()=>{
 const s=E.initial();assert(s.people[0].trait==="steady"&&s.people[2].trait==="resourceful");assert(E.chapterStatus(s).filter(g=>g.done).length===0);const r=E.restore(JSON.stringify(s));assert(r.people[1].trait==="observant"&&r.chapter.id==="first-blackout");
});
test("alerts pause for a deliberate response",()=>{
 const s=E.initial();for(let i=0;i<180;i++)E.step(s);assert(s.event&&s.event.id==="ventilation");const before=s.resources.materials;assert(E.resolveEvent(s,"defer").ok);assert(!s.event&&s.eventLog.length===1&&s.resources.materials===before);
});
test("Millbank landmark rewards long-term expansion",()=>{
 const s=E.initial();s.activities.completed=2;s.resources.materials=500;s.resources.power=50;assert(E.discoverLandmark(s).ok);assert(!E.discoverLandmark(s).ok);s.residents=8;s.people.push({id:"x1",name:"Test One",skill:"general",health:100,child:false,trait:"steady",job:null,until:null},{id:"x2",name:"Test Two",skill:"general",health:100,child:false,trait:"steady",job:null,until:null},{id:"x3",name:"Test Three",skill:"general",health:100,child:false,trait:"steady",job:null,until:null},{id:"x4",name:"Test Four",skill:"general",health:100,child:false,trait:"steady",job:null,until:null});assert(E.restoreLandmark(s).ok);assert(E.capacity(s).food===170);
});
test("resident requests create personal decisions",()=>{
 const s=E.initial();for(let i=0;i<240;i++)E.step(s);assert(s.request&&s.request.id==="space");const before=s.resources.materials;assert(E.resolveRequest(s,"defer").ok);assert(!s.request&&s.resources.materials===before&&s.requestLog.length===1);
});
test("maintenance and clinic rounds deepen operations",()=>{
 const s=E.initial();s.resources.materials=100;s.resources.power=30;s.resources.medicine=5;
 const maintenance=E.activity(s,"maintenance");assert(maintenance.ok&&s.activities.completed===1);
 for(let i=0;i<75;i++)E.step(s);
 const rounds=E.activity(s,"clinicRound");assert(rounds.ok&&s.activities.completed===2);
});
console.log(count+" simulation tests passed.");

