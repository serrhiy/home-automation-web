import scaffold from './scaffold.js';
import structure from './structure.js';
import transport from './transport.js';

const fileInput = document.getElementById('encryptedFile');
const authForm = document.getElementById('authenticationForm');
const downloadHexBtn = document.getElementById('downloadHexBtn');

const main = async () => {
  const api = scaffold(transport)(structure);

  const { challange, token } = await api.challange.get();

  downloadHexBtn.addEventListener('click', () => {
    const blob = new Blob([challange], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'message.base64';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  authForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const file = fileInput.files[0];
    const label = document.getElementById('label').value;

    if (!file) {
      alert('Please select signature file');
      return;
    }

    if (!label) {
      alert('Please enter your label');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener('load', async () => {
      const solution = reader.result.split(',')[1];
      try {
        const params = { label, token, solution };
        const result = await api.operators.authenticate(params);
        if (!result.success) {
          return void console.error('Invalid signature');
        }
        location.replace('/');
      } catch (error) {
        console.error(error);
      }
    });
  });
};

main();
