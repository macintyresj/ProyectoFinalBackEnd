const express = require('express');
const app = express();
const http = require('http').Server(app)
const io = require('socket.io')(http);

const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const passport = require('passport');
const checkAuthentication = require('./app/middlewares/checkAuthentication');
const errorHandler = require('./app/middlewares/errorHandler');
const error404 = require('./app/middlewares/error404');

const routerProducts = require('./routes/products.routes');
const routerShoppingCart = require('./routes/shoppingCarts.routes');
const routerOrders = require('./routes/orders.routes');
const routerAuth = require('./routes/auth.routes');
const routerChat = require('./routes/chat.routes');

const config = require('./config/config');
const { loggerInfo, loggerWarn, loggerError } = require('./config/log4js');

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = swaggerJsDoc(require('./config/swagger'));


if (cluster.isMaster && config.MODO_CLUSTER) {
    loggerInfo.info('num CPUs', numCPUs)
    loggerInfo.info(`PID MASTER ${process.pid}`)

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork(); // creamos un worker para cada cpu
    }

    // controlamos la salida de los workers
    cluster.on('exit', worker => {
        loggerInfo.info('Worker', worker.process.pid, 'died');
        cluster.fork();
    });


} else {

    // Middlewares
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(passport.initialize());

    // template engine
    app.set('views', process.cwd() + '/src/views');
    app.set('view engine', 'ejs');

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

    // Rutas
    app.get('/', (req, res) => {
        try {
            res.sendFile('index.html', { root: process.cwd() + '/src/public' });
        } catch (error) {
            loggerWarn.warn(error.message)
        }
    });

    app.get('/getUser', checkAuthentication, (req, res) => {
        try {
            res.json(req.user || { status: 'Usuario no logueado.' });
        } catch (error) {
            loggerWarn.warn(error.message);
        }
    });

    app.use('/productos', routerProducts);
    app.use('/carrito', checkAuthentication, routerShoppingCart);
    app.use('/ordenes', checkAuthentication, routerOrders);
    app.use('/auth', routerAuth);
    app.use(routerChat);
    
    // SOCKETS
    const webSocket = require('./routes/ws/chat');
    const onConnection = (socket) => {
        webSocket(io, socket);
    }
    io.on('connection', onConnection);

    app.use(express.static(process.cwd() + '/src/public'));

    app.use(error404); // error 404
    app.use(errorHandler); // errorHandler

    const server = http.listen(config.PORT, () => {
        loggerInfo.info(`Servidor escuchando en http://localhost:${config.PORT}`);
        loggerInfo.info('Perfil admin:', config.admin);
        loggerInfo.info(`NODE_ENV=${config.NODE_ENV} - PERSISTENCIA=${config.PERSISTENCIA}`);
    });

    server.on('error', error => {
        loggerError.error(`Error de servidor: ${error.message}`)
    });

}