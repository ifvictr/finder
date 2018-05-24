module.exports = {
    plugins: [
        {
            resolve: "gatsby-plugin-favicon",
            options: {
                logo: "./static/favicon.png",
                injectHTML: true,
                icons: {
                    android: true,
                    appleIcon: true,
                    appleStartup: true,
                    coast: false,
                    favicons: true,
                    firefox: true,
                    twitter: false,
                    yandex: false,
                    windows: false
                }
            }
        },
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