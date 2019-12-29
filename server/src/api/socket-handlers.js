import { playRoomSocket } from "~/src/server.js";

import { onSetupConvos, onTransmitSignal, onClientRequestForSignal, onAdminJoinRoom }
  from "./rooms/conversations";
let rooms = {};

playRoomSocket.on('connection', (socket) => {
  console.log("Socket ", socket.id, " has connected");

  socket.on("setup-convos", onSetupConvos.bind(socket));
  socket.on("transmit-signal", onTransmitSignal.bind(socket));
  socket.on("client/request-for-signal", onClientRequestForSignal.bind(socket));
  socket.on("admin/join-room", onAdminJoinRoom.bind(socket));
});
