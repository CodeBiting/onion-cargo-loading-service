/**
 * Created by jordi on 04/03/2023.
 *
 * To run the test:
 * 1. Start the server `npm start`
 * 2. Execute test `mocha test/routes/v1/help_spec.js --timeout 2000`
 */
const chai = require('chai');
const dirtyChai = require('dirty-chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;

chai.use(dirtyChai);
chai.use(chaiHttp);

const URL = 'http://localhost:8080/v1';
// const HELP_BASE_URL = 'http://localhost:8080/v1/help/error';

describe('API Help ', () => {
  it('should return all error helps', (done) => {
    chai.request(URL)
      .get('/help/error')
      .end(function (err, res) {
        // console.log(res.body);
        expect(err).to.equal(null);
        expect(res).to.have.status(200);
        expect(res.body).to.have.status('OK');
        expect(res.body.data).to.be.an('array');
        expect(res.body.errors).to.be.an('array');
        expect(res.body.errors).to.be.an('array').that.eql([]);
        done();
      });
  });

  it('should return one help on error code NOT-FOUND-ERROR-001', (done) => {
    chai.request(URL)
      .get('/help/error/NOT-FOUND-ERROR-001')
      .end(function (err, res) {
        // console.log(res.body);
        expect(err).to.equal(null);
        expect(res).to.have.status(200);
        expect(res.body).to.have.status('OK');
        expect(res.body.data).not.to.be.an('array');
        expect(res.body.data).to.be.eql({
          id: 1,
          code: 'NOT-FOUND-ERROR-001',
          message: '',
          detail: ''
        });
        expect(res.body.errors).to.be.an('array');
        expect(res.body.errors).to.be.an('array').that.eql([]);
        done();
      });
  });

  it('should return 404 if the help code requested does not exist', (done) => {
    chai.request(URL)
      .get('/help/error/9999')
      .end(function (err, res) {
        // console.log(res.body);
        expect(err).to.equal(null);
        expect(res).to.have.status(404);
        expect(res.body).to.have.status('ERROR');
        expect(res.body.data).not.to.be.an('array');
        expect(res.body.requestId).to.be.an('string');
        expect(res.body.errors).to.be.an('array');
        expect(res.body.errors).to.deep.equal([{
        // id: 1,
          code: 'HELP-001',
          message: 'Incorrect code, this code does not exist',
          detail: 'Ensure that the code included in the request are correct',
          help: ''
        }]);
        done();
      });
  });

  it('should return 404 if the help code requested is not found because input CODE is empty', (done) => {
    chai.request(URL)
      .get('/help/error/{}')
      .end(function (err, res) {
        // console.log(res.body);
        expect(err).to.equal(null);
        expect(res).to.have.status(404);
        expect(res.body).to.have.status('ERROR');
        expect(res.body.data).not.to.be.an('array');
        expect(res.body.requestId).to.be.an('string');
        expect(res.body.errors).to.be.an('array');
        expect(res.body.errors).to.deep.equal([{
        // id: 2,
          code: 'HELP-001',
          message: 'Incorrect code, this code does not exist',
          detail: 'Ensure that the code included in the request are correct',
          help: ''
        }]);
        done();
      });
  });
});
