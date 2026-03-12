// ======================
// SCHEMA – HELA VECKAN
// ======================

window.schema = {
  "Måndag": [
    { start: "09:00", end: "09:20", subject: "MENTOR" },
    { start: "09:20", end: "10:20", subject: "MA" },
    { start: "10:30", end: "11:30", subject: "SV" },
    { start: "11:40", end: "12:30", subject: "SO" },
    { start: "12:30", end: "12:50", subject: "LUNCH" },
    { start: "13:10", end: "13:50", subject: "NO" },
    { start: "14:00", end: "14:50", subject: "EN" }
  ],
  "Tisdag": [
    { start: "08:20", end: "09:10", subject: "BLOCK" },
    { start: "09:15", end: "10:15", subject: "MU 1 OCH BL 1" },
    { start: "10:20", end: "11:20", subject: "MU 2 OCH BL 2" },
    { start: "11:25", end: "12:25", subject: "MA" },
    { start: "12:25", end: "12:45", subject: "LUNCH" },
    { start: "13:05", end: "13:45", subject: "SV" },
    { start: "13:55", end: "14:35", subject: "SO" }
  ],
  "Onsdag": [
    { start: "08:20", end: "09:20", subject: "SV" },
    { start: "09:40", end: "10:40", subject: "MA" },
    { start: "10:50", end: "11:40", subject: "SO" },
    { start: "11:40", end: "12:00", subject: "LUNCH" },
    { start: "12:25", end: "13:45", subject: "SLÖJD" },
    { start: "13:50", end: "14:50", subject: "EN" }
  ],
  "Torsdag": [
    { start: "08:20", end: "09:30", subject: "IDH" },
    { start: "09:50", end: "10:50", subject: "NO" },
    { start: "11:15", end: "12:15", subject: "BLOCK" },
    { start: "12:15", end: "12:35", subject: "LUNCH" },
    { start: "12:50", end: "13:40", subject: "NO" },
    { start: "13:45", end: "14:35", subject: "SO" }
  ],
  "Fredag": [
    { start: "08:00", end: "09:10", subject: "IDH" },
    { start: "09:20", end: "10:10", subject: "BLOCK" },
    { start: "10:20", end: "11:20", subject: "NO" },
    { start: "11:30", end: "11:50", subject: "LUNCH" },
    { start: "12:10", end: "12:50", subject: "SO" },
    { start: "13:00", end: "13:40", subject: "MA" }
  ]
};

// ======================
// RENDERA VECKAN
// ======================

const weekEl = document.getElementById("week");
const liveInfo = document.getElementById("liveInfo");
const dayTitleEl = document.getElementById("dayTitle");

const daysOrder = ["Måndag","Tisdag","Onsdag","Torsdag","Fredag"];

daysOrder.forEach(day => {
  const dayDiv = document.createElement("div");
  dayDiv.className = "day";
  dayDiv.setAttribute("data-day", day);
  dayDiv.innerHTML = `<h2>${day}</h2>`;

  schema[day].forEach(lesson => {
    const div = document.createElement("div");
    div.className = `lesson ${lesson.subject.replaceAll(" ", "")}`;
    div.setAttribute("data-start", lesson.start);
    div.setAttribute("data-end", lesson.end);
    div.setAttribute("data-day", day);

    div.innerHTML = `
      <div class="time">${lesson.start}</div>
      <div class="subject">${lesson.subject}</div>
      <div class="time">${lesson.end}</div>
    `;

    dayDiv.appendChild(div);
  });

  weekEl.appendChild(dayDiv);
});

// ======================
// AUTO SCROLL TILL IDAG
// ======================

function scrollToToday() {
  const now = new Date();
  const days = ["Söndag","Måndag","Tisdag","Onsdag","Torsdag","Fredag","Lördag"];
  const todayName = days[now.getDay()];
  const todayElement = document.querySelector(`.day[data-day="${todayName}"]`);
  
  if (todayElement) {
    todayElement.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest"
    });
  }
}

scrollToToday();

// ======================
// LIVE SYSTEM
// ======================

function timeToMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function updateLive() {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const days = ["Söndag","Måndag","Tisdag","Onsdag","Torsdag","Fredag","Lördag"];
  const todayName = days[now.getDay()];

  const titleSpan = dayTitleEl.querySelector("span");
if (titleSpan) titleSpan.textContent = todayName;
  
  
  document.querySelectorAll(".lesson").forEach(l => l.classList.remove("current"));

  if (!schema[todayName]) {
    liveInfo.innerHTML = `<i class="fa-solid fa-house"></i> Ingen skola idag`;
    return;
  }

  const todayLessons = schema[todayName];
  let currentLesson = null;
  let nextLesson = null;

  for (let lesson of todayLessons) {
    const start = timeToMinutes(lesson.start);
    const end = timeToMinutes(lesson.end);

    if (nowMinutes >= start && nowMinutes < end) {
      currentLesson = lesson;
    }

    if (nowMinutes < start && !nextLesson) {
      nextLesson = lesson;
    }
  }

  if (currentLesson) {
    const end = timeToMinutes(currentLesson.end);
    const minutesLeft = end - nowMinutes;

    document.querySelectorAll(`.lesson[data-day="${todayName}"]`).forEach(div => {
      if (div.getAttribute("data-start") === currentLesson.start) {
        div.classList.add("current");
      }
    });

    liveInfo.innerHTML = `
      <i class="fa-solid fa-circle-play"></i>
      Nu: ${currentLesson.subject}<br>
      <small>Slutar om ${minutesLeft} min</small>
    `;

  } else if (nextLesson) {
    const start = timeToMinutes(nextLesson.start);
    const minutesUntil = start - nowMinutes;

    liveInfo.innerHTML = `
      <i class="fa-solid fa-bell"></i>
      Nästa: ${nextLesson.subject}<br>
      <small>Börjar om ${minutesUntil} min</small>
    `;

  } else {
    liveInfo.innerHTML = `
      <i class="fa-solid fa-flag-checkered"></i>
      Skoldagen är slut
    `;
  }
}

updateLive();
setInterval(updateLive, 30000);
