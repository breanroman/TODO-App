// tasks.js
// Manages task logic, including creation, storage, retrieval, and progress tracking

import { getMessagesForDate } from './messages.js';

// Default daily and weekly task templates
const DAILY_TASKS = ["Music", "Art", "Journaling", "Self-Compassion", "Exercise"];
const WEEKLY_TASKS = ["Disc Golf", "Time with Dani", "Swim", "One Beer"];

// Helper to get today's date string in YYYY-MM-DD format
function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

// Helper to get last Monday (to reset weekly tasks)
function getLastMondayStr() {
  const now = new Date();
  const day = now.getDay();
  const diff = (day === 0 ? 6 : day - 1); // Monday = 1, Sunday = 0
  const lastMonday = new Date(now);
  lastMonday.setDate(now.getDate() - diff);
  return lastMonday.toISOString().split('T')[0];
}

// Load all tasks from localStorage
export function loadTasksFromStorage() {
  return JSON.parse(localStorage.getItem('tasks')) || [];
}

// Save tasks array to storage
function saveTasksToStorage(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

/**
 * Saves a new task to localStorage
 * @param {object} taskObj 
 */
export function saveTaskToStorage(taskObj) {
  const tasks = loadTasksFromStorage();
  tasks.push(taskObj);
  saveTasksToStorage(tasks);
}

/**
 * Updates an existing task in localStorage
 * @param {object} updatedTask 
 */
export function updateTaskInStorage(updatedTask) {
  const tasks = loadTasksFromStorage();
  const index = tasks.findIndex(t => t.text === updatedTask.text && t.type === updatedTask.type);
  if (index !== -1) {
    tasks[index] = updatedTask;
    saveTasksToStorage(tasks);
  }
}

/**
 * Removes a task from localStorage
 * @param {object} taskToDelete 
 */
export function removeTaskFromStorage(taskToDelete) {
  let tasks = loadTasksFromStorage();
  tasks = tasks.filter(t => !(t.text === taskToDelete.text && t.type === taskToDelete.type));
  saveTasksToStorage(tasks);
}

/**
 * Generates daily tasks and outreach messages if needed for a new day
 */
export function generateDailyTasksIfNeeded() {
  const lastGenerated = localStorage.getItem('lastGeneratedDate');
  const todayStr = getTodayStr();

  if (lastGenerated !== todayStr) {
    const tasks = loadTasksFromStorage();

    // Add missing daily tasks
    DAILY_TASKS.forEach(taskText => {
      if (!tasks.some(t => t.text === taskText && t.type === 'daily')) {
        tasks.push({ text: taskText, type: 'daily', completed: false, completedAt: null });
      }
    });

    // Add outreach messages for today from messages.json
    const messages = getMessagesForDate(todayStr);
    if (messages.length > 0) {
      tasks.push({
        text: "Daily Text Outreaches:<br>" + messages.map(msg => `• ${msg}`).join("<br>"),
        type: "daily",
        completed: false,
        completedAt: null
      });
    }

    saveTasksToStorage(tasks);
    localStorage.setItem('lastGeneratedDate', todayStr);
  }
}

/**
 * Generates weekly tasks if not generated this week
 */
export function generateWeeklyTasksIfNeeded() {
  const lastWeeklyGenerated = localStorage.getItem('lastWeeklyGeneratedDate');
  const lastMonday = getLastMondayStr();

  if (lastWeeklyGenerated !== lastMonday) {
    const tasks = loadTasksFromStorage();

    WEEKLY_TASKS.forEach(taskText => {
      if (!tasks.some(t => t.text === taskText && t.type === 'weekly')) {
        tasks.push({ text: taskText, type: 'weekly', completed: false, completedAt: null });
      }
    });

    saveTasksToStorage(tasks);
    localStorage.setItem('lastWeeklyGeneratedDate', lastMonday);
  }
}

/**
 * Resets weekly tasks to incomplete if last reset was before this week
 */
export function resetWeeklyTasksIfNeeded() {
  const lastWeeklyReset = localStorage.getItem('lastWeeklyResetDate');
  const lastMonday = getLastMondayStr();

  if (lastWeeklyReset !== lastMonday) {
    let tasks = loadTasksFromStorage();

    tasks = tasks.map(task => {
      if (task.type === 'weekly') {
        return { ...task, completed: false, completedAt: null };
      }
      return task;
    });

    saveTasksToStorage(tasks);
    localStorage.setItem('lastWeeklyResetDate', lastMonday);
  }
}
