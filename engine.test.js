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
test("residents require beds and arrival supplies",()=>{
 const s=E.initial();assert(!E.invite(s).ok);E.dig(s,0,0);E.build(s,0,0,"quarters");
 const food=s.resources.food;assert(E.invite(s).ok);assert(s.residents===5&&s.resources.food===food-20);
 s.resources.food=0;assert(!E.invite(s).ok);
});
test("save round trip preserves progress",()=>{
 const s=E.initial();E.dig(s,3,1);E.dig(s,4,1);E.build(s,4,1,"tank");E.step(s);
 assert(JSON.stringify(E.restore(JSON.stringify(s)))===JSON.stringify(s));
});
test("invalid and disconnected saves are rejected",()=>{
 rejects(()=>E.restore("bad"));const s=E.initial();s.cells["0:7"]="farm";rejects(()=>E.restore(JSON.stringify(s)));
 delete s.cells["0:7"];s.resources.food=-1;rejects(()=>E.restore(JSON.stringify(s)));
});
console.log(count+" simulation tests passed.");
