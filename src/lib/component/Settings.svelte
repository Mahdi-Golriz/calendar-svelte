<script>
    /** @type {boolean} */
    export let enableHighlight = true;
</script>

<div class="h-full bg-white border-l border-gray-200 shadow-lg">
    <div class="p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-6">Settings</h2>
        
        <div class="space-y-4">
            <div class="border-b border-gray-100 pb-4">
                <h3 class="text-sm font-medium text-gray-700 mb-3">Display Options</h3>
                <label class="flex items-center space-x-3">
                    <input 
                        type="checkbox" 
                        bind:checked={enableHighlight} 
                        class="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    >
                    <span class="text-sm text-gray-600">Enable header highlighting on hover</span>
                </label>
            </div>
            
            <!-- Additional settings can be added here -->
            <div class="border-b border-gray-100 pb-4">
                <h3 class="text-sm font-medium text-gray-700 mb-3">Calendar Options</h3>
                <p class="text-xs text-gray-500">More settings coming soon...</p>
            </div>
        </div>
    </div>
</div>
