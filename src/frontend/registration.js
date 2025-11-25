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

  const file = fileInput.files[0];
  const username = document.getElementById('username').value;

  if (!file) {
    alert('Select file with publick key');
    return;
  }

  if (!username) {
    alert('Enter username');
    return;
  }

  const reader = new FileReader();
  reader.addEventListener('load', () => {
    console.log('Publick key: ', reader.result);
    console.log('Username: ', username);
  });
  reader.readAsText(file);
});
