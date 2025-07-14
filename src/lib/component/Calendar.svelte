<script>
    import { onMount, tick } from 'svelte';

    /** @type {Date} */
    export let startDate = new Date();
    
    /** @type {Array<{id: string|number, startDate: string, endDate: string, title: string, persons: Array<string|number>, description?: string, category?: string, color?: string, place?: string}>} */
    export let events = [];
    
    /** @type {Array<{id: string|number, name: string, title: string}>} */
    export let persons = [];

    let days = [];
    let months = [];
    let headerRef;
    let namesRef;
    let gridRef;

    // CSS custom properties for consistent sizing
    const rowHeight = 55;
    const headerHeight = 60;
    const namesWidth = 220;
    const dayWidth = 50;

    $: processedEvents = events.map(event => ({
        ...event,
        personId: event.persons?.[0] || null, // Use first person for positioning
        start: event.startDate,
        end: event.endDate,
        name: event.title,
        color: event.color ? `bg-${event.color}-500` : 'bg-blue-500'
    }));

    function init() {
        const year = startDate.getFullYear();
        const startOfYear = new Date(year, 0, 1);
        const endOfYear = new Date(year, 11, 31);
        const today = new Date();
        
        const dayNames = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
        const monthNames = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
        
        days = [];
        months = [];
        let currentDate = new Date(startOfYear);
        let currentMonth = -1;

        while (currentDate <= endOfYear) {
            const dayOfWeek = currentDate.getDay();
            if (currentDate.getMonth() !== currentMonth) {
                currentMonth = currentDate.getMonth();
                const daysInMonth = new Date(year, currentMonth + 1, 0).getDate();
                months.push({
                    name: `${monthNames[currentMonth]} ${year}`,
                    left: days.length * dayWidth,
                    width: daysInMonth * dayWidth,
                });
            }

            days.push({
                name: dayNames[dayOfWeek],
                date: currentDate.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }),
                iso: currentDate.toISOString().split('T')[0],
                isToday: currentDate.toDateString() === today.toDateString(),
                isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
            });
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }

    function syncScroll(event) {
        if (headerRef) headerRef.scrollLeft = event.target.scrollLeft;
        if (namesRef) namesRef.scrollTop = event.target.scrollTop;
    }

    function scrollToToday() {
        const todayIndex = days.findIndex(d => d.isToday);
        if (todayIndex > -1 && gridRef) {
            const gridWidth = gridRef.clientWidth;
            const centeredPosition = (todayIndex * dayWidth) - (gridWidth / 2) + (dayWidth / 2);
            gridRef.scrollLeft = centeredPosition;
        }
    }

    function getEventStyle(event) {
        const personIndex = persons.findIndex(p => p.id === event.personId);
        const startIndex = days.findIndex(d => d.iso === event.start);
        const endIndex = days.findIndex(d => d.iso === event.end);

        if (personIndex === -1 || startIndex === -1 || endIndex === -1) return 'display: none;';

        const top = personIndex * rowHeight;
        const left = startIndex * dayWidth;
        const width = (endIndex - startIndex + 1) * dayWidth;
        const height = rowHeight;

        return `top: ${top}px; left: ${left}px; width: ${width}px; height: ${height}px;`;
    }

    onMount(async () => {
        init();
        await tick();
        scrollToToday();
    });

    $: if (startDate) {
        init();
    }
</script>

<style>
    :root {
        --row-height: 55px;
        --header-height: 80px;
        --names-width: 220px;
        --day-width: 50px;
    }

    .scheduler-container {
        display: grid;
        height: 85vh;
        grid-template-columns: var(--names-width) 1fr;
        grid-template-rows: var(--header-height) 1fr;
        grid-template-areas:
            "corner header"
            "names  grid";
    }
    .scheduler-corner { grid-area: corner; }
    .scheduler-header-container { grid-area: header; }
    .scheduler-names-container { grid-area: names; }
    .scheduler-grid-container { grid-area: grid; }
    
    .weekend-highlight {
        background-color: #f8fafc;
    }
</style>

<div class="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
    <div class="scheduler-container">
        <!-- Top-Left Corner -->
        <div class="scheduler-corner border-r border-b border-gray-200 flex items-center justify-center bg-gray-50">
            <h3 class="text-lg font-semibold text-gray-800">Personal</h3>
        </div>

        <!-- Timeline Header -->
        <div bind:this={headerRef} class="scheduler-header-container bg-gray-50 border-b border-gray-200 overflow-hidden">
            <div class="relative" style="width: {days.length * dayWidth}px; height: 100%">
                <!-- Months Row -->
                {#each months as month}
                    <div class="absolute top-0 h-8 flex items-center justify-center border-r border-gray-200"
                         style="left: {month.left}px; width: {month.width}px">
                        <span class="font-semibold text-sm text-gray-600">{month.name}</span>
                    </div>
                {/each}
                <!-- Days Row -->
                {#each days as day, index}
                    <div class="absolute top-8 text-center text-xs h-12 pt-1"
                         class:font-bold={day.isToday}
                         class:text-blue-600={day.isToday}
                         class:bg-blue-100={day.isToday}
                         class:rounded-t-lg={day.isToday}
                         style="left: {index * dayWidth}px; width: {dayWidth}px">
                        <span class="text-gray-500">{day.name.slice(0, 1)}</span>
                        <p class="text-gray-800 font-medium">{day.date.split('.')[0]}</p>
                    </div>
                {/each}
            </div>
        </div>

        <!-- Names Column -->
        <div bind:this={namesRef} class="scheduler-names-container bg-white border-r border-gray-200 overflow-hidden">
            <div class="relative">
                {#each persons as person}
                    <div class="flex items-center px-4 border-b border-gray-100" style="height: {rowHeight}px">
                        <div>
                            <p class="font-semibold text-sm text-gray-800">{person.name}</p>
                            <p class="text-xs text-gray-500">{person.title}</p>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
        
        <!-- Main Grid and Events -->
        <div bind:this={gridRef} on:scroll={syncScroll} class="scheduler-grid-container overflow-auto">
            <div class="relative" style="width: {days.length * dayWidth}px; height: {persons.length * rowHeight}px">
                <!-- Grid Cells -->
                {#each days as day, dayIndex}
                    {#each persons as person, personIndex}
                        <div class="absolute border-r border-b border-gray-100"
                             class:weekend-highlight={day.isWeekend}
                             style="left: {dayIndex * dayWidth}px; top: {personIndex * rowHeight}px; width: {dayWidth}px; height: {rowHeight}px">
                            {#if day.isToday}
                                <div class="w-full h-full bg-blue-500/10"></div>
                            {/if}
                        </div>
                    {/each}
                {/each}

                <!-- Events -->
                {#each processedEvents as event}
                    <div class="absolute flex items-center justify-center p-1.5"
                         style={getEventStyle(event)}>
                        <div class="h-full w-full rounded-md text-white text-xs flex items-center px-2 shadow-md hover:opacity-80 transition-opacity {event.color}">
                            <span class="truncate">{event.name}</span>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>
