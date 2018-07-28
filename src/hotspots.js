const { isPointInCircle } = require("geolib");
const { MILE_TO_METER } = require("./utils");

const fromMiles = miles => miles * MILE_TO_METER;

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
        filter: club => isPointInCircle(club, { latitude: 41.969649, longitude: -87.720643 }, fromMiles(42))
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
        filter: club => (
            club.parsed_city === "Los Angeles"
            || isPointInCircle(club, { latitude: 34.075365, longitude: -118.390819 }, fromMiles(20))
        )
    },
    {
        name: "New York",
        filter: club => club.parsed_state_code === "NY",
    },
    {
        name: "Philadelphia",
        filter: club => isPointInCircle(club, { latitude: 40.002676, longitude: -75.258116 }, fromMiles(50))
    },
    {
        name: "the Bay Area",
        filter: club => isPointInCircle(club, { latitude: 37.641045, longitude: -122.228916 }, fromMiles(39)),
        slug: "bay-area"
    },
    {
        name: "the USA",
        filter: club => club.parsed_country_code === "US",
        slug: "usa"
    }
];