let config;

// Fetch the config.json file
fetch('config.json')
  .then(response => response.json())
  .then(data => {
    config = data;
  })
  .catch(error => {
    console.error('Error fetching config:', error);
  });

// Function to check the password and redirect to the main page if correct
function checkPassword() {
    const password = document.getElementById('password').value;
    if (password === config.password) {
        const redirectUrl = atob('bWFpbi5odG1s');  // Base64 encoded 'main.html'
        window.location.href = redirectUrl;
    } else {
        alert('Incorrect password');
    }
}

// Event listener for password form submission
document.getElementById('password-prompt').addEventListener('submit', (event) => {
    event.preventDefault();
    checkPassword();
});
