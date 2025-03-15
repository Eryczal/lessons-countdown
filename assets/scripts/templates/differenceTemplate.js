const differenceTemplate = (data) => {
    const { days, hours, minutes, seconds } = data.diff;

    let parts = [];

    if (days > 0) {
        parts.push(`${days} ${days === 1 ? "day" : "days"}`);
    }

    if (days > 0 || hours > 0) {
        parts.push(`${String(hours).padStart(2, "0")} ${hours === 1 ? "hour" : "hours"}`);
    }

    if (days > 0 || hours > 0 || minutes > 0) {
        parts.push(`${String(minutes).padStart(2, "0")} ${minutes === 1 ? "minute" : "minutes"}`);
    }

    if (days > 0 || hours > 0 || minutes > 0 || seconds > 0) {
        parts.push(`${String(seconds).padStart(2, "0")} ${seconds === 1 ? "second" : "seconds"}`);
    }

    return `
        <div class="event-difference-info"> 
            <div class="event-difference-header">
                ${data.started ? "Ending" : "Starting"} in:
            </div>
            <div class="event-difference-time">
                ${parts.join(" ")}
            </div>
        </div>
    `;
};

export { differenceTemplate };
