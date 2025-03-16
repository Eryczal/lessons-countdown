import { CountdownEvent } from "./CountdownEvent.js";
import { eventContentTemplate } from "../templates/eventContentTemplate.js";
import { eventTemplate } from "../templates/eventTemplate.js";

class CountdownEventsHolder {
    constructor() {
        this.events = [];

        this.loadEvents();
        this.showEvents();
        this.timer = setInterval(() => this.updateEvents(), 100);
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
        this.events.push(new CountdownEvent(id, name, creationDate, startDate, duration, repeating, color));
        eventTemplate("dummy-event", this.events[this.events.length - 1].getData());
        this.saveEvents();
    }

    updateEvents() {
        this.events.forEach((event) => {
            eventContentTemplate(event.getData());
        });
    }

    getFreeId() {
        const usedIds = new Set(this.events.map((event) => event.id));

        let id = 0;
        while (usedIds.has(id)) {
            id++;
        }

        return id;
    }
}

export { CountdownEventsHolder };
