import WishlistModel from '../models/WishlistModel'

/*
  File handles the wishlist functionality
*/

/*
  Auxilary method
  Checks if an item exists in the wishlist
*/
const itemExists = (itemName, wishlist) => {
  const items = wishlist.wishlistItems.filter(item => {
    return item.itemName === itemName
  })
  if (items.length > 0) return true
  else return false
}

/*
  Adds an item to the wishlist:
  1.If there isn't a wishlist for that user, creates one
  2.If item already exists, sends status 500
  3.Modifies and saves the model
*/
exports.addToWishlist = async (req, res, next) => {

  try {
    let wishlist = await WishlistModel.findOne({ ownerUsername: req.params.username }).exec()
    if (wishlist) {
      if (itemExists(req.body.itemName, wishlist)) {
        console.log("Item already in wishlist")
        return res.status(500).send("Item Already in Wishlist")
      }
    } else {
      wishlist = new WishlistModel({
        ownerUsername: req.params.username,
        wishlistItems: [],
      })
    }
    let newItem = {
      itemName: req.body.itemName,
      linkToReseller: req.body.linkToReseller,
      itemPicture: req.body.itemPicture
    }
    wishlist.wishlistItems.push(newItem)
    const savedWishlist = await wishlist.save();
    if (savedWishlist) return res.send("Succesfully saved!")
    return res.status(500).send("Failed to Save Item")

  } catch (error) {
    console.log(error)
    res(500).send(error)
  }

}

/*
  Removes an item from the wishlist:
  1.Looks for the wishlist
  2.Filters the item from the wishlist and saves it 
*/
exports.removeFromWishlist = async (req, res, next) => {

  try {
    let wishlist = await WishlistModel.findOne({ ownerUsername: req.params.username }).exec()
    if (wishlist) {
      wishlist.wishlistItems = wishlist.wishlistItems.filter(item =>
        item.itemName !== req.body.itemName)
      const savedWishlist = await wishlist.save();
      if (savedWishlist) return res.send(savedWishlist)
      return res.status(500).send("Failed to Save Item")
    } else {
      res.status(500).send("Wishlist not found")
    }
  } catch (error) {
    console.log(error)
    res(500).send(error)
  }
}

/*
  Deletes the whole wishlist model of a user
*/
exports.clearWishlist = async (req, res, next) => {
  try {
    await WishlistModel.deleteOne({ ownerUsername: req.params.username }).exec()
    return res.send("Succesfully cleared wishlist!")
  }
  catch (error) {
    console.log(error)
    res(500).send(error)
  }
}

/*
  Sends the wishlist of a specific user
*/
exports.getWishlist = async (req, res, next) => {
  try {
    let wishlist = await WishlistModel.findOne({ ownerUsername: req.params.username }).exec()
    if (wishlist) {
      return res.send(wishlist)
    } else {
      return res.send('Wishlist Not Found')
    }
  } catch (error) {
    console.log(error)
    res.status(500).send("An Error Occured while finding the wishlist")
  }
}

