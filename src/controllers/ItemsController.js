const path = require('path')
const ItemModel = require('../models/ItemModel')
const ItemPictureController = require('./services/ItemPictureController') 

const itemPictures = new ItemPictureController(path.join(__dirname, '../../public/itemPictures'),)

async function itemExists(name) {
  const item = await ItemModel.findOne({ itemName: name })
  if (item) return true
  return false
}
/*
  A class that handles the items route
  It makes use of no external libraries other than the ones needed
  In the service responsible for pictures (ItemPictureController)
*/
class ItemsController {
  
  /*
    Adds an item to the database:
    1. Checks if an item with the same name already exists
    2. Creates and saves the model with the already saved picture's name
    If an error is found, deletes the picture to reduce clutter
  */
  async addItem(req, res) {
    try {

      if (await itemExists(req.body.itemName)) {
        throw new Error('Item with that name exists already')
      }
      
      const item = new ItemModel({
        itemName: req.body.itemName,
        bandName: req.body.bandName,
        description: req.body.description,
        price: req.body.price,
        sizes: req.body.sizes.split(','),
        type: req.body.type,
        linkToReseller: req.body.linkToReseller,
      });
      if (req.file && req.file.storedFilename) {
        item.itemPicture = req.file.storedFilename;
      }

      const savedItem = await item.save();
      if (savedItem) return res.send(savedItem);
      res.status(500).send("Failed to save item")

    } catch (error) {
      if (req.file && req.file.storedFilename) {
        await itemPictures.delete(req.file.storedFilename);
      }  
      res.status(500).send(error);
    }
  }

  /*
    Handles the deletion of an item from the database and it's
    picture from the server picture folder
  */
  async deleteItem(req, res) {
    try {
      const item = await ItemModel.findOne({ itemName: req.body.itemName })
      if (item.itemPicture) itemPictures.delete(item.itemPicture)
      await ItemModel.deleteOne({ itemName: req.body.itemName })
      return res.send('Succesfully deleted')
    } catch (err) {
      res.status(500).send(err)
    }
  }
  
  /*
    Modifies an item in the database:
    1. Checks if an item with the same name exists
    2. If another picture is added, deletes the old one
    3. Modifies the data and saves the model with the saved picture's name
    If an error is found, deletes the picture to reduce clutter
  */
  async modifyItem(req, res) {
    try {
      const item = await ItemModel.findOne({ itemName: req.body.itemName })
      if (req.file && req.file.storedFilename) {
        if (item.itemPicture) itemPictures.delete(item.itemPicture);
        item.itemPicture = req.file.storedFilename;
      }
      item.itemName = req.body.itemName
      item.bandName = req.body.bandName
      item.description = req.body.description
      item.price = req.body.price
      item.sizes = req.body.sizes.split(',')
      item.type = req.body.type
      item.linkToReseller = req.body.linkToReseller
      item.save()
      return res.send(item)
    } catch (error) {
      if (req.file && req.file.storedFilename) {
        await itemPictures.delete(req.file.storedFilename)
      }
      res.status(500).send(error)
    }

  }
  
  /*
    Return a required picture by its filename
  */
  async viewItemPicture(req, res) {
    res.type('jpg')
    if (req.params.filename !== 'undefined')
      return res.sendFile(itemPictures.filepath(req.params.filename))
    else return res.sendFile(itemPictures.defaultFilepath())
  }

  /*
    Returns a single item as JSON
  */
  async viewItem(req, res) {
    try {
      const item = await ItemModel.findOne({ itemName: req.params.itemName })
      return res.json(item)
    } catch (error) {
      res.status(500).send(error)
    }
  }

  /*
    Returns a list of all items filtered (if needed) by:
    * Band name
    * Size(s)
    * Price threshold (Shows only items above the threshold)
    These can be combined
  */
  async viewItems(req, res) {
    const band = req.query.band
    const sizes = req.query.sizes == undefined ? undefined : JSON.parse(req.query.sizes)
    const price = req.query.price

    function hasARightSize(item) {
      let sizeBool = false
      sizes.forEach(size => {
        if (item.sizes.includes(size)) {
          sizeBool = true
        }
      })
      return sizeBool
    }
    try {
      let items = await ItemModel.find({})
      if (band) items = items.filter(item => item.bandName == band)
      if (sizes) {
        items = items.filter(hasARightSize)
      }
      if (price) items = items.filter(item => item.price > price)
      res.send(items)
    } catch (error) {
      res.status(500).send(error)
    }
  }

  /*
    Returns the number of items available for a specific band
  */
  async getNumberOfItemsForABand(req, res) {
    const band = req.params.band
    try {
      const items = await ItemModel.find({ bandName: band })
      if (items.length === 0 || items.length === 1)
        res.send(`The band ${band} has ${items.length} item on this website`)
      else
        res.send(`The band ${band} has ${items.length} items on this website`)
    } catch (err) {
      res.status(500).send(err)
    }
  }


}



module.exports = ItemsController;
