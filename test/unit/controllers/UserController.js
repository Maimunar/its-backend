import chai, {expect} from 'chai'
import UserModel from '../../../src/models/UserModel'
const {register, login} = require('../../../src/controllers/UserController')
const should = chai.should()
const sinon = require('sinon')

describe('User Controller', () => {

    const USERNAME = 'TestUsername'
    const EMAIL = 'TestEmail@gmail.com'
    const PASSWORD = 'TestPassword'


    context('Register', () => {
        before(() => {
            save = sinon.stub(UserModel.prototype, 'save')
            save.returns({
                username: USERNAME,
                email: EMAIL,
                password: PASSWORD
            })  
        })

        after(() => {
            save.restore();
        })
        it('should send back the saved user without a password on success', async () => {
            let req,res;
            req = res = {};
            req.body = {
                username: USERNAME,
                email: EMAIL,
                password: PASSWORD
            }
            res = {
                send: function(user) {
                    expect(user.username).to.equal(USERNAME)
                    expect(user.email).to.equal(EMAIL)
                }
            }
            await register(req,res)
        })
        it('should send a status 500 message on error while saving the user', async () => {
            let req,res;
            req = res = {};
            req.body = {
                username: USERNAME,
                email: EMAIL,
                password: PASSWORD
            }
            res = {
                status: function(responseStatus) {

                    responseStatus.should.equal(500)
                    // This next line makes it chainable
                    return this; 
                },
                send: function(user) {
                    if (user.username === USERNAME) 
                        throw new Error()
                }
            }
            await register(req,res)
        })
    })

    context('Login', () => {
        let userFindOneStub;
        before(() => {
            userFindOneStub = sinon.stub(UserModel, "findOne")
            .callsFake(function(conditions) {
                if (conditions['username'] === USERNAME) {
                    return {
                        username: USERNAME,
                        password: PASSWORD,
                        email: EMAIL
                    };
                } else throw new Error();
            });

        })
        
        after(() => {
            userFindOneStub.restore();
        })

        it('should send a status 400 message on wrong password/username', async () => {
            let req,res;
            req = res = {};
            req.body = {
                username: USERNAME,
                email: EMAIL,
                password: PASSWORD
            }
            res = {
                status: function(responseStatus) {

                    responseStatus.should.equal(400)
                    // This next line makes it chainable
                    return this; 
                },
                send: function(message) {
                    message.should.equal("Username or Password is wrong")
                }
            }
            await login(req,res)
        })
        it('should send a status 500 on an error while retrieving user', async () => {
            let req,res;
            req = res = {};
            req.body = {
                username: 'OtherUsername',
                email: EMAIL,
                password: PASSWORD
            }
            res = {
                status: function(responseStatus) {

                    responseStatus.should.equal(500)
                    // This next line makes it chainable
                    return this; 
                },
                send: function(message) {
                    message.should.equal("Error retrieving User")
                }
            }
            await login(req,res)
        })
    })

})