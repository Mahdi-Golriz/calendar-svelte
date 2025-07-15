<script>
    import { createEventDispatcher } from 'svelte';
    
    const dispatch = createEventDispatcher();
    
    /**
     *  @typedef {import('./types').CalendarEvent} CalendarEvent
     */


    /** @type {boolean} */
    export let isOpen = false;
    
    /** @type {CalendarEvent|null} */
    export let event = null;
    
    /** @type {Array<{id: number, name: string, title: string}>} */
    export let persons = [];
    
    function closePopup() {
        isOpen = false;
        event = null;
    }
    
    
    function handleDelete() {
        if (event && confirm('Are you sure you want to delete this event?')) {
            dispatch('deleteEvent', event.originalEventId || event.id);
            closePopup();
        }
    }
    
    /**
     * @param {MouseEvent} event
     */
    function handleBackdropClick(event) {
        if (event.target === event.currentTarget) {
            closePopup();
        }
    }

    /**
     * @param {KeyboardEvent} event
     */
    function handleBackdropKeydown(event) {
        if (event.key === 'Escape') {
            closePopup();
        }
    }
    
    /**
     * @param {string} dateStr
     */
    function formatDate(dateStr) {
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('en-US', { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        }).format(date);
    }
    
    function getAssignedPersons() {
        if (!event?.persons) return [];
        return persons.filter(person => event?.persons?.includes(person.id) ?? false);
    }
    
    /**
     * @param {string} category
     */
    function getCategoryLabel(category) {

        /** @type {Record<string, string>} */
        const categories = {
            'vacation': 'Vacation',
            'conference': 'Conference',
            'project': 'Project',
            'planning': 'Planning',
            'testing': 'Testing',
            'infrastructure': 'Infrastructure',
            'workshop': 'Workshop',
            'development': 'Development'
        };
        return categories[category] || category;
    }
    
    /**
     * @param {string} color
     */
    function getColorName(color) {
        /** @type {Record<string, string>} */
        const colors = {
            'blue': 'Blue',
            'green': 'Green',
            'purple': 'Purple',
            'red': 'Red',
            'amber': 'Amber',
            'gray': 'Gray',
            'indigo': 'Indigo',
            'pink': 'Pink',
            'sky': 'Sky'
        };
        return colors[color] || color;
    }
</script>

{#if isOpen && event}
    <!-- Backdrop -->
    <div 
        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        on:click={handleBackdropClick}
        on:keydown={handleBackdropKeydown}
        role="dialog"
        aria-modal="true"
    >
        <!-- Popup Content -->
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-slate-200">
                <div class="flex items-center space-x-3">
                    <div class="w-4 h-4 rounded {event.color || 'bg-blue-500'}"></div>
                    <h2 class="text-xl font-semibold text-slate-900">{event.title || event.name}</h2>
                </div>
                <button 
                    on:click={closePopup}
                    class="text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            
            <!-- Event Details -->
            <div class="p-6">
                <div class="space-y-6">
                    <!-- Date Range -->
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <h3 class="text-sm font-medium text-slate-700 mb-2">Start Date</h3>
                            <div class="px-3 py-2 bg-slate-50 rounded-md text-sm text-slate-900">
                                {formatDate(event.startDate ?? event.start)}
                            </div>
                        </div>
                        <div>
                            <h3 class="text-sm font-medium text-slate-700 mb-2">End Date</h3>
                            <div class="px-3 py-2 bg-slate-50 rounded-md text-sm text-slate-900">
                                {formatDate(event.endDate ?? event.end)}
                            </div>
                        </div>
                    </div>
                    
                    <!-- Category and Color -->
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <h3 class="text-sm font-medium text-slate-700 mb-2">Category</h3>
                            <div class="px-3 py-2 bg-slate-50 rounded-md text-sm text-slate-900">
                                {getCategoryLabel(event.category ?? "") || 'Not specified'}
                            </div>
                        </div>
                        <div>
                            <h3 class="text-sm font-medium text-slate-700 mb-2">Color</h3>
                            <div class="flex items-center space-x-2">
                                <div class="w-4 h-4 rounded {event.color || 'bg-blue-500'}"></div>
                                <span class="text-sm text-slate-900">{getColorName(event.color ?? "") || 'Blue'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Location -->
                    {#if event.place}
                        <div>
                            <h3 class="text-sm font-medium text-slate-700 mb-2">Location</h3>
                            <div class="px-3 py-2 bg-slate-50 rounded-md text-sm text-slate-900">
                                {event.place}
                            </div>
                        </div>
                    {/if}
                    
                    <!-- Description -->
                    {#if event.description}
                        <div>
                            <h3 class="text-sm font-medium text-slate-700 mb-2">Description</h3>
                            <div class="px-3 py-2 bg-slate-50 rounded-md text-sm text-slate-900 whitespace-pre-wrap">
                                {event.description}
                            </div>
                        </div>
                    {/if}
                    
                    <!-- Assigned Persons -->
                    <div>
                        <h3 class="text-sm font-medium text-slate-700 mb-2">
                            Assigned Team Members ({getAssignedPersons().length})
                        </h3>
                        <div class="space-y-2 max-h-32 overflow-y-auto">
                            {#each getAssignedPersons() as person}
                                <div class="flex items-center space-x-3 px-3 py-2 bg-slate-50 rounded-md">
                                    <div class="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
                                        <span class="text-xs font-medium text-slate-600">
                                            {person.name.split(' ').map(n => n[0]).join('')}
                                        </span>
                                    </div>
                                    <div class="flex-1">
                                        <div class="text-sm font-medium text-slate-900">{person.name}</div>
                                        <div class="text-xs text-slate-500">{person.title}</div>
                                    </div>
                                </div>
                            {/each}
                            {#if getAssignedPersons().length === 0}
                                <div class="text-sm text-slate-400 text-center py-4">
                                    No team members assigned
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>
                
                <!-- Actions -->
                <div class="flex justify-between space-x-3 mt-8 pt-6 border-t border-slate-200">
                    <button 
                        on:click={handleDelete}
                        class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                    >
                        Delete Event
                    </button>
                    <div class="flex space-x-3">
                        <button 
                            on:click={closePopup}
                            class="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}
