const daoFactory = require('../DAO/DAOFactory.js');
const config = require('../../config/config');

class ShoppingCartController {

    constructor() {
        this.shoppingCartDao = daoFactory.getPersistencia('shoppingCarts', config.PERSISTENCIA);
    }

    async list(id_cliente) {
        return await this.shoppingCartDao.read(id_cliente);
    }

    async listId(id) {
        return await this.shoppingCartDao.readId(id);
    }

    async save(id_producto, cantidad, id_cliente) {
        return await this.shoppingCartDao.create(id_producto, cantidad, id_cliente);
    }

    async update(id, data) {
        return await this.shoppingCartDao.update(id, data);
    }

    async delete(id) {
        return await this.shoppingCartDao.delete(id);
    }

}

module.exports = new ShoppingCartController();