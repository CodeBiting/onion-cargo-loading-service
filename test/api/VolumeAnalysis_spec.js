/**
 * Created by jordi on 15/10/2022.
 * 
 * To run the test:
 * $ mocha test/api/VolumeAnalysis_spec.js
 */
'use strict';

const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const volumeAnalysis = require('../../api/VolumeAnalysis');

// x = amplada, y = llargada, z = alçada, tot en milímetres, volum en litres, mides interiors de la caixa
// ordenat per volum de menys a més
const BOX_SET_TINY = [
  { "code":"tiny", "x":25, "y":20, "z":10, "volume":0.005 },
];
const BOX_SET_MINI = [
  { "code":"tiny", "x":100, "y":200, "z":100, "volume":2 },
];
const BOX_SET_HUGE = [
  { "code":"huge", "x":1000, "y":1000, "z":1000, "volume":1000 },
];
const BOX_SET_2IN1 = [
  { "code":"2in1e-Flex-001", "x":250, "y":200, "z":100, "volume":5 },
  { "code":"2in1e-Flex-002", "x":310, "y":215, "z":80, "volume":5.332 },
  { "code":"2in1e-Flex-003", "x":370, "y":290, "z":80, "volume":8.584 },
];
const BOX_SET_2IN1_1 = [
  { "code":"2in1e-Flex-001", "x":250, "y":200, "z":100, "volume":5 },
];
const BOX_SET_2IN1_2 = [
  { "code":"2in1e-Flex-002", "x":310, "y":215, "z":80, "volume":5.332 },
];
const BOX_SET_2IN1_3 = [
  { "code":"2in1e-Flex-003", "x":370, "y":290, "z":80, "volume":8.584 },
];

const PRODUCT_SET_01 = [  // 1 producte
  { "code":"selfpackaging-2536", "x":62, "y":62, "z":151, "volume":0.580444, "allowedRotations": ["x", "y"] },
];
const PRODUCT_SET_01_NO_ROTATION = [  // 1 producte sense rotació
{ "code":"selfpackaging-2536", "x":62, "y":62, "z":151, "volume":0.580444, "allowedRotations": [] },
];
const PRODUCT_SET_02 = [  // 2 productes iguals
  { "code":"selfpackaging-2536", "x":62, "y":62, "z":151, "volume":0.580444, "allowedRotations": ["x", "y"] },
  { "code":"selfpackaging-2536", "x":62, "y":62, "z":151, "volume":0.580444, "allowedRotations": ["x", "y"] },
];
const PRODUCT_SET_03 = [  // 2 productes diferents
  { "code":"selfpackaging-2536", "x":62, "y":62, "z":151, "volume":0.580444, "allowedRotations": ["x", "y"] },
  { "code":"selfpackaging-1506", "x":85, "y":83, "z":79, "volume":0.557345, "allowedRotations": ["x", "y"] },
];

describe('rotateProduct', function() {
  it('must rotate a box from x axe successfully', function(done) {
    // Rotem sobre l'eix de lex x, la x queda igual, y es converteix en z i z en y
    let box = { "code":"B1", "x":62, "y":65, "z":151 };
    let boxRotatedExpected = { "code":"B1", "x":62, "y":151, "z":65 };
    let result = volumeAnalysis.rotateProduct(box, 'x');
    //console.log(JSON.stringify(result));
    expect(result).to.deep.equal(boxRotatedExpected);
    done();
  });
  it('must rotate a box from y axe successfully', function(done) {
    // Rotem sobre l'eix de lex y, la y queda igual, x es converteix en z i z en x
    let box = { "code":"B1", "x":62, "y":65, "z":151 };
    let boxRotatedExpected = { "code":"B1", "x":151, "y":65, "z":62 };
    let result = volumeAnalysis.rotateProduct(box, 'y');
    //console.log(JSON.stringify(result));
    expect(result).to.deep.equal(boxRotatedExpected);
    done();
  });
  it('must rotate a box from z axe successfully', function(done) {
    // Rotem sobre l'eix de lex z, la z queda igual, y es converteix en x i x en y
    let box = { "code":"B1", "x":62, "y":65, "z":151 };
    let boxRotatedExpected = { "code":"B1", "x":65, "y":62, "z":151 };
    let result = volumeAnalysis.rotateProduct(box, 'z');
    //console.log(JSON.stringify(result));
    expect(result).to.deep.equal(boxRotatedExpected);
    done();
  });
});

describe('findPickingBox', function() {
  it('if there are no boxes must return null', function(done) {
    let result = volumeAnalysis.findPickingBox([], PRODUCT_SET_01);
    //console.log(JSON.stringify(result));
    expect(result).to.have.property("boxFound").to.equal(null);
    done();
  });
  it('if there are no products must return null', function(done) {
    let result = volumeAnalysis.findPickingBox(BOX_SET_2IN1, []);
    //console.log(JSON.stringify(result));
    expect(result).to.have.property("boxFound").to.equal(null);
    done();
  });
  it('if there are no boxes and no products must return null', function(done) {
    let result = volumeAnalysis.findPickingBox([], []);
    //console.log(JSON.stringify(result));
    expect(result).to.have.property("boxFound").to.equal(null);
    done();
  });
  it('can not put one product inside a box with volume inferior', function(done) {
    let result = volumeAnalysis.findPickingBox(BOX_SET_TINY, PRODUCT_SET_01);
    //console.log(JSON.stringify(result));
    expect(result).to.have.property("boxFound").to.equal(null);
    expect(result).to.have.property("returnValue").to.equal(-1);
    expect(result).to.have.property("message").to.equal('The total products volume is greater than all boxes');
    done();
  });
  it('can put one product ("x":62, "y":62, "z":151) inside a box ("x":1000, "y":1000, "z":1000) with volume and sizes superior', function(done) {
    let result = volumeAnalysis.findPickingBox(BOX_SET_HUGE, PRODUCT_SET_01);
    //console.log(JSON.stringify(result));
    expect(result).to.have.property("boxFound").to.deep.equal(BOX_SET_HUGE[0]);
    expect(result).to.have.property("returnValue").to.equal(0);
    expect(result).to.have.property("message").to.equal('');
    expect(result).to.have.property("productsInsideBox").to.deep.equal([{"x1":0,"y1":0,"z1":0,"x2":62,"y2":62,"z2":151}]);
    done();
  });
  it('can put one product ("x":62, "y":62, "z":151) inside a box (x":100, "y":200, "z":100) with volume and sizes superior rotating x', function(done) {
    let result = volumeAnalysis.findPickingBox(BOX_SET_MINI, PRODUCT_SET_01);
    //console.log(JSON.stringify(result));
    expect(result).to.have.property("boxFound").to.deep.equal(BOX_SET_MINI[0]);
    expect(result).to.have.property("returnValue").to.equal(0);
    expect(result).to.have.property("message").to.equal('');
    expect(result).to.have.property("productsInsideBox").to.deep.equal([{"x1":0,"y1":0,"z1":0,"x2":62,"y2":151,"z2":62}]);
    done();
  });
  it('can NOT put one product ("x":62, "y":62, "z":151) inside a box (x":100, "y":200, "z":100) with volume and sizes superior without rotating', function(done) {
    let result = volumeAnalysis.findPickingBox(BOX_SET_MINI, PRODUCT_SET_01_NO_ROTATION);
    //console.log(JSON.stringify(result));
    expect(result).to.have.property("boxFound").to.deep.equal(null);
    expect(result).to.have.property("returnValue").to.equal(-2);
    expect(result).to.have.property("message").to.equal(`Not found any product combination that can be fit into the boxes`);
    expect(result).to.have.property("productsInsideBox").to.deep.equal([]);
    done();
  });
});
