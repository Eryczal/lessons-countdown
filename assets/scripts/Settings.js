import { colors } from "./data/colors.js";
import { eventDialogTemplate } from "./templates/eventDialogTemplate.js";
import { floatingMenuTemplate } from "./templates/floatingMenuTemplate.js";

class Settings {
    static data = {
        menuVisible: false,
        colorPickerVisible: false,
        darkMode: false,
        invertColors: false,
        lang: "pl",
        editMode: false,
    };

    static addEventsHolder(eventsHolder) {
        this.eventsHolder = eventsHolder;
    }

    static init() {
        this.eventHandlers = new Map();
        document.getElementById("menu-button").addEventListener("click", (e) => this.showMenu(e));
        document.getElementById("edit-mode").addEventListener("click", (e) => this.changeEditMode(e));
        document.getElementById("dark-mode").addEventListener("click", (e) => this.changeDarkMode(e));
        document.getElementById("invert-colors").addEventListener("click", (e) => this.invertColors(e));

        this.updateSettingsEvents("add");

        document.getElementById("dummy-event").addEventListener("click", (e) => this.clickAddEvent(e));
        document.getElementById("dialog").addEventListener("click", (e) => this.clickDialog(e));
        document.getElementById("dialog-close-button").addEventListener("click", (e) => this.closeDialog(e));
        document.getElementById("dialog-submit-button").addEventListener("click", (e) => this.submitDialog(e));

        const colorPicker = document.getElementById("dialog-color-picker");

        document.getElementById("dialog-color").addEventListener("click", (e) => this.showColorPicker(e));

        let css = "";

        colors.forEach((color, i) => {
            document
                .getElementById("dialog-color-picker")
                .insertAdjacentHTML("beforeend", `<div id="dialog-color-option-${i}" class="dialog-color-option countdown-color-${i}"></div>`);
            document.getElementById(`dialog-color-option-${i}`).addEventListener("click", (e) => this.setDialogColor(e, i));

            css += `
                .countdown-color-${i}::before {
                    background: linear-gradient(to right, ${color.join(", ")})
                }
            `;
        });

        document.getElementById("countdown-colors").innerHTML = css;

        this.loadData();
    }

    static clickAddEvent(e) {
        eventDialogTemplate(null);
    }

    static clickEditEvent(e, event) {
        this.updateFloatingEvents(e, event, "remove");

        this.closeMenu(event.id);

        eventDialogTemplate(event);
    }

    static clickRemoveEvent(e, event) {
        this.updateFloatingEvents(e, event, "remove");

        this.closeMenu(event.id);

        this.updateSettingsEvents("remove");
        this.eventsHolder.removeEventById(event.id);
        this.updateSettingsEvents("add");
    }

    static clickEventSettings(e, event) {
        const nextElement = e.currentTarget.nextElementSibling;

        if (nextElement) {
            this.updateFloatingEvents(e, event, "remove");
            this.closeMenu(nextElement);
            return;
        }

        floatingMenuTemplate(e.currentTarget, event);
        this.updateFloatingEvents(e, event, "add");
    }

    static showMenu(e) {
        this.data.menuVisible = !this.data.menuVisible;

        document.getElementById("aside").classList.toggle("open", this.data.menuVisible);
        document.getElementById("main").classList.toggle("shrinked", this.data.menuVisible);
    }

    static showColorPicker(e) {
        this.data.colorPickerVisible = !this.data.colorPickerVisible;

        document.getElementById("dialog-color-picker").classList.toggle("open", this.data.colorPickerVisible);
    }

    static setDialogColor(e, i) {
        const dialogColor = document.getElementById("dialog-color");

        if (dialogColor.dataset.value !== undefined) {
            document.getElementById("dialog-color").classList.remove(`countdown-color-${dialogColor.dataset.value}`);
        }
        document.getElementById("dialog-color").classList.add(`countdown-color-${i}`);
        document.getElementById("dialog-color").dataset.value = i;
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

    static loadData() {
        if (localStorage.getItem("settings")) {
            const data = JSON.parse(localStorage.getItem("settings"));

            this.data.lang = data.lang;
            this.data.invertColors = data.invertColors;
        }

        this.data.darkMode = document.getElementsByTagName("body")[0].classList.contains("dark");

        document.getElementById("dark-mode").checked = this.data.darkMode;
        document.getElementById("invert-colors").checked = this.data.invertColors;
    }

    static saveData() {
        const data = {
            darkMode: this.data.darkMode,
            lang: this.data.lang,
            invertColors: this.data.invertColors,
        };

        localStorage.setItem("settings", JSON.stringify(data));
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

    static closeMenu(elem) {
        const element = typeof elem === "number" ? document.getElementById(`floating-menu-${elem}`) : elem;

        element.classList.remove("active");
        element.addEventListener(
            "transitionend",
            (e) => {
                element.remove();
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
            color: document.getElementById("dialog-color").dataset.value,
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

        this.eventsHolder.addCountdownEvent(data.id, data.name, data.creationDate, data.startDate, data.duration, data.repeating, data.color);

        if (eventId === "null") {
            this.updateSettingsEvents("add", this.eventsHolder.getEventById(data.id));
        }
    }

    static changeEditMode(e) {
        this.data.editMode = e.currentTarget.checked;

        this.eventsHolder.events.forEach((event) => {
            document.getElementById(`event-settings-button-${event.id}`).classList.toggle("active", this.data.editMode);
        });

        if (!this.data.editMode) {
            [...document.getElementsByClassName("floating-menu")].forEach((menu) => {
                this.closeMenu(menu);
            });
        }

        document.getElementById("dummy-event").classList.toggle("active", this.data.editMode);
    }

    static changeDarkMode(e) {
        this.data.darkMode = e.currentTarget.checked;

        document.getElementsByTagName("body")[0].classList.toggle("dark", this.data.darkMode);

        this.saveData();
    }

    static invertColors(e) {
        this.data.invertColors = e.currentTarget.checked;

        this.eventsHolder.events.forEach((event) => {
            if (event.started()) {
                document.getElementById(`event-bar-${event.id}`).classList.toggle("inverted", this.data.invertColors);
            }
        });

        this.saveData();
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
