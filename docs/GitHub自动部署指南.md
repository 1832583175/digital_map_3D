# GitHub Pages 自动部署 · 手把手

> 目标：**以后只需要 `git push`，GitHub 自己帮你 build + 上线**，不用本地打包、不用手动传文件。
> 全程约 15 分钟，只在第一次配置时需要动手。

---

## 零、先确认三件事

| 事项 | 说明 |
|---|---|
| GitHub 账号 | 免费版**只能给 public 仓库**开 Pages；private 仓库需要 GitHub Pro |
| 仓库源码 | 推上去的是**源码**（`src/`、`package.json`），不是 `dist/`。`dist` 和 `node_modules` 已被 `.gitignore` 排除，构建在云端完成 |
| 国内访问速度 | `*.github.io` 在国内**经常很慢甚至打不开**。它适合做演示、给海外同事看、或者当 CI 练手；**如果主要给国内用户看，还是用 COS + 备案域名** |

> 你这套工程已经是「git 友好」的状态了，不用改代码：
> - `vite.config.js` 里 `base: './'` → 相对路径，部署到 `https://用户名.github.io/仓库名/` 这种子目录也不会白屏
> - 路由是 **hash 模式**，`#/gdMap` 不会发到服务器 → 不需要配任何「404 回退到 index.html」规则
> - 访问根路径会自动跳 `/gdMap`（`src/router/index.js` 里配的）

本工程已经预置好两个文件，你不需要自己写：

```
.github/workflows/deploy.yml   ← CI 流水线（push 到 main 就自动跑）
public/.nojekyll               ← 让 GitHub 不要用 Jekyll 处理产物
```

---

## 一、在 GitHub 上创建仓库

1. 打开 <https://github.com/new>
2. 填写：

| 字段 | 填什么 |
|---|---|
| Repository name | `xinjiang-dashboard`（记下来，后面 URL 要用） |
| Description | 随便，可留空 |
| Public / Private | **必须选 Public**（免费版 Pages 的前提） |
| Add a README file | **不要勾** |
| Add .gitignore | **不要勾**（本地已经有了） |
| Choose a license | 留空 |

3. 点 **Create repository**

创建完会看到一个空仓库页面，显示 `git remote add origin ...` 的提示——先别关，下一步要用。

---

## 二、把本地代码推上去

工程目录：`C:\Users\Administrator\WorkBuddy\2026-11-03-16-32-28\xinjiang-dashboard`

### 2.1 仓库已经帮你初始化好了

我已经执行过 `git init` + 首次提交，你直接跳过这一步。想确认的话：

```bash
cd C:\Users\Administrator\WorkBuddy\2026-11-03-16-32-28\xinjiang-dashboard
git log --oneline
git status
```

如果 `git status` 显示干净（nothing to commit），说明没问题。

> 如果显示还有未提交的改动，执行：
> ```bash
> git add -A
> git commit -m "chore: 初始化"
> ```

### 2.2 关联远程仓库

把下面命令里的 `你的用户名` 换成你的 GitHub 用户名：

```bash
git remote add origin https://github.com/你的用户名/xinjiang-dashboard.git
git branch -M main
```

### 2.3 推送

```bash
git push -u origin main
```

**这时候会要求输入用户名和密码 —— 注意：GitHub 从 2021 年起不再接受账号密码，必须用 Personal Access Token（PAT）当密码。**

生成 Token：

1. 打开 <https://github.com/settings/tokens> → **Generate new token (classic)**
2. Note 填 `dashboard-deploy`
3. Expiration 选 90 days（到期再换）
4. **勾选 `repo` 这一整个大项**（必须，否则推不上去）
5. 拉到底 → Generate token
6. **立刻复制**（`ghp_xxxx...` 这串只显示一次，刷新就没了）

回到命令行：
- `Username`：填你的 GitHub 用户名
- `Password`：**粘贴刚才那串 token**（不是账号密码）

> 嫌麻烦可以用 SSH 免密，见文末附录 A。
> Windows 上第一次输入后会被「凭据管理器」记住，之后不用再输。

---

## 三、打开 Pages（关键一步，选错了永远不部署）

1. 进入仓库 → 顶部 **Settings**
2. 左侧栏拉到 **Pages**
3. **Build and deployment** → **Source** 下拉框
4. 选 **GitHub Actions**（⚠️ 千万别选 "Deploy from a branch"，那是另一种模式，和我们的工作流冲突）

选完之后不需要填任何东西，因为工作流里已经写好了。

---

## 四、看它自动跑起来

1. 点仓库顶部 **Actions** 标签
2. 会看到一条叫 **Deploy to GitHub Pages** 的记录，正在转圈
3. 点进去能看到两个阶段：
   - `build` —— 拉代码 → 装 Node → `npm ci` → `npm run build` → 上传产物
   - `deploy` —— 发布
4. 首次大约 1~2 分钟。**两个都变绿 ✓** 就成了

如果第一次没触发（比如你先推代码、后开 Pages），去 Actions 页面点 **Run workflow** 手动跑一次。

---

## 五、访问你的站点

部署成功后有两个地方能拿到地址：

- Actions 里 `deploy` 那一步的 **Output** 会打印 `page_url`
- 或者 Settings → Pages 顶部会显示 `Your site is live at ...`

地址格式固定为：

```
https://你的用户名.github.io/xinjiang-dashboard/
```

打开后会自动跳到：

```
https://你的用户名.github.io/xinjiang-dashboard/#/gdMap
```

**首次打开有约 5 秒开场动画**，动画播完左右面板才滑入，不是卡住了。

---

## 六、以后的日常流程（这就是「自动」的意义）

```bash
# 1. 改代码（比如改 src/config/site.js 里的标题）
# 2. 本地看一眼效果（可选）
npm run dev

# 3. 提交 + 推送
git add -A
git commit -m "feat: 改标题"
git push
```

推完就完事了——GitHub 会自动 build 并发布，1~2 分钟后线上就是新版。
**你不需要在本地跑 `npm run build`，也不需要手动传任何文件。**

想看部署进度：仓库 **Actions** 标签；想看线上效果且不吃缓存：`Ctrl + F5` 强刷。

> 本工程已经在 `docs/` 里放了 COS 部署指南，两条路不冲突：GitHub Pages 适合演示，COS 适合国内正式上线。

---

## 七、出问题照着这张表查

| 现象 | 原因 | 解决 |
|---|---|---|
| Actions 里没有记录 | 推送的分支不是 `main` | 检查 `git branch`，或改 `deploy.yml` 里的 `branches` |
| build 阶段红叉，报 `npm ci` 失败 | `package-lock.json` 和 `package.json` 不同步 | 本地跑一次 `npm install` 生成新 lockfile 再提交 |
| build 成功，deploy 报 `Resource not accessible by integration` | Pages 的 Source 没选 **GitHub Actions**，或仓库是 private | Settings → Pages 改 Source；private 仓库需升级 Pro |
| 页面白屏、控制台 404 一堆 `assets/...` | `base` 配成了 `/` 导致根路径找资源 | 本项目 `base: './'` 已避开，若你改过要改回来 |
| 页面 404 | 仓库名拼错，或 Pages 还没第一次发布完 | 用 Settings → Pages 里显示的地址；等 1 分钟 |
| 打开是 `404 There isn't a GitHub Pages site here` | Pages 没开启 / Source 没选对 | 回到第三节 |
| 一直转圈 build 不结束 | npm 源在国际网络慢 | 在 `deploy.yml` 的 `npm ci` 前加一行切镜像（见附录 B） |
| 改了代码线上没变 | 浏览器缓存 | `Ctrl + F5`；或开无痕窗口验证 |
| 中文 `.bat` 文件名乱码 | 终端编码差异，不影响功能 | 可忽略 |

---

## 八、费用与限制

- **完全免费**（public 仓库）
- 站点总大小上限 1GB（你现在 4MB，绰绰有余）
- 官方说明是软限制 100GB/月 流量、10 次构建/小时
- Actions 对 public 仓库免费不限时长

---

## 附录 A：改用 SSH 免密（不想每次输 token）

```bash
# 1. 生成密钥（一路回车，不设密码也行）
ssh-keygen -t ed25519 -C "your@email.com"

# 2. 复制公钥
cat ~/.ssh/id_ed25519.pub

# 3. 打开 https://github.com/settings/keys → New SSH key → 粘贴 → Add

# 4. 把远程地址换成 SSH 形式
git remote set-url origin git@github.com:你的用户名/xinjiang-dashboard.git

# 5. 验证
ssh -T git@github.com
# 看到 "Hi 用户名! You've successfully authenticated" 就成了
```

## 附录 B：加速 npm 安装（Actions 里可选）

如果 build 卡在 `npm ci` 很久，在 `deploy.yml` 的「安装依赖」步骤**之前**插一条：

```yaml
      - name: 切换 npm 镜像
        run: npm config set registry https://registry.npmmirror.com
```

## 附录 C：绑自定义域名

1. 仓库 Settings → Pages → **Custom domain** 填 `dash.yourdomain.com` → Save
2. 去 DNS 加一条 CNAME 记录，指向 `你的用户名.github.io`
3. 等解析生效，勾上 **Enforce HTTPS**
4. 记得再在 Pages 里点一次 Save 触发重新校验

> 注意：GitHub Pages 用的也是境外 IP，绑了域名速度也不会变快，只是好记。
