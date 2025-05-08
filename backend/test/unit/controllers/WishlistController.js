import chai, {expect} from 'chai'
const {addToWishlist, removeFromWishlist, clearWishlist, getWishlist} = require('../../../src/controllers/WishlistController')
import WishlistModel from '../../../src/models/WishlistModel'
const should = chai.should()
const sinon = require('sinon')

describe('Wishlist Controller', () => {
    const OWNERUSERNAME = 'TestOwner'
    const WISHLIST = {
        ownerUsername: OWNERUSERNAME,
        wishlistItems: [
            {
                itemName: 'ItemOne',
                linkToReseller: 'www.test.com',
                itemPicture: 'TestPicture.jpg'
            },
            {
                itemName: 'ItemTwo',
                linkToReseller: 'www.test.com',
                itemPicture: 'TestPicture.jpg'
            }
        ]
    }
    context('Add to Wishlist', () => {
        let itemFindOneStub;
        
        before(() => {
            
            save = sinon.stub(WishlistModel.prototype, 'save')
            save.returns(WISHLIST)  
            itemFindOneStub = sinon.stub(WishlistModel, "findOne").callsFake(function(conditions) {
                if (conditions['ownerUsername'] !== OWNERUSERNAME) {
                    return WISHLIST;
                } else return null;
            });
        })

        after(() => {
            save.restore();
            itemFindOneStub.restore();
            
        })

        it("should save items to a wishlist", async () => {
            let req,res;
            req = res = {};
            req = {
                body: {
                    itemName: 'ItemThree',
                    linkToReseller: 'www.test.com',
                    itemPicture: 'TestPicture.jpg'
                },
                params: {
                    username: OWNERUSERNAME
                }
            }
            spy = sinon.spy()
            res = {
                send: spy,
            }
            await addToWishlist(req,res)
            expect(spy.callCount).to.equal(1)
        })

        it("should send a status 500 message when item is already in wishlist", async () => {
            let req,res;
            req = res = {};
            req = {
                body: {
                    itemName: 'ItemOne',
                    linkToReseller: 'www.test.com',
                    itemPicture: 'TestPicture.jpg'
                },
                params: {
                    username: OWNERUSERNAME
                }
            }
            spy = sinon.spy()
            res = {
                status: function(responseStatus) {
                    responseStatus.should.equal(500)
                    // This next line makes it chainable
                    return this; 
                },
                send: spy,
            }
            await addToWishlist(req,res)
            expect(spy.callCount).to.equal(1)
            expect(spy.calledWith('Item already in wishlist'))
        })
    })

    context('Remove from Wishlist', () => {
        let itemFindOneStub;
        before(() => {
            
            save = sinon.stub(WishlistModel.prototype, 'save')
            save.returns(WISHLIST);
            
            itemFindOneStub = sinon.stub(WishlistModel, "findOne").callsFake(function(conditions) {
                if (conditions['ownerUsername'] === OWNERUSERNAME) {
                    return WISHLIST;
                } else if (conditions['ownerUsername'] === 'ThrowError')
                    throw new Error();
                 else return null;
            });
        })

        after(() => {
            save.restore();
            itemFindOneStub.restore();
            
        })

        it('should send a status 500 message when wishlist is not found', async () => {
            let req,res;
            req = res = {};
            req = {
                body: {
                    itemName: 'ItemOne',
                    linkToReseller: 'www.test.com',
                    itemPicture: 'TestPicture.jpg'
                },
                params: {
                    username: 'NotOwner'
                }
            }
            spy = sinon.spy()
            res = {
                status: function(responseStatus) {
                    responseStatus.should.equal(500)
                    // This next line makes it chainable
                    return this; 
                },
                send: spy,
            }
            await removeFromWishlist(req,res)
            expect(spy.callCount).to.equal(1)
        })
        it('should send a status 500 message when an error gets thrown', async () => {
            let req,res;
            req = res = {};
            req = {
                body: {
                    itemName: 'ItemOne',
                    linkToReseller: 'www.test.com',
                    itemPicture: 'TestPicture.jpg'
                },
                params: {
                    username: 'ThrowError'
                }
            }
            spy = sinon.spy()
            res = {
                status: function(responseStatus) {
                    responseStatus.should.equal(500)
                    // This next line makes it chainable
                    return this; 
                },
                send: spy,
            }
            await removeFromWishlist(req,res)
            expect(spy.callCount).to.equal(1)
        })
        
    })

    context('Clear Wishlist', () => {
        let itemDeleteOneStub;
        before(() => {
            itemDeleteOneStub = sinon.stub(WishlistModel, "deleteOne").callsFake(function(conditions) {
                if (conditions['ownerUsername'] !== OWNERUSERNAME) 
                     throw new Error();
            });
        })

        after(() => {
            itemDeleteOneStub.restore();  
        })
        it('should succesfully clear the wishlist', async () => {
            let req,res;
            req = res = {};
            req = {
                params: {
                    username: OWNERUSERNAME
                }
            }
            spy = sinon.spy()
            res = {
                send: spy,
            }
            await clearWishlist(req,res)
            expect(spy.callCount).to.equal(1)
        })
        it('should send a status 500 message when an error gets thrown', async () => {
            let req,res;
            req = res = {};
            req = {
                params: {
                    username: 'NotOwner'
                }
            }
            spy = sinon.spy()
            res = {
                status: function(responseStatus) {
                    responseStatus.should.equal(500)
                    // This next line makes it chainable
                    return this; 
                },
                send: spy,
            }
            await clearWishlist(req,res)
            expect(spy.callCount).to.equal(1)
        })
    })

    context('Get Wishlist', () => {
        let itemFindOneStub;
        before(() => {
            itemFindOneStub = sinon.stub(WishlistModel, "findOne").callsFake(function(conditions) {
                if (conditions['ownerUsername'] === OWNERUSERNAME) {
                    return WISHLIST
                } else if (conditions['ownerUsername' === 'ThrowError']) 
                throw new Error();
                else return null;
            });
        })

        after(() => {
            itemFindOneStub.restore();  
        })

        it('should succesfully retrieve the wishlist', async () => {
            let req,res;
            req = res = {};
            req = {
                params: {
                    username: OWNERUSERNAME
                }
            }
            spy = sinon.spy()
            res = {
                send: spy,
            }
            await getWishlist(req,res)
            expect(spy.callCount).to.equal(1)
      
        })

        it('should send an appropriate message when wishlist is not found', async () => {
            let req,res;
            req = res = {};
            req = {
                params: {
                    username: 'NotOwner'
                }
            }
            spy = sinon.spy()
            res = {

                send: spy,
            }
            await getWishlist(req,res)
            expect(spy.callCount).to.equal(1)
            expect(spy.calledWith('Wishlist Not Found'))
            
        })

        it('should send a status 500 message when an error gets thrown', async () => {
            let req,res;
            req = res = {};
            req = {
                params: {
                    username: 'ThrowError'
                }
            }
            spy = sinon.spy()
            res = {
                status: function(responseStatus) {
                    responseStatus.should.equal(500)
                    // This next line makes it chainable
                    return this; 
                },
                send: spy,
            }
            await getWishlist(req,res)
            expect(spy.callCount).to.equal(1)
            expect(spy.calledWith('An Error Occured while finding the wishlist'))
        })
    })
})