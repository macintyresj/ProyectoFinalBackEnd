const daoFactory = require('../DAO/DAOFactory.js');
const config = require('../../config/config');

class UserController {

    constructor() {
        this.userDao = daoFactory.getPersistencia('users', config.PERSISTENCIA);
    }

    async list(data) {
        return await this.userDao.read(data);
    }

    async listId(id) {
        return await this.userDao.readId(id);
    }

    async save(user) {
        return await this.userDao.create(user);
    }

    async update(id, data) {
        return await this.userDao.update(id, data);
    }

    async delete(id) {
        return await this.userDao.delete(id);
    }

}

module.exports = new UserController();