export default function renderMessage({ sel, message }) {
  var slate = document.querySelector(sel);
  slate.textContent = message;
  slate.classList.remove('hidden');
}
