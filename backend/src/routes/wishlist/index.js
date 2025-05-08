import express from 'express'
import { addToWishlist, removeFromWishlist, getWishlist,
   clearWishlist } from '../../controllers/WishlistController'
import { loggedIn } from '../auth.middleware'
const router = express.Router()

module.exports = () => {

  /*
    This route handles the creation and addition to the wishlist
    It takes a parameter of the username of the wishlist owner
    GET request will return the user's wishlist
    POST request will add to the user's wishlist
    * Ex: /api/wishlist/Maimunar
    * This will return Maimunar's wishlist
  */
  router.route('/:username')
    .get(loggedIn, getWishlist)
    .post(loggedIn, addToWishlist)

  /*
    Handles the removal of an item from the wishlist
    It takes a parameter of the username of the wishlist owner
    * Ex: /api/wishlist/deleteItem/Maimunar
    * This will delete an item from Maimunar's wishlist
  */
  router.post('/deleteItem/:username',
  loggedIn, removeFromWishlist)

  /*
    Handles the removal of a wishlist
    It takes a parameter of the username of the wishlist owner
    * Ex: /api/wishlist/clearWishlist/Maimunar
    * This will delete Maimunar's wishlist
  */
  router.post('/clearWishlist/:username',
    clearWishlist)

  return router;
};
