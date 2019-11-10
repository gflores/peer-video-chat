import Users from "~/src/models/users.js";
import {rooms, isUserInARoom, getUserRoomId, removeUserFromRoom} from "./rooms";
import {constructPlayerData} from "~/src/api/gameplay/players.js";
import {playRoomSocket} from "~/src/server.js";


async function onLeaveRoom({}, authToken, responseCb) {
  let room = this.room;
  let user = this.user;
  if (user != null) {

    if (room.isGameLaunched == true && room.isGameEnded == false && room.players.map(p => p._id.toString()).includes(this.user._id.toString()) == true) {
      console.log("Cannot leave room as a player when the game is live");
      return;
    }

    room.players = room.players.filter(p => p._id.toString() != user._id.toString());
    room.spectators = room.spectators.filter(s => s._id.toString() != user._id.toString());

    console.log("updated room: ", room)

    removeUserFromRoom(user, room.roomId);
    this.user = null;
    this.room = null;

    this.leave('room#' + room.roomId);
  }
  console.log("onLeaveRoom Rooms: ", rooms);


  // let user = await Users.findOne({authToken});

  // if (isUserInARoom(user) == true) {
  //   let roomId = getUserRoomId(user);
  //   let room = rooms[roomId];
  //   if (room.isGameLaunched == true && room.isGameEnded == false && room.players.map(p => p._id.toString()).includes(user._id.toString()) == true) {
  //     console.log("Cannot leave room as a player when the game is live");
  //     return;
  //   }
  //   room.players = room.players.filter(p => p._id.toString() != user._id.toString());
  //   room.spectators = room.spectators.filter(s => s._id.toString() != user._id.toString());

  //   removeUserFromRoom(user, roomId);
  //   this.leave('room#' + roomId);
  // }
  // console.log("onLeaveRoom Rooms: ", rooms);
};

export {
  onLeaveRoom
};