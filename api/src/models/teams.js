import db from "~/src/db";

/**
 * @typedef DbUser
 * @property {String} name
 */

const Teams = db.get('teams')

export default Teams;