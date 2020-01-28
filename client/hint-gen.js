let fs = require('fs');
let contents = fs.readFileSync('./dist/index.html', 'utf8');

//
let links = contents.split("<link href=");
links.shift();

let finalLinks = [];

links.forEach(s => {
  finalLinks.push(s.split(">")[0]);
})
//
let scripts = contents.split("<script src=");
scripts.shift();

let finalScripts = [];

scripts.forEach(s => {
  finalScripts.push(s.split(">")[0]);
})

//

let env = process.env.NODE_ENV || "development";

hostSettings = {
  development: 'http://localhost:3015',
  production: 'https://client.silverchat.co'
}
let host = hostSettings[env];
let content = `let host = '${host}'

let links = [\n`;

finalLinks.forEach(s => {
  content += "  `<link href=";
  if (s.charAt(0) == "/") {
    content += '${host}';
  }
  content += s + '>`,\n';
  // console.log(`'<link href=${s}\n`);
});

content += `]
let scripts = [\n`;

finalScripts.forEach(s => {
  content += "  `${host}";
  content += s + '`,\n';
  // console.log(`[${s}]\n`);
})

content += `]

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
})`;


console.log(content);