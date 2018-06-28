const geocluster = require("geocluster");
const axios = require("axios");
const { googleMapsApiKey } = require("../src/data.json");

const processCluster = async cluster => {
    const [lat, lng] = cluster.centroid;
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googleMapsApiKey}`);
    const { results } = response.data;
    if(results.length > 0) {
        return results[0];
    }
    return {};
};

(async () => {
    try {
        const { data } = await axios.get("https://api.hackclub.com/v1/clubs");
        const coords = data.map(club => [parseFloat(club.latitude), parseFloat(club.longitude)]);
        const clusters = geocluster(coords, 0.1);
        console.log(`${clusters.length} club cluster(s) found`);
        const hotspots = await Promise.all(clusters.filter(cluster => cluster.elements.length > 3).map(processCluster));
        console.log(`${hotspots.length} club hotspot(s) identified`);
        hotspots.forEach((hotspot, i) => {
            const { lat, lng } = hotspot.geometry.location;
            console.log(`${i + 1}: ${hotspot.formatted_address} (${lat.toFixed(6)}, ${lng.toFixed(6)})`);
        });
    }
    catch(e) {
        console.log("An error occurred");
    }
})();