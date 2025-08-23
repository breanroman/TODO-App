// quotes.js
// Fetches a motivational quote from an external API and displays it within the app

/**
 * Loads a random motivational quote from public API and updates DOM element with id 'motivational-quote'.
 * Displays a personal growth style message on success or failure.
 */
export async function loadMotivationalQuote() {
  const quoteElem = document.getElementById('motivational-quote');

  try {
    // Using a free public quotes API from type.fit
    const response = await fetch('https://type.fit/api/quotes');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const quotes = await response.json();

    // Select a random quote from the fetched list
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];

    const text = quote.text || 'Be your own sunshine today!';
    const author = quote.author || 'Unknown';

    // Display quote in a personal growth friendly format
    quoteElem.textContent = `"${text}" — ${author}`;
  } catch (error) {
    console.error('Failed to load motivational quote:', error);
    // Fallback message
    quoteElem.textContent = 'Keep going! Your growth matters.';
  }
}
