const IDao = require('../IDao');
const ordersModel = require('../../models/order');
const shoppingCartModel = require('../../models/shoppingCart');
const MongoDBConnection = require('../../../database/connection');
const config = require('../../../config/config');

let instanciaMongoDB = null;

class MongoDBDao extends IDao {

    constructor() {
        super();
        this.nombreColeccion = ordersModel;
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

    async create(cliente, carrito) {
        let productos = carrito.map(e => {
            return {
                codigo: e.producto.codigo,
                nombre: e.producto.nombre,
                descripcion: e.producto.descripcion,
                precio: e.producto.precio,
                foto: e.producto.foto,
                cantidad: e.cantidad
            }
        })
        await shoppingCartModel.deleteMany({ cliente: cliente.id })
        return await this.nombreColeccion.create({
            productos: productos,
            email: cliente.email,
            direccion: cliente.direccion
        });

    }

    async read(query) {
        return await this.nombreColeccion.find(query);
    }

    async readId(id) {
        return await this.nombreColeccion.findById(id);
    }

    async update(id, data) {
        return await this.nombreColeccion.findByIdAndUpdate({ _id: id }, data, { new: true })
    }

    async delete(id) {
        return await this.nombreColeccion.findByIdAndDelete({ _id: id }, { rawResult: true });
    }

}

module.exports = MongoDBDao;