/* =========================================
   CONSTANTS
   ========================================= */

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

const DAY_NAMES_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

let currentFilter = 'frequency';


/* =========================================
   INITIALIZATION
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    setCurrentDate();
    setDailyBackgroundColor();
    loadMaintenanceItems();
});


/* =========================================
   DATE DISPLAY
   ========================================= */

function setCurrentDate() {
    const today = new Date();
    const dayName = DAY_NAMES_FULL[today.getDay()];
    const day = today.getDate();
    const monthName = MONTH_NAMES[today.getMonth()];
    const year = today.getFullYear();
    
    const fullDateElement = document.getElementById('fullDate');
    if (fullDateElement) {
        fullDateElement.textContent = `${dayName} ${day} ${monthName} ${year}`;
    }
}


/* =========================================
   BACKGROUND COLOR
   ========================================= */

function setDailyBackgroundColor() {
    const today = new Date();
    const year = today.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const dayOfYear = Math.floor((today - startOfYear) / (1000 * 60 * 60 * 24));
    const totalDays = isLeapYear(year) ? 366 : 365;
    
    const hue = Math.floor((dayOfYear / totalDays) * 360 + 30) % 360;
    const backgroundColor = `hsl(${hue}, 50%, 85%)`;
    
    document.body.style.backgroundColor = backgroundColor;
}

function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}


/* =========================================
   FILTER FUNCTIONALITY
   ========================================= */

function setFilter(filterType) {
    currentFilter = filterType;
    
    // Update active button styling
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filterType);
    });
    
    // Manage container visibility
    const containers = {
        area: 'roomsContainer',
        minimal: 'minimalContainer',
        frequency: 'frequencyContainer'
    };
    
    Object.entries(containers).forEach(([filter, containerId]) => {
        const container = document.getElementById(containerId);
        container.style.display = filterType === filter ? 'grid' : 'none';
    });
    
    loadMaintenanceItems();
}

window.setFilter = setFilter;


/* =========================================
   MAINTENANCE ITEMS
   ========================================= */

function loadMaintenanceItems() {
    const tasksList = document.getElementById('todayTasksList');
    if (!tasksList) return;
    
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 5; i++) {
        const taskLine = document.createElement('div');
        taskLine.className = 'task-line';
        fragment.appendChild(taskLine);
    }
    
    tasksList.innerHTML = '';
    tasksList.appendChild(fragment);
    
    // TODO: Load items from database based on currentFilter
}
