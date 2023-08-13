import colors from "./colors.js";
import templates from "./templates.js";
import EditMode from "./EditMode.js";
import { insertHTML } from "./utils.js";

class Settings {
	constructor(eventsHolder) {
		this.eventsHolder = eventsHolder;
		this.editModeClass = new EditMode(this);
	}

	loadSettings() {
		if (localStorage.getItem("settings") !== null) {
			let json = JSON.parse(localStorage.getItem("settings"));
			Object.assign(this, json);

			document.getElementById("group_day").checked = this.groupDay;
			document.getElementById("dark_mode").checked = this.darkMode;
			document.getElementById("invert_color").checked = this.invertColor;
			document.getElementById("edit_mode").checked = this.editMode;
		} else {
			this.groupDay = false;
			this.darkMode = false;
			this.invertColor = true;
			this.editMode = false;
			this.barColor = 0;
		}
	}

	saveSettings() {
		localStorage.setItem(
			"settings",
			JSON.stringify(this, (key, value) => (key === "eventsHolder" || key === "editModeClass" ? undefined : value))
		);
	}

	initEventListeners() {
		document.getElementById("more_button").addEventListener("click", (event) => this.moreButtonClick(event));
		document.getElementById("dark_mode").addEventListener("click", (event) => this.darkModeClick(event));
		document.getElementById("group_day").addEventListener("click", (event) => this.groupDayClick(event));
		document.getElementById("invert_color").addEventListener("click", (event) => this.invertColorClick(event));
		document.getElementById("edit_mode").addEventListener("click", (event) => this.editModeClick(event));
	}

	drawTemplateBars() {
		let bg;
		for (let i = 0; i < colors.length; i++) {
			insertHTML("select_temp_bar", templates.barColorSelect, { id: i, checked: this.barColor == i ? "checked" : "" }, "beforeend");

			document.getElementsByName("bar_color")[i].addEventListener("click", (event) => this.barColorClick(event));
			bg = "linear-gradient(to right";
			for (let j = 0; j < colors[i].length; j++) {
				bg += ", " + colors[i][j];
			}
			bg += ")";
			document.getElementById("temp_bar" + i).style.backgroundImage = bg;
		}
	}

	moreButtonClick() {
		document.getElementById("aside").classList.toggle("visible");
		document.getElementById("main").classList.toggle("shrinked");
		document.getElementById("main_header").classList.toggle("shrinked");
	}

	groupDayClick(event) {
		this.groupDay = event.currentTarget.checked;
		this.saveSettings();
		this.checkGroup();
	}

	darkModeClick(event) {
		this.darkMode = event.currentTarget.checked;
		this.saveSettings();
		this.checkDarkMode();
	}

	invertColorClick(event) {
		this.invertColor = event.currentTarget.checked;
		this.saveSettings();
		this.colorBar(-1);
		this.checkInverted();
	}

	editModeClick(event) {
		this.editMode = event.currentTarget.checked;
		this.saveSettings();
		this.editModeClass.checkEditMode();
	}

	barColorClick(event) {
		this.barColor = event.currentTarget.value;
		this.saveSettings();
		this.colorBar(-1);
		this.checkInverted();
	}

	checkGroup() {
		const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
		for (let i = 0; i < 7; i++) {
			if (this.groupDay) {
				insertHTML("weekDay" + (i + 1), templates.weekDay, { id: i + 1, dayName: days[i] }, "afterbegin");
			} else {
				let element = document.getElementById("weekDay" + (i + 1) + "_name");

				if (element) {
					element.remove();
				}
			}
		}
	}

	checkDarkMode() {
		document.getElementsByTagName("html")[0].classList.toggle("dark", this.darkMode);
	}

	checkInverted() {
		for (let i = 0; i < this.eventsHolder.events.length; i++) {
			if (this.invertColor) {
				if (this.eventsHolder.events[i].started(new Date())) {
					this.colorBar(i, true);
				}
			}
		}
	}

	colorBar(id, r) {
		let bg = "linear-gradient(to " + (r ? "left" : "right");
		for (let i = 0; i < colors[this.barColor].length; i++) {
			bg += ", " + colors[this.barColor][i];
		}
		bg += ")";
		if (id >= 0) {
			document.getElementById("countdown_bar_" + id).style.backgroundImage = bg;
		} else {
			for (let i = 0; i < this.eventsHolder.events.length; i++) {
				document.getElementById("countdown_bar_" + i).style.backgroundImage = bg;
			}
		}
	}
}

export default Settings;
