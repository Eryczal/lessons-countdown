import { Settings } from "../Settings.js";

const eventContentTemplate = (data) => {
    const { days, hours, minutes, seconds } = data.diff;

    let parts = [];

    if (days > 0) {
        parts.push(`${days} ${days === 1 ? "day" : "days"},`);
    }

    if (days > 0 || hours > 0) {
        parts.push(`${String(hours).padStart(2, "0")} ${hours === 1 ? "hour" : "hours"},`);
    }

    if (days > 0 || hours > 0 || minutes > 0) {
        parts.push(`${String(minutes).padStart(2, "0")} ${minutes === 1 ? "minute" : "minutes"},`);
    }

    if (days > 0 || hours > 0 || minutes > 0 || seconds > 0) {
        parts.push(`${String(seconds).padStart(2, "0")} ${seconds === 1 ? "second" : "seconds"}.`);
    }

    const startedTemplate = `${data.started ? "Ending" : "Starting"} in:`;

    const infoTemplate = `
        <div class="event-difference-info"> 
            <div id="event-difference-header-${data.id}" class="event-difference-header">
                ${startedTemplate}
            </div>
            <div id="event-difference-time-${data.id}" class="event-difference-time">
                ${parts.join(" ")}
            </div>
        </div>
    `;

    const barTemplate = `
        <div id="event-bar-${data.id}" class="event-countdown-bar countdown-color-${data.color} ${
        data.started && Settings.data.invertColors ? "inverted" : ""
    }">
            <div id="event-bar-cover-${data.id}" class="event-bar-cover" style="width: ${100 - data.percentage}%"></div>
            <div id="event-bar-text-${data.id}" class="event-bar-text">${data.percentage.toFixed(4)}%</div>
        </div>
    `;

    const infoContainer = document.getElementById(`event-top-info-${data.id}`);
    const barContainer = document.getElementById(`event-bar-container-${data.id}`);

    if (!infoContainer.querySelector(".event-difference-info") && !barContainer.hasChildNodes()) {
        infoContainer.insertAdjacentHTML("beforeend", infoTemplate);
        barContainer.insertAdjacentHTML("beforeend", barTemplate);
    } else {
        document.getElementById(`event-difference-header-${data.id}`).textContent = parts.length === 0 ? "Already ended." : startedTemplate;
        document.getElementById(`event-difference-time-${data.id}`).textContent = parts.join(" ");
        document.getElementById(`event-bar-cover-${data.id}`).style.width = 100 - data.percentage + "%";
        document.getElementById(`event-bar-text-${data.id}`).textContent = data.percentage.toFixed(4) + "%";

        if (Settings.data.invertColors) {
            document.getElementById(`event-bar-${data.id}`).classList.toggle("inverted", data.started);
        }
    }
};

export { eventContentTemplate };
