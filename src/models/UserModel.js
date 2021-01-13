const mongoose = require('mongoose')
const emailValidator = require('email-validator')
const bcrypt = require('bcrypt')

/*
  Schema for the user handling
  All fields are required, except type (which defaults to 'user')
  email-validator is used for the email field, some custom validation is used for
  the other fields.
  Also uses bcrypt for password comparison and login model functionality
*/
const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    index: { unique: true },
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    index: { unique: true },
    validate: {
      validator: emailValidator.validate,
      message: props => `${props.value} is not a valid email address!`,
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    index: { unique: true },
    minlength: 6,
  },
  type: {
    type: String,
    default: 'user',
    trim: true,
  },
}, { timestamps: true });

UserSchema.methods.comparePassword = async function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
}

UserSchema.methods.login = async function login(value) {
  const user = await UserModel.findOne({ username: value }).exec();
  if (user) return user
  else throw new Error("User Does not Exist");

}

module.exports = mongoose.model('User', UserSchema)
