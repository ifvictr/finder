import FA from "@fortawesome/react-fontawesome";
import { Container, Heading, LargeButton, Text } from "@hackclub/design-system";
import React, { Fragment } from "react";
import Helmet from "react-helmet";

const ErrorPage = () => (
    <Fragment>
        <Helmet title="404" />
        <Container align="center" maxWidth={48} px={2} py={6} style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "center" }}>
            <Heading.h1 color="primary" f={[5, 6]}>
                404!
            </Heading.h1>
            <Text f={4} mt={2} mb={3} color="muted">
                We couldn’t find that page.
            </Text>
            <LargeButton href="/">Go home <FA icon="home" /></LargeButton>
        </Container>
    </Fragment>
);

export default ErrorPage;