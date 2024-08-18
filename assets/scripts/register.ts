class RegisterFormManager {
  private registerForm: HTMLFormElement;

  private usernameField: HTMLInputElement;
  private usernameLabel: HTMLLabelElement;
  private usernameMessage: HTMLParagraphElement;

  private emailField: HTMLInputElement;
  private emailLabel: HTMLLabelElement;
  private emailMessage: HTMLParagraphElement;

  private nameField: HTMLInputElement;
  private nameLabel: HTMLLabelElement;
  private nameMessage: HTMLParagraphElement;

  private passwordField: HTMLInputElement;
  private passwordLabel: HTMLLabelElement;
  private passwordMessage: HTMLParagraphElement;

  private registerButton: HTMLButtonElement;

  constructor() {
    this.registerForm = document.getElementById(
      'register-form',
    ) as HTMLFormElement;

    this.usernameField = document.getElementById(
      'username',
    ) as HTMLInputElement;
    this.usernameLabel = document.getElementById(
      'username-label',
    ) as HTMLLabelElement;
    this.usernameMessage = document.getElementById(
      'username-message',
    ) as HTMLParagraphElement;

    this.emailField = document.getElementById('email') as HTMLInputElement;
    this.emailLabel = document.getElementById(
      'email-label',
    ) as HTMLLabelElement;
    this.emailMessage = document.getElementById(
      'email-message',
    ) as HTMLParagraphElement;

    this.nameField = document.getElementById('name') as HTMLInputElement;
    this.nameLabel = document.getElementById('name-label') as HTMLLabelElement;
    this.nameMessage = document.getElementById(
      'name-message',
    ) as HTMLParagraphElement;

    this.passwordField = document.getElementById(
      'password',
    ) as HTMLInputElement;
    this.passwordLabel = document.getElementById(
      'password-label',
    ) as HTMLLabelElement;
    this.passwordMessage = document.getElementById(
      'password-message',
    ) as HTMLParagraphElement;

    this.registerButton = document.getElementById(
      'register-button',
    ) as HTMLButtonElement;

    this.init();
  }

  private init(): void {
    // Submit
    document.addEventListener('DOMContentLoaded', () => {
      this.setupEventListeners();
    });
  }

  private setupEventListeners(): void {
    // Submit
    this.registerForm.addEventListener(
      'submit',
      this.handleSubmitRegister.bind(this),
    );

    // Validate username on input event and on blur event
    this.usernameField.addEventListener('input', () => {
      this.validateUsername();
    });
    this.usernameField.addEventListener('blur', () => {
      this.validateUsername();
    });

    // Validate email on input event and on blur event
    this.emailField.addEventListener('input', () => {
      this.validateEmail();
    });
    this.emailField.addEventListener('blur', () => {
      this.validateEmail();
    });

    // Validate name on input event and on blur event
    this.nameField.addEventListener('input', () => {
      this.validateFullName();
    });
    this.nameField.addEventListener('blur', () => {
      this.validateFullName();
    });

    // Validate password on input event and on blur event
    this.passwordField.addEventListener('input', () => {
      this.validatePassword();
    });
    this.passwordField.addEventListener('blur', () => {
      this.validatePassword();
    });
  }

  private async handleSubmitRegister(e: Event): Promise<void> {
    e.preventDefault();

    if (!this.validateRegisterForm()) {
      return;
    }

    await this.submitRegisterForm();
  }

  private validateRegisterForm(): boolean {
    const isUsernameValid = this.validateUsername();
    const isEmailValid = this.validateEmail();
    const isNameValid = this.validateFullName();
    const isPasswordValid = this.validatePassword();

    return isUsernameValid && isEmailValid && isNameValid && isPasswordValid;
  }

  private validateUsername(): boolean {
    const username = this.usernameField.value;

    if (!username) {
      this.setUsernameFieldError('Username is required');

      return false;
    } else if (username.length > 255) {
      this.setUsernameFieldError(
        'Username must be at most 255 characters long',
      );

      return false;
    }

    this.setUsernameFieldError(undefined);
    return true;
  }

  private validateEmail(): boolean {
    const email = this.emailField.value;
    const emailRegex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;

    if (!email) {
      this.setEmailFieldError('Email is required');

      return false;
    } else if (email.length > 255) {
      this.setEmailFieldError('Email must be at most 255 characters long');

      return false;
    } else if (!emailRegex.test(email)) {
      this.setEmailFieldError('Invalid email address');

      return false;
    }

    this.setEmailFieldError(undefined);
    return true;
  }

  private validateFullName(): boolean {
    const fullName = this.nameField.value;

    if (!fullName) {
      this.setNameFieldError('Full name is required');

      return false;
    } else if (fullName.length > 255) {
      this.setNameFieldError('Full name must be at most 255 characters long');

      return false;
    }

    this.setNameFieldError(undefined);
    return true;
  }

  private validatePassword(): boolean {
    const password = this.passwordField.value;

    if (!password) {
      this.setPasswordFieldError('Password is required');

      return false;
    } else if (password.length < 8) {
      this.setPasswordFieldError('Password must be at least 8 characters long');

      return false;
    } else if (password.length > 20) {
      this.setPasswordFieldError('Password must be at most 20 characters long');

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
        this.setPasswordFieldError(check.message);

        return false;
      }
    }

    this.setPasswordFieldError(undefined);
    return true;
  }

  private setUsernameFieldError(error?: string): void {
    if (error) {
      this.usernameLabel.classList.add('text-destructive');
      this.usernameMessage.textContent = error;
    } else {
      this.usernameLabel.classList.remove('text-destructive');
      this.usernameMessage.textContent = '';
    }
  }

  private setEmailFieldError(error?: string): void {
    if (error) {
      this.emailLabel.classList.add('text-destructive');
      this.emailMessage.textContent = error;
    } else {
      this.emailLabel.classList.remove('text-destructive');
      this.emailMessage.textContent = '';
    }
  }

  private setNameFieldError(error?: string): void {
    if (error) {
      this.nameLabel.classList.add('text-destructive');
      this.nameMessage.textContent = error;
    } else {
      this.nameLabel.classList.remove('text-destructive');
      this.nameMessage.textContent = '';
    }
  }

  private setPasswordFieldError(error?: string): void {
    if (error) {
      this.passwordLabel.classList.add('text-destructive');
      this.passwordMessage.textContent = error;
    } else {
      this.passwordLabel.classList.remove('text-destructive');
      this.passwordMessage.textContent = '';
    }
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

      window.location.href = '/auth/login';
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.toLocaleLowerCase().includes('username')
      ) {
        // username field error
        this.setUsernameFieldError(error.message);
      } else if (
        error instanceof Error &&
        error.message.toLocaleLowerCase().includes('email')
      ) {
        // email field error
        this.setEmailFieldError(error.message);
      } else {
        this.setUsernameFieldError(error.message);
        this.setEmailFieldError(error.message);
        this.setNameFieldError(error.message);
        this.setPasswordFieldError(error.message);
      }
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
