import CountdownEvent from "./CountdownEvent.js";
import templates from "./templates.js";
import { insertHTML } from "./utils.js";

class EventsHolder {
    events = [];
    eventsTimer;
    weekTime = 604800000;

    loadEvents() {
        if (localStorage.getItem("events") !== null) {
            let temp = JSON.parse(localStorage.getItem("events"));
            for (let i = 0; i < temp.length; i++) {
                let event = [temp[i].name, temp[i].day, temp[i].startingHour, temp[i].startingMinute, temp[i].endingHour, temp[i].endingMinute];
                this.events[i] = new CountdownEvent(...event);
            }
        }
    }

    initEvents() {
        document.getElementById("main").innerHTML = "";
        for (let i = 0; i < 7; i++) {
            document.getElementById("main").insertAdjacentHTML("beforeend", '<div id="weekDay' + (i + 1) + '"></div>');
        }
        if (this.settings.groupDay) {
            this.settings.checkGroup();
        }
        for (let i = 0; i < this.events.length; i++) {
            insertHTML("weekDay" + this.events[i].day, templates.countdownEvent, { id: i }, "beforeend");
        }
        this.eventsTimer = setInterval(() => this.showEvents(), 16);
    }

    showEvents() {
        if (!this.settings.editMode) {
            let date = new Date();

            for (let i = 0; i < this.events.length; i++) {
                let targetDate = new Date();
                if (this.events[i].started(date)) {
                    targetDate.setHours(this.events[i].endingHour, this.events[i].endingMinute, 0, 0);

                    let [dLeft, hLeft, mLeft, sLeft, msLeft, difference] = this.calculateTimeDifference(targetDate, date);

                    let percentage = ((this.events[i].duration() - difference) * 100) / this.events[i].duration();

                    this.updateCountdownBar(0, i, percentage, false, hLeft, mLeft, sLeft, msLeft);
                } else {
                    targetDate.setDate(targetDate.getDate() + ((this.events[i].day + 7 - targetDate.getDay()) % 7));
                    if (
                        date.getDay() == this.events[i].day &&
                        (date.getHours() > this.events[i].endingHour ||
                            (date.getHours() == this.events[i].endingHour && date.getMinutes() >= this.events[i].endingMinute))
                    ) {
                        targetDate.setDate(targetDate.getDate() + 7);
                    }
                    targetDate.setHours(this.events[i].startingHour, this.events[i].startingMinute, 0, 0);

                    let [dLeft, hLeft, mLeft, sLeft, msLeft, difference] = this.calculateTimeDifference(targetDate, date);

                    let percentage = ((this.weekTime - this.events[i].duration() - difference) * 100) / (this.weekTime - this.events[i].duration());

                    this.updateCountdownBar(1, i, percentage, dLeft, hLeft, mLeft, sLeft);
                }
            }
        }
    }

    calculateTimeDifference(targetDate, date) {
        let difference = targetDate - date;
        let initialDifference = difference;
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

    updateCountdownBar(type, i, percentage, dLeft, hLeft, mLeft, sLeft, msLeft = false) {
        let text = type === 0 ? " ending in:" : " starting in:";

        if (type === 0) {
            this.settings.checkInverted();
        } else {
            this.settings.colorBar(i);
        }

        document.getElementById("countdown_text_" + i).innerText = this.events[i].name + text;
        document.getElementById("countdown_time_" + i).innerText = this.displayDate(dLeft, hLeft, mLeft, sLeft, msLeft);
        document.getElementById("bar_text_" + i).innerText = percentage.toFixed(4) + "%";
        document.getElementById("bar_cover_" + i).style.width = 100 - percentage + "%";
    }

    displayDate(dL, hL, mL, sL, m) {
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
        if (typeof m != "undefined" && m !== false) {
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
}

export default EventsHolder;
