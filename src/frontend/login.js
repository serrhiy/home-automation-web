import scaffold from './scaffold.js';
import structure from './structure.js';
import transport from './transport.js';

const copyBtn = document.getElementById('copyBtn');
const fileInput = document.getElementById('encryptedFile');
const fileName = document.getElementById('fileName');
const fileText = document.getElementById('fileText');
const testDataElement = document.getElementById('testData');
const authForm = document.getElementById('authenticationForm');

fileInput.addEventListener('change', () => {
  if (fileInput.files && fileInput.files[0]) {
    const file = fileInput.files[0];
    fileName.textContent = `Selected file: ${file.name}`;
    fileName.style.display = 'block';
    fileText.textContent = 'File selected';
  }
});

const main = async () => {
  const api = scaffold(transport)(structure);

  const testData = await api.challange.get();
  testDataElement.textContent = testData;

  copyBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    await navigator.clipboard.writeText(testData);
    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'Copied!';
    setTimeout(() => {
      copyBtn.textContent = originalText;
    }, 2000);
  });

  authForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const file = fileInput.files[0];
    const label = document.getElementById('label').value;

    if (!file) {
      alert('Please select an encrypted file');
      return;
    }

    if (!label) {
      alert('Please enter your label');
      return;
    }

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      console.log('Test data:', testData);
      console.log('Label:', label);
      console.log('Encrypted content:', reader.result);
    });
    reader.readAsText(file);
  });
};

main();
