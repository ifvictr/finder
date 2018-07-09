import FA from "@fortawesome/react-fontawesome";
import { Box, Button/*, Slider*/ } from "@hackclub/design-system";
import PropTypes from "prop-types";
import React from "react";
import Slider from "components/Slider";

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
    <Box {...props}>
        {searchByLocation && (
            <Slider
                defaultValue={searchRadius}
                min={1}
                max={100}
                onChange={onRadiusChange}
                m={0}
                w="auto"
                style={{ display: "inline-block" }}
            />
        )}
        <Button.button onClick={onGeolocationChange} inverted disabled={!searchByLocation} ml={2}>
            <FA icon="crosshairs" /> Use my location
        </Button.button>
        <Button.button onClick={onSystemChange} inverted={!useImperialSystem} disabled={!searchByLocation} ml={2}>
            <FA icon="ruler" /> {useImperialSystem ? "Imperial" : "Metric"}
        </Button.button>
        <Button.button onClick={onViewChange} inverted={searchByLocation} ml={2}>
            <FA icon="search" /> Search all
        </Button.button>
    </Box>
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