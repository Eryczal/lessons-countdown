class CountdownEvent {
	constructor(name, day, sH, sM, eH, eM) {
		this.name = name;
		this.day = day;
		this.startingHour = sH;
		this.startingMinute = sM;
		this.endingHour = eH;
		this.endingMinute = eM;
	}

	started(date) {
		let day = date.getDay() === 0 ? 7 : date.getDay();
		return (
			this.day == day &&
			((date.getHours() > this.startingHour && date.getHours() < this.endingHour) ||
				(date.getHours() == this.startingHour && date.getMinutes() >= this.startingMinute) ||
				(date.getHours() == this.endingHour && date.getMinutes() < this.endingMinute))
		);
	}

	duration() {
		let d1 = new Date();
		let d2 = new Date();
		d1.setHours(this.startingHour, this.startingMinute);
		d2.setHours(this.endingHour, this.endingMinute);
		return d2 - d1;
	}
}

export default CountdownEvent;
