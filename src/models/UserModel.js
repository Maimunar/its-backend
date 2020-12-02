const mongoose = require('mongoose')
const emailValidator = require('email-validator')
const bcrypt = require('bcrypt')

const SALT_ROUNDS = 12

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

// eslint-disable-next-line unexpected-token-function
// UserSchema.pre('save', async function preSave(next) {
//   const user = this;
//   console.log('hashing')
//   if (!user.isModified('password')) return next();
//   try {
//     const hash = await bcrypt.hash(user.password, SALT_ROUNDS);
//     user.password = hash;
//     console.log('hashing done')
//     return next();
//   } catch (err) {
//     return next(err);
//   }
// })

UserSchema.methods.comparePassword = async function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
}

UserSchema.methods.login = async function login(value) {
  console.log("Finding one")
  const user = await UserModel.findOne({ username: value }).exec();
  if (user) return user
  else throw new Error("User Does not Exist");

}

module.exports = mongoose.model('User', UserSchema)


// wishlist: {
//   item: {
//     itemName: {
//       type: String,
//       trim: true,
//       minlength: 3,
//     },
//     linkToReseller: {
//       type: String,
//     },
//     itemPicture: {
//       type: String,
//     },
//   },
// },
