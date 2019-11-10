import db from "~/src/db";

/**
 * @typedef DbRepresentative
 * @property {String} name
 */

db.create('representatives');

const Representatives = db.get('representatives');

export default Representatives;