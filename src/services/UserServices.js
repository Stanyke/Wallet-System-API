const db = require("../../bin/db");

class UserService {
  async register(data) {
    let [user] = await db("users").insert(data);
    user = await this.findOne({ sn: user });
    return user;
  }

  async findById(id, withPassword) {
    let user = await db.select("*").from("users").where({ id });
    user = user.length ? user[0] : null;
    withPassword ? user : delete user?.password;
    return user;
  }

  async findOne(data, withPassword) {
    let user = await db.select("*").from("users").where(data);
    user = user.length ? user[0] : null;
    withPassword ? user : delete user?.password;
    return user;
  }

  async updateWallet(amount, data) {
    let user = await db("users")
      .update({ account_balance: amount })
      .where(data);
    user = user ? true : false;
    return user;
  }

  async deleteOne(data) {
    let user = await db("users").del().where(data);
    user = user ? true : false;
    return user;
  }
}

module.exports = new UserService();
