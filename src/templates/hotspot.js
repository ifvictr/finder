import { Flex, Heading, theme } from "@hackclub/design-system";
import { kebabCase } from "lodash";
import React, { Fragment } from "react";
import Helmet from "react-helmet";
import ClubCard from "components/ClubCard";
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
            <Heading.h1 f={[5, 6]} mt={4}>{title}</Heading.h1>
            <Flex style={{ margin: -theme.space[2] }} wrap>
                {pathContext.clubs.map(club => <ClubCard key={club.id} data={club} />)}
            </Flex>
        </Fragment>
    );
};

export default HotspotTemplate;