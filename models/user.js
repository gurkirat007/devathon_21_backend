const getDb = require("../util/database").getDb;

module.exports = class User {
  constructor(obj) {
    if(obj) {
      Object.assign(this, obj);
    } else {
      throw 'param object is NULL dumbo !';
    }
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
