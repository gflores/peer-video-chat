import app from "~/src/server.js";

import Users from "~/src/models/users.js";
import crypto from "crypto-promise";
import { sendRawEmail, sendHtmlEmail } from "~/src/lib/mailer";
import { adminAuthMiddleware } from "~/src/lib/middlewares";

import config from 'config';

app.post("/admin/invite-admin", adminAuthMiddleware, async (req, res) => {
  let {email, firstName, lastName} = req.body;

  if (email == null || email == "") {
    return res.status(400).json({message: "email field missing"});
  }

  email = email.toLowerCase();
  console.log("email: ", email);
  var user = await Users.findOne({ email: email });
  console.log("user: ", user);

  if (user) {
    return res.status(400).json({message: "User already exist"});
  }

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