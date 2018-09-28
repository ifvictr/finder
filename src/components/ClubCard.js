import FA from '@fortawesome/react-fontawesome'
import { Box, Card, Flex, Heading, Link, Text } from '@hackclub/design-system'
import axios from 'axios'
import geolib from 'geolib'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styled, { css } from 'styled-components'
import { schoolImagePath } from 'data.json'

const Base = styled(Flex)`
  padding: ${({ theme }) => theme.space[2]}px;
  text-align: left;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 50%;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    width: 33.3333%;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    width: 25%;
  }
`

const Inner = styled(Card.withComponent(Flex)).attrs({
  bg: 'snow',
  boxShadowSize: 'sm',
  flexDirection: 'column'
})`
  border-radius: ${({ theme }) => theme.radius};
  position: relative;
  transition: box-shadow ${({ theme }) => theme.transition},
    transform ${({ theme }) => theme.transition};
  width: 100%;
  will-change: box-shadow, transform;
  &:hover {
    box-shadow: ${({ theme }) => theme.boxShadows[2]};
    transform: scale(1.02);
  }
`

const DistanceLabel = styled(Text.span).attrs({
  children: props => {
    const system = props.imperial ? 'mi' : 'km'
    return `${geolib.convertUnit(system, props.distance, 1)} ${system} away`
  },
  color: 'white',
  p: 2
})`
  background: rgba(0, 0, 0, 0.25);
  border-radius: ${({ theme }) => theme.radius} 0 ${({ theme }) => theme.radius}
    0;
  position: absolute;
  text-shadow: rgba(0, 0, 0, 0.32) 0px 1px 4px;
  z-index: 1;
`

const Photo = styled(Box).attrs({
  style: props => ({
    backgroundImage: `url(${props.src})`
  })
})`
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: ${({ theme }) => theme.radius} ${({ theme }) => theme.radius} 0
    0;
  display: block;
  margin: 0;
  padding-top: 66.6666%;
  position: relative;
  transition: transform ${({ theme }) => theme.transition};
  will-change: transform;
  &:before {
    background-color: ${({ theme }) => theme.colors.snow};
    background-image: url(/placeholder.svg);
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    content: '';
    display: block;
    height: 100%;
    left: 0;
    opacity: ${props => (!props.ready ? 0.25 : 0)};
    position: absolute;
    right: 0;
    top: 0;
    transition: opacity ${({ theme }) => theme.transition};
    width: 100%;
    will-change: opacity;
  }
  ${props =>
    props.ready &&
    css`
      ${Inner}:hover & {
        transform: scale(1.08);
      }
    `};
`

const Actions = styled(Flex).attrs({
  flexDirection: 'row',
  justify: 'center',
  wrap: true
})``

const Action = styled(Box.withComponent(Link)).attrs({
  align: 'center',
  children: props => <FA icon={props.icon} />,
  color: 'primary',
  p: 3,
  target: '_blank'
})`
  flex-basis: 25%;
  flex-grow: 1;
  opacity: ${props => (props.available ? 1 : 0.25)};
`

class ClubCard extends Component {
  state = { ready: false }

  async componentDidMount() {
    const { status } = await axios.get(
      `${schoolImagePath}/${this.props.data.id}.jpg`
    )
    if (status === 200) {
      this.setState({ ready: true })
    }
  }

  render() {
    const { data, distance, useImperialSystem } = this.props
    const { ready } = this.state
    const isDistanceSet = distance !== undefined
    return (
      <Base>
        <Inner>
          {isDistanceSet && (
            <DistanceLabel distance={distance} imperial={useImperialSystem} />
          )}
          <Box style={{ borderRadius: '4px 4px 0 0', overflow: 'hidden' }}>
            <Photo src={`${schoolImagePath}/${data.id}.jpg`} ready={ready} />
          </Box>
          <Flex
            flexDirection="column"
            justify="space-around"
            p={3}
            style={{ flex: 1 }}
          >
            <Heading.h4
              regular={false}
              bold
              style={{ textTransform: 'capitalize' }}
            >
              {data.name}
            </Heading.h4>
            <Text pt={2}>{data.address}</Text>
          </Flex>
          <Actions>
            <Action
              href={`https://www.google.com/maps/place/${encodeURI(
                data.address
              )}`}
              icon="map"
              available
            />
            <Action icon="comment-alt" />
            <Action icon="link" />
          </Actions>
        </Inner>
      </Base>
    )
  }
}

ClubCard.propTypes = {
  data: PropTypes.object.isRequired,
  distance: PropTypes.number,
  useImperialSystem: PropTypes.bool
}

export default ClubCard
