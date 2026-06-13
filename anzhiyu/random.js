var posts=["2026/02/25/github action hexo 自动部署/","2026/02/26/qexo搭建教程/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };