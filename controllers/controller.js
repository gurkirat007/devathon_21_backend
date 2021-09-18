const bcrypt = require("bcrypt");
const e = require("express");
const User = require("../models/user");

module.exports.getAllUsers = (req, res, next) => {
  const users = User.find();
  res.status(400).json(users);
};

module.exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(401).json({ message: "Credentials Gone Bad !" });
  }
  try {
    let isMatch;
    await bcrypt.compare(password, user.password, (err, response) => {
       if(response) {
        req.session.isAuth = true;
        res.status(200).json({ message: "Login Successful !" });
       } else {
        res.status(401).json({ message: "Credentials Gone Bad !" });
       }
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports.getUserDashboard = (req, res, next) => {
  const { email } = req.body;
  let user;

  try {
    user = User.findOne({ email });
  } catch (err) {
    console.log(err);
  }

  if (user) {
    return res.status(200).json(user);
  } else {
    return res.status(400).json({message : "User Not FOUND !"});    
  }
};

module.exports.createUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  let user;//undefined

  try {
    user = await User.findOne({ email });
  } catch (err) {
    console.log(err);
  }

  if (user) {
    return res.status(403).json({ message: "User Already Exists" });
  }
  let hashpwd;

  try {
    hashpwd = await bcrypt.hash(password, 12);
  } catch (err) {
    console.log(err);
  }

  user = new User({
    name,
    email,
    password: hashpwd,
  });

  try {
    await user.save();
  } catch (err) {
    console.log(err);
  }

  return res.status(201).json({ message: "User Succesfully Created" });
};
