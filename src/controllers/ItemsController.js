import { type } from 'os'
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
        sizes: req.body.sizes,
        type: req.body.type,
        linkToReseller: req.body.linkToReseller,
      });
      if (req.file && req.file.storedFilename) {
        item.itemPicture = req.file.storedFilename;
      }
      const savedItem = await item.save();

      if (savedItem) return res.redirect('/api');
      return next(new Error('Failed to save item'));

    } catch (error) {
      if (req.file && req.file.storedFilename) {
        await itemPictures.delete(req.file.storedFilename);
      }
      return next(error);
    }
  }

  async deleteItem(req, res, next) {
    try {
      const item = await ItemModel.findOne({ itemName: req.body.itemName })
      itemPictures.delete(item.itemPicture)
      await ItemModel.deleteOne({ itemName: req.body.itemName })
      return res.redirect('/api')
    } catch (err) {
      return next(err)
    }
  }

  async modifyItem(req, res, next) {
    try {
      const item = await ItemModel.findOne({ itemName: req.body.itemName })
      if (req.file && req.file.storedFilename) {
        itemPictures.delete(item.itemPicture);
        item.itemPicture = req.file.storedFilename;
      }
      item.itemName = req.body.itemName
      item.bandName = req.body.bandName
      item.description = req.body.description
      item.price = req.body.price
      item.sizes = req.body.sizes
      item.type = req.body.type
      item.linkToReseller = req.body.linkToReseller
      item.save()
      return res.redirect('/api')
    } catch (error) {
      if (req.file && req.file.storedFilename) {
        await itemPictures.delete(req.file.storedFilename)
      }
      return next(error)
    }

  }

  async viewItemPicture(req, res) {
    res.type('jpg')
    return res.sendFile(itemPictures.filepath(req.params.filename))
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
      let itemSizes = item.sizes[0].split(',')
      let sizeBool = false
      sizes.forEach(size => {
        if (itemSizes.includes(size)) {
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
      res.send(`The band ${band} has ${items.length} Items on this website`)
    } catch (err) {
      return next(err)
    }
  }


}



module.exports = ItemsController;