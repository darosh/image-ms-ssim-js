(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ImageMSSSIM = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//
// Copyright(c) Multimedia Signal Processing Group (MMSPG),
//              Ecole Polytechnique Fédérale de Lausanne (EPFL)
//              http://mmspg.epfl.ch
//              Zhou Wang
//              https://ece.uwaterloo.ca/~z70wang/
// All rights reserved.
// Author: Philippe Hanhart (philippe.hanhart@epfl.ch)
//
// Permission is hereby granted, without written agreement and without
// license or royalty fees, to use, copy, modify, and distribute the
// software provided and its documentation for research purpose only,
// provided that this copyright notice and the original authors' names
// appear on all copies and supporting documentation.
// The software provided may not be commercially distributed.
// In no event shall the Ecole Polytechnique Fédérale de Lausanne (EPFL)
// be liable to any party for direct, indirect, special, incidental, or
// consequential damages arising out of the use of the software and its
// documentation.
// The Ecole Polytechnique Fédérale de Lausanne (EPFL) specifically
// disclaims any warranties.
// The software provided hereunder is on an "as is" basis and the Ecole
// Polytechnique Fédérale de Lausanne (EPFL) has no obligation to provide
// maintenance, support, updates, enhancements, or modifications.
//
//
// Original Matlab implementation from Nikolay Ponomarenko available from http://live.ece.utexas.edu/research/quality/.
// Please refer to the following papers:
// - Z. Wang, E.P. Simoncelli, and A.C. Bovik, "Multiscale structural
//   similarity for image quality assessment," in IEEE Asilomar Conference
//   on Signals, Systems and Computers, November 2003, vol. 2, pp. 1398–1402.
//
/**
 * Based on:
 * - C++ implementation https://github.com/Rolinh/VQMT/blob/master/src/MSSSIM.cpp
 * - TypeScript implementation: https://github.com/darosh/image-ssim-js
 */
/// <reference path="node_modules/image-ssim/image-ssim.d.ts" />
/// <reference path="node_modules/image-resize-linear/image-resize-linear.d.ts" />
var SSIM = require('image-ssim');
var IR = require('image-resize-linear');
var ImageMSSSIM;
(function (ImageMSSSIM) {
    'use strict';
    /**
     * Entry point.
     */
    function compare(image1, image2, windowSize, K1, K2, luminance, bitsPerComponent) {
        if (windowSize === void 0) { windowSize = 8; }
        if (K1 === void 0) { K1 = 0.01; }
        if (K2 === void 0) { K2 = 0.03; }
        if (luminance === void 0) { luminance = true; }
        if (bitsPerComponent === void 0) { bitsPerComponent = 8; }
        var WEIGHT = [0.0448, 0.2856, 0.3001, 0.2363, 0.1333];
        var mssim = [];
        var mcs = [];
        var im1 = [];
        var im2 = [];
        var w = image1.width;
        var h = image1.height;
        im1[0] = image1;
        im2[0] = image2;
        for (var l = 0; l < WEIGHT.length; l++) {
            var res = SSIM.compare(im1[l], im2[l], windowSize, K1, K2, luminance, bitsPerComponent);
            mssim[l] = res.ssim;
            mcs[l] = res.mcs;
            if (l < WEIGHT.length - 1) {
                w = Math.floor(w / 2);
                h = Math.floor(h / 2);
                im1[l + 1] = {
                    width: w,
                    height: h,
                    data: new Uint8Array(w * h * image1.channels),
                    channels: image1.channels
                };
                im2[l + 1] = {
                    width: w,
                    height: h,
                    data: new Uint8Array(w * h * image2.channels),
                    channels: image2.channels
                };
                IR.linear(im1[l], im1[l + 1]);
                IR.linear(im2[l], im2[l + 1]);
            }
        }
        var msssim = mssim[WEIGHT.length - 1];
        for (l = 0; l < WEIGHT.length - 1; l++) {
            msssim *= Math.pow(mcs[l], WEIGHT[l]);
        }
        return { msssim: msssim, ssim: mssim[0] };
    }
    ImageMSSSIM.compare = compare;
})(ImageMSSSIM || (ImageMSSSIM = {}));
module.exports = ImageMSSSIM;

},{"image-resize-linear":2,"image-ssim":3}],2:[function(require,module,exports){
var ImageResizeLinear;
(function (ImageResizeLinear) {
    'use strict';
    function linear(from, to) {
        var sw = (from.width < to.width) ? ((from.width - 1) / to.width) : (from.width / to.width);
        var sh = (from.height < to.height) ? ((from.height - 1) / to.height) : (from.height / to.height);
        // sw > 2 => linear(from, {width: Math.floor(from.height/2), height:to.height, data: new Uint8Array(...),});
        var w = from.width * from.channels;
        var lw = from.width - 1;
        var lh = from.height - 1;
        var fx, fy, fx0, fy0;
        var rx, ry, rx1, ry1;
        var p1, p2, p3, p4;
        var w1, w2, w3, w4;
        for (var ty = 0; ty < to.height; ty++) {
            for (var tx = 0; tx < to.width; tx++) {
                fx = tx * sw;
                fy = ty * sh;
                fx0 = Math.floor(fx);
                fy0 = Math.floor(fy);
                p1 = fx0 * from.channels + fy0 * w;
                p2 = p1 + ((fx0 < lw) ? from.channels : 0);
                p3 = p1 + ((fy0 < lh) ? w : 0);
                p4 = p3 + ((fx0 < lw) ? from.channels : 0);
                rx = fx - fx0;
                ry = fy - fy0;
                rx1 = 1.0 - rx;
                ry1 = 1.0 - ry;
                w1 = rx1 * ry1;
                w2 = rx * ry1;
                w3 = rx1 * ry;
                w4 = rx * ry;
                for (var c = 0; c < from.channels; c++) {
                    to.data[(tx + ty * to.width) * from.channels + c] = w1 * from.data[p1 + c] + w2 * from.data[p2 + c] + w3 * from.data[p3 + c] + w4 * from.data[p4 + c];
                }
            }
        }
    }
    ImageResizeLinear.linear = linear;
})(ImageResizeLinear || (ImageResizeLinear = {}));
module.exports = ImageResizeLinear;

},{}],3:[function(require,module,exports){
/**
 * @preserve
 * Copyright 2015 Igor Bezkrovny
 * All rights reserved. (MIT Licensed)
 *
 * ssim.ts - part of Image Quantization Library
 */
/**
 * - Original TypeScript implementation:
 *   https://github.com/igor-bezkrovny/image-quantization/blob/9f62764ac047c3e53accdf1d7e4e424b0ef2fb60/src/quality/ssim.ts
 * - Based on Java implementation: https://github.com/rhys-e/structural-similarity
 * - For more information see: http://en.wikipedia.org/wiki/Structural_similarity
 */
var ImageSSIM;
(function (ImageSSIM) {
    'use strict';
    /**
     * Grey = 1, GreyAlpha = 2, RGB = 3, RGBAlpha = 4
     */
    (function (Channels) {
        Channels[Channels["Grey"] = 1] = "Grey";
        Channels[Channels["GreyAlpha"] = 2] = "GreyAlpha";
        Channels[Channels["RGB"] = 3] = "RGB";
        Channels[Channels["RGBAlpha"] = 4] = "RGBAlpha";
    })(ImageSSIM.Channels || (ImageSSIM.Channels = {}));
    var Channels = ImageSSIM.Channels;
    /**
     * Entry point.
     * @throws new Error('Images have different sizes!')
     */
    function compare(image1, image2, windowSize, K1, K2, luminance, bitsPerComponent) {
        if (windowSize === void 0) { windowSize = 8; }
        if (K1 === void 0) { K1 = 0.01; }
        if (K2 === void 0) { K2 = 0.03; }
        if (luminance === void 0) { luminance = true; }
        if (bitsPerComponent === void 0) { bitsPerComponent = 8; }
        if (image1.width !== image2.width || image1.height !== image2.height) {
            throw new Error('Images have different sizes!');
        }
        /* tslint:disable:no-bitwise */
        var L = (1 << bitsPerComponent) - 1;
        /* tslint:enable:no-bitwise */
        var c1 = Math.pow((K1 * L), 2), c2 = Math.pow((K2 * L), 2), numWindows = 0, mssim = 0.0;
        var mcs = 0.0;
        function iteration(lumaValues1, lumaValues2, averageLumaValue1, averageLumaValue2) {
            // calculate variance and covariance
            var sigxy, sigsqx, sigsqy;
            sigxy = sigsqx = sigsqy = 0.0;
            for (var i = 0; i < lumaValues1.length; i++) {
                sigsqx += Math.pow((lumaValues1[i] - averageLumaValue1), 2);
                sigsqy += Math.pow((lumaValues2[i] - averageLumaValue2), 2);
                sigxy += (lumaValues1[i] - averageLumaValue1) * (lumaValues2[i] - averageLumaValue2);
            }
            var numPixelsInWin = lumaValues1.length - 1;
            sigsqx /= numPixelsInWin;
            sigsqy /= numPixelsInWin;
            sigxy /= numPixelsInWin;
            // perform ssim calculation on window
            var numerator = (2 * averageLumaValue1 * averageLumaValue2 + c1) * (2 * sigxy + c2);
            var denominator = (Math.pow(averageLumaValue1, 2) + Math.pow(averageLumaValue2, 2) + c1) * (sigsqx + sigsqy + c2);
            mssim += numerator / denominator;
            mcs += (2 * sigxy + c2) / (sigsqx + sigsqy + c2);
            numWindows++;
        }
        // calculate SSIM for each window
        Internals._iterate(image1, image2, windowSize, luminance, iteration);
        return { ssim: mssim / numWindows, mcs: mcs / numWindows };
    }
    ImageSSIM.compare = compare;
    /**
     * Internal functions.
     */
    var Internals;
    (function (Internals) {
        function _iterate(image1, image2, windowSize, luminance, callback) {
            var width = image1.width, height = image1.height;
            for (var y = 0; y < height; y += windowSize) {
                for (var x = 0; x < width; x += windowSize) {
                    // avoid out-of-width/height
                    var windowWidth = Math.min(windowSize, width - x), windowHeight = Math.min(windowSize, height - y);
                    var lumaValues1 = _lumaValuesForWindow(image1, x, y, windowWidth, windowHeight, luminance), lumaValues2 = _lumaValuesForWindow(image2, x, y, windowWidth, windowHeight, luminance), averageLuma1 = _averageLuma(lumaValues1), averageLuma2 = _averageLuma(lumaValues2);
                    callback(lumaValues1, lumaValues2, averageLuma1, averageLuma2);
                }
            }
        }
        Internals._iterate = _iterate;
        function _lumaValuesForWindow(image, x, y, width, height, luminance) {
            var array = image.data, lumaValues = new Float32Array(new ArrayBuffer(width * height * 4)), counter = 0;
            var maxj = y + height;
            for (var j = y; j < maxj; j++) {
                var offset = j * image.width;
                var i = (offset + x) * image.channels;
                var maxi = (offset + x + width) * image.channels;
                switch (image.channels) {
                    case 1 /* Grey */:
                        while (i < maxi) {
                            // (0.212655 +  0.715158 + 0.072187) === 1
                            lumaValues[counter++] = array[i++];
                        }
                        break;
                    case 2 /* GreyAlpha */:
                        while (i < maxi) {
                            lumaValues[counter++] = array[i++] * (array[i++] / 255);
                        }
                        break;
                    case 3 /* RGB */:
                        if (luminance) {
                            while (i < maxi) {
                                lumaValues[counter++] = (array[i++] * 0.212655 + array[i++] * 0.715158 + array[i++] * 0.072187);
                            }
                        }
                        else {
                            while (i < maxi) {
                                lumaValues[counter++] = (array[i++] + array[i++] + array[i++]);
                            }
                        }
                        break;
                    case 4 /* RGBAlpha */:
                        if (luminance) {
                            while (i < maxi) {
                                lumaValues[counter++] = (array[i++] * 0.212655 + array[i++] * 0.715158 + array[i++] * 0.072187) * (array[i++] / 255);
                            }
                        }
                        else {
                            while (i < maxi) {
                                lumaValues[counter++] = (array[i++] + array[i++] + array[i++]) * (array[i++] / 255);
                            }
                        }
                        break;
                }
            }
            return lumaValues;
        }
        function _averageLuma(lumaValues) {
            var sumLuma = 0.0;
            for (var i = 0; i < lumaValues.length; i++) {
                sumLuma += lumaValues[i];
            }
            return sumLuma / lumaValues.length;
        }
    })(Internals || (Internals = {}));
})(ImageSSIM || (ImageSSIM = {}));
module.exports = ImageSSIM;

},{}]},{},[1])(1)
});