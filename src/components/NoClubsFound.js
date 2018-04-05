import React from "react";
import { Box, Button, Card, Container, Flex, Heading, Image, Link, Text } from "@hackclub/design-system";

const Base = Card.extend.attrs({
    boxShadowSize: "lg",
    p: 4
})`
    align-items: center;
    flex-direction: column;
    max-width: 48rem;
`;

const SuperButton = Button.withComponent(Link).extend`
    background-color: ${props => props.theme.colors.fuschia[6]};
    background-image: linear-gradient(
        -32deg,
        ${props => props.theme.colors.fuschia[5]},
        ${props => props.theme.colors.red[5]},
        ${props => props.theme.colors.red[6]}
    );
`;

// TODO: Find a better name
const NoClubsFound = props => (
    <Base>
        {/*<Image src="https://raw.githubusercontent.com/hackclub/dinosaurs/master/club_dinosaur.png" />*/}
        <Heading.h2>There aren’t any clubs around you…</Heading.h2>
        <SuperButton href="https://hackclub.com/start" target="_blank" f={4} mt={4}>Be the first »</SuperButton>
    </Base>
);

export default NoClubsFound;