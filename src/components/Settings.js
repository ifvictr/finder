import React from "react";
import PropTypes from "prop-types";
import FA from "@fortawesome/react-fontawesome";
import { Box, Button } from "@hackclub/design-system";
import Slider from "components/Slider";

const Settings = ({
    onRadiusChange,
    onSystemChange,
    onViewChange,
    searchRadius,
    showAllClubs,
    useImperialSystem,
    ...props
}) => (
    <Box {...props}>
        {!showAllClubs && (
            <Slider
                defaultValue={searchRadius}
                min={1}
                max={100}
                onChange={e => {
                    e.persist();
                    onRadiusChange(e);
                }}
            />
        )}
        <Button.button onClick={onSystemChange} inverted={!useImperialSystem} disabled={showAllClubs} ml={2}>
            <FA icon="chess-king" /> Imperial
        </Button.button>
        <Button.button onClick={onViewChange} inverted={!showAllClubs} ml={2}>
            <FA icon="globe" /> View all
        </Button.button>
    </Box>
);

Settings.propTypes = {
    onRadiusChange: PropTypes.func.isRequired,
    onSystemChange: PropTypes.func.isRequired,
    onViewChange: PropTypes.func.isRequired,
    searchRadius: PropTypes.number.isRequired,
    showAllClubs: PropTypes.bool.isRequired,
    useImperialSystem: PropTypes.bool.isRequired
};

export default Settings;