// Polyfill for canvas.toBlob from MDN.
if (!HTMLCanvasElement.prototype.toBlob) {
  Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
    value: function(callback, type, quality) {
      var canvas = this;
      setTimeout(function() {
        var binStr = atob(canvas.toDataURL(type, quality).split(',')[1]),
          len = binStr.length,
          arr = new Uint8Array(len);

        for (var i = 0; i < len; i++) {
          arr[i] = binStr.charCodeAt(i);
        }

        callback(new Blob([arr], { type: type || 'image/png' }));
      });
    }
  });
}

function resizeImage(mimeType, maxSideLength, file, resizeDone) {
  var img = new Image();
  img.addEventListener('load', drawToCanvas);
  img.src = URL.createObjectURL(file);

  function drawToCanvas() {
    var originalWidth = img.width;
    var originalHeight = img.height;

    var newWidth;
    var newHeight;
    if (originalWidth > originalHeight) {
      newWidth = maxSideLength;
      newHeight = (originalHeight * newWidth) / originalWidth;
    } else {
      newHeight = maxSideLength;
      newWidth = (originalWidth * newHeight) / originalHeight;
    }

    var canvas = document.getElementById('resize-canvas');
    canvas.width = newWidth;
    canvas.height = newHeight;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, newWidth, newHeight);
    // TODO: Clear canvas?
    canvas.toBlob(passBlob, mimeType, 0.7);
  }

  function passBlob(blob) {
    resizeDone(null, blob);
  }
}

module.exports = resizeImage;
