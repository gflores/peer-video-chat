import app from "~/src/server.js";
import Rooms from "~/src/models/rooms.js";
import Users from "~/src/models/users";
import Convos from "~/src/models/convos.js";

import { authMiddleware, memberAuthMiddleware, managerAuthMiddleware } from "~/src/lib/middlewares";

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

  let [convos, totalConvos] = await Promise.all([
      Convos.find({
        roomId: room._id,
        state: {$in: ["waiting", "in-conversation"]}
      }, {sort: {createdAt: -1}})
    ,
      Convos.count({
        roomId: room._id
      })
    ]
  );

  room.totalConvos = totalConvos;
  
  res.json({
    room,
    convos
  });
});

app.post("/get-room-stats", memberAuthMiddleware, async (req, res) => {
  let {
    roomId
  } = req.body;

  let room = await Rooms.findOne(roomId);

  if (room == null) {
    return res.status(400).json({message: "Room doesn't exist"});
  }
  if (room.teamId == null && req.user.isAdmin == true) {
    console.log(`OK. cos [${room.socketRoomId}] has no team, and you're an admin`);
  } else if (room.teamId.toString() != req.user.teamId.toString()) {
    return res.status(400).json({message: "You don't belong to that team"});    
  }

  let totalConvos = await Convos.count({
    roomId: room._id
  });

  res.json({
    totalConvos
  });
});

app.post("/admin/join-room", memberAuthMiddleware, async (req, res) => {
  let {
    socketRoomId
  } = req.body;

  let room = await Rooms.findOne({socketRoomId: socketRoomId});
  if (room == null) {
    return res.status(400).json({message: "Room doesn't exist"});
  }
  if (room.teamId == null && req.user.isAdmin == true) {
    console.log(`OK. cos [${room.socketRoomId}] has no team, and you're an admin`);
  } else if (room.teamId.toString() != req.user.teamId.toString()) {
    return res.status(400).json({message: "You don't belong to that team"});    
  }
  let alrConnectedRoom = await Rooms.findOne({admins: req.user._id,});
  
  if (alrConnectedRoom != null) {
    return res.status(400).json({message: "Already connected to room" + alrConnectedRoom.name});
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

app.post("/agent/add-question", managerAuthMiddleware, async (req, res) => {
  let {
    socketRoomId,
    isMandatory,
    questionText,
    answerTexts
  } = req.body;

  let room = await Rooms.findOne({socketRoomId: socketRoomId});
  if (room == null) {
    return res.status(400).json({message: "Room doesn't exist"});
  }
  if (room.teamId == null && req.user.isAdmin == true) {
    console.log(`OK. cos [${room.socketRoomId}] has no team, and you're an admin`);
  } else if (room.teamId.toString() != req.user.teamId.toString()) {
    return res.status(400).json({message: "You don't belong to that team"});    
  }
  
  if (room.introQuestions == null) {
    room.introQuestions = [];
  }
  room.introQuestions.push({
    isMandatory,
    questionText,
    answers: answerTexts.map(a => ({answerText: a}))
  });

  await Rooms.update(room._id, {
    $set: {
      introQuestions: room.introQuestions
    }
  });

  res.json({
    message: "ok"
  });
});

app.post("/agent/add-question", managerAuthMiddleware, async (req, res) => {
  let {
    socketRoomId,
    isMandatory,
    questionText,
    answerTexts
  } = req.body;

  let room = await Rooms.findOne({socketRoomId: socketRoomId});
  if (room == null) {
    return res.status(400).json({message: "Room doesn't exist"});
  }
  if (room.teamId == null && req.user.isAdmin == true) {
    console.log(`OK. cos [${room.socketRoomId}] has no team, and you're an admin`);
  } else if (room.teamId.toString() != req.user.teamId.toString()) {
    return res.status(400).json({message: "You don't belong to that team"});    
  }
  
  if (room.introQuestions == null) {
    room.introQuestions = [];
  }
  room.introQuestions.push({
    isMandatory,
    questionText,
    answers: answerTexts.map(a => ({answerText: a}))
  });

  await Rooms.update(room._id, {
    $set: {
      introQuestions: room.introQuestions
    }
  });

  res.json({
    message: "ok"
  });
});

app.post("/agent/update-button-start-text", managerAuthMiddleware, async (req, res) => {
  let {
    socketRoomId,
    buttonStartText
  } = req.body;

  let room = await Rooms.findOne({socketRoomId: socketRoomId});
  if (room == null) {
    return res.status(400).json({message: "Room doesn't exist"});
  }
  if (room.teamId == null && req.user.isAdmin == true) {
    console.log(`OK. cos [${room.socketRoomId}] has no team, and you're an admin`);
  } else if (room.teamId.toString() != req.user.teamId.toString()) {
    return res.status(400).json({message: "You don't belong to that team"});    
  }
  
  room.buttonStartText = buttonStartText;

  await Rooms.update(room._id, {
    $set: {
      buttonStartText: room.buttonStartText
    }
  });

  res.json({
    message: "ok"
  });
});
