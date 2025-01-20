document.addEventListener('DOMContentLoaded', function() {
    // Get current date
    const currentDate = new Date();
    
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
            }
        });

        // Clear the input fields
        document.getElementById('taskTime').value = '';
        document.getElementById('taskName').value = '';
    }
});

// Add goal to Goals
document.getElementById('addGoal').addEventListener('click', function() {
    const goalName = document.getElementById('goalName').value;

    if (goalName) {
        const tableBody = document.querySelector('#goalsTable tbody');
        const newRow = document.createElement('tr');

        newRow.classList.add('goal-row');

        newRow.innerHTML = `
            <td>${goalName}</td>
            <td><input type="checkbox" class="goal-check" style="width: 25px; height: 25px;" /></td>
        `;

        tableBody.appendChild(newRow);

        newRow.querySelector('.goal-check').addEventListener('change', function() {
            if (this.checked) {
                tableBody.removeChild(newRow);
            }
        });

        // Clear the input field
        document.getElementById('goalName').value = '';
    }
});
