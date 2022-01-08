class IDao {

    constructor() {}

    async create(data) {
        throw new Error('create() debe ser impementado');
    }

    async read() {
        throw new Error('read() debe ser impementado');
    }

    async readId(id) {
        throw new Error('readId() debe ser impementado');
    }

    async update(id, data) {
        throw new Error('update() debe ser impementado');
    }

    async delete(id) {
        throw new Error('delete() debe ser impementado');
    }

    async deleteAll() {
        throw new Error('deleteAll() debe ser impementado');
    }
}

module.exports = IDao;