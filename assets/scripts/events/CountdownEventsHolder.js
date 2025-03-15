import { CountdownEvent } from "./CountdownEvent.js";
import { differenceTemplate } from "../templates/differenceTemplate.js";

class CountdownEventsHolder {
    constructor() {
        this.events = [new CountdownEvent("test", new Date(), 360, true, 0), new CountdownEvent("test2", new Date("2025-05-21 17:00"), 50, true, 1)];

        this.loadEvents();
        this.timer = setInterval(() => this.showEvents(), 100);
    }

    loadEvents() {
        if (localStorage.getItem("events") !== null) {
            let data = JSON.parse(localStorage.getItem("events"));

            data.forEach((event) => {
                this.events[i] = new CountdownEvent(event.name, event.startDate, event.duration, event.repeating, event.color);
            });
        }
    }

    showEvents() {
        document.getElementById("main").innerHTML = this.events
            .map((event) => {
                const data = {
                    diff: event.getTimeDifference(),
                    started: event.started(),
                };

                return differenceTemplate(data);
            })
            .join("");
    }
}

export { CountdownEventsHolder };
