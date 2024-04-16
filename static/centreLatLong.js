function centreLatLong(data) {
            const defaultCoordinates = [79.846848,12.016219 ]; // Default coordinates

            let centerCoordinates = defaultCoordinates;

            if (data.features.length > 0) {
                const firstFeature = data.features[0];
                if (firstFeature.geometry && firstFeature.geometry.coordinates) {
                    centerCoordinates = firstFeature.geometry.coordinates;
                }
            }

            const Coordinates1 = centerCoordinates[0];
            const Coordinates2 = Coordinates1[0];
            const lat = Coordinates2[0];
            const long = Coordinates2[1];
            centerCoordinates = [lat, long];    
        
        return centerCoordinates;
    }