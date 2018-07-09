const axios = require("axios");
const { kebabCase } = require("lodash");
const path = require("path");
const hotspots = require("./src/hotspots");

exports.createPages = async ({ boundActionCreators, graphql }) => {
    const { createPage } = boundActionCreators;
    const result = await graphql(`
        {
            allThirdPartyClubs {
                edges {
                    node {
                        address
                        latitude
                        longitude
                        name
                        parsed_country_code
                        parsed_city
                        parsed_state_code
                        thirdParty_id
                    }
                }
            }
        }
    `);
    hotspots.forEach(hotspot => {
        const clubs = result.data.allThirdPartyClubs.edges
            .filter(edge => hotspot.filter({ ...edge.node })) // Workaround for https://github.com/manuelbieh/Geolib/issues/62
            .map(edge => {
                // gatsby-source-thirdparty renamed `id` to `thirdParty_id` to prevent conflicts with GraphQL
                const club = { ...edge.node };
                club.id = club.thirdParty_id;
                delete club.thirdParty_id;
                return club;
            });
        createPage({
            path: `/hotspots/${hotspot.slug || kebabCase(hotspot.name)}`,
            component: path.resolve("src/templates/hotspot.js"),
            context: {
                clubs,
                hotspot
            }
        });
    });
};