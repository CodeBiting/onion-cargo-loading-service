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

const URL = 'http://localhost:8080/v1';
const HELP_BASE_URL = 'http://localhost:8080/v1/help/error';

const CONTAINER_NEW = {
  "clientId": 1,
  "code": "new",
  "description": "new",
  "width": 0,
  "length": 0,
  "height": 0,
  "maxWeight": 0
};
const CONTAINER_NEW_2 = {
  "clientId": 1,
  "code": "new2",
  "description": "new",
  "width": 0,
  "length": 0,
  "height": 0,
  "maxWeight": 0
};
const PRODUCT_NEW ={ 
  "code":"test1", 
  "x":0.0001, 
  "y":0.0001, 
  "z":0.0001, 
  "volume":0.0005, 
  "allowedRotations": ["x", "y"] 
};
const PRODUCT_NEW_2={ 
  "code":"test2", 
  "x":0.5, 
  "y":0.5, 
  "z":0.5, 
  "volume":100000000,
  "allowedRotations": ["x", "y"] 
};
describe('API Container ', () => {
  
  it('should return all containers', (done) => {
    chai.request(URL)
    .get('/container')
    .end(function(err, res) {
      //console.log(res.body);
      expect(res).to.have.status(200);
      expect(res.body).to.have.status('OK');
      expect(res.body.data).to.be.an('array');
      expect(res.body.requestId).to.be.an('string');
      expect(res.body.errors).to.be.an('array');
      expect(res.body.errors).to.be.an('array').that.eql([]);
      // Testing the pagination with the skip and limit values
      chai.request(URL)
      .get('/container?skip=0&limit=1')
      .end(function(err, res) {
        //console.log(res.body);
        expect(res).to.have.status(200);
        done();
      });
    });
  });

  it('should return one container', (done) => {
    chai.request(URL)
      .post('/container')
      .send(CONTAINER_NEW)
      .end(function (err, res) {
        //console.log(res.body);
        expect(res).to.have.status(201);
        expect(res.body).to.have.status('OK');
        expect(res.body.data).not.to.be.an('array');
        expect(res.body.errors).to.be.an('array');
        expect(res.body.errors).to.be.an('array').that.eql([]);
        chai.request(URL)
          .get(`/container/${res.body.data.id}`)
          .end(function (err, res) {
            //console.log(res.body);
            expect(res).to.have.status(200);
            expect(res.body).to.have.status('OK');
            expect(res.body.data).not.to.be.an('array');
            expect(res.body.data).to.be.eql({
              id: res.body.data.id,
              clientId: 1,
              code: "new",
              description: "new",
              width: 0,
              length: 0,
              height: 0,
              maxWeight: 0,
              deleted_at: null
            })
            expect(res.body.errors).to.be.an('array');
            expect(res.body.errors).to.be.an('array').that.eql([]);
            chai.request(URL)
              .delete(`/container/${res.body.data.id}`)
              .end(function (err, res) {
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
  });

  // /v1/containers?clientId=[clientId]
  it('should return only the containers corresponding to the clientId', (done) => {
    const clientId = 1; // Cambiar el valor según corresponda
    chai.request(URL)
      .get(`/container?clientId=${clientId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equal('OK');
        expect(res.body.data).to.be.an('array');
        expect(res.body.requestId).to.be.an('string');
        expect(res.body.errors).to.be.an('array').that.is.empty;
  
        // Verificar que todos los contenedores corresponden al clientId esperado
        const containers = res.body.data;
        expect(containers.every(c => c.clientId === clientId)).to.be.true;
        
        done();
      });
  });

  it('should return the smallest container to save one product', (done) =>{
    const clientId = 1;
    chai
      .request(URL)
      .post(`/container/smallest/${clientId}`)
      .send([PRODUCT_NEW])
      .end(function (err, res){
        //console.log(res.body);
        expect(res).to.have.status(200);
        expect(res.body).to.have.status('OK');
        expect(res.body.data).to.be.an('array');
        expect(res.body.data).to.have.length(1);
        done();
      });
  });
  
  it('should return error because there is no container enoght big to save the product', (done) =>{
    const clientId = 1;
    chai
      .request(URL)
      .post(`/container/smallest/${clientId}`)
      .send([PRODUCT_NEW_2])
      .end(function (err, res){
        expect(res).to.have.status(404);
        expect(res.body).to.have.status('ERROR');
        expect(res.body.errors).to.have.length(1);
        expect(res.body.errors).to.deep.equal([
          {
            "code": "CONTAINER-001",
            "message": "Smallest Container Not Found",
            "detail": "The total products volume is greater than all boxes",
            "help": "http://localhost:8080/v1/help/error/CONTAINER-001"
          }
        ]);
        done();
      });
  });

  it('should return error because there is no container enoght big to save the product', (done) =>{
    const clientId = 1;
    chai
      .request(URL)
      .post(`/container/smallest/${clientId}`)
      .send()
      .end(function (err, res){
        expect(res).to.have.status(404);
        expect(res.body).to.have.status('ERROR');
        expect(res.body.errors).to.deep.equal([{
            "code": "CONTAINER-001",
            "message": "Smallest Container Not Found",
            "detail": "Not found any product combination that can be fit into the boxes",
            "help": "http://localhost:8080/v1/help/error/CONTAINER-001"
        }]);
        done();
      });
  });

  it('should return one container using the skip and limit and then return two containers using skip and limit with other parameters', (done) => {
    chai
      .request(URL)
      .post('/container')
      .send(CONTAINER_NEW)
      .end(function (err, res) {
        let firstContainerId = res.body.data.id;
        expect(res).to.have.status(201);
        expect(res.body).to.have.status('OK');
        chai
          .request(URL)
          .post('/container')
          .send(CONTAINER_NEW_2)
          .end(function (err, res) {
            let secondContainerId = res.body.data.id;
            expect(res).to.have.status(201);
            expect(res.body).to.have.status('OK');
            chai
              .request(URL)
              .get('/container?skip=0&limit=1')
              .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.body).to.have.status('OK');
                expect(res.body.data).to.be.an('array');
                expect(res.body.data).to.have.length(1);
                chai
                  .request(URL)
                  .get('/container?skip=0&limit=2')
                  .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.status('OK');
                    expect(res.body.data).to.be.an('array');
                    expect(res.body.data).to.have.length(2);
                    chai
                      .request(URL)
                      .delete(`/container/${firstContainerId}`)
                      .end(function (err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.status('OK');
                        expect(res.body.data).not.to.be.an('array');
                        expect(res.body.errors).to.be.an('array');
                        expect(res.body.errors).to.deep.equal([]);
                        chai
                          .request(URL)
                          .delete(`/container/${secondContainerId}`)
                          .end(function (err, res) {
                            expect(res).to.have.status(200);
                            expect(res.body).to.have.status('OK');
                            expect(res.body.data).not.to.be.an('array');
                            expect(res.body.errors).to.be.an('array');
                            expect(res.body.errors).to.deep.equal([]);
                            done();
                          });
                      });
                  });
              });
          });
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
      expect(res.body.requestId).to.be.an('string');
      expect(res.body.errors).to.be.an('array');
      expect(res.body.errors).to.deep.equal([{
        code:'CONTAINER-001',
        message:'Incorrect Id, this id does not exist',
        detail:'Ensure that the Id included in the request are correct',
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
      //console.log(res.body);
      expect(res).to.have.status(201);
      expect(res.body).to.have.status('OK');
      expect(res.body.data).not.to.be.an('array');
      expect(res.body.requestId).to.be.an('string');
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

  it('should update a container', (done) => {
    chai.request(URL)
    .post('/container')
    .send(CONTAINER_NEW)
    .end(function(err, res) {
      expect(res).to.have.status(201);
      expect(res.body).to.have.status('OK');
      expect(res.body.data).not.to.be.an('array');
      expect(res.body.requestId).to.be.an('string');
      expect(res.body.errors).to.be.an('array');
      expect(res.body.errors).to.be.an('array').that.eql([]);
      //console.log(res.body);
      chai.request(URL)
      .put(`/container/${res.body.data.id}`)
      .set('content-type', 'application/json')
      .send({
        clientId: 1,
        code: 'Container PUT',
        description: 'Test of funcionality PUT container',
        width: 2,
        length: 2,
        height: 2,
        maxWeight: 2,
      })
      .end(function(err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.have.status('OK');
        expect(res.body.data).not.to.be.an('array');
        expect(res.body.requestId).to.be.an('string');
        expect(res.body.errors).to.be.an('array');
        expect(res.body.errors).to.be.an('array').that.eql([]);
        //console.log(res.body);
        expect(res.body.data).to.be.deep.equal({
          id: res.body.data.id,
          clientId: 1,
          code: 'Container PUT',
          description: 'Test of funcionality PUT container',
          width: 2,
          length: 2,
          height: 2,
          maxWeight: 2,
          deleted_at: null
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
      expect(res.body.requestId).to.be.an('string');
      expect(res.body.errors).to.be.an('array');
      expect(res.body.errors).to.deep.equal([{
        code:'CONTAINER-001',
        message:'Incorrect Id, this id does not exist',
        detail:'Ensure that the Id included in the request is correct',
        help: `${HELP_BASE_URL}/CONTAINER-001`
      }]);
      done();
    });
  });

  it('should return 404 if the URL to update a container is not found because input ID is empty', (done) => {
    chai.request(URL)
    .put('/container/ ')
    .end(function(err, res) {
      //console.log(res.body);
      expect(res).to.have.status(404);
      expect(res.body).to.have.status('ERROR');
      expect(res.body.data).not.to.be.an('array');
      expect(res.body.requestId).to.be.an('string');
      expect(res.body.errors).to.be.an('array');
      expect(res.body.errors).to.deep.equal([{
        code:'NOT-FOUND-ERROR-001',
        message:'Not found',
        detail:'',
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
      clientId: 1,
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
        clientId: 1,
        code: 'C2DELETE',
        description: 'Container to delete',
        width: 1,
        length: 1,
        height: 1,
        maxWeight: 1,
        deleted_at: null
      })
      expect(res.body.requestId).to.be.an('string');
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
      expect(res.body.requestId).to.be.an('string');
      expect(res.body.errors).to.be.an('array');
      expect(res.body.errors).to.deep.equal([{
        code:'CONTAINER-001',
        message:'Incorrect Id, this id does not exist',
        detail:'Ensure that the Id included in the request is correct',
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
      expect(res.body.requestId).to.be.an('string');
      expect(res.body.errors).to.be.an('array');
      expect(res.body.errors).to.deep.equal([{
        code:'NOT-FOUND-ERROR-001',
        message:'Not found',
        detail:'',
        help: `${HELP_BASE_URL}/NOT-FOUND-ERROR-001`
      }]);
      done();
      
    });
  });
  
  it('should return add a delete date and then delete ', (done) => {
    chai.request(URL)
    .post('/container')
    .send({
      id: 1,
      clientId: 1,
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
        clientId: 1,
        code: 'C2DELETE',
        description: 'Container to delete',
        width: 1,
        length: 1,
        height: 1,
        maxWeight: 1,
        deleted_at: null
      })
      expect(res.body.requestId).to.be.an('string');
      expect(res.body.errors).to.be.an('array');
      expect(res.body.errors).to.be.an('array').that.eql([]);
      chai.request(URL)
      .put(`/container/${res.body.data.id}/delete`)
      .end(function(err, res) {
        //console.log(res.status);
        //console.log(res.body);
        expect(res).to.have.status(200);
        expect(res.body).to.have.status('OK');
        expect(res.body.data).not.to.be.an('array');
        expect(res.body.errors).to.be.an('array');
        expect(res.body.errors).to.deep.equal([]);
        chai.request(URL)
        .delete(`/container/${res.body.data.id}`)
        .end(function(err, res) {
        //console.log(res.status);
        //console.log(res.body);
          expect(res).to.have.status(200);
          expect(res.body).to.have.status('OK');
          expect(res.body.data).not.to.be.an('array');
          expect(res.body.requestId).to.be.an('string');
          expect(res.body.data.deleted_at).to.be.an("string");
          expect(res.body.errors).to.be.an('array');
          expect(res.body.errors).to.deep.equal([]);
          done();
        });
      });
    });
  });
});
