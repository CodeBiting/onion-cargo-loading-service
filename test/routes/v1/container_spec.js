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
const HELP_BASE_URL = 'http://localhost:8080/v1/help/error';

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
      console.log(res.body);
      expect(res).to.have.status(200);
      expect(res.body).to.have.status('OK');
      expect(res.body.data).to.be.an('array');
      expect(res.body.errors).to.be.an('array');
      expect(res.body.errors).to.be.an('array').that.eql([]);
      done();
    });
  });

  it('should return one container', (done) => {
    chai.request(URL)
    .get('/container/1')
    .end(function(err, res) {
      //console.log(res.body);
      expect(res).to.have.status(200);
      expect(res.body).to.have.status('OK');
      expect(res.body.data).not.to.be.an('array');
      expect(res.body.data).to.be.eql({
        id: 1,
        code: 'C1',
        description: 'Container 1',
        width: 1,
        length: 1,
        height: 1,
        maxWeight: 1,
      })
      expect(res.body.errors).to.be.an('array');
      expect(res.body.errors).to.be.an('array').that.eql([]);
      done();
    });
  });

  // /v1/containers?clientId=[clientId]
  it('Devera de debolver todos los containers a trabes de un clientId determinado', (done) => {
    chai.request(URL)
    .get('/v1/containers?clientId=1')
    .end(function(err, res) {
      console.log(res.body);
      expect(res).to.have.status(200);
      expect(res.body).to.have.status('OK');
      expect(res.body.data).to.be.an('array');
      expect(res.body.errors).to.be.an('array');
      expect(res.body.errors).to.be.an('array').that.eql([]);
      done();
    });
  });

  it('should return 404 if the container requested does not exist', (done) => {
    chai.request(URL)
    .get('/container/9999')
    .end(function(err, res) {
      //console.log(res.body);
      expect(res).to.have.status(404);
      expect(res.body).to.have.status('ERROR');
      expect(res.body.data).not.to.be.an('array');
      expect(res.body.errors).to.be.an('array');
      expect(res.body.errors).to.deep.equal([{
        code:"CONTAINER-001",
        message:"Incorrect Id, this id does not exist",
        detail:"Ensure that the Id included in the request are correct",
        help: `${HELP_BASE_URL}/CONTAINER-001`
      }]);
      done();
    });
  });

  it('should create a new container', (done) => {
    chai.request(URL)
    .post('/container')
    .send(CONTAINER_NEW)
    .end(function(err, res) {
      expect(res).to.have.status(201);
      expect(res.body).to.have.status('OK');
      expect(res.body.data).not.to.be.an('array');
      expect(res.body.errors).to.be.an('array');
      expect(res.body.errors).to.be.an('array').that.eql([]);
      done();
    });
  });

  it('should update a container', (done) => {
    chai.request(URL)
    .post('/container')
    .send(CONTAINER_NEW)
    .end(function(err, res) {
      expect(res).to.have.status(201);
      expect(res.body).to.have.status('OK');
      expect(res.body.data).not.to.be.an('array');
      expect(res.body.errors).to.be.an('array');
      expect(res.body.errors).to.be.an('array').that.eql([]);
      //console.log(res.body);
      chai.request(URL)
      .put(`/container/${res.body.data.id}`)
      .set('content-type', 'application/json')
      .send({
        code: 'C1',
        description: 'Container 1',
        width: 1,
        length: 1,
        height: 1,
        maxWeight: 1,
      })
      .end(function(err, res) {
        //console.log(res.body);
        expect(res).to.have.status(200);
        expect(res.body).to.have.status('OK');
        expect(res.body.data).not.to.be.an('array');
        expect(res.body.errors).to.be.an('array');
        expect(res.body.errors).to.be.an('array').that.eql([]);
        //console.log(res.body);
        expect(res.body.data).to.be.deep.equal({
          id: res.body.data.id,
          code: 'C1',
          description: 'Container 1',
          width: 1,
          length: 1,
          height: 1,
          maxWeight: 1,
        })
        done();
      });
    });
  });


  it('should return 404 if the container requested for updating does not exist', (done) => {
    chai.request(URL)
    .put('/container/9999')
    .send(CONTAINER_NEW)
    .end(function(err, res) {
      //console.log(res.body);
      expect(res).to.have.status(404);
      expect(res.body).to.have.status('ERROR');
      expect(res.body.data).not.to.be.an('array');
      expect(res.body.errors).to.be.an('array');
      expect(res.body.errors).to.deep.equal([{
        code:"CONTAINER-001",
        message:"Incorrect Id, this id does not exist",
        detail:"Ensure that the Id included in the request is correct",
        help: `${HELP_BASE_URL}/CONTAINER-001`
      }]);
      done();
    });
  });

  it('should return 404 if the URL to update a container is not found because input ID is empty', (done) => {
    chai.request(URL)
    .put('/container/ ')
    .end(function(err, res) {
      expect(res).to.have.status(404);
      expect(res.body).to.have.status('ERROR');
      expect(res.body.data).not.to.be.an('array');
      expect(res.body.errors).to.be.an('array');
      expect(res.body.errors).to.deep.equal([{
        code:"NOT-FOUND-ERROR-001",
        message:"Not found",
        detail:"",
        help: `${HELP_BASE_URL}/NOT-FOUND-ERROR-001`
      }]);
      done();
    });
  });

  it('should delete a container', (done) => {
    chai.request(URL)
    .post('/container')
    .send({
      id: 1,
      code: 'C2DELETE',
      description: 'Container to delete',
      width: 1,
      length: 1,
      height: 1,
      maxWeight: 1,
    })
    .end(function(err, res) {
      //console.log(res.body);
      expect(res).to.have.status(201);
      expect(res.body).to.have.status('OK');
      expect(res.body.data).not.to.be.an('array');
      expect(res.body.data).to.be.eql({
        id: res.body.data.id,
        code: 'C2DELETE',
        description: 'Container to delete',
        width: 1,
        length: 1,
        height: 1,
        maxWeight: 1,
      })
      expect(res.body.errors).to.be.an('array');
      expect(res.body.errors).to.be.an('array').that.eql([]);
      chai.request(URL)
      .delete(`/container/${res.body.data.id}`)
      .end(function(err, res) {
        //console.log(res.status);
        //console.log(res.body);
        expect(res).to.have.status(200);
        expect(res.body).to.have.status('OK');
        expect(res.body.data).not.to.be.an('array');
        expect(res.body.errors).to.be.an('array');
        expect(res.body.errors).to.deep.equal([]);
        done();
      });
    });
  });

  it('should return 404 if the container requested to delete does not exist', (done) =>{
    chai.request(URL)
    .delete('/container/9999')
    .end(function(err, res) {
      //console.log(res.body);
      expect(res).to.have.status(404);
      expect(res.body).to.have.status('ERROR');
      expect(res.body.data).not.to.be.an('array');
      expect(res.body.errors).to.be.an('array');
      expect(res.body.errors).to.deep.equal([{
        code:"CONTAINER-001",
        message:"Incorrect Id, this id does not exist",
        detail:"Ensure that the Id included in the request is correct",
        help: `${HELP_BASE_URL}/CONTAINER-001`
      }]);
      done();
    });
  });

  it('should return 404 if the URL to delete a container is not found because input ID is empty', (done) => {
    chai.request(URL)
    .delete('/container/ ')
    .end(function(err, res) {
      expect(res).to.have.status(404);
      expect(res.body).to.have.status('ERROR');
      expect(res.body.data).not.to.be.an('array');
      expect(res.body.errors).to.be.an('array');
      expect(res.body.errors).to.deep.equal([{
        code:"NOT-FOUND-ERROR-001",
        message:"Not found",
        detail:"",
        help: `${HELP_BASE_URL}/NOT-FOUND-ERROR-001`
      }]);
      done();
      
    });
  });

});

 