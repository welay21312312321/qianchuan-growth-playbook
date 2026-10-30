import { createRequire } from 'node:module';
import { writeFileSync,readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require('/Users/zhangjingwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({headless:true});
const report={started:new Date().toISOString(),checks:[],errors:[],screenshots:[],device_scope:'Browser viewport and touch emulation only; not a real phone test'};
const url='http://127.0.0.1:4178/';
const check=(name)=>report.checks.push(name);
async function screenshot(page,name,section){
  if(section)await page.evaluate(id=>window.scrollTo({top:document.getElementById(id).offsetTop-84,behavior:'instant'}),section);
  await page.waitForTimeout(800);await page.screenshot({path:`evidence/${name}.png`});report.screenshots.push(`${name}.png`);
}
try{
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'no-preference',acceptDownloads:true});
 const page=await context.newPage();page.on('pageerror',e=>report.errors.push(e.message));page.on('console',msg=>{if(msg.type()==='error')report.errors.push(msg.text());});
 const response=await page.goto(url,{waitUntil:'networkidle'});assert.equal(response.status(),200);await screenshot(page,'desktop-hero');
 assert.equal(await page.locator('.step-tab').count(),6);assert.equal(await page.locator('#source-list a').count(),8);check('page, six steps and current eight official sources');
 for(const id of ['brand','content','live']){await page.locator(`[data-area="${id}"]`).click();assert.equal(await page.locator('#network').getAttribute('data-active'),id);assert.equal(await page.locator(`[data-area="${id}"]`).getAttribute('aria-selected'),'true');}check('all three synergy panels update');
 await page.locator('[data-area="brand"]').focus();await page.keyboard.press('ArrowRight');assert.equal(await page.locator('[data-area="content"]').getAttribute('aria-selected'),'true');check('keyboard roving tab selection');
 await screenshot(page,'desktop-synergy','synergy');
 for(let i=0;i<6;i++){await page.locator(`.step-tab[data-step="${i}"]`).click();assert.equal(await page.locator('#loop-lab').getAttribute('data-step'),String(i));assert.equal(await page.locator(`#step-${i}`).getAttribute('aria-selected'),'true');}
 await page.locator('#step-next').click();assert.equal(await page.locator('#loop-lab').getAttribute('data-step'),'0');check('all six steps and restart');
 await page.locator('#step-4').click();assert.match(await page.locator('#step-evidence').innerText(),/已复测 \/ 限定条件/);
 await page.locator('[data-response="weak"]').click();assert.match(await page.locator('#step-evidence').innerText(),/首轮依据仍不足/);
 await page.locator('[data-response="limited"]').click();assert.match(await page.locator('#step-evidence').innerText(),/首轮依据仍不足/);
 await page.locator('[data-response="match"]').click();await page.locator('#comparable').uncheck();assert.match(await page.locator('#step-evidence').innerText(),/条件不同/);
 await page.locator('#comparable').check();await page.locator('[data-retest="unsupported"]').click();assert.match(await page.locator('#step-evidence').innerText(),/暂无复测支持/);
 await page.locator('[data-retest="support"]').click();assert.match(await page.locator('#step-evidence').innerText(),/已复测 \/ 限定条件/);check('candidate/library states depend on first-round evidence, comparable conditions and retest support');
 await screenshot(page,'desktop-loop','loop');
 const input=page.locator('#roi-base');await input.fill('4');assert.equal(await page.locator('#roi-result').innerText(),'4.8');await input.fill('0');assert.equal(await input.getAttribute('aria-invalid'),'true');assert.equal(await page.locator('#roi-result').innerText(),'—');await input.fill('1000');assert.equal(await page.locator('#roi-result').innerText(),'1200');await input.fill('4');check('ROI example calculation and invalid-input handling without invented upper threshold');
 await page.locator('#case-video').scrollIntoViewIfNeeded();await page.waitForFunction(()=>document.getElementById('case-video').readyState>=1,{timeout:15000});
 await page.evaluate(async()=>{const v=document.getElementById('case-video');v.muted=true;await v.play();});await page.waitForTimeout(650);assert(await page.locator('#case-video').evaluate(v=>v.currentTime>0&&!v.paused));await page.locator('#case-video').evaluate(v=>v.pause());
 for(const time of [8,11,0]){await page.locator(`.frame-button[data-time="${time}"]`).click();await page.waitForTimeout(200);assert(Math.abs(await page.locator('#case-video').evaluate(v=>v.currentTime)-time)<.3);}check('real H264 video decodes, plays muted in QA, and seeks to all three original frames');
 await screenshot(page,'desktop-case','case');
 for(const id of ['stable','explore','creative']){await page.locator(`[data-mix="${id}"]`).click();assert.equal(await page.locator(`[data-mix="${id}"]`).getAttribute('aria-selected'),'true');}check('all 40/30/30 portfolio panels');
 await screenshot(page,'desktop-portfolio','portfolio');
 await page.locator('#sources summary').click();assert(await page.locator('#source-list').isVisible());check('official sources disclosure');
 const downloadPromise=page.waitForEvent('download');await page.locator('#download-checklist').click();const download=await downloadPromise;await download.saveAs('evidence/downloaded-checklist.md');assert(readFileSync('evidence/downloaded-checklist.md','utf8').includes('新变体单独编号'));check('six-step checklist download contains method boundaries');
 await page.locator('#motion-toggle').click();assert(await page.locator('html').evaluate(el=>el.classList.contains('motion-paused')));check('motion pause control');
 await context.close();
 for(const width of [390,320]){
  const mobile=await browser.newContext({viewport:{width,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1});const p=await mobile.newPage();p.on('pageerror',e=>report.errors.push(e.message));await p.goto(url,{waitUntil:'networkidle'});
  for(const id of ['top','synergy','loop','case','portfolio']){
   await p.evaluate(id=>window.scrollTo({top:document.getElementById(id).offsetTop-75,behavior:'instant'}),id);await p.waitForTimeout(350);
   const layout=await p.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:innerWidth}));assert(layout.scroll<=layout.viewport+1,`${width}px overflow in ${id}: ${JSON.stringify(layout)}`);
  }
  await p.locator('[data-area="live"]').tap();assert.equal(await p.locator('#network').getAttribute('data-active'),'live');
  await p.locator('#step-4').tap();await p.locator('[data-response="weak"]').tap();assert.match(await p.locator('#step-evidence').innerText(),/首轮依据仍不足/);await p.locator('[data-response="match"]').tap();await p.locator('#step-next').tap();assert.equal(await p.locator('#loop-lab').getAttribute('data-step'),'5');
  await p.locator('[data-mix="creative"]').tap();assert.match(await p.locator('#mix-title').innerText(),/购买理由要清楚/);
  const targets=await p.locator('.mobile-nav a,.step-tab,.segmented button,.motion-toggle').evaluateAll(nodes=>nodes.filter(n=>n.getBoundingClientRect().height>0).map(n=>({text:n.textContent.trim(),height:n.getBoundingClientRect().height})));assert(targets.every(t=>t.height>=43.5),JSON.stringify(targets));
  if(width===390){for(const [name,id]of [['mobile-hero','top'],['mobile-synergy','synergy'],['mobile-loop','loop'],['mobile-case','case'],['mobile-portfolio','portfolio']])await screenshot(p,name,id);}
  check(`${width}px viewport: no horizontal overflow in every section; touch interactions and primary 44px targets`);await mobile.close();
 }
 const quiet=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});const q=await quiet.newPage();await q.goto(url);assert(await q.locator('#motion-toggle').isDisabled());assert.equal(await q.locator('.orbit-one').evaluate(e=>getComputedStyle(e).animationName),'none');assert.equal(await q.locator('.reveal').first().evaluate(e=>getComputedStyle(e).opacity),'1');check('system reduced-motion disables loops and keeps content visible');await quiet.close();
 const nojs=await browser.newContext({viewport:{width:390,height:844},javaScriptEnabled:false});const n=await nojs.newPage();await n.goto(url);assert(await n.locator('.noscript-content').isVisible());assert.equal(await n.locator('.section-head').first().evaluate(e=>getComputedStyle(e).opacity),'1');check('no-JavaScript fallback retains readable method and source entry');await nojs.close();
 assert.equal(report.errors.length,0,report.errors.join('\n'));report.passed=true;
}catch(error){report.passed=false;report.failure=String(error.stack||error);throw error;}finally{report.finished=new Date().toISOString();writeFileSync('evidence/browser-qa.json',JSON.stringify(report,null,2));await browser.close();console.log(JSON.stringify(report));}
