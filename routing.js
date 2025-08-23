export function setupRouting() {
  const navTabs = document.querySelectorAll('.nav-tab');
  const pageInitial = document.getElementById('page-initial');
  const pageChecklist = document.getElementById('page-checklist');
  const pageWeeklyReview = document.getElementById('page-review');

  function showInitialView() {
    pageInitial.classList.remove('hidden');
    pageChecklist.classList.add('hidden');
    pageWeeklyReview.classList.add('hidden');
  }

  function showChecklistView() {
    pageInitial.classList.add('hidden');
    pageChecklist.classList.remove('hidden');
    pageWeeklyReview.classList.add('hidden');
    window.dispatchEvent(new CustomEvent('spa-show-checklist'));
  }

  function showWeeklyReviewView() {
    pageInitial.classList.add('hidden');
    pageChecklist.classList.add('hidden');
    pageWeeklyReview.classList.remove('hidden');
    window.dispatchEvent(new CustomEvent('spa-show-weekly-review'));
  }

  function updateActiveTab(targetHash) {
    navTabs.forEach(tab => {
      tab.classList.toggle('active-tab', tab.dataset.target === targetHash);
    });
  }

  function handleRouteChange() {
    const hash = window.location.hash || '#/initial';
    switch (hash) {
      case '#/checklist':
        showChecklistView();
        updateActiveTab('#/checklist');
        break;
      case '#/review':
        showWeeklyReviewView();
        updateActiveTab('#/review');
        break;
      default:
        showInitialView();
        updateActiveTab('#/initial');
    }
  }

  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      if (window.location.hash !== tab.dataset.target) {
        window.location.hash = tab.dataset.target;
      }
    });
  });

  window.addEventListener('hashchange', handleRouteChange);
  handleRouteChange();
}
