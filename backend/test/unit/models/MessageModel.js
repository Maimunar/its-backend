const chai = require('chai')
const MessageModel = require('../../../src/models/MessageModel') 
const should = chai.should()
const sinon = require('sinon')

describe("Message Model", () => {
    const USERNAME = 'TestUsername'
    const MESSAGE = "Test Message"
    beforeEach(() => {
        save = sinon.stub(MessageModel.prototype, 'save')
        save.returns({
            username: USERNAME,
            message: MESSAGE
        })
    })
    afterEach(() => {
        save.restore();
    })
    
    
    it('should succesfully create a message model', () => {
        const message = new MessageModel({
            username: USERNAME,
            message: MESSAGE
        });
        const savedMessage = message.save()
        savedMessage.username.should.equal(USERNAME)
        savedMessage.message.should.equal(MESSAGE)
    })        
})