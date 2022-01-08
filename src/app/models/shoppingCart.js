const mongoose = require('mongoose');

const schema = mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    producto: { type: mongoose.Schema.ObjectId, ref: "productos" },
    cantidad: { type: Number, require: true },
    cliente: { type: mongoose.Schema.ObjectId, ref: "usuarios" }
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function(doc, ret) { delete ret._id }
});

const ShoppingCart = mongoose.model('carritos', schema);

module.exports = ShoppingCart;