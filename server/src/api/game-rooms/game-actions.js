import {getPlayInfoFromAuthTokenAndRoomId} from "~/src/api/game-rooms/rooms";

async function onPlayCard({index}, authToken, responseCb) {
  if (this.room.canDuelAction == false || this.user.playerData.currentCards[index] == null) {
    console.log(this.user._id +  "cannot play card");
  }
  this.user.playerData.action = "ATTACK";
  this.user.playerData.actionCardIndex = index;
  console.log("playing: ", this.user.playerData.currentCards[index]);
}

async function onPlayShield({}, authToken) {
  if (this.room.canDuelAction == false || this.user.playerData.canPlayShield == true) {
    console.log(this.user._id +  "cannot play card");
  }
  this.user.playerData.action = "SHIELD";
  this.user.playerData.actionCardIndex = null;
  console.log("playing Shield");
}

export {
  onPlayCard,
  onPlayShield
}