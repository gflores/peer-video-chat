import db from "~/src/db";

/**
 * @typedef
 * @property {String} roomId
 * @property {String} name
 * @property {User} client
 * @property {User} admin
 */


const Convos = db.get('convos');

export default Convos;