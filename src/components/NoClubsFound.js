import { Button, Card, Container, Heading } from "@hackclub/design-system";
import React from "react";

const Base = Card.withComponent(Container);

const SuperButton = Button.extend`
    background-color: ${({ theme }) => theme.colors.fuschia[6]};
    background-image: linear-gradient(
        -32deg,
        ${({ theme }) => theme.colors.fuschia[5]},
        ${({ theme }) => theme.colors.red[5]},
        ${({ theme }) => theme.colors.red[6]}
    );
`;

const NoClubsFound = () => (
    <Base bg="snow" boxShadowSize="lg" maxWidth={48} p={4}>
        <Heading.h2>There aren’t any clubs around you…</Heading.h2>
        <SuperButton href="https://hackclub.com/start" target="_blank" f={4} mt={4}>Start the first one »</SuperButton>
    </Base>
);

export default NoClubsFound;