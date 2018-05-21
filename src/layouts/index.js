import React from "react";
import Helmet from "react-helmet";
import PropTypes from "prop-types";
import fontAwesome from "@fortawesome/fontawesome";
import brands from "@fortawesome/fontawesome-free-brands";
import solid from "@fortawesome/fontawesome-free-solid";
import { Flex, ThemeProvider, colors } from "@hackclub/design-system";

// Easier reference to Font Awesome icons from components
fontAwesome.library.add(brands, solid);

const DefaultLayout = ({ children, data }) => {
    const { title, description, siteUrl } = data.site.siteMetadata;
    return (
        <ThemeProvider webfonts>
            <Helmet
                defaultTitle={title}
                titleTemplate="%s — Hack Club"
                meta={[
                    { charSet: "utf-8" },
                    { name: "description", content: description },
                    { name: "viewport", content: "width=device-width, initial-scale=1" },
                    { name: "theme-color", content: colors.primary },
                    { name: "twitter:card", content: "summary_large_image" },
                    { name: "twitter:description", content: description },
                    { name: "twitter:domain", content: siteUrl },
                    { name: "twitter:image:src", content: "" }, // TODO: Find an image
                    { name: "twitter:title", content: title },
                    { property: "og:description", content: description },
                    { property: "og:image", content: "" }, // TODO: Find an image
                    { property: "og:image:height", content: 512 },
                    { property: "og:image:width", content: 512 },
                    { property: "og:locale", content: "en_US" },
                    { property: "og:site_name", content: "Hack Club" },
                    { property: "og:title", content: title },
                    { property: "og:type", content: "website" },
                    { property: "og:url", content: siteUrl },
                ]}
            />
            <Flex flexDirection="column" style={{ minHeight: "100vh" }}>
                {children()}
            </Flex>
        </ThemeProvider>
    );
};

DefaultLayout.propTypes = {
    children: PropTypes.func
};

export default DefaultLayout;

export const query = graphql`
    query DefaultLayoutQuery {
        site {
            siteMetadata {
                title
                description
                siteUrl
            }
        }
    }
`;