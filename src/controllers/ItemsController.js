import path from 'path'
import ItemModel from '../models/ItemModel'
import ItemPictureController from './services/ItemPictureController'

const itemPictures = new ItemPictureController(path.join(__dirname, '../../public/itemPictures'),)

async function itemExists(name) {
  const item = await ItemModel.findOne({ itemName: name })
  if (item) return true
  return false
}

class ItemsController {

  async addItem(req, res, next) {
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
      return next(new Error('Failed to save item'));

    } catch (error) {
      console.log(error)
      if (req.file && req.file.storedFilename) {
        await itemPictures.delete(req.file.storedFilename);
      }
      return next(error);
    }
  }

  async deleteItem(req, res, next) {
    try {
      const item = await ItemModel.findOne({ itemName: req.body.itemName })
      if (item.itemPicture) itemPictures.delete(item.itemPicture)
      await ItemModel.deleteOne({ itemName: req.body.itemName })
      return res.send('Succesfully deleted')
    } catch (err) {
      return next(err)
    }
  }

  async modifyItem(req, res, next) {
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
      return next(error)
    }

  }

  async viewItemPicture(req, res) {
    res.type('jpg')
    if (req.params.filename !== 'undefined')
      return res.sendFile(itemPictures.filepath(req.params.filename))
    else return res.sendFile(itemPictures.defaultFilepath())
  }

  async viewItem(req, res, next) {
    try {
      const item = await ItemModel.findOne({ itemName: req.params.itemName })
      return res.json(item)
    } catch (error) {
      return next(error)
    }
  }

  async viewItems(req, res, next) {
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
      return next(error)
    }
  }

  async getNumberOfItemsForABand(req, res, next) {
    const band = req.params.band
    try {
      const items = await ItemModel.find({ bandName: band })
      if (items.length === 0 || items.length === 1)
        res.send(`The band ${band} has ${items.length} item on this website`)
      else
        res.send(`The band ${band} has ${items.length} items on this website`)
    } catch (err) {
      return next(err)
    }
  }


}



module.exports = ItemsController;
