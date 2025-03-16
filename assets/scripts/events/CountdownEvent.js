class CountdownEvent {
    constructor(id, name, creationDate, startDate, duration, repeating, color) {
        this.id = id;
        this.name = name;
        this.creationDate = creationDate;
        this.startDate = startDate;
        this.duration = duration;
        this.repeating = repeating;
        this.color = color;
    }

    getData() {
        const data = {
            id: this.id,
            name: this.name,
            started: this.started(),
            diff: this.getTimeDifference(),
            color: this.color,
            percentage: this.getPercentage(),
        };

        return data;
    }

    started() {
        const now = new Date();
        const eventStart = this.getEventStartDate();
        const eventEnd = new Date(this.getEventStartDate().getTime() + this.duration * 60 * 1000);

        return now >= eventStart && now <= eventEnd;
    }

    getPercentage() {
        const now = new Date();
        let fromDate;
        let toDate;

        if (this.repeating) {
            fromDate = this.started() ? this.getEventStartDate() : new Date(this.getEventStartDate().getTime() - 7 * 24 * 60 * 60 * 1000);
            toDate = this.started() ? new Date(this.getEventStartDate().getTime() + this.duration * 60 * 1000) : this.getEventStartDate();
        } else {
            fromDate = this.started() ? this.startDate : this.creationDate;
            toDate = this.started() ? new Date(this.startDate.getTime() + this.duration * 60 * 1000) : this.startDate;
        }

        const total = toDate - fromDate;
        const elapsed = now - fromDate;
        const percentage = Math.max(0, Math.min((elapsed / total) * 100, 100));

        return percentage;
    }

    getTimeDifference() {
        const started = this.started();

        if (started) {
            const now = new Date();
            const endDate = new Date(this.getEventStartDate().getTime() + this.duration * 60 * 1000);

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
        const candidateEndDate = new Date(candidateDate.getTime() + this.duration * 60 * 1000);

        if ((candidateDate < now && now < candidateEndDate) || now < candidateDate) {
            return candidateDate;
        }

        const nextWeekDate = new Date(candidateDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        return nextWeekDate;
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
