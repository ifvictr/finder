import { debounce, sortBy } from "lodash";
import React, { Component, Fragment } from "react";
import LazyLoad from "react-lazyload";
import { Box, Container, Flex, Heading, Text, theme } from "@hackclub/design-system";
import ClubCard from "components/ClubCard";
import Header from "components/Header";
import Footer from "components/Footer";
import SearchBox from "components/SearchBox";
import Settings from "components/Settings";
import axios from "axios";
import geolib from "geolib";
import Fuse from "fuse.js";

class IndexPage extends Component {
    constructor(props) {
        super(props);
        // TODO: Remove a few `-clubs`
        this.state = {
            clubs: [],
            filteredClubs: [],
            formattedAddress: null,
            // loading: true,
            searchRadius: 50,
            searchValue: "",
            showAllClubs: false,
            sortedClubs: [],
            useImperialSystem: true
        };
        this.onSearchChange = debounce(this.onSearchChange, 1250);
        this.onSystemToggle = this.onSystemToggle.bind(this);
        this.onViewToggle = this.onViewToggle.bind(this);
    }

    componentDidMount() {
        axios
            .get("https://api.hackclub.com/v1/clubs")
            .then(({ data }) => {
                this.setState({
                    clubs: data,
                    sortedClubs: sortBy(data, ["name"])
                });
            });
    }

    render() {
        const {
            filteredClubs,
            formattedAddress,
            searchRadius,
            searchValue,
            showAllClubs,
            sortedClubs,
            useImperialSystem
        } = this.state;
        const visibleClubs = (showAllClubs && searchValue.trim().length === 0) ? sortedClubs : filteredClubs;
        console.log(visibleClubs);
        return (
            <Fragment>
                <Header />
                <Container align="center" px={3} style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "center", minWidth: "64rem" }}>
                    <Heading.h1 mt={4}>Find Hack Clubs near you!</Heading.h1>
                    <SearchBox
                        value={searchValue}
                        onSearchChange={e => {
                            e.persist();
                            this.setState({ searchValue: e.target.value });
                            this.onSearchChange(e);
                        }}
                    />
                    <Flex justify="space-between" mt={4}>
                        <Box>
                            <Text align="left" color="muted" fontSize={3}>{visibleClubs.length} club{visibleClubs.length === 1 ? "" : "s"} found {showAllClubs ? "around the world" : `near ${formattedAddress || "you"}`}</Text>
                        </Box>
                        <Settings
                            searchRadius={searchRadius}
                            showAllClubs={showAllClubs}
                            useImperialSystem={useImperialSystem}
                            style={{ marginRight: theme.space[2] }}
                            onSystemToggle={this.onSystemToggle}
                            onViewToggle={this.onViewToggle}
                        />
                    </Flex>
                    <Flex py={4} style={{ marginLeft: -theme.space[2], marginTop: -theme.space[2], position: "relative" }} wrap>
                        {
                            visibleClubs.map((club, i) => (
                                <LazyLoad key={i} height={0} offset={100} once overflow>
                                    <ClubCard data={club} />
                                </LazyLoad>
                            ))
                        }
                    </Flex>
                </Container>
                <Footer />
            </Fragment>
        );
    }

    onSearchChange(e) {
        const {
            clubs,
            searchRadius,
            searchValue,
            showAllClubs,
            sortedClubs,
            useImperialSystem
        } = this.state;
        window.history.replaceState(null, null, `/?q=${encodeURIComponent(searchValue)}`);
        if(showAllClubs) {
            // Move to constructor method if possible
            const fuse = new Fuse(sortedClubs, {
                distance: 100,
                location: 0,
                maxPatternLength: 32,
                minMatchCharLength: 3,
                keys: [
                    "name",
                    "address"
                ],
                shouldSort: true,
                threshold: 0.3,
            });
            this.setState({ filteredClubs: fuse.search(searchValue) });
        }
        else {
            axios
                .get(`https://maps.google.com/maps/api/geocode/json?address=${encodeURIComponent(searchValue)}`)
                .then(res => res.data.results[0])
                .then(firstResult => {
                    console.log("firstResult: ", firstResult);
                    if(firstResult) {
                        const { lat, lng } = firstResult.geometry.location;
                        this.setState({
                            filteredClubs: geolib
                                .orderByDistance({ latitude: lat, longitude: lng }, clubs)
                                .filter(club => geolib.convertUnit(useImperialSystem ? "mi" : "km", club.distance, 2) < searchRadius),
                            formattedAddress: firstResult.formatted_address,
                        });
                    }
                    else {
                        this.setState({
                            filteredClubs: [],
                            formattedAddress: null
                        });
                    }
                    console.log("current state: ", this.state);
                });            
        }
    }

    onSystemToggle() {
        this.setState({ useImperialSystem: !this.state.useImperialSystem });
    }

    onViewToggle() {
        this.setState({
            filteredClubs: [],
            formattedAddress: null,
            searchValue: "",
            showAllClubs: !this.state.showAllClubs
        });
    }
}

export default IndexPage;