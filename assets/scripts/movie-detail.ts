class MovieDetailManager {
  private buyMovieButton: HTMLButtonElement;
  private moviePriceSpan: HTMLSpanElement;
  private balanceSpan: HTMLSpanElement;

  private movieId: string;
  private balance: number;
  private moviePrice: number;

  constructor() {
    this.buyMovieButton = document.getElementById(
      'buy-movie-button',
    ) as HTMLButtonElement;
    this.moviePriceSpan = document.getElementById(
      'movie-price-span',
    ) as HTMLSpanElement;
    this.balanceSpan = document.getElementById(
      'balance-amount-span',
    ) as HTMLSpanElement;

    // Get movie id from URL
    const pathname = window.location.pathname;
    const movieId = pathname.split('movies/')[1];
    this.movieId = movieId;

    // Get balance
    const balance = this.balanceSpan.textContent!;
    this.balance = parseInt(balance, 10);

    // Get movie price
    const moviePrice = this.moviePriceSpan.textContent!;
    this.moviePrice = parseInt(moviePrice, 10);

    this.init();
  }

  // Init
  private init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.setupEventListeners();
    });
  }

  // Setup listeners
  private setupEventListeners() {
    // Buy button
    this.buyMovieButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.handleBuyMovie();
    });
  }

  // Buy movie
  private async handleBuyMovie() {
    // Disable buy button
    this.disableBuyButton(true);

    // Check if user has enough balance
    if (this.balance < this.moviePrice) {
      alert('You do not have enough balance to buy this movie.');
      this.disableBuyButton(false);
      return;
    }

    // Buy movie
    const response = await fetch(`/films/${this.movieId}/buy`, {
      method: 'POST',
    });

    const responseBody = await response.json();

    this.disableBuyButton(false);

    if (!response.ok) {
      alert(responseBody.message);
      return;
    }

    alert('Movie successfully bought!');

    // Refresh page
    window.location.reload();
  }

  private disableBuyButton(disabled: boolean) {
    this.buyMovieButton.disabled = disabled;
  }
}

new MovieDetailManager();
