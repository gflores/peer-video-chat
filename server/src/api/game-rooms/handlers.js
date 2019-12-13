// import { playRoomSocket } from "~/src/server.js";

// import { onJoinRoom } from "./join-room.js";
// import { onLeaveRoom } from "./leave-room.js";
// import { onSubmitSignal } from "./submit-signal.js";
// import { onPlayCard, onPlayShield } from "./game-actions";
// let rooms = {};

// playRoomSocket.on('connection', (socket) => {
//   console.log("connected to play room: ", socket.id);
//   console.log("player: ", socket.player);
//   console.log("room: ", socket.room);

//   socket.on("join-room", onJoinRoom.bind(socket));
//   socket.on("submit-signal", onSubmitSignal.bind(socket));

//   socket.on("leave-room", onLeaveRoom.bind(socket));
//   socket.on("play-card", onPlayCard.bind(socket));
//   socket.on("play-shield", onPlayShield.bind(socket));
//   // socket.on("debug", (authToken, responseCb) => responseCb({socket: socket}));
// });
