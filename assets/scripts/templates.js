const templates = {
	countdownEvent: `<div id="countdown_event_%id" class="countdown">
        <div id="countdown_text_%id"></div>
        <div id="countdown_time_%id"></div>
        <div id="countdown_bar_%id" class="bar bar_color1">
            <div id="bar_progress_%id"></div>
            <div id="bar_cover_%id" class="bar_cover"></div>
            <div id="bar_text_%id" class="bar_text"></div>
        </div>
    </div>`,
	weekDay: `<h2 id="weekDay%id_name" class="day_name">%dayName</h2>`,
	barColorSelect: `<div class="bar_select">
        <label>
            <input type="radio" name="bar_color" value="%id" autocomplete="off" %checked>
            <div class="template_bar" id="temp_bar%id"></div>
        </label>
    </div>`,
	editModeTable: `<table id="edit_table">
        <tr>
            <th>Name</th>
            <th>Day</th>
            <th>Starting time (hours)</th>
            <th>Starting time (minutes)</th>
            <th>Ending time (hours)</th>
            <th>Ending time (minutes)</th>
        </tr>
    </table>`,
	editModeDay: `<tr id="edit_event_%id">
        <td><input type="text" id="event_name_%id" value="%eventName" title="Event name"></td>
        <td><input type="text" id="event_day_%id" value="%eventDay" title="A day number between 1 and 7"></td>
        <td><input type="text" id="event_starting_hour_%id" value="%eventStartingHour" title="Between 0 and 23"></td>
        <td><input type="text" id="event_starting_minute_%id" value="%eventStartingMinute" title="Between 0 and 59"></td>
        <td><input type="text" id="event_ending_hour_%id" value="%eventEndingHour" title="Between 0 and 23"></td>
        <td><input type="text" id="event_ending_minute_%id" value="%eventEndingMinute" title="Between 0 and 59"></td>
        <td><div class="event_remove" id="remove_event_click_%id">X</div></td>
    </tr>`,
};

export default templates;
