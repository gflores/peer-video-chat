import config from './config'

const db = require('monk')(config.databaseUrl)

db.addMiddleware(context => next => (args, method) => {
    if (method === 'insert'){
        var date = new Date();
        args.data.createdAt = date;
        args.data.updatedAt = date;
    }
    else if (method === 'update'){
        args.update['$set'].updatedAt = new Date();
    }

    return next(args, method);
})

module.exports = db;