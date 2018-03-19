import React, { Component, Fragment } from "react";
import { Box, Container, Flex, Heading, Link, Text, theme } from "@hackclub/design-system";
import ClubCard from "components/ClubCard";
import Header from "components/Header";
import Footer from "components/Footer";
import SearchBox from "components/SearchBox";
import Settings from "components/Settings";
import axios from "axios";

class IndexPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clubs: [],
            loading: true
        };
    }

    componentDidMount() {
        axios
            .get("https://api.hackclub.com/v1/clubs")
            .then(res => {
                this.setState({ clubs: res.data.slice(0, 16) });
            });
    }

    render() {
        return (
            <Fragment>
                <Header />
                <Container align="center" px={3} style={{ flex: 1 }}>
                    <Heading.h1 mt={4}>Find a Hack Club near you.</Heading.h1>
                    <SearchBox />
                    <Flex justify="space-between" mt={4}>
                        <Box>
                            <Text align="left" color="muted" fontSize={3}>{this.state.clubs.length} clubs found near {"{location}"}</Text>
                        </Box>
                        <Settings style={{ marginRight: theme.space[2] }} />
                    </Flex>
                    <Flex py={4} style={{ marginLeft: -theme.space[2], marginTop: -theme.space[2] }} wrap>
                        {this.state.clubs.map((club, i) => <ClubCard data={club} key={i} />)}
                    </Flex>
                </Container>
                <Footer />
            </Fragment>
        );
    }
}

export default IndexPage;