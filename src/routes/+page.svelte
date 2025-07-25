<script>
    import Calendar from '$lib/component/Calendar.svelte';
    import Settings from '$lib/component/Settings.svelte';
    import { onMount } from 'svelte';

    /**
     * @typedef {import('./../lib/component/types.js').CalendarEvent} CalendarEvent
     * @typedef {import('./../lib/component/types.js').Person} Person
     */

    // Sample persons data
    /** @type {Person[]} */
    let persons = [
        { id: 1, name: 'Max Mustermann', title: 'Projektmanager' },
        { id: 2, name: 'Erika Mustermann', title: 'Entwicklerin' },
        { id: 3, name: 'John Doe', title: 'Designer' },
        { id: 4, name: 'Jane Smith', title: 'QA Testerin' },
        { id: 5, name: 'Peter Jones', title: 'Entwickler' },
        { id: 6, name: 'Maria Garcia', title: 'Frontend-Entwicklerin' },
        { id: 7, name: 'David Wilson', title: 'DevOps Engineer' },
        { id: 8, name: 'Sarah Brown', title: 'Produktmanagerin' },
        { id: 9, name: 'Chris Lee', title: 'Backend-Entwickler' },
        { id: 10, name: 'Anna Schmidt', title: 'UI/UX Designerin' },
        { id: 11, name: 'Tom Taylor', title: 'Datenanalyst' },
        { id: 12, name: 'Laura Martinez', title: 'Scrum Master' },
    ];

    // Sample events data
    /** @type {CalendarEvent[]} */
    let events = [
        { 
            id: 1, 
            startDate: '2025-01-15', 
            endDate: '2025-01-25', 
            title: 'Urlaub', 
            persons: [2], 
            description: 'Winterurlaub',
            category: 'vacation',
            color: 'green',
            place: 'Alpen'
        },
        { 
            id: 2, 
            startDate: '2025-02-10', 
            endDate: '2025-02-18', 
            title: 'Konferenz in Berlin', 
            persons: [3], 
            description: 'Design Conference',
            category: 'conference',
            color: 'purple',
            place: 'Berlin'
        },
        { 
            id: 3, 
            startDate: '2025-03-05', 
            endDate: '2025-03-20', 
            title: 'Projekt Alpha', 
            persons: [5], 
            description: 'Entwicklung neuer Features',
            category: 'project',
            color: 'blue',
            place: 'Remote'
        },
        { 
            id: 4, 
            startDate: '2025-03-10', 
            endDate: '2025-04-10', 
            title: 'Q2 Planung', 
            persons: [1], 
            description: 'Quartalsplanung',
            category: 'planning',
            color: 'amber',
            place: 'Büro'
        },
        { 
            id: 5, 
            startDate: '2025-04-01', 
            endDate: '2025-04-15', 
            title: 'Testing-Phase 1', 
            persons: [4], 
            description: 'Qualitätssicherung',
            category: 'testing',
            color: 'red',
            place: 'Testlabor'
        },
        { 
            id: 6, 
            startDate: '2025-06-20', 
            endDate: '2025-07-10', 
            title: 'Server-Migration', 
            persons: [7], 
            description: 'Infrastructure Update',
            category: 'infrastructure',
            color: 'gray',
            place: 'Rechenzentrum'
        },
        { 
            id: 7, 
            startDate: '2025-07-14', 
            endDate: '2025-07-30', 
            title: 'Q3 Planung', 
            persons: [8], 
            description: 'Produktstrategie Q3',
            category: 'planning',
            color: 'indigo',
            place: 'Büro'
        },
        { 
            id: 8, 
            startDate: '2025-08-01', 
            endDate: '2025-08-15', 
            title: 'Redesign-Workshop', 
            persons: [10], 
            description: 'UI/UX Überarbeitung',
            category: 'workshop',
            color: 'pink',
            place: 'Design Studio'
        },
        { 
            id: 9, 
            startDate: '2025-09-01', 
            endDate: '2025-09-20', 
            title: 'API-Entwicklung', 
            persons: [9], 
            description: 'Backend API v2.0',
            category: 'development',
            color: 'sky',
            place: 'Remote'
        },
    ];

    // Calendar date range - new configurable dates
    let calendarStartDate = new Date(2025, 0, 1); // January 1, 2025
    let calendarEndDate = new Date(2025, 12, 31); // December 31, 2025
    
    // Start date for the calendar (kept for backward compatibility)
    const startDate = new Date(2025, 0, 1); // January 1, 2025
    
    // Highlight option
    let enableHighlight = true;
    
    // Weekend display option
    let showWeekends = true;
    
    // Weekend highlighting option
    let highlightWeekends = false;
    
    // Navigation trigger for calendar
    let goToTodayTrigger = 0;
    let scrollLeftTrigger = 0;
    let scrollRightTrigger = 0;
    
    /** @type {string} */
    let locale = 'en-US'; // Changed default to English
    
    // Language mapping for display
    /** @type {Record<string, string>} */
    const languageNames = {
        'de-DE': 'Deutsch',
        'en-US': 'English', 
        'es-ES': 'Español',
        'fr-FR': 'Français'
    };
    
    /** @type {string|null} */
    let selectedDate = null;

    // Reference to Settings component to trigger event details popup
    /** @type {any} */
    let settingsComponent;

    // Mobile menu state
    let mobileMenuOpen = false;
    let isMobile = false;
    let shortenPersonnelCol = false;

    // Detect mobile screen size and auto-enable compact view
    function checkMobile() {
        const wasMobile = isMobile;
        isMobile = window.innerWidth < 768; // md breakpoint
        
        // Auto-enable compact view on mobile if not manually set
        if (isMobile && !wasMobile) {
            shortenPersonnelCol = true;
        } else if (!isMobile && wasMobile && shortenPersonnelCol) {
            // Auto-disable when moving to desktop, but only if it was auto-enabled
            shortenPersonnelCol = false;
        }
    }

    function toggleMobileMenu() {
        mobileMenuOpen = !mobileMenuOpen;
    }

    function closeMobileMenu() {
        mobileMenuOpen = false;
    }

    function handleGoToToday() {
        goToTodayTrigger += 1; // Increment to trigger reactive update
    }

    function handleScrollLeft() {
        scrollLeftTrigger += 1;
    }

    function handleScrollRight() {
        scrollRightTrigger += 1;
    }

    onMount(() => {
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    });

   



    /**
     * @param {CustomEvent} event
     */
    function handleDateSelect(event) {
        const { date } = event.detail;
        console.log('Date selected:', date);
        // Add your custom logic here for when a date is selected
    }

    /**
     * @param {CustomEvent} event
     */
    function handleDateUnselect(event) {
        const { date } = event.detail;
        console.log('Date unselected:', date);
        // Add your custom logic here for when a date is deselected
    }

    /**
     * @param {CustomEvent} event
     */
    function handleAddEvent(event) {
        const newEvent = event.detail;
        events = [...events, newEvent];
    }

    /**
     * @param {CustomEvent} event
     */
    function handleEventClick(event) {
        const clickedEvent = event.detail;
        console.log('Event clicked:', clickedEvent);
        
        // Trigger the show event details popup in Settings component
        if (settingsComponent) {
            settingsComponent.showEventDetails(clickedEvent);
        }
    }

    /**
     * @param {CustomEvent} event
     */
    function handleDeleteEvent(event) {
        const eventId = event.detail;
        events = events.filter(e => e.id !== eventId);
    }


    /**
     * @param {KeyboardEvent} e
     */
    function handleMobileBackdropKeydown(e) {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    }
</script>

<svelte:head>
    <title>Personnel Calendar</title>
    <script src="https://cdn.tailwindcss.com"></script>
</svelte:head>

<main>
    <div class="flex h-screen">
        <!-- Main Content Area -->
        <div class="flex-1 flex flex-col overflow-hidden">
            <!-- Header -->
            <header class="bg-white border-b border-slate-200 px-4 md:px-6 py-4">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-xl md:text-2xl font-semibold text-slate-900">Personnel Planning</h1>
                        <p class="text-sm text-slate-500 mt-1">2025 Calendar Overview</p>
                    </div>
                    <div class="flex items-center space-x-2 md:space-x-4">
                        <!-- Navigation buttons -->
                        <div class="flex items-center space-x-1">
                            <button 
                                on:click={handleScrollLeft}
                                class="p-2 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                title="Scroll left"
                                aria-label="Scroll calendar left"
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button 
                                on:click={handleGoToToday}
                                class="px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                                title="Go to today"
                            >
                                Today
                            </button>
                            <button 
                                on:click={handleScrollRight}
                                class="p-2 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                title="Scroll right"
                                aria-label="Scroll calendar right"
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        <!-- Desktop info - hidden on mobile -->
                        <div class="hidden md:flex items-center space-x-4">
                            <div class="text-sm text-slate-500">
                                {persons.length} team members
                            </div>
                            <div class="text-sm text-slate-500">
                                {events.length} scheduled events
                            </div>
                            <div class="text-sm text-slate-500">
                                {languageNames[locale]}
                            </div>
                        </div>
                        
                        <!-- Mobile hamburger button -->
                        <button 
                            on:click={toggleMobileMenu}
                            class="md:hidden p-2 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Toggle menu"
                        >
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {#if mobileMenuOpen}
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                {:else}
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                                {/if}
                            </svg>
                        </button>
                    </div>
                </div>
            </header>
            
            <!-- Calendar Content -->
            <div class="flex-1 p-4 md:p-6 overflow-hidden">
                <Calendar 
                    {startDate}
                    {calendarStartDate}
                    {calendarEndDate}
                    {events}
                    {persons}
                    highlight={enableHighlight}
                    {goToTodayTrigger}
                    {scrollLeftTrigger}
                    {scrollRightTrigger}
                    {showWeekends}
                    {highlightWeekends}
                    {locale}
                    {shortenPersonnelCol}
                    bind:selectedDate
                    on:selectDate={handleDateSelect}
                    on:unselectDate={handleDateUnselect}
                    on:eventClick={handleEventClick}
                />
            </div>
        </div>
        
        <!-- Desktop Sidebar - hidden on mobile -->
        <div class="hidden md:block w-80 flex-shrink-0 shadow-sm">
            <Settings 
                bind:this={settingsComponent}
                bind:enableHighlight 
                bind:showWeekends
                bind:highlightWeekends
                bind:locale
                bind:persons
                bind:selectedDate
                bind:shortenPersonnelCol
                bind:calendarStartDate
                bind:calendarEndDate
                {events}
                on:goToToday={handleGoToToday}
                on:addEvent={handleAddEvent}
                on:deleteEvent={handleDeleteEvent}
            />
        </div>
    </div>
    
    <!-- Mobile Sidebar Overlay -->
    {#if mobileMenuOpen}
        <div class="md:hidden fixed inset-0 z-50 flex">
            <!-- Backdrop -->
            <div 
                class="fixed inset-0 bg-black bg-opacity-50" 
                on:click={closeMobileMenu}
                on:keydown={handleMobileBackdropKeydown}
                role="button"
                tabindex="0"
                aria-label="Close menu"
            ></div>
            
            <!-- Mobile Sidebar -->
            <div class="relative ml-auto w-80 max-w-full h-full bg-white shadow-xl">
                <Settings 
                    bind:enableHighlight 
                    bind:showWeekends
                    bind:highlightWeekends
                    bind:locale
                    bind:persons
                    bind:selectedDate
                    bind:shortenPersonnelCol
                    bind:calendarStartDate
                    bind:calendarEndDate
                    {events}
                    on:goToToday={handleGoToToday}
                    on:addEvent={handleAddEvent}
                    on:deleteEvent={handleDeleteEvent}
                    on:closeMobile={closeMobileMenu}
                />
            </div>
        </div>
    {/if}
</main>

<footer class="absolute bottom-0 left-0 w-full text-center text-sm text-slate-500 ">
        © 2025 Mahdi. All rights reserved.
</footer>

<style>
    main{
        @apply bg-slate-50;
        height: calc(100vh - 40px); /* Adjust for header height */
    }
</style>