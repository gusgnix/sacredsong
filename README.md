# 朱健仁答唱咏 · 合订本

GitHub Pages 静态翻书阅读器。默认访问地址：https://gusgnix.github.io/sacredsong/

- 密码入口后先打开前几页，再后台读取全本。
- 前后封面居中；前置页左白右文；谱页单数在左、双数在右；其余内容双页展示。
- 目录搜索、原书热点跳转、全屏、触屏与键盘翻页、阅读进度记忆、开合书与翻页动画。
- 网站不依赖 VPS、第三方字体或外部脚本。

## 内容保护

仓库仅保存网页源码及加密书籍文件。书目与全部 461 张书页采用 AES-256-GCM 加密，每个文件具有独立随机 IV；密钥由阅读密码经 PBKDF2-SHA256（600000 次）派生。口令与解密密钥不写入仓库，解密只在浏览器内存中进行。

静态加密不具备服务器限次验证；安全强度仍取决于口令。刷新页面后须重新输入阅读密码。原始 PDF、明文谱页、服务器与 GitHub 凭据均不属于本仓库。

## 更新书籍

需要 Python 与 cryptography。运行以下命令后，在隐藏提示中输入阅读密码：

```sh
python3 scripts/build-encrypted-assets.py --source-dir /path/to/existing-reader
```

输入目录须包含 assets/book.json 与 assets/pages/001.webp 等文件。更新后提交 reader-config.json 与 library/ 下的加密文件。禁止将原始输入或口令一并提交。

## 发布

仓库 Settings → Pages：Deploy from a branch，main 分支，根目录 /。本项目使用相对资源路径，可直接部署于 /sacredsong/。

当前书籍资源：2026-11-02 最新单左双右、无礼仪页居中合订本，461页。源文件 SHA256：eb0f1f137e525dd9941ab77549c99bbe996f8b438b64bd812929bcd535431280。
