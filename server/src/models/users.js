import db from "~/src/db";

/**
 * @typedef DbUser
 * @property {String} encodedKey the encodedKey from Mambu
 * @property {String} email the emailId of the user
 * @property {String} verificationToken used to verify the email of the user
 * @property {Boolean} isVerified whether the user is verified or not
 * @property {String} authToken the authToken of the user
 * @property {String} currentConvoId the authToken of the user
 */

const Users = db.get('users')

export default Users;