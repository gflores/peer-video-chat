import axios from "axios";
import logger from '../lib/logger';

import config from '../config';

let mambuUsername = config.mambuDetails.userName;
let mambuPassword = config.mambuDetails.password;
let mambuApiUrl = config.mambuDetails.baseUrl;

var mambuConfig = {
  headers: {
    "Content-Type" : 'application/json',
    "Accept" : 'application/json'
  }, auth: {
    username: mambuUsername,
    password: mambuPassword
  }
}

async function mambuGet(path) {
  logger.debug("mambuApiUrl + path: ", mambuApiUrl + path);
  let response = await axios.get(mambuApiUrl + path, mambuConfig);

  return response.data;
}

async function mambuPost(path, data) {
  try {
    let response = await axios.post(mambuApiUrl + path, data, mambuConfig);

    logger.info(response.data);

    return response.data;
  } catch (e) {
    console.log("MambuPost Error: ", e);

    logger.debug("mambuPost Error: ", e)
  }
}

export {
  mambuGet,
  mambuPost
}