import db from "~/src/db";

/**
 * @typedef DbLog
 * @property {String} userId the userId from DB associated with the chat
 * @property {String} text
 * @property {String} representativeId
 */

db.create('chatMessages');

const ChatMessages = db.get('chatMessages');

export default ChatMessages;