const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    productos: [
        {
            codigo: String,
            nombre: String,
            descripcion: String,
            precio: Number,
            foto: String,
            cantidad: Number
        }
    ],
    email: { type: String, required: true },
    direccion: { type: String, required: true },
    estado: { type: String, enum: ['generada', 'enviada'], default: 'generada' },
    timestamp: { type: Date, default: Date.now }
});

orderSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id }
});

const Order = mongoose.model('ordenes', orderSchema);

module.exports = Order;