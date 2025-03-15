class CountdownEvent {
    constructor(name, startDate, duration, repeating, color) {
        this.name = name;
        this.startDate = startDate;
        this.duration = duration;
        this.repeating = repeating;
        this.color = color;
    }

    started() {
        const now = new Date();
        const eventStart = this.getEventStartDate();
        const eventEnd = new Date(this.getEventStartDate().getTime() + this.duration * 1000);

        return now >= eventStart && now <= eventEnd;
    }

            const eventStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), this.startDate.getHours(), this.startDate.getMinutes());
            const eventEnd = new Date(eventStart.getTime() + this.duration * 1000);
    getTimeDifference() {

            return now >= eventStart && now <= eventEnd;
        } else {
            if (now.toDateString() !== this.startDate.toDateString()) {
                return false;
            }

            const eventEnd = new Date(this.startDate.getTime() + this.duration * 1000);

            return now >= this.startDate && now <= eventEnd;
        }
    }

    getEventStartDate() {
        if (!this.repeating) {
            return this.startDate;
        }

        const now = new Date();
        const eventDay = this.startDate.getDay();
        const currentDay = now.getDay();

        let daysUntilEvent = eventDay - currentDay;

        if (daysUntilEvent < 0) {
            daysUntilEvent += 7;
        }

        const candidateDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + daysUntilEvent,
            this.startDate.getHours(),
            this.startDate.getMinutes()
        );
        const candidateEndDate = new Date(candidateDate.getTime() + this.duration);

        if ((candidateDate < now && now < candidateEndDate) || now < candidateDate) {
            return candidateDate;
        }

        const nextWeekDate = new Date(candidateDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        return nextWeekDate;
    }

        const started = this.started();

        if (started) {
            const now = new Date();
            const endDate = new Date(this.getEventStartDate().getTime() + this.duration);

            return this.timeBetween(now, endDate);
        } else {
            const now = new Date();
            const startDate = this.getEventStartDate();

            if (startDate < now) {
                return;
            }

            return this.timeBetween(now, startDate);
        }
    }

    timeBetween(startDate, endDate) {
        let diff = Math.abs(startDate - endDate);

        const msInSecond = 1000;
        const msInMinute = msInSecond * 60;
        const msInHour = msInMinute * 60;
        const msInDay = msInHour * 24;

        const days = Math.floor(diff / msInDay);
        diff -= days * msInDay;

        const hours = Math.floor(diff / msInHour);
        diff -= hours * msInHour;

        const minutes = Math.floor(diff / msInMinute);
        diff -= minutes * msInMinute;

        const seconds = Math.floor(diff / msInSecond);
        diff -= seconds * msInSecond;

        const milliseconds = diff;

        return { days, hours, minutes, seconds, milliseconds };
    }
}

export { CountdownEvent };
