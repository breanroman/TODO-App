// messages.js
// Handles loading daily outreach messages from external JSON file and providing them to other modules

// Object to store outreach messages after loading
let dailyOutreachMessages = {};

/**
 * Loads daily outreach messages from 'messages.json' file asynchronously.
 * Should be called once during app initialization.
 * @returns {Promise<void>}
 */
export async function loadMessages() {
  try {
    const response = await fetch('messages.json');
    if (!response.ok) {
      console.warn('Failed to load messages.json, continuing with empty messages.');
      dailyOutreachMessages = {};
      return;
    }
    dailyOutreachMessages = await response.json();
  } catch (error) {
    console.error('Error loading messages.json:', error);
    dailyOutreachMessages = {};
  }
}

/**
 * Gets the outreach messages for a given date string (YYYY-MM-DD).
 * Returns an array of messages or empty array if none exist.
 * @param {string} dateStr
 * @returns {string[]}
 */
export function getMessagesForDate(dateStr) {
  return dailyOutreachMessages[dateStr] || [];
}
