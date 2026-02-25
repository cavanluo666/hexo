var posts=["2026/02/25/github action hexo 自动部署/","2026/02/25/hello-world/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };