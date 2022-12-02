/**
 * Created by jordi on 02/12/2022.
 * 
 * To run the test:
 * 1. Start the server `npm start`
 * 2. Execute test `mocha test/routes/container_spec.js --timeout 2000`
 */
let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;

chai.use(chaiHttp);

const URL= 'http://localhost:3000';

describe('API Container ',()=>{
  it('should return all containers', (done) => {
    chai.request(URL)
    .get('/container')
    .end(function(err, res) {
      console.log(res.body)
      expect(res).to.have.status(200);
      done();
    });
  });
});
 
 