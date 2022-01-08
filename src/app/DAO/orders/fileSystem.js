const IDao = require('../IDao');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

let instaciaFileSystem = null;

class FileSystemDao extends IDao {
    constructor() {
        super();
        this.urlPath = 'src/dbFile/orders.txt';
    }

    static getInstance() {
        if (!instaciaFileSystem) {
            instaciaFileSystem = new FileSystemDao();
        }

        return instaciaFileSystem;
    }

    create(cliente, carrito) {
        let ordenes = JSON.parse(fs.readFileSync(this.urlPath, 'utf-8'));        
        let nuevaOrden = {
            id: uuidv4(),
            estado: 'generada',
            productos: carrito.map(e => {
                return {
                    id: uuidv4(),
                    codigo: e.producto.codigo,
                    nombre: e.producto.nombre,
                    descripcion: e.producto.descripcion,
                    precio: e.producto.precio,
                    foto: e.producto.foto,
                    cantidad: e.cantidad
                }
            }),
            email: cliente.email,
            direccion: cliente.direccion,
            timestamp: new Date().toLocaleString()
        } 
        
        ordenes.push(nuevaOrden);
        fs.writeFileSync(this.urlPath, JSON.stringify(ordenes, null, '\t'));
        return nuevaOrden;
        
    }

    read(query) {
        let ordenes = JSON.parse(fs.readFileSync(this.urlPath, 'utf-8'));
        let ordenesCliente = ordenes.filter(e => e.email == query.email);
        return ordenesCliente;
    }

    readId(id) {
        let ordenes = JSON.parse(fs.readFileSync(this.urlPath, 'utf-8'));
        let orden = ordenes.filter(e => e.id == id);
        return orden[0];
    }

    update(id, data) {
        let ordenes = JSON.parse(fs.readFileSync(this.urlPath, 'utf-8'));
        let orden = ordenes.filter(p => p.id == id);
        if (orden.length) {
            let ordenActualizada = Object.assign(orden[0], data);
            ordenActualizada.timestamp = new Date().toLocaleString();
            fs.writeFileSync(this.urlPath, JSON.stringify(ordenes, null, '\t'));
            return ordenActualizada;
        } else {
            return false;
        }
    }

    delete(id) {
        let ordenes = JSON.parse(fs.readFileSync(this.urlPath, 'utf-8'));
        let index = ordenes.findIndex(e => e.id == id);
        if (index >= 0) {
            const ordenEliminada = ordenes.splice(index, 1);
            fs.writeFileSync(this.urlPath, JSON.stringify(ordenes, null, '\t'));
            return ordenEliminada[0];
        } else {
            return false;
        }
    }

}

module.exports = FileSystemDao;