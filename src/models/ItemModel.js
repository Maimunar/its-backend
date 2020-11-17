const mongoose = require('mongoose')

const ItemSchema = mongoose.Schema({
  itemName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
  },
  bandName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
  },
  description: {
    type: String,
    required: true,
    minlength: 3,
  },
  price: {
    type: Number,
    required: true,
  },
  sizes: [String],
  type: {
    type: String,
    required: true,
  },
  linkToReseller: {
    type: String,
    required: true,
  },
  itemPicture: {
    type: String,
  },
}, { timestamps: true });



module.exports = mongoose.model('Item', ItemSchema)
