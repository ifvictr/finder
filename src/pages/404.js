import FA from "@fortawesome/react-fontawesome";
import { Container, Heading, LargeButton, Text } from "@hackclub/design-system";
import React, { Fragment } from "react";
import Helmet from "react-helmet";
import Footer from "components/Footer";
import Header from "components/Header";

const ErrorPage = () => (
    <Fragment>
        <Helmet title="404" />
        <Header />
        <Container align="center" maxWidth={48} px={2} py={6} style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "center" }}>
            <Heading.h1 color="primary" f={[5, 6]}>
                404!
            </Heading.h1>
            <Text f={4} mt={2} mb={3} color="muted">
                We couldn’t find that page.
            </Text>
            <LargeButton href="/">Go home <FA icon="home" /></LargeButton>
        </Container>
        <Footer />
    </Fragment>
);

export default ErrorPage;