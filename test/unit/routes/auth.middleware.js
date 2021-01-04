import chai, {expect} from 'chai'
const should = chai.should()
const sinon = require('sinon')

describe('Authentication Middleware Controller', () => {
    
    context('Logged In', () => {

        it('should succesfully verify a users token', async () => {

        })
        it('should send a status 401 message when no token is found', async () => {
            
        })
        it('should send a status 400 message when the token is invalid', async () => {
            
        })
    })

    context('Admin only', () => {
        
        it('should succesfully verify that a user is an admin', async () => {

        })
        it('should send a status 401 message when the user type is an user', async () => {
            
        })
    })
})