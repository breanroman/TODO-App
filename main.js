// main.js
import { loadMessages } from './messages.js';
import { 
  generateDailyTasksIfNeeded,
  generateWeeklyTasksIfNeeded,
  resetWeeklyTasksIfNeeded
} from './tasks.js';
import { setupUI, renderTasks } from './ui.js';
import { setupRouting } from './routing.js';
import { loadMotivationalQuote } from './quotes.js';

async function main() {
  await loadMessages();

  generateDailyTasksIfNeeded();
  generateWeeklyTasksIfNeeded();
  resetWeeklyTasksIfNeeded();

  renderTasks();

  loadMotivationalQuote();

  setupUI();

  setupRouting();
}

main();
