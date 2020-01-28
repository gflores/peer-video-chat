let host = 'https://client.silverchat.co'

let links = [
  `<link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,700&display=swap" rel=stylesheet>`,
  `<link href=${host}/css/app.25970d8d.css rel=preload as=style>`,
  `<link href=${host}/js/app.6b0b947e.js rel=preload as=script>`,
  `<link href=${host}/js/chunk-vendors.fd834b5a.js rel=preload as=script>`,
  `<link href=${host}/css/app.25970d8d.css rel=stylesheet>`,
]
let scripts = [
  `${host}/js/chunk-vendors.fd834b5a.js`,
  `${host}/js/app.6b0b947e.js`,
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
