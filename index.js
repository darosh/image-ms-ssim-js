/// <reference path="node_modules/image-ssim/image-ssim.d.ts" />
/// <reference path="node_modules/image-resize-linear/image-resize-linear.d.ts" />
var SSIM = require('image-ssim');
var IR = require('image-resize-linear');
var ImageMSSSIM;
(function (ImageMSSSIM) {
    'use strict';
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
