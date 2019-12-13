import db from "~/src/db";

/**
 * @typedef
 * @property {String} roomId
 * @property {User} clientId
 * @property {User} adminId
 * @property {string} state {waiting, abandoned, in-conversation, ended-by-client, ended-by-admin}
 */


const Convos = db.get('convos');

export default Convos;