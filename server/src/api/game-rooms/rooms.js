let rooms = {};
let players = {};

function isUserInARoom(user) {
  return players[user._id] != null;
}

function getUserRoomId(user) {
  return players[user._id] ? players[user._id].currentRoom : null;
}
function getUserRoom(user) {
  let roomId = getUserRoomId(user);
  return rooms[roomId];
}

function getPlayInfoFromUser(user) {
  let roomId = getUserRoomId(user);
  if (roomId == null) {
    return {};
  }

  let player = rooms[roomId].players.find(p => p._id.toString() == user._id.toString());
  player = player != null ? player.playerData : null;

  let opponent = rooms[roomId].players.find(p => p._id.toString() != user._id.toString());
  opponent = opponent != null ? opponent.playerData : null;

  return {
    player,
    opponent,
    room: rooms[roomId]
  };
}

function getPlayInfoFromAuthTokenAndRoomId(authToken, roomId) {
  let player = rooms[roomId].players.find(p => p.authToken == authToken).playerData;
  let opponent = rooms[roomId].players.find(p => p.authToken != authToken).playerData;

  return {
    player,
    opponent,
    room: rooms[roomId]
  };
}

function addUserToRoom(user, roomId) {
  user.currentRoom = roomId;
  players[user._id] = user;
}
function removeUserFromRoom(user) {
  if (players[user._id] != null) {
    user.currentRoom = null;
    delete players[user._id]
  }
}

function isUserInRoomId(user, roomId) {
  return players[user._id].currentRoom == roomId;
}

function clearRoom(room) {
  room.players[0].playerData = null;
  room.players[1].playerData = null;

  delete players[room.players[0]._id];
  delete players[room.players[1]._id];
  delete rooms[room.roomId];
}

export {
  players,
  rooms,
  isUserInARoom,
  addUserToRoom,
  isUserInRoomId,
  getUserRoomId,
  getUserRoom,
  removeUserFromRoom,
  getPlayInfoFromUser,
  getPlayInfoFromAuthTokenAndRoomId,
  clearRoom
}