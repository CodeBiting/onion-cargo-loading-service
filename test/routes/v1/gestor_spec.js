/**
 * Created by jordi on 02/12/2022.
 * 
 * To run the test:
 * 1. Start the server `npm start`
 * 2. Execute test `mocha test/routes/v1/gestor_spec.js --timeout 2000`
 */

let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;

chai.use(chaiHttp);

const URL= 'http://localhost:8082/v1';

const TEST_GESTOR = {
  "id": 0,
  "nom": "new",
  "token": 0,
};

describe('API Gestor ',()=>{

  //GET (RETORNA TOTS ELS USERS QUE HI HAN)
  // it('RETORNA UN 200 A TOTS ELS GESTORS QUE HI HAN EN EL GET', (done) => {
  //   chai.request(URL)
  //   .get('/gestor')
  //   .end(function(err, res) {
  //     console.log(res.status);
  //     expect(res).to.have.status(200);
  //     expect(res.body).to.be.an('array');
  //     done();
  //   });
  // });

  // it('RETORNA TOTS ELS GESTORS QUE HI HAN EN EL GET', (done) => {
  //   chai.request(URL)
  //   .get('/gestor')
  //   .end(function(err, res) {
  //     if(err){
  //       expect(err).to.have.status(500);
  //       expect(res.body).to.deep.equal({message:'Error en el servidor al borrar el gestor. Gestor Internal Server Error'});
  //     }
  //     else if (err) {
  //       expect(err).to.have.status(404);
  //       expect(res.body).to.deep.equal({message:'gestor not found'});
  //     }
  //     else if (err) {
  //       expect(err).to.have.status(400);
  //       expect(res.body).to.deep.equal({message:'gestor bad request'});
  //     }
  //     else{
  //       //console.log(res.body);
  //       expect(res).to.have.status(200);
  //       expect(res.body).to.be.an('array');
  //     }
  //     done();
  //   });
  // });

  // it('mostra un 404 si l\'objecte demanat no existeix en el GET', (done) => {
  //   chai.request(URL)
  //   .get('/gestor?id=99999999')
  //   .end(function(err,res){
  //   //console.log(res.body)
  //     expect(res).to.have.status(404);
  //     expect(res.body).to.deep.equal({message:'gestor not found'});
  //   done();
  //   });
  // });
  /*
  it('mostra un 400 si hi ha una mala resposta en el GET', (done) => {
    chai.request(URL)
    .post('/gestor')
    .end( function(err,res){
    //console.log(res.body)
      expect(res).to.have.status(400);
      expect(res.body).to.deep.equal({message:'gestor bad request'});
    done();
    });
  });

  it('mostra un 500 si hi ha una mala resposta en el GET', (done) => {
    chai.request(URL)
    .post('/gestor')
    .end( function(err,res){
    //console.log(res.body)
      expect(res).to.have.status(500);
      expect(res.body).to.deep.equal({message:'Error en el servidor al borrar el gestor. Gestor Internal Server Error'});
    done();
    });
  });
  */

  //GET (RETORNA NOMES UN USER)
  // it('RETORNA UN 200 NOMES UN GESTOR', (done) => {
  //   chai.request(URL)
  //   .get('/gestor?id=1')
  //   .end(function(err, res) {
  //     console.log(res.status);
  //     expect(res).to.have.status(200);
  //     done();
  //   });
  // });

  // it('mostra un 404 si hi ha una mala resposta en el GET', (done) => {
  //   chai.request(URL)
  //   .post('/gestor?id=-1')
  //   .end( function(err,res){
  //   //console.log(res.body)
  //     expect(res).to.have.status(404);
  //     expect(res.body).to.deep.equal({message:'gestor not found'});
  //   done();
  //   });
  // });

  // it('mostra un 400 si hi ha una mala resposta en el GET', (done) => {
  //   chai.request(URL)
  //   .post('/gestor?id=0')
  //   .end( function(err,res){
  //   //console.log(res.body)
  //     expect(res).to.have.status(400);
  //     expect(res.body).to.deep.equal({message:'gestor bad request'});
  //   done();
  //   });
  // });

  it('mostra un 500 si hi ha una mala resposta en el GET', (done) => {
    chai.request(URL)
    .post('/gestor?id=9199')
    .end( function(err,res){
    //console.log(res.body)
      expect(res).to.have.status(500);
      expect(res.body).to.deep.equal({message:'Error en el servidor al borrar el gestor. Gestor Internal Server Error'});
    done();
    });
  });

  //POST
  it('mostra un 201 si es crea el gestor', (done) => {
    chai.request(URL)
    .post('/gestor')
    .send(TEST_GESTOR)
    .end(function(err, res) {
      expect(res).to.have.status(201);
      done();
    });
  });

  it('mostra un 400 si hi ha una mala resposta en el POST', (done) => {
    chai.request(URL)
    .post('/gestor')
    .send(TEST_GESTOR)
    .end( function(err,res){
    //console.log(res.body)
      expect(res).to.have.status(400);
      expect(res.body).to.deep.equal({message:'gestor bad request'});
    done();
    });
  });

  it('mostra un 404 si hi ha una mala resposta en el POST', (done) => {
    chai.request(URL)
    .post('/gestor')
    .send(TEST_GESTOR)
    .end( function(err,res){
    //console.log(res.body)
      expect(res).to.have.status(404);
      expect(res.body).to.deep.equal({message:'gestor not found'});
    done();
    });
  });

  // it('mostra un 500 si hi ha una mala resposta en el POST', (done) => {
  //   chai.request(URL)
  //   .post('/gestor')
  //   .send(TEST_GESTOR)
  //   .end( function(err,res){
  //   //console.log(res.body)
  //     expect(res).to.have.status(500);
  //     expect(res.body).to.deep.equal({message:'Error en el servidor al borrar el gestor. Gestor Internal Server Error'});
  //   done();
  //   });
  // });

  //PUT
  /*
  it('mostra un 200 si modifica el gestor en el PUT', (done) => {
    chai.request(URL)
    .put('/gestor?id=1')
    .send(TEST_GESTOR)
    .end(function(err, res) {
      expect(res).to.have.status(200);
      done();
    });
  });

  it('mostra un 400 si hi ha una mala resposta en el PUT', (done) => {
    chai.request(URL)
    .put('/gestor?id=-1')
    .send(TEST_GESTOR)
    .end(function(err, res) {
      expect(res).to.have.status(400);
      expect(res.body).to.deep.equal({message:'gestor bad request'});
      done();
    });
  });

  it('mostra un 400 si hi ha una mala resposta en el PUT', (done) => {
    chai.request(URL)
    .put('/gestor?id=hola')
    .send(TEST_GESTOR)
    .end(function(err, res) {
      expect(res).to.have.status(400);
      expect(res.body).to.deep.equal({message:'gestor bad request'});
      done();
    });
  });

  it('mostra 404 si hi ha un error en el gestor en el PUT', (done) => {
    chai.request(URL)
    .put('/gestor?id=500')
    .send(TEST_GESTOR)
    .end(function(err, res) {
      expect(res).to.have.status(404);
      expect(res.body.message).to.equal({message:'gestor not found'});
      done();
    });
  });
  */
  // it('mostra un 500 si hi ha un error en el gestor en el PUT', (done) => {
  //   chai.request(URL)
  //   .put('/gestor?id=0')
  //   .send(TEST_GESTOR)
  //   .end(function(err, res) {
  //     expect(res).to.have.status(500);
  //     expect(res.body).to.deep.equal({message:'Error en el servidor al modificar el gestor. Gestor Internal Server Error'});
  //     done();
  //   });
  // });

  //DELETE
  /*
  it('mostra un 200 si borra el gestor en el DELETE', (done) => {
    chai.request(URL)
    .delete('/gestor?id=1')
    .end(function(err, res) {
      expect(res).to.have.status(200);
      done();
    });
  });

  it('mostra si recibe un error 400 en el DELETE', (done) => {
    chai.request(URL)
    .delete('/gestor?id=hola')
    .end(function(err, res) {
      expect(res).to.have.status(400);
      expect(res.body.message).to.equal('La id tiene que ser un numero');
      done();
    });
  });

  it('mostra si recibe un error 400 en el DELETE', (done) => {
    chai.request(URL)
    .delete('/gestor?id=-1')
    .end(function(err, res) {
      expect(res).to.have.status(400);
      expect(res.body.message).to.equal('El id debe de ser positivo');
      done();
    });
  });

  it('mostra un 404 si hi ha un error en el gestor', (done) => {
    chai.request(URL)
    .delete('/gestor?id=500')
    .end(function(err, res) {
      expect(res).to.have.status(404);
      expect(res.body).to.deep.equal({message:'gestor not found'});
      done();
    });
  });
  */
  /*
  it('Mostra un 500 si hi ha un error en el servidor al borrar el gestor en el DELETE', (done) => {
    chai.request(URL)
    .delete('/gestor?id=0')
    .end(function(err, res) {
        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({message:'Error en el servidor al borrar el gestor. Gestor Internal Server Error'});
        done();
    });
  });
  */
});
