import { Flex, Heading, theme } from "@hackclub/design-system";
import axios from "axios";
import Fuse from "fuse.js";
import { navigateTo } from "gatsby-link";
import geolib from "geolib";
import { debounce, sortBy } from "lodash";
import qs from "query-string";
import React, { Component, Fragment } from "react";
import LazyLoad from "react-lazyload";
import Progress from "react-progress";
import ClubCard from "components/ClubCard";
import LocationSearchInput from "components/LocationSearchInput";
import NoClubsFound from "components/NoClubsFound";
import SearchInfo from "components/SearchInfo";
import SearchInput from "components/SearchInput";
import Settings from "components/Settings";
import { getPointsInCircle, KILOMETER_TO_METER, MILE_TO_METER } from "utils";
import { googleMapsApiKey } from "data.json";

class IndexPage extends Component {
    state = {
        clubs: [],
        filteredClubs: [],
        formattedAddress: null,
        loading: false,
        params: qs.parse(this.props.location.search), // Attempt to use present query parameters
        searchByLocation: true,
        searchLat: null,
        searchLng: null,
        searchRadius: 50,
        searchValue: "",
        useImperialSystem: true
    };

    fuse = undefined;

    constructor(props) {
        super(props);
        this.onRadiusChange = debounce(this.onRadiusChange, 1250);
        this.onSearchChange = debounce(this.onSearchChange, 1250);
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
                keys: [
                    "name",
                    "address"
                ],
                location: 0,
                maxPatternLength: 32,
                minMatchCharLength: 3,
                shouldSort: true,
                threshold: 0.3,
            });
            this.setState({ filteredClubs: this.getFilteredClubs() });
        });
    }

    componentDidUpdate(prevProps) {
        // Handle users navigating using back/forward button
        if(this.props.location.search !== prevProps.location.search) {
            const params = qs.parse(this.props.location.search);
            const { m, q, r, v } = params;
            // Update state and filtered clubs based on parameters
            this.setState({
                params,
                // Fallback to default if a parameter no longer exists
                searchByLocation: v ? v === "loc" : true,
                searchRadius: r ? parseInt(r) : 50,
                searchValue: q || "",
                useImperialSystem: m ? m === "i" : true
            }, async () => {
                if(this.state.searchByLocation) {
                    await this.setPosition(this.state.searchValue);
                }
                this.setState({ filteredClubs: this.getFilteredClubs() });
            });
        }
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
        return (
            <Fragment>
                <Progress color={theme.colors.primary} percent={loading ? 0 : 100} />
                <Heading.h1 f={[5, 6]} mt={4}>Find Hack Clubs near you!</Heading.h1>
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
                    <SearchInfo
                        formattedAddress={formattedAddress}
                        resultCount={filteredClubs.length}
                        searchByLocation={searchByLocation}
                        searchRadius={searchRadius}
                        searchValue={searchValue}
                        useImperialSystem={useImperialSystem}
                        style={{ maxWidth: "50%" }}
                    />
                    <Settings
                        onGeolocationChange={this.onGeolocationChange}
                        onRadiusChange={e => {
                            const { value } = e.target;
                            this.setState({ searchRadius: parseInt(value) });
                            this.onRadiusChange(value);
                        }}
                        onSystemChange={this.onSystemChange}
                        onViewChange={this.onViewChange}
                        searchByLocation={searchByLocation}
                        searchRadius={parseInt(searchRadius)}
                        useImperialSystem={useImperialSystem}
                    />
                </Flex>
                <Flex justify={hasResults ? "initial" : "center"} style={{ margin: -theme.space[2], marginTop: theme.space[2] }} wrap>
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
            </Fragment>
        );
    }

    onGeolocationChange = () => {
        const { geolocation } = window.navigator;
        if(!geolocation) {
            alert("Geolocation is not enabled or not supported on your device.");
            return;
        }
        geolocation.getCurrentPosition(async pos => {
            const { latitude, longitude } = pos.coords;
            const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleMapsApiKey}`);
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

    onRadiusChange = value => {
        this.setState({ searchRadius: parseInt(value) }, () => {
            this.setParams({ r: this.state.searchRadius });
            this.setState({ filteredClubs: this.getFilteredClubs() });
        });
    }

    onSearchChange = async () => {
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

    onSystemChange = () => {
        // Only accessible when searching by location
        this.setState((state, props) => ({ useImperialSystem: !state.useImperialSystem }), () => {
            this.setState({ filteredClubs: this.getFilteredClubs() });
            this.setParams({ m: this.state.useImperialSystem ? "i" : "m" });
        });
    }

    onViewChange = () => {
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
            navigateTo(`/?${qs.stringify(params)}`);
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
                const center = { latitude: searchLat, longitude: searchLng };
                const conversionConstant = useImperialSystem ? MILE_TO_METER : KILOMETER_TO_METER;
                const filteredPoints = getPointsInCircle(clubs, center, searchRadius * conversionConstant);
                filteredClubs = geolib
                    .orderByDistance(center, filteredPoints)
                    .map(({ key }) => filteredPoints[key]); // Needed because Geolib returns a differently-shaped object
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
            const response = await axios.get(`https://maps.google.com/maps/api/geocode/json?address=${encodeURI(place)}&key=${googleMapsApiKey}`);
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