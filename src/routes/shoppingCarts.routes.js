const { Router } = require('express');
const router = Router();
const carrito = require('../app/controllers/shoppingCarts');
const { loggerWarn } = require('../config/log4js');


/**
 * @swagger
 * tags:
 *   name: Carrito
 */
/**
 * @openapi
 * /carrito/listar:
 *   get:
 *     summary: 'Listar todos los items del carrito'
 *     description: Endpoint que devuelve un arreglo de productos cargados en el carrito de compras del cliente autenticado
 *     tags: [Carrito]
 *     responses:
 *       200:
 *         description: operación exitosa
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               producto:
 *                 type: object
 *                 properties:
 *                   codigo:
 *                     type: string
 *                   nombre:
 *                     type: string
 *                   descripcion:
 *                     type: string
 *                   precio:
 *                     type: number
 *                   stock:
 *                     type: integer
 *                   foto:
 *                     type: string
 *               cantidad:
 *                 type: 'integer'
 *               cliente:
 *                 type: string
 *               timestamp:
 *                 type: string
 *               id:
 *                 type: string
 *       403:
 *         description: operacion no autorizada
 */
router.get('/listar', async (req, res) => {
    try {
        const data = await carrito.list(req.user.id);
        if (data.length) return res.status(200).json(data);
        throw new Error('No hay carritos cargados para el cliente.')
    } catch (error) {
        loggerWarn.warn(error.message);
        res.json({ error: error.message });
    }
});


/**
 * @openapi
 * /carrito/listar/{id}:
 *   get:
 *     summary: 'Listar un item del carrito por su ID'
 *     description: Devuelve un objeto con el producto y cantidad del item correspondiente al ID pasado como parametro
 *     tags: [Carrito]
 *     parameters:
 *     - name: 'id'
 *       in: 'path'
 *       description: 'ID del item del carrito a retornar'
 *     responses:
 *       200:
 *         description: operación exitosa
 *         schema:
 *           type: object
 *           properties:
 *             producto:
 *               type: object
 *               properties:
 *                 nombre:
 *                   type: string
 *                 descripcion:
 *                   type: string
 *                 precio:
 *                   type: number
 *                 stock:
 *                   type: integer
 *                 foto:
 *                   type: string
 *             cantidad:
 *               type: 'integer'
 *             cliente:
 *               type: string
 *             timestamp:
 *               type: string
 *             id:
 *               type: string
 *       403:
 *         description: operacion no autorizada
 */
router.get('/listar/:id', async (req, res) => {
    try {
        const data = await carrito.listId(req.params.id);
        if (!data) throw new Error(`El carrito con id: ${req.params.id} no existe.`)
        return res.json(data);
    } catch (error) {
        loggerWarn.warn(error.message);
        res.json({ error: error.message });
    }
});


/**
 * @openapi
 * /carrito/agregar/{id_producto}:
 *   post:
 *     summary: 'Agregar producto al carrito'
 *     description: Agrega un nuevo producto al carrito del cliente
 *     tags: [Carrito]
 *     parameters:
 *     - name: 'id_producto'
 *       in: 'path'
 *       description: 'ID del producto a incorporar al carrito'
 *     - name: 'body'
 *       in: 'body'
 *       description: 'Cantidad de productos a incorporar'
 *       schema:
 *         type: object
 *         properties:
 *           cantidad:
 *             type: integer
 *     responses:
 *       200:
 *         description: operacion exitosa
 */
router.post('/agregar/:id_producto', async (req, res) => {
    try {
        res.json(await carrito.save(req.params.id_producto, req.body.cantidad, req.user.id));
    } catch (error) {
        loggerWarn.warn(error);
        res.json({ error: error.message });
    }
});


/**
 * @openapi
 * /carrito/actualizar/{id}:
 *   put:
 *     summary: 'Actualizar cantidad item del carrito'
 *     description: Actualiza la cantidad del item del carrito correspondiente al ID pasado como parametro
 *     tags: [Carrito]
 *     parameters:
 *     - name: 'id'
 *       in: 'path'
 *       description: 'ID del item del carrito a actualizar'
 *     - name: 'body'
 *       in: 'body'
 *       description: 'Atributo cantidad a modificar'
 *       schema:
 *         type: object
 *         properties:
 *           cantidad:
 *             type: integer
 *     responses:
 *       200:
 *         description: operacion exitosa
 */
router.put('/actualizar/:id', async (req, res) => {
    try {
        res.status(200).json(await carrito.update(req.params.id, req.body));
    } catch (error) {
        loggerWarn.warn(error);
        res.json({ error: error.message });
    }
});


/**
 * @openapi
 * /carrito/borrar/{id}:
 *   delete:
 *     summary: 'Eliminar item del carrito'
 *     description: Elimina el item del carrito correspondiente al ID pasado como parametro
 *     tags: [Carrito]
 *     parameters:
 *     - name: 'id'
 *       in: 'path'
 *       description: 'ID del item del carrito a eliminar'
 *     responses:
 *       200:
 *         description: operacion exitosa
 */
router.delete('/borrar/:id', async (req, res) => {
    try {
        res.json(await carrito.delete(req.params.id));
    } catch (error) {
        loggerWarn.warn(error);
        res.json({ error: error.message });
    }
});

module.exports = router;