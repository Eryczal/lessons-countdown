import CountdownEvent from "./CountdownEvent.js";
import templates from "./templates.js";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const colors = [
	["#0f0", "#ff0", "#f00"],
	["#bdc3c7", "#2c3e50"],
	["#fdbb2d", "#b21f1f", "#1a2a6c"],
	["#00ceff", "#0052ff", "#4800ff", "#ef00ff", "#ff0000"],
	["#d2d9ff", "#0024ff"],
];

var events = [];

var eventsTimer;

var settings = {};

if (localStorage.getItem("events") !== null) {
	let t = JSON.parse(localStorage.getItem("events"));
	for (let i = 0; i < t.length; i++) {
		events[i] = new CountdownEvent(t[i].name, t[i].day, t[i].sH, t[i].sM, t[i].eH, t[i].eM);
	}
}

if (localStorage.getItem("settings") !== null) {
	settings = JSON.parse(localStorage.getItem("settings"));
	document.getElementById("group_day").checked = settings.groupDay;
	document.getElementById("dark_mode").checked = settings.darkMode;
	document.getElementById("invert_color").checked = settings.invertColor;
	document.getElementById("edit_mode").checked = settings.editMode;
} else {
	settings = {
		groupDay: false,
		darkMode: false,
		invertColor: true,
		editMode: false,
		barColor: 0,
	};
}

var weekTime = 604800000;

function initEvents() {
	document.getElementById("main").innerHTML = "";
	for (let i = 0; i < 7; i++) {
		document.getElementById("main").insertAdjacentHTML("beforeend", '<div id="weekDay' + (i + 1) + '"></div>');
	}
	for (let i = 0; i < events.length; i++) {
		insertHTML("weekDay" + events[i].day, templates.countdownEvent, { id: i }, "beforeend");
	}
	eventsTimer = setInterval(showEvents, 16);
}

function showEvents() {
	let date = new Date();

	for (let i = 0; i < events.length; i++) {
		let targetDate = new Date();
		if (events[i].started(date)) {
			targetDate.setHours(events[i].eH, events[i].eM, 0, 0);

			let [dLeft, hLeft, mLeft, sLeft, msLeft, difference] = calculateTimeDifference(targetDate, date);

			let percentage = ((events[i].duration() - difference) * 100) / events[i].duration();

			updateCountdownBar(0, i, percentage, false, hLeft, mLeft, sLeft, msLeft);
		} else {
			targetDate.setDate(targetDate.getDate() + ((events[i].day + 7 - targetDate.getDay()) % 7));
			if (date.getDay() == events[i].day && (date.getHours() > events[i].eH || (date.getHours() == events[i].eH && date.getMinutes() >= events[i].eM))) {
				targetDate.setDate(targetDate.getDate() + 7);
			}
			targetDate.setHours(events[i].sH, events[i].sM, 0, 0);

			let [dLeft, hLeft, mLeft, sLeft, msLeft, difference] = calculateTimeDifference(targetDate, date);

			let percentage = ((weekTime - events[i].duration() - difference) * 100) / (weekTime - events[i].duration());

			updateCountdownBar(1, i, percentage, dLeft, hLeft, mLeft, sLeft);
		}
	}
}

function calculateTimeDifference(targetDate, date) {
	let initialDifference,
		difference = targetDate - date;
	let dLeft = Math.floor(difference / (1000 * 60 * 60 * 24));
	difference -= dLeft * (1000 * 60 * 60 * 24);
	let hLeft = Math.floor(difference / (1000 * 60 * 60));
	difference -= hLeft * (1000 * 60 * 60);
	let mLeft = Math.floor(difference / (1000 * 60));
	difference -= mLeft * (1000 * 60);
	let sLeft = Math.floor(difference / 1000);
	difference -= sLeft * 1000;
	return [dLeft, hLeft, mLeft, sLeft, difference, initialDifference];
}

function updateCountdownBar(type, i, percentage, dLeft, hLeft, mLeft, sLeft, msLeft = false) {
	let text = type === 0 ? " ending in:" : " starting in:";

	if (type === 0) {
		checkInverted();
	} else {
		colorBar(i);
	}

	document.getElementById("countdown_text_" + i).innerText = events[i].name + text;
	document.getElementById("countdown_time_" + i).innerText = displayDate(dLeft, hLeft, mLeft, sLeft, msLeft);
	document.getElementById("bar_text_" + i).innerText = percentage.toFixed(4) + "%";
	document.getElementById("bar_cover_" + i).style.width = 100 - percentage + "%";
}

function displayDate(dL, hL, mL, sL, m) {
	let text = "";
	if (dL !== false && dL > 0) {
		text = dL == 1 ? dL + " day, " : dL + " days, ";
	}
	if (dL > 0 || hL > 0) {
		text += hL >= 10 ? hL : "0" + hL;
		if (hL == 1) {
			text += " hour, ";
		} else if (hL % 10 >= 2 && hL % 10 <= 4 && !(hL >= 12 && hL <= 14)) {
			text += " hours, ";
		} else {
			text += " hours, ";
		}
	}
	if (dL > 0 || hL > 0 || mL > 0) {
		text += mL >= 10 ? mL : "0" + mL;
		if (mL == 1) {
			text += " minute, ";
		} else if (mL % 10 >= 2 && mL % 10 <= 4 && !(mL >= 12 && mL <= 14)) {
			text += " minutes, ";
		} else {
			text += " minutes, ";
		}
	}
	text += sL >= 10 ? sL : "0" + sL;
	if (typeof m != "undefined") {
		text += `:${m.toString().padStart(4, "0")}`;
	}
	if (sL == 1) {
		text += " second.";
	} else if (sL % 10 >= 2 && sL % 10 <= 4 && !(sL >= 12 && sL <= 14)) {
		text += " seconds.";
	} else {
		text += " seconds.";
	}
	return text;
}

document.getElementById("more_button").addEventListener("click", moreButtonClick);
document.getElementById("dark_mode").addEventListener("click", darkModeClick);
document.getElementById("group_day").addEventListener("click", groupDayClick);
document.getElementById("invert_color").addEventListener("click", invertColorClick);
document.getElementById("edit_mode").addEventListener("click", editModeClick);

function moreButtonClick() {
	document.getElementById("aside").classList.toggle("visible");
	document.getElementById("main").classList.toggle("shrinked");
	document.getElementById("main_header").classList.toggle("shrinked");
}

function groupDayClick(event) {
	settings.groupDay = event.currentTarget.checked;
	localStorage.setItem("settings", JSON.stringify(settings));
	checkGroup();
}

function darkModeClick(event) {
	settings.darkMode = event.currentTarget.checked;
	localStorage.setItem("settings", JSON.stringify(settings));
	checkDarkMode();
}

function invertColorClick(event) {
	settings.invertColor = event.currentTarget.checked;
	localStorage.setItem("settings", JSON.stringify(settings));
	colorBar(-1);
	checkInverted();
}

function editModeClick(event) {
	settings.editMode = event.currentTarget.checked;
	localStorage.setItem("settings", JSON.stringify(settings));
	checkEditMode();
}

function barColorClick(event) {
	settings.barColor = event.currentTarget.value;
	localStorage.setItem("settings", JSON.stringify(settings));
	colorBar(-1);
	checkInverted();
}

function checkGroup() {
	for (let i = 0; i < 7; i++) {
		if (settings.groupDay) {
			insertHTML("weekDay" + (i + 1), templates.weekDay, { id: i + 1, dayName: days[i] }, "afterbegin");
		} else {
			let element = document.getElementById("weekDay" + (i + 1) + "_name");

			if (element) {
				element.remove();
			}
		}
	}
}

function checkDarkMode() {
	document.getElementsByTagName("html")[0].classList.toggle("dark", settings.darkMode);
}

function checkInverted() {
	for (let i = 0; i < events.length; i++) {
		if (settings.invertColor) {
			if (events[i].started(new Date())) {
				colorBar(i, true);
			}
		}
	}
}

function checkEditMode() {
	if (settings.editMode) {
		clearInterval(eventsTimer);
		document.getElementById("main").innerHTML = templates.editModeTable;

		for (let i = 0; i < events.length; i++) {
			let args = {
				id: i,
				eventName: events[i].name,
				eventDay: events[i].day,
				eventStartingHour: events[i].sH,
				eventStartingMinute: events[i].sM,
				eventEndingHour: events[i].eH,
				eventEndingMinute: events[i].eM,
			};

			insertHTML("edit_table", templates.editModeDay, args, "beforeend");

			addDayEvents(i);
		}
		document.getElementById("main").insertAdjacentHTML("beforeend", `<input type="button" id="add_event" value="Add">`);
		document.getElementById("add_event").addEventListener("click", addEventClick);
	} else {
		for (let i = 0; i < events.length; i++) {
			if (document.getElementById("event_name_" + i)) {
				removeDayEvents(i);
			}
		}
		if (document.getElementById("add_event")) {
			document.getElementById("add_event").removeEventListener("click", addEventClick);
			initEvents();
		}
	}
}

function removeEventClick(event) {
	for (let i = 0; i < events.length; i++) {
		removeDayEvents(i);
		if (parseInt(event.currentTarget.id.replace("event_remove_", "")) == i) {
			events.splice(i, 1);
		}
	}
	document.getElementById("add_event").removeEventListener("click", addEventClick);
	localStorage.setItem("events", JSON.stringify(events));
	checkEditMode();
}

function changeEventName(event) {
	events[parseInt(event.currentTarget.id.replace("event_name_", ""))].name = event.currentTarget.value;
	localStorage.setItem("events", JSON.stringify(events));
}

function changeEventDay(event) {
	if (parseInt(event.currentTarget.value) > 0 && parseInt(event.currentTarget.value) <= 7) {
		events[parseInt(event.currentTarget.id.replace("event_day_", ""))].day = parseInt(event.currentTarget.value);
		localStorage.setItem("events", JSON.stringify(events));
	}
}

function changeEventStartHour(event) {
	if (parseInt(event.currentTarget.value) >= 0 && parseInt(event.currentTarget.value) <= 23) {
		events[parseInt(event.currentTarget.id.replace("event_start_hour_", ""))].sH = parseInt(event.currentTarget.value);
		localStorage.setItem("events", JSON.stringify(events));
	}
}

function changeEventStartMinute(event) {
	if (parseInt(event.currentTarget.value) >= 0 && parseInt(event.currentTarget.value) <= 59) {
		events[parseInt(event.currentTarget.id.replace("event_start_minute_", ""))].sM = parseInt(event.currentTarget.value);
		localStorage.setItem("events", JSON.stringify(events));
	}
}

function changeEventEndHour(event) {
	if (parseInt(event.currentTarget.value) >= 0 && parseInt(event.currentTarget.value) <= 23) {
		events[parseInt(event.currentTarget.id.replace("event_end_hour_", ""))].eH = parseInt(event.currentTarget.value);
		localStorage.setItem("events", JSON.stringify(events));
	}
}

function changeEventEndMinute(event) {
	if (parseInt(event.currentTarget.value) >= 0 && parseInt(event.currentTarget.value) <= 59) {
		events[parseInt(event.currentTarget.id.replace("event_end_minute_", ""))].eM = parseInt(event.currentTarget.value);
		localStorage.setItem("events", JSON.stringify(events));
	}
}

function addEventClick() {
	let l = events.length;
	events[l] = new CountdownEvent("Name", 1, 0, 0, 0, 0);
	localStorage.setItem("events", JSON.stringify(events));

	let args = {
		id: l,
		eventName: events[l].name,
		eventDay: events[l].day,
		eventStartingHour: events[l].sH,
		eventStartingMinute: events[l].sM,
		eventEndingHour: events[l].eH,
		eventEndingMinute: events[l].eM,
	};

	insertHTML("edit_table", templates.editModeDay, args, "beforeend");

	addDayEvents(l);
}

function colorBar(id, r) {
	let bg = "linear-gradient(to " + (r ? "left" : "right");
	for (let i = 0; i < colors[settings.barColor].length; i++) {
		bg += ", " + colors[settings.barColor][i];
	}
	bg += ")";
	if (id >= 0) {
		document.getElementById("countdown_bar_" + id).style.backgroundImage = bg;
	} else {
		for (let i = 0; i < events.length; i++) {
			document.getElementById("countdown_bar_" + i).style.backgroundImage = bg;
		}
	}
}

function addDayEvents(id) {
	document.getElementById("event_name_" + id).addEventListener("keyup", changeEventName);
	document.getElementById("event_day_" + id).addEventListener("keyup", changeEventDay);
	document.getElementById("event_start_hour_" + id).addEventListener("keyup", changeEventStartHour);
	document.getElementById("event_start_minute_" + id).addEventListener("keyup", changeEventStartMinute);
	document.getElementById("event_end_hour_" + id).addEventListener("keyup", changeEventEndHour);
	document.getElementById("event_end_minute_" + id).addEventListener("keyup", changeEventEndMinute);
	document.getElementById("event_remove_" + id).addEventListener("click", removeEventClick);
}

function removeDayEvents(id) {
	document.getElementById("event_name_" + id).removeEventListener("keyup", changeEventName);
	document.getElementById("event_day_" + id).removeEventListener("keyup", changeEventDay);
	document.getElementById("event_start_hour_" + id).removeEventListener("keyup", changeEventStartHour);
	document.getElementById("event_start_minute_" + id).removeEventListener("keyup", changeEventStartMinute);
	document.getElementById("event_end_hour_" + id).removeEventListener("keyup", changeEventEndHour);
	document.getElementById("event_end_minute_" + id).removeEventListener("keyup", changeEventEndMinute);
	document.getElementById("event_remove_" + id).removeEventListener("click", removeEventClick);
}

let bg;
for (let i = 0; i < colors.length; i++) {
	insertHTML("select_temp_bar", templates.barColorSelect, { id: i, checked: settings.barColor == i ? "checked" : "" }, "beforeend");

	document.getElementsByName("bar_color")[i].addEventListener("click", barColorClick);
	bg = "linear-gradient(to right";
	for (let j = 0; j < colors[i].length; j++) {
		bg += ", " + colors[i][j];
	}
	bg += ")";
	document.getElementById("temp_bar" + i).style.backgroundImage = bg;
}
checkDarkMode();
initEvents();
checkEditMode();
checkInverted();
if (events.length > 0 && !settings.editMode) {
	colorBar(-1);
	checkGroup();
}

function insertHTML(id, template, args, position = "beforeend") {
	let result = template.replace(/%([a-zA-Z]+)/g, (match, key) => args[key]);

	document.getElementById(id).insertAdjacentHTML(position, result);
}
