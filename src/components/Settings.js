import React, { Component } from "react";
import FA from "@fortawesome/react-fontawesome";
import { Box, Button } from "@hackclub/design-system";

class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            distanceRange: 50,
            showAllClubs: false,
            useImperialSystem: true
        };
        this.onSystemToggle = this.onSystemToggle.bind(this);
        this.onViewToggle = this.onViewToggle.bind(this);
    }

    render() {
        const { showAllClubs, useImperialSystem } = this.state;
        return (
            <Box {...this.props}>
                <Button onClick={this.onSystemToggle} inverted={!useImperialSystem} mr={2}>
                    <FA icon="chess-king" /> Imperial
                </Button>
                <Button onClick={this.onViewToggle} inverted={!showAllClubs}>
                    <FA icon="globe" /> View all
                </Button>
            </Box>
        );
    }

    onSystemToggle() {
        this.setState({ useImperialSystem: !this.state.useImperialSystem });
    }

    onViewToggle() {
        this.setState({ showAllClubs: !this.state.showAllClubs });
    }
}

export default Settings;