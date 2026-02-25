var posts=["2026/02/25/hello-world/","2026/02/25/测试/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };