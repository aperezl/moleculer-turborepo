import { ActionSchema, Context } from "moleculer";
import jwt from 'jsonwebtoken'
import { DbAdapter } from "moleculer-db";

export const resolveToken:ActionSchema = {
  cache: {
    keys: ['token'],
    ttl: 60 * 60
  },
  params: {
    token: 'string'
  },
  async handler(ctx:Context<{token:string}>) {
    const db: DbAdapter = this.adapter
    try {
      const decode:any = await jwt.verify(ctx.params.token, 'secret')
      const user = await db.findById(decode.id)
      return this.transformEntity(user, true, '1234')

    } catch(error) {
      console.log({ error })
    }
  }
}