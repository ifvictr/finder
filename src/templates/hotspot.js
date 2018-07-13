import { Container, Flex, Heading, theme } from "@hackclub/design-system";
import { kebabCase } from "lodash";
import React, { Fragment } from "react";
import Helmet from "react-helmet";
import ClubCard from "components/ClubCard";
import Footer from "components/Footer";
import Header from "components/Header";
import { url as baseUrl } from "data.json";

const HotspotTemplate = ({ pathContext }) => {
    const title = `Hack Clubs in ${pathContext.hotspot.name}`;
    const description = `List of computer science clubs part of the Hack Club network in ${pathContext.hotspot.name}.`;
    const slug = pathContext.hotspot.slug || kebabCase(pathContext.hotspot.name);
    const url = `${baseUrl}/${slug}`;
    const img = `${baseUrl}/hotspot/${slug}.jpg`;
    return (
        <Fragment>
            <Helmet
                title={title}
                meta={[
                    { name: "description", content: description },
                    { name: "twitter:description", content: description },
                    { name: "twitter:image:src", content: img },
                    { name: "twitter:title", content: title },
                    { property: "og:description", content: description },
                    { property: "og:image", content: img },
                    { property: "og:site_name", content: "Hack Club Hotspots" },
                    { property: "og:title", content: title },
                    { property: "og:url", content: url },
                ]}
            />
            <Header />
            <Container align="center" color="black" px={3} w={1} style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "center" }}>
                <Heading.h1 f={[5, 6]} mt={4}>{title}</Heading.h1>
                <Flex justify="initial" py={3} style={{ margin: -theme.space[2] }} wrap>
                    {pathContext.clubs.map(club => <ClubCard key={club.id} data={club} />)}
                </Flex>
            </Container>
            <Footer />
        </Fragment>
    );
};

export default HotspotTemplate;