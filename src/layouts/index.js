import fontAwesome from '@fortawesome/fontawesome'
import brands from '@fortawesome/fontawesome-free-brands'
import solid from '@fortawesome/fontawesome-free-solid'
import { Container, Flex, ThemeProvider, colors } from '@hackclub/design-system'
import PropTypes from 'prop-types'
import React from 'react'
import Helmet from 'react-helmet'
import { injectGlobal } from 'styled-components'
import Footer from 'components/Footer'
import Header from 'components/Header'
import { description, name, title, url } from 'data.json'

fontAwesome.library.add(brands, solid) // Pre-register icons for easier reference

// Fix body width if scrollbar is present
injectGlobal`
    body {
        width: 100%;
    }
`

const DefaultLayout = ({ children }) => (
    <ThemeProvider webfonts>
        <Helmet
            defaultTitle={`${title} — Hack Club Finder`}
            titleTemplate="%s — Hack Club Finder"
            meta={[
                { charSet: 'utf-8' },
                { name: 'description', content: description },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                { name: 'theme-color', content: colors.primary },
                { name: 'twitter:card', content: 'summary_large_image' },
                { name: 'twitter:description', content: description },
                { name: 'twitter:domain', content: url },
                { name: 'twitter:image:src', content: '' },
                { name: 'twitter:title', content: title },
                { property: 'og:description', content: description },
                { property: 'og:image', content: '' },
                { property: 'og:image:height', content: 512 },
                { property: 'og:image:width', content: 512 },
                { property: 'og:locale', content: 'en_US' },
                { property: 'og:site_name', content: name },
                { property: 'og:title', content: title },
                { property: 'og:type', content: 'website' },
                { property: 'og:url', content: url }
            ]}
        />
        <Flex flexDirection="column" style={{ minHeight: '100vh' }}>
            <Header />
            <Container
                align="center"
                color="black"
                px={3}
                pb={4}
                w={1}
                style={{
                    display: 'flex',
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}
            >
                {children()}
            </Container>
            <Footer />
        </Flex>
    </ThemeProvider>
)

DefaultLayout.propTypes = {
    children: PropTypes.func
}

export default DefaultLayout