const chai = require('chai')
const ItemModel = require('../../../src/models/ItemModel') 
const should = chai.should()
const sinon = require('sinon')

describe("Item Model", () => {
    const ITEMNAME = "TestItemName"
    const BANDNAME = "TestBandName"
    const DESCRIPTION = "TestDescription"
    const PRICE = 23
    const SIZES = {"XL" : true, "S" : true}
    const TYPE = 'shirt'
    const LINKTORESELLER = "www.testlink.com"
    const ITEMPICTURE = "TestPicture"
    beforeEach(() => {
        save = sinon.stub(ItemModel.prototype, 'save')
        save.returns({
            itemName: ITEMNAME,
            bandName: BANDNAME,
            description: DESCRIPTION,
            price: PRICE,
            sizes: SIZES,
            type: TYPE,
            linkToReseller: LINKTORESELLER,
            itemPicture: ITEMPICTURE
        })
    })
    afterEach(() => {
        save.restore();
    })
    
    
    it('should succesfully create an item model', () => {
        const item = new ItemModel({
            itemName: ITEMNAME,
            bandName: BANDNAME,
            description: DESCRIPTION,
            price: PRICE,
            sizes: SIZES,
            type: TYPE,
            linkToReseller: LINKTORESELLER,
            itemPicture: ITEMPICTURE
        });
        const savedItem = item.save()
        savedItem.itemName.should.equal(ITEMNAME)
        savedItem.bandName.should.equal(BANDNAME)
        savedItem.description.should.equal(DESCRIPTION)
        savedItem.price.should.equal(PRICE)
        savedItem.sizes.should.equal(SIZES)
        savedItem.type.should.equal(TYPE)
        savedItem.linkToReseller.should.equal(LINKTORESELLER)
        savedItem.itemPicture.should.equal(ITEMPICTURE)
    })        
})