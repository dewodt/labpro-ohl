// Prevent default form submission
document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('login-form');
  loginForm?.addEventListener('submit', handleSubmitLogin);
});

async function handleSubmitLogin(e: Event) {
  e.preventDefault();

  if (!validateLoginForm()) {
    return;
  }

  await submitLoginForm();
}

function validateLoginForm(): boolean {
  const usernameField = document.getElementById('username') as HTMLInputElement;
  const username = usernameField.value;
  const passwordField = document.getElementById('password') as HTMLInputElement;
  const password = passwordField.value;

  // Validate username
  if (!username) {
    alert('Username is required');
    return false;
  }

  // Validate password
  if (!password) {
    alert('Password is required');
    return false;
  }

  return true;
}

async function submitLoginForm() {
  const usernameField = document.getElementById('username') as HTMLInputElement;
  const passwordField = document.getElementById('password') as HTMLInputElement;
  const loginButton = document.getElementById(
    'login-button',
  ) as HTMLButtonElement;

  // Disable form submission
  loginButton.disabled = true;
  usernameField.disabled = true;
  passwordField.disabled = true;

  // Req body
  const username = usernameField.value;
  const password = passwordField.value;
  const body = {
    username,
    password,
  };

  // Send request to server
  const response = await fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const responseBody = await response.json();

  // Enable form submission
  loginButton.disabled = false;
  usernameField.disabled = false;
  passwordField.disabled = false;

  if (!response.ok) {
    alert('Login failed: ' + responseBody.message);
    return;
  }

  alert('Login successful');
  window.location.href = '/dashboard';
}
