import FA from '@fortawesome/react-fontawesome'
import { Container, Heading, LargeButton, Text } from '@hackclub/design-system'
import React, { Fragment } from 'react'
import Helmet from 'react-helmet'

const NotFound = () => (
    <Fragment>
        <Helmet title="404" />
        <Container maxWidth={48}>
            <Heading.h1 color="primary" f={[5, 6]}>
                404!
            </Heading.h1>
            <Text f={4} mt={2} mb={3} color="muted">
                We couldn’t find that page.
            </Text>
            <LargeButton href="/">
                Go home <FA icon="home" />
            </LargeButton>
        </Container>
    </Fragment>
)

export default NotFound