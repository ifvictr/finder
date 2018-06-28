const axios = require("axios");
const { difference } = require("lodash");
const { getPointsInCircle, MILE_TO_METER } = require("../src/utils");

const SEARCH_RADIUS = 50;
const HOTSPOT_THRESHOLD = 4;

(async () => {
    try {
        const { data } = await axios.get("https://api.hackclub.com/v1/clubs");
        let clubs = [...data]; // Clone array
        const hotspots = [];
        clubs.forEach(club => {
            const filteredClubs = getPointsInCircle(clubs, club, SEARCH_RADIUS * MILE_TO_METER);
            if(filteredClubs.length > HOTSPOT_THRESHOLD) {
                console.log(`Hotspot with ${filteredClubs.length} clubs found!`);
                clubs = difference(clubs, filteredClubs); // Remove sorted clubs from working array
                hotspots.push({
                    center: club,
                    clubs: filteredClubs
                });
                console.log(`Clubs left to group: ${clubs.length}`);
            }
        });
        console.log(`Total hotspots: ${hotspots.length}`);
        hotspots.forEach(hotspot => {
            console.log(hotspot.center.address);
        });
    }
    catch(e) {
        console.log(e);
    }
})();