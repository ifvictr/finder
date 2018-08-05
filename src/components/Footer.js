import FA from '@fortawesome/react-fontawesome'
import { Flex, Link, Text, colors } from '@hackclub/design-system'
import React from 'react'

const Base = Flex.withComponent('footer').extend.attrs({
    bg: 'snow',
    justify: 'center',
    p: 4
})`
    background-image: url(/pattern.svg);
    background-size: 20rem;
`

const Footer = () => (
    <Base>
        <Text align="center" f={3}>
            Made with <FA icon="code" color={colors.info} /> and <FA icon="heart" color={colors.primary} /> by{' '}
            <Link href="https://ifvictr.com" target="_blank">
                Victor Truong
            </Link>
        </Text>
    </Base>
)

export default Footer