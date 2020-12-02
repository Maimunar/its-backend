import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import UserModel from '../models/UserModel'
require('dotenv').config()

exports.register = async (req, res) => {

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  const user = new UserModel({
    username: req.body.username,
    email: req.body.email,
    password: hashPassword,
  });
  try {
    const savedUser = await user.save()
    delete savedUser.password
    res.send(savedUser)
  }
  catch (err) {
    res.status(500).send(err)
  }
};

exports.login = async (req, res) => {

  try {
    const user = await UserModel.findOne({ username: req.body.username })
    if (user) {
      const validPass = await bcrypt.compare(req.body.password, user.password)
      if (!validPass) return res.status(400).send("Username or Password is wrong")
      const token = jwt.sign({ id: user._id, user_type_id: user.type }, process.env.TOKEN_SECRET)
      res.header("auth-token", token).send({ "token": token, "userType": user.type })
    }
  }
  catch (err) {
    res.status(500).send("Error retrieving User")
  }
}

exports.authuseronly = (req, res) => {
  res.send("Hey,You are authenticated user. So you are authorized to access here.");
};

exports.adminonly = (req, res) => {
  res.send("Success. Hello Admin, this route is only for you");
};

