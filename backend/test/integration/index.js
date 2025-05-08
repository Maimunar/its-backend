const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http');
const { response } = require('express');
chai.use(chaiHttp)
 const express = require("express"); // import express
//  const serverRoutes = require("../../src/routes"); //import file we are testing
 const app = express(); //an instance of an express app, a 'fake' express app

// app.use("/app", serverRoutes); //routes

app.get('/api/items', (req,res) => { res.status(200).send({success: true}) })

describe('Integration Testing', () => {
    context('API Testing', () => {
        it('should get items', async () => {
            //api/items/
            chai.request(app).get('/api/items')
            .end((err, response) => {
                expect(response.body.success).to.equal(true);
                expect(response.statusCode).to.equal(200);
            })
        })
    })
})