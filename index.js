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
