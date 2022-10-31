import { Context, ServiceSchema } from "moleculer";

const Hello: ServiceSchema = {
  name: "math",
  actions: {
    add(ctx: Context<{ a: string; b: string }>): number {
      return Number(ctx.params.a) + Number(ctx.params.b);
    },
    sub(ctx: Context) {
      const { nodeID } = ctx;
      return nodeID;
    },
  },
};

export default Hello;
