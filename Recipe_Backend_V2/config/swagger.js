const swaggerJsdoc = require("swagger-jsdoc");

const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Dishcovery API",
      version: "1.0.0",
      description: "Dishcovery Backend API"
    },
    servers: [
      {
        url: "http://localhost:5000"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ]
  },
  // apis: [path.join(__dirname, "../routes/*.route.js")]
  apis:["./routes/*.route.js"]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;