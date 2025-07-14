<script>
    import { createEventDispatcher } from 'svelte';
    
    const dispatch = createEventDispatcher();
    
    /** @type {{id: number, name: string, title: string}} */
    export let person;
    
    function handleRemove() {
        dispatch('remove', person.id);
    }
</script>

<div class="flex items-center justify-between p-2 bg-slate-50 rounded-md">
    <div class="flex-1 min-w-0">
        <div class="text-sm font-medium text-slate-900 truncate">{person.name}</div>
        <div class="text-xs text-slate-500 truncate">{person.title}</div>
    </div>
    <button 
        on:click={handleRemove}
        class="ml-2 p-1 text-slate-400 hover:text-red-500 transition-colors"
        title="Remove person"
    >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
    </button>
</div>
