import db from "~/src/db";

/**
 * @typedef
 * @property {String} organisationId
 * @property {String} name
 * @property {String} socketRoomId
 * @property {Array} clients
 * @property {Array} admins
 */


const Rooms = db.get('rooms');

export default Rooms;