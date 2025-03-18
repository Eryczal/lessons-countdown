const floatingMenuTemplate = (container, data) => {
    const template = `
        <div class="floating-menu" id="floating-menu-${data.id}">
            <div class="floating-option" id="floating-edit-${data.id}">Edit</div>
            <div class="floating-option" id="floating-remove-${data.id}">Remove</div>
        </div>
    `;

    container.insertAdjacentHTML("afterend", template);

    setTimeout(() => {
        document.getElementById(`floating-menu-${data.id}`).classList.add("active");
    }, 5);
};

export { floatingMenuTemplate };
