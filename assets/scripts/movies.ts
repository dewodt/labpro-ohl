class MovieSearchManager {
  private searchInput: HTMLInputElement;
  private searchSubmitButton: HTMLButtonElement;
  private searchResetButton: HTMLButtonElement;

  constructor() {
    this.searchInput = document.getElementById(
      'search-input',
    ) as HTMLInputElement;

    this.searchSubmitButton = document.getElementById(
      'search-submit-button',
    ) as HTMLButtonElement;

    this.searchResetButton = document.getElementById(
      'search-reset-button',
    ) as HTMLButtonElement;

    this.init();
  }

  // Init
  private init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.setupInitialSearchValue();
      this.setupEventListeners();
    });
  }

  // Initial search value
  private setupInitialSearchValue() {
    // Get search
    const searchParams = new URLSearchParams(window.location.search);
    const searchQuery = searchParams.get('search');

    // Set search input value
    if (searchQuery) {
      this.searchInput.value = searchQuery;
    }
  }

  // Setup listeners
  private setupEventListeners() {
    // Enter in input
    this.searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.handleSubmitSearch();
      }
    });

    // Search submit
    this.searchSubmitButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.handleSubmitSearch();
    });

    // Search reset
    this.searchResetButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.handleResetSearch();
    });
  }

  private handleSubmitSearch(): void {
    const searchQuery = this.searchInput.value;
    if (!searchQuery) {
      return;
    }

    const searchParams = new URLSearchParams(window.location.search);
    searchParams.delete('page');
    searchParams.delete('limit');
    searchParams.set('search', searchQuery);
    window.location.href = `/movies?${searchParams.toString()}`;
  }

  private handleResetSearch(): void {
    window.location.href = '/movies';
  }
}

// Init
new MovieSearchManager();
