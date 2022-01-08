const IDao = require('../IDao');
const productModel = require('../../models/product');
const MongoDBConnection = require('../../../database/connection');
const config = require('../../../config/config');

let instanciaMongoDB = null;

class MongoDBDao extends IDao {
    constructor() {
        super();
        this.nombreColeccion = productModel;
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

    async create(data) {
        return await this.nombreColeccion.create(data);
    }

    async read() {
        const data = await this.nombreColeccion.find({});
        if (data.length > 0) {
            return data;
        } else {
            return [];
        }
    }

    async readId(id) {
        const data = await this.nombreColeccion.findById(id);
        return data;
    }

    async update(id, data) {
        return await this.nombreColeccion.findByIdAndUpdate({ _id: id }, data, { new: true });
    }

    async delete(id) {
        let data = await this.nombreColeccion.findByIdAndRemove({ _id: id }, { rawResult: true });
        return data.value;
    }

    async search(filters) {
        filters.nombre.length == 0 ? filters.nombre = null : '';
        return await this.nombreColeccion.find({
            $or: [
                { nombre: { $regex: '.*' + filters.nombre + '.*', $options:'i' } },
                { codigo: filters.codigo },
                { precio: { $gte: filters.precioMin, $lte: filters.precioMax } },
                { stock: { $gte: filters.stockMin, $lte: filters.stockMax } }
            ]
        });
    }

}

module.exports = MongoDBDao;