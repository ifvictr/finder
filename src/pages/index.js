import { debounce, sortBy } from "lodash";
import React, { Component, Fragment } from "react";
import LazyLoad from "react-lazyload";
import Progress from "react-progress";
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
            loading: false,
            // Attempt to use existing query parameters
            params: {
                m: "i", // Measurement system
                q: "", // Search value
                r: 50, // Search radius
                v: "loc", // View
                ...qs.parse(props.location.search)
            },
            searchLat: null,
            searchLng: null,
            searchRadius: 50,
            searchValue: "",
            showAllClubs: false,
            useImperialSystem: true
        };
        this.fuse = undefined;
        this.onRadiusChange = debounce(this.onRadiusChange.bind(this), 1250);
        this.onSearchChange = debounce(this.onSearchChange.bind(this), 1250);
        this.onSystemChange = this.onSystemChange.bind(this);
        this.onViewChange = this.onViewChange.bind(this);
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
                this.setState({ clubs: sortBy(data, ["name"]) }, () => {
                    this.fuse = new Fuse(this.state.clubs, {
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
                });
            });
    }

    render() {
        const {
            filteredClubs,
            formattedAddress,
            loading,
            searchLat,
            searchLng,
            searchRadius,
            searchValue,
            showAllClubs,
            useImperialSystem
        } = this.state;
        const hasNoResults = filteredClubs.length === 0;
        const hasOneResult = filteredClubs.length === 1;
        return (
            <Fragment>
                <Progress color={theme.colors.primary} percent={loading ? 0 : 100} />
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
                                {filteredClubs.length} club{hasOneResult ? "" : "s"}{" "}
                                {showAllClubs ? `match${hasOneResult ? "es" : ""} “${searchValue}”` : `found within ${searchRadius} ${useImperialSystem ? "mile" : "kilometer"}${searchRadius === 1 ? "" : "s"} from ${formattedAddress || "you"}`}
                            </Text>
                        </Box>
                        <Settings
                            searchRadius={searchRadius}
                            showAllClubs={showAllClubs}
                            useImperialSystem={useImperialSystem}
                            style={{ marginRight: theme.space[2] }}
                            onRadiusChange={this.onRadiusChange}
                            onSystemChange={this.onSystemChange}
                            onViewChange={this.onViewChange}
                        />
                    </Flex>
                    <Flex justify={hasNoResults ? "center" : "initial"} py={4} style={{ marginLeft: -theme.space[2], marginTop: -theme.space[2] }} wrap>
                        {
                            filteredClubs.map(club => (
                                <LazyLoad key={club.id} height={0} offset={100} once overflow>
                                    <ClubCard
                                        data={club}
                                        distance={!showAllClubs && geolib.getDistance({ latitude: searchLat, longitude: searchLng }, club)}
                                        showAllClubs={showAllClubs}
                                        useImperialSystem={useImperialSystem}
                                    />
                                </LazyLoad>
                            ))
                        }
                        {hasNoResults && <NoClubsFound />}
                    </Flex>
                </Container>
                <Footer />
            </Fragment>
        );
    }

    onRadiusChange(e) {
        const nextSearchRadius = parseInt(e.target.value);
        const { clubs, searchLat, searchLng, useImperialSystem } = this.state;
        this.setState({ searchRadius: nextSearchRadius });
        this.setParams({ r: nextSearchRadius });
        if(searchLat && searchLng) {
            const filteredClubs = geolib
                .orderByDistance({ latitude: searchLat, longitude: searchLng }, clubs)
                .filter(club => geolib.convertUnit(useImperialSystem ? "mi" : "km", club.distance, 2) < nextSearchRadius)
                .map(({ distance, key }) => ({ ...clubs[key], distance }));
            this.setState({ filteredClubs });
        }
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
        const hasSearchValue = searchValue.trim().length !== 0;
        if(!hasSearchValue) {
            return;
        }
        this.setState({ loading: true });
        this.setParams({ q: searchValue });
        if(showAllClubs) {
            this.setState({ filteredClubs: this.fuse.search(searchValue) });
            this.setState({ loading: false });
        }
        else {
            if(hasSearchValue) {
                axios
                    .get(`https://maps.google.com/maps/api/geocode/json?address=${encodeURI(searchValue)}&key=${mapsApiKey}`)
                    .then(res => res.data.results[0])
                    .then(firstResult => {
                        if(firstResult) {
                            const { lat, lng } = firstResult.geometry.location;
                            const filteredClubs = geolib
                                .orderByDistance({ latitude: lat, longitude: lng }, clubs)
                                .filter(club => geolib.convertUnit(useImperialSystem ? "mi" : "km", club.distance, 2) < searchRadius)
                                .map(({ distance, key }) => ({ ...clubs[key], distance }));
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
                        this.setState({ loading: false });
                    });
            }
        }
    }

    onSystemChange() {
        const { showAllClubs, useImperialSystem } = this.state;
        if(!showAllClubs) {
            const nextUseImperialSystem = !useImperialSystem;
            this.setState({ useImperialSystem: nextUseImperialSystem });
            this.setParams({ m: nextUseImperialSystem ? "i" : "m" });
        }
    }

    onViewChange() {
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
        const params = { ...this.state.params, ...partialParams };
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