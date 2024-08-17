class RegisterFormManager {
  private registerForm: HTMLFormElement;
  private usernameField: HTMLInputElement;
  private emailField: HTMLInputElement;
  private nameField: HTMLInputElement;
  private passwordField: HTMLInputElement;
  private registerButton: HTMLButtonElement;

  constructor() {
    this.registerForm = document.getElementById(
      'register-form',
    ) as HTMLFormElement;

    this.usernameField = document.getElementById(
      'username',
    ) as HTMLInputElement;

    this.emailField = document.getElementById('email') as HTMLInputElement;

    this.nameField = document.getElementById('name') as HTMLInputElement;

    this.passwordField = document.getElementById(
      'password',
    ) as HTMLInputElement;

    this.registerButton = document.getElementById(
      'register-button',
    ) as HTMLButtonElement;

    this.init();
  }

  private init(): void {
    document.addEventListener('DOMContentLoaded', () => {
      this.setupEventListeners();
    });
  }

  private setupEventListeners(): void {
    this.registerForm.addEventListener(
      'submit',
      this.handleSubmitRegister.bind(this),
    );
  }

  private async handleSubmitRegister(e: Event): Promise<void> {
    e.preventDefault();

    if (!this.validateRegisterForm()) {
      return;
    }

    await this.submitRegisterForm();
  }

  private validateRegisterForm(): boolean {
    return (
      this.validateUsername() &&
      this.validateEmail() &&
      this.validateFullName() &&
      this.validatePassword()
    );
  }

  private validateUsername(): boolean {
    const username = this.usernameField.value;
    if (!username) {
      alert('Username is required');
      return false;
    }
    if (username.length > 255) {
      alert('Username must be at most 255 characters long');
      return false;
    }
    // Add more username-specific validations here if needed
    return true;
  }

  private validateEmail(): boolean {
    const email = this.emailField.value;
    if (!email) {
      alert('Email is required');
      return false;
    }
    if (email.length > 255) {
      alert('Email must be at most 255 characters long');
      return false;
    }
    // Add more email-specific validations here if needed
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Invalid email format');
      return false;
    }
    return true;
  }

  private validateFullName(): boolean {
    const fullName = this.nameField.value;
    if (!fullName) {
      alert('Full name is required');
      return false;
    }
    if (fullName.length > 255) {
      alert('Full name must be at most 255 characters long');
      return false;
    }
    // Add more full name-specific validations here if needed
    return true;
  }

  private validatePassword(): boolean {
    const password = this.passwordField.value;
    if (!password) {
      alert('Password is required');
      return false;
    }
    if (password.length < 8) {
      alert('Password must be at least 8 characters long');
      return false;
    }
    if (password.length > 20) {
      alert('Password must be at most 20 characters long');
      return false;
    }

    const passwordChecks = [
      {
        regex: /(?=.*[a-z])/,
        message: 'Password must contain a lowercase letter',
      },
      {
        regex: /(?=.*[A-Z])/,
        message: 'Password must contain an uppercase letter',
      },
      { regex: /(?=.*[0-9])/, message: 'Password must contain a number' },
      {
        regex: /(?=.*[!@#$%^&*])/,
        message: 'Password must contain a special character',
      },
    ];

    for (const check of passwordChecks) {
      if (!check.regex.test(password)) {
        alert(check.message);
        return false;
      }
    }

    return true;
  }

  private async submitRegisterForm(): Promise<void> {
    this.setFormDisabled(true);

    const body = {
      username: this.usernameField.value,
      email: this.emailField.value,
      name: this.nameField.value,
      password: this.passwordField.value,
    };

    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const responseBody = await response.json();

      if (!response.ok) {
        throw new Error(responseBody.message);
      }

      alert('Register successful');
      window.location.href = '/auth/login';
    } catch (error) {
      alert(
        'Register failed: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      );
    } finally {
      this.setFormDisabled(false);
    }
  }

  private setFormDisabled(disabled: boolean): void {
    this.registerButton.disabled = disabled;
    this.usernameField.disabled = disabled;
    this.emailField.disabled = disabled;
    this.nameField.disabled = disabled;
    this.passwordField.disabled = disabled;
  }
}

// Usage
new RegisterFormManager();
