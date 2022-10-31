import { ServiceSchema } from "moleculer";

import DbService from "moleculer-db";
import { createUser, login, resolveToken } from "./actions";
import methods from './methods'
const Users: ServiceSchema = {
  name: "users",
  mixins: [
    DbService,
    {
      actions: {
        list: { visibility: "protected" },
        find: { visibility: "private" },
        count: { visibility: "private" },
        create: { visibility: "private" },
        insert: { visibility: "private" },
        update: { visibility: "private" },
        remove: { visibility: "private" },
      },
    },
  ],
  adapter: new DbService.MemoryAdapter(),
  settings: ["_id", "firstName", "lastName", "email", "avatar", "status"],
  actions: {
    createUser,
    login,
    resolveToken
  },
  methods,
  async started() {
    if ((await this.adapter.count()) === 0) {
      this.logger.info("seeding db...");
      await this.seedDB();
    } else {
      this.logger.info(`DB contains ${await this.adapter.count()} users.`);
    }
  },
  stopped() {},
};

export default Users;
