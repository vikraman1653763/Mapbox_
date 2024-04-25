function measureData() {
    const data = draw.getAll();
    const calculationBox = document.querySelector('.calculation-box');
    const answer = document.getElementById('calculated-area');
    
    let htmlContent = '';

    data.features.forEach(feature => {
        if (feature.geometry.type === 'Polygon') {
            const area = turf.area(feature);
            const roundedArea = Math.round(area * 100) / 1000;
            htmlContent = `<p><strong>Area:</strong> ${roundedArea} square meters</p>`;
            
        } else if (feature.geometry.type === 'LineString') {
            const distance = turf.length(feature);
            const roundedDistance = Math.round(distance * 100) / 100;
            htmlContent = `<p><strong>Distance:</strong> ${roundedDistance} kilometers</p>`;
       } else if (feature.geometry.type === 'Point') {
            const lng = feature.geometry.coordinates[0].toFixed(6);
            const lat = feature.geometry.coordinates[1].toFixed(6);
            htmlContent = `<p><strong>Latitude:</strong>  ${lat}, <strong>Longitude:</strong> ${lng}</p>`;
        }
    });

    // Set the innerHTML of the calculated-area div to the new HTML content
    answer.innerHTML = htmlContent;

    if (data.features.length > 0) {
        calculationBox.style.display = 'block';
        // Set session storage item to indicate that the box was displayed
        sessionStorage.setItem('calculationBoxDisplayed', 'true');
        // Set a timeout to remove the session storage item after 5 seconds
        setTimeout(() => {
            sessionStorage.removeItem('calculationBoxDisplayed');
            // Hide the calculation box after removing the session storage item
            calculationBox.style.display = 'none';
        }, 5000);
    } else {
        // Check if the calculation box was previously displayed
        if (sessionStorage.getItem('calculationBoxDisplayed')) {
            calculationBox.style.display = 'block';
        } else {
            calculationBox.style.display = 'none';
        }
    }
}
