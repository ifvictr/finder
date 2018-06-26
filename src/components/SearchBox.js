import React from "react";
import { Input } from "@hackclub/design-system";

const Base = Input.extend.attrs({
    px: 4,
    py: 2
})`
    border: 0;
    border-radius: ${({ theme }) => theme.pill};
    box-shadow: ${({ theme }) => theme.boxShadows[0]};
    font-size: ${({ theme }) => theme.fontSizes[5]}px;
    will-change: box-shadow;
    &:hover,
    &:focus {
        box-shadow: ${({ theme }) => theme.boxShadows[1]};
    }
`;

const SearchBox = ({ onSearchChange, value, ...props }) => (
    <Base
        placeholder="Where are you?"
        value={value}
        onChange={onSearchChange}
        type="search"
        itemProp="query-input"
        itemScope
        itemType="https://schema.org/SearchAction"
        {...props}
    />
);

export default SearchBox;