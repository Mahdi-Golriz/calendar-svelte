<script>
    import { createEventDispatcher } from 'svelte';
    import PersonSmallSettingsItem from './PersonSmallSettingsItem.svelte';
    import AddEventPopup from './AddEventPopup.svelte';
    import ShowEventPopup from './ShowEventPopup.svelte';
    
    /** @type {boolean} */
    export let isMobile = false;
    
    const dispatch = createEventDispatcher();
    
    /** @type {boolean} */
    export let enableHighlight = true;
    
    /** @type {boolean} */
    export let showWeekends = true;
    
    /** @type {boolean} */
    export let highlightWeekends = true;
    
    /** @type {string} */
    export let locale = 'de-DE';
    
    /** @type {Array<{id: number, name: string, title: string}>} */
    export let persons = [];
    
    /** @type {string|null} */
    export let selectedDate = null;
    
    /** @type {Array<Object>} */
    export let events = [];
    
    /** @type {boolean} */
    export let shortenPersonnelCol = false;
    
    let newPersonName = '';
    let newPersonTitle = '';
    let showAddForm = false;
    let showEventPopup = false;
    let showEventDetailsPopup = false;
    let selectedEventForDetails = null;
    
    const availableLanguages = [
        { code: 'de-DE', name: 'Deutsch' },
        { code: 'en-US', name: 'English' },
        { code: 'es-ES', name: 'Español' },
        { code: 'fr-FR', name: 'Français' }
    ];
    
    function handleGoToToday() {
        dispatch('goToToday');
    }
    
    function handleAddPerson() {
        if (newPersonName.trim() && newPersonTitle.trim()) {
            const newPerson = {
                id: Math.max(...persons.map(p => p.id), 0) + 1,
                name: newPersonName.trim(),
                title: newPersonTitle.trim()
            };
            persons = [...persons, newPerson];
            newPersonName = '';
            newPersonTitle = '';
            showAddForm = false;
        }
    }
    
    function handleRemovePerson(event) {
        const personId = event.detail;
        persons = persons.filter(p => p.id !== personId);
    }
    
    function toggleAddForm() {
        showAddForm = !showAddForm;
        if (!showAddForm) {
            newPersonName = '';
            newPersonTitle = '';
        }
    }
    
    function clearSelectedDate() {
        selectedDate = null;
    }
    
    function formatDateForDisplay(isoDate) {
        const date = new Date(isoDate);
        return new Intl.DateTimeFormat(locale, { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        }).format(date);
    }
    
    function handleAddEvent(event) {
        const newEvent = event.detail;
        dispatch('addEvent', newEvent);
    }
    
    function handleShowEventDetails(event) {
        selectedEventForDetails = event.detail;
        showEventDetailsPopup = true;
    }
    
    function handleEditEvent(event) {
        // For now, just close the details popup
        // You could implement edit functionality here
        showEventDetailsPopup = false;
        console.log('Edit event:', event.detail);
    }
    
    function handleDeleteEvent(event) {
        const eventId = event.detail;
        dispatch('deleteEvent', eventId);
        showEventDetailsPopup = false;
    }
    
    function toggleEventPopup() {
        showEventPopup = !showEventPopup;
    }

    function handleCloseMobile() {
        dispatch('closeMobile');
    }

    // Public method to show event details (called from parent component)
    export function showEventDetails(event) {
        selectedEventForDetails = event;
        showEventDetailsPopup = true;
    }
</script>

<div class="h-full bg-white border-l border-slate-200">
    <div class="p-4 md:p-6 h-full overflow-y-auto">
        <!-- Mobile header with close button -->
        <div class="md:hidden flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
            <h2 class="text-lg font-semibold text-slate-900">Settings</h2>
            <button 
                on:click={handleCloseMobile}
                class="p-2 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                aria-label="Close settings"
            >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        
        <!-- Desktop header -->
        <div class="hidden md:block mb-6">
            <h2 class="text-lg font-semibold text-slate-900">Settings</h2>
            <p class="text-sm text-slate-500 mt-1">Customize your calendar view</p>
        </div>
        
        <!-- Mobile status info -->
        <div class="md:hidden mb-6 grid grid-cols-2 gap-4 text-sm">
            <div class="text-center p-3 bg-slate-50 rounded-md">
                <div class="font-medium text-slate-900">{persons.length}</div>
                <div class="text-slate-500">Team members</div>
            </div>
            <div class="text-center p-3 bg-slate-50 rounded-md">
                <div class="font-medium text-slate-900">{events.length}</div>
                <div class="text-slate-500">Events</div>
            </div>
        </div>
        
        <div class="space-y-6">
            <!-- Selected Date -->
            {#if selectedDate}
                <div class="space-y-4 border-b border-slate-100 pb-6">
                    <div class="flex items-center justify-between">
                        <h3 class="text-sm font-medium text-slate-900">Selected Date</h3>
                        <button 
                            on:click={clearSelectedDate}
                            class="text-xs text-red-600 hover:text-red-700 font-medium"
                        >
                            Clear
                        </button>
                    </div>
                    
                    <div class="px-3 py-2 bg-blue-50 text-blue-700 rounded-md text-sm font-medium">
                        {formatDateForDisplay(selectedDate)}
                    </div>
                </div>
            {/if}

            <!-- Event Management -->
            <div class="space-y-4 border-t border-slate-100 pt-6">
                <div class="flex items-center justify-between">
                    <h3 class="text-sm font-medium text-slate-900">Events</h3>
                    <button 
                        on:click={toggleEventPopup}
                        class="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Add Event
                    </button>
                </div>
                
                <div class="text-xs text-slate-500">
                    {events.length} scheduled events
                </div>
            </div>

            <!-- Team Management -->
            <div class="space-y-4">
                <div class="flex items-center justify-between">
                    <h3 class="text-sm font-medium text-slate-900">Team Members</h3>
                    <button 
                        on:click={toggleAddForm}
                        class="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                        {showAddForm ? 'Cancel' : 'Add Person'}
                    </button>
                </div>
                
                {#if showAddForm}
                    <div class="p-3 bg-blue-50 rounded-md space-y-3">
                        <input 
                            type="text" 
                            placeholder="Full name"
                            bind:value={newPersonName}
                            class="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                        <input 
                            type="text" 
                            placeholder="Job title"
                            bind:value={newPersonTitle}
                            class="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                        <button 
                            on:click={handleAddPerson}
                            disabled={!newPersonName.trim() || !newPersonTitle.trim()}
                            class="w-full px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                        >
                            Add Person
                        </button>
                    </div>
                {/if}
                
                <div class="space-y-2 max-h-48 overflow-y-auto">
                    {#each persons as person (person.id)}
                        <PersonSmallSettingsItem 
                            {person} 
                            on:remove={handleRemovePerson}
                        />
                    {/each}
                    {#if persons.length === 0}
                        <div class="text-xs text-slate-400 text-center py-4">
                            No team members added yet
                        </div>
                    {/if}
                </div>
            </div>
            
            <!-- Display Options -->
            <div class="space-y-4 border-t border-slate-100 pt-6">
                <div>
                    <h3 class="text-sm font-medium text-slate-900 mb-3">Display</h3>
                    <div class="space-y-3">
                        <!-- Language Selection -->
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-slate-700">Language</span>
                            <select 
                                bind:value={locale}
                                class="text-sm border border-slate-200 rounded-md px-2 py-1 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                {#each availableLanguages as lang}
                                    <option value={lang.code}>{lang.name}</option>
                                {/each}
                            </select>
                        </div>
                        
                        <label class="flex items-center justify-between">
                            <span class="text-sm text-slate-700">Header highlighting</span>
                            <input 
                                type="checkbox" 
                                bind:checked={enableHighlight} 
                                class="h-4 w-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
                            >
                        </label>
                        
                        <label class="flex items-center justify-between">
                            <span class="text-sm text-slate-700">Show weekends</span>
                            <input 
                                type="checkbox" 
                                bind:checked={showWeekends} 
                                class="h-4 w-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
                            >
                        </label>
                        
                        <label class="flex items-center justify-between">
                            <span class="text-sm text-slate-700">Highlight weekends</span>
                            <input 
                                type="checkbox" 
                                bind:checked={highlightWeekends} 
                                class="h-4 w-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
                            >
                        </label>
                        
                        <label class="flex items-center justify-between">
                            <span class="text-sm text-slate-700">Compact personnel view</span>
                            <input 
                                type="checkbox" 
                                bind:checked={shortenPersonnelCol} 
                                class="h-4 w-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
                            >
                        </label>
                        
                    </div>
                </div>
                
                <div class="border-t border-slate-100 pt-6">
                    <h3 class="text-sm font-medium text-slate-900 mb-3">Quick Actions</h3>
                    <div class="space-y-2">
                        <button 
                            on:click={handleGoToToday}
                            class="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors">
                            Go to today
                        </button>
                    </div>
                </div>
                
                <div class="border-t border-slate-100 pt-6">
                    <h3 class="text-sm font-medium text-slate-900 mb-3">View Options</h3>
                    <div class="grid grid-cols-2 gap-2">
                        <button class="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors">
                            Year
                        </button>
                        <button class="px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">
                            Quarter
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<ShowEventPopup 
    bind:isOpen={showEventDetailsPopup}
    event={selectedEventForDetails}
    {persons}
    on:editEvent={handleEditEvent}
    on:deleteEvent={handleDeleteEvent}
/>

<AddEventPopup 
    bind:isOpen={showEventPopup}
    {persons}
    on:addEvent={handleAddEvent}
/>