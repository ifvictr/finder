import { Box, Truncate } from '@hackclub/design-system'
import PropTypes from 'prop-types'
import React from 'react'

const SearchInfo = ({
    formattedAddress,
    resultCount,
    searchByLocation,
    searchRadius,
    searchValue,
    useImperialSystem,
    ...props
}) => (
    <Box {...props}>
        <Truncate align="left" color="muted" f={3} title={formattedAddress}>
            {resultCount || 'No'} club
            {resultCount === 1 ? '' : 's'}{' '}
            {searchByLocation
                ? `found within ${searchRadius} ${useImperialSystem ? 'mile' : 'kilometer'}${searchRadius === 1 ? '' : 's'} from ${formattedAddress || `“${searchValue}”`}`
                : `match${resultCount === 1 ? 'es' : ''} “${searchValue}”`}
        </Truncate>
    </Box>
)

SearchInfo.propTypes = {
    formattedAddress: PropTypes.string,
    resultCount: PropTypes.number.isRequired,
    searchByLocation: PropTypes.bool.isRequired,
    searchRadius: PropTypes.number.isRequired,
    searchValue: PropTypes.string.isRequired,
    useImperialSystem: PropTypes.bool.isRequired
}

export default SearchInfo