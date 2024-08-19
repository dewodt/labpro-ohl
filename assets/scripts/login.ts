class LoginFormManager {
  private loginForm: HTMLFormElement;

  private usernameOrEmailField: HTMLInputElement;
  private usernameOrEmailLabel: HTMLLabelElement;
  private usernameOrEmailMessage: HTMLParagraphElement;

  private passwordField: HTMLInputElement;
  private passwordLabel: HTMLLabelElement;
  private passwordMessage: HTMLParagraphElement;

  private loginButton: HTMLButtonElement;

  constructor() {
    this.loginForm = document.getElementById('login-form') as HTMLFormElement;

    this.usernameOrEmailField = document.getElementById(
      'username-or-email',
    ) as HTMLInputElement;
    this.usernameOrEmailLabel = document.getElementById(
      'username-or-email-label',
    ) as HTMLLabelElement;
    this.usernameOrEmailMessage = document.getElementById(
      'username-or-email-message',
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

    this.loginButton = document.getElementById(
      'login-button',
    ) as HTMLButtonElement;

    this.init();
  }

  private init(): void {
    document.addEventListener('DOMContentLoaded', () => {
      this.setupEventListeners();
    });
  }

  private setupEventListeners(): void {
    // Submit
    this.loginForm.addEventListener(
      'submit',
      this.handleSubmitLogin.bind(this),
    );

    // Validate username on input event and on blur event
    this.usernameOrEmailField.addEventListener('input', () => {
      this.validateUsername();
    });
    this.usernameOrEmailField.addEventListener('blur', () => {
      this.validateUsername();
    });

    // Validate password on input event and on blur event
    this.passwordField.addEventListener('input', () => {
      this.validatePassword();
    });
    this.passwordField.addEventListener('blur', () => {
      this.validatePassword();
    });
  }

  private async handleSubmitLogin(e: Event): Promise<void> {
    e.preventDefault();

    if (!this.validateLoginForm()) {
      return;
    }

    await this.submitLoginForm();
  }

  private validateLoginForm(): boolean {
    const isValidUsername = this.validateUsername();
    const isValidPassword = this.validatePassword();

    return isValidUsername && isValidPassword;
  }

  private validateUsername() {
    if (!this.usernameOrEmailField.value) {
      this.setUsernameOrEmailFieldError('Username is required');

      return false;
    } else {
      this.setUsernameOrEmailFieldError(undefined);

      return true;
    }
  }

  private validatePassword() {
    if (!this.passwordField.value) {
      this.setPasswordFieldError('Password is required');

      return false;
    } else {
      this.setPasswordFieldError(undefined);

      return true;
    }
  }

  private setUsernameOrEmailFieldError(error?: string) {
    if (error) {
      this.usernameOrEmailLabel.classList.add('text-destructive');
      this.usernameOrEmailMessage.textContent = error;
    } else {
      this.usernameOrEmailLabel.classList.remove('text-destructive');
      this.usernameOrEmailMessage.textContent = '';
    }
  }

  private setPasswordFieldError(error?: string) {
    if (error) {
      this.passwordLabel.classList.add('text-destructive');
      this.passwordMessage.textContent = error;
    } else {
      this.passwordLabel.classList.remove('text-destructive');
      this.passwordMessage.textContent = '';
    }
  }

  private async submitLoginForm(): Promise<void> {
    this.setFormDisabled(true);

    const username = this.usernameOrEmailField.value; // Spesifikasi login pakai key "username" atau gak FE Admin tdk bisa connect.
    const password = this.passwordField.value;
    const body = { username, password };

    try {
      const response = await fetch('/login', {
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

      window.location.href = '/my-movies';
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.setUsernameOrEmailFieldError(message);
      this.setPasswordFieldError(message);
    } finally {
      this.setFormDisabled(false);
    }
  }

  private setFormDisabled(disabled: boolean): void {
    this.loginButton.disabled = disabled;
    this.usernameOrEmailField.disabled = disabled;
    this.passwordField.disabled = disabled;
  }
}

// Usage
new LoginFormManager();
