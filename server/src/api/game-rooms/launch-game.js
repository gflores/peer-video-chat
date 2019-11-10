import { wait } from "~/src/lib/utils.js";
import {constructPlayerData} from "~/src/api/gameplay/players.js";
import {gameLoop} from "~/src/api/gameplay/game-loop";

let countdownTime = 5000;

async function launchGame (room) {
  if (room.isGameLaunched == false){
    console.log("launching game ! (countdown)");

    room.socketRoom.emit("game-countdown", {time: countdownTime});
    await wait(countdownTime);
  
    room.players[0].playerData = constructPlayerData();
    room.players[0].playerData.index = 0;
    room.players[1].playerData = constructPlayerData();
    room.players[1].playerData.index = 1;

    room.isGameLaunched = true;

    room.socketRoom.emit("game-started", room.constructSnapshotMessage());
    console.log("START game ! (countdown END)");

    await wait(500);

    gameLoop(room);
  } else {
      console.log("That game room is already launched");
  }
};

export {
  launchGame
}