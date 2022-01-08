const IDao = require('../IDao');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

let instaciaFileSystem = null;

class FileSystemDao extends IDao {
    constructor() {
        super();
        this.urlPath = 'src/dbFile/users.txt';
    }

    static getInstance() {
        if (!instaciaFileSystem) {
            instaciaFileSystem = new FileSystemDao();
        }
        return instaciaFileSystem;
    }

    create(user) {
        let users = JSON.parse(fs.readFileSync(this.urlPath, 'utf-8'));
        user['id'] = uuidv4();
        users.push(user);
        fs.writeFileSync(this.urlPath, JSON.stringify(users, null, '\t'));
        return users[users.length - 1];
    }


    read(username) {
        if (username) {
            const users = JSON.parse(fs.readFileSync(this.urlPath, 'utf-8'));
            const user = users.filter(e => e.email == username.email);
            return user;
        } else {
            const users = fs.readFileSync(this.urlPath, 'utf-8');
            return users ? JSON.parse(users) : [];
        }
    }

    readId(id) {
        if (id) {
            const users = JSON.parse(fs.readFileSync(this.urlPath, 'utf-8'));
            const user = users.filter(e => e.id == id);
            return user[0];
        } else {
            return false;
        }
    }

}

module.exports = FileSystemDao;