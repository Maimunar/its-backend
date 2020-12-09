const mongoose = require('mongoose')

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
