let host = 'http://localhost:3015'

let links = [
  `<link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,700&display=swap" rel=stylesheet>`,
  `<link href=${host}/css/app.c198f60f.css rel=preload as=style>`,
  `<link href=${host}/js/app.9f007d32.js rel=preload as=script>`,
  `<link href=${host}/js/chunk-vendors.c94aee4a.js rel=preload as=script>`,
  `<link href=${host}/css/app.c198f60f.css rel=stylesheet>`,
]
let scripts = [
  `${host}/js/chunk-vendors.c94aee4a.js`,
  `${host}/js/app.9f007d32.js`,
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
