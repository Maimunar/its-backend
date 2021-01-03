import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import UserModel from '../models/UserModel'
require('dotenv').config()

/*
  This file handles the user authentication
  It uses jwt to handle json web tokens easily
  Bcrypt is used to hash passwords
*/

/*
  Saves a user to the database:
  1.Hashes his password
  2.Creates and saves his model
  3.Deletes the hashed password from the model
  4.Sends the user model
*/
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

/*
  Allows a user to authenticate
  Compares the passwords with bcrypt and
  Sends an JWT signed header + usertype(user,admin) if succesfull
  Sends a status 400 if user/pass is wrong
  Sends a status 500 if there was another error
*/
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


