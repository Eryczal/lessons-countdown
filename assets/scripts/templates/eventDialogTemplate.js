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

    const dialog = {
        element: document.getElementById("dialog"),
        header: document.getElementById("dialog-header"),
        submitButton: document.getElementById("dialog-submit-button"),
        name: document.getElementById("dialog-name"),
        startDate: document.getElementById("dialog-start-date"),
        duration: document.getElementById("dialog-duration"),
        color: document.getElementById("dialog-color"),
        repeating: document.getElementById("dialog-repeating"),
    };

    dialog.header.textContent = `${displayData.action} countdown`;
    dialog.submitButton.textContent = displayData.action;
    dialog.submitButton.dataset.eventId = data ? data.id : null;

    if (dialog.color.dataset.value !== "null") {
        dialog.color.classList.remove(`countdown-color-${dialog.color.dataset.value}`);
    }

    dialog.name.value = displayData.name;
    dialog.startDate.value = displayData.startDate;
    dialog.duration.value = displayData.duration;
    dialog.color.classList.add(`countdown-color-${displayData.color}`);
    dialog.color.dataset.value = displayData.color;
    dialog.repeating.checked = data ? data.repeating : true;

    dialog.element.showModal();
    dialog.element.classList.add("open");
};

export { eventDialogTemplate };
