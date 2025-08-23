import { 
  loadTasksFromStorage, 
  saveTaskToStorage, 
  updateTaskInStorage, 
  removeTaskFromStorage 
} from './tasks.js';

const dailyTaskList = document.getElementById('daily-tasks');
const weeklyTaskList = document.getElementById('weekly-tasks');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskInput = document.getElementById('taskInput');
const taskTypeSelect = document.getElementById('taskType');
const backupBtn = document.getElementById('backupBtn');
const restoreBtn = document.getElementById('restoreBtn');
const restoreInput = document.getElementById('restoreInput');
const toggleCompletedCheckbox = document.getElementById('toggle-completed');
const progressTracker = document.getElementById('progress-tracker');

const pageChecklist = document.getElementById('page-checklist');
const pageReview = document.getElementById('page-review');

export function renderTasks() {
  dailyTaskList.innerHTML = '';
  weeklyTaskList.innerHTML = '';

  const tasks = loadTasksFromStorage();

  tasks.sort((a, b) => {
    if (a.completed === b.completed) {
      if (!a.completed) return 0;
      return new Date(b.completedAt) - new Date(a.completedAt);
    }
    return a.completed ? 1 : -1;
  });

  tasks.forEach(task => addTaskToDOM(task));
  updateProgressTracker();
}

function addTaskToDOM(taskObj) {
  const li = document.createElement('li');
  if (taskObj.text.startsWith('Daily Text Outreaches:')) {
    li.classList.add('highlight-outreach');
  }
  const wrapper = document.createElement('div');
  wrapper.classList.add('task-wrapper');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = taskObj.completed;

  const [titleLine, ...messageLines] = taskObj.text.split('<br>');
  const titleSpan = document.createElement('span');
  titleSpan.classList.add('task-text');
  titleSpan.innerHTML = titleLine;

  if (messageLines.length > 0) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('outreach-message');
    messageDiv.innerHTML = messageLines.join('<br>');
    wrapper.appendChild(titleSpan);
    wrapper.appendChild(messageDiv);
  } else {
    wrapper.appendChild(titleSpan);
  }

  wrapper.insertBefore(checkbox, wrapper.firstChild);
  li.appendChild(wrapper);

  const timestamp = document.createElement('div');
  timestamp.classList.add('task-timestamp');
  
  function updateTaskStyle() {
    if (taskObj.completed) {
      li.classList.add('completed');
      if (taskObj.completedAt) {
        const dt = new Date(taskObj.completedAt);
        timestamp.textContent = `✅ Completed at ${dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      }
    } else {
      li.classList.remove('completed');
      timestamp.textContent = '';
    }
    const showCompleted = toggleCompletedCheckbox?.checked;
    li.classList.toggle('hidden', taskObj.completed && !showCompleted);
  }

  updateTaskStyle();

  checkbox.addEventListener('change', () => {
    taskObj.completed = checkbox.checked;
    taskObj.completedAt = checkbox.checked ? new Date().toISOString() : null;
    updateTaskInStorage(taskObj);
    updateTaskStyle();
    updateProgressTracker();
  });

  li.appendChild(timestamp);

  if (taskObj.type === 'custom') {
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.classList.add('edit-btn');
    editBtn.addEventListener('click', () => startEditingTask(titleSpan, taskObj));

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', () => {
      li.remove();
      removeTaskFromStorage(taskObj);
      updateProgressTracker();
      showPersonalGrowthMessage('Task lovingly deleted. Keep growing!');
    });

    wrapper.appendChild(editBtn);
    wrapper.appendChild(deleteBtn);
  }

  if (taskObj.type === 'daily' || taskObj.customType === 'daily') {
    dailyTaskList.appendChild(li);
  } else if (taskObj.type === 'weekly' || taskObj.customType === 'weekly') {
    weeklyTaskList.appendChild(li);
  }
}

function updateProgressTracker() {
  const tasks = loadTasksFromStorage();

  const dailyTasks = tasks.filter(t => t.type === 'daily' || t.customType === 'daily');
  const weeklyTasks = tasks.filter(t => t.type === 'weekly' || t.customType === 'weekly');

  const dailyCompleted = dailyTasks.filter(t => t.completed).length;
  const weeklyCompleted = weeklyTasks.filter(t => t.completed).length;

  progressTracker.textContent = `Daily: ${dailyCompleted}/${dailyTasks.length} | Weekly: ${weeklyCompleted}/${weeklyTasks.length}`;
}

function startEditingTask(span, taskObj) {
  const originalText = span.textContent;
  const input = document.createElement('input');
  input.type = 'text';
  input.value = originalText;
  input.classList.add('edit-input');

  span.replaceWith(input);
  input.focus();

  function finishEdit() {
    const newText = input.value.trim();
    if (newText && newText !== taskObj.text) {
      taskObj.text = newText;
      updateTaskInStorage(taskObj);
      span.textContent = newText;
    }
    input.replaceWith(span);
  }

  input.addEventListener('blur', finishEdit);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') finishEdit();
  });
}

// Listen for SPA view change events to render filtered completed tasks
window.addEventListener('spa-show-checklist', () => {
  renderCompletedTasksByDate(new Date());
});

window.addEventListener('spa-show-weekly-review', () => {
  const now = new Date();
  const lastWeekStart = new Date(now);
  lastWeekStart.setDate(now.getDate() - 7);
  renderCompletedTasksByDateRange(lastWeekStart, now);
});

function renderCompletedTasksByDate(date) {
  const tasks = loadTasksFromStorage();
  const filtered = tasks.filter(t => 
    t.completed && isSameLocalDate(t.completedAt, date)
  ).sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  renderCompletedTasksList(filtered, pageChecklist);
}

function renderCompletedTasksByDateRange(startDate, endDate) {
  const tasks = loadTasksFromStorage();
  const filtered = tasks.filter(t => {
    if (!t.completed) return false;
    const completedDate = new Date(t.completedAt);
    return completedDate >= startDate && completedDate <= endDate;
  }).sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  renderCompletedTasksList(filtered, pageReview);
}

function renderCompletedTasksList(tasks, container) {
  container.innerHTML = '';
  if (tasks.length === 0) {
    container.innerHTML = '<p>No completed tasks in this period.</p>';
    return;
  }

  const ul = document.createElement('ul');
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.textContent = `${task.text} (Completed at ${new Date(task.completedAt).toLocaleString()})`;
    ul.appendChild(li);
  });
  container.appendChild(ul);
}

function isSameLocalDate(aStr, date) {
  if (!aStr) return false;
  const aDate = new Date(aStr);
  return (
    aDate.getFullYear() === date.getFullYear() &&
    aDate.getMonth() === date.getMonth() &&
    aDate.getDate() === date.getDate()
  );
}

export function setupUI() {
  addTaskBtn.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    if (!taskText) return;

    const taskType = taskTypeSelect.value;
    const newTask = { text: taskText, type: 'custom', customType: taskType, completed: false, completedAt: null };

    saveTaskToStorage(newTask);
    taskInput.value = '';
    renderTasks();
  });

  backupBtn.addEventListener('click', () => {
    const tasksStr = localStorage.getItem('tasks');
    if (!tasksStr) {
      showPersonalGrowthMessage('No tasks to save yet. Keep creating!');
      return;
    }
    const blob = new Blob([tasksStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasks-backup-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showPersonalGrowthMessage('Tasks successfully saved to your device.');
  });

  restoreBtn.addEventListener('click', () => restoreInput.click());

  restoreInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!confirm('Restoring will overwrite your current tasks. Proceed?')) {
      restoreInput.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const tasks = JSON.parse(reader.result);
        if (Array.isArray(tasks)) {
          localStorage.setItem('tasks', JSON.stringify(tasks));
          showPersonalGrowthMessage('Memory file restored. Welcome back!');
          renderTasks();
        } else {
          showPersonalGrowthMessage('Invalid memory file format.');
        }
      } catch {
        showPersonalGrowthMessage('Error reading memory file.');
      }
    };
    reader.readAsText(file);
    restoreInput.value = '';
  });

  toggleCompletedCheckbox.addEventListener('change', () => {
    const showCompleted = toggleCompletedCheckbox.checked;
    const completedItems = document.querySelectorAll('.task-list li.completed');
    completedItems.forEach(li => li.classList.toggle('hidden', !showCompleted));
  });
}

function showPersonalGrowthMessage(message) {
  alert(message);
}
