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
        document.getElementById("dialog").addEventListener("click", (e) => this.clickDialog(e));
        document.getElementById("dialog-close-button").addEventListener("click", (e) => this.closeDialog(e));
        document.getElementById("dialog-submit-button").addEventListener("click", (e) => this.submitDialog(e));
    }

    static clickAddEvent(e) {
        editEventTemplate(null, this.eventsHolder);
    }

    static clickEventSettings(e) {}

    static clickDialog(e) {
        const dialog = document.getElementById("dialog");

        if (e.target === dialog) {
            const rect = dialog.getBoundingClientRect();

            const isInDialog = rect.top <= e.clientY && e.clientY <= rect.bottom && rect.left <= e.clientX && e.clientX <= rect.right;

            if (!isInDialog) {
                dialog.classList.remove("open");
                dialog.addEventListener(
                    "transitionend",
                    (e) => {
                        dialog.close();
                    },
                    { once: true }
                );
            }
        }
    }

    static closeDialog(e) {
        dialog.classList.remove("open");

        dialog.addEventListener(
            "transitionend",
            (e) => {
                document.getElementById("dialog").close();
            },
            { once: true }
        );
    }

    static submitDialog(e) {
        let data = {
            name: document.getElementById("dialog-name").value,
            startDate: document.getElementById("dialog-start-date").value,
            duration: document.getElementById("dialog-duration").value,
            color: document.getElementById("dialog-color"),
            repeating: document.getElementById("dialog-repeating").checked,
        };

        if (!data.name || !data.startDate || !data.duration) {
            return;
        }

        data.id = this.eventsHolder.getFreeId();
        data.creationDate = new Date();
        data.creationDate.setSeconds(0);
        data.creationDate.setMilliseconds(0);

        data.startDate = new Date(data.startDate);
        data.startDate.setSeconds(0);
        data.startDate.setMilliseconds(0);

        const [hours, minutes] = data.duration.split(":").map(Number);
        data.duration = hours * 60 + minutes;

        data.color = 0;

        this.eventsHolder.addCountdownEvent(data.id, data.name, data.creationDate, data.startDate, data.duration, data.repeating, data.color);
    }

    static changeEditMode(e) {
        this.editMode = e.currentTarget.checked;

        this.eventsHolder.events.forEach((event) => {
            document.getElementById(`event-settings-button-${event.id}`).classList.toggle("active", this.editMode);
        });

        document.getElementById("dummy-event").classList.toggle("active", this.editMode);
    }
}

export { Settings };
