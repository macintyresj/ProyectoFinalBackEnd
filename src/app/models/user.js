const mongoose = require('mongoose');

const schema = mongoose.Schema({
    email: { type: String, required: true, lowercase: true, unique: true },
    password: { type: String, required: true },
    nombre: { type: String, required: true },
    direccion: { type: String, required: false },
    edad: { type: Number, required: false },
    telefono: { type: String, required: true },
    foto: { type: String }
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function(doc, ret) { delete ret._id }
});

const User = mongoose.model('usuarios', schema);

module.exports = User;