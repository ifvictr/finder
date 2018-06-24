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
import data from "data.json";

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
        const { searchValue, showAllClubs } = this.state;
        // Set position only if searching by location and a search value is present
        const isSearchingByLocation = !showAllClubs && searchValue;
        if(isSearchingByLocation) {
            await this.setPosition(searchValue);
        }
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
            this.setState({ filteredClubs: this.getFilteredClubs() });
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
                <Container align="center" px={3} w={1} style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "center" }}>
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
                        autoFocus
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
                                        distance={(!showAllClubs && searchLat && searchLng) ? geolib.getDistance({ latitude: searchLat, longitude: searchLng }, club) : undefined}
                                        useImperialSystem={useImperialSystem}
                                    />
                                </LazyLoad>
                            ))
                        }
                        {!hasResults && !showAllClubs && <NoClubsFound />}
                    </Flex>
                </Container>
                <Footer />
            </Fragment>
        );
    }

    onRadiusChange(e) {
        this.setState({ searchRadius: parseInt(e.target.value) }, () => {
            this.setParams({ r: this.state.searchRadius });
            this.setState({ filteredClubs: this.getFilteredClubs() });
        });
    }

    async onSearchChange(e) {
        const { searchValue, showAllClubs } = this.state;
        this.setState({ loading: true });
        this.setParams({ q: searchValue });
        if(!showAllClubs) {
            await this.setPosition(searchValue);
        }
        this.setState({ filteredClubs: this.getFilteredClubs(), loading: false });
    }

    onSystemChange() {
        // Only accessible when searching by location
        this.setState((state, props) => ({ useImperialSystem: !state.useImperialSystem }), () => {
            this.setState({ filteredClubs: this.getFilteredClubs() });
            this.setParams({ m: this.state.useImperialSystem ? "i" : "m" });
        });
    }

    onViewChange() {
        this.setState((state, props) => ({ showAllClubs: !state.showAllClubs }), async () => {
            if(!this.state.showAllClubs) {
                await this.setPosition(this.state.searchValue);
            }
            this.setState({ filteredClubs: this.getFilteredClubs() });
            this.setParams({ v: this.state.showAllClubs ? "all" : "loc" });
        });
    }

    setParams(partialParams) {
        const params = { ...this.state.params, ...partialParams };
        this.setState({ params }, () => {
            window.history.pushState(null, null, `?${qs.stringify(params)}`);
        });
    }

    getFilteredClubs() {
        const {
            clubs,
            searchLat,
            searchLng,
            searchRadius,
            searchValue,
            showAllClubs,
            useImperialSystem
        } = this.state;
        if(showAllClubs) {
            if(searchValue) {
                return this.fuse.search(searchValue);
            }
            else {
                return clubs;
            }
        }
        else {
            if(searchValue.length === 0) {
                return clubs;
            }
            if(!searchLat || !searchLng) {
                return [];
            }
            const filteredClubs = geolib
                .orderByDistance({ latitude: searchLat, longitude: searchLng }, clubs)
                .filter(club => geolib.convertUnit(useImperialSystem ? "mi" : "km", club.distance, 2) < searchRadius)
                .map(({ key }) => clubs[key]);
            return filteredClubs;
        }
    }

    async setPosition(place) {
        const response = await axios.get(`https://maps.google.com/maps/api/geocode/json?address=${encodeURI(place)}&key=${data.googleMapsApiKey}`);
        const { results } = response.data;
        try {
            const result = results.find(result => result.types.indexOf("neighborhood") !== -1) || results[0];
            this.setState({
                formattedAddress: result.formatted_address,
                searchLat: result.geometry.location.lat,
                searchLng: result.geometry.location.lng
            });
        }
        catch(e) {
            // TODO: Remove repeated code
            this.setState({
                formattedAddress: null,
                searchLat: null,
                searchLng: null
            });
        }
    }
}

export default IndexPage;