import app from "~/src/server.js";

import Users from "~/src/models/users.js";
import Teams from "~/src/models/teams.js";
import crypto from "crypto-promise";
import { sendRawEmail, sendHtmlEmail } from "~/src/lib/mailer";
import { adminAuthMiddleware } from "~/src/lib/middlewares";

import config from 'config';

app.post("/admin/invite-admin", adminAuthMiddleware, async (req, res) => {
  let {email, firstName, lastName} = req.body;

  if (email == null || email == "") {return res.status(400).json({message: "email missing"});}

  email = email.toLowerCase();
  var user = await Users.findOne({ email: email });
  console.log("user: ", user);

  if (user) {return res.status(400).json({message: "User already exist"});}

  let buffer = await crypto.randomBytes(16);
  var verificationToken = buffer.toString('hex');

  await Users.insert({
    firstName,
    lastName,
    email,
    verificationToken,
    isVerified: false,
    isAdmin: true
  });
  res.json({ message: "ok" });

  await sendHtmlEmail({
    recipient: email,
    subject: `Welcome to Silverchat Admin`,
    templateName: 'admin-invitation',
    data: {
      firstName: firstName,
      verifyLink: config.appUrl + "/verify/" + verificationToken
    }
  });
});

app.post("/admin/invite-member", adminAuthMiddleware, async (req, res) => {
  let {email, firstName, lastName, role, teamId} = req.body;

  if (email == null || email == "") { return res.status(400).json({message: "email field missing"});}

  email = email.toLowerCase();
  var [user, team] = await Promise.all([
    Users.findOne({ email: email }),
    Teams.findOne({_id: teamId})
  ]);

  console.log("user: ", user);

  if (user) {return res.status(400).json({message: "User already exist"});}
  if (!team) {return res.status(400).json({message: "Team doesn't exist"});}

  let buffer = await crypto.randomBytes(16);
  var verificationToken = buffer.toString('hex');

  await Users.insert({
    firstName,
    lastName,
    email,
    role,
    teamId: team._id,
    verificationToken,
    isVerified: false
  });
  res.json({ message: "ok" });

  await sendHtmlEmail({
    recipient: email,
    subject: `${team.name} ${role[0].toUpperCase() + role.slice(1)} Invite`,
    templateName: `${role}-invitation`,
    data: {
      firstName: firstName,
      teamName: team.name,
      verifyLink: config.appUrl + "/verify/" + verificationToken
    }
  });

});

app.post("/get-info-from-verif-token", async (req, res) => {
  let {verificationToken} = req.body;

  if (verificationToken == null || verificationToken == "") {
    return res.status(400).json("Token cannot be empty");
  }

  let user = await Users.findOne({verificationToken});
  let team;

  if (user.teamId != null) {
    team = await Teams.findOne({_id: user.teamId});
  }

  if (user == null) {
    return res.status(400).json("Token has expired or is invalid");
  }

  res.json({user, team});
});
