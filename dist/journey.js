'use strict';
(() => {
  const root = document.querySelector('#content-journey');
  if (!root) return;
  const card = root.querySelector('.story-content');
  const buttons = [...root.querySelectorAll('[data-story-step]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const compact = matchMedia('(max-height:730px) and (max-width:760px)');
  const points = [[12,42],[50,23],[86,42],[86,72],[50,78],[12,72],[12,42]];
  const beats = [
    ['先把购买理由讲清楚。','同一条素材先留编号，写清想吸引谁、用什么卖点、把人带到哪里。','品牌产品与直播间，给内容划清任务。','素材 A / 投前预期'],
    ['让系统探索合适的人。','平台结合投放目标、内容和用户反馈分配流量。我们用实际结果，检查内容吸引了谁。','不是猜机器贴了什么标签，而是看实际响应。','素材 A / 平台匹配'],
    ['看谁来了，也看谁买了。','把曝光、点击、进房与购买连起来。人群占比是线索，要结合基数、转化和成交看。','点击多，不代表购买理由已经成立。','素材 A / 实际反馈'],
    ['先对照预期，再决定改哪里。','人群偏了，就查场景与表达；进房后购买弱，就一起查产品权益与直播承接。','内容调整，要连着另外两块一起判断。','素材 A / 偏差诊断'],
    ['一轮好，先列候选。','在商品、权益、承接、目标与口径尽量可比的另一窗口复测。改了开头或卖点，就另建变体编号。','复测有支持，还要满足经营与规模要求。','素材 A / 可比复测'],
    ['把答案带回下一批。','有支持的结构带着适用条件入库。下一批写清保留什么、只改什么、再看什么结果。','同一条链路持续运转，经验才会留下来。','变体 A-01 / 下一批']
  ];
  let progress = 0, active = -1, weak = false, queued = false;
  const quiet = () => reduced.matches || document.documentElement.classList.contains('motion-paused');
  function seek(value) {
    progress = Math.max(0, Math.min(1, Number(value) || 0));
    const segment = Math.min(5, Math.floor(progress * 6));
    const local = progress === 1 ? 1 : progress * 6 - segment;
    // Each beat rests, then carries the same DOM card to the next anchor.
    const travel = Math.max(0, Math.min(1, (local - .28) / .60));
    const a = points[segment], b = points[segment + 1];
    const x = quiet() ? 50 : a[0] + (b[0] - a[0]) * travel;
    const y = quiet() ? 49 : a[1] + (b[1] - a[1]) * travel;
    card.style.left = x + '%'; card.style.top = y + '%';
    card.style.transform = `translate(-50%,-50%) rotate(${quiet() ? 0 : (b[0]-a[0])*.12*Math.sin(travel*Math.PI)}deg)`;
    const travelled = points.slice(0,segment+1).concat([[x,y]]);
    root.querySelector('#story-active-path').setAttribute('d',travelled.map((p,i)=>(i?'L':'M')+(p[0]*10)+' '+(p[1]*4.5)).join(' '));
    root.style.setProperty('--story-progress', String(progress));
    root.dataset.beat = String(segment);
    root.querySelector('.story-progress-fill').style.width = (progress * 100) + '%';
    if (active !== segment) {
      active = segment;
      root.querySelector('#story-title').textContent = beats[segment][0];
      root.querySelector('#story-copy').textContent = beats[segment][1];
      root.querySelector('#story-takeaway').textContent = beats[segment][2];
      root.querySelector('#story-card-label').textContent = beats[segment][3];
      root.querySelector('#story-count').textContent = String(segment + 1).padStart(2,'0') + ' / 06';
      buttons.forEach((button,i) => button.setAttribute('aria-pressed',String(i === segment)));
      root.querySelectorAll('[data-story-node]').forEach((node,i) => node.classList.toggle('is-active',i === segment));
    }
    renderFeedback();
    return {progress,beat:segment,x,y,quiet:quiet(),identity:card.id,feedback:weak?'weak':'match'};
  }
  function renderFeedback() {
    root.querySelector('#story-feedback-copy').textContent = weak
      ? '演示：点击多，购买弱 → 核对购买理由、商品权益与直播承接，再安排改版。'
      : '演示：人群与购买有回应 → 先列候选，再看可比复测与经营规模。';
    root.querySelector('#story-feedback').setAttribute('aria-pressed', String(weak));
    root.querySelector('#story-feedback').textContent = weak ? '换回另一种反馈 ↺' : '如果点击多，却没人买？ ↗';
  }
  function scrollProgress() {
    if(compact.matches){seek(progress);queued=false;return;}
    const rect = root.getBoundingClientRect();
    const header = document.querySelector('.site-header').getBoundingClientRect().height;
    const stage = root.querySelector('.story-sticky').getBoundingClientRect().height;
    const distance = Math.max(1, rect.height - stage);
    seek((header - rect.top) / distance);
    queued = false;
  }
  function schedule() { if (!queued) {queued=true; requestAnimationFrame(scrollProgress);} }
  buttons.forEach((button,i) => button.addEventListener('click',() => {
    const header = document.querySelector('.site-header').getBoundingClientRect().height;
    const stage = root.querySelector('.story-sticky').getBoundingClientRect().height;
    const top = scrollY + root.getBoundingClientRect().top - header;
    const distance = Math.max(1, root.offsetHeight - stage);
    const target = i / 6 + .025;
    if(compact.matches){seek(target);return;}
    window.scrollTo({top:top + distance * target,behavior:'instant'});
    seek(target);
  }));
  root.querySelector('#story-feedback').addEventListener('click',() => {
    weak=!weak; renderFeedback();
    const peer=document.querySelector(`[data-response="${weak?'weak':'match'}"]`);
    peer?.click();
  });
  root.querySelector('#story-skip').addEventListener('click',()=>{
    document.querySelector('#loop-lab').scrollIntoView({behavior:'instant',block:'start'});
    document.querySelector('#step-0').focus({preventScroll:true});
  });
  addEventListener('scroll',schedule,{passive:true}); addEventListener('resize',schedule);
  reduced.addEventListener('change',schedule);
  compact.addEventListener('change',schedule);
  new MutationObserver(schedule).observe(document.documentElement,{attributes:true,attributeFilter:['class']});
  window.qianchuanStory = {seek,snapshot:()=>seek(progress)};
  scrollProgress();
})();
