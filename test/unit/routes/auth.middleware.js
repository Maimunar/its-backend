import chai, {expect} from 'chai'
import { adminOnly, loggedIn } from '../../../src/routes/auth.middleware'
const should = chai.should()
const sinon = require('sinon')

describe('Authentication Middleware Controller', () => {
    
    context('Logged In', () => {

        const WORKING_TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmZDUwOTNmZGY1OTM1MDdhMGNmZjY5MyIsInVzZXJfdHlwZV9pZCI6ImFkbWluIiwiaWF0IjoxNjA5ODQ4OTYwfQ.t_SinzatYPRknkMg2OuTNDScS8ODcO0Jh_zHPjkpinM"

        it('should succesfully verify a users token',() => {
            let req,res, next;
            req = res = {};
            next = sinon.spy()
            req = {
                header: function(type) {
                    return WORKING_TOKEN
                }
            }
            spy = sinon.spy()
            res = {
                send: spy,
                status: function(responseStatus) {
                    responseStatus.should.equal(400)
                    return this; 
                }
            }
            loggedIn(req,res, next)

            expect(spy.callCount).to.equal(0)
        })

        it('should send a status 401 message when no token is found',() => {
            let req,res, next;
            req = res = {};
            next = sinon.spy()
            req = {
                header: function(type) {
                    return null
                }
            }
            spy = sinon.spy()
            res = {
                send: spy,
                status: function(responseStatus) {
                    responseStatus.should.equal(401)
                    return this; 
                }
            }
            loggedIn(req,res, next)
            expect(next.callCount).to.equal(0)
            expect(spy.callCount).to.equal(1)
        })

        it('should send a status 400 message when the token is invalid',() => {
            let req,res, next;
            req = res = {};
            next = sinon.spy()
            req = {
                header: function(type) {
                    return 'InvalidToken'
                }
            }
            spy = sinon.spy()
            res = {
                send: spy,
                status: function(responseStatus) {
                    responseStatus.should.equal(400)
                    return this; 
                }
            }
            loggedIn(req,res, next)
            expect(next.callCount).to.equal(0)
            expect(spy.callCount).to.equal(1)
        })
    })

    context('Admin only', () => {
        it('should succesfully verify that a user is an admin', async () => {
            let req,res, next;
            req = res = {};
            next = sinon.spy()
            req = {
                user : {
                    user_type_id: 'admin'
                }
            }
            spy = sinon.spy()
            res = {
                send: spy
            }
            adminOnly(req,res, next)
            expect(next.callCount).to.equal(1)
            expect(spy.callCount).to.equal(0)
        })
        
        it('should send a status 401 message when the user type is an user', async () => {
            let req,res, next;
            req = res = {};
            next = sinon.spy()
            req = {
                user : {
                    user_type_id: 'user'
                }
            }
            spy = sinon.spy()
            res = {
                send: spy,
                status: function(responseStatus) {
                    responseStatus.should.equal(401)
                    return this; 
                }
            }
            adminOnly(req,res, next)
            expect(next.callCount).to.equal(0)
            expect(spy.callCount).to.equal(1)
        })
    })
})