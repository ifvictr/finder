import React, { Component } from "react";
import FA from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import { css } from "styled-components";
import { Box, Card, Flex, Heading, Link, Text } from "@hackclub/design-system";
import axios from "axios";

const Base = Box.extend`
    display: flex;
    padding: ${props => props.theme.space[2]}px;
    text-align: initial;
    width: 25%;
`;

const Inner = Card.withComponent(Flex).extend.attrs({
    boxShadowSize: "sm",
    flexDirection: "column"
})`
    background-color: ${props => props.theme.colors.snow};
    border-radius: ${props => props.theme.radius};
    position: relative;
    transition: 0.125s box-shadow ease-in, 0.125s transform ease-in;
    &:hover {
        box-shadow: ${props => props.theme.boxShadows[2]};
        transform: scale(1.02);
    }
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
    color: props => props.theme.colors.primary,
    p: 3,
    target: "_blank"
})`
    flex-basis: 25%;
    flex-grow: 1;
    opacity: 0.25;
    transition: 0.125s background-color ease-in;
    ${props => props.available && css`
        opacity: 1;
        &:hover {
            background-color: ${props => props.theme.colors.snow};
        }`
    }
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
        const { data } = this.props;
        const { ready } = this.state;
        return (
            <Base>
                <Inner>
                    <Box style={{ borderRadius: "4px 4px 0 0", overflow: "hidden" }}>
                        <Photo src={`/school/${data.id}.jpg`} ready={ready} />
                    </Box>
                    <Flex p={3} justify="space-around" flexDirection="column" style={{ flex: 1 }}>
                        <Heading.h4>{data.name}</Heading.h4>
                        <Text pt={2}>{data.address}</Text>
                    </Flex>
                    <Actions>
                        {/* TODO: Add icons for other features (e.g. contact, website) and show/mute based on availability of info, and show only on card hovered */}
                        <Action icon="comment" available />
                        <Action href={`https://www.google.com/maps/place/${encodeURI(data.address)}`} icon="map" available />
                        <Action icon={["fab", "slack-hash"]} available />
                        <Action icon="envelope" available />
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