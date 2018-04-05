import React from "react";
import FA from "@fortawesome/react-fontawesome";
import { Flex, Link, Text, theme } from "@hackclub/design-system";

const Base = Flex.withComponent("footer").extend.attrs({
    bg: "snow",
    p: 4
})`
    background-image: url(/pattern.svg);
    background-size: 20rem;
    flex-direction: row;
    justify-content: center;
`;

const Footer = () => (
    <Base>
        <Text align="center" f={3}>
            Made with <FA icon="code" color={theme.colors.info} /> and <FA icon="heart" color={theme.colors.primary} />{" "}
            by <Link href="https://ifvictr.com" target="_blank">Victor Truong</Link>
        </Text>
    </Base>
);

export default Footer;