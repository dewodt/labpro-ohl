class LoginFormManager {
  private loginForm: HTMLFormElement;
  private usernameField: HTMLInputElement;
  private passwordField: HTMLInputElement;
  private loginButton: HTMLButtonElement;

  constructor() {
    this.loginForm = document.getElementById('login-form') as HTMLFormElement;

    this.usernameField = document.getElementById(
      'username',
    ) as HTMLInputElement;

    this.passwordField = document.getElementById(
      'password',
    ) as HTMLInputElement;

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
    this.loginForm.addEventListener(
      'submit',
      this.handleSubmitLogin.bind(this),
    );
  }

  private async handleSubmitLogin(e: Event): Promise<void> {
    e.preventDefault();
    if (!this.validateLoginForm()) {
      return;
    }
    await this.submitLoginForm();
  }

  private validateLoginForm(): boolean {
    const username = this.usernameField.value;
    const password = this.passwordField.value;

    if (!username) {
      alert('Username is required');
      return false;
    }

    if (!password) {
      alert('Password is required');
      return false;
    }

    return true;
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

      alert('Login successful');
      window.location.href = '/my-movies';
    } catch (error) {
      alert(
        'Login failed: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      );
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
