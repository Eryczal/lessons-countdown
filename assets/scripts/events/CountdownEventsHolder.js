import { CountdownEvent } from "./CountdownEvent.js";
import { eventContentTemplate } from "../templates/eventContentTemplate.js";
import { eventTemplate } from "../templates/eventTemplate.js";

class CountdownEventsHolder {
    constructor() {
        this.events = [];

        this.loadEvents();
        this.showEvents();
        this.timer = null;
        this.timerController = setInterval(() => this.checkTimeController(), 10000);

        this.checkTimeController();
    }

    loadEvents() {
        if (localStorage.getItem("events") !== null) {
            let data = JSON.parse(localStorage.getItem("events"));

            data.forEach((event, i) => {
                this.events[i] = new CountdownEvent(
                    i,
                    event.name,
                    new Date(event.creationDate),
                    new Date(event.startDate),
                    event.duration,
                    event.repeating,
                    event.color
                );
            });
        }
    }

    saveEvents() {
        const data = JSON.stringify(this.events);

        localStorage.setItem("events", data);
    }

    showEvents() {
        this.events.forEach((event) => {
            eventTemplate("main", event.getData());
        });

        document.getElementById("main").insertAdjacentHTML("beforeend", `<div class="dummy-event" id="dummy-event">Add new countdown</div>`);
    }

    addCountdownEvent(id, name, creationDate, startDate, duration, repeating, color) {
        const event = this.getEventById(id);

        if (event) {
            event.updateData(name, creationDate, startDate, duration, repeating, color);
        } else {
            this.events.push(new CountdownEvent(id, name, creationDate, startDate, duration, repeating, color));
            eventTemplate("dummy-event", this.events[this.events.length - 1].getData());
        }

        this.saveEvents();
    }

    updateEvents() {
        this.events.forEach((event) => {
            eventContentTemplate(event.getData());
        });
    }

    getEventById(id) {
        return this.events.find((event) => event.id === parseInt(id));
    }

    removeEventById(id) {
        this.events = this.events.filter((event) => event.id !== parseInt(id));

        const event = document.getElementById(`event-${id}`);
        const height = event.offsetHeight + "px";

        event.style.height = height;

        setTimeout(() => {
            event.style.height = 0;
            event.addEventListener(
                "transitionend",
                () => {
                    event.remove();
                },
                { once: true }
            );
        }, 5);

        this.saveEvents();
    }

    getFreeId() {
        const usedIds = new Set(this.events.map((event) => event.id));

        let id = 0;
        while (usedIds.has(id)) {
            id++;
        }

        return id;
    }

    checkTimeController() {
        const minTime = Math.min(...this.events.map((event) => event.getWaitingTime(true)).filter((time) => time !== null));
        const refreshTime = Math.max(10, Math.min(1000, minTime / 300000));

        clearInterval(this.timer);
        this.timer = setInterval(() => this.updateEvents(), refreshTime);
    }
}

export { CountdownEventsHolder };
