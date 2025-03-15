import { CountdownEvent } from "./CountdownEvent.js";
import { eventContentTemplate } from "../templates/eventContentTemplate.js";
import { eventTemplate } from "../templates/eventTemplate.js";

class CountdownEventsHolder {
    constructor() {
        this.events = [
            new CountdownEvent(0, "test", new Date("2025-02-18 19:00"), new Date(), 360, true, 0),
            new CountdownEvent(1, "test2", new Date("2025-02-21 17:00"), new Date("2025-05-21 17:00"), 50, true, 1),
        ];

        this.loadEvents();
        this.showEvents();
        this.timer = setInterval(() => this.updateEvents(), 100);
    }

    loadEvents() {
        if (localStorage.getItem("events") !== null) {
            let data = JSON.parse(localStorage.getItem("events"));

            data.forEach((event, i) => {
                this.events[i] = new CountdownEvent(i, event.name, event.startDate, event.duration, event.repeating, event.color);
            });
        }
    }

    showEvents() {
        document.getElementById("main").innerHTML = this.events
            .map((event) => {
                return eventTemplate(event.getData());
            })
            .join("");
    }

    updateEvents() {
        this.events.forEach((event) => {
            document.getElementById(`event-content-${event.id}`).innerHTML = eventContentTemplate(event.getData());
        });
    }
}

export { CountdownEventsHolder };
