// TODO: Remove when added to @hackclub/design-system
import React from "react";
import styled from "styled-components";
import { color, space, width, propTypes } from "styled-system";
import { theme } from "@hackclub/design-system";

const Slider = styled.input.attrs({ type: "range" })`
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
`;

Slider.displayName = "Input";

Slider.propTypes = {
    ...propTypes.color,
    ...propTypes.space,
    ...propTypes.width
};

Slider.defaultProps = {
    bg: "smoke",
    color: "primary",
    theme,
    w: 1
};

export default Slider;