import express from 'express'
import middlewares from '../middleware'
import { addToWishlist, removeFromWishlist, getWishlist, clearWishlist } from '../../controllers/WishlistController'
import { loggedIn } from '../auth.middleware'
const router = express.Router()

module.exports = (params) => {

  router.route('/:username')
    .get(loggedIn, getWishlist)
    .post(loggedIn, addToWishlist)

  router.post('/deleteItem/:username',
  loggedIn, removeFromWishlist)

  router.post('/clearWishlist/:username',
    clearWishlist)

  return router;
};
