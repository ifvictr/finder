import React from "react";
import { Flex, Image, Link } from "@hackclub/design-system";

const Base = Flex.withComponent("header");

const Header = () => (
    <Base justify="space-between">
        <Link href="https://hackclub.com" target="_blank">
            <Image src="/flag.svg" alt="Hack Club" w={128} ml={[3, 4, 5]} />
        </Link>
        <Flex py={3} pr={[3, 4, 5]}>
            <Link href="https://github.com/hackclub/finder" target="_blank" color="slate">Contribute on GitHub</Link>
        </Flex>
    </Base>
);

export default Header;