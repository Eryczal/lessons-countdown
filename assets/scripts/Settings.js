import { eventDialogTemplate } from "./templates/eventDialogTemplate.js";
import { floatingMenuTemplate } from "./templates/floatingMenuTemplate.js";

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
        this.eventHandlers = new Map();
        document.getElementById("edit-mode").addEventListener("click", (e) => this.changeEditMode(e));

        this.updateSettingsEvents("add");

        document.getElementById("dummy-event").addEventListener("click", (e) => this.clickAddEvent(e));
        document.getElementById("dialog").addEventListener("click", (e) => this.clickDialog(e));
        document.getElementById("dialog-close-button").addEventListener("click", (e) => this.closeDialog(e));
        document.getElementById("dialog-submit-button").addEventListener("click", (e) => this.submitDialog(e));
    }

    static clickAddEvent(e) {
        eventDialogTemplate(null);
    }

    static clickEditEvent(e, event) {
        this.updateFloatingEvents(e, event, "remove");
        document.getElementById(`floating-menu-${event.id}`).remove();

        eventDialogTemplate(event);
    }

    static clickRemoveEvent(e, event) {
        this.updateFloatingEvents(e, event, "remove");
        document.getElementById(`floating-menu-${event.id}`).remove();

        this.updateSettingsEvents("remove");
        this.eventsHolder.removeEventById(event.id);
        this.updateSettingsEvents("add");
    }

    static clickEventSettings(e, event) {
        const nextElement = e.currentTarget.nextElementSibling;

        if (nextElement) {
            this.updateFloatingEvents(e, event, "remove");
            nextElement.remove();
            return;
        }

        floatingMenuTemplate(e.currentTarget, event);
        this.updateFloatingEvents(e, event, "add");
    }

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
        const eventId = e.currentTarget.dataset.eventId;
        const event = eventId === "null" ? "null" : this.eventsHolder.getEventById(eventId);

        let data = {
            id: eventId === "null" ? this.eventsHolder.getFreeId() : eventId,
            name: document.getElementById("dialog-name").value,
            creationDate: eventId === "null" ? new Date() : event.creationDate,
            startDate: document.getElementById("dialog-start-date").value,
            duration: document.getElementById("dialog-duration").value,
            color: document.getElementById("dialog-color"),
            repeating: document.getElementById("dialog-repeating").checked,
        };

        if (!data.name || !data.startDate || !data.duration) {
            return;
        }

        data.creationDate.setSeconds(0);
        data.creationDate.setMilliseconds(0);

        data.startDate = new Date(data.startDate);
        data.startDate.setSeconds(0);
        data.startDate.setMilliseconds(0);

        const [hours, minutes] = data.duration.split(":").map(Number);
        data.duration = hours * 60 + minutes;

        data.color = 0;

        this.eventsHolder.addCountdownEvent(data.id, data.name, data.creationDate, data.startDate, data.duration, data.repeating, data.color);

        if (eventId === "null") {
            this.updateSettingsEvents("add", this.eventsHolder.getEventById(data.id));
        }
    }

    static changeEditMode(e) {
        this.editMode = e.currentTarget.checked;

        this.eventsHolder.events.forEach((event) => {
            document.getElementById(`event-settings-button-${event.id}`).classList.toggle("active", this.editMode);
        });

        document.getElementById("dummy-event").classList.toggle("active", this.editMode);
    }

    static updateSettingsEvents(action, event = null) {
        const events = event ? [event] : this.eventsHolder.events;

        if (action === "add") {
            events.forEach((event) => {
                const clickHandler = (e) => this.clickEventSettings(e, event);

                document.getElementById(`event-settings-button-${event.id}`).addEventListener("click", clickHandler);

                const handlers = this.eventHandlers.get(event.id) || {};
                handlers.settingsButton = clickHandler;

                this.eventHandlers.set(event.id, handlers);
            });
        } else if (action === "remove") {
            events.forEach((event) => {
                const handlers = this.eventHandlers.get(event.id);

                if (handlers && handlers.settingsButton) {
                    document.getElementById(`event-settings-button-${event.id}`).removeEventListener("click", handlers.settingsButton);

                    delete handlers.settingsButton;
                }

                if (handlers && Object.keys(handlers).length === 0) {
                    this.eventHandlers.delete(event.id);
                } else if (handlers) {
                    this.eventHandlers.set(event.id, handlers);
                }
            });
        }
    }

    static updateFloatingEvents(e, event, action) {
        if (action === "add") {
            const editHandler = (e) => this.clickEditEvent(e, event);
            const removeHandler = (e) => this.clickRemoveEvent(e, event);

            document.getElementById(`floating-edit-${event.id}`).addEventListener("click", editHandler);
            document.getElementById(`floating-remove-${event.id}`).addEventListener("click", removeHandler);

            const handlers = this.eventHandlers.get(event.id) || {};
            handlers.floatingEdit = editHandler;
            handlers.floatingRemove = removeHandler;

            this.eventHandlers.set(event.id, handlers);
        } else if (action === "remove") {
            const handlers = this.eventHandlers.get(event.id);

            if (handlers) {
                if (handlers.floatingEdit) {
                    document.getElementById(`floating-edit-${event.id}`).removeEventListener("click", handlers.floatingEdit);
                    delete handlers.floatingEdit;
                }

                if (handlers.floatingRemove) {
                    document.getElementById(`floating-remove-${event.id}`).removeEventListener("click", handlers.floatingRemove);
                    delete handlers.floatingRemove;
                }

                if (Object.keys(handlers).length === 0) {
                    this.eventHandlers.delete(event.id);
                } else {
                    this.eventHandlers.set(event.id, handlers);
                }
            }
        }
    }
}

export { Settings };
