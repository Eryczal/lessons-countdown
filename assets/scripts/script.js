import EventsHolder from "./EventsHolder.js";
import Settings from "./Settings.js";

const eventsHolder = new EventsHolder();
const settings = new Settings(eventsHolder);

eventsHolder.settings = settings;
eventsHolder.loadEvents();
settings.loadSettings();
settings.initEventListeners();

var events = eventsHolder.events;

settings.drawTemplateBars();
settings.checkDarkMode();

eventsHolder.initEvents();
settings.editModeClass.checkEditMode();
settings.checkInverted();
if (events.length > 0 && !settings.editMode) {
	settings.colorBar(-1);
}
