const chai = require("chai")
const should = chai.should()

context("Testing utility", function () {
  it("should allways pass to test CI+Testing Platform", function() {
    const num = 2
    return num.should.equal(2)
  })
})
