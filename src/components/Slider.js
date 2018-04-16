import React from "react";
import styled from "styled-components";

const Slider = styled.input.attrs({
    type: "range",
})`
    margin: 0;
    vertical-align: middle;
`;

export default Slider;