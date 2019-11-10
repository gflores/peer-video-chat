import app from "~/src/server.js";

import Users from "~/src/models/users.js";

import config from '../../config';

import {mambuGet, mambuPost} from "~/src/lib/api.js";
import { authMiddleware } from "~/src/lib/middlewares";
import bcrypt from 'bcrypt';
import logger from "~/src/lib/logger";

const saltRounds = 10;

/**
 * 
 * @param {{firstName: String, lastName: String}} updateObject the object to be used to update
 * @param {import('../../models/users').DbUser} user the user schema from the db
 */
async function updateUser(updateObject, user){
}

app.get("/users", async (req, res) => {
  let users = await Users.find({});
  res.json({users: users});
});

app.post("/my-profile", authMiddleware, async (req, res) => {
  res.json({
    user: req.user,
    room: req.room ? req.room.constructSnapshotMessage() : null
  });
});

app.post("/users/update", authMiddleware, async(req, res) => {
  let {firstName, lastName} = req.body;

  let user = req.user;

  try {
    await mambuPost(`/clients/${user.encodedKey}`, {client: {
      firstName,
      lastName,
      assignedBranchKey: config.mambuDetails.branchKey
    }});

    res.json({});
  }
  catch (e) {
    logger.error(e);
    res.status(417).json({errorMessage: "User doesn't exist!"});
  }

});

app.post("/users/change-password", authMiddleware, async(req, res) => {
  let {oldPassword, newPassword} = req.body;

  let user = req.user;

  if (await bcrypt.compare(oldPassword, user.passwordHash)){
    var hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    await Users.update({encodedKey: user.encodedKey}, {$set: {passwordHash: hashedPassword}})
  }
  else {
    res.status(417).json({errorMessage: "Please make sure your old password is correct!"});
  }
});
