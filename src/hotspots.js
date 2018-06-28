const geolib = require("geolib");

const isWithinRadius = (a, b, radius) => {
    const distance = geolib.getDistance(a, b);
    const miles = geolib.convertUnit("mi", distance, 2);
    return miles < radius;
};

module.exports = [
    {
        name: "California",
        filter: club => club.parsed_state_code === "CA",
    },
    {
        name: "Canada",
        filter: club => club.parsed_country_code === "CA"
    },
    {
        name: "Chicago",
        filter: club => isWithinRadius({ latitude: 41.969649, longitude: -87.720643 }, club, 42)
    },
    {
        name: "China",
        filter: club => club.parsed_country_code === "CN"
    },
    {
        name: "India",
        filter: club => club.parsed_country_code === "IN"
    },
    {
        name: "Los Angeles",
        filter: club => club.parsed_city === "Los Angeles",
    },
    {
        name: "New York",
        filter: club => club.parsed_state_code === "NY",
    },
    {
        name: "Philadelphia",
        filter: club => isWithinRadius({ latitude: 40.002676, longitude: -75.258116 }, club, 50)
    },
    {
        name: "the Bay Area",
        filter: club => isWithinRadius({ latitude: 37.641045, longitude: -122.228916 }, club, 39),
        slug: "bay-area"
    },
    {
        name: "the USA",
        filter: club => club.parsed_country_code === "US",
        slug: "usa"
    }
];