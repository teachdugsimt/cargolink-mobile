import React from 'react'
import { Text } from '../text/text'

export const HeaderCenter = (props: any) => {
  const { tx, text, ...rest } = props

  const textProps = tx ? { tx } : { text }

  return (<Text {...textProps} {...rest} preset="topic" />)
}

