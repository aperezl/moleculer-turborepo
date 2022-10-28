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
      }
    ]
  }
}

export default ApiGateway
