import { debounce, sortBy } from "lodash";
import React, { Component, Fragment } from "react";
import LazyLoad from "react-lazyload";
import { Box, Container, Flex, Heading, Text, theme } from "@hackclub/design-system";
import ClubCard from "components/ClubCard";
import Footer from "components/Footer";
import Header from "components/Header";
import NoClubsFound from "components/NoClubsFound";
import SearchBox from "components/SearchBox";
import Settings from "components/Settings";
import axios from "axios";
import geolib from "geolib";
import Fuse from "fuse.js";
import qs from "query-string";

class IndexPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clubs: [],
            filteredClubs: [],
            formattedAddress: null,
            // loading: true,
            // Attempt to use existing query parameters
            params: qs.parse(props.location.search) || {
                m: null, // Measurement system
                q: null, // Search value
                r: 50, // Search radius
                v: null // View
            },
            searchLat: null,
            searchLng: null,
            searchRadius: 50,
            searchValue: "",
            showAllClubs: false,
            useImperialSystem: true
        };
        this.onSearchChange = debounce(this.onSearchChange, 1250);
        this.onSystemToggle = this.onSystemToggle.bind(this);
        this.onViewToggle = this.onViewToggle.bind(this);
    }

    componentWillMount() {
        const { m, q, r, v } = this.state.params;
        this.setState({
            searchRadius: parseInt(r),
            searchValue: q || "",
            showAllClubs: v === "all",
            useImperialSystem: m === "i"
        });
    }

    componentDidMount() {
        axios
            .get("https://api.hackclub.com/v1/clubs")
            .then(({ data }) => {
                this.setState({ clubs: sortBy(data, ["name"]) });
            });
    }

    render() {
        const {
            clubs,
            filteredClubs,
            formattedAddress,
            searchRadius,
            searchValue,
            showAllClubs,
            useImperialSystem
        } = this.state;
        console.log(this.state);
        const visibleClubs = (showAllClubs && searchValue.trim().length === 0) ? clubs : filteredClubs;
        return (
            <Fragment>
                <Header />
                <Container align="center" px={3} width="100%" style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "center" }}>
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
                            <Text align="left" color="muted" f={3}>
                                {visibleClubs.length} club{visibleClubs.length === 1 ? "" : "s"}{" "}
                                {showAllClubs ? `match${visibleClubs.length === 1 ? "es" : ""} “${searchValue}”` : `found near ${formattedAddress || "you"}`}
                            </Text>
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
                    <Flex py={5} style={{ marginLeft: -theme.space[2], marginTop: -theme.space[2] }} wrap>
                        {
                            visibleClubs.map((club, i) => (
                                <LazyLoad key={i} height={0} offset={100} once overflow>
                                    <ClubCard data={club} />
                                </LazyLoad>
                            ))
                        }
                        { visibleClubs.length === 0 && <NoClubsFound />}
                    </Flex>
                </Container>
                <Footer />
            </Fragment>
        );
    }

    onSearchChange(e) {
        const { mapsApiKey } = this.props.data.site.siteMetadata;
        const {
            clubs,
            searchRadius,
            searchValue,
            showAllClubs,
            useImperialSystem
        } = this.state;
        this.setParams({ q: searchValue });
        if(showAllClubs) {
            // Move to constructor method if possible
            const fuse = new Fuse(clubs, {
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
                .get(`https://maps.google.com/maps/api/geocode/json?address=${encodeURI(searchValue)}&key=${mapsApiKey}`)
                .then(res => res.data.results[0])
                .then(firstResult => {
                    if(firstResult) {
                        const { lat, lng } = firstResult.geometry.location;
                        const filteredClubs = geolib
                            .orderByDistance({ latitude: lat, longitude: lng }, clubs)
                            .filter(club => geolib.convertUnit(useImperialSystem ? "mi" : "km", club.distance, 2) < searchRadius);
                        this.setState({
                            filteredClubs,
                            formattedAddress: firstResult.formatted_address,
                            searchLat: lat,
                            searchLng: lng
                        });
                    }
                    else {
                        this.setState({
                            filteredClubs: [],
                            formattedAddress: null,
                            searchLat: null,
                            searchLng: null
                        });
                    }
                });
        }
    }

    onSystemToggle() {
        const { showAllClubs, useImperialSystem } = this.state;
        if(!showAllClubs) {
            const nextUseImperialSystem = !useImperialSystem;
            this.setState({ useImperialSystem: nextUseImperialSystem });
            this.setParams({ m: nextUseImperialSystem ? "i" : "m" });
        }
    }

    onViewToggle() {
        const { showAllClubs } = this.state;
        const nextShowAllClubs = !showAllClubs;
        this.setState({
            filteredClubs: [],
            formattedAddress: null,
            showAllClubs: nextShowAllClubs
        });
        this.setParams({ v: nextShowAllClubs ? "all" : "loc" });
    }

    setParams(partialParams) {
        const params = Object.assign(qs.parse(window.location.search), partialParams);
        this.setState({ params });
        window.history.pushState(null, null, `?${qs.stringify(params)}`);
    }
}

export default IndexPage;

export const query = graphql`
    query IndexQuery {
        site {
            siteMetadata {
                mapsApiKey
            }
        }
    }
`;