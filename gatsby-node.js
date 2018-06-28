const path = require("path");
const { kebabCase } = require("lodash");
const axios = require("axios");
const hotspots = require("./src/hotspots");

exports.createPages = async ({ boundActionCreators }) => {
    const { createPage } = boundActionCreators;
    const { data } = await axios.get("https://api.hackclub.com/v1/clubs");
    hotspots.forEach(hotspot => {
        const filteredClubs = data.filter(hotspot.filter);
        createPage({
            path: `/hotspots/${hotspot.slug || kebabCase(hotspot.name)}`,
            component: path.resolve("src/templates/hotspot.js"),
            context: {
                hotspot,
                filteredClubs
            }
        });
    });
};