const { check } = require('express-validator');

const signupReqValidation = [
    check('username')
        .exists()
        .notEmpty()
        .withMessage('Campo requerido ')
        .isEmail()
        .withMessage('Debe ser un email valido')
    ,
    check('password')
        .exists()
        .notEmpty()
        .withMessage('Campo requerido ')
        .isString()
        .withMessage('El campo debe ser de tipo string')
    ,
    check('nombre')
        .exists()
        .notEmpty()
        .withMessage('Campo requerido ')
        .isString()
        .withMessage('El campo debe ser de tipo string')
    ,
    check('direccion')
        .exists()
        .notEmpty()
        .withMessage('Campo requerido ')
        .isString()
        .withMessage('El campo debe ser de tipo string')
    ,
    check('edad')
        .exists()
        .notEmpty()
        .withMessage('Campo requerido ')
        .isInt()
        .withMessage('El campo ser de tipo entero')
    ,
    check('telefono')
        .exists()
        .notEmpty()
        .withMessage('Campo requerido')
        .isString()
        .withMessage('El campo debe ser de tipo string')
];

const loginReqValidation = [
    check('username')
        .exists()
        .notEmpty()
        .withMessage('Campo requerido ')
        .isEmail()
        .withMessage('Debe ser un email valido')
    ,
    check('password')
        .exists()
        .notEmpty()
        .withMessage('Campo requerido ')
        .isString()
        .withMessage('El campo debe ser de tipo string')
];

const productReqValidation = [
    check('codigo')
        .isString()
        .withMessage('El campo debe ser de tipo string')
        .exists()
        .notEmpty()
        .withMessage('Campo requerido ')
    ,
    check('nombre')
        .exists()
        .notEmpty()
        .withMessage('Campo requerido ')
        .isString()
        .withMessage('El campo debe ser de tipo string')
    ,
    check('descripcion')
        .exists()
        .notEmpty()
        .withMessage('Campo requerido ')
        .isString()
        .withMessage('El campo debe ser de tipo string')
    ,
    check('precio')
        .exists()
        .notEmpty()
        .withMessage('Campo requerido ')
        .isFloat({ min: 1 })
        .withMessage('El campo debe ser un numero entero mayor a 0')
    ,
    check('stock')
        .exists()
        .notEmpty()
        .withMessage('Campo requerido ')
        .isInt({ min: 0 })
        .withMessage('El campo debe ser de tipo entero mayor o igual a 0')
];

module.exports = {
    signupReqValidation,
    loginReqValidation,
    productReqValidation
};