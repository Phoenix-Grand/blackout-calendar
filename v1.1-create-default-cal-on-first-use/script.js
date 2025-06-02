document.addEventListener('DOMContentLoaded', function() {
    window.calendars = {}; // Initializes the calendar storage
    loadCalendars(); // Load saved calendars on startup
    if (Object.keys(window.calendars).length === 0) {
        createCalendar('My 2024 Calendar'); // Create a default calendar if none exists
    }
});

function createCalendar(name) {
    if (!name || window.calendars[name]) {
        alert('Please enter a unique non-empty name for the calendar or choose another name.');
        return;
    }

    const calendarContainer = document.createElement('div');
    calendarContainer.classList.add('calendar');
    calendarContainer.style.display = 'none'; // Hide by default

    const year = 2024; // Leap year example, adjust as needed
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    monthNames.forEach((month, index) => {
        const days = daysInMonth[index];
        const monthHeader = document.createElement('div');
        monthHeader.textContent = month;
        monthHeader.className = 'month-header';
        calendarContainer.appendChild(monthHeader);

        const monthGrid = document.createElement('div');
        monthGrid.className = 'month-grid';
        const firstDay = new Date(year, index, 1).getDay();
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'day empty';
            monthGrid.appendChild(emptyDay);
        }
        for (let day = 1; day <= days; day++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('day');
            dayElement.textContent = day;
            dayElement.addEventListener('click', function() {
                this.classList.toggle('filled');
            });
            monthGrid.appendChild(dayElement);
        }
        calendarContainer.appendChild(monthGrid);
    });

    document.getElementById('calendarContainer').appendChild(calendarContainer);
    window.calendars[name] = calendarContainer;

    const newOption = document.createElement('option');
    newOption.textContent = name;
    newOption.value = name;
    document.getElementById('calendarList').appendChild(newOption);
    document.getElementById('calendarList').value = name;
    switchCalendar(name);
}

function saveCalendars() {
    const data = {};
    Object.keys(window.calendars).forEach(name => {
        const days = Array.from(window.calendars[name].querySelectorAll('.day'));
        data[name] = days.map(day => day.classList.contains('filled'));
    });
    localStorage.setItem('calendars', JSON.stringify(data));
    alert('Calendars saved locally!');
}

function loadCalendars() {
    const data = JSON.parse(localStorage.getItem('calendars'));
    if (data) {
        Object.keys(data).forEach(name => {
            if (!window.calendars[name]) {
                createCalendar(name); // Create calendar if it doesn't exist
            }
            const calendar = window.calendars[name];
            const days = Array.from(calendar.querySelectorAll('.day'));
            data[name].forEach((filled, index) => {
                days[index].classList.toggle('filled', filled);
            });
            document.getElementById('calendarList').value = name;
            switchCalendar(name);
        });
    }
}

function switchCalendar(name) {
    Object.keys(window.calendars).forEach(key => {
        window.calendars[key].style.display = 'none'; // Hide all calendars
    });
    const selectedCalendar = window.calendars[name];
    if (selectedCalendar) {
        selectedCalendar.style.display = 'block'; // Show the selected calendar
    }
}

function generateQR() {
    const data = localStorage.getItem('calendars');
    if (data) {
        QRCode.toCanvas(document.getElementById('qrcode'), data, function (error) {
            if (error) console.error(error);
            console.log('QR code generated!');
        });
    }
}
