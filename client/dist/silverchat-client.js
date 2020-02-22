let host = 'https://client.silverchat.co'

let links = [
  `<link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,600,700&display=swap" rel=stylesheet>`,
  `<link href=${host}/css/app.d857cf96.css rel=preload as=style>`,
  `<link href=${host}/js/app.5efbe002.js rel=preload as=script>`,
  `<link href=${host}/js/chunk-vendors.6a340df5.js rel=preload as=script>`,
  `<link href=${host}/css/app.d857cf96.css rel=stylesheet>`,
]
let scripts = [
  `${host}/js/chunk-vendors.6a340df5.js`,
  `${host}/js/app.5efbe002.js`,
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
