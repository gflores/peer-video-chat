import db from "~/src/db";

/**
 * @typedef
 * @property {String} teamId
 * @property {String} name
 * @property {String} socketRoomId
 * @property {Array} admins
 * @property {Array} introQuestions
 *    Bool isMandatory
 *    String questionText
 *    [] anwsers
 *        String anwserText
 */

const Rooms = db.get('rooms');

export default Rooms;