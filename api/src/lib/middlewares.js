import {format} from 'util'
import Users from "~/src/models/users.js";
import logger from './logger';
import {sendRawEmail, sendHtmlEmail} from './mailer';
import Logs from '~/src/models/logs';

async function getAuthUser(authToken) {
  if (authToken == null || authToken == "") {
    return null;
  }
  let user = await Users.findOne({"authToken": authToken});
  if (user == null) {
    return null;
  }
  return user;
}

async function authMiddleware(req, res, next) {
  let user = await getAuthUser(req.get("Authorization"));
  if (user != null) {
    req.user = user;
    return next();
  }
  return res.sendStatus(401);
}

async function memberAuthMiddleware(req, res, next) {
  let user = await getAuthUser(req.get("Authorization"));
  if (user != null && (user.role == "member" || user.role == "manager" || user.role == "owner")) {
    req.user = user;
    return next();
  }
  return res.sendStatus(401);
}
async function managerAuthMiddleware(req, res, next) {
  let user = await getAuthUser(req.get("Authorization"));
  if (user != null && (user.role == "manager" || user.role == "owner")) {
    req.user = user;
    return next();
  }
  return res.sendStatus(401);
}
async function ownerAuthMiddleware(req, res, next) {
  let user = await getAuthUser(req.get("Authorization"));
  if (user != null && (user.role == "owner")) {
    req.user = user;
    return next();
  }
  return res.sendStatus(401);
}
async function adminAuthMiddleware(req, res, next) {
  let user = await getAuthUser(req.get("Authorization"));
  if (user != null && (user.isAdmin == true)) {
    req.user = user;
    return next();
  }
  return res.sendStatus(401);
}

async function exceptionMiddleware(req, res, next){
  try {
    req.start = new Date();
    next();
  }
  catch (e){
    res.send(500);

    
    let recipients = process.env.NODE_ENV == 'dev' ? ['flores.gael@gmail.com'] : ['flores.gael@gmail.com', "nihaojulius@gmail.com"];

    var logObject = createLogObject(req, res, null, e);

    let message = `Uncaught Exception at Silverchat: \n ${JSON.stringify(logObject, null, 2)}`;
    logger.error(message);

    recipients.forEach(async (email) => {
      await sendRawEmail(email, "Uncaught Error in Silverchat", message.split("\n").join("<br/>"));
    })

    await Logs.insert(logObject);
  }
}

/**
 * Sets up the req and res for logging to the DB Logs
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function loggerMiddleware(req, res, next){
  const defaultJsonFunc = res.json;

  res.json = async (resBody) => {
    defaultJsonFunc.call(res, resBody);

    var logObject = createLogObject(req, res, resBody);

    await Logs.insert(logObject);
  }

  next();
}

function createLogObject(req, res, resBody, error){
  /**
     * @type {import('../models/logs').DbLog}
     */
    let logObject = {}
    let {query, params, body, path} = cleanSensitiveData(req);

  if (error){
    logObject = {
      level: 'error',
      env: process.env.NODE_ENV,
      userId: req.user ? req.user._id : undefined,
      userEmail : req.user ? req.user.email : undefined,
      method: req.method,
      clientIp: req.clientIp,
      requestBody: body,
      requestParams: params,
      requestPath: path,
      requestQuery: query,
      responseStatusCode: res.statusCode,
      responseStatusMessage: res.statusMessage,
      errorMessage: error,
      errorStack: error.stack
    };
  }
  else {
    logObject = {
      level: 'info',
      env: process.env.NODE_ENV,
      userId: req.user ? req.user._id : undefined,
      userEmail : req.user ? req.user.email : undefined,
      method: req.method,
      clientIp: req.clientIp,
      requestBody: body,
      requestParams: params,
      requestPath: path,
      requestQuery: query,
      responseStatusCode: res.statusCode,
      responseStatusMessage: res.statusMessage,
      responseBody: resBody
    };
  }

  return logObject;
}

const sensitiveKeys = [
  "password",
  "new_password"
];
const hiddenString = "******";

function cleanSensitiveData(req){
  let {query, params, body, path} = req;

  hideObjectSensitiveData(query);
  hideObjectSensitiveData(params);
  hideObjectSensitiveData(body);

  return {query, params, body, path}
}

function hideObjectSensitiveData(objectToClean) {
  sensitiveKeys.forEach((sensitiveKey) => {
    if (objectToClean[sensitiveKey]) {
      objectToClean[sensitiveKey] = hiddenString;
    }
  });

  return objectToClean;
}

export {
  authMiddleware,
  memberAuthMiddleware,
  managerAuthMiddleware,
  ownerAuthMiddleware,
  adminAuthMiddleware,

  exceptionMiddleware,
  loggerMiddleware
}