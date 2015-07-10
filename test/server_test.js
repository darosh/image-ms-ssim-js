var assert = require('assert');
var load = require('./lib/load_images');
var MSSSIM = require('../index');

describe('MSSSIM module', function(){
    it('should compare different images', function(done) {
        load('./test/images/wheel.png', './test/images/wheel-pixelized.png', function(images){
            var msssim = MSSSIM.compare(images[0], images[1]);
            assert(msssim.msssim > 0);
            assert(msssim.msssim < 1);
            done();
        });
    });

    it('should compare same images', function(done) {
        load('./test/images/wheel-pixelized.png', './test/images/wheel-pixelized.png', function(images){
            var msssim = MSSSIM.compare(images[0], images[1]);
            assert(msssim.msssim === 1);
            done();
        });
    });
});
