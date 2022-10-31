import { Context, ServiceSchema } from "moleculer";
import Fakerator from "fakerator";
import DbService from "moleculer-db";

const fakerator = Fakerator();

const Articles: ServiceSchema = {
  name: "articles",
  mixins: [DbService],
  adapter: new DbService.MemoryAdapter(),
  dependencies: ["users"],
  settings: {
    fields: ["_id", "title", "content", "author", "votes", "created"],
    populates: {
      author: {
        action: "users.get",
        params: {
          fields: ["firstName", "lastName"],
        },
      },
    },
  },
  entityValidator: {
    title: { type: "string", empty: false },
    content: { type: "string" },
    author: { type: "string", empty: false },
  },
  hooks: {
    before: {
      create(ctx: Context<{ votes: number; created: Date }>) {
        ctx.params.votes = 0;
        ctx.params.created = new Date();
      },
      update(ctx: Context<{ updated: Date }>) {
        ctx.params.updated = new Date();
      },
    },
  },
  actions: {
    vote: {
      params: {
        id: { type: "string" },
      },
      async handler(ctx: Context<{ id: string }>) {
        const res = this.adapter.updateById(ctx.params.id, {
          $inc: { votes: 1 },
        });
        return await this.transformDocuments(ctx, {}, res);
      },
    },
    unvote: {
      params: {
        id: { type: "string" },
      },
      async handler(ctx: Context<{ id: string }>) {
        const res = this.adapter.updateById(ctx.params.id, {
          $inc: { votes: -1 },
        });
        return await this.transformDocuments(ctx, {}, res);
      },
    },
  },
  methods: {
    async seedDB() {
      this.logger.info("Seed Articles database...");
      const res: any = await this.broker.call("users.list");
      const authors = res.rows;
      this.logger.info("Authors: ", authors);
      const fakeArticles = fakerator.times(fakerator.entity.post, 10);
      fakeArticles.forEach((article) => {
        const author: any = fakerator.random.arrayElement(authors);
        const votes: number = fakerator.random.number(10);
        article.author = author._id;
        article.votes = votes;
      });
      const savedArticles = await this.adapter.insertMany(fakeArticles);
      this.logger.info(`Created ${savedArticles.length} fake articles`);
    },
  },
  async started() {
    if ((await this.adapter.count()) === 0) {
      await this.seedDB();
    } else {
      this.logger.info(`DB contains ${await this.adapter.count()} articles.`);
    }
    this.logger.info("5555ooooo");
  },
};

export default Articles;
