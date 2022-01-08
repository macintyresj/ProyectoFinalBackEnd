const IDao = require('../IDao');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

let instaciaFileSystem = null;

class FileSystemDao extends IDao {
    constructor() {
        super();
        this.urlPath = 'src/dbFile/products.txt';
    }

    static getInstance() {
        if (!instaciaFileSystem) {
            instaciaFileSystem = new FileSystemDao();
        }

        return instaciaFileSystem;
    }

    create(product) {
        let products = this.read();
        const newProduct = {
            id: uuidv4(),
            timestamp: new Date().toLocaleString(),
            nombre: product.nombre,
            descripcion: product.descripcion,
            codigo: product.codigo,
            foto: product.foto,
            precio: product.precio,
            stock: product.stock
        }
        products.push(newProduct);
        fs.writeFileSync(this.urlPath, JSON.stringify(products, null, '\t'));
        return products[products.length - 1];
    }

    read() {
        const products = fs.readFileSync(this.urlPath, 'utf-8');
        return products ? JSON.parse(products) : [];
    }

    readId(id) {
        const products = this.read();
        const product = products.filter(e => e.id == id);
        return product[0];
    }

    update(id, data) {
        let products = this.read();
        let product = products.filter(p => p.id == id);
        if (product.length) {
            let productUpdated = Object.assign(product[0], data);
            productUpdated.timestamp = new Date().toLocaleString();
            fs.writeFileSync(this.urlPath, JSON.stringify(products, null, '\t'));
            return productUpdated;
        } else {
            return false;
        }
    }

    delete(id) {
        let products = this.read();
        let index = products.findIndex(p => p.id == id);
        if (index >= 0) {
            const productDeleted = products.splice(index, 1);
            fs.writeFileSync(this.urlPath, JSON.stringify(products, null, '\t'));
            return productDeleted;
        } else {
            return false;
        }
    }

    search(filters) {
        const products = this.read();
        const data = products.filter(p => (p.nombre.toLowerCase() == filters.nombre.toLowerCase()) || (p.codigo == filters.codigo) || ((p.precio >= Number(filters.precioMin)) && (p.precio <= Number(filters.precioMax))) || ((p.stock >= Number(filters.stockMin)) && (p.stock <= Number(filters.stockMax))));
        return data;
    }

}

module.exports = FileSystemDao;