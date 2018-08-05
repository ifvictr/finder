import { theme } from '@hackclub/design-system'
import styled, { css } from 'styled-components'
import { color, propTypes, space, width } from 'styled-system'

const Slider = styled.input.attrs({ type: 'range' })`
    appearance: none;
    border-radius: ${({ theme }) => theme.pill};
    cursor: pointer;
    display: block;
    height: 4px;
    &::-webkit-slider-thumb {
        appearance: none;
        background-color: currentColor;
        border: 0;
        border-radius: ${({ theme }) => theme.pill};
        height: 16px;
        width: 16px;
    }
    ${color} ${space} ${width};
    ${props =>
        props.disabled &&
        css`
            cursor: not-allowed;
            opacity: 0.25;
        `}
`

Slider.displayName = 'Input'

Slider.propTypes = {
    ...propTypes.color,
    ...propTypes.space,
    ...propTypes.width
}

Slider.defaultProps = {
    bg: 'smoke',
    color: 'primary',
    theme,
    w: 1
}

export default Slider