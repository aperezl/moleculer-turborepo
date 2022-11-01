import { ServiceBroker } from "moleculer";
import ApiGateWay from "apigateway";
import "moleculer-repl";

import Hello from "hello";
import Users from "users";
import Articles from "articles";

const broker = new ServiceBroker({
  logger: true,
  // transporter: "NATS",
  metrics: {
    enabled: true,
    reporter: [
      {
        type: "Prometheus",
        options: {
          port: 3030,
          path: "/metrics",
          defaultLabels: (registry: any) => ({
            namespace: registry.broker.namespace,
            nodeID: registry.broker.nodeID,
          }),
        },
      },
    ],
  },
});
broker.createService(ApiGateWay);
broker.createService(Hello);
broker.createService(Users);
broker.createService(Articles);

// broker.repl();
broker
  .start()
  .then(() => broker.call("math.add", { a: 5, b: 3 }))
  .then((res) => console.log("5 + 4 =", res))
  .catch((err) => console.error(`Error occured! ${err.message}`));
