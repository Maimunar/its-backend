import express from 'express'
import middlewares from '../middleware'
import { loggedIn, adminOnly } from '../auth.middleware'
const router = express.Router()

module.exports = (params) => {
  const { itemPictures, itemsController } = params

  /*
      This route deals with modifying an item
      Post uploads a new photo and then adds an item to the database
      Delete deletes the photo and the item from the database
      Put uploads a new photo (if any) and updates the item's information
      Delete uses upload.none from multer as a parser of the form data
      Delete is on a different route and on a post request because
      A few browsers have issues with the headers regarding delete requests
  */
  router.route('/modifyItem')
    .post(
      middlewares.upload.single('itemPicture'),
      middlewares.handlePicture(itemPictures),
      loggedIn,
      adminOnly,
      itemsController.addItem)
    .put(
      loggedIn,
      adminOnly,
      middlewares.upload.single('itemPicture'),
      middlewares.handlePicture(itemPictures),
      itemsController.modifyItem)

  router.route('/deleteItem')
    .post(
      loggedIn,
      adminOnly,
      middlewares.upload.none(),
      itemsController.deleteItem)

  /*
      Get request for a list of items
      Takes (optional) query parameters:
      band=<bandName> - will only return items for that band
      price=<price> - will only return items ABOVE that price
      sizes=["<size1","<size2>"] - will only return items that have atleast 1 of these sizes
      Example query: localhost:8000/api/items?band=Emmure&sizes=["M","XL"]&price=16.55
  */
  router.get('/', itemsController.viewItems)

  /*
      Gets a specific item's information
      Useful for the single article page
  */
  router.get('/:itemName', itemsController.viewItem)

  /*
      Gets the ammount of items for a specific band and returns them
      In a string format such as:
      "The band Emmure has 4 Items on this website"
  */
  router.get('/perBand/:band', loggedIn,
    adminOnly, itemsController.getNumberOfItemsForABand)

  /*
      Serves the pictures to the client
      Ex: /api/items/itemPicture/0d40fce6-74b4-4ae1-9d4b-1ffe42952ec4.jpg
  */
  router.get('/itemPicture/:filename', itemsController.viewItemPicture)

  return router;
};
