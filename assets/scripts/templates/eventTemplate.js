const eventTemplate = (container, data) => {
    const template = `
        <div class="event-container" id="event-${data.id}">
            <div class="event-top-info" id="event-top-info-${data.id}">
                <header>
                    <h2>${data.name}</h2>
                </header>
            </div>
            <div class="event-bar-container" id="event-bar-container-${data.id}"></div>
        </div>
    `;

    document.getElementById(container).insertAdjacentHTML("beforeend", template);
};

export { eventTemplate };
