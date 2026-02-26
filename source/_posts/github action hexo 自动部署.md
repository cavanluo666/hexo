---
abbrlink: ''
categories:
- - 教程
cover: https://img.laoda.de/i/2024/02/21/222800-1.webp
date: '2026-02-25T14:45:19.294966+08:00'
tags:
- 教程
title: 使用github action 自动部署 hexo
updated: '2026-02-26T15:28:02.172+08:00'
---
使用 GitHub Actions 自动部署 Hexo 博客是一种高效、免费的持续集成/持续部署（CI/CD）方案。这样，你只需专注于撰写 Markdown 文章，推送到代码仓库后，GitHub 会自动帮你完成环境配置、静态文件生成和页面发布。

本教程将引导你完成整个配置流程。

📝 前置准备

在开始之前，请确保你已具备以下条件：

1. 本地环境：已安装 Node.js 和 Git。
2. GitHub 账号：拥有一个 GitHub 账号。
3. 两个仓库：

```
*   源码仓库 (Private/Source Repo)：用于存放 Hexo 博客的全部源代码（包括 source/_posts 目录下的 Markdown 文件）。
```

```
*   博客页面仓库 (Public/Page Repo)：用于存放自动生成的静态网页文件。仓库名必须为 .github.io。
```

🛠️ 步骤一：创建 Personal Access Token

这个 Token 将赋予 GitHub Actions 权限，使其能够将生成的静态文件推送到你的博客页面仓库。

1. 访问 GitHub 的 Personal access tokens 页面。
2. 点击 "Generate new token" (生成新令牌)。
3. 填写一个具有辨识度的名称，例如 hexo-deploy-token。
4. Expiration (过期时间)：建议设置一个合理的过期时间以保证账户安全。
5. Select scopes (选择范围)：在 repo 权限组下，勾选所有选项，以确保拥有对仓库的完全控制权。
6. 滚动到页面底部，点击 "Generate token"。
7. 重要：生成的 Token 只会显示一次！请务必现在复制并妥善保存。

🔐 步骤二：配置仓库 Secrets

接下来，将上一步生成的 Token 配置到你的 源码仓库 中。

1. 进入你的 源码仓库 页面。
2. 点击顶部的 "Settings" (设置)。
3. 在左侧菜单中，找到 "Secrets and variables" -> "Actions" (操作)。
4. 点击 "New repository secret" (新建仓库机密)。
5. 在 "Name" (名称) 栏填写一个变量名，我们使用 PERSONAL_TOKEN。
6. 在 "Value" (值) 栏粘贴你刚刚复制的 Token。
7. 点击 "Add secret" (添加机密) 完成配置。

⚙️ 步骤三：配置 GitHub Actions 工作流

现在，你需要在源码仓库中创建一个工作流文件，定义自动化部署的步骤。

1. 在你的 Hexo 项目根目录下，创建文件夹 .github/workflows。
2. 在 workflows 文件夹内，创建一个新的 YAML 文件，例如 hexo-deploy.yml。
3. 将以下内容复制到文件中，并根据注释提示进行修改：

name: Deploy Hexo Blog

触发条件：当有代码推送到 main 分支时

```
# GitHub Actions 配置文件：用于自动部署 Hexo 博客
name: Deploy Hexo

# 当 main 分支被 push 时触发部署流程
on:
  push:
    branches:
      - main

jobs:
  deploy:
    # 使用最新版 Ubuntu 运行环境
    runs-on: ubuntu-latest

    # 允许对仓库内容进行写操作（git push）
    permissions:
      contents: write

    steps:
      # Step 1：检出仓库源码
      - uses: actions/checkout@v4

      # Step 2：设置 Node.js 环境一定要和本地一样
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 24.13.1

      # Step 3：安装依赖
      - name: Install dependencies
        run: |
          npm install
          npm install hexo-renderer-pug hexo-renderer-stylus --save

      # Step 4：生成 Hexo 静态文件
      - name: Generate Hexo static files
        run: npx hexo generate

      # Step 5：部署到 gh-pages 分支
      - name: Deploy to gh-pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          personal_token: ${{ secrets.PERSONAL_TOKEN }}
          publish_branch: gh-pages
          publish_dir: ./public
          user_name: 改为你的用户名
          user_email: 改为你github绑定的邮箱
```

✅ 步骤四：验证与启用 GitHub Pages

1. 推送代码：将你本地修改后的 Hexo 源码（包含新创建的 .github/workflows 目录）推送到源码仓库的 main 分支。
2. 查看 Actions：在源码仓库页面，点击顶部的 "Actions" (操作) 标签。你应该能看到一个正在运行或已成功完成的工作流。如果失败，可以根据日志信息排查问题。
3. 启用 Pages 服务：

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

稍等片刻，你的博客即可通过 显示域名 访问。

💡 常见问题与提示

* 分支名称：GitHub 仓库的默认分支可能是 main 或 master，请确保工作流文件中的 on.push.branches 字段与之匹配。
* 部署方式：本教程采用将静态文件部署到 gh-pages 分支的方式，这是目前比较推荐的实践。你也可以选择直接部署到 master 分支。
* 样式丢失：如果博客访问时没有样式，通常是因为资源路径配置错误。请检查 Hexo 源码目录下的 _config.yml 文件，确保 url 和 root 配置项正确无误。
* 自定义域名：如需绑定自定义域名，可以在源码仓库的 source 目录下新建一个名为 CNAME 的文件（无后缀），并在其中写入你的域名（例如 blog.example.com）。GitHub Actions 部署时会自动将其发布。

  *本文章部分内容使用ai生成*
