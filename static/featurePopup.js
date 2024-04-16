//featureInfo Popup
document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('toggleFeatureInfo');
    let featureInfoVisible = false;

    toggleButton.addEventListener('click', () => {
        featureInfoVisible = !featureInfoVisible;
        if (featureInfoVisible) {
            map.on('click', displayFeatureInfo);
            toggleButton.style.backgroundColor = 'rgb(232, 230, 230)';
            document.body.style.cursor = "pointer";
        } else {
            map.off('click', displayFeatureInfo);
            toggleButton.style.backgroundColor = 'white';
            document.body.style.cursor = "pointer";

        }
    });

    function displayFeatureInfo(e) {
        const features = map.queryRenderedFeatures(e.point);
        if (features.length > 0) {
            const featureProperties = features[0].properties; // Renamed to featureProperties
            const propertiesTable = createPropertiesTable(featureProperties); // Updated to use featureProperties
            let lngLat = e.lngLat; // Default to e.lngLat
            if (!lngLat) {
                // If e.lngLat is not available, calculate the center coordinates
                const bounds = new mapboxgl.LngLatBounds();
                features.forEach(feature => {
                    bounds.extend(feature.geometry.coordinates);
                });
                lngLat = bounds.getCenter();
            }
            new mapboxgl.Popup()
                .setLngLat(lngLat)
                .setHTML(propertiesTable)
                .addTo(map);
        }
    }
    
    
    function createPropertiesTable(properties) {
        let tableHTML = '<table>';
        for (const key in properties) {
            if (properties.hasOwnProperty(key)) {
                tableHTML += `<tr><td>${key}</td><td>${properties[key]}</td></tr>`;
            }
        }
        tableHTML += '</table>';
        return tableHTML;
    }
    
});
