import React, { Component } from "react";
import FA from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import { css } from "styled-components";
import { Box, Card, Flex, Heading, Link, Text } from "@hackclub/design-system";
import axios from "axios";
import geolib from "geolib";

const Base = Box.extend`
    display: flex;
    padding: ${props => props.theme.space[2]}px;
    text-align: initial;
    width: 100%;
    ${props => props.theme.mediaQueries.sm} {
        width: 50%;
    }
    ${props => props.theme.mediaQueries.md} {
        width: 33.3333%;
    }
    ${props => props.theme.mediaQueries.lg} {
        width: 25%;
    }
`;

const Inner = Card.withComponent(Flex).extend.attrs({
    bg: "snow",
    boxShadowSize: "sm",
    flexDirection: "column"
})`
    border-radius: ${props => props.theme.radius};
    position: relative;
    transition: 0.125s box-shadow ease-in, 0.125s transform ease-in;
    width: 100%;
    &:hover {
        box-shadow: ${props => props.theme.boxShadows[2]};
        transform: scale(1.02);
    }
`;

const Distance = Text.span.extend.attrs({
    color: "white",
    p: 2
})`
    background: rgba(0, 0, 0, 0.25);
    border-radius: ${props => props.theme.radius} 0 ${props => props.theme.radius} 0;
    position: absolute;
    text-shadow: rgba(0, 0, 0, 0.32) 0px 1px 4px;
    z-index: 1;
`;

const Photo = Box.withComponent("figure").extend.attrs({
    style: props => ({
        backgroundImage: `url(${props.src})`
    })
})`
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: ${props => props.theme.radius} ${props => props.theme.radius} 0 0;
    display: block;
    margin: 0;
    padding-top: 66.6666%;
    position: relative;
    transition: 0.125s background-image ease-in, 0.125s opacity ease-in, 0.125s transform ease-in;
    &:before {
        background-image: url(/placeholder.svg);
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
        content: "";
        display: block;
        height: 100%;
        left: 0;
        opacity: ${props => props.ready ? 0 : 0.25};
        position: absolute;
        right: 0;
        top: 0;
        width: 100%;
    }
    ${props => props.ready && css`
        ${Inner}:hover & {
            transform: scale(1.08);
        }`
    }
`;

const Actions = Flex.extend.attrs({
    flexDirection: "row",
    justify: "center",
    wrap: true
})``;

const Action = Box.withComponent(Link).extend.attrs({
    align: "center",
    children: props => <FA icon={props.icon} />,
    color: "primary",
    p: 3,
    target: "_blank"
})`
    flex-basis: 25%;
    flex-grow: 1;
    opacity: ${props => props.available ? 1 : 0.25};
    transition: 0.125s background-color ease-in;
`;

class ClubCard extends Component {
    constructor(props) {
        super(props);
        this.state = { ready: false };
    }

    componentWillMount() {
        axios
            .get(`/school/${this.props.data.id}.jpg`)
            .then(({ status }) => {
                if(status === 200) {
                    this.setState({ ready: true });
                }
            });
    }

    render() {
        const { data, distance, showAllClubs, useImperialSystem } = this.props;
        const { ready } = this.state;
        return (
            <Base>
                <Inner>
                    {!showAllClubs && <Distance>{geolib.convertUnit(useImperialSystem ? "mi" : "km", distance, 1)} {useImperialSystem ? "mi" : "km"} away</Distance>}
                    <Box style={{ borderRadius: "4px 4px 0 0", overflow: "hidden" }}>
                        <Photo src={`/school/${data.id}.jpg`} ready={ready} />
                    </Box>
                    <Flex p={3} justify="space-around" flexDirection="column" style={{ flex: 1 }}>
                        <Heading.h4 style={{ textTransform: "capitalize" }}>{data.name}</Heading.h4>
                        <Text pt={2}>{data.address}</Text>
                    </Flex>
                    <Actions>
                        <Action icon="comment" />
                        <Action href={`https://www.google.com/maps/place/${encodeURI(data.address)}`} icon="map" available />
                        <Action icon={["fab", "slack-hash"]} />
                        <Action icon="envelope" />
                    </Actions>
                </Inner>
            </Base>
        );
    }
}

ClubCard.propTypes = {
    data: PropTypes.object.isRequired
};

export default ClubCard;