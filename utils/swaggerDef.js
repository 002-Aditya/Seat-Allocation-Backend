const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Converge HR Connect',
            version: '1.0.0',
            description: 'Converge HR Connect API',
        },
        servers: [
            {
                url: 'http://localhost:8081',
                description: 'Development server',
            },
            {
                url: 'https://convergehrconnectapi.mpcplatform.cloud',
                description: 'UAT server',
            }
        ],
    },
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;