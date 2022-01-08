const daoFactory = require('../DAO/DAOFactory.js');
const config = require('../../config/config');

class MessageController {

    constructor() {
        this.messageDao = daoFactory.getPersistencia('messages', config.PERSISTENCIA);
    }

    async list() {
        return await this.messageDao.read();
    }

    async listId(id) {
        return await this.messageDao.readId(id);
    }

    async save(message) {
        return await this.messageDao.create(message);
    }

    async update(id, data) {
        return await this.messageDao.update(id, data);
    }

    async delete(id) {
        return await this.messageDao.delete(id);
    }

}

module.exports = new MessageController();