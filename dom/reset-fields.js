export default function resetFields() {
  var fileInput = document.getElementById('media-file');
  var textArea = document.querySelector('textarea');
  fileInput.value = null;
  textArea.value = null;
}
