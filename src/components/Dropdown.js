import { Box, Card, Flex } from '@hackclub/design-system'
import { css, keyframes } from 'styled-components'

const zoom = keyframes`
    0% {
        box-shadow: ${({ theme }) => theme.boxShadows[1]};
        transform: scale(0);
    }
    85% {
        transform: scale(1.025);
    }
    100% {
        box-shadow: ${({ theme }) => theme.boxShadows[2]};
        transform: scale(1);
    }
`

const DropdownContainer = Box.extend`
    position: relative;
    // &:hover > div {
    //     animation: 0.1875s ease-out ${zoom};
    //     display: block;
    //     opacity: 1;
    // }
`

const DropdownMenu = Card.withComponent(Flex).extend`
    align-items: stretch;
    background-color: ${({ theme }) => theme.colors.white};
    box-shadow: ${({ theme }) => theme.boxShadows[2]};
    // display: none;
    flex-direction: column;
    max-width: 95vw;
    // opacity: 0;
    overflow-y: auto;
    padding: ${({ theme }) => theme.space[2]}px 0;
    position: absolute;
    right: 0;
    text-align: left;
    transform-origin: center top;
    width: ${props => props.w || props.width || '256px'};
    z-index: 4;
    -webkit-overflow-scrolling: touch;
`

const DropdownMenuOption = Box.extend`
    cursor: pointer;
    padding: ${({ theme }) => theme.space[2]}px ${({ theme }) => theme.space[3]}px;
    width: 100%;
    ${props =>
        props.active &&
        css`
            background-color: ${({ theme }) => theme.colors.smoke};
            font-weight: ${({ theme }) => theme.bold};
        `}
    &:hover {
        background-color: ${({ theme }) => theme.colors.blue[0]};
        transition: background-color ${({ theme }) => theme.transition};
    }
`

export default { DropdownContainer, DropdownMenu, DropdownMenuOption }