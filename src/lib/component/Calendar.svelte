<script>
    import PeopleIcon from "$lib/icons/PeopleIcon.svelte";
    import { onMount, tick } from "svelte";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    /**
     * @typedef {import('./types.js').CalendarEvent} CalendarEvent
     * @typedef {import('./types.js').Person} Person
     * @typedef {import('./types.js').ProcessedEvent} ProcessedEvent
     */

    /** @type {Date} */
    export let startDate = new Date();

    /** @type {Date} */
    export let calendarStartDate = new Date();

    /** @type {Date} */
    export let calendarEndDate = new Date();

    /** @type {CalendarEvent[]} */
    export let events = [];

    /** @type {Person[]} */
    export let persons = [];

    /** @type {boolean} */
    export let highlight = false;

    /** @type {number} */
    export let goToTodayTrigger = 0;

    /** @type {number} */
    export let scrollLeftTrigger = 0;

    /** @type {number} */
    export let scrollRightTrigger = 0;

    /** @type {boolean} */
    export let showWeekends = true;

    /** @type {string} */
    export let locale = "de-DE";

    /** @type {string|null} */
    export let selectedDate = null;

    /** @type {boolean} */
    export let highlightWeekends = false;

    /** @type {Object|null} */
    export const selectedEvent = null;

    /** @type {boolean} */
    export let shortenPersonnelCol = false;

    /** @type {Array<{name: string, date: string, iso: string, isToday: boolean, isWeekend: boolean}>} */
    let days = [];

    /** @type {Array<{name: string, left: number, width: number}>} */
    let months = [];

    /** @type {HTMLElement} */
    let headerRef;

    /** @type {HTMLElement} */
    let namesRef;

    /** @type {HTMLElement} */
    let gridRef;

    /** @type {{dayIndex: number, personIndex: number}} */
    let hoveredCell = { dayIndex: -1, personIndex: -1 };

    // CSS custom properties for consistent sizing
    const rowHeight = 55;
    const headerHeight = 60;
    const namesWidth = 220;
    const namesWidthShort = 60; // Shortened width for mobile
    const dayWidth = 50;

    
    $: processedEvents = calculateEvents(events, persons, showWeekends,calendarStartDate, calendarEndDate);
    $: visibleDays = showWeekends ? days : days.filter((day) => !day.isWeekend);
    $: visibleMonths = showWeekends ? months : calculateVisibleMonths();
    $: actualNamesWidth = shortenPersonnelCol ? namesWidthShort : namesWidth;

    // re-init when locale changes or date range changes
    $: if (startDate || locale || calendarStartDate || calendarEndDate) {
        init();
    }

    // Watch for goToTodayTrigger changes and scroll to today
    $: if (goToTodayTrigger > 0 && gridRef && days.length > 0) {
        scrollToToday();
    }

    // Watch for scroll left trigger
    $: if (scrollLeftTrigger > 0 && gridRef && days.length > 0) {
        scrollLeft();
    }

    // Watch for scroll right trigger
    $: if (scrollRightTrigger > 0 && gridRef && days.length > 0) {
        scrollRight();
    }


    /**
     * @param {CalendarEvent[]} events
     * @param {Person[]} persons
     * @param {boolean} showWeekends
     * @param {Date} calendarStartDate
     * @param {Date} calendarEndDate
     * @returns {ProcessedEvent[]}
     */
    function calculateEvents(events, persons, showWeekends, calendarStartDate, calendarEndDate) {
        // Process events to handle multiple persons - create separate event instance for each person
        /** @type {ProcessedEvent[]} */
        const expandedEvents = [];
        
        // Get calendar date range for clamping
        const calendarStart = calendarStartDate.toISOString().split('T')[0];
        const calendarEnd = calendarEndDate.toISOString().split('T')[0];
        
        events.forEach((event) => {
            // Skip events that are completely outside the calendar range
            // An event overlaps if it starts before calendar ends AND ends after calendar starts
            if (event.startDate > calendarEnd || event.endDate < calendarStart) {

                return; // Event is completely outside calendar range
            }
            
            // Clamp event dates to calendar range
            let eventStart = event.startDate;
            let eventEnd = event.endDate;
            
            // If event starts before calendar range, clamp to calendar start
            if (eventStart < calendarStart) {
                eventStart = calendarStart;
            }
            
            // If event ends after calendar range, clamp to calendar end
            if (eventEnd > calendarEnd) {
                eventEnd = calendarEnd;
            }
            
            if (event.persons && event.persons.length > 0) {
                // Create an event instance for each person
                event.persons.forEach((personId) => {
                    expandedEvents.push({
                        ...event,
                        personId: personId,
                        start: eventStart,
                        end: eventEnd,
                        name: event.title,
                        color: event.color ? `bg-${event.color}-500` : "bg-blue-500",
                        originalEventId: event.id, // Keep reference to original event
                        isMultiPerson: event.persons ? event.persons.length > 1 : false,
                        isClamped: eventStart !== event.startDate || eventEnd !== event.endDate,
                        clampedStart: eventStart !== event.startDate,
                        clampedEnd: eventEnd !== event.endDate
                    });
                });
            } else {
                // Handle events without persons (fallback)
                expandedEvents.push({
                    ...event,
                    personId: "",
                    start: eventStart,
                    end: eventEnd,
                    name: event.title,
                    color: event.color ? `bg-${event.color}-500` : "bg-blue-500",
                    originalEventId: event.id,
                    isMultiPerson: false,
                    isClamped: eventStart !== event.startDate || eventEnd !== event.endDate,
                    clampedStart: eventStart !== event.startDate,
                    clampedEnd: eventEnd !== event.endDate
                });
            }
        });
        
        return expandedEvents;
    }

    
    function calculateVisibleMonths() {
        if (showWeekends) return months;
        /** @type {Array<{name: string, left: number, width: number}>} */
        const visibleMonthsArray = [];
        let currentLeft = 0;

        months.forEach((month, monthIndex) => {
            const monthStart = new Date(startDate.getFullYear(), monthIndex, 1);
            const monthEnd = new Date(
                startDate.getFullYear(),
                monthIndex + 1,
                0,
            );

            const monthVisibleDays = visibleDays.filter((day) => {
                const dayDate = new Date(day.iso);
                return dayDate >= monthStart && dayDate <= monthEnd;
            });

            if (monthVisibleDays.length > 0) {
                visibleMonthsArray.push({
                    ...month,
                    left: currentLeft,
                    width: monthVisibleDays.length * dayWidth,
                });
                currentLeft += monthVisibleDays.length * dayWidth;
            }
        });

        return visibleMonthsArray;
    }

    function init() {
        // Use configurable date range instead of fixed year
        const startOfRange = new Date(calendarStartDate);
        const endOfRange = new Date(calendarEndDate);
        const today = new Date();

        const dtfDay = new Intl.DateTimeFormat(locale, { weekday: "short" });
        const dtfMonth = new Intl.DateTimeFormat(locale, { month: "long" });

        days = [];
        months = [];
        let currentDate = new Date(startOfRange);
        let currentMonth = -1;
        let currentYear = -1;

        while (currentDate <= endOfRange) {
            const d = currentDate.getDate();
            const dow = currentDate.getDay();
            const month = currentDate.getMonth();
            const year = currentDate.getFullYear();

            // Handle month/year changes for header
            if (month !== currentMonth || year !== currentYear) {
                currentMonth = month;
                currentYear = year;
                const daysInMonth = new Date(year, month + 1, 0).getDate();
                
                // Calculate how many days of this month will actually be shown
                let monthStartDate = new Date(year, month, 1);
                let monthEndDate = new Date(year, month + 1, 0);
                
                // Clamp to our date range
                if (monthStartDate < startOfRange) monthStartDate = new Date(startOfRange);
                if (monthEndDate > endOfRange) monthEndDate = new Date(endOfRange);
                
                const daysToShow = Math.floor((monthEndDate.getTime() - monthStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                
                months.push({
                    name: `${dtfMonth.format(new Date(year, month, 1))} ${year}`,
                    left: days.length * dayWidth,
                    width: Math.max(daysToShow, 0) * dayWidth,
                });
            }

            days.push({
                name: dtfDay.format(currentDate).slice(0, 2),
                date: new Intl.DateTimeFormat(locale, {
                    day: "2-digit",
                }).format(currentDate),
                iso: currentDate.toISOString().split("T")[0],
                isToday: currentDate.toDateString() === today.toDateString(),
                isWeekend: dow === 0 || dow === 6,
            });

            currentDate.setDate(d + 1);
        }

        visibleDays = days;
    }

    /**
     * @param {Event} event
     */
    function syncScroll(event) {
        const target = /** @type {HTMLElement} */ (event.target);
        if (headerRef) headerRef.scrollLeft = target.scrollLeft;
        if (namesRef) namesRef.scrollTop = target.scrollTop;
    }

    function scrollToToday() {
        const todayIndex = visibleDays.findIndex((d) => d.isToday);
        if (todayIndex > -1 && gridRef) {
            const gridWidth = gridRef.clientWidth;
            const centeredPosition =
                todayIndex * dayWidth - gridWidth / 2 + dayWidth / 2;
            gridRef.scrollTo({
                left: centeredPosition,
                behavior: "smooth",
            });
        }
    }

    function scrollLeft() {
        if (gridRef) {
            const gridWidth = gridRef.clientWidth;
            const scrollAmount = gridWidth * 0.8; // Scroll 80% of visible width
            gridRef.scrollBy({
                left: -scrollAmount,
                behavior: "smooth",
            });
        }
    }

    function scrollRight() {
        if (gridRef) {
            const gridWidth = gridRef.clientWidth;
            const scrollAmount = gridWidth * 0.8; // Scroll 80% of visible width
            gridRef.scrollBy({
                left: scrollAmount,
                behavior: "smooth",
            });
        }
    }


    /**
     * @param {ProcessedEvent} event
     * @param {boolean} showWeekends
     */
    function getEventStyle(event, showWeekends) {
        const personIndex = persons.findIndex((p) => p.id === event.personId);
        const startIndex = visibleDays.findIndex((d) => d.iso === event.start);
        const endIndex = visibleDays.findIndex((d) => d.iso === event.end);

        console.log(
            "getEventStyle",
            JSON.stringify({
                event,
                personIndex,
                startIndex,
                endIndex,
                visibleDaysLength: visibleDays.length,
                firstDay: visibleDays[0]?.iso,
                lastDay: visibleDays[visibleDays.length - 1]?.iso,
                eventStart: event.start,
                eventEnd: event.end,
                isMultiPerson: event.isMultiPerson,
                isClamped: event.isClamped
            }),
        );

        if (personIndex === -1 || startIndex === -1 || endIndex === -1)
            return "display: none;";

        const top = personIndex * rowHeight;
        const left = startIndex * dayWidth;
        const width = (endIndex - startIndex + 1) * dayWidth;
        const height = rowHeight;

        return `top: ${top}px; left: ${left}px; width: ${width}px; height: ${height}px;`;
    }

    /**
     * @param {number} dayIndex
     * @param {number} personIndex
     */
    function handleCellHover(dayIndex, personIndex) {
        if (highlight) {
            hoveredCell = { dayIndex, personIndex };
        }
    }

    
    function handleCellLeave() {
        if (highlight) {
            hoveredCell = { dayIndex: -1, personIndex: -1 };
        }
    }

    /**
     * @param {string} dayIso
     */
    function handleDateClick(dayIso) {
        if (selectedDate === dayIso) {
            // Deselect current date
            selectedDate = null;
            dispatch('unselectDate', { date: dayIso });
        } else {
            // Select new date (auto-deselects previous)
            const previousDate = selectedDate;
            selectedDate = dayIso;
            
            // Dispatch unselect for previous date if it existed
            if (previousDate) {
                dispatch('unselectDate', { date: previousDate });
            }
            
            // Dispatch select for new date
            dispatch('selectDate', { date: dayIso });
        }
    }

    /**
     * @param {ProcessedEvent} event
     * @param {MouseEvent} mouseEvent
     */
    function handleEventClick(event, mouseEvent) {
        mouseEvent.stopPropagation();
        mouseEvent.preventDefault();
        
        // Find the original event from the processed event
        const originalEvent = events.find(e => e.id === event.originalEventId);
        if (originalEvent) {
            dispatch('eventClick', originalEvent);
        }
    }

    /**
     * @param {KeyboardEvent} e
     * @param {ProcessedEvent} event
     */
    function handleEventKeydown(e, event) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleEventClick(event, /** @type {MouseEvent} */ (/** @type {unknown} */ (e)));
        }
    }

    onMount(async () => {
        init();
        await tick();
        scrollToToday();
    });
</script>

<div class="scheduler-container shadow-sm" style="grid-template-columns: {actualNamesWidth}px 1fr;">
    <!-- Top-Left Corner -->
    <div
        class="scheduler-corner border-r border-b bg-slate-50/50 flex items-center justify-center"
    >
        {#if shortenPersonnelCol}
            <PeopleIcon />
        {:else}
            <h3 class="text-sm font-medium text-slate-900">Personnel</h3>
        {/if}
    </div>

    <!-- Timeline Header -->
    <div
        bind:this={headerRef}
        class="scheduler-header-container bg-slate-50/50 border-b overflow-hidden"
    >
        <div
            class="relative"
            style="width: {visibleDays.length * dayWidth}px; height: 100%"
        >
            <!-- Months Row -->
            {#each visibleMonths as month}
                <div
                    class="absolute top-0 h-8 flex items-center justify-center border-r border-slate-200"
                    style="left: {month.left}px; width: {month.width}px"
                >
                    <span
                        class="font-medium text-xs text-slate-600 tracking-wide"
                        >{month.name}</span
                    >
                </div>
            {/each}
            <!-- Days Row -->
            {#each visibleDays as day, index}
                <div
                    class="absolute top-8 text-center text-xs h-16 pt-2 flex flex-col items-center justify-center border-r border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors"
                    class:font-semibold={day.isToday}
                    class:text-blue-600={day.isToday}
                    class:today-highlight={day.isToday}
                    class:selected-date={selectedDate === day.iso}
                    class:weekend-highlight={highlightWeekends && day.isWeekend}
                    class:header-highlight={highlight &&
                        hoveredCell.dayIndex === index}
                    style="left: {index * dayWidth}px; width: {dayWidth}px"
                    on:click={() => handleDateClick(day.iso)}
                    role="button"
                    tabindex="0"
                    on:keydown={(e) => e.key === 'Enter' && handleDateClick(day.iso)}
                >
                    <span
                        class="text-slate-400 text-[10px] uppercase tracking-wider mb-1"
                        >{day.name.slice(0, 2)}</span
                    >
                    <span class="text-slate-900 font-medium text-sm"
                        >{day.date.split(".")[0]}</span
                    >
                </div>
            {/each}
        </div>
    </div>

    <!-- Names Column -->
    <div
        bind:this={namesRef}
        class="scheduler-names-container bg-white border-r overflow-hidden"
        style="width: {actualNamesWidth}px;"
    >
        <div class="relative">
            {#each persons as person, personIndex}
                <div
                    class="person-row flex items-center border-b border-slate-100"
                    class:px-4={!shortenPersonnelCol}
                    class:px-2={shortenPersonnelCol}
                    class:py-3={!shortenPersonnelCol}
                    class:py-2={shortenPersonnelCol}
                    class:justify-center={shortenPersonnelCol}
                    class:header-highlight={highlight &&
                        hoveredCell.personIndex === personIndex}
                    style="height: {rowHeight}px"
                    title={shortenPersonnelCol ? `${person.name} - ${person.title}` : ''}
                >
                    {#if shortenPersonnelCol}
                        <!-- Shortened view - only avatar -->
                        <div
                            class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0"
                        >
                            <span class="text-xs font-medium text-slate-600"
                                >{person.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}</span
                            >
                        </div>
                    {:else}
                        <!-- Full view - avatar and text -->
                        <div class="flex items-center space-x-3">
                            <div
                                class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0"
                            >
                                <span class="text-xs font-medium text-slate-600"
                                    >{person.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}</span
                                >
                            </div>
                            <div class="min-w-0 flex-1">
                                <p
                                    class="font-medium text-sm text-slate-900 leading-none truncate"
                                >
                                    {person.name}
                                </p>
                                <p class="text-xs text-slate-500 mt-1 truncate">
                                    {person.title}
                                </p>
                            </div>
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
    </div>

    <!-- Main Grid and Events -->
    <div
        bind:this={gridRef}
        on:scroll={syncScroll}
        class="scheduler-grid-container overflow-auto bg-white"
    >
        <div
            class="relative"
            style="width: {visibleDays.length *
                dayWidth}px; height: {persons.length * rowHeight}px"
        >
            <!-- Grid Cells -->
            {#each visibleDays as day, dayIndex}
                {#each persons as person, personIndex}
                    <div
                        class="day-cell absolute border-r border-b border-slate-50 cursor-pointer"
                        class:selected-date-cell={selectedDate === day.iso}
                        class:weekend-highlight={highlightWeekends && day.isWeekend}
                        on:mouseenter={() =>
                            handleCellHover(dayIndex, personIndex)}
                        on:mouseleave={handleCellLeave}
                        on:click={() => handleDateClick(day.iso)}
                        role="button"
                        tabindex="0"
                        on:keydown={(e) => e.key === 'Enter' && handleDateClick(day.iso)}
                        style="left: {dayIndex *
                            dayWidth}px; top: {personIndex *
                            rowHeight}px; width: {dayWidth}px; height: {rowHeight}px"
                    >
                        {#if day.isToday}
                            <div class="w-full h-full today-highlight"></div>
                        {/if}
                    </div>
                {/each}
            {/each}

            <!-- Events -->
            {#each processedEvents as event}
                <div
                    class="absolute flex items-center justify-center p-1 pointer-events-auto cursor-pointer"
                    style={getEventStyle(event, showWeekends)}
                    on:click={(e) => handleEventClick(event, e)}
                    role="button"
                    tabindex="0"
                    on:keydown={(e) => handleEventKeydown(e, event)}
                    aria-label="Event: {event.name}"
                >
                    <div
                        class="h-full w-full rounded-md text-white text-xs flex items-center px-2 shadow-sm hover:shadow-md transition-all duration-200 {event.color} border border-white/20 hover:scale-105"
                        class:multi-person-event={event.isMultiPerson}
                        class:clamped-event={event.isClamped}
                        class:clamped-start={event.clampedStart}
                        class:clamped-end={event.clampedEnd}
                        title={event.isMultiPerson ? `${event.name} (shared with ${event.persons?.length || 0} people)${event.isClamped ? ' - extends beyond visible range' : ''}` : `${event.name}${event.isClamped ? ' - extends beyond visible range' : ''}`}
                    >
                        {#if event.clampedStart}
                            <span class="text-xs opacity-75 mr-1">⤢</span>
                        {/if}
                        <span class="truncate font-medium">{event.name}</span>
                        {#if event.isMultiPerson}
                            <span class="ml-1 text-xs opacity-75">👥</span>
                        {/if}
                        {#if event.clampedEnd}
                            <span class="ml-1 text-xs opacity-75">⤡</span>
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div>

<style>
    :root {
        --row-height: 52px;
        --header-height: 97px;
        --names-width: 240px;
        --names-width-short: 60px;
        --day-width: 48px;
    }

    .scheduler-container {
        display: grid;
        height: 100%;
        /* grid-template-columns is now set dynamically via style attribute */
        grid-template-rows: var(--header-height) 1fr;
        grid-template-areas:
            "corner header"
            "names  grid";
        border: 1px solid hsl(214.3 31.8% 91.4%);
        border-radius: 0.5rem;
        overflow: hidden;
        background: hsl(0 0% 100%);
    }
    .scheduler-corner {
        grid-area: corner;
    }
    .scheduler-header-container {
        grid-area: header;
    }
    .scheduler-names-container {
        grid-area: names;
    }
    .scheduler-grid-container {
        grid-area: grid;
    }

    .weekend-highlight {
        background-color: hsl(210 40% 98%) !important;
    }

    .header-highlight {
        background-color: hsl(221.2 83.2% 53.3% / 0.08) !important;
    }

    .today-highlight {
        background-color: hsl(221.2 83.2% 53.3% / 0.12);
    }

    .person-row:hover {
        background-color: hsl(210 40% 98%);
    }

    .selected-date {
        background-color: hsl(221.2 83.2% 53.3% / 0.15) !important;
        border: 2px solid hsl(221.2 83.2% 53.3%);
        color: hsl(221.2 83.2% 53.3%) !important;
        font-weight: 600 !important;
    }

    .selected-date-cell {
        background-color: hsl(221.2 83.2% 53.3% / 0.08);
    }

    .day-cell {
        transition: background-color 0.15s ease-in-out;
    }

    .day-cell:hover {
        background-color: hsl(210 40% 96%);
    }

    .scheduler-grid-container {
        scroll-behavior: smooth;
    }

    .multi-person-event {
        border-left: 3px solid rgba(255, 255, 255, 0.8);
    }

    .clamped-event {
        border-right: 3px solid rgba(255, 255, 255, 0.8);
        border-left: 3px solid rgba(255, 255, 255, 0.8);
    }

    .clamped-start {
        border-left: 3px solid rgba(255, 255, 255, 0.8);
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }

    .clamped-end {
        border-right: 3px solid rgba(255, 255, 255, 0.8);
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }
</style>
