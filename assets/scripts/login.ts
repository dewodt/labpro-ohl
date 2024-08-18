class LoginFormManager {
  private loginForm: HTMLFormElement;

  private usernameField: HTMLInputElement;
  private usernameLabel: HTMLLabelElement;
  private usernameMessage: HTMLParagraphElement;

  private passwordField: HTMLInputElement;
  private passwordLabel: HTMLLabelElement;
  private passwordMessage: HTMLParagraphElement;

  private loginButton: HTMLButtonElement;

  constructor() {
    this.loginForm = document.getElementById('login-form') as HTMLFormElement;

    this.usernameField = document.getElementById(
      'username',
    ) as HTMLInputElement;
    this.usernameLabel = document.getElementById(
      'username-label',
    ) as HTMLLabelElement;
    this.usernameMessage = document.getElementById(
      'username-message',
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
    this.usernameField.addEventListener('input', () => {
      this.validateUsername();
    });
    this.usernameField.addEventListener('blur', () => {
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
    if (!this.usernameField.value) {
      this.setUsernameFieldError('Username is required');

      return false;
    } else {
      this.setUsernameFieldError(undefined);

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

  private setUsernameFieldError(error?: string) {
    if (error) {
      this.usernameLabel.classList.add('text-destructive');
      this.usernameMessage.textContent = error;
    } else {
      this.usernameLabel.classList.remove('text-destructive');
      this.usernameMessage.textContent = '';
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

    const username = this.usernameField.value;
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
      this.setUsernameFieldError(message);
      this.setPasswordFieldError(message);
    } finally {
      this.setFormDisabled(false);
    }
  }

  private setFormDisabled(disabled: boolean): void {
    this.loginButton.disabled = disabled;
    this.usernameField.disabled = disabled;
    this.passwordField.disabled = disabled;
  }
}

// Usage
new LoginFormManager();
