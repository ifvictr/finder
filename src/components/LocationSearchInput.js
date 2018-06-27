import React from "react";
import PropTypes from "prop-types";
import PlacesAutocomplete from "react-places-autocomplete";
import { DropdownContainer, DropdownMenu, DropdownMenuOption } from "components/Dropdown";
import SearchInput from "components/SearchInput";

const LocationSearchInput = ({ onSearchChange, onSearchError, value, ...props }) => (
    <PlacesAutocomplete
        value={value}
        onChange={onSearchChange}
        onError={onSearchError}
    >
        {({ getInputProps, getSuggestionItemProps, suggestions }) => (
            <DropdownContainer>
                <SearchInput {...getInputProps()} {...props} />
                {suggestions.length > 0 && (
                    <DropdownMenu w={1}>
                        {suggestions.map(suggestion => (
                            <DropdownMenuOption key={suggestion.id} active={suggestion.active} {...getSuggestionItemProps(suggestion)}>{suggestion.description}</DropdownMenuOption>
                        ))}
                    </DropdownMenu>
                )}
            </DropdownContainer>
        )}
    </PlacesAutocomplete>
);

LocationSearchInput.propTypes = {
    onSearchChange: PropTypes.func.isRequired,
    onSearchError: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired
};

export default LocationSearchInput;