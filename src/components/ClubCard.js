import React, { Component } from "react";
import FA from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import { css } from "styled-components";
import { Box, Card, Flex, Heading, Link, Text } from "@hackclub/design-system";
import axios from "axios";
import geolib from "geolib";

const Base = Flex.extend`
    padding: ${props => props.theme.space[2]}px;
    text-align: left;
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
    transition: box-shadow ${props => props.theme.transition}, transform ${props => props.theme.transition};
    width: 100%;
    will-change: box-shadow, transform;
    &:hover {
        box-shadow: ${props => props.theme.boxShadows[2]};
        transform: scale(1.02);
    }
`;

const DistanceLabel = Text.span.extend.attrs({
    // TODO: Turn into one-liner
    children: props => {
        const system = props.imperial ? "mi" : "km";
        return `${geolib.convertUnit(system, props.distance, 1)} ${system} away`;
    },
    color: "white",
    p: 2
})`
    background: rgba(0, 0, 0, 0.25);
    border-radius: ${props => props.theme.radius} 0 ${props => props.theme.radius} 0;
    position: absolute;
    text-shadow: rgba(0, 0, 0, 0.32) 0px 1px 4px;
    z-index: 1;
`;

const Photo = Box.extend.attrs({
    style: props => ({
        backgroundImage: `url(${props.image})`
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
    transition: transform ${props => props.theme.transition};
    will-change: transform;
    &:before {
        background-color: ${props => props.theme.colors.snow};
        background-image: url(/placeholder.svg);
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
        content: "";
        display: block;
        height: 100%;
        left: 0;
        opacity: ${props => !props.ready ? 0.25 : 0};
        position: absolute;
        right: 0;
        top: 0;
        transition: opacity ${props => props.theme.transition};
        width: 100%;
        will-change: opacity;
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
`;

class ClubCard extends Component {
    constructor(props) {
        super(props);
        this.state = { ready: false };
    }

    async componentWillMount() {
        const { status } = await axios.get(`/school/${this.props.data.id}.jpg`);
        if(status === 200) {
            this.setState({ ready: true });
        }
    }

    render() {
        const { data, distance, useImperialSystem } = this.props;
        const { ready } = this.state;
        return (
            <Base>
                <Inner>
                    {distance && <DistanceLabel distance={distance} imperial={useImperialSystem} />}
                    <Box style={{ borderRadius: "4px 4px 0 0", overflow: "hidden" }}>
                        <Photo image={`/school/${data.id}.jpg`} ready={ready} />
                    </Box>
                    <Flex flexDirection="column" justify="space-around" p={3} style={{ flex: 1 }}>
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
    data: PropTypes.object.isRequired,
    distance: PropTypes.number,
    useImperialSystem: PropTypes.bool.isRequired
};

export default ClubCard;