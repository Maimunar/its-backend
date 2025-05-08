const mongoose = require('mongoose')

/*
  Schema for the wishlist
  Every wishlist has an ownerUsername and a list of items
*/
const WishlistSchema = mongoose.Schema({
  ownerUsername: {
    type: String,
    required: true,
    trim: true
  },
  wishlistItems: [
    {
      itemName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
      },
      linkToReseller: {
        type: String,
        required: true,
      },
      itemPicture: {
        type: String,
      },
    },
  ],
}, { timestamps: true });



module.exports = mongoose.model('Wishlist', WishlistSchema)
