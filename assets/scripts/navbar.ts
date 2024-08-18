class NavbarManager {
  private bodyElement: HTMLBodyElement;
  private sideBarBlurElement: HTMLDivElement;
  private sideBarContainerElement: HTMLDivElement;
  private sidebarOpenButton: HTMLButtonElement;
  private sidebarCloseButton: HTMLButtonElement;
  private signOutButton: HTMLButtonElement;

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

    this.init();
  }

  private init() {
    document.addEventListener('DOMContentLoaded', () => {
      // Navbar active links
      this.setupActiveLinksStyle();

      // Event listener
      this.setupEventListeners();
    });
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
    this.signOutButton.addEventListener('click', () => {
      this.handleSignOut();
    });
  }

  private async handleSignOut() {
    // Disable logout button
    this.signOutButton.disabled = true;

    // Call logout API
    const response = await fetch('/logout', {
      method: 'GET',
    });

    if (!response.ok) {
      // Show error message
      alert('Failed to sign out');
      this.signOutButton.disabled = false;
      return;
    }

    // Redirect to login page
    window.location.reload();
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
