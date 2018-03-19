import React, { Component } from "react";
import { Card, Input } from "@hackclub/design-system";

const S = Card.withComponent(Input).extend.attrs({
    borderRadius: props => props.theme.pill,
    boxShadowSize: "sm",
    fontSize: 5,
    mx: "auto",
    mt: 4,
    px: 4,
})`
    &:hover {
        box-shadow: ${props => props.theme.boxShadows[1]};
    }
    &:focus {
        border-color: ${props => props.theme.colors.smoke};
        box-shadow: ${props => props.theme.boxShadows[2]};
    }
`;

class SearchBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ""
        };
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        return <S placeholder="Where are you?" value={this.state.value} onChange={this.handleChange} />;
    }

    handleChange(e) {
        this.setState({ value: e.target.value });
    }
}

export default SearchBox;