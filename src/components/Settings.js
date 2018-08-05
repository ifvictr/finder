import FA from "@fortawesome/react-fontawesome";
import { Box, Button } from "@hackclub/design-system";
import PropTypes from "prop-types";
import React, { Component } from "react";
import Slider from "components/Slider";

const Base = Box.extend`
    overflow: hidden;
    position: relative;
    &:before,
    &:after {
        bottom: 0;
        content: "";
        display: block;
        height: 100%;
        pointer-events: none; // When user clicks on partially-faded regions
        position: absolute;
        top: 0;
        transition: opacity ${({ theme }) => theme.transition};
        width: 64px;
        z-index: 1; // Place above all controls
    }
    &:before {
        background-image: linear-gradient(to left, transparent, ${({ theme }) => theme.colors.white});
        left: 0;
        opacity: ${props => props.end !== "left" ? 1 : 0};
    }
    &:after {
        background-image: linear-gradient(to right, transparent, ${({ theme }) => theme.colors.white});
        opacity: ${props => props.end !== "right" ? 1 : 0};
        right: 0;
    }
`;

const Inner = Box.extend`
    height: 42px; // Fix clipped buttons resulting from overflow-x
    overflow-x: auto;
    position: relative;
    white-space: nowrap;
    ::-webkit-scrollbar {
        display: none;
    }
`;

class Settings extends Component {
    state = { currentEnd: null };

    render() {
        const {
            onGeolocationChange,
            onRadiusChange,
            onSystemChange,
            onViewChange,
            searchByLocation,
            searchRadius,
            useImperialSystem,
            ...props
        } = this.props;
        return (
            <Base end={this.state.currentEnd} {...props}>
                <Inner onScroll={this.onScroll}>
                    <Slider
                        defaultValue={searchRadius}
                        min={1}
                        max={100}
                        onChange={onRadiusChange}
                        m={0}
                        w="auto"
                        disabled={!searchByLocation}
                        style={{ display: "inline-block" }}
                    />
                    <Button.button onClick={onGeolocationChange} inverted disabled={!searchByLocation} ml={2}>
                        <FA icon="crosshairs" /> Use my location
                    </Button.button>
                    <Button.button onClick={onSystemChange} inverted={!useImperialSystem} disabled={!searchByLocation} ml={2}>
                        <FA icon="ruler" /> {useImperialSystem ? "Imperial" : "Metric"}
                    </Button.button>
                    <Button.button onClick={onViewChange} inverted={searchByLocation} ml={2}>
                        <FA icon="search" /> Search all
                    </Button.button>
                </Inner>
            </Base>
        );
    }

    onScroll = e => {
        // Remove gradient if either end is hit
        const scrollX = e.target.scrollLeft;
        const maxScrollX = e.target.scrollWidth - e.target.clientWidth;
        if(scrollX === 0) {
            this.setState({ currentEnd: "left" });
        }
        else if(scrollX === maxScrollX) {
            this.setState({ currentEnd: "right" });
        }
        else {
            this.setState({ currentEnd: null });
        }
    }
}

Settings.propTypes = {
    onGeolocationChange: PropTypes.func.isRequired,
    onRadiusChange: PropTypes.func.isRequired,
    onSystemChange: PropTypes.func.isRequired,
    onViewChange: PropTypes.func.isRequired,
    searchByLocation: PropTypes.bool.isRequired,
    searchRadius: PropTypes.number.isRequired,
    useImperialSystem: PropTypes.bool.isRequired
};

export default Settings;