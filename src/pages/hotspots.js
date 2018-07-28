import { Flex, Heading } from "@hackclub/design-system";
import React, { Fragment } from "react";
import Helmet from "react-helmet";
import HotspotCard from "components/hotspots/HotspotCard";
import hotspots from "hotspots";

const HotspotsPage = () => (
    <Fragment>
        <Helmet title="Club Hotspots" />
        <Heading.h1 f={[5, 6]} mt={4}>Club Hotspots Around the World</Heading.h1>
        <Flex wrap>
            {hotspots.map(hotspot => <HotspotCard key={hotspot.name} data={hotspot} />)}
        </Flex>
    </Fragment>
);

export default HotspotsPage;