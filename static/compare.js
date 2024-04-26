 
            const container = '#comparison-container';

            const compareButton = document.getElementById("toggleCompare");
            let isComparisonActive = false;
            let mapComparison = null;
            function toggleMapComparison() {
                isComparisonActive = !isComparisonActive;
                if (isComparisonActive) {
                    const beforeCenter = map.getCenter(); // Get the current center of the before map
                    const beforeZoom = map.getZoom(); // Get the current zoom of the before map
                    const beforePitch = map.getPitch();
                    afterMap.setCenter(beforeCenter); // Set the center of the after map to match the before map
                    afterMap.setZoom(beforeZoom); // Set the zoom of the after map to match the before map
                    afterMap.setPitch(beforePitch);
                    afterMap.setFog({});
                    mapComparison = new mapboxgl.Compare(afterMap, map, container); // Enable comparison

                    
                    
                } else {
                    if (mapComparison) { // If mapComparison is not null
                        mapComparison.remove(); // Disable comparison
                        mapComparison = null; // Reset mapComparison
                    }
                }
            }