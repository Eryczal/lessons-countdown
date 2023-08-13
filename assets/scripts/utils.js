function insertHTML(id, template, args, position = "beforeend") {
	let result = template.replace(/%([a-zA-Z]+)/g, (match, key) => args[key]);

	document.getElementById(id).insertAdjacentHTML(position, result);
}

export { insertHTML };
