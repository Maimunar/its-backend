const chai = require('chai')
const UserModel = require('../../../src/models/UserModel') 
const should = chai.should()
const sinon = require('sinon')

describe("User Model", () => {
    const USERNAME = 'TestUsername'
    const EMAIL = "TestMail@gmail.com"
    const PASSWORD = "TestPassword"
    beforeEach(() => {
        save = sinon.stub(UserModel.prototype, 'save')
        save.returns({
            username: USERNAME,
            email: EMAIL.toLowerCase(),
            password: PASSWORD,
            type: 'user'
        })
    })
    afterEach(() => {
        save.restore();
    })
    
    
    it('should succesfully create a user model', () => {
        const user = new UserModel({
            username: USERNAME,
            email: EMAIL,
            password: PASSWORD,
        });
        const savedUser = user.save()
        savedUser.username.should.equal(USERNAME)
        savedUser.password.should.equal(PASSWORD)
        savedUser.email.should.equal(EMAIL.toLowerCase())
        savedUser.type.should.equal('user')
    })        
})