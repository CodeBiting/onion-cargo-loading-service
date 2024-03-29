/**
 * Created by jordi on 02/12/2022.
 *
 * To run the test:
 * 1. Start the server `npm start`
 * 2. Execute test `mocha test/routes/v1/client_spec.js --timeout 2000`
 */

const chai = require('chai');
const dirtyChai = require('dirty-chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;

chai.use(dirtyChai);
chai.use(chaiHttp);

const URL = 'http://localhost:8080/v1';
const HELP_BASE_URL = 'http://localhost:8080/v1/help/error';

const TEST_CLIENT = {
  code: 'new',
  dateStart: '2023-01-01 00:00:00', // date time in format 'YYYY-MM-DD hh:mm:ss'
  dateFinal: '2024-12-01 15:03:12', // date time in format 'YYYY-MM-DD hh:mm:ss'
  active: 1,
  token: 'new',
  notes: 'new',
  deleted_at: null
};
const TEST_CLIENT_2 = {
  code: 'new2',
  dateStart: '2023-01-01 00:00:00', // date time in format 'YYYY-MM-DD hh:mm:ss'
  dateFinal: '2024-12-01 15:03:12', // date time in format 'YYYY-MM-DD hh:mm:ss'
  active: 1,
  token: 'new2',
  notes: 'new',
  deleted_at: null
};

// ----------GET-----------
describe('API Client ', () => {
  it('should return all clients', (done) => {
    chai.request(URL)
      .get('/client')
      .end(function (err, res) {
        // console.log(res.body);
        expect(err).to.equal(null);
        expect(res).to.have.status(200);
        expect(res.body).to.have.status('OK');
        expect(res.body.data).to.be.an('array');
        expect(res.body.errors).to.be.an('array');
        expect(res.body.errors).to.be.an('array').that.eql([]);
        chai
          .request(URL)
          .get('/client?skip=0&limit=1')
          .end(function (err, res) {
            expect(err).to.equal(null);
            expect(res).to.have.status(200);
            expect(res.body).to.have.status('OK');
            done();
          });
      });
  });

  /// v1/client/[clientId]/containers
  it('should return all client containers', (done) => {
    chai.request(URL)
      .get('/client/1/containers')
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('status', 'OK');
        expect(res.body).to.have.property('data').that.is.an('array');
        expect(res.body.errors).to.be.an('array').to.have.lengthOf(0);
        done();
      });
  });

  it('should create one client, and return only this client', (done) => {
    chai.request(URL)
      .post('/client')
      .send(TEST_CLIENT)
      .end(function (err, res) {
        // console.log(res.body);
        expect(err).to.equal(null);
        expect(res).to.have.status(201);
        expect(res.body).to.have.status('OK');
        expect(res.body.data).not.to.be.an('array');
        expect(res.body.errors).to.be.an('array');
        expect(res.body.errors).to.be.an('array').that.eql([]);
        chai.request(URL)
          .get(`/client/${res.body.data.id}`)
          .end(function (err, res) {
            // console.log(res.body);
            expect(err).to.equal(null);
            expect(res).to.have.status(200);
            expect(res.body).to.have.status('OK');
            expect(res.body.data).not.to.be.an('array');
            expect(res.body.data).to.be.eql({
              id: res.body.data.id,
              code: 'new',
              dateStart: (new Date(2023, 0, 1, 0, 0, 0)).toISOString(),
              dateFinal: (new Date(2024, 11, 1, 15, 3, 12)).toISOString(),
              active: 1,
              token: 'new',
              notes: 'new',
              deleted_at: null
            });
            expect(res.body.errors).to.be.an('array');
            expect(res.body.errors).to.be.an('array').that.eql([]);
            chai.request(URL)
              .delete(`/client/${res.body.data.id}`)
              .end(function (err, res) {
                // console.log(res.status);
                // console.log(res.body);
                expect(err).to.equal(null);
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

  it('should return one client using the skip and limit and then return two clients using skip and limit with other parameters', (done) => {
    chai
      .request(URL)
      .post('/client')
      .send(TEST_CLIENT)
      .end(function (err, res) {
        expect(err).to.equal(null);
        const firstClientId = res.body.data.id;
        expect(res).to.have.status(201);
        expect(res.body).to.have.status('OK');
        chai
          .request(URL)
          .post('/client')
          .send(TEST_CLIENT_2)
          .end(function (err, res) {
            expect(err).to.equal(null);
            const secondClientId = res.body.data.id;
            expect(res).to.have.status(201);
            expect(res.body).to.have.status('OK');
            chai
              .request(URL)
              .get('/client?skip=0&limit=1')
              .end(function (err, res) {
                expect(err).to.equal(null);
                expect(res).to.have.status(200);
                expect(res.body).to.have.status('OK');
                expect(res.body.data).to.be.an('array');
                expect(res.body.data).to.have.length(1);
                chai
                  .request(URL)
                  .get('/client?skip=0&limit=2')
                  .end(function (err, res) {
                    expect(err).to.equal(null);
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.status('OK');
                    expect(res.body.data).to.be.an('array');
                    expect(res.body.data).to.have.length(2);
                    chai
                      .request(URL)
                      .delete(`/client/${firstClientId}`)
                      .end(function (err, res) {
                        expect(err).to.equal(null);
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.status('OK');
                        expect(res.body.data).not.to.be.an('array');
                        expect(res.body.errors).to.be.an('array');
                        expect(res.body.errors).to.deep.equal([]);
                        chai
                          .request(URL)
                          .delete(`/client/${secondClientId}`)
                          .end(function (err, res) {
                            expect(err).to.equal(null);
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

  it('should return 404 if the client requested does not exist', (done) => {
    chai.request(URL)
      .get('/client/9999')
      .end(function (err, res) {
        // console.log(res.body);
        expect(err).to.equal(null);
        expect(res).to.have.status(404);
        expect(res.body).to.have.status('ERROR');
        expect(res.body.data).not.to.be.an('array');
        expect(res.body.requestId).to.be.an('string');
        expect(res.body.errors).to.be.an('array');
        expect(res.body.errors).to.deep.equal([{
          code: 'CLIENT-001',
          message: 'Incorrect Id, this id does not exist',
          detail: 'Ensure that the Id included in the request are correct',
          help: `${HELP_BASE_URL}/CLIENT-001`
        }]);
        done();
      });
  });

  // ----------POST-----------
  it('should create a new client', (done) => {
    chai.request(URL)
      .post('/client')
      .send(TEST_CLIENT)
      .end(function (err, res) {
        // console.log(res.body);
        expect(err).to.equal(null);
        expect(res).to.have.status(201);
        expect(res.body).to.have.status('OK');
        expect(res.body.data).not.to.be.an('array');
        expect(res.body.requestId).to.be.an('string');
        expect(res.body.errors).to.be.an('array');
        expect(res.body.errors).to.be.an('array').that.eql([]);
        chai.request(URL)
          .delete(`/client/${res.body.data.id}`)
          .end(function (err, res) {
            // console.log(res.status);
            // console.log(res.body);
            expect(err).to.equal(null);
            expect(res).to.have.status(200);
            expect(res.body).to.have.status('OK');
            expect(res.body.data).not.to.be.an('array');
            expect(res.body.errors).to.be.an('array');
            expect(res.body.errors).to.deep.equal([]);
            done();
          });
      });
  });

  // ----------PUT-----------
  it('should update a client', (done) => {
    chai.request(URL)
      .post('/client')
      .send(TEST_CLIENT)
      .end(function (err, res) {
        expect(err).to.equal(null);
        expect(res).to.have.status(201);
        expect(res.body).to.have.status('OK');
        expect(res.body.data).not.to.be.an('array');
        expect(res.body.requestId).to.be.an('string');
        expect(res.body.errors).to.be.an('array');
        expect(res.body.errors).to.be.an('array').that.eql([]);
        // console.log(res.body);
        chai.request(URL)
          .put(`/client/${res.body.data.id}`)
          .set('content-type', 'application/json')
          .send({
            id: 1,
            code: 'Prova PUT',
            dateStart: '2023-03-20 10:15',
            dateFinal: '2024-03-25 10:15',
            active: 1,
            token: 'fer el seu fitxer',
            notes: 'no se, notes'
          })
          .end(function (err, res) {
            // console.log(res.body);
            expect(err).to.equal(null);
            expect(res).to.have.status(200);
            expect(res.body).to.have.status('OK');
            expect(res.body.data).not.to.be.an('array');
            expect(res.body.requestId).to.be.an('string');
            expect(res.body.errors).to.be.an('array');
            expect(res.body.errors).to.be.an('array').that.eql([]);
            // console.log(res.body);
            expect(res.body.data).to.be.deep.equal({
              id: res.body.data.id,
              code: 'Prova PUT',
              dateStart: (new Date(2023, 2, 20, 10, 15)).toISOString(),
              dateFinal: (new Date(2024, 2, 25, 10, 15)).toISOString(),
              active: 1,
              token: 'fer el seu fitxer',
              notes: 'no se, notes',
              deleted_at: null
            });
            expect(res.body.errors).to.be.an('array');
            expect(res.body.errors).to.be.an('array').that.eql([]);
            chai.request(URL)
              .delete(`/client/${res.body.data.id}`)
              .end(function (err, res) {
                expect(err).to.equal(null);
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

  it('should return 404 if the client requested for updating does not exist', (done) => {
    chai.request(URL)
      .put('/client/9999')
      .send(TEST_CLIENT)
      .end(function (err, res) {
        // console.log(res.body);
        expect(err).to.equal(null);
        expect(res).to.have.status(404);
        expect(res.body).to.have.status('ERROR');
        expect(res.body.data).not.to.be.an('array');
        expect(res.body.requestId).to.be.an('string');
        expect(res.body.errors).to.be.an('array');
        expect(res.body.errors).to.deep.equal([{
          code: 'CLIENT-001',
          message: 'Incorrect Id, this id does not exist',
          detail: 'Ensure that the Id included in the request is correct',
          help: `${HELP_BASE_URL}/CLIENT-001`
        }]);
        done();
      });
  });

  it('should return 404 if the URL to update a container is not found because input ID is empty', (done) => {
    chai.request(URL)
      .put('/client/')
      .end(function (err, res) {
        expect(err).to.equal(null);
        expect(res).to.have.status(404);
        expect(res.body).to.have.status('ERROR');
        expect(res.body.data).not.to.be.an('array');
        expect(res.body.requestId).to.be.an('string');
        expect(res.body.errors).to.be.an('array');
        expect(res.body.errors).to.deep.equal([{
          code: 'NOT-FOUND-ERROR-001',
          message: 'Not found',
          detail: '',
          help: `${HELP_BASE_URL}/NOT-FOUND-ERROR-001`
        }]);
        done();
      });
  });

  // ----------DELETE-----------
  it('should delete a client', (done) => {
    chai.request(URL)
      .post('/client')
      .send({
        id: 1,
        code: 'Prova DELETE',
        dateStart: '2023-02-20 10:15',
        dateFinal: '2024-02-25 10:15',
        active: 1,
        token: 'fer el seu fitxer',
        notes: 'no se, notes',
        deleted_at: null
      })
      .end(function (err, res) {
        // console.log(res.body);
        expect(err).to.equal(null);
        expect(res).to.have.status(201);
        expect(res.body).to.have.status('OK');
        expect(res.body.data).not.to.be.an('array');
        expect(res.body.data).to.be.eql({
          id: res.body.data.id,
          code: 'Prova DELETE',
          dateStart: (new Date(2023, 1, 20, 10, 15)).toISOString(),
          dateFinal: (new Date(2024, 1, 25, 10, 15)).toISOString(),
          active: 1,
          token: 'fer el seu fitxer',
          notes: 'no se, notes',
          deleted_at: null
        });
        expect(res.body.errors).to.be.an('array');
        expect(res.body.errors).to.be.an('array').that.eql([]);
        chai.request(URL)
          .delete(`/client/${res.body.data.id}`)
          .end(function (err, res) {
            // console.log(res.status);
            // console.log(res.body);
            expect(err).to.equal(null);
            expect(res).to.have.status(200);
            expect(res.body).to.have.status('OK');
            expect(res.body.data).not.to.be.an('array');
            expect(res.body.requestId).to.be.an('string');
            expect(res.body.errors).to.be.an('array');
            expect(res.body.errors).to.deep.equal([]);
            done();
          });
      });
  });

  it('should return 404 if the client requested to delete does not exist', (done) => {
    chai.request(URL)
      .delete('/client/9999')
      .end(function (err, res) {
        // console.log(res.body);
        expect(err).to.equal(null);
        expect(res).to.have.status(404);
        expect(res.body).to.have.status('ERROR');
        expect(res.body.data).not.to.be.an('array');
        expect(res.body.requestId).to.be.an('string');
        expect(res.body.errors).to.be.an('array');
        expect(res.body.errors).to.deep.equal([{
          code: 'CLIENT-001',
          message: 'Incorrect Id, this id does not exist',
          detail: 'Ensure that the Id included in the request is correct',
          help: `${HELP_BASE_URL}/CLIENT-001`
        }]);
        done();
      });
  });

  it('should return 404 if the URL to delete a client is not found because input ID is empty', (done) => {
    chai.request(URL)
      .delete('/client/ ')
      .end(function (err, res) {
        expect(err).to.equal(null);
        expect(res).to.have.status(404);
        expect(res.body).to.have.status('ERROR');
        expect(res.body.data).not.to.be.an('array');
        expect(res.body.requestId).to.be.an('string');
        expect(res.body.errors).to.be.an('array');
        expect(res.body.errors).to.deep.equal([{
          code: 'NOT-FOUND-ERROR-001',
          message: 'Not found',
          detail: '',
          help: `${HELP_BASE_URL}/NOT-FOUND-ERROR-001`
        }]);
        done();
      });
  });

  it('should return add a delete date and then delete', (done) => {
    chai.request(URL)
      .post('/client')
      .send({
        code: 'Prova DELETE_AT',
        dateStart: '2023-02-20 10:15',
        dateFinal: '2024-02-25 10:15',
        active: 1,
        token: 'fer el seu fitxer',
        notes: 'no se, notes'
      })
      .end(function (err, res) {
        // console.log(res.body);
        expect(err).to.equal(null);
        expect(res).to.have.status(201);
        expect(res.body).to.have.status('OK');
        expect(res.body.data).not.to.be.an('array');
        expect(res.body.data).to.be.eql({
          id: res.body.data.id,
          code: 'Prova DELETE_AT',
          dateStart: (new Date(2023, 1, 20, 10, 15)).toISOString(),
          dateFinal: (new Date(2024, 1, 25, 10, 15)).toISOString(),
          active: 1,
          token: 'fer el seu fitxer',
          notes: 'no se, notes',
          deleted_at: null
        });
        expect(res.body.errors).to.be.an('array');
        expect(res.body.errors).to.be.an('array').that.eql([]);
        chai.request(URL)
          .put(`/client/${res.body.data.id}/delete`)
          .end(function (err, res) {
            // console.log(res.status);
            // console.log(res.body);
            expect(err).to.equal(null);
            expect(res).to.have.status(200);
            expect(res.body).to.have.status('OK');
            expect(res.body.data).not.to.be.an('array');
            expect(res.body.requestId).to.be.an('string');
            expect(res.body.errors).to.be.an('array');
            expect(res.body.errors).to.deep.equal([]);
            chai.request(URL)
              .delete(`/client/${res.body.data.id}`)
              .end(function (err, res) {
                // console.log(res.status);
                // console.log(res.body);
                expect(err).to.equal(null);
                expect(res).to.have.status(200);
                expect(res.body).to.have.status('OK');
                expect(res.body.data).not.to.be.an('array');
                expect(res.body.requestId).to.be.an('string');
                expect(res.body.errors).to.be.an('array');
                expect(res.body.errors).to.deep.equal([]);
                done();
              });
          });
      });
  });
});
