const eventTemplate = (container, data) => {
    const template = `
        <div class="event-container" id="event-${data.id}">
            <header>
                <h2>${data.name}</h2>
            </header>
            <div class="event-content" id="event-content-${data.id}"></div>
        </div>
    `;

    document.getElementById(container).insertAdjacentHTML("beforeend", template);
};

export { eventTemplate };
