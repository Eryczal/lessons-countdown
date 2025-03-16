const editEventTemplate = (data, eventsHolder) => {
    let event = {
        id: data?.id || eventsHolder.getFreeId(),
        name: data?.name || "",
        creationDate: data?.creationDate || new Date(),
        startDate: data?.startDate || new Date(),
        duration: data?.duration || 60,
        repeating: data?.repeating || true,
        color: data?.color || 0,
    };

    const dialog = document.getElementById("dialog");

    dialog.showModal();
    dialog.classList.add("open");
};

export { editEventTemplate };
