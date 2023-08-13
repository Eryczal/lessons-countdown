import templates from "./templates.js";
import CountdownEvent from "./CountdownEvent.js";
import { insertHTML } from "./utils.js";

class EditMode {
	constructor(settings) {
		this.settings = settings;
		this.eventsHolder = this.settings.eventsHolder;
		this.addEventClick = this.addEventClick.bind(this);

		this.events = {
			changeEventName: ["keyup", this.changeEventName.bind(this)],
			changeEventDay: ["keyup", this.changeEventDay.bind(this)],
			changeEventStartingHour: ["keyup", this.changeEventStartingHour.bind(this)],
			changeEventStartingMinute: ["keyup", this.changeEventStartingMinute.bind(this)],
			changeEventEndingHour: ["keyup", this.changeEventEndingHour.bind(this)],
			changeEventEndingMinute: ["keyup", this.changeEventEndingMinute.bind(this)],
			removeEventClick: ["click", this.removeEventClick.bind(this)],
		};
	}

	checkEditMode() {
		if (this.settings.editMode) {
			clearInterval(this.settings.eventsTimer);
			document.getElementById("main").innerHTML = templates.editModeTable;

			for (let i = 0; i < this.eventsHolder.events.length; i++) {
				let event = this.eventsHolder.events[i];

				let args = {
					id: i,
					eventName: event.name,
					eventDay: event.day,
					eventStartingHour: event.startingHour,
					eventStartingMinute: event.startingMinute,
					eventEndingHour: event.endingHour,
					eventEndingMinute: event.endingMinute,
				};

				insertHTML("edit_table", templates.editModeDay, args, "beforeend");

				this.addDayEvents(i);
			}
			document.getElementById("main").insertAdjacentHTML("beforeend", `<input type="button" id="add_event" value="Add">`);
			document.getElementById("add_event").addEventListener("click", this.addEventClick);
		} else {
			for (let i = 0; i < this.eventsHolder.events.length; i++) {
				if (document.getElementById("event_name_" + i)) {
					this.removeDayEvents(i);
				}
			}
			if (document.getElementById("add_event")) {
				document.getElementById("add_event").removeEventListener("click", this.addEventClick);
				this.eventsHolder.initEvents();
			}
		}
	}

	addEventClick() {
		let l = this.eventsHolder.events.length;
		this.eventsHolder.events[l] = new CountdownEvent("Name", 1, 0, 0, 0, 0);
		let event = this.eventsHolder.events[l];
		localStorage.setItem("events", JSON.stringify(this.eventsHolder.events));

		let args = {
			id: l,
			eventName: event.name,
			eventDay: event.day,
			eventStartingHour: event.startingHour,
			eventStartingMinute: event.startingMinute,
			eventEndingHour: event.endingHour,
			eventEndingMinute: event.endingMinute,
		};

		insertHTML("edit_table", templates.editModeDay, args, "beforeend");

		this.addDayEvents(l);
	}

	addDayEvents(id) {
		for (let [event, [type, listener]] of Object.entries(this.events)) {
			let elementId = event.replace(/^change/, "").replace(/([A-Z])/g, (c, g, i) => (i === 0 ? c.toLowerCase() : "_" + c.toLowerCase())) + "_" + id;
			document.getElementById(elementId).addEventListener(type, listener);
		}
	}

	removeDayEvents(id) {
		for (let [event, [type, listener]] of Object.entries(this.events)) {
			let elementId = event.replace(/^change/, "").replace(/([A-Z])/g, (c, g, i) => (i === 0 ? c.toLowerCase() : "_" + c.toLowerCase())) + "_" + id;
			document.getElementById(elementId).removeEventListener(type, listener);
		}
	}

	removeEventClick(event) {
		for (let i = 0; i < this.eventsHolder.events.length; i++) {
			this.removeDayEvents(i);
			if (parseInt(event.currentTarget.id.replace("remove_event_click_", "")) == i) {
				console.log("?");
				this.eventsHolder.events.splice(i, 1);
			}
		}
		document.getElementById("add_event").removeEventListener("click", this.addEventClick);
		localStorage.setItem("events", JSON.stringify(this.eventsHolder.events));
		this.checkEditMode();
	}

	changeEventName(event) {
		this.updateEvent(event, "name", () => true);
	}

	changeEventDay(event) {
		this.updateEvent(event, "day", (value) => value > 0 && value <= 7);
	}

	changeEventStartingHour(event) {
		this.updateEvent(event, "startingHour", (value) => value >= 0 && value <= 23);
	}

	changeEventStartingMinute(event) {
		this.updateEvent(event, "startingMinute", (value) => value >= 0 && value <= 59);
	}

	changeEventEndingHour(event) {
		this.updateEvent(event, "endingHour", (value) => value >= 0 && value <= 23);
	}

	changeEventEndingMinute(event) {
		this.updateEvent(event, "endingMinute", (value) => value >= 0 && value <= 59);
	}

	updateEvent(event, prop, validate) {
		let property = prop.replace(/([A-Z])/g, (match, p1) => "_" + p1.toLowerCase());
		let index = parseInt(event.currentTarget.id.replace(`event_${property}_`, ""));
		let value = property === "name" ? event.currentTarget.value : parseInt(event.currentTarget.value);
		if (validate(value)) {
			this.eventsHolder.events[index][prop] = value;
			localStorage.setItem("events", JSON.stringify(this.eventsHolder.events));
		}
	}
}

export default EditMode;
