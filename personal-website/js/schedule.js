// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get the Monday date of the current week
 * @param {Date} date - The reference date
 * @returns {string} Date in YYYY-MM-DD format
 */
function getMondayDate(date) {
    const monday = new Date(date);
    const day = monday.getDay();
    const diff = monday.getDate() - day + (day === 0 ? -6 : 1); // Adjust when Sunday (day 0)
    monday.setDate(diff);
    monday.setHours(0, 0, 0, 0); // Set to midnight
    return monday.toISOString().split('T')[0];
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initializeDayImage();
    initializeSidebar();
    initializeWorkspaceDropdown();
});

// ============================================
// DAY IMAGE DISPLAY
// ============================================

/**
 * Display the appropriate image for the current day of the week
 */
function initializeDayImage() {
    const images = [
        "assets/sunday.png",
        "assets/monday_pixel_art.PNG",
        "assets/tuesday_pixel_art.PNG",
        "assets/wednedsay_pixel_art.PNG",
        "assets/thursday_pixel_art.PNG",
        "assets/friday_pixel_art.PNG",
        "assets/saturday.png"
    ];

    const today = new Date().getDay();
    const img = document.createElement("img");
    img.src = images[today];
    img.alt = `Day ${today} image`;

    const titleElement = document.getElementById("title");
    if (titleElement) {
        titleElement.appendChild(img);
    }
}

// ============================================
// SIDEBAR FUNCTIONALITY
// ============================================

/**
 * Initialize sidebar toggle functionality
 */
function initializeSidebar() {
    const toggleBtn = document.getElementById("toggleBtn");
    const sidebar = document.getElementById("sidebar");

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener("click", () => {
            sidebar.classList.toggle("collapsed");
        });
    }
}

// ============================================
// WORKSPACE DROPDOWN
// ============================================

/**
 * Initialize workspace dropdown functionality
 */
function initializeWorkspaceDropdown() {
    const workspace = document.getElementById("workspace");

    if (workspace) {
        const button = workspace.querySelector("button");
        if (button) {
            button.addEventListener("click", () => {
                workspace.classList.toggle("open");
            });
        }
    }
}