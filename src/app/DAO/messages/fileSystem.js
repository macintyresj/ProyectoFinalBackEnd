const IDao = require('../IDao');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

let instaciaFileSystem = null;

class FileSystemDao extends IDao {
    constructor() {
        super();
        this.urlPath = 'src/dbFile/messages.txt';
    }

    static getInstance() {
        if (!instaciaFileSystem) {
            instaciaFileSystem = new FileSystemDao();
        }
        return instaciaFileSystem;
    }

    create(message) {
        let fileData = fs.readFileSync(this.urlPath, 'utf-8');
        let messages = fileData ? JSON.parse(fileData) : [];
        let newMessage = {
            id: uuidv4(),
            email: message.email,
            cuerpo: message.cuerpo,
            fyh: new Date().toLocaleString()
        }
        messages.push(newMessage);
        fs.writeFileSync(this.urlPath, JSON.stringify(messages, null, '\t'));
        return messages[messages.length - 1];
    }

    read() {
        let messages = fs.readFileSync(this.urlPath, 'utf-8');
        let data = messages ? JSON.parse(messages) : [];
        return data;
    }

    readId(id) {
        let fileData = fs.readFileSync(this.urlPath, 'utf-8');
        let messages = fileData ? JSON.parse(fileData) : [];
        let message = messages.filter(e => e.id == id);
        return message[0];
    }

    update(id, data) {
        let fileData = fs.readFileSync(this.urlPath, 'utf-8');
        let messages = fileData ? JSON.parse(fileData) : [];
        let message = messages.filter(p => p.id == id);
        if (message.length) {
            let messageUpdated = Object.assign(message[0], data);
            messageUpdated.timestamp = new Date().toLocaleString();
            fs.writeFileSync(this.urlPath, JSON.stringify(messages, null, '\t'));
            return messageUpdated;
        } else {
            return false;
        }
    }

    delete(id) {
        let fileData = fs.readFileSync(this.urlPath, 'utf-8');
        let messages = fileData ? JSON.parse(fileData) : [];
        let index = messages.findIndex(e => e.id == id);
        if (index >= 0) {
            const messageDeleted = messages.splice(index, 1);
            fs.writeFileSync(this.urlPath, JSON.stringify(messages, null, '\t'));
            return messageDeleted;
        } else {
            return false;
        }
    }

}

module.exports = FileSystemDao;