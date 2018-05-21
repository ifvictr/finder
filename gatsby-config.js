module.exports = {
    siteMetadata: {
        title: "Find Hack Clubs Near You",
        description: "Find Hack Clubs near you!",
        siteUrl: "https://finder.hackclub.com",
        mapsApiKey: "AIzaSyBUq1lpcXDz3KGLcRBl6hhcxaFSY6wtBXo"
    },
    plugins: [
        "gatsby-plugin-react-helmet",
        "gatsby-plugin-react-next",
        "gatsby-plugin-resolve-src",
        {
            resolve: "gatsby-plugin-segment",
            options: {
                writeKey: "gsC4v5ma9Q9kISV9Iq57mFbpVetlLyLL"
            }
        },
        "gatsby-plugin-styled-components"
    ]
};