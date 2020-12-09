import express from 'express'
import middlewares from '../middleware'
import { addToWishlist, removeFromWishlist, getWishlist, clearWishlist } from '../../controllers/WishlistController'
const router = express.Router()

module.exports = (params) => {

  router.route('/:username')
    .get(getWishlist)
    .post(addToWishlist)
    .delete(removeFromWishlist)

  router.post('/clearWishlist/:username',
    clearWishlist)

  return router;
};
