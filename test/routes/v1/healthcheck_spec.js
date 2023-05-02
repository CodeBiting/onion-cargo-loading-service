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


const URL = 'http://localhost:8080/v1';


describe('API Healthcheck ', () => {
  it('should return status ok when the container is running', (done) => {
    chai
      .request(URL)
      .get('/healthcheck')
      .end(function (err, res) {
        //console.log(res.body);
        expect(res).to.have.status(200);
        expect(res.body).to.have.status('OK');
        expect(res.body.data).not.to.be.an('array');
        expect(res.body.data).to.be.eql({
          id: 1,
          clientId: 1,
          code: 'C1',
          description: 'Container 1',
          width: 1,
          length: 1,
          height: 1,
          maxWeight: 1,
        });
        expect(res.body.requestId).to.be.an('string');
        expect(res.body.errors).to.be.an('array');
        expect(res.body.errors).to.be.an('array').that.eql([]);
        done();
      });
  });
});