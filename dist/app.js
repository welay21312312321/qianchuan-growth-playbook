'use strict';
(() => {
  const $ = (q, root = document) => root.querySelector(q);
  const $$ = (q, root = document) => [...root.querySelectorAll(q)];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let motionPaused = reduced.matches;
  try { motionPaused = reduced.matches || localStorage.getItem('qianchuan-motion') === 'paused'; } catch (_) {}
  const motionButton = $('#motion-toggle');
  function setMotion(paused) {
    motionPaused = paused;
    document.documentElement.classList.toggle('motion-paused', paused);
    motionButton.setAttribute('aria-pressed', String(paused));
    $('#motion-label').textContent = reduced.matches ? '减少动态' : paused ? '开启动效' : '暂停动效';
    motionButton.disabled = reduced.matches;
    $$('.network-wires').forEach(svg => { try { paused ? svg.pauseAnimations() : svg.unpauseAnimations(); } catch (_) {} });
    try { localStorage.setItem('qianchuan-motion', paused ? 'paused' : 'on'); } catch (_) {}
  }
  motionButton.addEventListener('click', () => setMotion(!motionPaused));
  reduced.addEventListener('change', () => setMotion(reduced.matches || motionPaused));
  setMotion(motionPaused);
  function animatePanel(el) {
    if (motionPaused || reduced.matches || !el.animate) return;
    el.animate([{ opacity: .45, transform: 'translateY(7px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 240, easing: 'cubic-bezier(.2,.8,.2,1)' });
  }
  function tabsKeyboard(container) {
    container.addEventListener('keydown', event => {
      if (!['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
      const tabs = $$('[role="tab"]', container); const current = tabs.indexOf(event.target);
      if (current < 0) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (current + (['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1) + tabs.length) % tabs.length;
      tabs[next].click(); tabs[next].focus();
    });
  }
  $$('[role="tablist"]').forEach(tabsKeyboard);

  const areas = {
    brand: { tag: '先看品牌与产品', title: '卖给谁，<br>凭什么买？', description: '品牌看知名度与号召力；产品看需求人群有多广、与抖音用户是否匹配，以及规格、价格和权益组成的购买机制。', action: '品牌认知不足，就补可信证据；购买机制复杂，就讲清规格与权益，把产品条件变成顾客听得懂的购买理由。', partner: '品牌与商品团队确认事实、证据和权益。', path: 'M100 160 V242 H300 V278' },
    content: { tag: '先看内容怎样连接', title: '讲清购买理由，<br>给平台更多选择。', description: '既看实际转化贡献，也看场景、卖点和形式的丰富度。不同表达服务不同人群与需求，再用实际点击、购买和成交反馈验证。', action: '把产品价值做成有差别的视频表达，并与直播间当场商品和权益对齐。内容是服务生意的连接点。', partner: '内容团队与品牌、投手、直播团队对齐表达和实际响应。', path: 'M300 160 V278' },
    live: { tag: '先看直播间怎样承接', title: '拿到流量，<br>也要接住成交。', description: '流量影响进来多少人，留人、讲解、权益和购买路径影响能成交多少。流量与承接共同影响GMV的放大空间。', action: '有人进房却不买，先核对视频承诺和直播承接。视频里说的购买理由，要在直播间当场接得住。', partner: '直播团队确认主推商品、当场权益与讲解，投手回传同口径数据。', path: 'M500 160 V242 H300 V278' }
  };
  $$('[data-area]').forEach(button => button.addEventListener('click', () => {
    const id = button.dataset.area, data = areas[id];
    $$('[data-area]').forEach(tab => { const selected = tab === button; tab.classList.toggle('is-active', selected); tab.setAttribute('aria-selected', String(selected)); tab.tabIndex = selected ? 0 : -1; });
    $('#network').dataset.active = id; $('.wire-active').setAttribute('d', data.path);
    $('#area-tag').textContent = data.tag; $('#area-title').innerHTML = data.title; $('#area-description').textContent = data.description; $('#area-action').textContent = data.action;
    $('#area-partner').innerHTML = '<b>一起确认：</b>' + data.partner;
    $('#area-detail').setAttribute('aria-labelledby', button.id); animatePanel($('#area-detail'));
  }));

  const steps = [
    { title: '先写预期，<br>再让数据来回答。', description: '同一素材编号下，写清预期人群、场景、卖点、结构、开头和购买理由。人群标签与预期匹配范围在投前约定。', output: '一张可以回头对照的投前卡' },
    { title: '实际推来的人，<br>和计划一致吗？', description: '对照实际曝光、点击、进房、购买的量与转化，以及各环节可取得的人群结构。消耗、成交额、整体ROI和退款要一起看。', output: '投前 / 投后对照表与偏差线索' },
    { title: '首轮有潜力，<br>先把原因写下来。', description: '人群与购买线索吻合，且结果有潜力，先列候选；规模或信息不足，继续观察；偏差明确，就安排单变量改版。', output: '带原因的候选，或下一次改版假设' },
    { title: '复投原候选，<br>看能不能再出现。', description: '在另一窗口复测原候选素材。商品、价格权益、直播承接、投放目标与统计口径尽量可比；条件变了，就记录变化、补验证。', output: '原候选复测记录；新变体单独编号' },
    { title: '有支持才入库，<br>而且要带条件。', description: '满足经营与规模要求、可比复测有支持，才标记“已复测”。同时记录适用人群、商品权益、结构、已测规模、结果与限制。', output: '有适用条件、仍需持续跟踪的结构卡' },
    { title: '把上一轮答案，<br>带进下一批内容。', description: '逐条写清保留什么、只改什么、看哪个结果再验。保持投前卡、成片、结果与下一步相互对应。', output: '可投成片、可复用素材与明确的下批清单' }
  ];
  const state = { step: 0, response: 'match', comparable: true, retest: 'support' };
  const headers = text => `<div class="evidence-head"><span>${text}</span><span>演示假设</span></div>`;
  const verdicts = {
    match: { label: '有潜力，先列候选', text: '预期人群与购买线索相符，还要结合规模、整体经营和退款。', tone: '' },
    weak: { label: '购买弱，先找偏差', text: '点击多不等于愿意买；先核对购买理由、实际权益和直播承接。', tone: 'warning' },
    limited: { label: '信息不足，继续观察', text: '样本或规模不足，暂时不能把一次高ROI当成有效方向。', tone: 'neutral' }
  };
  function canStore() { return state.response === 'match' && state.comparable && state.retest === 'support'; }
  function evidenceForStep() {
    const v = verdicts[state.response];
    if (state.step === 0) return headers('素材 A / 投前卡') + '<dl class="brief-fields"><div><dt>预期人群</dt><dd>有控油诉求的男性消费者</dd></div><div><dt>购买场景</dt><dd>日常洗护补货</dd></div><div><dt>卖点与理由</dt><dd>控油表达 + 真实补货权益</dd></div><div><dt>脚本与开头</dt><dd>人群点名 → 权益 → 卖点 → 进房</dd></div></dl><p class="evidence-footnote">具体产品主张、权益和适用条件需品牌确认。</p>';
    if (state.step === 1) return headers('素材 A / 对照实际响应') + '<div class="funnel"><div><b>曝光</b><span>基数与人群</span></div><div><b>点击</b><span>响应了谁</span></div><div><b>进房</b><span>是否愿意来</span></div><div><b>购买</b><span>谁真正买</span></div></div>' + `<div class="evidence-verdict ${v.tone}"><b>${v.label}</b><br>${v.text}</div><p class="evidence-footnote">这是定性条件演示，未填造客户人群比例或漏斗数据。</p>`;
    if (state.step === 2) return headers('素材 A / 首轮判断') + `<ul class="evidence-list"><li><small>当前演示情况</small>${v.label}</li><li><small>判断理由</small>${v.text}</li><li><small>下一步</small>${state.response === 'match' ? '复测原候选，不直接进入稳定库。' : state.response === 'weak' ? '先核对承接，再只改一个主要因素，单独编号。' : '补足观察与规模，再决定是否列候选。'}</li></ul>`;
    if (state.step === 3) return headers('素材 A / 第二轮复测') + `<ul class="evidence-list"><li><small>复测对象</small>原候选素材，不用新变体成绩替代。</li><li><small>可比条件</small>${state.comparable ? '商品、权益、承接、目标与统计口径可比。' : '条件发生变化，先记录差异，补充验证。'}</li><li><small>第二轮观察</small>${state.retest === 'support' ? '假设有复测支持，继续核对经营与规模要求。' : '假设暂未支持，保留记录，继续诊断。'}</li></ul><p class="evidence-footnote">换新开头或卖点是在测新假设，另建变体编号。</p>`;
    if (state.step === 4) {
      const status = canStore() ? '已复测 / 限定条件' : state.response !== 'match' ? '首轮依据仍不足' : !state.comparable ? '条件不同 / 待补验证' : '暂无复测支持';
      const summary = canStore() ? '在此演示中，还假设经营与规模要求已满足。仅按已测条件记录，继续跟踪；不把两轮结果当因果证明。' : state.response !== 'match' ? '先解决首轮的购买偏差或信息不足，再决定候选资格。' : !state.comparable ? '本轮不能直接替代原候选的可比复测；记录变化，补充验证。' : '不进入已验证结构库。继续诊断，或安排有明确主变量的改版。';
      return headers('结构卡 / 条件判断') + `<div class="library-card"><span class="library-state">${status}</span><h4>控油诉求 × 补货</h4><p>${summary}</p><div class="library-tags"><span>适用人群</span><span>商品权益</span><span>已测规模</span><span>结果限制</span></div></div>`;
    }
    const next = canStore() ? ['保留有效购买理由与已测结构', '新变体只改一个主要因素', '再看实际人群、购买与经营表现'] : state.response === 'weak' ? ['保留明确的人群和商品信息', '核对承接后，只改一个表达因素', '单独编号，再看进房与购买变化'] : ['保留投前卡与本轮实际记录', '先补规模、数据或可比条件', '证据足够后再决定结构复用'];
    return headers('下一批 / 改动清单') + `<ul class="evidence-list"><li><small>保留什么</small>${next[0]}</li><li><small>只改什么</small>${next[1]}</li><li><small>用什么再验</small>${next[2]}</li></ul><p class="evidence-footnote">每次变化都连回素材编号和实际投放条件。</p>`;
  }
  function renderStep(animate = true) {
    const step = steps[state.step];
    $('#loop-lab').dataset.step = String(state.step);
    $$('.step-tab').forEach(tab => { const selected = Number(tab.dataset.step) === state.step; tab.classList.toggle('is-active', selected); tab.setAttribute('aria-selected', String(selected)); tab.tabIndex = selected ? 0 : -1; });
    const n = String(state.step + 1).padStart(2, '0');
    $('#step-number').textContent = n; $('#step-counter').textContent = n + ' / 06';
    $('#step-title').innerHTML = step.title; $('#step-description').textContent = step.description; $('#step-output').textContent = step.output; $('#step-evidence').innerHTML = evidenceForStep();
    $('#step-panel').setAttribute('aria-labelledby', 'step-' + state.step);
    $('#step-prev').disabled = state.step === 0; $('#step-next').innerHTML = state.step === 5 ? '重新走一遍 <span aria-hidden="true">↺</span>' : '下一步 <span aria-hidden="true">→</span>';
    $('#retest-controls').hidden = state.step < 3;
    if (animate) animatePanel($('#step-panel'));
  }
  $$('.step-tab').forEach(tab => tab.addEventListener('click', () => { state.step = Number(tab.dataset.step); renderStep(); }));
  $('#step-prev').addEventListener('click', () => { if (state.step > 0) { state.step--; renderStep(); } });
  $('#step-next').addEventListener('click', () => { state.step = (state.step + 1) % steps.length; renderStep(); });
  $$('[data-response]').forEach(button => button.addEventListener('click', () => {
    state.response = button.dataset.response;
    $$('[data-response]').forEach(b => { b.classList.toggle('is-active', b === button); b.setAttribute('aria-pressed', String(b === button)); });
    if (state.step < 2) state.step = 2; renderStep();
  }));
  $$('[data-retest]').forEach(button => button.addEventListener('click', () => { state.retest = button.dataset.retest; $$('[data-retest]').forEach(b => { b.classList.toggle('is-active', b === button); b.setAttribute('aria-pressed', String(b === button)); }); renderStep(); }));
  $('#comparable').addEventListener('change', event => { state.comparable = event.target.checked; if (state.step < 3) state.step = 3; renderStep(); });
  renderStep(false);

  $('#roi-base').addEventListener('input', event => {
    const value = Number(event.target.value), valid = event.target.value.trim() !== '' && Number.isFinite(value) && value > 0 && Number.isFinite(value * 1.2);
    event.target.setAttribute('aria-invalid', String(!valid));
    $('#roi-result').textContent = valid ? (Math.round(value * 120) / 100).toFixed(2).replace(/0$/, '').replace(/\.0$/, '') : '—';
    $('#roi-help').textContent = valid ? '还需满足经营、规模与复测要求；这是运营建议，不是平台出价目标。' : '请输入大于0的有效可比基准。这里仅计算参考挑战线。';
  });

  const video = $('#case-video'); let pendingTime = null;
  const insights = {
    0: ['先提出假设', '“兄弟们注意”是否吸引了预期人群，要拿实际曝光、点击与购买人群来对照。'],
    8: ['表达不等于证据', '产品画面与控油文字在讲卖点；功效主张需要品牌证据，画面本身不能证明产品效果。'],
    11: ['购买理由要能承接', '赠品和官方渠道表达，要与当场真实权益一致；能否带来购买，需要投后数据验证。']
  };
  function seekPending() {
    if (pendingTime === null || video.readyState < 1) return;
    try { video.pause(); video.currentTime = Math.min(pendingTime, Math.max(0, video.duration - .05)); $('#media-status').textContent = '已定位 ' + String(pendingTime).padStart(2, '0') + ' 秒，可点击播放查看原片'; pendingTime = null; } catch (_) { $('#media-status').textContent = '片段暂时无法定位，可直接拖动视频进度条。'; }
  }
  video.addEventListener('loadedmetadata', seekPending);
  $$('.frame-button').forEach(button => button.addEventListener('click', () => {
    const time = Number(button.dataset.time); pendingTime = time;
    $$('.frame-button').forEach(b => { b.classList.toggle('is-active', b === button); b.setAttribute('aria-pressed', String(b === button)); });
    const text = insights[time]; $('#frame-insight').innerHTML = '<span>' + text[0] + '</span><p>' + text[1] + '</p>'; animatePanel($('#frame-insight'));
    if (video.readyState >= 1) seekPending(); else { $('#media-status').textContent = '正在载入原片…'; video.load(); }
  }));
  function mediaError() { $('#media-status').innerHTML = '原片暂未加载成功，可<a href="https://tezign.feishu.cn/docx/MZBGdq1nZokbpMxN7LbcpYhVn6c" target="_blank" rel="noopener">查看飞书原片 ↗</a>。'; }
  video.addEventListener('error', mediaError); $('source', video).addEventListener('error', mediaError);

  const mixes = {
    stable: ['把已验证的结构持续做出来', '稳定的是购买逻辑，<br>表达仍然可以更新。', '复用有复测支持的脚本结构，保留适用人群、购买理由与已测条件，用新镜头与表达变体继续检验。'],
    explore: ['带着一个明确问题去测试', '换一个主要因素，<br>看响应怎样变化。', '测试新人群、卖点、脚本或开头。写清保留什么、只改什么、用哪个结果再验，让判断连回下一批素材。'],
    creative: ['给新的内容机会留出空间', '创意可以新，<br>购买理由要清楚。', '围绕目标人群和购买理由测试新场景、新形式。看创意带来谁、能否继续走向购买，再决定是否进入候选。']
  };
  $$('[data-mix]').forEach(button => button.addEventListener('click', () => {
    const data = mixes[button.dataset.mix]; $$('[data-mix]').forEach(b => { const selected = b === button; b.classList.toggle('is-active', selected); b.setAttribute('aria-selected', String(selected)); b.tabIndex = selected ? 0 : -1; });
    $('#mix-kicker').textContent = data[0]; $('#mix-title').innerHTML = data[1]; $('#mix-description').textContent = data[2]; $('#mix-detail').setAttribute('aria-labelledby', button.id); animatePanel($('#mix-detail'));
  }));

  $('#download-checklist').addEventListener('click', () => {
    const text = '# 千川内容迭代｜六步验证清单\n\n这是一份方法清单，不包含客户投放数据。\n\n1. 投前留卡：素材编号、预期人群/场景/卖点/结构/开头/购买理由；投前约定匹配范围、比较基准、观察量和经营底线。\n2. 首轮对照：实际曝光、点击、进房、购买及可取得的人群结构；连同消耗、成交额、整体ROI与退款。\n3. 列候选：有效线索及原因；规模或信息不足继续观察；偏差明确安排单变量改版。\n4. 可比复测：原候选在另一窗口复投，商品、价格权益、直播承接、目标与统计口径尽量可比。新变体单独编号。\n5. 条件入库：有支持才标已复测，留下适用人群、商品权益、结构、已测规模、结果与限制。\n6. 下批再生产：保留什么、只改什么、看哪个结果再验。\n\n可比基准ROI×1.20是运营挑战线，仍需经营、规模与复测支持，不是平台出价目标。两轮表面好不等于证明因果。\n\n原方案：https://tezign.feishu.cn/docx/MZBGdq1nZokbpMxN7LbcpYhVn6c\n';
    const url = URL.createObjectURL(new Blob([text], { type: 'text/markdown;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = '千川内容迭代-六步验证清单.md'; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 30000);
    $('#download-status').textContent = '已发起清单下载，可在浏览器下载列表查看。';
  });

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); } }), { threshold: .06, rootMargin: '0px 0px -25px 0px' });
    $$('.reveal').forEach(el => revealObserver.observe(el));
  } else $$('.reveal').forEach(el => el.classList.add('is-visible'));
  let queued = false;
  const progress = () => {
    const total = document.documentElement.scrollHeight - innerHeight;
    $('#read-progress').style.width = (total > 0 ? Math.min(100, scrollY / total * 100) : 0) + '%';
    let current = 'synergy';
    for (const id of ['synergy', 'loop', 'portfolio']) if (document.getElementById(id).offsetTop <= scrollY + innerHeight * .3) current = id;
    $$('[data-nav]').forEach(link => { const active = link.dataset.nav === current; link.classList.toggle('active', active); active ? link.setAttribute('aria-current', 'location') : link.removeAttribute('aria-current'); });
    queued = false;
  };
  addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(progress); } }, { passive: true });
  addEventListener('resize', progress); progress();
})();
