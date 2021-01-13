const chai = require('chai')
const WishlistModel = require('../../../src/models/WishlistModel') 
const should = chai.should()
const sinon = require('sinon')

describe("Wishlist Model", () => {
    const USERNAME = 'TestUsername'
    const ITEMS = [
        {
            itemName: "TestItem",
            linkToReseller: "www.testlink.com",
            itemPicture: "TestPicture"
        }
    ]
    beforeEach(() => {
        save = sinon.stub(WishlistModel.prototype, 'save')
        save.returns({
            username: USERNAME,
            items: ITEMS
        })
    })
    afterEach(() => {
        save.restore();
    })
    
    
    it('should succesfully create a wishlist model', () => {
        const wishlist = new WishlistModel({
            username: USERNAME,
            items: ITEMS
        });
        const savedWishlist = wishlist.save()
        savedWishlist.username.should.equal(USERNAME)
        savedWishlist.items.should.equal(ITEMS)
    })        
})