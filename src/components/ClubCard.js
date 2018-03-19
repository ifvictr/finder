import React, { Component } from "react";
import PropTypes from "prop-types";
import { Box, Card, Flex, Heading, Text } from "@hackclub/design-system";
import axios from "axios";

const Base = Box.extend`
    display: flex;
    padding: ${props => props.theme.space[2]}px;
    text-align: initial;
    width: 25%;
`;

const Inner = Card.extend.attrs({
    boxShadowSize: "sm"
})`
    background-color: ${props => props.theme.colors.snow};
    border-radius: ${props => props.theme.radius};
    transition: 0.125s box-shadow ease-in;
    &:hover {
        box-shadow: ${props => props.theme.boxShadows[2]};
    }
`;

const Photo = Box.withComponent("figure").extend`
    background-image: url(${props => props.src});
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    border-radius: ${props => props.theme.radius} ${props => props.theme.radius} 0 0;
    display: block;
    margin: 0;
    padding-top: 66.6666%;
    position: relative;
    transition: 0.125s background-image ease-in, 0.125s opacity ease-in;
    &:after {
        background-image: url(/placeholder.svg);
        background-repeat: no-repeat;
        background-position: center;
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
`;

class ClubCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ready: false
        };
    }

    componentWillMount() {
        axios
            .get(`/school/${this.props.data.id}.jpg`)
            .then(res => {
                if(res.status === 200) {
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
                    <Photo src={`/school/${data.id}.jpg`} ready={ready} />
                    <Flex p={3} justify="space-around" flexDirection="column">
                        <Heading.h4>{data.name}</Heading.h4>
                        <Text pt={2}>{data.address}</Text>
                    </Flex>
                </Inner>
            </Base>
        );
    }
}

ClubCard.propTypes = {
    data: PropTypes.object.isRequired
};

export default ClubCard;