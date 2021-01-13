import chai from 'chai'
import MessageModel from '../../../src/models/MessageModel'
import {postMessage} from '../../../src/controllers/MessageController'
const should = chai.should()
const sinon = require('sinon')

describe('Message Controller', () => {
    const MESSAGE = {
        username: "Username",
        message: "Message"
    }
    context('Post Message', () => {
        before(() => {
            save = sinon.stub(MessageModel.prototype, 'save')
            save.returns(MESSAGE)  
        })

        after(() => {
            save.restore();
        })
        it('should succesfully post a message', async () => {
            let req,res,spy;
            req = res = {};
            req.body = MESSAGE;
            req.app={locals: {
                io : {
                    emit : function(string, body) {
                        body.should.equal(req.body)
                    }
                }
            }}
            spy = res.send = sinon.spy();
            await postMessage(req,res)
            spy.callCount.should.equal(1)
        })
        it('should send a status 500 message on unsuccesful post', async () => {
            let req,res,spy;
            req = res = {};
            req.body = MESSAGE;
            req.app={locals: {
                io : {
                    emit : function(string, body) {
                        body.should.equal(req.body)
                        throw new Error()
                    }
                }
            }}
            spy = sinon.spy();
            res = {
                sendStatus: function(responseStatus) {
                    responseStatus.should.equal(500)
                    // This next line makes it chainable
                    return this; 
                },
                send: spy
            }
        
            await postMessage(req,res)
            spy.callCount.should.equal(1)
        })
    })
})