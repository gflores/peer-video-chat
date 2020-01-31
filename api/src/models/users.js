import db from "~/src/db";

/**
 * @typedef DbUser
 * @property {String} firstName the firstName of the user
 * @property {String} lastName the lastName of the user
 * @property {String} email the emailId of the user
 * @property {String} verificationToken used to verify the email of the user
 * @property {Boolean} isVerified whether the user is verified or not
 * @property {String} authToken the authToken of the user
 * @property {String} currentConvoId the authToken of the user
 * @property {Boolean} isAdmin whether the user is verified or not
 */

const Users = db.get('users')

export default Users;