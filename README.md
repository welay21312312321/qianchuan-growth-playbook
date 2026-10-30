# 千川内容增长交互方案

三块协同 → 六步迭代 → 40/30/30持续供给。保留真实历史AI原片的表达拆解；人群和结果判断仅为演示假设，不含客户投放成绩。

## 当前状态

- v0.2.0：Tezign/Clipo真实品牌视觉、Images 2.5小可插画、同一素材随滚动连续迭代；手机矮屏用手动步骤，减少动态时固定素材位置。
- 原线上版已经通过 ChatGPT Sites 私有发布。
- 本人已于2026-10-30明确允许公开网页、源码及现有清扬示例。本仓库已公开，Pages已配置为GitHub Actions发布。
- 网页入口：https://welay21312312321.github.io/qianchuan-growth-playbook/ 。是否发布成功，以最新Actions运行及真实地址检查为准。
- 发布工作流带有 `PAGES_PUBLICATION_APPROVED` 仓库变量门禁；公开范围确认后已启用。后续推送main会更新网站，也可手动触发。

## 本地预览与检查

```sh
node dev-server.mjs
npm run check
node tests/browser-qa.mjs
node tests/brand-journey-qa.mjs
```

页面源文件在 `dist/`。GitHub Pages 工作流只上传构建器输出的网页白名单文件，不上传 `.openai`、文档源快照、QA截图或本地路径。

## GitHub Pages 发布流程

1. 保持本人确认的公开范围；本项目不自动购买或升级套餐。
2. Pages设置已选择GitHub Actions。
3. 仓库变量 `PAGES_PUBLICATION_APPROVED=true`，推送main或手动运行 `Deploy Qianchuan Pages`。
4. 工作流读取实际 Pages `base_url`，构建项目子路径兼容版本并部署。
5. 必须以 Actions 成功、Pages 返回地址和该地址的HTTP/资源验证作为发布完成证据。仓库链接不是线上网页链接。

Git 管理版本，网络可达性仍取决于托管服务、域名与实际使用网络，不保证不会被屏蔽。

## 设计依据

复用现有Tezign双拇指、Clipo无穷字标与蓝帽蓝眼镜小可。参考[OneTake](https://github.com/feitangyuan/onetake#chinese)的持续对象与可见因果原则，以本项目原生DOM/SVG独立实现滚动故事，未移植其库或模板。页面文字和图表均为原生HTML，而非整页生成图。
