const config = require('./config');

const swaggerOptions = {
    definition: {
        info: {
            title: 'Documentación PROYECTO FINAL CODER',
            description:
                'API REST con Express'
        },
        securityDefinitions: {
            JWT: {
                type: 'apiKey',
                description: 'Autorización JWT para la API',
                name: 'Authorization',
                in: 'header',
            },
        },
        security: [
            {
                JWT: []
            }
        ]        
    },
    apis: ['./src/routes/*.js'],
};

module.exports = swaggerOptions;