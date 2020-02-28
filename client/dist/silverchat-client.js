let host = 'http://localhost:3015'

let links = [
  `<link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,600,700&display=swap" rel=stylesheet>`,
  `<link href=${host}/css/app.3412c663.css rel=preload as=style>`,
  `<link href=${host}/js/app.9698e09c.js rel=preload as=script>`,
  `<link href=${host}/js/chunk-vendors.cf46f65b.js rel=preload as=script>`,
  `<link href=${host}/css/app.3412c663.css rel=stylesheet>`,
]
let scripts = [
  `${host}/js/chunk-vendors.cf46f65b.js`,
  `${host}/js/app.9698e09c.js`,
]

links.forEach(link => {
  var el = document.createElement('div');
  el.innerHTML = link;
  document.head.appendChild(el.firstChild);
})

scripts.forEach(src => {
  var el = document.createElement('script');
  el.src = src;
  el.async = false; 
  document.body.appendChild(el);
})
