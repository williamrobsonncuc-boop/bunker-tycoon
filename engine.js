"use strict";
(function(root) {
const WIDTH=7, DEPTH=8, VERSION=1;
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
const key=(x,y)=>x+":"+y;
function initial(){
 const cells={};
 cells[key(3,0)]="shaft"; cells[key(2,0)]="generator"; cells[key(4,0)]="pump";
 cells[key(1,0)]="farm"; cells[key(5,0)]="quarters";
 return {version:VERSION,cells,resources:{materials:400,food:80,water:80,power:40},residents:4,seconds:0};
}
function capacity(s){
 const c={food:120,water:120,power:60,housing:0};
 Object.values(s.cells).forEach(t=>{
 if(t==="pantry")c.food+=150;if(t==="tank")c.water+=150;
 if(t==="battery")c.power+=100;if(t==="quarters")c.housing+=4;
 });return c;
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
function invite(s){
 if(s.residents>=capacity(s).housing)return {ok:false,message:"Build living quarters first."};
 if(s.resources.food<20||s.resources.water<20)return {ok:false,message:"Welcoming a resident needs 20 food and 20 water."};
 s.resources.food-=20;s.resources.water-=20;s.residents++;
 return {ok:true,message:"A new resident has joined the shelter."};
}
function step(s){
 const r=s.resources,c=capacity(s), before={...r};
 const status={}; const entries=Object.entries(s.cells);
 const production={food:0,water:0,power:0,materials:0};
 function add(name,amount){const gain=Math.max(0,Math.min(amount,(c[name]??1000000)-r[name]));r[name]+=gain;production[name]+=gain;}
 for(const [k,t] of entries)if(t==="generator"){add("power",6);status[k]="Generating power";}
 for(const type of ["pump","farm","workshop"]){
  for(const [k,t] of entries.filter(e=>e[1]===type)){
   const out=t==="pump"?"water":t==="farm"?"food":"materials";
   const cost=t==="pump"?1:2;
   if(r[out]>=(c[out]??1000000)){status[k]="Storage full";continue;}
   if(r.power<cost){status[k]="Needs power";continue;}
   if(t==="farm"&&r.water<1){status[k]="Needs water";continue;}
   r.power-=cost;if(t==="farm")r.water--;
   add(out,t==="workshop"?1:2);status[k]="Operating";
  }
 }
 const need=s.residents*0.12;
 r.food=Math.max(0,r.food-need);r.water=Math.max(0,r.water-need);
 s.seconds++;
 return {status,production,net:Object.fromEntries(Object.keys(r).map(k=>[k,r[k]-before[k]])),shortage:r.food===0||r.water===0};
}
function restore(raw){
 const s=JSON.parse(raw);
 if(!s||s.version!==VERSION||!s.cells||!s.resources||!Number.isInteger(s.residents)||s.residents<1||s.residents>224||!Number.isInteger(s.seconds)||s.seconds<0)throw Error("Unsupported save");
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
 const clean={version:VERSION,cells,resources:{...s.resources},residents:s.residents,seconds:s.seconds};
 const cap=capacity(clean);if(clean.residents>cap.housing)throw Error("Insufficient housing");
 for(const n of ["food","water","power"])clean.resources[n]=Math.min(clean.resources[n],cap[n]);
 return clean;
}
const api={WIDTH,DEPTH,ROOMS,key,initial,capacity,digCost,canDig,dig,build,invite,step,restore};
if(typeof module!=="undefined"&&module.exports)module.exports=api;else root.Bunker=api;
})(typeof globalThis!=="undefined"?globalThis:this);
