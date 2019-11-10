import axios from "axios";
import store from "store";
let playRoomSocket = require('socket.io-client')('http://localhost:4000/play');

async function apiRequest(path, data) {
  let res = await axios.post(`http://${location.host.split(":")[0]}:4000/` + path, data, {
    headers: {
      "Authorization": store.get("authToken")
    }
  });

  return res.data;
}

function playRoomEmit(handleName, data, callback) {
  playRoomSocket.emit(handleName, data, store.get("authToken"), callback);
}

function playRoomOn(handleName, callback) {
  playRoomSocket.on(handleName, callback)
}

export {
  apiRequest,
  playRoomEmit,
  playRoomOn
}