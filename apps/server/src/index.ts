import { ServiceBroker } from 'moleculer'
import ApiGateWay from 'apigateway'
import 'moleculer-repl'

import Hello from 'hello'
import Users from 'users'
import Articles from 'articles'

const broker = new ServiceBroker({ logger: true })
broker.createService(ApiGateWay)
broker.createService(Hello)
broker.createService(Users)
broker.createService(Articles)

broker.repl()
broker
  .start()
  .then(() => broker.call('math.add', { a: 5, b: 3 }))
  .then((res) => console.log('5 + 3 =', res))
  .catch((err) => console.error(`Error occured! ${err.message}`))
