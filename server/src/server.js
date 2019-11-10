const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const glob = require("glob");
const path = require("path");
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
let server = app.listen(port, async () => {
    console.log(`listening on ${port}`);
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

glob.sync(`${__dirname}/api/**/*.js`).forEach(file => {
    require(path.resolve(file));
});
glob.sync(`${__dirname}/cronjobs/**/*.js`).forEach(file => {
    require(path.resolve(file));
});


require('./lib/mailer');