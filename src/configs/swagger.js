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
      securitySchemes: {}
    }
  },
  apis: ['./src/docs/*.yaml']
}

module.exports = { swaggerOptions }
