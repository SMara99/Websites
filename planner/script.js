/* =========================================
   CONSTANTS
   ========================================= */

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];


/* =========================================
   INITIALIZATION
   ========================================= */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    console.log('Page loaded successfully!');

    // Set background color based on day of year
    setDailyBackgroundColor();

    // Initialize calendar displays
    generateWeekDisplay();
    generateMonthDisplay();

    // Initialize view toggle functionality
    initializeViewToggle();

    // Initialize navigation
    initializeNavigation();
});


/* =========================================
   VIEW TOGGLE FUNCTIONALITY
   ========================================= */

function initializeViewToggle() {
    const toggleViewBtn = document.getElementById('toggleViewBtn');
    const weekDisplay = document.getElementById('weekDisplay');
    const monthDisplay = document.getElementById('monthDisplay');
    let isExpanded = false;

    // Toggle button click
    toggleViewBtn.addEventListener('click', function () {
        isExpanded = !isExpanded;

        if (isExpanded) {
            // Show month view
            toggleViewBtn.classList.add('expanded');
            toggleViewBtn.title = 'Minimize to Week View';
            weekDisplay.style.display = 'none';
            monthDisplay.style.display = 'grid';
        } else {
            // Show week view
            toggleViewBtn.classList.remove('expanded');
            toggleViewBtn.title = 'Expand to Month View';
            weekDisplay.style.display = 'flex';
            monthDisplay.style.display = 'none';
        }
    });
}


/* =========================================
   WEEK DISPLAY GENERATION
   ========================================= */

function generateWeekDisplay() {
    const today = new Date();
    const weekDisplay = document.getElementById('weekDisplay');
    const startOfWeek = getMonday(today);

    // Generate 7 day cells for the week (Mon-Sun)
    for (let i = 0; i < 7; i++) {
        const dayDate = new Date(startOfWeek);
        dayDate.setDate(startOfWeek.getDate() + i);

        const dayCell = createDayCell(dayDate, today, i);
        weekDisplay.appendChild(dayCell);
    }
}

// Helper: Get Monday of the current week
function getMonday(date) {
    const day = date.getDay();
    const diff = day === 0 ? -6 : 1 - day; // Adjust when Sunday
    const monday = new Date(date);
    monday.setDate(date.getDate() + diff);
    return monday;
}

// Helper: Create a single day cell
function createDayCell(dayDate, today, index) {
    const dayCell = document.createElement('div');
    dayCell.className = 'day-cell';

    // Mark current day
    if (dayDate.toDateString() === today.toDateString()) {
        dayCell.classList.add('current-day');
    }

    // Create day name
    const dayName = document.createElement('div');
    dayName.className = 'day-name';
    dayName.textContent = DAY_NAMES[index];

    // Create day number
    const dayNumber = document.createElement('div');
    dayNumber.className = 'day-number';
    dayNumber.textContent = dayDate.getDate();

    dayCell.appendChild(dayName);
    dayCell.appendChild(dayNumber);

    // Add click event
    dayCell.addEventListener('click', () => {
        console.log(`Clicked on ${DAY_NAMES[index]}, ${dayDate.toLocaleDateString()}`);
    });

    return dayCell;
}


/* =========================================
   MONTH DISPLAY GENERATION
   ========================================= */

function generateMonthDisplay() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const monthDisplay = document.getElementById('monthDisplay');

    // Generate 12 month cells for the current year
    MONTH_NAMES.forEach((monthName, index) => {
        const monthCell = createMonthCell(monthName, index, currentMonth, currentYear);
        monthDisplay.appendChild(monthCell);
    });
}

// Helper: Create a single month cell
function createMonthCell(monthName, index, currentMonth, currentYear) {
    const monthCell = document.createElement('div');
    monthCell.className = 'month-cell';

    // Mark current month
    if (index === currentMonth) {
        monthCell.classList.add('current-month');
    }

    monthCell.textContent = monthName;

    // Add click event
    monthCell.addEventListener('click', () => {
        console.log(`Clicked on ${monthName} ${currentYear}`);
    });

    return monthCell;
}


/* =========================================
   NAVIGATION - SECTION SWITCHING
   ========================================= */

function initializeNavigation() {
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('.content-section');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1); // Remove the #

            // Hide all sections
            sections.forEach(section => {
                section.classList.remove('active');
            });

            // Show the clicked section
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
}


/* =========================================
   DAILY BACKGROUND COLOR
   ========================================= */

function setDailyBackgroundColor() {
    const today = new Date();
    const year = today.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const dayOfYear = Math.floor((today - startOfYear) / (1000 * 60 * 60 * 24));
    const totalDays = isLeapYear(year) ? 366 : 365;
    
    // Calculate hue based on day of year (0-360 degrees)
    // Start at orange (30°) for a warm color cycle
    const hue = Math.floor((dayOfYear / totalDays) * 360 + 30) % 360;
    const backgroundColor = `hsl(${hue}, 50%, 85%)`;
    
    // Apply to body and header
    document.body.style.backgroundColor = backgroundColor;
    document.querySelector('header').style.backgroundColor = backgroundColor;
}

// Helper: Check if year is a leap year
function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}
