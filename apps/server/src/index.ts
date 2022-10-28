import { ServiceBroker } from 'moleculer'
import Hello from 'hello'
import ApiGateWay from 'apigateway'

const broker = new ServiceBroker({ logger: true })
broker.createService(ApiGateWay)
broker.createService(Hello)

broker
  .start()
  .then(() => broker.call('math.add', { a: 5, b: 3 }))
  .then((res) => console.log('5 + 3 =', res))
  .catch((err) => console.error(`Error occured! ${err.message}`))
