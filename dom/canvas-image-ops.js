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

var canvas = document.getElementById('resize-canvas');
var ctx = canvas.getContext('2d');
var img;
var currentRotation = 0;

var loadedImageMIMEType;
var imageIsLoaded = true;

function loadFileToCanvas({ mimeType, maxSideLength, file }) {
  img = new Image();
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

    canvas.width = newWidth;
    canvas.height = newHeight;
    ctx.drawImage(img, 0, 0, newWidth, newHeight);

    loadedImageMIMEType = mimeType;
  }
}

function getImageFromCanvas(done) {
  canvas.toBlob(passBlob, loadedImageMIMEType, 0.7);

  function passBlob(blob) {
    done(null, blob);
  }
}

function canvasHasImage() {
  return imageIsLoaded;
}

function rotateImage() {
  if (!canvasHasImage()) {
    return;
  }
  ctx.save();
  currentRotation += 90;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  var prevWidth = canvas.width;
  canvas.width = canvas.height;
  canvas.height = prevWidth;
  console.log(canvas.width, canvas.height)

  ctx.translate(canvas.width/2, canvas.height/2);
  ctx.rotate(currentRotation * Math.PI/180);
  ctx.drawImage(img, -canvas.height/2, -canvas.width/2, canvas.width, canvas.height);
  //ctx.setTransform(1, 0, 0, 1, 0, 0); 
  ctx.restore();
  return
}

module.exports = {
  loadFileToCanvas,
  getImageFromCanvas,
  canvasHasImage,
  rotateImage
};
