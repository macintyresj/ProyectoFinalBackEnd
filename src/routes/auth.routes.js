const { Router } = require('express');
const router = Router();
const passport = require('../app/controllers/auth/passport');
const upload = require('../app/middlewares/multer');
const { signupReqValidation, loginReqValidation } = require('../app/middlewares/requestValidation');
const { validationResult } = require('express-validator');


/**
 * @swagger
 * tags:
 *   name: Auth
 */
/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: 'Login de usuario'
 *     description: Login de usuario
 *     tags: [Auth]
 *     parameters:
 *     - name: 'body'
 *       in: 'body'
 *       description: 'Campos necesarios para ingresar'
 *       schema:
 *         type: 'object'
 *         properties:
 *           username:
 *             type: 'string'
 *             required: true
 *           password:
 *             type: 'string'
 *             required: true
 *     responses:
 *       200:
 *         description: 'operación exitosa'
 *       404:
 *         description: 'usuario o contraseña incorrecta'
 */
router.post('/login', loginReqValidation, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    return passport.authenticate('login', (error, accessToken) => {
        if (error !== null) {
            return res.status(404).json({
                error: err
            });
        }

        return res.status(200).json({
            accessToken
        });
    })(req, res, next);
});


/**
 * @openapi
 * /auth/signup:
 *   post:
 *     summary: 'Registro de usuario'
 *     description: Registro de un nuevo usuario
 *     tags: [Auth]
 *     parameters:
 *     - name: 'body'
 *       in: 'body'
 *       description: 'Campos necesarios para registrarse'
 *       schema:
 *         type: 'object'
 *         properties:
 *           username:
 *             type: 'string'
 *             example: 'username@correo.com'
 *             required: true
 *           password:
 *             type: 'string'
 *             example: 'mypassword'
 *             required: true
 *           nombre:
 *             type: 'string'
 *             example: 'Don Drapper'
 *             required: true
 *           direccion:
 *             type: 'string'
 *             example: 'Avenue of the Americas 1271'
 *             required: true
 *           edad:
 *             type: 'integer'
 *             example: 35
 *             required: true
 *           telefono:
 *             type: 'string'
 *             example: +1 917 222435
 *             required: true
 *           foto:
 *             type: 'string'
 *     responses:
 *       200:
 *         description: 'operación exitosa'
 *       404:
 *         description: 'error en el registro'
 */
router.post('/signup', upload.single('foto'), signupReqValidation, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    return passport.authenticate('signup', (err, data) => {
        if (err) return res.status(404).json({ error: err });
        if (data) {
            return res.status(200).json({ success: 'Registro exitoso!' });
        }
        return res.status(400).json({ error: 'Usuario ya existe' });
    })(req, res, next);
});


module.exports = router;