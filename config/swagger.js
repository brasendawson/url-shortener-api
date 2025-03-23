import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'URL Shortener API',
      version: '1.0.0',
      description: 'A URL shortening service',
      contact: {
        name: 'Brasen Ethan Kwame Dawson'
      }
    },
    servers: [
      {
        url: process.env.BASE || 'http://localhost:3333'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./routes/*.js']
};

export const specs = swaggerJsdoc(swaggerOptions);