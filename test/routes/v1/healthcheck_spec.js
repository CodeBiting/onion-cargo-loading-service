/**
 * Created by jordi on 04/03/2023.
 * 
 * To run the test:
 * 1. Start the server `npm start`
 * 2. Execute test `mocha test/routes/v1/healthcheck_spec.js --timeout 2000`
 */
let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;

chai.use(chaiHttp);

const URL= 'http://localhost:8080/v1';

describe('API Healthcheck ',()=>{
  it('should return status ok', (done) => {
    chai.request(URL)
    .get('/healthcheck')
    .end(function(err, res) {
      //console.log(res.body);
      expect(res).to.have.status(200);
      expect(res.body).to.have.status('OK');
      expect(res.body.data).to.be.an('array').that.eql([{ result: 'ok' }]);
      expect(res.body.errors).to.be.an('array').that.eql([]);
      done();
    });
  });
});

 