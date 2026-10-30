import {createRequire} from 'node:module';import{readdirSync,readFileSync,writeFileSync}from'node:fs';import assert from'node:assert/strict';
const {chromium}=createRequire(import.meta.url)('/Users/zhangjingwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root='http://127.0.0.1:4179/qianchuan-growth-playbook/';const browser=await chromium.launch({headless:true});const errors=[];
try{const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});page.on('pageerror',e=>errors.push(e.message));
const response=await page.goto(root,{waitUntil:'networkidle'});assert.equal(response.status(),200);
assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),'https://welay21312312321.github.io/qianchuan-growth-playbook/');
await page.locator('[data-area="live"]').tap();assert.equal(await page.locator('#network').getAttribute('data-active'),'live');
await page.locator('#step-4').tap();await page.locator('[data-response="weak"]').tap();assert.match(await page.locator('#step-evidence').innerText(),/首轮依据仍不足/);
await page.locator('[data-mix="creative"]').tap();assert.match(await page.locator('#mix-title').innerText(),/购买理由要清楚/);
await page.locator('.frame-button[data-time="11"]').tap();await page.waitForFunction(()=>Math.abs(document.getElementById('case-video').currentTime-11)<.4);assert(await page.locator('#case-video').evaluate(v=>v.readyState>=1));
assert.equal((await page.request.get(root+'.openai/hosting.json')).status(),404);assert.equal((await page.request.get(root+'source-document-readback.json')).status(),404);
const video=await page.request.get(root+'assets/qingyang-source.mp4',{headers:{Range:'bytes=0-0'}});assert.equal(video.status(),206);assert.match(video.headers()['content-type'],/video\/mp4/);assert.equal((await video.body()).length,1);
const entries=readdirSync('out/github-pages');assert(!entries.includes('.openai'));assert(!readFileSync('out/github-pages/index.html','utf8').includes('/Users/'));
assert.equal(errors.length,0);const result={passed:true,base_path:'/qianchuan-growth-playbook/',browser:'390px touch emulation',checks:['relative script/style/image/video assets','synergy, candidate and portfolio interactions','11s original-frame seek','correct canonical URL','config/source snapshots return404','video one-byte Range206','no console errors'],not_a_deployment:true};writeFileSync('evidence/pages-path-qa.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));}finally{await browser.close();}
