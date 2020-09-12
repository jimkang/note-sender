export default function renderMessage({ messageType, message }) {
  var slate = document.getElementById(messageType);
  slate.textContent = message;
  slate.classList.remove('hidden');
}
