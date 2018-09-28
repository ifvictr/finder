import { Input } from '@hackclub/design-system'
import PropTypes from 'prop-types'
import React from 'react'
import PlacesAutocomplete from 'react-places-autocomplete'
import styled from 'styled-components'
import {
  DropdownContainer,
  DropdownMenu,
  DropdownMenuOption
} from 'components/Dropdown'

const Base = styled(Input).attrs({
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
`

const SearchInput = ({ onSearchChange, value, ...props }) => (
  <Base
    placeholder="Where are you?"
    value={value}
    onChange={e => onSearchChange(e.target.value)} // Keep parameter type consistent with other functions
    type="search"
    itemProp="query-input"
    itemScope
    itemType="https://schema.org/SearchAction"
    {...props}
  />
)

SearchInput.propTypes = {
  onSearchChange: PropTypes.func,
  value: PropTypes.string.isRequired
}

const Inner = ({
  getInputProps,
  getSuggestionItemProps,
  suggestions,
  ...props
}) => (
  <DropdownContainer>
    <SearchInput {...getInputProps({ type: 'search', ...props })} />
    {suggestions.length > 0 && (
      <DropdownMenu w={1}>
        {suggestions.map(suggestion => (
          <DropdownMenuOption
            key={suggestion.id}
            active={suggestion.active}
            {...getSuggestionItemProps(suggestion)}
          >
            {suggestion.description}
          </DropdownMenuOption>
        ))}
      </DropdownMenu>
    )}
  </DropdownContainer>
)

const LocationSearchInput = ({
  onSearchChange,
  onSearchError,
  value,
  ...props
}) => (
  <PlacesAutocomplete
    value={value}
    onChange={onSearchChange}
    onError={onSearchError}
    children={paProps => <Inner {...paProps} {...props} />}
  />
)

LocationSearchInput.propTypes = {
  onSearchChange: PropTypes.func.isRequired,
  onSearchError: PropTypes.func,
  value: PropTypes.string.isRequired
}

export default { LocationSearchInput, SearchInput }
