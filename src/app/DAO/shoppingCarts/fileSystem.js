const IDao = require('../IDao');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const fsDaoProducts = require('../products/fileSystem').getInstance();

let instaciaFileSystem = null;

class FileSystemDao extends IDao {
    constructor() {
        super();
        this.urlPath = 'src/dbFile/shoppingCarts.txt';
    }

    static getInstance() {
        if (!instaciaFileSystem) {
            instaciaFileSystem = new FileSystemDao();
        }

        return instaciaFileSystem;
    }

    create(id_producto, cantidad, id_client) {
        const producto = fsDaoProducts.readId(id_producto);
        let carritos = JSON.parse(fs.readFileSync(this.urlPath, 'utf-8'));
        let previousItem = carritos.filter(e => {
            return (e.producto.id == id_producto && e.client_id == id_client)
        });
        if (previousItem.length) {
            previousItem[0].cantidad += cantidad;
            fs.writeFileSync(this.urlPath, JSON.stringify(carritos, null, '\t'));
            return previousItem[0];
        } else {
            const newProductCart = {
                id: uuidv4(),
                timestamp: new Date().toLocaleString(),
                producto: producto,
                cantidad: cantidad,
                client_id: id_client
            };
            carritos.push(newProductCart);
            fs.writeFileSync(this.urlPath, JSON.stringify(carritos, null, '\t'));
            return newProductCart;
        }
    }

    read(client_id) {
        const carritos = JSON.parse(fs.readFileSync(this.urlPath, 'utf-8'));
        const carritoUser = carritos.filter(e => e.client_id == client_id);
        return carritoUser;
    }

    readId(id) {
        const carritos = JSON.parse(fs.readFileSync(this.urlPath, 'utf-8'));
        const carrito = carritos.filter(e => e.id == id);
        return carrito;
    }

    delete(id) {
        let carritos = JSON.parse(fs.readFileSync(this.urlPath, 'utf-8'));
        const index = carritos.findIndex(carrito => carrito.id == id);
        if (index >= 0) {
            const carritoEliminado = carritos.splice(index, 1);
            fs.writeFileSync(this.urlPath, JSON.stringify(carritos, null, '\t'));
            return carritoEliminado[0];
        } else {
            return false;
        }
    }

}

module.exports = FileSystemDao;