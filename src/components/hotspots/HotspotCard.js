import { Flex, Heading } from "@hackclub/design-system";
import axios from "axios";
import Link from "gatsby-link";
import { kebabCase } from "lodash";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { css } from "styled-components";

const Base = Flex.extend`
    padding: ${({ theme }) => theme.space[2]}px;
    text-align: left;
    width: 100%;
    ${({ theme }) => theme.mediaQueries.md} {
        width: 50%;
    }
`;

const Inner = Flex.withComponent(Link).extend.attrs({
    color: "white",
    flexDirection: "column",
    justify: "center",
    p: 3,
    style: props => ({
        backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.15)), url(${props.ready ? props.image : "/pattern.svg"})`
    }),
    w: 1
})`
    border-radius: ${({ theme }) => theme.radius};
    background-color: ${({ theme }) => theme.colors.primary};
    background-size: 20rem;
    min-height: 10rem;
    overflow: hidden;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.375);
    ${props => props.ready && css`
        background-repeat: no-repeat;
        background-size: cover;
    `}
    span {
        display: inline-block;
        opacity: 0;
        transition: margin ${({ theme }) => theme.transition}, opacity ${({ theme }) => theme.transition};
        vertical-align: text-top;
    }
    &:hover span {
        margin-left: 4px;
        opacity: 1;
    }
    ${({ theme }) => theme.mediaQueries.md} {
        min-height: 12rem;
    }
`;

class HotspotCard extends Component {
    constructor(props) {
        super(props);
        this.state = { ready: false };
    }

    async componentDidMount() {
        const { data } = this.props;
        const slug = data.slug || kebabCase(data.name);
        const { status } = await axios.get(`/hotspot/${slug}.jpg`);
        if(status === 200) {
            this.setState({ ready: true });
        }
    }

    render() {
        const { data } = this.props;
        const { ready } = this.state;
        const slug = data.slug || kebabCase(data.name);
        return (
            <Base>
                <Inner to={`/hotspots/${slug}`} image={`/hotspot/${slug}.jpg`} ready={ready}>
                    <Heading.h2 ml={3} style={{ textTransform: "capitalize" }}>{data.name} <span>»</span></Heading.h2>
                </Inner>
            </Base>
        );
    }
}

HotspotCard.propTypes = {
    data: PropTypes.object.isRequired
};

export default HotspotCard;