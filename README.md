# Lessons Countdown

This is a project that enables the user to add custom countdowns (preferably lessons) that are happening each week on the same time. The countdowns are counting towards the lessons and when the lessons start, the colors of the bars counting are inverting (if the user select this option). When the lesson ends, the countdown will count again to the same time next week.

## Table of Contents

- Motivation
- Features
- Usage
- Future Plans

## Motivation

I created this project as a personal project to practice my web development skills. I wanted to have a visual representation of how much time is left for each lesson, and when the next one will start. I wanted to make something simple but functional, that could also be customizable and flexible. I thought that this would make the lessons more manageable and enjoyable.

## Features

This project has the following features:

- Create, edit, and remove custom countdowns for weekly events such as lessons, meetings, or appointments.
- Display countdowns in a graphical interface with bars showing remaining time and progress.
- Invert bar colors when events start (optional).
- Group countdowns by day of the week for easier organization and visualization.
- Support for dark mode.
- Data saved in localStorage.
- Five different bar colors available for selection.

## Usage

If you would like to customize the project, there are several files that you can modify:

- `colors.js` - Contains all the colors for the bars.
- `EditMode.js` - Contains a class for the edit mode on the page, including logic for adding, changing, and removing events.
- `EventsHolder.js` - Contains everything related to events and their display on the page.
- `Settings.js` - Contains settings and their associated logic, such as grouping days and dark mode.
- `templates.js` - Contains all HTML templates generated by JavaScript.
- `utils.js` - Contains helper functions, currently only `insertHTML()`.

You can easily add your own custom events directly on the page. Simply enter edit mode, add a new event, and specify the name, day, and time of the event.

## Future Plans

This project is still in development and has some room for improvement. Some of the future plans are:

- Add support for import/export in JSON format.
- Make the project mobile-friendly.
