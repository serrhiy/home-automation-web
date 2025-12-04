import scaffold from './scaffold.js';
import structure from './structure.js';
import transport from './transport.js';

const fileInput = document.getElementById('publicKey');
const fileName = document.getElementById('fileName');
const fileText = document.getElementById('fileText');
const registrationForm = document.getElementById('registrationForm');

fileInput.addEventListener('change', () => {
  if (!fileInput.files || !fileInput.files[0]) return;
  const file = fileInput.files[0];
  fileName.textContent = `Selected file: ${file.name}`;
  fileName.style.display = 'block';
  fileText.textContent = 'File selected';
});

registrationForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const api = scaffold(transport)(structure);

  const file = fileInput.files[0];
  const label = document.getElementById('username').value;

  if (!file) {
    return void alert('Select file with publick key');
  }

  if (!label) {
    return void alert('Enter username');
  }

  const reader = new FileReader();
  reader.addEventListener('load', async () => {
    try {
      const data = { label, publicKey: reader.result };
      await api.operators.create(data);
      location.replace('/');
    } catch (error) {
      console.error(error);
    }
  });
  reader.readAsText(file);
});
