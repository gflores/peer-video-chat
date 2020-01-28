import Users from "~/src/models/users.js";

const CronJob = require('cron').CronJob;

// const job = new CronJob('*/3 * * * * *', async function() {
//   const d = new Date();
// 	console.log('cron:', cron);
// });
// job.start();