function insertHTML(id, template, args, position = "beforeend") {
    let result = template.replace(/%([a-zA-Z]+)/g, (match, key) => args[key]);

    document.getElementById(id).insertAdjacentHTML(position, result);
}

function formatUnit(value, forms) {
    const lang = "en";

    if (lang === "pl") {
        if (value === 1) {
            return forms.one;
        } else if (value % 10 >= 2 && value % 10 <= 4 && !(value % 100 >= 12 && value % 100 <= 14)) {
            return forms.few;
        } else {
            return forms.many;
        }
    }

    return value === 1 ? forms.one : forms.many;
}

export { insertHTML, formatUnit };
