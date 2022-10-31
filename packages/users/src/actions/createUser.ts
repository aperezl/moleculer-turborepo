import { ActionSchema, Context, Errors } from "moleculer";
import { DbAdapter } from "moleculer-db";
import bcrypt from 'bcryptjs'

const { MoleculerClientError } = Errors;

type CreateUserInput = {
  username: string;
  password: string;
  email: string;
};

export const createUser: ActionSchema = {
  params: {
    username: "string",
    password: "string",
    email: "string"
  },
  async handler(this: any, ctx: Context<CreateUserInput>): Promise<any> {
    const entity = ctx.params;
    const db: DbAdapter = this.adapter;

    await this.validateEntity(entity);
    if (entity.username) {
      const found = await db.findOne({ username: entity.username });
      if (found) {
        throw new MoleculerClientError("Username exists", 422, "", [
          { field: "username", message: "exists" },
        ]);
      }
    }

    if (entity.email) {
      const found = await db.findOne({ email: entity.email });
      if (found) {
        throw new MoleculerClientError("Email exists", 422, "", [
          { field: "username", message: "exists" },
        ]);
      }
    }

    entity.password = bcrypt.hashSync(entity.password, 10)
    
    const doc = await db.insert(entity)
    const user = await this.transformDocuments(ctx, {}, doc)
    const json = await this.transformEntity(user, true, '1234')
    await this.entityChanged('created', json, ctx)
    return json
  },
};
