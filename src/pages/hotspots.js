import React, { Fragment } from "react";
import Helmet from "react-helmet";
import { Container, Flex, Heading } from "@hackclub/design-system";
import HotspotCard from "components/hotspots/HotspotCard";
import Footer from "components/Footer";
import Header from "components/Header";
import hotspots from "hotspots";

const HotspotsPage = () => (
    <Fragment>
        <Helmet title="Club Hotspots" />
        <Header />
        <Container align="center" color="black" px={3} w={1} style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "center" }}>
            <Heading.h1 f={[5, 6]} mt={4}>Club Hotspots Around the World</Heading.h1>
            <Flex py={3} wrap>
                {hotspots.map(hotspot => <HotspotCard key={hotspot.name} data={hotspot} />)}
            </Flex>
        </Container>
        <Footer />
    </Fragment>
);

export default HotspotsPage;