<script>
    import Calendar from '$lib/component/Calendar.svelte';

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
</script>

<svelte:head>
    <title>Personal Calendar</title>
    <script src="https://cdn.tailwindcss.com"></script>
</svelte:head>

<main class="p-4 bg-gray-100 min-h-screen">
    <div class="max-w-7xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-800 mb-6">Personalplanung 2025</h1>
        
        <div class="mb-4">
            <label class="flex items-center space-x-2">
                <input type="checkbox" bind:checked={enableHighlight} class="form-checkbox">
                <span class="text-gray-700">Enable header highlighting on hover</span>
            </label>
        </div>
        
        <Calendar 
            {startDate}
            {events}
            {persons}
            highlight={enableHighlight}
        />
    </div>
</main>
