import { debounce, sortBy } from "lodash";
import React, { Component, Fragment } from "react";
import LazyLoad from "react-lazyload";
import Progress from "react-progress";
import { Box, Container, Flex, Heading, Truncate, theme } from "@hackclub/design-system";
import ClubCard from "components/ClubCard";
import Footer from "components/Footer";
import Header from "components/Header";
import LocationSearchInput from "components/LocationSearchInput";
import NoClubsFound from "components/NoClubsFound";
import SearchInput from "components/SearchInput";
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
            params: qs.parse(props.location.search), // Attempt to use present query parameters
            searchByLocation: true,
            searchLat: null,
            searchLng: null,
            searchRadius: 50,
            searchValue: "",
            useImperialSystem: true
        };
        this.fuse = undefined;
        this.onGeolocationChange = this.onGeolocationChange.bind(this);
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
            ...(v && { searchByLocation: v === "loc" })
        });
        const { data } = await axios.get("https://api.hackclub.com/v1/clubs");
        const { searchByLocation, searchValue } = this.state;
        // Set position only if searching by location and a search value is present
        const isSearchingByLocation = searchByLocation && searchValue;
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
            searchByLocation,
            searchLat,
            searchLng,
            searchRadius,
            searchValue,
            useImperialSystem
        } = this.state;
        const hasSearchValue = searchValue.trim().length > 0;
        const hasResults = filteredClubs.length > 0;
        const hasOneResult = filteredClubs.length === 1;
        return (
            <Fragment>
                <Progress color={theme.colors.primary} percent={loading ? 0 : 100} />
                <Header />
                <Container align="center" px={3} w={1} style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "center" }}>
                    <Heading.h1 mt={4}>Find Hack Clubs near you!</Heading.h1>
                    {searchByLocation ? (
                        <LocationSearchInput
                            mt={4}
                            mx="auto"
                            value={searchValue}
                            onSearchChange={value => {
                                this.setState({ searchValue: value });
                                this.onSearchChange();
                            }}
                            onSearchError={(status, clearSuggestions) => {
                                if(status === "ZERO_RESULTS") {
                                    // TODO: Show "No results found." in the dropdown menu instead of hiding
                                }
                                clearSuggestions();
                            }}
                            autoFocus
                        />
                    ) : (
                        <SearchInput
                            mt={4}
                            mx="auto"
                            value={searchValue}
                            onSearchChange={e => {
                                this.setState({ searchValue: e.target.value });
                                this.onSearchChange();
                            }}
                            autoFocus
                        />
                    )}
                    <Flex justify="space-between" mt={4}>
                        <Box w="50%">
                            <Truncate align="left" color="muted" f={3} title={formattedAddress}>
                                {filteredClubs.length} club{hasOneResult ? "" : "s"}{" "}
                                {searchByLocation ? `found within ${searchRadius} ${useImperialSystem ? "mile" : "kilometer"}${searchRadius === 1 ? "" : "s"} from ${formattedAddress || `“${searchValue}”`}` : `match${hasOneResult ? "es" : ""} “${searchValue}”`}
                            </Truncate>
                        </Box>
                        <Settings
                            onGeolocationChange={this.onGeolocationChange}
                            onRadiusChange={e => {
                                const { value } = e.target;
                                this.setState({ searchRadius: value });
                                this.onRadiusChange(value);
                            }}
                            onSystemChange={this.onSystemChange}
                            onViewChange={this.onViewChange}
                            searchByLocation={searchByLocation}
                            searchRadius={parseInt(searchRadius)}
                            useImperialSystem={useImperialSystem}
                        />
                    </Flex>
                    <Flex justify={hasResults ? "initial" : "center"} py={4} style={{ margin: -theme.space[2] }} wrap>
                        {
                            filteredClubs.map(club => (
                                <LazyLoad key={club.id} height={0} offset={100} once overflow>
                                    <ClubCard
                                        data={club}
                                        distance={(searchByLocation && searchLat && searchLng) ? geolib.getDistance({ latitude: searchLat, longitude: searchLng }, club) : undefined}
                                        useImperialSystem={useImperialSystem}
                                    />
                                </LazyLoad>
                            ))
                        }
                        {hasSearchValue && !hasResults && searchByLocation && <NoClubsFound />}
                    </Flex>
                </Container>
                <Footer />
            </Fragment>
        );
    }

    onGeolocationChange() {
        if(!navigator.geolocation) {
            alert("Geolocation is not enabled or not supported on your device.");
            return;
        }
        navigator.geolocation.getCurrentPosition(async pos => {
            const { latitude, longitude } = pos.coords;
            const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${data.googleMapsApiKey}`);
            const { results } = response.data;
            const result = results.find(result => result.types.includes("neighborhood")) || results[0]; // Attempt to narrow down user's location
            this.setState({
                // Don't set new coordinates because filtered clubs will use it for calculating distances
                // formattedAddress: result.formatted_address,
                // searchLat: result.geometry.location.lat,
                // searchLng: result.geometry.location.lng,
                searchValue: result.formatted_address
            });
            // TODO: Calling this results in a debounce delay and an extra request to Google
            await this.onSearchChange();
        });
    }

    onRadiusChange(value) {
        this.setState({ searchRadius: parseInt(value) }, () => {
            this.setParams({ r: this.state.searchRadius });
            this.setState({ filteredClubs: this.getFilteredClubs() });
        });
    }

    async onSearchChange() {
        const { searchByLocation, searchValue } = this.state;
        const hasSearchValue = searchValue.trim().length > 0;
        // Preserve results from previous search if current search value is empty
        if(!hasSearchValue) {
            return;
        }
        this.setState({ loading: true });
        this.setParams({ q: searchValue });
        if(searchByLocation) {
            await this.setPosition(searchValue);
        }
        else {
            /*
             * A hack to get the loading animation to appear. Otherwise, the first update would've
             * been overwritten by the second update (due to React batching subsequent `setState` calls).
             */
            await new Promise(resolve => setTimeout(resolve, 0));
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
        this.setState((state, props) => ({ searchByLocation: !state.searchByLocation }), async () => {
            if(this.state.searchByLocation) {
                await this.setPosition(this.state.searchValue);
            }
            this.setState({ filteredClubs: this.getFilteredClubs() });
            this.setParams({ v: this.state.searchByLocation ? "loc" : "all" });
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
            searchByLocation,
            searchLat,
            searchLng,
            searchRadius,
            searchValue,
            useImperialSystem
        } = this.state;
        const hasSearchValue = searchValue.trim().length > 0;
        const isPositionSet = searchLat !== null && searchLng !== null;
        let filteredClubs = [] || clubs; // We want to show every club by default, but it will causes a significant decrease in performance
        if(searchByLocation) {
            if(isPositionSet) {
                filteredClubs = geolib
                    .orderByDistance({ latitude: searchLat, longitude: searchLng }, clubs)
                    .filter(club => geolib.convertUnit(useImperialSystem ? "mi" : "km", club.distance, 2) < searchRadius)
                    .map(({ key }) => clubs[key]);
            }
        }
        else {
            if(hasSearchValue) {
                filteredClubs = this.fuse.search(searchValue);
            }
        }
        return filteredClubs;
    }

    async setPosition(place) {
        try {
            const response = await axios.get(`https://maps.google.com/maps/api/geocode/json?address=${encodeURI(place)}&key=${data.googleMapsApiKey}`);
            const { results } = response.data;
            const result = results.find(result => result.types.includes("neighborhood")) || results[0]; // Attempt to narrow down user's location
            this.setState({
                formattedAddress: result.formatted_address,
                searchLat: result.geometry.location.lat,
                searchLng: result.geometry.location.lng
            });
        }
        catch(e) {
            this.setState({
                formattedAddress: null,
                searchLat: null,
                searchLng: null
            });
        }
    }
}

export default IndexPage;