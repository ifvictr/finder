import React from "react";
import { Card, Input } from "@hackclub/design-system";

const Base = Card.withComponent(Input).extend.attrs({
    borderRadius: ({ theme }) => theme.pill,
    boxShadowSize: "sm",
    f: 5,
    px: 4
})`
    will-change: border-color, box-shadow;
    &:hover {
        box-shadow: ${({ theme }) => theme.boxShadows[1]};
    }
    &:focus {
        border-color: ${({ theme }) => theme.colors.smoke};
        box-shadow: ${({ theme }) => theme.boxShadows[2]};
    }
`;

const SearchBox = ({ onSearchChange, value, ...props }) => (
    <Base
        placeholder="Where are you?"
        value={value}
        onChange={onSearchChange}
        itemProp="query-input"
        itemScope
        itemType="https://schema.org/SearchAction"
        {...props}
    />
);

export default SearchBox;