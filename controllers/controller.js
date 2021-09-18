const bcrypt = require("bcrypt");
const { urlencoded } = require("body-parser");
const express = require("express");
const User = require("../models/user");
const otpGen = require("../util/randomOTP");
const emailGen = require('../util/sendEmail');


module.exports.getAllUsers = async (req, res, next) => {
  let users;
  try {users = await User.fetchAll();}
  catch(err) {
    console.log(err);
  }
  res.status(400).json(users);
};

module.exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findByEmail(email);

  if (!user) {
    res.status(401).json({ message: "Credentials Gone Bad !" });
  }
  try {
    let isMatch;
    await bcrypt.compare(password, user.password, (err, response) => {
      if (response) {
        req.session.isAuth = true;
        res.status(200).json({ message: "Login Successful !" });
      } else {
        res.status(401).json({ message: "Credentials Gone Bad !" });
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Internal Error Ocuured ! Re-Try" });
  }
};

module.exports.getUserDashboard = (req, res, next) => {
  const { email } = req.body;
  let user;

  try {
    user = User.findByEmail({ email });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "DataBase Error Ocuured !" });
  }

  if (user) {
    return res.status(200).json(user);
  } else {
    return res.status(400).json({ message: "User Not FOUND !" });
  }
};

module.exports.requestForUserCreation = async (req, res, next) => {
  const { name, email, password } = req.body;
  // console.log("A             "+email);
  let user; //undefined

  //check if the user exists
  try {
    user = await User.findByEmail(email);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "DataBase Error Occured !" });
  }

  //if user exists and he is validated then send error response
  if (user && !user.OTP) {
    return res.status(403).json({ message: "User Already Exists" });
  }

  let otp = await otpGen();

  if(user) {
    user.OTP = otp;
  }

  let hashpwd;

  //hashing the password to store in database
  try {
    hashpwd = await bcrypt.hash(password, 12);
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ message: "Hashing Error Ocuured ! Please Re-Try" });
  }


  // console.log(email);
  //creating the user
  var _id = null;
  if(user && user._id)
    _id = user._id;
  const userr = await new User(_id, name, email, hashpwd, otp);

  // console.log("ZOR ZOR SE CHILLAKE BATA  " + userr.email);

  try {
    emailGen(userr.email, otp);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Email Error Ocuured !" });
  }

  //saving the user
  try {
    await userr.save();
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "DataBase Error Ocuured !" });
  }

  return res.status(201).json({ message: "Enter OTP in 10 mins !" });
};

module.exports.createUser = async (req, res, next) => {
  const OTP = req.body.OTP;
  const email = req.body.email;

  let user ;

  try {
    user = await User.findByEmail(email);
  } catch (err) {
    console.log(err);
  }

  if(user.OTP == OTP) {
    delete user.OTP;
    const userr = new User(user._id, user.name, user.email, user.passwd, null);
    await userr.save();
    res.status(200).json("User Created Successfully !");
  } else {
    res.status(403).json('Wrong OTP dumbo');
  }
};


module.exports.updateUser = (req, res, next) => {
  const user = new User(req.body.name, req.body.email, req.body);
  user.education = req.body.education;
}