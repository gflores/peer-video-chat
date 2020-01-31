import app from "~/src/server.js";

import Users from "~/src/models/users.js";

import config from 'config';

import { authMiddleware, adminAuthMiddleware } from "~/src/lib/middlewares";
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

app.post("/get-user-from-verif-token", async (req, res) => {
  let {verificationToken} = req.body;

  if (verificationToken == null || verificationToken == "") {
    return res.status(400).json("Token cannot be empty");
  }

  let user = await Users.findOne({verificationToken});

  if (user == null) {
    return res.status(400).json("Token has expired or is invalid");
  }

  res.json(user);
});

app.post("/admin/get-admins", adminAuthMiddleware, async (req, res) => {
  let users = await Users.find({isAdmin: true});
  res.json({
    users: users
  });
});

app.post("/admin/delete-user", adminAuthMiddleware, async (req, res) => {
  let {id} = req.body;

  let users = await Users.remove({_id: id});
  res.json({
    message: "ok"
  });
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
