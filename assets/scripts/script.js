import { CountdownEventsHolder } from "./events/CountdownEventsHolder.js";
import { Settings } from "./Settings.js";

const countdownEventsHolder = new CountdownEventsHolder(true);

Settings.addEventsHolder(countdownEventsHolder);
Settings.init();
