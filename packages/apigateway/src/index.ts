import { ServiceSchema } from 'moleculer'
import ApiGwService from 'moleculer-web'

const ApiGateway:ServiceSchema = {
  name: 'ApiGateway',
  mixins: [ApiGwService],
  settings: {
    port: 4000,
    routes: [
      {
        path: '/',
        aliases: {
          'GET /math/:a/:b': 'math.add'
        }
      },
      {
        path: '/api',
        mappingPolicy: 'restrict',
        aliases: {
          // Users aliases
          'REST users': 'users',

          // Articles aliases
          'PUT articles/:id/vote': 'articles.vote',
          'PUT articles/:id/unvote': 'articles.unvote',

          'REST articles': 'articles'
        }
      }
    ]
  }
}

export default ApiGateway
