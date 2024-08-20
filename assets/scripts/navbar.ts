class NavbarManager {
  private bodyElement: HTMLBodyElement;
  private sideBarBlurElement: HTMLDivElement;
  private sideBarContainerElement: HTMLDivElement;
  private sidebarOpenButton: HTMLButtonElement;
  private sidebarCloseButton: HTMLButtonElement;
  private signOutButton: HTMLButtonElement | null;

  private mobileThemeButton: HTMLButtonElement;
  private desktopThemeButton: HTMLButtonElement;

  constructor() {
    this.bodyElement = document.querySelector('body') as HTMLBodyElement;

    this.sideBarBlurElement = document.getElementById(
      'sidebar-blur',
    ) as HTMLDivElement;

    this.sideBarContainerElement = document.getElementById(
      'sidebar-container',
    ) as HTMLDivElement;

    this.sidebarOpenButton = document.getElementById(
      'sidebar-open-button',
    ) as HTMLButtonElement;

    this.sidebarCloseButton = document.getElementById(
      'sidebar-close-button',
    ) as HTMLButtonElement;

    this.signOutButton = document.getElementById(
      'sign-out-button',
    ) as HTMLButtonElement;

    this.mobileThemeButton = document.getElementById(
      'mobile-theme-button',
    ) as HTMLButtonElement;

    this.desktopThemeButton = document.getElementById(
      'desktop-theme-button',
    ) as HTMLButtonElement;

    this.init();
  }

  private init() {
    document.addEventListener('DOMContentLoaded', () => {
      // Navbar active links
      this.setupActiveLinksStyle();

      // Theme buttons
      this.setupThemeButtons();

      // Event listener
      this.setupEventListeners();
    });
  }

  private setupThemeButtons() {
    // Get from local storage
    const theme = localStorage.getItem('theme') as 'light' | 'dark' | null;

    if (!theme) {
      // Set default theme
      this.handleChangeThemeTo('light');
    } else {
      // Set available theme
      this.handleChangeThemeTo(theme);
    }

    // Listen to theme change
    this.mobileThemeButton.addEventListener('click', () => {
      this.handleToggleTheme();
    });
    this.desktopThemeButton.addEventListener('click', () => {
      this.handleToggleTheme();
    });
  }

  private handleToggleTheme() {
    const currentTheme = localStorage.getItem('theme') as 'light' | 'dark';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    // Set to document element
    this.handleChangeThemeTo(newTheme);
  }

  private handleChangeThemeTo(newTheme: 'light' | 'dark') {
    if (newTheme === 'dark') {
      // Set to document element
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');

      // Update button icon
      this.mobileThemeButton.innerHTML = `
        <svg class='size-6' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon-star"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9"/><path d="M20 3v4"/><path d="M22 5h-4"/></svg>
      `;
      this.desktopThemeButton.innerHTML = `
        <svg class='size-6' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon-star"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9"/><path d="M20 3v4"/><path d="M22 5h-4"/></svg>
      `;
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');

      // Update button icon
      this.mobileThemeButton.innerHTML = `
        <svg class="size-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
      `;
      this.desktopThemeButton.innerHTML = `
        <svg class="size-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
      `;
    }

    // Set to local storage
    localStorage.setItem('theme', newTheme);
  }

  private setupActiveLinksStyle() {
    const currentPath = window.location.pathname;

    const linksElement = Array.from(
      document.querySelectorAll('#navbar-links-ul li a'),
    ).filter((linkElement) => !linkElement.querySelector('button'));

    linksElement.forEach((linkElement) => {
      const href = linkElement.getAttribute('href')!;

      // if (currentPath.startsWith(href)) {
      if (currentPath === href) {
        linkElement.classList.remove('font-medium', 'hover:text-primary');
        linkElement.classList.add('text-primary', 'font-semibold');
      }
    });
  }

  private setupEventListeners() {
    // Open button (menu button)
    this.sidebarOpenButton.addEventListener('click', () => {
      this.onOpenSidebar();
    });

    // Close button
    this.sidebarCloseButton.addEventListener('click', () => {
      this.onCloseSidebar();
    });

    // Sidebar blur
    this.sideBarBlurElement.addEventListener('click', () => {
      this.onCloseSidebar();
    });

    // Sign out button
    if (this.signOutButton) {
      this.signOutButton.addEventListener('click', () => {
        this.handleSignOut();
      });
    }
  }

  private async handleSignOut() {
    // Disable logout button
    this.signOutButton!.disabled = true;

    // Call logout API
    try {
      const response = await fetch('/logout', {
        method: 'GET',
      });

      const responseBody = await response.json();

      if (!response.ok) {
        throw new Error(responseBody.message);
      }

      // Reload
      window.location.reload();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      this.signOutButton!.disabled = false;
    }
  }

  private onOpenSidebar() {
    this.bodyElement.classList.add('overflow-hidden');

    this.sideBarBlurElement.classList.remove('hidden');
    this.sideBarBlurElement.classList.add('fixed');

    this.sideBarContainerElement.classList.remove('translate-x-0');
    this.sideBarContainerElement.classList.add('-translate-x-[200px]');
  }

  private onCloseSidebar() {
    this.sideBarContainerElement.classList.remove('-translate-x-[200px]');
    this.sideBarContainerElement.classList.add('translate-x-0');

    // Delay 50ms
    setTimeout(() => {
      this.sideBarBlurElement.classList.remove('fixed');
      this.sideBarBlurElement.classList.add('hidden');
    }, 100);

    this.bodyElement.classList.remove('overflow-hidden');
  }
}

new NavbarManager();
