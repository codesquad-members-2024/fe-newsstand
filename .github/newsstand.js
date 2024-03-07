var refreshButton = document.getElementById('refresh-btn');

refreshButton.addEventListener('click', function() {
    location.reload();
});

const daysOfWeek = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
const date = new Date();
const dayName = daysOfWeek[date.getDay()];
document.getElementById("date").innerHTML = `${date.toLocaleDateString()} ${dayName}`;