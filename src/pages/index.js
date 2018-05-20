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
            params: qs.parse(props.location.search), // Attempt to use present parems
            searchLat: null,
            searchLng: null,
            searchRadius: 50,
            searchValue: "",
            showAllClubs: false,
            status: "idle", // TODO: idle, loading
            useImperialSystem: true
        };
        this.fuse = undefined;
        this.onRadiusChange = debounce(this.onRadiusChange.bind(this), 1250);
        this.onSearchChange = debounce(this.onSearchChange.bind(this), 1250);
        this.onSystemChange = this.onSystemChange.bind(this);
        this.onViewChange = this.onViewChange.bind(this);
    }

    async componentDidMount() {
        // Initialize query params
        const { m, q, r, v } = this.state.params;
        this.setState({
            ...(m && { useImperialSystem: m === "i" }),
            ...(q && { searchValue: q }),
            ...(r && { searchRadius: parseInt(r) }),
            ...(v && { showAllClubs: v === "all" })
        });
        // TODO: Fetch once on build and use GraphQL to retrieve?
        // Fetch clubs
        const { data } = await axios.get("https://api.hackclub.com/v1/clubs");
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
        const hasResults = filteredClubs.length > 0;
        const hasOneResult = filteredClubs.length === 1;
        return (
            <Fragment>
                <Progress color={theme.colors.primary} percent={loading ? 0 : 100} />
                <Header />
                <Container align="center" px={3} width="100%" style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "center" }}>
                    <Heading.h1 mt={4}>Find Hack Clubs near you!</Heading.h1>
                    <SearchBox
                        mt={4}
                        mx="auto"
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
                            onRadiusChange={e => {
                                e.persist();
                                this.setState({ searchRadius: e.target.value });
                                this.onRadiusChange(e);
                            }}
                            onSystemChange={this.onSystemChange}
                            onViewChange={this.onViewChange}
                            searchRadius={parseInt(searchRadius)}
                            showAllClubs={showAllClubs}
                            useImperialSystem={useImperialSystem}
                        />
                    </Flex>
                    <Flex justify={hasResults ? "initial" : "center"} py={4} style={{ margin: -theme.space[2] }} wrap>
                        {
                            filteredClubs.map(club => (
                                <LazyLoad key={club.id} height={0} offset={100} once overflow>
                                    <ClubCard
                                        data={club}
                                        distance={!showAllClubs ? geolib.getDistance({ latitude: searchLat, longitude: searchLng }, club) : undefined}
                                        useImperialSystem={useImperialSystem}
                                    />
                                </LazyLoad>
                            ))
                        }
                        {!hasResults && <NoClubsFound />}
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
            const filteredClubs = this.getFilteredClubs(clubs, {
                searchLat,
                searchLng,
                searchRadius: nextSearchRadius,
                useImperialSystem
            });
            this.setState({ filteredClubs });
        }
    }

    async onSearchChange(e) {
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
                const firstResult = (await axios.get(`https://maps.google.com/maps/api/geocode/json?address=${encodeURI(searchValue)}&key=${mapsApiKey}`)).data.results[0];
                if(firstResult) {
                    const { lat, lng } = firstResult.geometry.location;
                    const filteredClubs = this.getFilteredClubs(clubs, {
                        searchLat: lat,
                        searchLng: lng,
                        searchRadius,
                        useImperialSystem
                    });
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
            }
        }
    }

    onSystemChange() {
        const {
            clubs,
            searchLat,
            searchLng,
            searchRadius,
            showAllClubs,
            useImperialSystem
        } = this.state;
        if(!showAllClubs) {
            const nextUseImperialSystem = !useImperialSystem;
            const filteredClubs = this.getFilteredClubs(clubs, {
                searchLat,
                searchLng,
                searchRadius,
                useImperialSystem: nextUseImperialSystem
            });
            this.setState({ filteredClubs, useImperialSystem: nextUseImperialSystem });
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

    getFilteredClubs(clubs, opts) {
        // TODO: Fix this spaghetti
        // idea: return an array of IDs (or anything that uniquely identifies clubs)
        console.log('opts: ', opts);
        const {
            searchLat,
            searchLng,
            searchRadius,
            useImperialSystem
        } = opts;
        if(!searchLat || !searchLng) {
            return clubs;
        }
        const filteredClubs = geolib
            .orderByDistance({ latitude: searchLat, longitude: searchLng }, clubs)
            .filter(club => geolib.convertUnit(useImperialSystem ? "mi" : "km", club.distance, 2) < searchRadius)
            .map(({ distance, key }) => ({ ...clubs[key], distance }));
        return filteredClubs;
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