import Fastify from "fastify";
import cors from "@fastify/cors"
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'

import { postsRoutes } from "./routes/posts.js";
import swaggerJSON from "./docs/swagger.json" assert { type: "json" };

const app = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty'
    }
  }
})

app.register(cors);
app.register(postsRoutes)
app.register(swagger, {
  openapi: swaggerJSON
})

await app.register(swaggerUI, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list'
  }
})

app.listen({
    host: "0.0.0.0",
    port: 3333
  }
)