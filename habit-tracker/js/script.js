// ============================================================
// Habit Tracker JavaScript
// ============================================================

// Display current date
function updateDate() {
    const dateElement = document.getElementById('fullDate');
    const now = new Date();
    
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    
    dateElement.textContent = now.toLocaleDateString('en-US', options);
}

// View switching functionality
function showView(viewType) {
    const habitsView = document.getElementById('habitsView');
    const dailyView = document.getElementById('dailyView');
    const statsContainer = document.querySelector('.stats-container');
    const allHabitsBtn = document.getElementById('allHabitsBtn');
    const dailyBtn = document.getElementById('dailyBtn');
    
    // Remove active class from all buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (viewType === 'habits') {
        habitsView.style.display = 'grid';
        dailyView.style.display = 'none';
        if (statsContainer) statsContainer.style.display = 'grid';
        allHabitsBtn.classList.add('active');
    } else if (viewType === 'daily') {
        habitsView.style.display = 'none';
        dailyView.style.display = 'block';
        if (statsContainer) statsContainer.style.display = 'none';
        dailyBtn.classList.add('active');
    }
}

// Filter functionality
function setupFilters() {
    const allHabitsBtn = document.getElementById('allHabitsBtn');
    const dailyBtn = document.getElementById('dailyBtn');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    allHabitsBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showView('habits');
    });
    
    dailyBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showView('daily');
    });
    
    filterButtons.forEach(button => {
        if (button.id !== 'allHabitsBtn' && button.id !== 'dailyBtn') {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                console.log('Filter selected:', filter);
                
                // Ensure habits view is shown
                showView('habits');
            });
        }
    });
}

// Category selection
function setupCategories() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            console.log('Category selected:', category);
            
            // Here you would filter habits by category
            // For now, we'll just add a visual effect
            categoryCards.forEach(c => c.style.opacity = '0.5');
            this.style.opacity = '1';
            
            setTimeout(() => {
                categoryCards.forEach(c => c.style.opacity = '1');
            }, 300);
        });
    });
}

// Complete habit functionality
function setupCompleteButtons() {
    const completeButtons = document.querySelectorAll('.complete-btn');
    
    completeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const habitCard = this.closest('.habit-card');
            
            // Toggle completed state
            if (this.textContent.includes('✓')) {
                this.textContent = '✓ Completed!';
                this.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
                habitCard.style.opacity = '0.8';
                
                // Reset after a moment
                setTimeout(() => {
                    this.textContent = '✓ Mark Complete';
                    this.style.background = '';
                    habitCard.style.opacity = '1';
                }, 2000);
            }
        });
    });
}

// Add new habit functionality
function setupAddHabit() {
    const addButton = document.querySelector('.add-habit-btn');
    
    if (addButton) {
        addButton.addEventListener('click', function() {
            alert('Add Habit feature coming soon!');
            // Here you would open a modal or form to add a new habit
        });
    }
}

// Local Storage Functions for 24-hour persistence
function saveDailyJournal() {
    const habitList = document.getElementById('habitList');
    const habitItems = habitList.querySelectorAll('.habit-item');
    
    // Load existing data to preserve timestamps
    const stored = localStorage.getItem('dailyJournal');
    const existingData = stored ? JSON.parse(stored) : { habits: [] };
    
    const journalData = {
        habits: []
    };
    
    habitItems.forEach((item, index) => {
        const icon = item.querySelector('.habit-icon-selector').value;
        const text = item.querySelector('.habit-input').value;
        const checked = item.querySelector('.check-btn').classList.contains('checked');
        
        // Preserve existing timestamp or create new one
        const timestamp = (existingData.habits[index] && existingData.habits[index].timestamp) 
            ? existingData.habits[index].timestamp 
            : Date.now();
        
        journalData.habits.push({ icon, text, checked, timestamp });
    });
    
    localStorage.setItem('dailyJournal', JSON.stringify(journalData));
}

function loadDailyJournal() {
    const stored = localStorage.getItem('dailyJournal');
    
    if (!stored) return;
    
    const journalData = JSON.parse(stored);
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    
    // Filter out habits older than 24 hours
    const validHabits = journalData.habits.filter(habit => {
        return (now - habit.timestamp) <= twentyFourHours;
    });
    
    // If no valid habits remain, clear storage
    if (validHabits.length === 0) {
        localStorage.removeItem('dailyJournal');
        return;
    }
    
    // Load the saved habits
    const habitList = document.getElementById('habitList');
    habitList.innerHTML = ''; // Clear existing
    
    validHabits.forEach(habit => {
        const newItem = document.createElement('div');
        newItem.className = 'habit-item';
        newItem.innerHTML = `
            <select class="habit-icon-selector">
                <option value="💪">💪 Exercise</option>
                <option value="📚">📚 Reading</option>
                <option value="🧘">🧘 Meditation</option>
                <option value="💧">💧 Water</option>
                <option value="🥗">🥗 Healthy Eating</option>
                <option value="😴">😴 Sleep</option>
                <option value="✍️">✍️ Journaling</option>
                <option value="🎨">🎨 Creative Work</option>
                <option value="👥">👥 Social</option>
                <option value="🎯">🎯 Goals</option>
                <option value="🧹">🧹 Cleaning</option>
                <option value="💼">💼 Work</option>
            </select>
            <input type="text" class="habit-input" placeholder="Enter your habit..." value="${habit.text}">
            <button class="check-btn ${habit.checked ? 'checked' : ''}">${habit.checked ? '✓' : '☐'}</button>
        `;
        
        // Set the selected icon
        newItem.querySelector('.habit-icon-selector').value = habit.icon;
        
        habitList.appendChild(newItem);
        
        // Add event listeners
        const checkBtn = newItem.querySelector('.check-btn');
        checkBtn.addEventListener('click', function() {
            toggleCheck(this);
        });
        
        const input = newItem.querySelector('.habit-input');
        input.addEventListener('input', saveDailyJournal);
        
        const select = newItem.querySelector('.habit-icon-selector');
        select.addEventListener('change', saveDailyJournal);
    });
}

// Daily Journal Functions
function addHabitItem() {
    const habitList = document.getElementById('habitList');
    
    const newItem = document.createElement('div');
    newItem.className = 'habit-item';
    newItem.innerHTML = `
        <select class="habit-icon-selector">
            <option value="💪">💪 Exercise</option>
            <option value="📚">📚 Reading</option>
            <option value="🧘">🧘 Meditation</option>
            <option value="💧">💧 Water</option>
            <option value="🥗">🥗 Healthy Eating</option>
            <option value="😴">😴 Sleep</option>
            <option value="✍️">✍️ Journaling</option>
            <option value="🎨">🎨 Creative Work</option>
            <option value="👥">👥 Social</option>
            <option value="🎯">🎯 Goals</option>
            <option value="🧹">🧹 Cleaning</option>
            <option value="💼">💼 Work</option>
        </select>
        <input type="text" class="habit-input" placeholder="Enter your habit...">
        <button class="check-btn">☐</button>
    `;
    
    habitList.appendChild(newItem);
    
    // Add event listeners
    const checkBtn = newItem.querySelector('.check-btn');
    checkBtn.addEventListener('click', function() {
        toggleCheck(this);
    });
    
    const input = newItem.querySelector('.habit-input');
    input.addEventListener('input', saveDailyJournal);
    
    const select = newItem.querySelector('.habit-icon-selector');
    select.addEventListener('change', saveDailyJournal);
    
    saveDailyJournal();
}

function toggleCheck(button) {
    if (button.classList.contains('checked')) {
        button.classList.remove('checked');
        button.textContent = '☐';
    } else {
        button.classList.add('checked');
        button.textContent = '✓';
    }
    saveDailyJournal();
}

function setupDailyJournal() {
    // Load saved data first
    loadDailyJournal();
    
    // Setup add button
    const addItemBtn = document.querySelector('.add-item-btn');
    if (addItemBtn) {
        addItemBtn.addEventListener('click', addHabitItem);
    }
    
    // Setup existing check buttons and inputs
    const habitList = document.getElementById('habitList');
    const checkButtons = habitList.querySelectorAll('.check-btn');
    checkButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            toggleCheck(this);
        });
    });
    
    const inputs = habitList.querySelectorAll('.habit-input');
    inputs.forEach(input => {
        input.addEventListener('input', saveDailyJournal);
    });
    
    const selects = habitList.querySelectorAll('.habit-icon-selector');
    selects.forEach(select => {
        select.addEventListener('change', saveDailyJournal);
    });
}

// Initialize all functions when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    updateDate();
    setupFilters();
    setupCategories();
    setupCompleteButtons();
    setupAddHabit();
    setupDailyJournal();
    
    // Show habits view by default
    showView('habits');
});
