var Jimp = require('jimp/browser/lib/jimp.min');
var callNextTick = require('call-next-tick');
var waterfall = require('async-waterfall');

function resizeImage(mimeType, maxSideLength, buffer, resizeDone) {
  waterfall([wrapImage, doResize, passBuffer], resizeDone);

  function wrapImage(done) {
    Jimp.read(buffer, done);
  }

  function doResize(image, done) {
    image.contain(+maxSideLength, +maxSideLength, Jimp.RESIZE_BILINEAR);
    callNextTick(done, null, image);
  }

  function passBuffer(image, done) {
    image.getBuffer(mimeType, done);
  }
}

module.exports = resizeImage;
