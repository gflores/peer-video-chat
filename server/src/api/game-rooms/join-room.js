import Users from "~/src/models/users.js";
import {rooms, isUserInARoom, addUserToRoom, isUserInRoomId, getPlayInfoFromUser} from "./rooms";
import {launchGame} from "./launch-game";
import {playRoomSocket} from "~/src/server.js";
import { createGuestUser, logUserIn} from "~/src/api/users/authentication";

function filterUser(user) {
  return {
    nickname: user.nickname,
    _id: user._id,
    isGuest: user.isGuest,
    isVerified: user.isVerified,
    playerData: user.playerData ? {
      currentHp: user.playerData.currentHp,
      maxHp: user.playerData.maxHp,
      currentCards: user.playerData.currentCards,
      canPlayShield: user.playerData.canPlayShield
    } : null
  }
}

function constructNewRoom(roomId) {
  let room;
  room = {
    roomId: roomId,
    players: [],
    spectators: [],
    canDuelAction: false,
    isGameLaunched: false,
    isGameEnded: false,
    winner: null,
    loser: null,
    currentRoundStartTime: null,
    socketRoom: playRoomSocket.to('room#' + roomId),
    constructSnapshotMessage() {
      return {
        roomId: room.roomId,
        players: room.players.map(p => filterUser(p)),
        spectators: room.spectators.map(s => filterUser(s)),
        canDuelAction: room.canDuelAction,
        isGameLaunched: room.isGameLaunched,
        isGameEnded: room.isGameEnded,
        currentRoundStartTime: room.currentRoundStartTime,
        winner: room.winner,
        loser: room.loser
      };
    }
  };

  return room
}
async function onJoinRoom({roomId}, authToken, responseCb) {
  console.log("authToken: ", authToken);
  let user = await Users.findOne({authToken});
  let room;

  if (user == null) {
    throw Error(401);
  }

  console.log("user found: ", user);
  if (isUserInARoom(user) == false) {
    addUserToRoom(user, roomId)
    user.currentRoom = roomId;

    if (rooms[roomId] == null) {
      rooms[roomId] = constructNewRoom(roomId);
    }
    room = rooms[roomId];
    this.join('room#' + roomId);

    if (room.players.length < 2) {
      room.players.push(user);
      if (room.players.length == 2) {
        launchGame(room);
      }
    } else if (room.players.length == 2) {
      room.spectators.push(user);
    }
    this.room = room;
    this.user = user;
    
    room.socketRoom.emit("user-joined-room", room.constructSnapshotMessage());
  } else if (isUserInRoomId(user, roomId)) {
    console.log("user is already in the room");
    let info = getPlayInfoFromUser(user);
    user.playerData = info.player;
    room = info.room;

    this.room = room;
    this.user = user;

    this.join('room#' + roomId);
    room.socketRoom.emit("user-joined-room", room.constructSnapshotMessage());
  } else {
    console.log("already connected to another room: ");
    return responseCb({message: "Already connected to another room"}, false);
    // throw new Error("Already connected to another room");
  }
  responseCb({room: room.constructSnapshotMessage(), user});
  // console.log("rooms: ", rooms);
};

export {
  onJoinRoom
};