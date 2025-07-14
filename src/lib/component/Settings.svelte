<script>
    /** @type {boolean} */
    export let enableHighlight = true;
    
    let showWeekends = true;
    let compactView = false;
</script>

<div class="h-full bg-white border-l border-slate-200">
    <div class="p-6">
        <div class="mb-6">
            <h2 class="text-lg font-semibold text-slate-900">Settings</h2>
            <p class="text-sm text-slate-500 mt-1">Customize your calendar view</p>
        </div>
        
        <div class="space-y-6">
            <!-- Display Options -->
            <div class="space-y-4">
                <div>
                    <h3 class="text-sm font-medium text-slate-900 mb-3">Display</h3>
                    <div class="space-y-3">
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
                            <span class="text-sm text-slate-700">Compact view</span>
                            <input 
                                type="checkbox" 
                                bind:checked={compactView} 
                                class="h-4 w-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
                            >
                        </label>
                    </div>
                </div>
            </div>
            
            <div class="border-t border-slate-100 pt-6">
                <h3 class="text-sm font-medium text-slate-900 mb-3">Quick Actions</h3>
                <div class="space-y-2">
                    <button class="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors">
                        Go to today
                    </button>
                    <button class="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors">
                        Export calendar
                    </button>
                    <button class="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors">
                        Print view
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
