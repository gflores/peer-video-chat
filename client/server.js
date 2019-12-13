const express = require('express');
var history = require('connect-history-api-fallback');
const path = require("path");
const https = require('https');
const fs = require('fs');

const app = express();

app.use(express.static(__dirname + '/dist'));
app.use(history({
    disableDotRule: true,
    verbose: true
}));
app.use(express.static(__dirname + '/dist'));
 
 
const port = process.env.PORT || 80;
// app.listen(port, () => {
//     console.log(`listening on ${port}`);
// });

let serverOptions = {
    key: fs.readFileSync(path.resolve(__dirname, './certs/private.key')),
    cert: fs.readFileSync(path.resolve(__dirname, './certs/cert.crt'))
};
let server = https.createServer(serverOptions, app);
server.listen(port, async () => {
    console.log(`https listening on ${port}`);
});
