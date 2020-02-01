import db from "~/src/db";

/**
 * @typedef
 * @property {String} teamId
 * @property {String} name
 * @property {String} socketRoomId
 * @property {Array} admins
 */

const Rooms = db.get('rooms');

export default Rooms;