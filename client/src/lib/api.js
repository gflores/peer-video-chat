import axios from "axios";
import store from "store";

// let host = location.protocol + `//${location.host.split(":")[0]}:4000/`;
let host = process.env.VUE_APP_API_URL;

let playRoomSocket = require('socket.io-client')(host + "play", {rejectUnauthorized: false});

function getSocketId() {
  return playRoomSocket.id;
}

async function apiRequest(path, data) {
  try {
    let res = await axios.post(host + path, data, {
      headers: {
        "Authorization": store.get("authToken")
      }
    });
  
    return res.data;
  }
  catch (e){
    console.log("e: ", e);
    if (e.response.status === 401){
      store.remove('authToken');
      window.location = "/login";
      console.log("path: " + path);
      console.log("data: " + data);
    }
    
    throw e;
  }


  return res.data;
}

async function playRoomEmit(handleName, data) {
  return new Promise((resolve) => {
    playRoomSocket.emit(handleName, data, store.get("authToken"), (response) => {
      resolve(response);
    });
  });
}

function playRoomOn(handleName, callback) {
  playRoomSocket.on(handleName, callback)
}

export {
  apiRequest,
  playRoomEmit,
  playRoomOn,
  getSocketId
}