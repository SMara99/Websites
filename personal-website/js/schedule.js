document.addEventListener('DOMContentLoaded', function () {
    const dailyTasksTable = document.getElementById('dailyTasks');
    const resetTime = new Date();
    resetTime.setHours(0, 0, 0, 0);

    function resetDailyTasks() {
        if (new Date() >= resetTime) {
            dailyTasksTable.querySelector('tbody').innerHTML = '';
            localStorage.removeItem('dailyTasks');
            resetTime.setDate(resetTime.getDate() + 1);
        }
    }

    function loadDailyTasks() {
        const savedTasks = localStorage.getItem('dailyTasks');
        if (savedTasks) {
            dailyTasksTable.querySelector('tbody').innerHTML = savedTasks;
        }
    }

    function saveDailyTasks() {
        localStorage.setItem('dailyTasks', dailyTasksTable.querySelector('tbody').innerHTML);
    }

    function setDayHeader() {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const today = new Date();
        const todayIndex = today.getDay();
        document.getElementById('dayHeader').textContent = days[todayIndex];

        const columns = document.querySelectorAll(`#weeklyPlanner th:nth-child(${todayIndex + 2}), #weeklyPlanner td:nth-child(${todayIndex + 2})`);
        columns.forEach(column => column.classList.add('bold'));
    }

    setDayHeader();
    loadDailyTasks();
    resetDailyTasks();

    document.getElementById('addTask').addEventListener('click', function () {
        const taskTime = document.getElementById('taskTime').value;
        const taskName = document.getElementById('taskName').value;
        const row = `<tr><td contenteditable="true">${taskTime}</td><td contenteditable="true">${taskName}</td></tr>`;
        dailyTasksTable.querySelector('tbody').insertAdjacentHTML('beforeend', row);
        saveDailyTasks();
    });

    dailyTasksTable.addEventListener('input', saveDailyTasks);
});
