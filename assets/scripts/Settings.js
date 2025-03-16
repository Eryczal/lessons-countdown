import { editEventTemplate } from "./templates/editEventTemplate.js";

class Settings {
    static data = {
        theme: "light",
        lang: "pl",
        editMode: false,
    };

    static addEventsHolder(eventsHolder) {
        this.eventsHolder = eventsHolder;
    }

    static init() {
        document.getElementById("edit-mode").addEventListener("click", (e) => this.changeEditMode(e));

        this.eventsHolder.events.forEach((event) => {
            document.getElementById(`event-settings-button-${event.id}`).addEventListener("click", (e) => this.clickEventSettings(e));
        });

        document.getElementById("dummy-event").addEventListener("click", (e) => this.clickAddEvent(e));
    }

    static clickAddEvent(e) {
        editEventTemplate(null, this.eventsHolder);
    }

    static clickEventSettings(e) {}

    static changeEditMode(e) {
        this.editMode = e.currentTarget.checked;

        this.eventsHolder.events.forEach((event) => {
            document.getElementById(`event-settings-button-${event.id}`).classList.toggle("active", this.editMode);
        });

        document.getElementById("dummy-event").classList.toggle("active", this.editMode);
    }
}

export { Settings };
