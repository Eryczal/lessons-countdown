import { escapeHTML } from "../utils.js";

const eventTemplate = (container, data) => {
    const template = `
        <div class="event-container" id="event-${data.id}">
            <div class="event-content-container">
                <div class="event-top-info" id="event-top-info-${data.id}">
                    <header>
                        <h2 id="event-header-${data.id}">${escapeHTML(data.name)}</h2>
                    </header>
                </div>
                <div class="event-bar-container" id="event-bar-container-${data.id}"></div>
            </div>
            <div class="settings-button-container">
                <div class="settings-button ${container === "dummy-event" ? "active" : ""}" id="event-settings-button-${data.id}">
                    <div class="setting-dot"></div>
                    <div class="setting-dot"></div>
                    <div class="setting-dot"></div>
                </div>
            </div>
        </div>
    `;

    document.getElementById(container).insertAdjacentHTML(container === "dummy-event" ? "beforebegin" : "beforeend", template);
};

export { eventTemplate };
