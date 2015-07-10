(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ImageMSE = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ImageMSE;
(function (ImageMSE) {
    'use strict';
    function compare(image1, image2, luminance) {
        if (luminance === void 0) { luminance = true; }
        var sum = 0;
        var l = image1.data.length;
        var i;
        var a1;
        var a2;
        if (image1.channels === 1) {
            for (i = 0; i < l; i += image1.channels) {
                sum += Math.pow(image1.data[i] - image2.data[i], 2);
            }
        }
        else if (image1.channels === 2) {
            for (i = 0; i < l; i += image1.channels) {
                sum += Math.pow(image1.data[i] * image1.data[i + 1] / 255 - image2.data[i] * image2.data[i - 1] / 255, 2);
            }
        }
        else if (image1.channels === 3 && !luminance) {
            for (i = 0; i < l; i += image1.channels) {
                sum += Math.pow(image1.data[i] - image2.data[i], 2);
                sum += Math.pow(image1.data[i + 1] - image2.data[i + 1], 2);
                sum += Math.pow(image1.data[i + 2] - image2.data[i + 2], 2);
            }
        }
        else if (image1.channels === 3 && luminance) {
            for (i = 0; i < l; i += image1.channels) {
                sum += Math.pow(0.212655 * image1.data[i] - 0.212655 * image2.data[i], 2);
                sum += Math.pow(0.715158 * image1.data[i + 1] - 0.715158 * image2.data[i + 1], 2);
                sum += Math.pow(0.072187 * image1.data[i + 2] - 0.072187 * image2.data[i + 2], 2);
            }
        }
        else if (image1.channels === 4 && !luminance) {
            for (i = 0; i < l; i += image1.channels) {
                a1 = image1.data[i + 3] / 255;
                a2 = image2.data[i + 3] / 255;
                sum += Math.pow(image1.data[i] * a1 - image2.data[i] * a2, 2);
                sum += Math.pow(image1.data[i + 1] * a1 - image2.data[i + 1] * a2, 2);
                sum += Math.pow(image1.data[i + 2] * a1 - image2.data[i + 2] * a2, 2);
            }
        }
        else if (image1.channels === 4 && luminance) {
            for (i = 0; i < l; i += image1.channels) {
                a1 = image1.data[i + 3] / 255;
                a2 = image2.data[i + 3] / 255;
                sum += Math.pow(0.212655 * image1.data[i] * a1 - 0.212655 * image2.data[i] * a2, 2);
                sum += Math.pow(0.715158 * image1.data[i + 1] * a1 - 0.715158 * image2.data[i + 1] * a2, 2);
                sum += Math.pow(0.072187 * image1.data[i + 2] * a1 - 0.072187 * image2.data[i + 2] * a2, 2);
            }
        }
        var pc = l;
        if ((image1.channels === 3 || image1.channels === 4) && !luminance) {
            pc *= 3;
        }
        var mse = sum / pc;
        return {
            mse: mse,
            psnr: psnr(mse)
        };
    }
    ImageMSE.compare = compare;
    function psnr(mse, max) {
        if (max === void 0) { max = 255; }
        return 10 * log10((max * max) / mse);
    }
    function log10(value) {
        return Math.log(value) / Math.LN10;
    }
})(ImageMSE || (ImageMSE = {}));
module.exports = ImageMSE;

},{}]},{},[1])(1)
});