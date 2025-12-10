import swaggerJSON from '../docs/swagger.json' assert { type: "json" };

export async function swaggerDocumentation(app) {
  app.get('/docs', (request, reply) => {
    return swaggerJSON
  })
}