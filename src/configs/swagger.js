const {
  config: { SERVER_URL, SERVER_PORT }
} = require('~/configs/config')

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express API for space2study',
      version: '',
      description: ''
    },
    servers: [
      {
        url: SERVER_URL + ':' + SERVER_PORT
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter the token with the `Bearer: ` prefix, e.g. "Bearer abcde12345".'
        }
      }
    }
  },
  apis: ['./src/docs/*.yaml']
}

module.exports = { swaggerOptions }
