import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  ViewStyle,
  TextStyle
} from 'react-native';
import { CountDownProps } from './count-down.props';
import { sprintf } from 'sprintf-js';
import { Text } from "../text/text";

const TIME_COUNT: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'center',
}
const TIME_TXT: TextStyle = {
  backgroundColor: 'transparent',
}
const TIME_INNER_COUNT: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
}
const DIGIT_COUNT: ViewStyle = {
  alignItems: 'center',
  justifyContent: 'center',
}
const DOUBLE_DIGIT_COUNT: ViewStyle = {
  justifyContent: 'center',
  alignItems: 'center',
}
const DIGIT_TXT: TextStyle = {
  color: '#000',
  fontVariant: ['tabular-nums']
}
const SEPARATOR_TXT: TextStyle = {
  backgroundColor: 'transparent',
}

let clockCall = null

export function CountDown(props: CountDownProps) {

  const [until, setUntil] = useState(Math.max(props.until, 0))

  const getTimeLeft = () => {
    return {
      seconds: until % 60,
      minutes: (until / 60) % 60,
      hours: (until / (60 * 60)) % 24,
      days: until / (60 * 60 * 24),
    };
  };

  const renderDigit = (digit: Array<string>) => {
    const { digitStyle, digitTxtStyle, size } = props;
    const style = { ...DIGIT_COUNT, ...digitStyle }
    return (
      <View style={style}>
        <Text style={[
          DIGIT_TXT,
          { fontSize: size },
          digitTxtStyle,
        ]}>
          {digit}
        </Text>
      </View>
    );
  };

  const renderLabel = (label: string) => {
    const { timeLabelStyle, size } = props;
    if (label) {
      return (
        <Text style={[
          TIME_TXT,
          { fontSize: size / 1.8 },
          timeLabelStyle,
        ]}>
          {label}
        </Text>
      );
    }
  };

  const renderDoubleDigits = (label: string, digits: Array<string>) => {
    return (
      <View style={DOUBLE_DIGIT_COUNT}>
        <View style={TIME_INNER_COUNT}>
          {renderDigit(digits)}
        </View>
        {renderLabel(label)}
      </View>
    );
  };

  const renderSeparator = () => {
    const { separatorStyle } = props;
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Text style={[
          SEPARATOR_TXT,
          { fontWeight: "bold" },
          separatorStyle,
        ]}>
          {':'}
        </Text>
      </View>
    );
  };

  const getDigitTime = (digit: number, timeNeedded: string) => {
    const timeRef = getTimeLeft();
    const newTime = sprintf(`%0${digit}d`, timeRef[timeNeedded]).split(':');
    const resultTime = newTime[0] && Number(newTime[0]) ? newTime : '00'
    return resultTime
  }

  const renderCountDown = () => {
    const { timeToShow, timeLabels, showSeparator } = props;
    const digitOfDay = timeToShow.includes('DD') ? 2 : (timeToShow.includes('D') ? 1 : null)
    const digitOfHour = timeToShow.includes('HH') ? 2 : (timeToShow.includes('H') ? 1 : null)
    const digitOfMin = timeToShow.includes('MM') ? 2 : (timeToShow.includes('M') ? 1 : null)
    const digitOfSec = timeToShow.includes('SS') ? 2 : (timeToShow.includes('S') ? 1 : null)
    return (
      <TouchableOpacity
        style={TIME_COUNT}
        onPress={props.onPress}
      >
        {digitOfDay ? renderDoubleDigits(timeLabels.d, getDigitTime(digitOfDay, 'days')) : null}
        {showSeparator && digitOfDay && digitOfHour ? renderSeparator() : null}
        {digitOfHour ? renderDoubleDigits(timeLabels.h, getDigitTime(digitOfHour, 'hours')) : null}
        {showSeparator && digitOfHour && digitOfMin ? renderSeparator() : null}
        {digitOfMin ? renderDoubleDigits(timeLabels.m, getDigitTime(digitOfMin, 'minutes')) : null}
        {showSeparator && digitOfMin && digitOfSec ? renderSeparator() : null}
        {digitOfSec ? renderDoubleDigits(timeLabels.s, getDigitTime(digitOfSec, 'seconds')) : null}
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    startTimer()
    return () => {
      clearInterval(clockCall)
    }
  }, [])

  useEffect(() => {
    if (until === 0) {
      clearInterval(clockCall)
      props.onFinish()
    }
  }, [until])

  const startTimer = () => {
    clockCall = setInterval(() => {
      setUntil(prevTime => prevTime - 1)
    }, 1000);
  }

  return (
    <View style={props.style}>
      {renderCountDown()}
    </View>
  );
}