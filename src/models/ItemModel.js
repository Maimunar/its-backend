const mongoose = require('mongoose')

/*
  Schema that handles the produc items
  Everything except the itemPicture is required
  itemName must be unique (logic for that is in the controller)
*/
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
  sizes: {
    type: Object,
    default: {}
  },
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
