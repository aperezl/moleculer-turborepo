import { ServiceSchema } from "moleculer"
import Fakerator from 'fakerator'
const fakerator = Fakerator()
import DbService from 'moleculer-db'

const Users:ServiceSchema = {
  name: 'users',
  mixins: [DbService],
  adapter: new DbService.MemoryAdapter(),
  settings:['_id', 'firstName', 'lastName', 'email', 'avatar', 'status'],
  actions: {},
  methods: {
    async seedDB() {
      this.logger.info('Seed Users database...')
      const fakeUser = fakerator.times(fakerator.entity.user, 10)
      const savedUsers = await this.adapter.insertMany(fakeUser)
      this.logger.info(`Created ${savedUsers.length} fake users`, savedUsers)
    }
  },
  async started() {
    if((await this.adapter.count()) === 0) {
      await this.seedDB()
    } else {
      this.logger.info(`DB contains ${await this.adapter.count()} users.`)
    }
  },
  stopped() {}
}

export default Users