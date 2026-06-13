var posts=["2026/06/13/P1909 [NOIP 2016 普及组] 买铅笔题解/","2026/02/26/qexo搭建教程/","2026/02/25/github action hexo 自动部署/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };