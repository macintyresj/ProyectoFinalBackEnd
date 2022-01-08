const daoFactory = require('../DAO/DAOFactory.js');
const config = require('../../config/config');

class ProductController {

    constructor() {
        this.productDao = daoFactory.getPersistencia('products', config.PERSISTENCIA);
    }


    async list() {
        return await this.productDao.read();
    }

    async listId(id) {
        return await this.productDao.readId(id);
    }

    async save(product) {
        return await this.productDao.create(product);
    }

    async update(id, data) {
        return await this.productDao.update(id, data);
    }

    async delete(id) {
        return await this.productDao.delete(id);
    }

    async search(filters) {
        return await this.productDao.search(filters);
    }

}

module.exports = new ProductController();