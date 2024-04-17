function toggleLayerVisibility(layerName, isVisible) {
    if (isVisible) {
    map.setLayoutProperty(layerName, 'visibility', 'visible');
} else {
    map.setLayoutProperty(layerName, 'visibility', 'none');
}
}

function updateToggleAllLayersCheckbox() {
    var layerCheckboxes = document.querySelectorAll('.layerToggleCheckbox');
    var allChecked = Array.from(layerCheckboxes).every(function(checkbox) {
        return checkbox.checked;
    });
    document.getElementById('toggleAllLayers').checked = allChecked;
}

// Add an event listener to layer checkboxes to update the "Toggle All Layers" button
var layerCheckboxes = document.querySelectorAll('.layerToggleCheckbox');
layerCheckboxes.forEach(function(checkbox) {
    checkbox.addEventListener('change', updateToggleAllLayersCheckbox);
});

// Add an event listener to the "Toggle All Layers" checkbox
document.getElementById('toggleAllLayers').addEventListener('change', function() {
    var isChecked = this.checked; // Check if the checkbox is checked

    // Loop through checkboxes within the loop
    var layerCheckboxes = document.querySelectorAll('.layerToggleCheckbox');
    layerCheckboxes.forEach(function(checkbox) {
        checkbox.checked = isChecked; // Update the state of the checkbox

        // Get all data attributes from the checkbox
        var checkboxData = {};
        for (var i = 0; i < checkbox.attributes.length; i++) {
            var attr = checkbox.attributes[i];
            checkboxData[attr.nodeName] = attr.nodeValue;
        }     
        var layerName = checkbox.getAttribute('data-layer-name'); // Get the layer name associated with the checkbox
        toggleLayerVisibility(layerName, isChecked); // Call the function to toggle layer visibility
    });
});
