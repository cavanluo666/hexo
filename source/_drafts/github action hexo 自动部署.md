---
abbrlink: ''
categories: []
date: '2026-02-25T14:45:19.294966+08:00'
tags: []
title: 使用github action 自动部署 hexo
updated: '2026-02-25T14:45:21.405+08:00'
---
使用 GitHub Actions 自动部署 Hexo 博客是一种高效、免费的持续集成/持续部署（CI/CD）方案。这样，你只需专注于撰写 Markdown 文章，推送到代码仓库后，GitHub 会自动帮你完成环境配置、静态文件生成和页面发布。




本教程将引导你完成整个配置流程。

📝 前置准备

在开始之前，请确保你已具备以下条件：

1.  本地环境：已安装 Node.js 和 Git。
2.  GitHub 账号：拥有一个 GitHub 账号。
3.  两个仓库：
```
*   源码仓库 (Private/Source Repo)：用于存放 Hexo 博客的全部源代码（包括 source/_posts 目录下的 Markdown 文件）。
```


```
*   博客页面仓库 (Public/Page Repo)：用于存放自动生成的静态网页文件。仓库名必须为 .github.io。
```



🛠️ 步骤一：创建 Personal Access Token

这个 Token 将赋予 GitHub Actions 权限，使其能够将生成的静态文件推送到你的博客页面仓库。

1.  访问 GitHub 的 Personal access tokens 页面。
2.  点击 "Generate new token" (生成新令牌)。
3.  填写一个具有辨识度的名称，例如 hexo-deploy-token。
4.  Expiration (过期时间)：建议设置一个合理的过期时间以保证账户安全。
5.  Select scopes (选择范围)：在 repo 权限组下，勾选所有选项，以确保拥有对仓库的完全控制权。
6.  滚动到页面底部，点击 "Generate token"。
7.  重要：生成的 Token 只会显示一次！请务必现在复制并妥善保存。

🔐 步骤二：配置仓库 Secrets

接下来，将上一步生成的 Token 配置到你的 源码仓库 中。

1.  进入你的 源码仓库 页面。
2.  点击顶部的 "Settings" (设置)。
3.  在左侧菜单中，找到 "Secrets and variables" -> "Actions" (操作)。
4.  点击 "New repository secret" (新建仓库机密)。
5.  在 "Name" (名称) 栏填写一个变量名，例如 GH_TOKEN。
6.  在 "Value" (值) 栏粘贴你刚刚复制的 Token。
7.  点击 "Add secret" (添加机密) 完成配置。

⚙️ 步骤三：配置 GitHub Actions 工作流

现在，你需要在源码仓库中创建一个工作流文件，定义自动化部署的步骤。

1.  在你的 Hexo 项目根目录下，创建文件夹 .github/workflows。
2.  在 workflows 文件夹内，创建一个新的 YAML 文件，例如 hexo-deploy.yml。
3.  将以下内容复制到文件中，并根据注释提示进行修改：

name: Deploy Hexo Blog

触发条件：当有代码推送到 main 分支时
on:
  push:
```
branches:
```


```
- main  # 请确保此分支名与你源码仓库的默认分支一致
```



jobs:
  build-and-deploy:
```
runs-on: ubuntu-latest
```



```
steps:
```


```
# 1. 检出源码仓库的代码
```


```
- name: Checkout source code
```


```
uses: actions/checkout@v4
```



```
# 2. 设置 Node.js 环境
```


```
- name: Setup Node.js
```


```
uses: actions/setup-node@v3
```


```
with:
```


```
node-version: '18'  # 可指定你需要的 Node.js 版本
```



```
# 3. 安装依赖并生成静态文件
```


```
- name: Install dependencies and Generate static files
```


```
run: |
```


```
npm install -g hexo-cli
```


```
npm install
```


```
hexo clean
```


```
hexo generate
```



```
# 4. 部署到 GitHub Pages
```


```
# 这里使用一个流行的开源 Action 来简化部署过程
```


```
- name: Deploy to GitHub Pages
```


```
uses: JamesIves/github-pages-deploy-action@4.5.0
```


```
with:
```


```
# 使用内置的 GITHUB_TOKEN，其权限由仓库 Secrets 提供
```


```
token: ${{ secrets.GH_TOKEN }}  # 这里的 GH_TOKEN 需与你在仓库 Settings 中设置的 Secret 名称完全一致
```


```
# 指定部署的目标分支，通常为 gh-pages 或 master
```


```
branch: gh-pages
```


```
# 指定要部署的文件夹，Hexo 默认为 public
```


```
folder: public
```



✅ 步骤四：验证与启用 GitHub Pages

1.  推送代码：将你本地修改后的 Hexo 源码（包含新创建的 .github/workflows 目录）推送到源码仓库的 main 分支。
2.  查看 Actions：在源码仓库页面，点击顶部的 "Actions" (操作) 标签。你应该能看到一个正在运行或已成功完成的工作流。如果失败，可以根据日志信息排查问题。
3.  启用 Pages 服务：
```
*   进入你的 博客页面仓库 (.github.io)。
```


```
*   点击 "Settings" (设置) -> "Pages" (页面)。
```


```
*   在 "Source" (源) 选项下，将分支设置为 gh-pages (或者你在工作流文件中指定的分支)，根目录 /。
```


```
*   点击 "Save" (保存)。
```



稍等片刻，你的博客即可通过 https://.github.io 访问。

💡 常见问题与提示

*   分支名称：GitHub 仓库的默认分支可能是 main 或 master，请确保工作流文件中的 on.push.branches 字段与之匹配。
*   部署方式：本教程采用将静态文件部署到 gh-pages 分支的方式，这是目前比较推荐的实践。你也可以选择直接部署到 master 分支。
*   样式丢失：如果博客访问时没有样式，通常是因为资源路径配置错误。请检查 Hexo 源码目录下的 _config.yml 文件，确保 url 和 root 配置项正确无误。
*   自定义域名：如需绑定自定义域名，可以在源码仓库的 source 目录下新建一个名为 CNAME 的文件（无后缀），并在其中写入你的域名（例如 blog.example.com）。GitHub Actions 部署时会自动将其发布。
