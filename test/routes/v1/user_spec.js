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

const URL= 'http://localhost:8082/v1';

const test_user = {
  "id": 0,
  "code": "new",
  "description": "new",
  "width": 0,
  "length": 0,
  "height": 0,
  "maxWeight": 0
};

describe('API User ',()=>{

  //GET (RETORNA TOTS ELS USERS QUE HI HAN)
  it('RETORNA TOTS ELS USERS QUE HI HAN', (done) => {
    chai.request(URL)
    .get('/user')
    .end(function(err, res) {
      console.log(res.body);
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      done();
    });
  });

  //GET (RETORNA NOMES UN USER)
  it('RETORNA NOMES UN USER', (done) => {
    chai.request(URL)
    .get('/user?id=1')
    .end(function(err, res) {
      //console.log(res.body);
      expect(res).to.have.status(200);

      done();
    });
  });

  //POST
  it('mostra si es crea el user', (done) => {
    chai.request(URL)
    .post('/user')
    .send(test_user)
    .end(function(err, res) {
      expect(res).to.have.status(201);
      done();
    });
  });

  //PUT
  it('mostra si modifica el user', (done) => {
    chai.request(URL)
    .put('/user?id=2')
    .send(test_user)
    .end(function(err, res) {
      expect(res).to.have.status(200);
      done();
    });
  });

  //DELETE
  it('mostra si borra el user', (done) => {
    chai.request(URL)
    .delete('/user?id=2')
    .end(function(err, res) {
      expect(res).to.have.status(200);
      done();
    });
  });

  it('mostra un 400 si no troba el gestor', (done) => {
    chai.request(URL)
    .delete('/user?id=9199')
    .end(function(err, res) {
      expect(res).to.have.status(400);
      expect(res.body).to.deep.equal({message:'gestor bad request'});
      done();
    });
  });

  it('mostra un 404 si no troba el gestor', (done) => {
    chai.request(URL)
    .delete('/user?id=9199')
    .end(function(err, res) {
      expect(res).to.have.status(404);
      expect(res.body).to.deep.equal({message:'gestor not found'});
      done();
    });
  });

  it('mostra un 500 si hi ha un error en el gestor', (done) => {
    chai.request(URL)
    .delete('/user?id=-1')
    .end(function(err, res) {
      expect(res).to.have.status(500);
      expect(res.body).to.deep.equal({message:'gestor Internal Server Error'});
      done();
    });
  });
});