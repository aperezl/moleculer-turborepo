import { ServiceSchema } from "moleculer"
import Fakerator from 'fakerator'
const fakerator = Fakerator()
import DbService from 'moleculer-db'
import { createUser } from "./actions"

const Users:ServiceSchema = {
  name: 'users',
  mixins: [DbService, {
    actions: {
      list: { visibility: 'protected' },
      find: { visibility: 'private' },
      count: { visibility: 'private' },
      create: { visibility: 'private' },
      insert: { visibility: 'private' },
      update: { visibility: 'private' },
      remove: { visibility: 'private' }
    }
  }],
  adapter: new DbService.MemoryAdapter(),
  settings:['_id', 'firstName', 'lastName', 'email', 'avatar', 'status'],
  actions: {
    createUser
  },
  methods: {
    async seedDB() {
      this.logger.info('Seed Users database...')
      const fakeUser = fakerator.times(fakerator.entity.user, 10)

      try{
      const savedUsers = await this.adapter.insertMany(fakeUser)
      this.logger.info(`Created ${savedUsers.length} fake users`, savedUsers)
      } catch(e) {

        console.log(e)
      }
      
    }
  },
  async started() {
    if((await this.adapter.count()) === 0) {
      this.logger.info('seeding db...')
      await this.seedDB()
    } else {
      this.logger.info(`DB contains ${await this.adapter.count()} users.`)
    }
  },
  stopped() {}
}

export default Users