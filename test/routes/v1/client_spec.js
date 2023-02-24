/**
 * Created by jordi on 02/12/2022.
 * 
 * To run the test:
 * 1. Start the server `npm start`
 * 2. Execute test `mocha test/routes/v1/client_spec.js --timeout 2000`
 */

let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;

chai.use(chaiHttp);

const URL= 'http://localhost:8082/v1';

const TEST_CLIENT = {
  "id": 0,
  "code": "usuari",
  "dateStart": new Date(2023, 0, 1),
  "dateFinal": new Date(2023, 0, 2),
  "active": true,
  "token": "hola",
  "notes": "adeu",
};

describe('API Client ',()=>{
  //GET (retorna tots els clients que hi han)
  // it('retorna un 200 a tots els clients', (done) => {
  //   chai.request(URL)
  //   .get('/client')
  //   .end(function(err, res) {
  //     console.log(res.status);
  //     expect(res).to.have.status(200);
  //     expect(res.body).to.be.an('array');
  //     done();
  //   });
  // });

  // it('retorna un 200 returnan un sol usuari', (done) => {
  //   chai.request(URL)
  //   .get('/client?id=1')
  //   .end(function(err, res) {
  //     //console.log(res.body);
  //     expect(res).to.have.status(200);
  //     expect(res.body).to.not.be.an('array');
  //     done();
  //   });
  // });

  //POST
  // it('retorna un 201 si crea un usuari', (done) => {
  //   chai.request(URL)
  //   .post('/client')
  //   .send(TEST_CLIENT)
  //   .end(function(err, res) {
  //     expect(res).to.have.status(201);
  //     done();
  //   });
  // });
/*
  it('mostra un 400 si hi ha una mala resposta en el PUT', (done) => {
    chai.request(URL)
    .put('/client')
    .send(TEST_CLIENT)
    .end(function(err, res) {
      expect(res).to.have.status(400);
      expect(res.body).to.deep.equal({message:'client bad request'});
      done();
    });
  });

  it('mostra un 400 si hi ha una mala resposta en el PUT', (done) => {
    chai.request(URL)
    .put('/client')
    .send(TEST_CLIENT)
    .end(function(err, res) {
      expect(res).to.have.status(400);
      expect(res.body).to.deep.equal({message:'client bad request'});
      done();
    });
  });

  it('mostra 404 si hi ha un error en el client en el PUT', (done) => {
    chai.request(URL)
    .put('/client')
    .send(TEST_CLIENT)
    .end(function(err, res) {
      expect(res).to.have.status(404);
      expect(res.body.message).to.equal({message:'client not found'});
      done();
    });
  });
  
    it('mostra un 500 si hi ha un error en el client en el PUT', (done) => {
    chai.request(URL)
    .put('/client')
    .send(TEST_CLIENT)
    .end(function(err, res) {
      expect(res).to.have.status(500);
      expect(res.body).to.deep.equal({message:'Error en el servidor al modificar el client. client Internal Server Error'});
      done();
    });
  });
  */

  //PUT
  
  it('mostra un 200 si modifica el client en el PUT', (done) => {
    chai.request(URL)
    .put('/client?id=1')
    .send(TEST_CLIENT)
    .end(function(err, res) {
      expect(res).to.have.status(200);
      done();
    });
  });

  /*
  it('mostra un 400 si hi ha una mala resposta en el PUT', (done) => {
    chai.request(URL)
    .put('/client?id=-1')
    .send(TEST_CLIENT)
    .end(function(err, res) {
      expect(res).to.have.status(400);
      expect(res.body).to.deep.equal({message:'client bad request'});
      done();
    });
  });

  it('mostra un 400 si hi ha una mala resposta en el PUT', (done) => {
    chai.request(URL)
    .put('/client?id=hola')
    .send(TEST_CLIENT)
    .end(function(err, res) {
      expect(res).to.have.status(400);
      expect(res.body).to.deep.equal({message:'client bad request'});
      done();
    });
  });

  it('mostra 404 si hi ha un error en el client en el PUT', (done) => {
    chai.request(URL)
    .put('/client?id=500')
    .send(TEST_CLIENT)
    .end(function(err, res) {
      expect(res).to.have.status(404);
      expect(res.body.message).to.equal({message:'client not found'});
      done();
    });
  });
  
    it('mostra un 500 si hi ha un error en el client en el PUT', (done) => {
    chai.request(URL)
    .put('/client?id=0')
    .send(TEST_CLIENT)
    .end(function(err, res) {
      expect(res).to.have.status(500);
      expect(res.body).to.deep.equal({message:'Error en el servidor al modificar el client. client Internal Server Error'});
      done();
    });
  });
  */

  //DELETE
  /*
  it('mostra un 200 si borra el client en el DELETE', (done) => {
    chai.request(URL)
    .delete('/client?id=1')
    .end(function(err, res) {
      expect(res).to.have.status(200);
      done();
    });
  });

  it('mostra si recibe un error 400 en el DELETE', (done) => {
    chai.request(URL)
    .delete('/client?id=hola')
    .end(function(err, res) {
      expect(res).to.have.status(400);
      expect(res.body.message).to.equal('La id tiene que ser un numero');
      done();
    });
  });

  it('mostra si recibe un error 400 en el DELETE', (done) => {
    chai.request(URL)
    .delete('/client?id=-1')
    .end(function(err, res) {
      expect(res).to.have.status(400);
      expect(res.body.message).to.equal('El id debe de ser positivo');
      done();
    });
  });

  it('mostra un 404 si hi ha un error en el client', (done) => {
    chai.request(URL)
    .delete('/client?id=500')
    .end(function(err, res) {
      expect(res).to.have.status(404);
      expect(res.body).to.deep.equal({message:'client not found'});
      done();
    });
  });
  
  
  it('Mostra un 500 si hi ha un error en el servidor al borrar el client en el DELETE', (done) => {
    chai.request(URL)
    .delete('/client?id=0')
    .end(function(err, res) {
      expect(res).to.have.status(500);
      expect(res.body).to.deep.equal({message:'Error en el servidor al borrar el client. client Internal Server Error'});
      done();
    });
  });
  */
});

