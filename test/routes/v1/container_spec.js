/**
 * Created by jordi on 02/12/2022.
 * 
 * To run the test:
 * 1. Start the server `npm start`
 * 2. Execute test `mocha test/routes/v1/container_spec.js --timeout 2000`
 */
let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;

chai.use(chaiHttp);

const URL= 'http://localhost:8080/v1';

const CONTAINER_NEW = {
  "id": 0,
  "code": "new",
  "description": "new",
  "width": 0,
  "length": 0,
  "height": 0,
  "maxWeight": 0
};

describe('API Container ',()=>{
  it('should return all containers', (done) => {
    chai.request(URL)
    .get('/container')
    .end(function(err, res) {
      //console.log(res.body);
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      done();
    });
  });
  it('should return one container', (done) => {
    chai.request(URL)
    .get('/container?id=1')
    .end(function(err, res) {
      //console.log(res.body);
      expect(res).to.have.status(200);
      expect(res.body).to.not.be.an('array');
      done();
    });
  });
  it('should create a new container', (done) => {
    chai.request(URL)
    .post('/container')
    .send(CONTAINER_NEW)
    .end(function(err, res) {
      expect(res).to.have.status(201);
      done();
    });
  });
  it('should update a container', (done) => {
    chai.request(URL)
    .put('/container?id=1')
    .send(CONTAINER_NEW)
    .end(function(err, res) {
      expect(res).to.have.status(200);
      done();
    });
  });
  it('should delete a container', (done) => {
    chai.request(URL)
    .delete('/container?id=1')
    .end(function(err, res) {
      expect(res).to.have.status(200);
      done();
    });
  });
});
 
 