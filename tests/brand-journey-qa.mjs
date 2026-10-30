import {createRequire} from 'node:module';
import {writeFileSync,mkdirSync} from 'node:fs';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require('/Users/zhangjingwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const url=process.env.QA_URL||'http://127.0.0.1:4178/';
const output=process.env.QA_OUTPUT||'evidence/v020';mkdirSync(output,{recursive:true});
const browser=await chromium.launch({headless:true});
const report={url,checked:new Date().toISOString(),checks:[],errors:[],phone_scope:'Touch viewport emulation; physical phone/network not verified'};
try{
 for(const width of [1440,390,320,375]){
  const context=await browser.newContext({viewport:{width,height:width===1440?1000:width===375?667:844},isMobile:width<700,hasTouch:width<700});
  const page=await context.newPage();page.on('pageerror',e=>report.errors.push(e.message));
  const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000});assert.equal(response.status(),200);
  await page.waitForFunction(()=>window.qianchuanStory&&[...document.querySelectorAll('.brand-lockup img,.brand-hero-image')].every(e=>e.complete&&e.naturalWidth>0),null,{timeout:20000});
  assert.equal(await page.locator('.brand-lockup').count(),2);
  for(const img of await page.locator('.brand-lockup img,.brand-hero-image').all())assert(await img.evaluate(e=>e.complete&&e.naturalWidth>0));
  const h1=await page.locator('h1').innerText();assert.match(h1,/看懂平台推流/);
  await page.screenshot({path:`${output}/hero-${width}.png`});
  const token=await page.locator('#carried-content').elementHandle();
  for(const p of [0,.18,.38,.54,.71,.88,1]){
    const a=await page.evaluate(p=>window.qianchuanStory.seek(p),p);
    const b=await page.evaluate(p=>window.qianchuanStory.seek(p),p);assert.deepEqual(a,b,'same progress gives exact same state');
    assert(await token.evaluate(e=>e===document.getElementById('carried-content')),'same content node survives every boundary');
    const card=await page.locator('#carried-content').boundingBox(),board=await page.locator('.story-board').boundingBox();
    assert(card.x>=board.x-1&&card.x+card.width<=board.x+board.width+1,`card within board at ${width}/${p}`);
  }
  for(let i=0;i<6;i++){
   await page.locator(`[data-story-step="${i}"]`).click();await page.waitForTimeout(100);
   assert.equal(await page.locator('#content-journey').getAttribute('data-beat'),String(i),`scroll-backed step ${i}`);
  }
  await page.locator('[data-story-step="2"]').click();await page.locator('#story-feedback').click();
  assert.match(await page.locator('#story-feedback-copy').innerText(),/点击多，购买弱/);
  assert.equal(await page.locator('[data-response="weak"]').getAttribute('aria-pressed'),'true');
  await page.locator('#story-feedback').click();assert.match(await page.locator('#story-feedback-copy').innerText(),/人群与购买有回应/);
  await page.locator('[data-story-step="4"]').click();await page.waitForTimeout(120);await page.screenshot({path:`${output}/story-${width}.png`});
  const targetSizes=await page.locator('[data-story-step],#story-feedback,#story-skip').evaluateAll(es=>es.map(e=>e.getBoundingClientRect().height));assert(targetSizes.every(h=>h>=43.5));
  for(const id of ['top','synergy','content-journey','loop-lab','case','portfolio']){
   await page.locator('#'+id).scrollIntoViewIfNeeded();assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${width} overflow at ${id}`);
  }
  await page.locator('#story-skip').click();assert.equal(await page.evaluate(()=>document.activeElement.id),'step-0');
  report.checks.push(`${width}px: brand assets, persistent card, deterministic scroll states, every step, feedback branch, skip and 44px controls, no overflow`);
  await context.close();
 }
 const quiet=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});const page=await quiet.newPage();await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000});await page.waitForFunction(()=>window.qianchuanStory);
 for(const p of [0,.5,1]){const s=await page.evaluate(p=>window.qianchuanStory.seek(p),p);assert.equal(s.x,50);assert.equal(s.y,49);assert(s.quiet);}
 report.checks.push('reduced motion: static card while information remains selectable');await quiet.close();
 assert.equal(report.errors.length,0,report.errors.join('\n'));report.passed=true;
}catch(error){report.passed=false;report.failure=error.stack;throw error;}finally{writeFileSync(`${output}/brand-journey-qa.json`,JSON.stringify(report,null,2));await browser.close();console.log(JSON.stringify(report,null,2));}
