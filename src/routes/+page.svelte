<script>
    import Calendar from '$lib/component/Calendar.svelte';
    import Settings from '$lib/component/Settings.svelte';

    // Sample persons data
    const persons = [
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
    const events = [
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

    // Start date for the calendar
    const startDate = new Date(2025, 0, 1); // January 1, 2025
    
    // Highlight option
    let enableHighlight = true;
    
    // Weekend display option
    let showWeekends = true;
    
    // Navigation trigger for calendar
    let goToTodayTrigger = 0;
    
    /** @type {string} */
    let locale = 'de-DE';

    function handleGoToToday() {
        goToTodayTrigger += 1; // Increment to trigger reactive update
    }
</script>

<svelte:head>
    <title>Personnel Calendar</title>
    <script src="https://cdn.tailwindcss.com"></script>
</svelte:head>

<main class="bg-slate-50 min-h-screen">
    <div class="flex h-screen">
        <!-- Main Content Area -->
        <div class="flex-1 flex flex-col overflow-hidden">
            <!-- Header -->
            <header class="bg-white border-b border-slate-200 px-6 py-4">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-2xl font-semibold text-slate-900">Personnel Planning</h1>
                        <p class="text-sm text-slate-500 mt-1">2025 Calendar Overview</p>
                    </div>
                    <div class="flex items-center space-x-4">
                        <div class="text-sm text-slate-500">
                            {persons.length} team members
                        </div>
                        <div class="text-sm text-slate-500">
                            {events.length} scheduled events
                        </div>
                    </div>
                </div>
            </header>
            
            <!-- Calendar Content -->
            <div class="flex-1 p-6 overflow-hidden">
                <Calendar 
                    {startDate}
                    {events}
                    {persons}
                    highlight={enableHighlight}
                    {goToTodayTrigger}
                    {showWeekends}
                    locale={locale}
                />
            </div>
        </div>
        
        <!-- Fixed Right Sidebar for Settings -->
        <div class="w-80 flex-shrink-0 shadow-sm">
            <Settings 
                bind:enableHighlight 
                bind:showWeekends
                bind:locale
                on:goToToday={handleGoToToday}
            />
        </div>
    </div>
</main>
