import chai, {expect} from 'chai'
const should = chai.should()
const sinon = require('sinon')

describe('Wishlist Controller', () => {
    context('Add to Wishlist', () => {
        
        it("should save items to an old wishlist", async () => {

        })
        it("should save items to a new wishlist", async () => {
            
        })
        it("should send a status 500 message when item is already in wishlist", async () => {
            
        })
    })

    context('Remove from Wishlist', () => {

        it('should succesfully remove an item from the wishlist', async () => {

        })
        it('should send a status 500 message when wishlist is not found', async () => {
            
        })
        it('should send a status 500 message when an error gets thrown', async () => {
            
        })
        
    })

    context('Clear Wishlist', () => {

        it('should succesfully clear the wishlist', async () => {

        })
        it('should send a status 500 message when an error gets thrown', async () => {
            
        })
        
    })

    context('Get Wishlist', () => {

        it('should succesfully retrieve the wishlist', async () => {

        })
        it('should send an appropriate message when wishlist is not found', async () => {
            
        })
        it('should send a status 500 message when an error gets thrown', async () => {
            
        })
    })
})