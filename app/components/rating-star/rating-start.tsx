import React, { useEffect, useState } from 'react'
import { View } from 'react-native';
import { RatingStartProps } from './rating-start.props';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { TouchableOpacity } from 'react-native-gesture-handler';

export function RatingStart(props: RatingStartProps) {
  const {
    size,
    colorActive,
    colorInActive,
    space = 0,
    countIcon = 5,
    indexActive = 0,
    isHorizontal = false,
    disabled = false,
    onToggle
  } = props

  const [stars, setStars] = useState([])

  const arrayStar = Array(countIcon).fill(null).map((_, idx) => {
    const color = disabled ? (idx < indexActive ? colorActive : colorInActive) : colorInActive
    return {
      id: idx,
      color: color,
    }
  })

  useEffect(() => {
    setStars(arrayStar)
  }, [arrayStar.length])

  const onPress = (index) => {
    const newArrayStart = stars.map(star => {
      return {
        id: star.id,
        color: star.id <= index ? colorActive : colorInActive
      }
    })
    setStars(newArrayStart)
    onToggle(index + 1)
  }

  const direction = isHorizontal ? 'row' : 'column'

  return (
    <View style={{ flexDirection: direction }}>
      {stars?.map((star, index) => {
        return (
          <TouchableOpacity
            key={index}
            activeOpacity={1}
            style={{
              paddingHorizontal: space
            }}
            onPress={() => !disabled ? onPress(index) : null}
          >
            <MaterialCommunityIcons name={'star'} size={size} color={star.color} />
          </TouchableOpacity>
        )
      })}
    </View>
  )
}
