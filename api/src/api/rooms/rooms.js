import app from "~/src/server.js";
import Rooms from "~/src/models/rooms.js";
import Users from "~/src/models/users";
import Convos from "~/src/models/convos.js";

import { authMiddleware } from "~/src/lib/middlewares";

app.post("/create-room", authMiddleware, async (req, res) => {
  let {
    name
  } = req.body;

  await Rooms.insert({
    name: name,
    socketRoomId: name,
    admins: []
  });

  res.json({
    message: "room created !"
  });
});

app.post("/list-rooms", authMiddleware, async (req, res) => {
  let {
  } = req.body;

  let rooms = await Rooms.find({});

  res.json({
    rooms
  });
});

app.post("/get-room", authMiddleware, async (req, res) => {
  let {
    socketRoomId
  } = req.body;

  let room = await Rooms.findOne({socketRoomId});

  res.json({
    room
  });
});

app.post("/admin/get-room", authMiddleware, async (req, res) => {
  let {
    socketRoomId
  } = req.body;

  let room = await Rooms.findOne({socketRoomId});

  if (room == null) {
    console.log("this room doesn't exist");
    return ;
  }

  let convos = await Convos.find({
    roomId: room._id,
    state: {$in: ["waiting", "in-conversation"]}
  }, {sort: {createdAt: -1}});

  res.json({
    room,
    convos
  });
});

app.post("/admin/join-room", authMiddleware, async (req, res) => {
  let {
    socketRoomId
  } = req.body;

  let room = await Rooms.findOne({socketRoomId: socketRoomId});
  if (room == null) {
    res.json({
      message: "this room doesn't exist"
    });
    return ;
  }
  let alrConnectedRoom = await Rooms.findOne({admins: req.user._id,});
  if (alrConnectedRoom != null) {
    res.json({
      message: "Already connected to the room: " + alrConnectedRoom.name
    });
  
  }

  if (room.admins.includes(req.user._id) == false) {
    room.admins.push(req.user._id);
    await Rooms.update({_id: room._id}, {
      $set: {
        admins: room.admins
      }
    })
  }
  res.json({
    message: "Joined room"
  });
});

app.post("/admin/leave-room", authMiddleware, async (req, res) => {
  let {
  } = req.body;

  let room = await Rooms.findOne({
    admins: req.user._id,
  });

  let index = room.admins.indexOf(req.user._id);
  room.admins.splice(index, 1);

  await Rooms.update({_id: room._id}, {
    $set: {
      admins: room.admins
    }
  });
  
  res.json({
    message: "Successfully removed from room: " + room.name
  });
});

