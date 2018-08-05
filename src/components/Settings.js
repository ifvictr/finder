import FA from "@fortawesome/react-fontawesome";
import { Box, Button } from "@hackclub/design-system";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { css } from "styled-components";
import Slider from "components/Slider";

const Gradient = Box.extend.attrs({
    style: props => ({
        width: `${props.gradientWidth}px`
    })
})`
    background-image: linear-gradient(to ${props => props.side}, transparent, ${({ theme }) => theme.colors.white});
    height: 100%;
    pointer-events: none; // When user clicks on partially-faded regions
    position: absolute;
    top: 0;
    z-index: 1; // Place above all controls
    ${props => props.side && css`
        ${props.side}: 0;
    `}
`;

const Base = Box.extend`
    overflow: hidden;
    position: relative;
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
    state = {
        scrollX: 0,
        maxScrollX: 64 // Make gradient show up on initial page load
    };

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
        const { scrollX, maxScrollX } = this.state;
        const leftWidth = Math.min(scrollX, 64);
        const rightWidth = Math.min(maxScrollX - scrollX, 64);
        return (
            <Base {...props}>
                <Gradient side="left" gradientWidth={leftWidth} />
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
                <Gradient side="right" gradientWidth={rightWidth} />
            </Base>
        );
    }

    onScroll = e => {
        this.setState({
            scrollX: e.target.scrollLeft,
            maxScrollX: e.target.scrollWidth - e.target.clientWidth
        });
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