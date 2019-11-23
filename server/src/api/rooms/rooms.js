import app from "~/src/server.js";
import Rooms from "~/src/models/rooms.js";
import { authMiddleware } from "~/src/lib/middlewares";

app.post("/create-room", authMiddleware, async (req, res) => {
  let {
    name
  } = req.body;

  await Rooms.insert({
    name: name,
    socketRoomId: name
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
