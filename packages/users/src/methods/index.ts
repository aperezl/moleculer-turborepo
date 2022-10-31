import { ServiceMethods } from "moleculer";
import jwt from 'jsonwebtoken'
import Fakerator from "fakerator";
const fakerator = Fakerator();

const methods:ServiceMethods = {
  transformEntity(user) {
    user.token = user.token || this.generateJWT(user)
    delete user.password
    return user
  },
  generateJWT(user) {
    const today = new Date()
    const exp = new Date(today)
    exp.setDate(today.getDate() + 60)
    return jwt.sign({
      id: user._id,
      username: user.username,
      exp: Math.floor(exp.getTime() / 1000)
    }, 'secret')
  },
  async seedDB() {
      this.logger.info("Seed Users database...");
      const fakeUser = fakerator.times(fakerator.entity.user, 10);

      try {
        const savedUsers = await this.adapter.insertMany(fakeUser);
        this.logger.info(`Created ${savedUsers.length} fake users`, savedUsers);
      } catch (e) {
        console.log(e);
      }
    },
}

export default methods