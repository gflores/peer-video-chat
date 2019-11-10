import db from "~/src/db";

/**
 * @typedef DbLog
 * @property {'info' | 'error'} level the level of the log
 * @property {Object} requestBody the body of the request
 * @property {Object} requestQuery the query of the request
 * @property {Object} requestParams the params of the request
 * @property {String} requestPath the path of the request
 * @property {String} method the method of the request
 * @property {String} userId the userId from DB associated with this request
 * @property {String} clientIp the clientIP from req
 * @property {String} userEmail the userEmailId from DB associated with this request
 * @property {String} responseStatusCode the response's status code
 * @property {String} responseStatusMessage the response's status message
 * @property {Object} responseBody the response's body
 * @property {String} errorMessage the error message - empty if no error
 * @property {String} errorStack the error stack - empty if no error
 */

db.create('logs');

const Logs = db.get('logs');

export default Logs;