import app from "~/src/server.js";

import Users from "~/src/models/users.js";

import config from 'config';
import { sendRawEmail } from "~/src/lib/mailer";
import bcrypt from "bcrypt";
import crypto from "crypto-promise";
import logger from '~/src/lib/logger';

const saltRounds = 10;


async function createGuestUser() {
  let user = await Users.insert({
    nickname: "",
    email: "",
    passwordHash: "",
    isGuest: true,
    isVerified: false
  });
  user.nickname = "Guest#" + user._id;
  await Users.update({ _id: user._id }, {
    $set: {
      nickname: user.nickname,
    }
  });

  return user;
}

async function logUserIn(user) {
  let buffer = await crypto.randomBytes(16);
  let authToken = buffer.toString('hex');

  await Users.update({ _id: user._id }, {
    $set: {
      authToken,
      lastLoginDate: new Date()
    }
  });

  return authToken;
}

export {
  createGuestUser, logUserIn
};

app.post("/register", async (req, res) => {
  let { email, password, firstName, lastName } = req.body;

  email = email.toLowerCase();

  var user = await Users.findOne({ email: email });

  if (user) {
    res.status(417).json({ errorMessage: "User with corresponding email already exists! Please login if you already have an account." })
  }
  else {
    let passwordHash = await bcrypt.hash(password, saltRounds);
    password = "encrypted in 'passwordHash'";

    let buffer = await crypto.randomBytes(16);
    var verificationToken = buffer.toString('hex');

    let users = await Users.insert({
      firstName,
      lastName,
      email,
      passwordHash,
      verificationToken,
      isVerified: false
    });

    res.json({ message: "ok !" });
    await sendRawEmail(email, "Complete registration", "/verify/" + verificationToken);
  }
});

app.post("/verify", async (req, res) => {
  let { verificationToken, password } = req.body;

  let user = await Users.findOne({ verificationToken });
  if (user == null) {
    return res.status(400).json("Token has expired or is invalid");
  }

  let passwordHash = await bcrypt.hash(password, saltRounds);
  password = "encrypted in 'passwordHash'";

  await Users.update({
    _id: user._id
  }, {
    $set: {
      isVerified: true,
      verificationToken: null,
      passwordHash
    }
  });

  await sendRawEmail(user.email, "You are verified", `Congrats ${user.firstName}, you are verified !`);

  res.json({ message: "ok !" });
});

app.post("/login", async (req, res) => {
  let { email, password } = req.body;

  let user = await Users.findOne({ email });

  if (user == null || user.isVerified == false) {
    return res.status(400).json({ message: "Invalid user" });
  }

  let isRightPassword = await bcrypt.compare(password, user.passwordHash);

  if (isRightPassword == true) {
    let buffer = await crypto.randomBytes(16);
    let authToken = buffer.toString('hex');

    await Users.update({ _id: user._id }, {
      $set: {
        authToken,
        lastLoginDate: new Date()
      }
    });

    res.json({ authToken });
  } else {
    return res.status(400).json({ message: "Invalid Password" });
  }
});

app.post("/log-as-guest", async (req, res) => {
  let { } = req.body;

  let user = await createGuestUser();
  let authToken = await logUserIn(user);

  res.json({ authToken });
});


app.post("/two-factor-code-submit", async (req, res) => {
  let { twoFactorCode } = req.body;

  twoFactorCode = Number(twoFactorCode);

  let authToken = req.get("Authorization");
  if (authToken == null) {
    return res.sendStatus(401);
  }

  logger.debug("authToken, twoFactorCode: ", authToken, twoFactorCode);
  let user = await Users.findOne({ authToken, twoFactorCode });
  if (user == null) {
    return res.status(400).json({ message: "invalid code" });
  }
  await Users.update(user._id, {
    $set: {
      twoFactorCode: null
    }
  });
  res.json({ message: "ok !" });
});