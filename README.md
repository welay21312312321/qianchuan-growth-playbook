# 千川内容增长交互方案

三块协同 → 六步迭代 → 40/30/30持续供给。保留真实历史AI原片的表达拆解；人群和结果判断仅为演示假设，不含客户投放成绩。

## 当前状态

- 原线上版已经通过 ChatGPT Sites 私有发布。
- 本人已于2026-10-30明确允许公开网页、源码及现有清扬示例。本仓库已公开，Pages已配置为GitHub Actions发布。
- 网页入口：https://welay21312312321.github.io/qianchuan-growth-playbook/ 。是否发布成功，以最新Actions运行及真实地址检查为准。
- 发布工作流带有 `PAGES_PUBLICATION_APPROVED` 仓库变量门禁；公开范围确认后已启用。后续推送main会更新网站，也可手动触发。

## 本地预览与检查

```sh
node dev-server.mjs
node --check dist/app.js
node tests/content-check.mjs
```

页面源文件在 `dist/`。GitHub Pages 工作流只上传构建器输出的网页白名单文件，不上传 `.openai`、文档源快照、QA截图或本地路径。

## GitHub Pages 发布流程

1. 保持本人确认的公开范围；本项目不自动购买或升级套餐。
2. Pages设置已选择GitHub Actions。
3. 仓库变量 `PAGES_PUBLICATION_APPROVED=true`，推送main或手动运行 `Deploy Qianchuan Pages`。
4. 工作流读取实际 Pages `base_url`，构建项目子路径兼容版本并部署。
5. 必须以 Actions 成功、Pages 返回地址和该地址的HTTP/资源验证作为发布完成证据。仓库链接不是线上网页链接。

Git 管理版本，网络可达性仍取决于托管服务、域名与实际使用网络，不保证不会被屏蔽。
