document.addEventListener('DOMContentLoaded', function() {
    // Get current date
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD

    // Get current weekday
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const weekdayName = weekdays[currentDate.getDay()];

    // Format current date as DD/MM/YYYY
    const day = String(currentDate.getDate()).padStart(2, '0'); // Add leading zero for single-digit days
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Add leading zero for single-digit months
    const year = currentDate.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    // Update weekday and date in the HTML
    document.getElementById('weekday').textContent = weekdayName;
    document.getElementById('currentDate').textContent = formattedDate;

    // Check and clear tasks if a new day has started
    checkAndClearTasksForNewDay(currentDateString);

    // Load from localStorage if available
    loadGoalsFromLocalStorage();
    loadRandomFromLocalStorage();
    loadItemFromLocalStorage();
});

// Add task to ToDo
document.getElementById('addTask').addEventListener('click', function() {
    const taskTime = document.getElementById('taskTime').value;
    const taskName = document.getElementById('taskName').value;

    // Allow tasks with only time, only name, or both
    if (taskTime || taskName) {
        const tableBody = document.querySelector('#dailyTasks tbody');
        const newRow = document.createElement('tr');

        // Add grey/black color scheme to the new row
        newRow.classList.add('todo-row');

        newRow.innerHTML = `
            <td>${taskTime || ''}</td>
            <td>${taskName || ''}</td>
            <td><input type="checkbox" class="task-check" style="width: 25px; height: 25px;" /></td>
        `;

        tableBody.appendChild(newRow);

        // Add event listener to the new checkbox to remove the row when checked
        newRow.querySelector('.task-check').addEventListener('change', function() {
            if (this.checked) {
                tableBody.removeChild(newRow);
                saveTasksToLocalStorage();
            }
        });

        // Save task to localStorage
        saveTasksToLocalStorage();

        // Clear the input fields
        document.getElementById('taskTime').value = '';
        document.getElementById('taskName').value = '';
    }
});

// Add goal to Goals
document.getElementById('addGoal').addEventListener('click', function() {
    const goalName = document.getElementById('goalName').value;

    // Allow goals to be added if there is a goal name
    if (goalName) {
        const tableBody = document.querySelector('#goalsTable tbody');
        const newRow = document.createElement('tr');

        // Add new goal to table
        newRow.classList.add('goal-row');
        newRow.innerHTML = `
            <td>${goalName}</td>
            <td><input type="checkbox" class="goal-check" style="width: 25px; height: 25px;" /></td>
        `;
        tableBody.appendChild(newRow);

        // Add goal to localStorage
        saveGoalToLocalStorage(goalName);

        // Clear the input field
        document.getElementById('goalName').value = '';
    }
});

// Add random to Life
document.getElementById('addRandom').addEventListener('click', function() {
    const randomName = document.getElementById('randomName').value;

    // Allow random to be added if there is a name
    if (randomName) {
        const tableBody = document.querySelector('#randomTable tbody');
        const newRow = document.createElement('tr');

        // Add new random to table
        newRow.classList.add('random-row');
        newRow.innerHTML = `
            <td>${randomName}</td>
            <td><input type="checkbox" class="random-check" style="width: 25px; height: 25px;" /></td>
        `;
        tableBody.appendChild(newRow);

        // Add random to localStorage
        saveRandomToLocalStorage(randomName);

        // Clear the input field
        document.getElementById('randomName').value = '';
    }
})

// Add Item to Shopping List
document.getElementById('addItem').addEventListener('click', function() {
    const itemName = document.getElementById('itemName').value;

    if (itemName) {
        const tableBody = document.querySelector('#itemTable tbody');
        const newRow = document.createElement('tr');
        
        newRow.classList.add('item-row');
        newRow.innerHTML = `
            <td>${itemName}</td>
            <td><input type="checkbox" class="item-check" style="width: 25px; height: 25px;" /></td>
        `;
        tableBody.appendChild(newRow);

        // Add event listener to checkbox to update localStorage when checked
        newRow.querySelector('.item-check').addEventListener('change', function() {
            if (this.checked) {
                tableBody.removeChild(newRow);
                saveUpdatedItemToLocalStorage();
            }
        });

        // Save item to localStorage
        saveItemToLocalStorage(itemName);
        document.getElementById('itemName').value = '';
    }
})

function saveTasksToLocalStorage() {
    // Get current date and format it as YYYY-MM-DD
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD

    // Get the tasks from the table
    const tasks = [];
    const taskRows = document.querySelectorAll('#dailyTasks tbody tr');

    taskRows.forEach(row => {
        const taskTime = row.querySelector('td:nth-child(1)').textContent;
        const taskName = row.querySelector('td:nth-child(2)').textContent;
        tasks.push({ taskTime, taskName });
    });

    // Save tasks to localStorage with the current date
    localStorage.setItem(`tasks-${currentDateString}`, JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD

    // Load tasks from localStorage for the current day
    const tasks = JSON.parse(localStorage.getItem(`tasks-${currentDateString}`)) || [];

    const tableBody = document.querySelector('#dailyTasks tbody');
    tableBody.innerHTML = ''; // Clear existing table rows

    // Add tasks to the table
    tasks.forEach(taskData => {
        const newRow = document.createElement('tr');
        newRow.classList.add('todo-row');
        newRow.innerHTML = `
            <td>${taskData.taskTime}</td>
            <td>${taskData.taskName}</td>
            <td><input type="checkbox" class="task-check" style="width: 25px; height: 25px;" /></td>
        `;
        tableBody.appendChild(newRow);

        // Add event listener to remove task when checked
        newRow.querySelector('.task-check').addEventListener('change', function() {
            if (this.checked) {
                tableBody.removeChild(newRow);
                saveTasksToLocalStorage();
            }
        });
    });
}

function checkAndClearTasksForNewDay(currentDateString) {
    const storedDate = localStorage.getItem('lastTaskDate');
    const currentDate = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    // If the stored date is different from today, clear the tasks
    if (storedDate !== currentDate) {
        localStorage.removeItem(`tasks-${storedDate}`);
        localStorage.setItem('lastTaskDate', currentDate); // Update the last task date
    }

    // Load tasks for today (if available)
    loadTasksFromLocalStorage();
}

function saveGoalToLocalStorage(goalName) {
    // Get current date and the start of the week (Monday)
    const currentDate = new Date();
    const mondayDate = getMondayDate(currentDate);
    const isChecked = false;

    // Get the existing goals from localStorage or initialize an empty array
    const goals = JSON.parse(localStorage.getItem('goals')) || [];

    // Add the new goal along with the start of the week date
    goals.push({ goal: goalName, date: mondayDate, checked: isChecked });

    // Save the updated goals to localStorage
    localStorage.setItem('goals', JSON.stringify(goals));
}

function loadGoalsFromLocalStorage() {
    const goals = JSON.parse(localStorage.getItem('goals')) || [];
    const currentDate = new Date();
    const mondayDate = getMondayDate(currentDate);

    // Filter out goals that belong to the previous weeks
    const currentWeekGoals = goals.filter(goalData => goalData.date === mondayDate);

    const tableBody = document.querySelector('#goalsTable tbody');
    tableBody.innerHTML = ''; // Clear existing table rows

    // Add goals for the current week to the table
    currentWeekGoals.forEach(goalData => {
        const newRow = document.createElement('tr');
        newRow.classList.add('goal-row');
        newRow.innerHTML = `
            <td>${goalData.goal}</td>
            <td><input type="checkbox" class="goal-check" style="width: 25px; height: 25px;" ${goalData.checked ? 'checked' : ''} /></td>
        `;
        tableBody.appendChild(newRow);
    

        // Add event listener to remove task when checked
        newRow.querySelector('.goal-check').addEventListener('change', function() {
            if (this.checked) {
                tableBody.removeChild(newRow);
                saveUpdatedGoalToLocalStorage();
            }
        });
    });
}

// Function to update localStorage after deleting a goal
function saveUpdatedGoalToLocalStorage() {
    const updatedGoals = [];
    document.querySelectorAll('#goalsTable tbody tr').forEach(row => {
        const goalText = row.querySelector('td:first-child').textContent;
        const isChecked = row.querySelector('.goal-check').checked;
        updatedGoals.push({ goal: goalText, date: getMondayDate(new Date()), checked: isChecked });
    });

    localStorage.setItem('goals', JSON.stringify(updatedGoals));
}

function saveRandomToLocalStorage(randomName) {
    // Get the existing random from localStorage or initialize an empty array
    const random = JSON.parse(localStorage.getItem('random')) || [];

    // Add the new goal along with the start of the week date
    random.push({ random: randomName});

    // Save the updated goals to localStorage
    localStorage.setItem('random', JSON.stringify(random));
}

function loadRandomFromLocalStorage() {
    const random = JSON.parse(localStorage.getItem('random')) || [];

    const tableBody = document.querySelector('#randomTable tbody');
    tableBody.innerHTML = ''; // Clear existing table rows

    // Add random 
    random.forEach(randomData => {
        const newRow = document.createElement('tr');
        newRow.classList.add('random-row');
        newRow.innerHTML = `
            <td>${randomData.random}</td>
            <td><input type="checkbox" class="random-check" style="width: 25px; height: 25px;" /></td>
        `;
        tableBody.appendChild(newRow);

        // Add event listener to remove task when checked
        newRow.querySelector('.random-check').addEventListener('change', function() {
            if (this.checked) {
                tableBody.removeChild(newRow);
                saveUpdatedRandomToLocalStorage();
            }
        });
    });
}

// Function to update localStorage after deleting a random item
function saveUpdatedRandomToLocalStorage() {
    const updatedRandom = [];
    document.querySelectorAll('#randomTable tbody tr').forEach(row => {
        const randomText = row.querySelector('td:first-child').textContent;
        updatedRandom.push({ random: randomText });
    });

    localStorage.setItem('random', JSON.stringify(updatedRandom));
}

function saveItemToLocalStorage(itemName){
    const item = JSON.parse(localStorage.getItem('item')) || [];
    item.push({ item: itemName});
    localStorage.setItem('item', JSON.stringify(item));
}

function loadItemFromLocalStorage(){
    const items = JSON.parse(localStorage.getItem('item')) || [];

    const tableBody = document.querySelector('#itemTable tbody');
    tableBody.innerHTML = ''; // Clear existing table rows

    // Add items from localStorage to the table
    items.forEach(itemData => {
        const newRow = document.createElement('tr');
        newRow.classList.add('item-row');
        newRow.innerHTML = `
            <td>${itemData.item}</td>
            <td><input type="checkbox" class="item-check" style="width: 25px; height: 25px;" /></td>
        `;
        tableBody.appendChild(newRow);

        // Add event listener to remove item when checked
        newRow.querySelector('.item-check').addEventListener('change', function() {
            if (this.checked) {
                tableBody.removeChild(newRow);
                saveUpdatedItemToLocalStorage();
            }
        });
    });
}

function saveUpdatedItemToLocalStorage() {
    const updatedItems = [];
    document.querySelectorAll('#itemTable tbody tr').forEach(row => {
        const itemText = row.querySelector('td:first-child').textContent;
        updatedItems.push({ item: itemText });
    });

    localStorage.setItem('item', JSON.stringify(updatedItems));
}

function getMondayDate(date) {
    // Get the current date and adjust to get the Monday of the current week
    const monday = new Date(date);
    const day = monday.getDay(),
          diff = monday.getDate() - day + (day == 0 ? -6 : 1); // Adjust when Sunday (day 0)
    monday.setDate(diff);
    monday.setHours(0, 0, 0, 0); // Set to midnight

    return monday.toISOString().split('T')[0]; // Return the date in YYYY-MM-DD format
}
