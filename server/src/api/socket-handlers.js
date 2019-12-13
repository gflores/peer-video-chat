import { playRoomSocket } from "~/src/server.js";

import { onSetupConvos, onTransmitSignal } from "./rooms/conversations";
let rooms = {};

playRoomSocket.on('connection', (socket) => {
  console.log("Socket ", socket.id, " has connected");

  socket.on("setup-convos", onSetupConvos.bind(socket));
  socket.on("transmit-signal", onTransmitSignal.bind(socket));
});
