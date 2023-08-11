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

export default CountdownEvent;
