import chai, {expect} from 'chai'
const should = chai.should()
const sinon = require('sinon')

describe('User Controller', () => {

    context('Register', () => {

        it('should send back the saved user without a password on success', async () => {

        })
        it('should send a status 500 message on error while saving the user', async () => {

        })
    })

    context('Login', () => {

        it('should send a response with a header on succesful validation', async () => {

        })
        it('should send a status 400 message on wrong password/username', async () => {

        })
        it('should send a status 500 on an error while retrieving user', async () => {
            
        })
    })

})