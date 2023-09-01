/**
 * Created by jordi on 04/03/2023.
 *
 * To run the test:
 * 1. Start the server `npm start`
 * 2. Execute test `mocha test/routes/v1/healthcheck_spec.js --timeout 2000`
 */
const chai = require('chai');
const dirtyChai = require('dirty-chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;

chai.use(dirtyChai);
chai.use(chaiHttp);

const URL = 'http://localhost:8080/v1';
const HELP_BASE_URL = 'http://localhost:8080/v1/help/error';

describe('API Healthcheck ', () => {
  it('should return status ok when the container is running', (done) => {
    chai.request(URL)
      .get('/healthcheck')
      .end(function (err, res) {
        // console.log(res.body);
        expect(err).to.equal(null);
        expect(res).to.have.status(200);
        expect(res.body).to.have.status('OK');
        expect(res.body.data).not.to.be.an('array');
        expect(res.body.data).to.be.eql({});
        expect(res.body.requestId).to.be.an('string');
        expect(res.body.errors).to.be.an('array');
        expect(res.body.errors).to.be.an('array').that.eql([]);
        done();
      });
  });

  it('should return 404 if the helthcheck request does not exist', (done) => {
    chai.request(URL)
      .get('helthcheck/1')
      .end(function (err, res) {
        expect(err).to.equal(null);
        expect(res).to.have.status(404);
        expect(res.body).to.have.status('ERROR');
        expect(res.body.data).not.to.be.an('array');
        expect(res.body.errors).to.be.an('array');
        expect(res.body.requestId).to.be.an('string');
        expect(res.body.errors).to.deep.equal([{
          code: 'NOT-FOUND-ERROR-001',
          message: 'Not found',
          detail: '',
          help: `${HELP_BASE_URL}/NOT-FOUND-ERROR-001`
        }]);
        done();
      });
  });
});
