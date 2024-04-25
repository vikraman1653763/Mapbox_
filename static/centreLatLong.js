function centreLatLong(data) {
            const defaultCoordinates = [79.846848,12.016219 ]; // Default coordinates

            let centerCoordinates = defaultCoordinates;
            if (!data || !data.features || data.features.length === 0) {
                return centerCoordinates;
            }
            const geometryType = data.features[0].geometry.type;
            if (geometryType === 'Polygon'||geometryType === 'MultiLineString'){

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
            }else {
                const coordinates = data.features[0].geometry.coordinates;
                const long = coordinates[1];
                const lat = coordinates[0];
                centerCoordinates = [lat, long];
                return centerCoordinates;

            }
        }
  function getFirstData(files) {
    for (const file of files) {
        if (file.data && file.data.features && file.data.features.length > 0) {
            const firstFeature = file.data.features[0];
            if (firstFeature.geometry) {
                return file.data;
            }
        }
    }
    return null;
}