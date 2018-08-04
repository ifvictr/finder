import FA from "@fortawesome/react-fontawesome";
import { Box, Button } from "@hackclub/design-system";
import PropTypes from "prop-types";
import React from "react";
import Slider from "components/Slider";

const Base = Box.extend`
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
        width: 64px;
        z-index: 1; // Place above all controls
    }
    &:before {
        background-image: linear-gradient(to left, transparent, ${({ theme }) => theme.colors.white});
        left: 0;
    }
    &:after {
        background-image: linear-gradient(to right, transparent, ${({ theme }) => theme.colors.white});
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

const Settings = ({
    onGeolocationChange,
    onRadiusChange,
    onSystemChange,
    onViewChange,
    searchByLocation,
    searchRadius,
    useImperialSystem,
    ...props
}) => (
    <Base {...props}>
        <Inner>
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