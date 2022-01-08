const IDao = require('../IDao');
const messageModel = require('../../models/message');
const MongoDBConnection = require('../../../database/connection');
const config = require('../../../config/config');

let instanciaMongoDB = null;

class MongoDBDao extends IDao {
    constructor() {
        super();
        this.nombreColeccion = messageModel;
        this.conectarDB();
    }

    static getInstance() {
        if (!instanciaMongoDB) {
            instanciaMongoDB = new MongoDBDao();
        }

        return instanciaMongoDB;
    }

    async conectarDB() {
        const db = MongoDBConnection.getMongoDBInstance(config.MONGO_URL);
        await db.connect();
    }

    async create(message) {
        return this.nombreColeccion.create(message);
    }

    async read() {
        return await this.nombreColeccion.find({});
    }

    async readId(id) {
        return await this.nombreColeccion.findById(id);
    }

    async update(id, data) {
        return await this.nombreColeccion.findOneAndUpdate({ _id: id }, data);
    }

    async delete(id) {
        return await this.nombreColeccion.deleteOne({ _id: id });
    }

}

module.exports = MongoDBDao;