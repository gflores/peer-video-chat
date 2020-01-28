import { playRoomSocket } from "~/src/server.js";
import Users from "~/src/models/users";

import { onSetupConvos, onTransmitSignal, onClientRequestForSignal, onAdminJoinRoom }
  from "./rooms/conversations";
let rooms = {};

playRoomSocket.on('connection', (socket) => {
  console.log("Socket ", socket.id, " has connected");

  socket.use( async ([eventName, payload, authToken, responseCb], next) => {
    if (authToken != null) {
      socket.user = await Users.findOne({authToken});
    }
    next();
  });

  socket.on("disconnect", (reason) => {
    console.log("Disconnected: ", socket.id);
    console.log(reason);
    if (socket.user != null && socket.user.currentConvoId != null) {
      socket.to("convo#" + socket.user.currentConvoId).emit("user-disconnected", {id: socket.id});
    }
  });
  socket.on("setup-convos", onSetupConvos.bind(socket));
  socket.on("transmit-signal", onTransmitSignal.bind(socket));
  socket.on("client/request-for-signal", onClientRequestForSignal.bind(socket));
  socket.on("admin/join-room", onAdminJoinRoom.bind(socket));
});



