// Prevent default form submission
document.addEventListener('DOMContentLoaded', function () {
  const registerForm = document.getElementById('register-form');
  registerForm?.addEventListener('submit', handleSubmitRegister);
});

async function handleSubmitRegister(e: Event) {
  e.preventDefault();

  if (!validateRegisterForm()) {
    return;
  }

  await submitRegisterForm();
}

function validateRegisterForm(): boolean {
  const usernameField = document.getElementById('username') as HTMLInputElement;
  const username = usernameField.value;

  const emailField = document.getElementById('email') as HTMLInputElement;
  const email = emailField.value;

  const fullNameField = document.getElementById('name') as HTMLInputElement;
  const fullName = fullNameField.value;

  const passwordField = document.getElementById('password') as HTMLInputElement;
  const password = passwordField.value;

  // Validate username
  if (!username) {
    alert('Username is required');
    return false;
  } else if (username.length > 255) {
    alert('Username must be at most 255 characters long');
    return false;
  }

  // Validate email
  if (!email) {
    alert('Email is required');
    return false;
  } else if (email.length > 255) {
    alert('Email must be at most 255 characters long');
    return false;
  }

  // Validate full name
  if (!fullName) {
    alert('Full name is required');
    return false;
  } else if (fullName.length > 255) {
    alert('Full name must be at most 255 characters long');
    return false;
  }

  // Validate password
  if (!password) {
    alert('Password is required');
    return false;
  } else if (password.length < 8) {
    alert('Password must be at least 8 characters long');
    return false;
  } else if (password.length > 20) {
    alert('Password must be at most 20 characters long');
    return false;
  } else if (!/(?=.*[a-z])/.test(password)) {
    alert('Password must contain a lowercase letter');
    return false;
  } else if (!/(?=.*[A-Z])/.test(password)) {
    alert('Password must contain an uppercase letter');
    return false;
  } else if (!/(?=.*[0-9])/.test(password)) {
    alert('Password must contain a number');
    return false;
  } else if (!/(?=.*[!@#$%^&*])/.test(password)) {
    alert('Password must contain a special character');
    return false;
  }

  return true;
}

async function submitRegisterForm() {
  const emailField = document.getElementById('email') as HTMLInputElement;
  const nameField = document.getElementById('name') as HTMLInputElement;
  const usernameField = document.getElementById('username') as HTMLInputElement;
  const passwordField = document.getElementById('password') as HTMLInputElement;
  const registerButton = document.getElementById(
    'register-button',
  ) as HTMLButtonElement;

  // Disable form submission
  registerButton.disabled = true;
  emailField.disabled = true;
  nameField.disabled = true;
  usernameField.disabled = true;
  passwordField.disabled = true;

  // Req body
  const email = emailField.value;
  const name = nameField.value;
  const username = usernameField.value;
  const password = passwordField.value;
  const body = {
    username,
    email,
    name,
    password,
  };

  // Send request to server
  const response = await fetch('/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const responseBody = await response.json();

  // Enable form submission
  registerButton.disabled = false;
  usernameField.disabled = false;
  passwordField.disabled = false;
  emailField.disabled = false;
  nameField.disabled = false;

  if (!response.ok) {
    alert('Register failed: ' + responseBody.message);
    return;
  }

  alert('Register successful');
  window.location.href = '/auth/login';
}
