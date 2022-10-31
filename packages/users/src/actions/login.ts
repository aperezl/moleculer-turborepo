import { ActionSchema, Context, Errors } from "moleculer";
import { DbAdapter } from "moleculer-db";
const { MoleculerClientError } = Errors;
import bcrypt from 'bcryptjs'

type LoginInput = {
  email: string,
  password: string
}

export const login: ActionSchema = {
  params: {
    email: 'string',
    password: 'string'
  },
  async handler(this: any, ctx:Context<LoginInput>): Promise<any> {
    const { email, password } = ctx.params
    const db: DbAdapter = this.adapter
    const user:any = await db.findOne({ email })
    if (!user) {
      throw new MoleculerClientError('Email or password is invalid', 422, '', [{ field: 'email', message: 'is not found'}])
    }
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new MoleculerClientError('Email or password is invalid', 422, '', [{ field: 'email', message: 'is not found'}])
    }
    const doc = await this.transformDocuments(ctx, {}, user)
    return this.transformEntity(doc, true, '1234')

  }
}