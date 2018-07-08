import React, { Fragment } from "react";
import Helmet from "react-helmet";
import { Container, Flex, Heading, theme } from "@hackclub/design-system";
import ClubCard from "components/ClubCard";
import Footer from "components/Footer";
import Header from "components/Header";

const HotspotTemplate = ({ pathContext }) => (
    <Fragment>
        <Helmet title={`Clubs in ${pathContext.hotspot.name}`} />
        <Header />
        <Container align="center" color="black" px={3} w={1} style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "center" }}>
            <Heading.h1 mt={4}>Hack Clubs in {pathContext.hotspot.name}</Heading.h1>
            <Flex justify="initial" py={4} style={{ margin: -theme.space[2] }} wrap>
                {pathContext.clubs.map(club => <ClubCard key={club.id} data={club} />)}
            </Flex>
        </Container>
        <Footer />
    </Fragment>
);

export default HotspotTemplate;