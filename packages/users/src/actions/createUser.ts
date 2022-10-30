import { Context } from 'moleculer'

type CreateUserInput = {
  username: string
  password: string
  email: string
}

export async function createUser(this: any, ctx: Context<CreateUserInput>): Promise<any> {
  const { username, password, email } = ctx.params
  return this.adapter.insert({username, password, email})
}
