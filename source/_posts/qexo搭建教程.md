---
abbrlink: ''
categories: []
cover: https://img.246644.xyz/1000123461.png
date: '2026-02-26T15:38:27.900118+08:00'
tags: []
title: Hexo云后台——Qexo搭建教程
updated: '2026-02-26T15:53:26.254+08:00'
---
摘要

本文介绍了如何使用 PostgreSQL + Vercel + Github Actions 部署 Qexo（Hexo 云后台），实现博客的在线管理和自动更新推送

请先确保安装以下文章完成了博客自动推送：Github Actions 自动部署

1. 部署前准备

* 域名： 需拥有自己的域名（非 github.io），并能更改 DNS 解析。
* 绑定： 已在博客仓库设置的 Pages 选项卡中绑定域名。

2. 部署 Qexo 环境

本文选用 Vercel 提供的免费 PostgreSQL 服务。

步骤：

1. 克隆仓库： 点击 Vercel 链接克隆 Qexo 仓库（建议新建私有仓库）。
2. 自动部署： 创建后会自动部署，第一次部署会失败（因为数据库未配置）。
3. 配置 PostgreSQL：

```
*   进入项目管理页面的 Storage 界面。
```

```
*   点击 Create Database，选择 Postgres。
```

```
*   地区选择 Washington DC 或 USA (east)。
```

```
*   创建后，在 Connect Project 中选择你的 Qexo 项目。
```

4. 配置域名：

```
*   在 Settings > Domains 中添加购买的域名。
```

```
*   警告： 务必将 Qexo 绑定到子域名（如 admin.abcd.xyz），不要直接绑定到主域名（如 abcd.xyz）。
```

```
*   DNS 解析： 若出现 Invalid Configuration，需在域名商处添加 A 记录：
```

```
*   主机记录： @
```

```
*   记录值： 76.223.126.88 (Vercel 备用 IP)
```

5. 重新部署： 配置完成后，在 Deployment 中点击 Redeploy。
6. 初始化 Qexo

3.1 Github 配置

* 访问界面： 访问绑定的子域名（如 admin.abcd.xyz）。
* 生成 Token：

```
*   在 Github 设置中选择 Developer settings > Personal access tokens > Tokens (classic) > Generate new token。
```

```
*   Note: 填写用途（如 Qexo Configuration）。
```

```
*   Expiration: 建议设置期限（或永久）。
```

```
*   Scopes: 勾选 repo 下所有选项及 workflow。
```

```
*   复制生成的 Token。
```

* 填写表单：

```
*   服务商： Github
```

```
*   使用配置： Hexo
```

```
*   Github 密钥： 粘贴刚才复制的 Token。
```

```
*   Github 仓库： 填写格式 /。
```

```
*   项目分支： 通常为 master。
```

```
*   博客路径： 留空。
```

* 上传源码（若未上传可用github应用程序）：

```
git init
```

```
git remote add  https://github.com//.git
```

```
git pull  master
```

```
git add .
```

```
git commit -m "Commit内容"
```

```
git push  master
```

3.2 Vercel 配置

* VERCEL_TOKEN：

```
*   在 Vercel Tokens 页面 生成。
```

```
*   Scope 选择 justpureh2o's projects。
```

```
*   复制 Token 填入。
```

* PROJECT_ID：

```
*   进入 Vercel 项目 Settings > General。
```

```
*   复制 Project ID 填入。
```

4. Github Actions 自动部署
   详见：https://246644.xyz/2026/02/25/github action hexo 自动部署/
5. 常见问题 (FAQ)

Q1: 出现 "node deprecated.js" 或 "Cannot find module 'hexo'"？

* 解决： 更新 Node.js 版本。建议在工作流文件中将 node-version 修改为 18.x 或 20.x。

Q2: Actions 报错 "fatal: could not read Username"？

* 解决：

```
1.  检查工作流文件是否在提交前设置了用户名和密码。
```

```
2.  若已设置，尝试修改 _config.yml 的部署选项，使用 Token 访问：
```

```
deploy:
```

```
type: git
```

```
repo: https://@github.com//.github.io.git
```

```
branch: master
```

Q3: 如何添加 Pandoc 支持（用于数学公式渲染）？

* 解决： 在工作流文件靠前位置添加以下步骤：

```
- name: 安装Pandoc
```

```
uses: nikeee/setup-pandoc@v1
```
