//(function($) {
    console.log('calendar oppened');

    var canvasWidth = document.getElementById('events_container').clientWidth,
        events = [
            {id: 1, start: 30, end: 150, name: 'Изкуствен Интелект', location: '325'},
            {id: 2, start: 540, end: 600, name: 'Софтуерни Технологии', location: '200'},
            {id: 3, start: 560, end: 620, name: 'WWW Технологии', location: '325'},
            {id: 4, start: 610, end: 670, name: 'Програмиране с Андроид', location: '204'}
        ];

    /**
    * Add left and top property to each event in a group
    *
    * @param array  eventsGroups
    * An array of arrays of overlapping event objects. Overlapping
    * events are combined in groups.
    *
    * @return array
    * An array of overlapping events with assigned top and left 
    * property.
    *
    */
    function addEventsPosition(eventsGroups) {
        var i,
            allEvents = [];

        for (i = 0; i < eventsGroups.length; i++) {
            var eventsGroup = eventsGroups[i],
                positionedEvents = positionInGroup(eventsGroup);

            allEvents.push(positionedEvents);
        }

        return allEvents;
    }

    /**
    * Assign the left and top property for events in a group
    *
    * @param array  group
    * An array of of overlapping event objects.
    *
    * @return array
    * An array of event objects with assigned left and top
    * property.
    *
    */
    function positionInGroup(group) {
        var allEvents = [],
            columns = splitEventsInColumns(group),
            i,
            j,
            columnWidth = canvasWidth / columns.length;

        for (i = 0; i < columns.length; i++) {
            var column = columns[i];
            for (j = 0; j < column.length; j++) {
                var event = column[j];
                event.top = event.start;
                event.left = columnWidth * i;
                event.width = columnWidth;
                allEvents.push(event);
            }
        }

        return allEvents;
    }

    /**
    * Splits events in one group in nonoverlapping columns
    *
    * @param array  events
    * An array of overlapping event objects.
    *
    * @return array
    * An array of arrays of event object. Each sub array is
    * representing one column with events in the calendar.
    *
    */
    function splitEventsInColumns(group) {
        var i,
            j,
            columns = [],
            column = [],
            addedToLine = false;

        column.push(group[0]);
        columns.push(column);
        for (i = 1; i < group.length; i++) {
            addedToLine = false;
            var event = group[i];
            for (j = 0; j < columns.length; j++) {
                var currentLine = columns[j],
                    lastEvent = currentLine[currentLine.length - 1];
                if (event.start > lastEvent.end) {
                    currentLine.push(event);
                    addedToLine = true;
                    break;
                }
            }
            if (!addedToLine) {
                var newLine = [];
                newLine.push(event);
                columns.push(newLine);
            }
        }

        return columns;
    }

    /**
    * Groups overlapping events in groups
    *
    * @param array  events
    * An array of events.
    *
    * @return array
    * An array of arrays of events. Each subarray contains
    * events that are overlapping.
    *
    */
    function groupOverlappingEvents(events) {
        var allGroups = [],
            group = [],
            pushed = false,
            i,
            j;

        group.push(events[0]);
        for (i = 1; i < events.length; i++) {
            pushed = false;
            var event = events[i];
            for (j = 0; j < group.length; j++) {
                var groupEvent = group[j];
                if (event.start < groupEvent.end) {
                    group.push(event);
                    pushed = true;
                    break;
                }
            }
            if (!pushed) {
                allGroups.push(group);
                group = [];
                group.push(event);
            }
        }
        allGroups.push(group);

        return allGroups;
    }

    /**
    * Sorts a list of events by start time
    *
    * @param array  events
    * An array of events.
    *
    * @return array
    * An array og events sorted by their start time.
    *
    */
    function sortEventsByStart(events) {
        var eventsSorted = events.sort(function(first, second) {
            return first.start > second.start;
        });

        return eventsSorted;
    }


    /**
    * Lays out events for a single  day
    *
    * @param array  events
    * An array of event objects. Each event object consists
    * of a start and end time  (measured in minutes) from 9am,
    * as well as a unique id. The start and end time of each
    * event will be [0, 720]. The start time will be less than
    * the end time.
    *
    * @return array
    * An array of event objects that has the width, the left
    * and top positions set, in addition to the id, start
    * and end time. The object should be laid out so that
    * there are no overlapping events.
    *
    */
    function layOutDay(events) {
        var eventsSorted = sortEventsByStart(events),
            eventsGroups = groupOverlappingEvents(eventsSorted),
            i,
            j,
            result = [],
            groupsWithPosition = addEventsPosition(eventsGroups);

        for (i = 0; i < groupsWithPosition.length; i++) {
            var group = groupsWithPosition[i];
            for (j = 0; j < group.length; j++) {
                result.push(group[j]);
            }
        }

        return result;
    }

    window.layOutDay = layOutDay;

    /**
    * Draw a visual representation of the events on the page
    *
    * @param array  events
    * An array of all events with assigned top and left position.
    *
    */
    function drawEvents(events) {
        var i,
            fragment = document.createDocumentFragment(),
            eventsWrapper = document.getElementById('events_wrapper');

        for (i = 0; i < events.length; i++) {
            var eventDiv = document.createElement('div'),
                event = events[i],
                nameLabel = document.createElement('h2'),
                locationLabel = document.createElement('p'),
                name = document.createTextNode(event.name),
                location = document.createTextNode(event.location),
                eventType = event.type || '';

            eventDiv.className = 'event_entry ' + eventType;
            eventDiv.style.position = 'absolute';
            eventDiv.style.top = event.top + 'px';
            eventDiv.style.left = event.left + 'px';
            eventDiv.style.width = (event.width - 5) + 'px';
            eventDiv.style.height = (event.end - event.start) + 'px';

            nameLabel.appendChild(name);
            eventDiv.appendChild(nameLabel);

            locationLabel.appendChild(location);
            eventDiv.appendChild(locationLabel);

            fragment.appendChild(eventDiv);
        }

        $(eventsWrapper).html(fragment);
    }

    var showEvents = function(events) {
        if (events.length === 0) {
            alert('Няма лекции в този ден');
            return;
        }
        setTimeout(function () {
            canvasWidth = document.getElementById('events_container').clientWidth - 20;
            drawEvents(layOutDay(events));
        }, 100);
    };

    var selectedElectives = {};

    var addElectives = function (electives) {
        var str = '';
        var j = 0;
        for (var i in electives) {
            var elective = electives[i];
            var elStr = '<li><input type="checkbox" name="' + j + '" id="' + j + '">';
            elStr += '<label for="' + j + '">' + elective.id + '</label></li>';
            str += elStr;
            j += 1;
        }
        $("#electives_select_list").html(str);
    };

    var year = 2;
    var group = 3; // 6
    var flow = 2;

    var convertToSeconds = function(hour) {
        return (hour - 7) * 60;
    };

    var programForYear = {};
    var programForFlow = {};
    var electives = [];

    $.get('data/program_cs.json', function(data) {
        try {
            programForYear = data['year' + year];
            programForFlow = programForYear.flows[flow - 1];
        } catch (e) {
            console.log('error while parsing');
        }
        $.get('data/el.json', function(data) {
            electives = data;
            showProgramForDay('tuesday');
            addElectives(electives);
        });
    });

    var showProgramForDay = function(day) {
        var programForDay = programForFlow[day];
        var programForGroup  = programForDay.groups[group - 1];
        var events = [];
        var id = 0;
        for(var i in programForGroup) {
            var programEvent = programForGroup[i];
            var start = convertToSeconds(programEvent.start);
            var end = convertToSeconds(programEvent.end);
            var eventObj = {
                id: id,
                start: start,
                end: end,
                name: programEvent.label,
                location: programEvent.room
            };
            id += 1;
            events.push(eventObj);
        }

        for(var i in electives) {
            var elective = electives[i];
            if (elective.day !== day || selectedElectives[elective.id] !== true) {
                continue;
            }
            var start = convertToSeconds(elective.start);
            var end = convertToSeconds(elective.end);
            var eventObj = {
                id: id,
                start: start,
                end: end,
                name: elective.id,
                location: '325',
                type: 'elective'
            };
            events.push(eventObj);
        }


        showEvents(events);        
    };

    $('#elective_dialogs_back').on('click', function () {
        var all = [];
        selectedElectives = {};
        $('#electives_select_list input:checked[type="checkbox"]').each(function (i, el) {
            //.nextAll('.ui-btn-text')
            all.push($(el).parent().find('.ui-btn-text').text());    
        });
        for (var i in all) {
            var str = all[i];
            selectedElectives[str] = true; 
        }
        $('#select-date').trigger('change');
    });

    $('#select-date').on('change', function(e) { 
        var day = $(e.currentTarget).val();
        showProgramForDay(day);
    });

//})(jQuery);
