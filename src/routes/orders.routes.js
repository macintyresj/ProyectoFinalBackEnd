const { Router } = require('express');
const router = Router();
const shoppingCartController = require('../app/controllers/shoppingCarts');
const ordersController = require('../app/controllers/orders');
const { loggerError } = require('../config/log4js');
const { enviarMailOrdenGenerada } = require('../app/helpers/sendMail');


/**
 * @swagger
 * tags:
 *   name: Ordenes
 */
/**
 * @openapi
 * /ordenes/listar:
 *   get:
 *     summary: 'Listar todas las ordenes'
 *     description: Devuelve un arreglo de todas las ordenes de compra del cliente autenticado
 *     tags: [Ordenes]
 *     responses:
 *       200:
 *         description: operación exitosa
 *         schema:
 *           type: array
 *           items: 
 *             type: object
 *             properties:
 *               estado:
 *                 type: string
 *                 descripcion: Estado de la orden de compra
 *                 example: 'generada'
 *               productos:
 *                 type: array
 *                 descripcion: Arreglo de los productos que tiene la orden
 *                 items:
 *                   type: object
 *                   properties:
 *                     codigo:
 *                       type: string
 *                     nombre:
 *                       type: string
 *                     descripcion:
 *                       type: string
 *                     precio:
 *                       type: number
 *                     foto:
 *                       type: string
 *                     cantidad:
 *                       type: integer
 *               email:
 *                 type: string
 *                 descripcion: Email del cliente
 *                 example: 'username@correo.com'
 *               direccion:
 *                 type: string
 *                 descripcion: Direccion de envio
 *                 example: 'Av. siempre viva 742'
 *               timestamp:
 *                 type: string
 *                 descripcion: Fecha y hs de creacion de la orden
 *                 example: '30/10/2021 - 16:42:00HS'
 *       403:
 *         description: operacion no autorizada
 */
router.get('/listar', async (req, res) => {
    try {
        let ordenes = await ordersController.list({ email: req.user.email });
        res.json(ordenes);
    } catch (error) {
        loggerError.error(error.message);
        res.json({ status: 'error' })
    }
});


/**
 * @openapi
 * /ordenes/listar/{id}:
 *   get:
 *     summary: 'Listar una orden por su ID'
 *     description: Devuelve un objeto con los datos de la orden correspondiente al ID pasado como parametro
 *     tags: [Ordenes]
 *     parameters:
 *     - name: id
 *       in: 'path'
 *       description: 'ID de la orden a retornar'
 *     responses:
 *       200:
 *         description: operación exitosa
 *       403:
 *         description: operacion no autorizada
 */
router.get('/listar/:id', async (req, res) => {
    try {
        let orden = await ordersController.listId(req.params.id);
        res.json(orden);
    } catch (error) {
        loggerError.error(error.message);
        res.json({ status: 'error' })
    }
});


/**
 * @openapi
 * /ordenes/agregar:
 *   post:
 *     summary: 'Agregar una nueva orden'
 *     description: Genera una nueva orden con los productos que tiene cargados el carrito del cliente. Si el carrito esta vacío arroja un mensaje de error. 
 *     tags: [Ordenes]
 *     responses:
 *       200:
 *         description: operación exitosa
 *       403:
 *         description: operacion no autorizada
 */
router.post('/agregar', async (req, res) => {
    try {
        let cliente = {
            id: req.user.id,
            email: req.user.email,
            direccion: req.user.direccion
        }
        const itemsClientCart = await shoppingCartController.list(req.user.id);
        if (itemsClientCart.length) {
            let data = await ordersController.save(cliente, itemsClientCart);
            if (data) {
                return res.json({ success: 'Orden generada con exito' });
            }
            throw new Error('Error al guardar orden')
        } else {
            res.json({ error: 'Antes de generar un pedido debe agregar productos al carrito' });
        }
    } catch (error) {
        loggerError.error(error.message);
        res.json({ error: 'La orden no pudo ser generada' })
    }
});


/**
 * @openapi
 * /ordenes/actualizar/{id}:
 *   put:
 *     summary: 'Actualizar una orden'
 *     description: Actualiza la orden correspondiente al ID pasado como parametro
 *     tags: [Ordenes]
 *     parameters:
 *     - name: 'id'
 *       in: 'path'
 *       description: 'ID de la orden actualizar'
 *     - name: 'body'
 *       in: 'body'
 *       description: 'Atributos a modificar'
 *       schema:
 *         type: object
 *         properties:
 *           direccion:
 *             type: string
 *             example: 'Nueva direccion de envio'
 *     responses:
 *       200:
 *         description: operacion exitosa
 */
router.put('/actualizar/:id', async (req, res) => {
    try {
        res.json(await ordersController.update(req.params.id, req.body));
    } catch (error) {
        loggerError.error(error.message);
        res.json({ error: 'La orden no pudo ser actualizada' })
    }
});


/**
 * @openapi
 * /ordenes/borrar/{id}:
 *   delete:
 *     summary: 'Eliminar orden'
 *     description: Elimina la orden correspondiente al ID pasado como parametro
 *     tags: [Ordenes]
 *     parameters:
 *     - name: 'id'
 *       in: 'path'
 *       description: 'ID de la orden a eliminar'
 *     responses:
 *       200:
 *         description: operacion exitosa
 */
router.delete('/borrar/:id', async (req, res) => {
    try {
        res.json(await ordersController.delete(req.params.id));
    } catch (error) {
        loggerError.error(error.message);
        res.json({ error: 'La orden no pudo ser eliminada' })
    }
});


/**
 * @openapi
 * /ordenes/confirmar/{id}:
 *   put:
 *     summary: 'Confirmar una orden'
 *     description: Comfirma la orden correspondiente al ID pasado como parametro y la pasa a estado enviada. Se envia un aviso de email al admin con el detalle del pedido.
 *     tags: [Ordenes]
 *     parameters:
 *     - name: 'id'
 *       in: 'path'
 *       description: 'ID de la orden actualizar'
 *     - name: 'body'
 *       in: 'body'
 *       description: 'Atributos a modificar'
 *       schema:
 *         type: object
 *         properties:
 *           estado:
 *             type: string
 *             example: 'enviada'
 *     responses:
 *       200:
 *         description: operacion exitosa
 */
router.put('/confirmar/:id', async (req, res) => {
    try {
        let ordenConfirmada = await ordersController.update(req.params.id, { estado: 'enviada' })
        enviarMailOrdenGenerada(ordenConfirmada)
        res.json(ordenConfirmada);
    } catch (error) {
        loggerError.error(error.message);
        res.json({ error: 'La orden no pudo ser confirmada' })
    }
});

module.exports = router;