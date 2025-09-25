/**
 * Created by arcedo on 18/07/2023.
 *
 * To run the test:
 * $ mocha test/api/requestQuery_spec.js
 * $ node ./node_modules/mocha/bin/mocha.js test/api/requestQuery_spec.js
 */
'use strict';

const chai = require('chai');
const expect = chai.expect;
// const assert = chai.assert;

const DEFAULT_SKIP = 0;
const DEFAULT_LIMIT = 150;

const requestQuery = require('../../api/requestQuery');

describe('parsing req.query pagination', function () {
  it('must return the values from the input', function (done) {
    const pag = requestQuery.pagination({ skip: '0', limit: '1' });
    expect(pag).to.deep.equal({ skip: '0', limit: '1' });
    done();
  });
  it('must return the default values if there is an empty object', function (done) {
    const pag = requestQuery.pagination({});
    expect(pag).to.deep.equal({ skip: DEFAULT_SKIP, limit: DEFAULT_LIMIT });
    done();
  });
  it('must return the default values if there is no input', function (done) {
    const pag = requestQuery.pagination({});
    expect(pag).to.deep.equal({ skip: DEFAULT_SKIP, limit: DEFAULT_LIMIT });
    done();
  });
});
describe('parsing req.query filtering', function () {
  it('must return the parameters to filter', function (done) {
    const filter = requestQuery.filter({ filter: 'id:gt:3,code:eq:new' });
    expect(filter).to.deep.equal([{ property: 'id', rule: 'gt', value: '3' }, { property: 'code', rule: 'eq', value: 'new' }]);
    done();
  });
  it('must return null if the parameter is an empty object', function (done) {
    const filter = requestQuery.filter({});
    expect(filter).to.deep.equal(null);
    done();
  });
  it('must return null if there is no input', function (done) {
    const filter = requestQuery.filter();
    expect(filter).to.deep.equal(null);
    done();
  });
});

describe('parsing req.query sorting', function () {
  it('must return the parameters to sort', function (done) {
    const sort = requestQuery.sort({ sort: 'id:desc' });
    expect(sort).to.deep.equal([{ property: 'id', order: 'desc' }]);
    done();
  });
  it('must return two parameters to sort', function (done) {
    const sort = requestQuery.sort({ sort: 'id:desc,code:asc' });
    expect(sort).to.deep.equal([{ property: 'id', order: 'desc' }, { property: 'code', order: 'asc' }]);
    done();
  });
  it('must return null if the parameter is an empty object', function (done) {
    const sort = requestQuery.sort({});
    expect(sort).to.deep.equal(null);
    done();
  });
  it('must return null if there is no input', function (done) {
    const sort = requestQuery.sort();
    expect(sort).to.deep.equal(null);
    done();
  });
});

describe('getting MySQL syntaxis from pagination object', function () {
  it('must return a string to insert a limit on sql', function (done) {
    expect(requestQuery.getLimit({ skip: 1, limit: 2 })).to.deep.equal('LIMIT 1,2');
    done();
  });
  it('must return a string to insert a limit on sql with the default values', function (done) {
    expect(requestQuery.getLimit(requestQuery.pagination())).to.deep.equal('LIMIT 0,150');
    done();
  });
});

describe('getting MySQL syntaxis from filtering object', function () {
  it('must return an empty string when null has been inserted', function (done) {
    expect(requestQuery.getWheres(null)).to.equal('');
    done();
  });
  it('must return a string with the where when the imput is valid', function (done) {
    expect(requestQuery.getWheres(requestQuery.filter({ filter: 'id:gt:3' }))).to.deep.equal('WHERE id > 3');
    done();
  });
  it('must return a where string with two filters', function (done) {
    expect(requestQuery.getWheres(requestQuery.filter({ filter: 'code:lt:1,id:gt:3' }))).to.deep.equal('WHERE code < 1 AND id > 3');
    done();
  });
});

describe('getting MySQL syntaxis from sorting object', function () {
  it('must return an empty string when null has been inserted', function (done) {
    expect(requestQuery.getOrderBy(null)).to.equal('');
    done();
  });
  it('must return a string with the order by when the imput is valid', function (done) {
    expect(requestQuery.getOrderBy(requestQuery.sort({ sort: 'id:asc' }))).to.deep.equal('ORDER BY id asc');
    done();
  });
  it('must return a order by with two filters', function (done) {
    expect(requestQuery.getOrderBy(requestQuery.sort({ sort: 'id:asc,code:desc' }))).to.deep.equal('ORDER BY id asc, code desc');
    done();
  });
});
