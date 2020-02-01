import app from "~/src/server.js";

import Users from "~/src/models/users.js";
import Teams from "~/src/models/teams.js";
import Rooms from "~/src/models/rooms.js";

import crypto from "crypto-promise";
import { sendRawEmail, sendHtmlEmail } from "~/src/lib/mailer";
import { authMiddleware, adminAuthMiddleware } from "~/src/lib/middlewares";

import config from 'config';

app.post("/create-team", authMiddleware, async (req, res) => {
  let {name} = req.body;

  if (req.user.teamId != null) {
    return res.status(400).json({message: "You are already part of a team"});    
  }
  if (name == null || name == "") {
    return res.status(400).json({message: "name field missing"});
  }

  var team = await Teams.findOne({ name: name });

  if (team) {
    return res.status(400).json({message: "Team already exist"});
  }

  team = await Teams.insert({
    name,
  });

  await Rooms.insert({
    name: "Main",
    socketRoomId: name + "[main]",
    admins: [],
    teamId: team._id
  });

  if (req.user.isGuest == true) {
    await Users.update({
      _id: req.user._id
    }, {
      $set: {teamId: team._id, role: "owner"}
    });
  }
  res.json({ message: "ok" });
});

app.post("/admin/get-teams", adminAuthMiddleware, async (req, res) => {
  let teams = await Teams.find({});
  res.json({teams});
})

app.post("/admin/get-team", adminAuthMiddleware, async (req, res) => {
  let {id} = req.body;

  let team = await Teams.findOne({_id: id});
  let users = await Users.find({teamId: team._id});
  
  res.json({team, users});
})