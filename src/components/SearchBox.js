import React from "react";
import { Card, Input } from "@hackclub/design-system";

const Base = Card.withComponent(Input).extend.attrs({
    borderRadius: props => props.theme.pill,
    boxShadowSize: "sm",
    f: 5,
    mx: "auto",
    mt: 4,
    px: 4
})`
    &:hover {
        box-shadow: ${props => props.theme.boxShadows[1]};
    }
    &:focus {
        border-color: ${props => props.theme.colors.smoke};
        box-shadow: ${props => props.theme.boxShadows[2]};
    }
`;

const SearchBox = ({ onSearchChange, value }) => (
    <Base
        placeholder="Where are you?"
        value={value}
        onChange={onSearchChange}
    />
);

export default SearchBox;