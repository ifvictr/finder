import React from "react";
import Helmet from "react-helmet";
import PropTypes from "prop-types";
import fontAwesome from "@fortawesome/fontawesome";
import brands from "@fortawesome/fontawesome-free-brands";
import solid from "@fortawesome/fontawesome-free-solid";
import { Flex, ThemeProvider, colors } from "@hackclub/design-system";
import data from "data.json";

// Easier reference to Font Awesome icons from components
fontAwesome.library.add(brands, solid);
const { name, title, description, url } = data;

const DefaultLayout = ({ children }) => (
    <ThemeProvider webfonts>
        <Helmet
            defaultTitle={`${title} — Hack Club`}
            titleTemplate={`%s — ${title} — Hack Club`}
            meta={[
                { charSet: "utf-8" },
                { name: "description", content: description },
                { name: "viewport", content: "width=device-width, initial-scale=1" },
                { name: "theme-color", content: colors.primary },
                { name: "twitter:card", content: "summary_large_image" },
                { name: "twitter:description", content: description },
                { name: "twitter:domain", content: url },
                { name: "twitter:image:src", content: "" },
                { name: "twitter:title", content: title },
                { property: "og:description", content: description },
                { property: "og:image", content: "" },
                { property: "og:image:height", content: 512 },
                { property: "og:image:width", content: 512 },
                { property: "og:locale", content: "en_US" },
                { property: "og:site_name", content: name },
                { property: "og:title", content: title },
                { property: "og:type", content: "website" },
                { property: "og:url", content: url },
            ]}
        />
        <Flex flexDirection="column" style={{ minHeight: "100vh" }}>
            {children()}
        </Flex>
    </ThemeProvider>
);

DefaultLayout.propTypes = {
    children: PropTypes.func
};

export default DefaultLayout;