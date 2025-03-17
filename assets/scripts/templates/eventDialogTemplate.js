const eventDialogTemplate = (data) => {
    const pad = (num) => String(num).padStart(2, "0");

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const displayData = {
        action: data ? "Edit" : "Add",
        name: data?.name || "",
        startDate: data ? formatDate(data.startDate) : formatDate(new Date()),
        duration: data ? `${pad(Math.floor(data.duration / 60))}:${pad(data.duration % 60)}` : "01:00",
        color: data ? data.color : 0,
    };

    const dialog = document.getElementById("dialog");

    dialog.querySelector("#dialog-header").textContent = `${displayData.action} countdown`;
    dialog.querySelector("#dialog-submit-button").textContent = displayData.action;
    dialog.querySelector("#dialog-submit-button").dataset.eventId = data ? data.id : null;

    dialog.querySelector("#dialog-name").value = displayData.name;
    dialog.querySelector("#dialog-start-date").value = displayData.startDate;
    dialog.querySelector("#dialog-duration").value = displayData.duration;
    dialog.querySelector("#dialog-color").classList.add(`countdown-color-${displayData.color}`);
    dialog.querySelector("#dialog-color").dataset.value = displayData.color;
    dialog.querySelector("#dialog-repeating").checked = data ? data.repeating : true;

    dialog.showModal();
    dialog.classList.add("open");
};

export { eventDialogTemplate };
