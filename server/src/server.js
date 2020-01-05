const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const glob = require("glob");
const path = require("path");
const https = require('https');
const fs = require('fs');
const middlewares = require('./lib/middlewares');

const app = express();
 
app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());
app.use(require('request-ip').mw());
// app.use(middlewares.loggerMiddleware);
// app.use(middlewares.exceptionMiddleware);
 
app.get('/', (req, res) => {
    res.json({message: 'ok'});
});
 
const port = process.env.PORT || 4000;
// let server = app.listen(port, async () => {
//     console.log(`listening on ${port}`);
// });

let serverOptions = {
    key: fs.readFileSync(path.resolve(__dirname, '../certs/private.key')),
    cert: fs.readFileSync(path.resolve(__dirname, '../certs/cert.crt'))
};
let server = https.createServer(serverOptions, app);
server.listen(port, async () => {
    console.log(`https listening on ${port}`);
});

let io = require('socket.io')(server);

// io.on('connection', (socket) => {
//     console.log("connected: ", socket.id);

//     setTimeout(() => {
//         socket.emit("toto", "boloss !")
//     }, 1000);

//     socket.on("msg", (data) => {
//         console.log(socket.id + "is sending: " + data);
//     });
// });

export default app;

export const playRoomSocket = io.of("/play");
export const monitorSocket = io.of("/ws-monitor");

setInterval(() => {
    monitorSocket.emit("snapshot", {
        play: {
            rooms: playRoomSocket.rooms
        },
        rooms1: io.sockets.adapter.rooms,
        rooms2: io.sockets.rooms,
        clients: io.sockets.clients,
        sids: io.sockets.adapter.sids
    });
}, 5000);

glob.sync(`${__dirname}/api/**/*.js`).forEach(file => {
    require(path.resolve(file));
});
glob.sync(`${__dirname}/cronjobs/**/*.js`).forEach(file => {
    require(path.resolve(file));
});


require('./lib/mailer');