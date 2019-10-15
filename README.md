# rolyart-calendar
Simple pure JS calendar. [Demo](http://apps.rolyart.ro/rolyart-calendar)
## Install

1. Add `rolyart-calendar.js`
2. Add `style.css`
3. Add calendar container `<div id="myCalendar"></div>`
4. Init calendar:
`let config = {
    container: 'calendar',
    months: ["January", "February", "March", "Aprile", "May", "June", "July", "August", "September", "Octomber", "November", "December"],
    weekDays: ["S", "M", "T", "W", "T", "F", "S"],
}
let calendar = new RolyartCalendar(config)`

## Selection

*selected* property contains the currently selected day as a string or in case of multiple selection
as an array of strings. Assign to this variable to programatically change the selection.

## Configuration

- firstDayOfWeek

  Configure start of the week day. 0 for Sunday, 1 for Monday. Default is Sunday. 
  The weekDays array always starts from Sunday.

- daySelection

  Configure the selection mode. 
  
  - 'single' for single selection 
  - 'toggle' for multiple days selection, clicking the day toggles the day selection.
  - If set to a function, this function would be called after user click the day,
  with the day as a single argument. No implicit selection change would be performed,
  the function can change *selected* property.
