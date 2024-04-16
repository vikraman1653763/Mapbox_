function flyTo(){

    document.getElementById('flyTo').addEventListener('click', () => {
        const targetLocation = [77.00760, 8.38760];
        const currentCenter = map.getCenter();
    
        const precision = 6;
        const currentLng = currentCenter.lng.toFixed(precision);
        const currentLat = currentCenter.lat.toFixed(precision);
        const targetLng = targetLocation[0].toFixed(precision);
        const targetLat = targetLocation[1].toFixed(precision);
    
        if (currentLng === targetLng && currentLat === targetLat) {
            map.flyTo({
                center: [-73.975676, 40.768620],
                essential: true
            });
        } else {
            map.flyTo({
                center: targetLocation,
                essential: true,
                zoom: 15
            });
        }
    });
        }