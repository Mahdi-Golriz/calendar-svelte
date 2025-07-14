<script>
    import { createEventDispatcher } from 'svelte';
    
    const dispatch = createEventDispatcher();
    
    /** @type {boolean} */
    export let isOpen = false;
    
    /** @type {Array<{id: number, name: string, title: string}>} */
    export let persons = [];
    
    // Event form data
    let title = '';
    let startDate = '';
    let endDate = '';
    let description = '';
    let place = '';
    let category = 'project';
    let color = 'blue';
    let selectedPersons = [];
    
    const categories = [
        { value: 'vacation', label: 'Vacation' },
        { value: 'conference', label: 'Conference' },
        { value: 'project', label: 'Project' },
        { value: 'planning', label: 'Planning' },
        { value: 'testing', label: 'Testing' },
        { value: 'infrastructure', label: 'Infrastructure' },
        { value: 'workshop', label: 'Workshop' },
        { value: 'development', label: 'Development' }
    ];
    
    const colors = [
        { value: 'blue', label: 'Blue' },
        { value: 'green', label: 'Green' },
        { value: 'purple', label: 'Purple' },
        { value: 'red', label: 'Red' },
        { value: 'amber', label: 'Amber' },
        { value: 'gray', label: 'Gray' },
        { value: 'indigo', label: 'Indigo' },
        { value: 'pink', label: 'Pink' },
        { value: 'sky', label: 'Sky' }
    ];
    
    function closePopup() {
        isOpen = false;
        resetForm();
    }
    
    function resetForm() {
        title = '';
        startDate = '';
        endDate = '';
        description = '';
        place = '';
        category = 'project';
        color = 'blue';
        selectedPersons = [];
    }
    
    function handleSubmit() {
        if (!title.trim() || !startDate || !endDate) {
            return;
        }
        
        if (new Date(startDate) > new Date(endDate)) {
            alert('Start date cannot be after end date');
            return;
        }
        
        const newEvent = {
            id: Date.now(), // Simple ID generation
            title: title.trim(),
            startDate,
            endDate,
            description: description.trim(),
            place: place.trim(),
            category,
            color,
            persons: selectedPersons.map(id => parseInt(id))
        };
        
        dispatch('addEvent', newEvent);
        closePopup();
    }
    
    function handlePersonToggle(personId) {
        const id = personId.toString();
        if (selectedPersons.includes(id)) {
            selectedPersons = selectedPersons.filter(p => p !== id);
        } else {
            selectedPersons = [...selectedPersons, id];
        }
    }
    
    function handleBackdropClick(event) {
        if (event.target === event.currentTarget) {
            closePopup();
        }
    }
</script>

{#if isOpen}
    <!-- Backdrop -->
    <div 
        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        on:click={handleBackdropClick}
        role="dialog"
        aria-modal="true"
    >
        <!-- Popup Content -->
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-slate-200">
                <h2 class="text-xl font-semibold text-slate-900">Add New Event</h2>
                <button 
                    on:click={closePopup}
                    class="text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            
            <!-- Form -->
            <form on:submit|preventDefault={handleSubmit} class="p-6">
                <div class="space-y-6">
                    <!-- Title -->
                    <div>
                        <label for="title" class="block text-sm font-medium text-slate-700 mb-2">
                            Event Title *
                        </label>
                        <input 
                            id="title"
                            type="text" 
                            bind:value={title}
                            placeholder="Enter event title"
                            class="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                    </div>
                    
                    <!-- Date Range -->
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label for="startDate" class="block text-sm font-medium text-slate-700 mb-2">
                                Start Date *
                            </label>
                            <input 
                                id="startDate"
                                type="date" 
                                bind:value={startDate}
                                class="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                        </div>
                        <div>
                            <label for="endDate" class="block text-sm font-medium text-slate-700 mb-2">
                                End Date *
                            </label>
                            <input 
                                id="endDate"
                                type="date" 
                                bind:value={endDate}
                                class="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                        </div>
                    </div>
                    
                    <!-- Category and Color -->
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label for="category" class="block text-sm font-medium text-slate-700 mb-2">
                                Category
                            </label>
                            <select 
                                id="category"
                                bind:value={category}
                                class="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                {#each categories as cat}
                                    <option value={cat.value}>{cat.label}</option>
                                {/each}
                            </select>
                        </div>
                        <div>
                            <label for="color" class="block text-sm font-medium text-slate-700 mb-2">
                                Color
                            </label>
                            <select 
                                id="color"
                                bind:value={color}
                                class="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                {#each colors as colorOption}
                                    <option value={colorOption.value}>{colorOption.label}</option>
                                {/each}
                            </select>
                        </div>
                    </div>
                    
                    <!-- Place -->
                    <div>
                        <label for="place" class="block text-sm font-medium text-slate-700 mb-2">
                            Location
                        </label>
                        <input 
                            id="place"
                            type="text" 
                            bind:value={place}
                            placeholder="Enter location"
                            class="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                    </div>
                    
                    <!-- Description -->
                    <div>
                        <label for="description" class="block text-sm font-medium text-slate-700 mb-2">
                            Description
                        </label>
                        <textarea 
                            id="description"
                            bind:value={description}
                            placeholder="Enter event description"
                            rows="3"
                            class="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        ></textarea>
                    </div>
                    
                    <!-- Assigned Persons -->
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-2">
                            Assign Team Members
                        </label>
                        <div class="max-h-32 overflow-y-auto border border-slate-300 rounded-md p-2">
                            {#each persons as person}
                                <label class="flex items-center p-2 hover:bg-slate-50 rounded cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedPersons.includes(person.id.toString())}
                                        on:change={() => handlePersonToggle(person.id)}
                                        class="h-4 w-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
                                    >
                                    <span class="ml-2 text-sm text-slate-700">
                                        {person.name} - {person.title}
                                    </span>
                                </label>
                            {/each}
                            {#if persons.length === 0}
                                <div class="text-sm text-slate-400 text-center py-4">
                                    No team members available
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>
                
                <!-- Actions -->
                <div class="flex justify-end space-x-3 mt-8 pt-6 border-t border-slate-200">
                    <button 
                        type="button"
                        on:click={closePopup}
                        class="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        disabled={!title.trim() || !startDate || !endDate}
                        class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                    >
                        Create Event
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}
