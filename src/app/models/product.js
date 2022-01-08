const mongoose = require('mongoose');

const schema = mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    codigo: { type: String, required: true, unique: true },
    foto: { type: String, required: false },
    precio: { type: Number, required: true },
    stock: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function(doc, ret) { delete ret._id }
});

const Product = mongoose.model('productos', schema);

module.exports = Product;