const IDao = require('../IDao');
const shoppingCartModel = require('../../models/shoppingCart');
const MongoDBConnection = require('../../../database/connection');
const config = require('../../../config/config');

let instanciaMongoDB = null;

class MongoDBDao extends IDao {
    constructor() {
        super();
        this.nombreColeccion = shoppingCartModel;
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

    async create(id_producto, cantidad, id_cliente) {
        let cant = await this.nombreColeccion.find({ producto: id_producto, cliente: id_cliente }, { cantidad });
        if (cant.length) {
            cant[0].cantidad += cantidad;  
            return await this.nombreColeccion.findOneAndUpdate({ producto: id_producto, cliente: id_cliente }, { cantidad: cant[0].cantidad }, { new: true } );
        } else {
            return await this.nombreColeccion.create({
                producto: id_producto,
                cantidad: cantidad,
                cliente: id_cliente
            });
        }
    }

    async read(id_cliente) {
        const data = await this.nombreColeccion.find({ cliente: id_cliente }).populate("producto");
        return data;
    }

    async readId(id) {
        return await this.nombreColeccion.findById(id).populate("producto");
    }

    async update(id, data) {
        return await this.nombreColeccion.findByIdAndUpdate({ _id: id }, data, { new: true });
    }

    async delete(id) {
        let data = await this.nombreColeccion.findByIdAndRemove({ _id: id }, { rawResult: true });
        return data.value;
    }

}

module.exports = MongoDBDao;