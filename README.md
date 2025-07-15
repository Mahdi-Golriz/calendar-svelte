# 📅 Personnel Calendar

A customizable Svelte-based personnel calendar to visualize events such as vacations, conferences, or project schedules across a team. It supports localization, dynamic event management, and responsive views.

🚀 Installation / Setup

```bash
# Install dependencies:
npm install

# run the project
npm crun dev
```

Features

📅 Timeline calendar view with configurable date ranges
👥 Team member management with avatars and roles
📋 Event creation, editing, and deletion
🌐 Multi-language support (German, English, Spanish, French)
📱 Responsive design with mobile-friendly interface
🎨 Customizable display options
⌨️ Keyboard navigation support
🔍 Event filtering and highlightin

⚙️ Available Props
<Calendar />
Prop	                Type	              Description
persons	              Person[]	          List of personnel to be shown in rows
events	              CalendarEvent[]	    List of events to render on the calendar
calendarStartDate	    Date	              Start of the calendar range
calendarEndDate	      Date	              End of the calendar range
enableHighlight	      boolean	            Toggle for highlighting current day
showWeekends	        boolean	            Show or hide weekends
highlightWeekends	    boolean	            Highlight weekends with special styling
goToTodayTrigger	    number	            Increment to trigger scroll to today
scrollLeftTrigger	    number	            Increment to scroll calendar left
scrollRightTrigger	  number	            Increment to scroll calendar right
locale	              string	            Locale string (e.g., "en-US", "de-DE")
selectedDate	        string | null	      Optionally preselect a date (format: "YYYY-MM-DD")


