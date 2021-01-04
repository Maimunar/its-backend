const chai = require('chai')
const should = chai.should()
const sinon = require('sinon')
const ItemController  = require('../../../src/controllers/ItemsController.js')
const itemController = new ItemController()
const proxyquire = require('proxyquire');
const ItemModel = require('../../../src/models/ItemModel')
const { stub } = require('sinon')
const  expect  = chai.expect;

describe('Items Controller', () => {
    const ITEMNAME = "TestItemName"
    const BANDNAME = "TestBandName"
    const DESCRIPTION = "TestDescription"
    const PRICE = 23
    const SIZES = 'XS,L'
    const TYPE = 'shirt'
    const LINKTORESELLER = "www.testlink.com"
    let ITEM = new ItemModel({
        itemName: ITEMNAME,
        bandName: BANDNAME,
        description: DESCRIPTION,
        price: PRICE,
        sizes: SIZES,
        type: TYPE,
        linkToReseller: LINKTORESELLER,
    });

    beforeEach(() => {
        ITEM = new ItemModel({
            itemName: ITEMNAME,
            bandName: BANDNAME,
            description: DESCRIPTION,
            price: PRICE,
            sizes: SIZES,
            type: TYPE,
            linkToReseller: LINKTORESELLER,
        })
    })
    context('Add Item', () => {
        let itemFindOneStub;
        
        before(() => {
            save = sinon.stub(ItemModel.prototype, 'save')
            save.returns(ITEM)  
            let mockFindOne = {
                exec: function () {
                    return Promise.resolve(ITEM);
                }
            };
            
            itemFindOneStub = sinon.stub(ItemModel, "findOne").callsFake(function(conditions) {
                if (conditions['itemName'] !== ITEMNAME) {
                    return mockFindOne;
                } else return null;
            });
        })

        after(() => {
            save.restore();
            itemFindOneStub.restore();
        })

        it('should succesfully add an item without a picture', async () => {
            let req,res,spy;
            req = res = {};
            req.body = ITEM;
            spy = res.send = sinon.spy();
            await itemController.addItem(req,res)
            spy.callCount.should.equal(1)
        })

        it('should throw an error if the item Exists', async () => {
            let req,res,spy;
            req = res = {}
            spy = sinon.spy()
            req.body = ITEM
            res = {
                send: spy,
                status: function(responseStatus) {
                    responseStatus.should.equal(500)
                    // This next line makes it chainable
                    return this; 
                }
            }
            req.body.itemName = "TakenName"
            await itemController.addItem(req,res)
            expect(spy.callCount).to.equal(1)
        })
    })

    context('Delete item', () => {
        let itemFindOneStub;
        let itemDeleteOneStub;
        before(() => {
            itemFindOneStub = sinon.stub(ItemModel, "findOne")
            .callsFake(function(conditions) {
                if (conditions['itemName'] === ITEMNAME) {
                    return ITEM;
                } else return null;
            });
            itemDeleteOneStub = sinon.stub(ItemModel, "deleteOne")
            .callsFake(function(conditions) {
                if (conditions['itemName'] === ITEMNAME) 
                    return true;
                else throw new Error('Error while deleting')
            })
        })
        
        after(() => {
            itemFindOneStub.restore();
            itemDeleteOneStub.restore();
        })

        it('should succesfully delete an item', async () => {
            let req,res,spy;
            req = res = {};
            req.body = ITEM;
            spy = res.send = sinon.spy();
            await itemController.deleteItem(req,res)
            spy.callCount.should.equal(1)
            sinon.assert.calledWith(spy, 'Succesfully deleted');
        })

        it('should send a status 500 message when the delete was unsuccesfull', async () => {
            let req,res,spy;
            req = {}
            spy = sinon.spy()
            req.body = ITEM
            res = {
                send: spy,
                status: function(responseStatus) {
                    responseStatus.should.equal(500)
                    return this; 
                }
            }
            await itemController.deleteItem(req,res)
            expect(spy.callCount).to.equal(1)
        })
    })
    context('Modify Item', () => {
        let itemFindOneStub;
        
        before(() => {
            save = sinon.stub(ItemModel.prototype, 'save')
            save.returns(ITEM)  
            itemFindOneStub = sinon.stub(ItemModel, "findOne").callsFake(function(conditions) {
                if (conditions['itemName'] === ITEMNAME) {
                    return ITEM;
                } else return null;
            });
        })

        after(() => {
            save.restore();
            itemFindOneStub.restore();
        })

        it('should succesfully modify item', async () => {
            let req,res,spy;
            req = res = {};
            req.body = ITEM;
            spy = res.send = sinon.spy();
            await itemController.modifyItem(req,res)
            spy.callCount.should.equal(1)
        })
        
        it('should send a status 500 response when unable to find item', async () => {
            let req,res,spy;
            req = {}
            spy = sinon.spy()
            req.body = ITEM
            req.body.itemName = "TakenName"
            res = {
                send: spy,
                status: function(responseStatus) {
                    responseStatus.should.equal(500)
                    return this; 
                }
            }
            await itemController.modifyItem(req,res)
            expect(spy.callCount).to.equal(1)
        })
    })
    context('View item picture', () => {
        it('should return a default picture', async () => {
            let req,res,spy;
            spy = sinon.spy();
            req = res = {};
            req.params = {'filename' : 'undefined'};
            res = {
                sendFile: spy,
                type: function(type) {
                    type.should.equal('jpg')
                }
            }
            await itemController.viewItemPicture(req,res)
            spy.callCount.should.equal(1)
        })
    })
    context('View item', () => {
        let itemFindOneStub;
        
        before(() => {
            itemFindOneStub = sinon.stub(ItemModel, "findOne").callsFake(function(conditions) {
                if (conditions['itemName'] === ITEMNAME) {
                    return ITEM;
                } else throw new Error();
            });
        })

        after(() => {
            itemFindOneStub.restore();
        })
        it('should return an item as json', async () => {
            let req,res,spy;
            req = res = {};
            req.params = {itemName: ITEMNAME};
            spy = res.json = sinon.spy();
            await itemController.viewItem(req,res)
            spy.callCount.should.equal(1)
        })

        it('should send a status 500 message when item not found', async () => {
            let req,res,spy;
            req = {}
            spy = sinon.spy()
            req.params = {itemName: "WrongName"}
            res = {
                send: spy,
                status: function(responseStatus) {
                    responseStatus.should.equal(500)
                    return this; 
                }
            }
            await itemController.viewItem(req,res)
            expect(spy.callCount).to.equal(1)
        })
    })
    context('View all Items', () => {
        
        let itemFindStub, mainItem, itemBand, itemSizes, itemPrice, itemsList;
        before(() => {
            mainItem = {...ITEM._doc};
            itemBand = {...ITEM._doc, bandName:"OtherBandName"};
            itemSizes = {...ITEM._doc, sizes:"XL"};
            itemPrice = {...ITEM._doc, price:999};

            itemsList = [mainItem, itemBand, itemSizes, itemPrice]
            itemFindStub = sinon.stub(ItemModel, "find").returns(itemsList);
        })

        after(() => {
            itemFindStub.restore();
        })
        
        it('should list all items', async () => {
            let req,res;
            req = res = {};
            req.query = {};
            res = {
                send: function(items) {
                    items.should.equal(itemsList)
                }
            }
            await itemController.viewItems(req,res)
        })

        it('should list items filtered by band', async () => {
            let req,res;
            req = res = {};
            req.query = {band : BANDNAME};
       
            res = {
                send: function(items) {
                    items.length.should.equal(3)
                }
            }
            await itemController.viewItems(req,res)
        })

        it('should list items filtered by price', async () => {
            let req,res;
            req = res = {};
            req.query = {price : 100};
       
            res = {
                send: function(items) {
                    items.length.should.equal(1)
                }
            }
            await itemController.viewItems(req,res)
        })
    })
    
    context('Get number of items for a band', () => {
        let itemFindStub;
        let items = [1,2,3,4,5]
        let oneItem = [1]
        before(() => {

            itemFindStub = sinon.stub(ItemModel, "find").callsFake(function(conditions) {
                if (conditions['bandName'] === BANDNAME) {
                    return items;
                } else if (conditions['bandName'] === 'GetOneItem'){
                    return oneItem;
                } else throw new Error();
            });
        })

        after(() => {
            itemFindStub.restore();
        })

        it('should receive a string of a band with more than 1 item', async () => {
            let req,res;
            req = res = {};
            req.params = {band: BANDNAME}
            res = {
                send: function(message) {
                    message.should.equal(`The band ${BANDNAME} has ${items.length} items on this website`)
                }
            }
          
            await itemController.getNumberOfItemsForABand(req,res,)
        })
        
        it('should receive a string of a band with 1 item', async () => {
            let req,res;
            req = res = {};
            req.params = {band: 'GetOneItem'}
            res = {
                send: function(message) {
                    message.should.equal(`The band GetOneItem has ${oneItem.length} item on this website`)
                }
            }
          
            await itemController.getNumberOfItemsForABand(req,res)
        })

        it('should send a status 500 response when finding fails', async () => {
            let req,res;
            req = res = {};
            req.params = {band: 'WrongName'}
            spy = sinon.spy()
            res = {
                send: spy,
                status: function(responseStatus) {
                    responseStatus.should.equal(500)
                    return this; 
                }
            }
            await itemController.getNumberOfItemsForABand(req,res)
            expect(spy.callCount).to.equal(1)
        })
    })
})