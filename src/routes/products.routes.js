const { Router } = require('express');
const router = Router();
const products = require('../app/controllers/products');
const checkAuthentication = require('../app/middlewares/checkAuthentication');
const isAdmin = require('../app/middlewares/isAdmin');
const { productReqValidation } = require('../app/middlewares/requestValidation');
const { validationResult } = require('express-validator');
const { loggerWarn } = require('../config/log4js');

/**
 * @swagger
 * tags:
 *   name: Productos
 */
/**
 * @openapi
 * /productos/listar:
 *   get:
 *     summary: 'Listar todos los productos'
 *     description: Endpoint que devuelve un arreglo de objetos de todos los productos cargados
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: operación exitosa
 *         schema:
 *           type: array
 *           items: 
 *             type: object
 *             properties:
 *               codigo:
 *                 type: string
 *                 descripcion: Codigo del producto
 *                 example: '0005'
 *               nombre:
 *                 type: string
 *                 descripcion: Nombre del producto
 *                 example: Monitor 27 pulgadas
 *               descripcion:
 *                 type: string
 *                 descripcion: Descripcion del producto
 *                 example: Monitor gamming 144hz
 *               precio:
 *                 type: number
 *                 descripcion: Precio del producto
 *                 example: 550.89
 *               stock:
 *                 type: integer
 *                 descripcion: Stock del producto
 *                 example: 5
 *               foto:
 *                 type: string
 *                 descripcion: Url de la foto del producto
 *                 example: http://img.com
 */
router.get('/listar', async (req, res) => {
    try {
        const data = await products.list();
        if (data.length > 0) return res.status(200).json(data);
        throw new Error('No hay productos cargados.')
    } catch (error) {
        loggerWarn.warn(error.message);
        res.json({ error: error.message });
    }
});


/**
 * @openapi
 * /productos/listar/{id}:
 *   get:
 *     summary: 'Listar un producto por su ID'
 *     tags: [Productos]
 *     description: Devuelve el producto filtrado por su ID
 *     parameters:
 *     - name: 'id'
 *       in: 'path'
 *       description: 'ID del producto a retornar'
 *     responses:
 *       200:
 *         description: 'operación exitosa'
 *       404:
 *         description: 'producto no encontrado'
 */
router.get('/listar/:id', async (req, res) => {
    try {
        const product = await products.listId(req.params.id);
        if (product) return res.status(200).json(product);
        throw new Error(`El producto con id: ${req.params.id} no existe.`)
    } catch (error) {
        loggerWarn.warn(error.message);
        res.status(404).json({ error: error.message });
    }
});


/**
 * @openapi
 * /productos/agregar:
 *   post:
 *     summary: 'Agregar un nuevo producto'
 *     description: Agregar un nuevo producto a la BD
 *     tags: [Productos]
 *     parameters:
 *     - name: 'body'
 *       in: 'body'
 *       description: 'Atributos del producto que debe agregarse a la tienda'
 *       schema:
 *         type: 'object'
 *         properties:
 *               codigo:
 *                 type: string
 *                 descripcion: Codigo del producto
 *                 example: '0005'
 *               nombre:
 *                 type: string
 *                 descripcion: Nombre del producto
 *                 example: Monitor 27 pulgadas
 *               descripcion:
 *                 type: string
 *                 descripcion: Descripcion del producto
 *                 example: Monitor gamming 144hz
 *               precio:
 *                 type: number
 *                 descripcion: Precio del producto
 *                 example: 550.89
 *               stock:
 *                 type: integer
 *                 descripcion: Stock del producto
 *                 example: 5
 *               foto:
 *                 type: string
 *                 descripcion: Url de la foto del producto
 *                 example: http://img.com
 *     responses:
 *       200:
 *         description: 'operación exitosa'
 *       403:
 *         description: 'operacion no autorizada'
 */
router.post('/agregar', checkAuthentication, isAdmin, productReqValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        res.status(200).json(await products.save(req.body));
    } catch (error) {
        loggerWarn.warn(error);
        res.json({ error: error.message });
    }
});


/**
 * @openapi
 * /productos/actualizar/{id}:
 *   put:
 *     summary: 'Actualizar un producto'
 *     description: Actualiza el producto del ID indicado
 *     tags: [Productos]
 *     parameters:
 *     - name: 'id'
 *       in: 'path'
 *       description: 'ID del producto a actualizar'
 *     - name: 'body'
 *       in: 'body'
 *       description: 'Atributos del producto a actualizar'
 *       schema:
 *         type: 'object'
 *         properties:
 *           codigo:
 *             type: 'string'
 *           nombre:
 *             type: 'string'
 *           descripcion:
 *             type: 'string'
 *           precio:
 *             type: 'number'
 *           stock:
 *             type: 'integer'
 *           foto: 
 *             type: 'string'
 *     responses:
 *       200:
 *         description: 'operación exitosa'
 *       403:
 *         description: 'operacion no autorizada'
 */
router.put('/actualizar/:id', checkAuthentication, isAdmin, productReqValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let productUpdated = await products.update(req.params.id, req.body)
        if (productUpdated) return res.status(200).json(productUpdated);
        res.status(404).json({ error: 'El producto que intenta actualizar no existe.'})
    } catch (error) {
        loggerWarn.warn(error);
        res.json({ error: error.message });
    }
});


/**
 * @openapi
 * /productos/borrar/{id}:
 *   delete:
 *     summary: 'Eliminar un producto'
 *     description: Elimina el producto del ID indicado
 *     tags: [Productos]
 *     parameters:
 *     - name: 'id'
 *       in: 'path'
 *       description: 'ID del producto a eliminar'
 *     responses:
 *       200:
 *         description: 'operación exitosa'
 *       403:
 *         description: 'operacion no autorizada'
 */
router.delete('/borrar/:id', checkAuthentication, isAdmin, async (req, res) => {
    try {
        let productDeleted = await products.delete(req.params.id);
        if (productDeleted) return res.status(200).json(productDeleted);
        res.status(404).json({ error: 'El producto que intenta eliminar no existe.'})
    } catch (error) {
        loggerWarn.warn(error);
        res.json({ error: error.message });
    }
});

// filtros
router.get('/buscar', async (req, res) => {
    try {
        const data = await products.search(req.query);
        if (data.length > 0) {
            res.json(data);
        } else {
            throw new Error('No hay productos que coincidan con la busqueda.')
        }
    } catch (error) {
        loggerWarn.warn(error);
        res.json({ error: error.message });
    }
})

module.exports = router;