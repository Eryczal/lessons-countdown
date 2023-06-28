class CountdownEvent {
	constructor(name, day, sH, sM, eH, eM) {
		this.name = name;
		this.day = day;
		this.sH = sH;
		this.sM = sM;
		this.eH = eH;
		this.eM = eM;
	}

	started(date) {
		return (
			this.day == date.getDay() &&
			((date.getHours() > this.sH && date.getHours() < this.eH) ||
				(date.getHours() == this.sH && date.getMinutes() >= this.sM) ||
				(date.getHours() == this.eH && date.getMinutes() < this.eM))
		);
	}

	duration() {
		let d1 = new Date();
		let d2 = new Date();
		d1.setHours(this.sH, this.sM);
		d2.setHours(this.eH, this.eM);
		return d2 - d1;
	}
}

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
		document.getElementById("weekDay" + events[i].day).insertAdjacentHTML("beforeend", `<div id="countdown_event_${i}" class="countdown"></div>`);
		document
			.getElementById("countdown_event_" + i)
			.insertAdjacentHTML(
				"beforeend",
				`<div id="countdown_text_${i}"></div><div id="countdown_time_${i}"></div><div id="countdown_bar_${i}" class="bar bar_color1"></div>`
			);
		document
			.getElementById("countdown_bar_" + i)
			.insertAdjacentHTML(
				"beforeend",
				`<div id="bar_progress_${i}"></div><div id="bar_cover_${i}" class="bar_cover"></div><div id="bar_text_${i}" class="bar_text"></div>`
			);
	}
	eventsTimer = setInterval(showEvents, 16);
}

function showEvents() {
	let date = new Date();

	for (let i = 0; i < events.length; i++) {
		if (events[i].started(date)) {
			let targetDate = new Date();
			targetDate.setHours(events[i].eH, events[i].eM, 0, 0);

			let difference = targetDate - date;

			let percentage = ((events[i].duration() - difference) * 100) / events[i].duration();

			let hLeft = Math.floor(difference / (1000 * 60 * 60));
			difference -= hLeft * (1000 * 60 * 60);

			let mLeft = Math.floor(difference / (1000 * 60));
			difference -= mLeft * (1000 * 60);

			let sLeft = Math.floor(difference / 1000);
			difference -= sLeft * 1000;

			checkInverted();
			document.getElementById("countdown_text_" + i).innerText = events[i].name + " skończy się za:";
			document.getElementById("countdown_time_" + i).innerText = displayDate(false, hLeft, mLeft, sLeft, difference);
			document.getElementById("bar_text_" + i).innerText = percentage.toFixed(4) + "%";
			document.getElementById("bar_cover_" + i).style.width = 100 - percentage + "%";
		} else {
			let targetDate = new Date();
			targetDate.setDate(targetDate.getDate() + ((events[i].day + 7 - targetDate.getDay()) % 7));
			if (date.getDay() == events[i].day && (date.getHours() > events[i].eH || (date.getHours() == events[i].eH && date.getMinutes() >= events[i].eM))) {
				targetDate.setDate(targetDate.getDate() + 7);
			}
			targetDate.setHours(events[i].sH, events[i].sM, 0, 0);

			let difference = targetDate - date;

			let percentage = ((weekTime - events[i].duration() - difference) * 100) / (weekTime - events[i].duration());

			let dLeft = Math.floor(difference / (1000 * 60 * 60 * 24));
			difference -= dLeft * (1000 * 60 * 60 * 24);

			let hLeft = Math.floor(difference / (1000 * 60 * 60));
			difference -= hLeft * (1000 * 60 * 60);

			let mLeft = Math.floor(difference / (1000 * 60));
			difference -= mLeft * (1000 * 60);

			let sLeft = Math.floor(difference / 1000);
			difference -= sLeft * 1000;

			colorBar(i);
			document.getElementById("countdown_text_" + i).innerText = events[i].name + " starting in:";
			document.getElementById("countdown_time_" + i).innerText = displayDate(dLeft, hLeft, mLeft, sLeft);
			document.getElementById("bar_text_" + i).innerText = percentage.toFixed(4) + "%";
			document.getElementById("bar_cover_" + i).style.width = 100 - percentage + "%";
		}
	}
}

function displayDate(dL, hL, mL, sL, m) {
	let text = "";
	if (dL !== false) {
		if (dL > 0) {
			text = dL == 1 ? dL + " days, " : dL + " day, ";
		}
	}
	if (dL > 0 || hL > 0) {
		text += hL >= 10 ? hL : "0" + hL;
		if (hL == 1) {
			text += " hour, ";
		} else if ((hL % 10 == 2 || hL % 10 == 3 || hL % 10 == 4) && hL != 12 && hL != 13 && hL != 14) {
			text += " hours, ";
		} else {
			text += " hours, ";
		}
	}
	if (dL > 0 || hL > 0 || mL > 0) {
		text += mL >= 10 ? mL : "0" + mL;
		if (mL == 1) {
			text += " minute, ";
		} else if ((mL % 10 == 2 || mL % 10 == 3 || mL % 10 == 4) && mL != 12 && mL != 13 && mL != 14) {
			text += " minutes, ";
		} else {
			text += " minutes, ";
		}
	}
	text += sL >= 10 ? sL : "0" + sL;
	if (typeof m != "undefined") {
		if (m < 10) {
			text += ":000" + m;
		} else if (m < 100) {
			text += ":00" + m;
		} else if (m < 1000) {
			text += ":0" + m;
		} else {
			text += ":" + m;
		}
	}
	if (sL == 1) {
		text += " second.";
	} else if ((sL % 10 == 2 || sL % 10 == 3 || sL % 10 == 4) && sL != 12 && sL != 13 && sL != 14) {
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
			document
				.getElementById("weekDay" + (i + 1))
				.insertAdjacentHTML("afterbegin", '<h2 id="weekDay' + (i + 1) + '_name" class="day_name">' + days[i] + "</h2>");
		} else {
			if (document.getElementById("weekDay" + (i + 1) + "_name")) {
				document.getElementById("weekDay" + (i + 1) + "_name").parentNode.removeChild(document.getElementById("weekDay" + (i + 1) + "_name"));
			}
		}
	}
}

function checkDarkMode() {
	if (settings.darkMode) {
		let darkMode = `
                body {
                    background-color: #2c2c2c!important;
                    color: #fff!important;
                }
                header {
                    background-color: #292929!important;
                    box-shadow: 0 0 2px 0 #222!important;
                }
                aside {
                    background-color: #292929!important;
                    box-shadow: 0 0 2px 0 #222!important;
                }
                #bar1, #bar2, #bar3 {
                    background-color: #ddd!important;
                }
            `;

		let style = document.createElement("style");
		style.id = "dark_mode_style";
		style.innerText = darkMode;
		document.head.appendChild(style);
	} else {
		if (document.getElementById("dark_mode_style")) {
			document.getElementById("dark_mode_style").parentNode.removeChild(document.getElementById("dark_mode_style"));
		}
	}
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
		document.getElementById("main").innerHTML =
			'<table id="edit_table"><tr><th>Name</th><th>Day</th><th>Starting time (hours)</th><th>Starting time (minutes)</th><th>Ending time (hours)</th><th>Ending time (minutes)</th></tr></table>';
		for (let i = 0; i < events.length; i++) {
			document.getElementById("edit_table").insertAdjacentHTML(
				"beforeend",
				`<tr id="edit_event_${i}">
                    <td><input type="text" id="event_name_${i}" value="${events[i].name}" title="Event name"></td>
                    <td><input type="number" id="event_day_${i}" value="${events[i].day}" title="A day number between 1 and 7"></td>
                    <td><input type="number" id="event_start_hour_${i}" value="${events[i].sH}" title="Between 0 and 23"></td>
                    <td><input type="number" id="event_start_minute_${i}" value="${events[i].sM}" title="Between 0 and 59"></td>
                    <td><input type="number" id="event_end_hour_${i}" value="${events[i].eH}" title="Between 0 and 23"></td>
                    <td><input type="number" id="event_end_minute_${i}" value="${events[i].eM}" title="Between 0 and 59"></td>
                    <td><div class="event_remove" id="event_remove_${i}">X</div></td>
                </tr>`
			);
			document.getElementById("event_name_" + i).addEventListener("keyup", changeEventName);
			document.getElementById("event_day_" + i).addEventListener("keyup", changeEventDay);
			document.getElementById("event_start_hour_" + i).addEventListener("keyup", changeEventStartHour);
			document.getElementById("event_start_minute_" + i).addEventListener("keyup", changeEventStartMinute);
			document.getElementById("event_end_hour_" + i).addEventListener("keyup", changeEventEndHour);
			document.getElementById("event_end_minute_" + i).addEventListener("keyup", changeEventEndMinute);
			document.getElementById("event_remove_" + i).addEventListener("click", removeEventClick);
		}
		document.getElementById("main").insertAdjacentHTML("beforeend", `<input type="button" id="add_event" value="Dodaj">`);
		document.getElementById("add_event").addEventListener("click", addEventClick);
	} else {
		for (let i = 0; i < events.length; i++) {
			if (document.getElementById("event_name_" + i)) {
				document.getElementById("event_name_" + i).removeEventListener("keyup", changeEventName);
				document.getElementById("event_day_" + i).removeEventListener("keyup", changeEventDay);
				document.getElementById("event_start_hour_" + i).removeEventListener("keyup", changeEventStartHour);
				document.getElementById("event_start_minute_" + i).removeEventListener("keyup", changeEventStartMinute);
				document.getElementById("event_end_hour_" + i).removeEventListener("keyup", changeEventEndHour);
				document.getElementById("event_end_minute_" + i).removeEventListener("keyup", changeEventEndMinute);
				document.getElementById("event_remove_" + i).removeEventListener("click", removeEventClick);
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
		document.getElementById("event_name_" + i).removeEventListener("keyup", changeEventName);
		document.getElementById("event_day_" + i).removeEventListener("keyup", changeEventDay);
		document.getElementById("event_start_hour_" + i).removeEventListener("keyup", changeEventStartHour);
		document.getElementById("event_start_minute_" + i).removeEventListener("keyup", changeEventStartMinute);
		document.getElementById("event_end_hour_" + i).removeEventListener("keyup", changeEventEndHour);
		document.getElementById("event_end_minute_" + i).removeEventListener("keyup", changeEventEndMinute);
		document.getElementById("event_remove_" + i).removeEventListener("click", removeEventClick);
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
	localStorage.setItem(events, JSON.stringify(events));
	document.getElementById("edit_table").insertAdjacentHTML(
		"beforeend",
		`<tr id="edit_event_${l}">
            <td><input type="text" id="event_name_${l}" value="${events[l].name}" title="Event name"></td>
            <td><input type="text" id="event_day_${l}" value="${events[l].day}" title="A day number between 1 and 7"></td>
            <td><input type="text" id="event_start_hour_${l}" value="${events[l].sH}" title="Between 0 and 23"></td>
            <td><input type="text" id="event_start_minute_${l}" value="${events[l].sM}" title="Between 0 and 59"></td>
            <td><input type="text" id="event_end_hour_${l}" value="${events[l].eH}" title="Between 0 and 23"></td>
            <td><input type="text" id="event_end_minute_${l}" value="${events[l].eM}" title="Between 0 and 59"></td>
            <td><div class="event_remove" id="event_remove_${l}">X</div></td>
        </tr>`
	);
	document.getElementById("event_name_" + l).addEventListener("keyup", changeEventName);
	document.getElementById("event_day_" + l).addEventListener("keyup", changeEventDay);
	document.getElementById("event_start_hour_" + l).addEventListener("keyup", changeEventStartHour);
	document.getElementById("event_start_minute_" + l).addEventListener("keyup", changeEventStartMinute);
	document.getElementById("event_end_hour_" + l).addEventListener("keyup", changeEventEndHour);
	document.getElementById("event_end_minute_" + l).addEventListener("keyup", changeEventEndMinute);
	document.getElementById("event_remove_" + l).addEventListener("click", removeEventClick);
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

let bg;
for (let i = 0; i < colors.length; i++) {
	document
		.getElementById("select_temp_bar")
		.insertAdjacentHTML(
			"beforeend",
			`<div class="bar_select"><label><input type="radio" name="bar_color" value="${i}" autocomplete="off" ${
				settings.barColor == i ? "checked" : ""
			}> <div class="template_bar" id="temp_bar${i}"></div></label></div>`
		);
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
