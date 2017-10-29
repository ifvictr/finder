const byDistance = (a, b) => {
    return navigator.geolocation.getCurrentPosition(pos => {
        const currentPos = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
        };
        const distFromA = geolib.getDistance(currentPos, {
            latitude: a.latitude,
            longitude: a.longitude
        });
        const distFromB = geolib.getDistance(currentPos, {
            latitude: b.latitude,
            longitude: b.longitude
        });
        if(distFromA < distFromB) {
            return -1;
        }
        else if(distFromA > distFromB) {
            return 1;
        }
        return 0;
    });
};

const byField = field => {
    return (a, b) => {
        const first = a[field];
        const second = b[field];
        if(first < second) {
            return -1;
        }
        else if(first > second) {
            return 1;
        }
        return 0;
    };
};