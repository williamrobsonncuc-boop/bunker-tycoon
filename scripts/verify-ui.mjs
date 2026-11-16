import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
const { chromium } = await import(process.env.HAVEN_PLAYWRIGHT_MODULE || "playwright");
const root=process.cwd(), screenshots=resolve(root,"ui-check-artifacts");
await mkdir(screenshots,{recursive:true});
const types={".html":"text/html",".js":"text/javascript",".css":"text/css",".svg":"image/svg+xml"};
const server=createServer(async(req,res)=>{
 try{
 const path=resolve(root,"."+decodeURIComponent(new URL(req.url,"http://localhost").pathname==="/"?"/index.html":new URL(req.url,"http://localhost").pathname));
 if(!path.startsWith(root+sep)){res.writeHead(403);res.end();return;}
 const data=await readFile(path);res.writeHead(200,{"Content-Type":types[extname(path)]||"application/octet-stream"});res.end(data);
 }catch{res.writeHead(404);res.end("Not found");}
});
await new Promise(r=>server.listen(0,"127.0.0.1",r));
const url="http://127.0.0.1:"+server.address().port;
const browser=await chromium.launch({headless:true});
let page;
try{
 const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1});
 page=await mobile.newPage();page.setDefaultTimeout(12000);
 const errors=[];page.on("pageerror",e=>errors.push(e.message));
 await page.goto(url,{waitUntil:"networkidle"});
 await page.locator("#pause").click();
 assert.equal(await page.locator("[data-cell]").count(),56);
 assert.equal(await page.locator("[data-status]").count(),4);
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),"Phone layout overflows horizontally");
 const imageLoads=await page.evaluate(async()=>{
 const rooms=["generator","pump","farm","pantry","tank","battery","quarters","workshop","clinic"];
 const people=["engineer","water","farmer","doctor","general","child"];
 const paths=[...rooms.map(x=>"assets/rooms/"+x+".svg"),...people.map(x=>"assets/characters/"+x+".svg"),"assets/surface.svg"];
 return Promise.all(paths.map(async src=>{const img=new Image();img.src=src;await img.decode();return img.naturalWidth>0;}));
 });
 assert(imageLoads.every(Boolean),"An SVG asset failed to decode");
 await page.screenshot({path:resolve(screenshots,"phone-shelter.png"),fullPage:true});
 await page.locator('[data-cell="0:0"]').click();
 await page.locator("#dig").click();
 await page.locator('[data-build="quarters"]').click();
 await page.locator('[data-open="entrance"]').click();
 assert.equal(await page.locator('[data-choice="admit"]').isEnabled(),true);
 await page.locator('[data-choice="admit"]').click();
 await page.locator('[data-open="people"]').click();
 assert.equal(await page.locator("[data-person]").count(),7);
 assert.equal(await page.getByRole("combobox",{name:"Assignment for Kit"}).isDisabled(),true);
 assert.equal(await page.getByRole("combobox",{name:"Assignment for Eli"}).isDisabled(),true);
 await page.screenshot({path:resolve(screenshots,"phone-community.png"),fullPage:true});
 await page.keyboard.press("Escape");
 assert.equal(await page.locator("#controls").isVisible(),false);
 await page.reload({waitUntil:"networkidle"});
 assert.match(await page.locator("#shelter-summary").innerText(),/7 people/);
 await page.locator("#zoom").click();
 assert.equal(await page.locator("#zoom").getAttribute("aria-pressed"),"true");
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),"Overview overflows phone page");
 assert.deepEqual(errors,[],"Browser JavaScript errors");
 console.log("PASS phone: assets, map, navigation, construction, admission, roster, reload and overview");
 const desktop=await browser.newContext({viewport:{width:1366,height:900}});
 page=await desktop.newPage();page.on("pageerror",e=>errors.push(e.message));
 await page.goto(url,{waitUntil:"networkidle"});
 await page.locator("#pause").click();
 await page.locator('[data-open="people"]').click();
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),"Desktop page overflow");
 await page.screenshot({path:resolve(screenshots,"desktop-shelter.png"),fullPage:true});
 assert.deepEqual(errors,[]);
 console.log("PASS desktop: responsive control panel and no JavaScript errors");
 console.log("Browser checks complete. Physical-device and human visual review remain required.");
}catch(error){
 if(page)await page.screenshot({path:resolve(screenshots,"failure.png"),fullPage:true}).catch(()=>{});
 throw error;
}finally{
 await browser.close();
 await new Promise(r=>server.close(r));
}
