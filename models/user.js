const getDb = require("../util/database").getDb;

module.exports = class User {
  constructor(_id, name, email, passwd, OTP) {
    this._id = _id;
    this.name = name;
    this.email = email;
    this.passwd = passwd;
    this.OTP = OTP;
  }

  save() {
    const db = getDb();
    if (this._id) {
      try {
        db.collection("users").replaceOne({ email: this.email }, this);
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        db.collection("users").insertOne(this);
      } catch (err) {
        console.log(err);
      }
    }
  }

  static fetchAll() {
    const db = getDb();
    const users = db.collection("users").find({ OTP: undefined });
    return users;
  }

  static async findByEmail(emal) {
    const db = getDb();
    try {
      return await db.collection("users").findOne({ email: emal });
    } catch (err) {
      console.log(err);
    }
  } 
};
