const mongoose = require('mongoose');
const { loggerInfo, loggerError } = require('../config/log4js');

let instanciaMongoDB = null;

class MongoDB {

    constructor(url) {
        this.url = url;
        this.msjConnect();
        this.msjError();
    }

    async connect() {
        const connection = await mongoose.connect(this.url, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        return connection;
    }

    msjConnect() {
        mongoose.connection.on('connected', () => {
            loggerInfo.info(`[Mongoose] - connected`);
        });
        return false;
    }

    msjError() {
        mongoose.connection.on('error', (err) => {
            loggerError.error('[Mongoose] - error:', err.message);
        });
        return false;
    }

    static getMongoDBInstance(url) {
        if (!instanciaMongoDB) {
            instanciaMongoDB = new MongoDB(url);
        }

        return instanciaMongoDB;
    }

}

module.exports = MongoDB;