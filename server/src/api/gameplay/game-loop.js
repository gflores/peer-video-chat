import { wait } from "~/src/lib/utils.js";
import { countDownMessageDelay, gameStartDelay } from '~/src/global-variables.js';
import {playRoomSocket} from "~/src/server.js";
import {computeRoundResult} from "~/src/api/gameplay/compute-round-results";
import {clearRoom} from "~/src/api/game-rooms/rooms";

let roundTime = 9000; //9000;
let endRoundDelay = 1000; //5000;

async function gameLoop(room) {
  while (room.isGameEnded == false) {
    console.log("[NEW ROUND]")
    // console.log("player 1", room.players[0].playerData);
    // console.log("player 2", room.players[1].playerData);

      room.currentRoundStartTime = new Date();
      // sending server message
      room.socketRoom.emit("new-round", {roundTime: roundTime});

      room.canDuelAction = true;

      await wait(roundTime);
      // waiting for user to type in their input

      console.log("computing result");
      room.canDuelAction = false;
      computeRoundResult(room);
      room.socketRoom.emit("end-round", room.constructSnapshotMessage());
      
      await wait (endRoundDelay);
      console.log("finished animation");
  }
  clearRoom(room);
  
  
  console.log("game has ended");
}

export {
  gameLoop
}