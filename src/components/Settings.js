import React from "react";
import PropTypes from "prop-types";
import FA from "@fortawesome/react-fontawesome";
import { Box, Button } from "@hackclub/design-system";


const Settings = ({
    distanceRange,
    onSystemToggle,
    onViewToggle,
    showAllClubs,
    useImperialSystem,
    ...props
}) => (
    <Box {...props}>
        <Button onClick={onSystemToggle} inverted={!useImperialSystem} mr={2}>
            <FA icon="chess-king" /> Imperial
        </Button>
        <Button onClick={onViewToggle} inverted={!showAllClubs}>
            <FA icon="globe" /> View all
        </Button>
    </Box>
);

Settings.propTypes = {
    distanceRange: PropTypes.number.isRequired,
    showAllClubs: PropTypes.bool.isRequired,
    useImperialSystem: PropTypes.bool.isRequired
};

export default Settings;