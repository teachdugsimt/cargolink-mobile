import React, { useEffect, useRef, useState } from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  AppState
} from 'react-native';
import { sprintf } from 'sprintf-js';
import { CountDownProps } from './count-down.props';

const DEFAULT_DIGIT_STYLE = { backgroundColor: '#FAB913' };
const DEFAULT_DIGIT_TXT_STYLE = { color: '#000' };
const DEFAULT_TIME_LABEL_STYLE = { color: '#000' };
const DEFAULT_SEPARATOR_STYLE = { color: '#000' };
const DEFAULT_TIME_TO_SHOW = ['D', 'H', 'M', 'S'];
const DEFAULT_TIME_LABELS = {
  d: 'Days',
  h: 'Hours',
  m: 'Minutes',
  s: 'Seconds',
};

export function CountDown(props: CountDownProps) {
  const updateTimer = () => {
    if (lastUntil === until || !props.running) {
      return;
    }
    if (until === 1 || (until === 0 && lastUntil !== 1)) {
      if (props.onFinish) {
        props.onFinish();
      }
      if (props.onChange) {
        props.onChange(until);
      }
    }

    if (until === 0) {
      setLastUntil(0);
      setUntil(0)
    } else {
      if (props.onChange) {
        props.onChange(until);
      }
      setLastUntil(until)
      setUntil(Math.max(0, until - 1))
    }
  };

  const _handleAppStateChange = currentAppState => {
    if (currentAppState === 'active' && wentBackgroundAt && props.running) {
      const diff = (Date.now() - wentBackgroundAt) / 1000.0;
      setLastUntil(until)
      setUntil(Math.max(0, until - diff))
    }
    if (currentAppState === 'background') {
      setWentBackgroundAt(Date.now())
    }
  }

  const getTimeLeft = () => {
    return {
      seconds: until % 60,
      minutes: until / 60 % 60,
      hours: until / (60 * 60) % 24,
      days: until / (60 * 60 * 24),
    };
  };

  const renderDigit = (d) => {
    const { digitStyle, digitTxtStyle, size } = props;
    return (
      <View style={[
        styles.digitCont,
        { width: size * 2.3, height: size * 2.6 },
        digitStyle,
      ]}>
        <Text style={[
          styles.digitTxt,
          { fontSize: size },
          digitTxtStyle,
        ]}>
          {d}
        </Text>
      </View>
    );
  };

  const renderLabel = label => {
    const { timeLabelStyle, size } = props;
    if (label) {
      return (
        <Text style={[
          styles.timeTxt,
          { fontSize: size / 1.8 },
          timeLabelStyle,
        ]}>
          {label}
        </Text>
      );
    }
  };

  const renderDoubleDigits = (label, digits) => {
    return (
      <View style={styles.doubleDigitCont}>
        <View style={styles.timeInnerCont}>
          {renderDigit(digits)}
        </View>
        {renderLabel(label)}
      </View>
    );
  };

  const renderSeparator = () => {
    const { separatorStyle, size } = props;
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Text style={[
          styles.separatorTxt,
          { fontSize: size * 1.2 },
          separatorStyle,
        ]}>
          {':'}
        </Text>
      </View>
    );
  };

  const renderCountDown = () => {
    const { timeToShow, timeLabels, showSeparator } = props;
    const { days, hours, minutes, seconds } = getTimeLeft();
    const newTime = sprintf('%02d:%02d:%02d:%02d', days, hours, minutes, seconds).split(':');

    return (
      <React.Component
        style={styles.timeCont}
        onPress={props.onPress}
      >
        {timeToShow.includes('D') ? renderDoubleDigits(timeLabels.d, newTime[0]) : null}
        {showSeparator && timeToShow.includes('D') && timeToShow.includes('H') ? renderSeparator() : null}
        {timeToShow.includes('H') ? renderDoubleDigits(timeLabels.h, newTime[1]) : null}
        {showSeparator && timeToShow.includes('H') && timeToShow.includes('M') ? renderSeparator() : null}
        {timeToShow.includes('M') ? renderDoubleDigits(timeLabels.m, newTime[2]) : null}
        {showSeparator && timeToShow.includes('M') && timeToShow.includes('S') ? renderSeparator() : null}
        {timeToShow.includes('S') ? renderDoubleDigits(timeLabels.s, newTime[3]) : null}
      </React.Component>
    );
  };

  const [until, setUntil] = useState<number>(Math.max(props.until, 0))
  const [lastUntil, setLastUntil] = useState<any>(null)
  const [wentBackgroundAt, setWentBackgroundAt] = useState<any>(null)
  const [timer, setTimer] = useState<any>(setInterval(updateTimer, 1000))

  const usePrevious = value => {
    const ref = useRef<CountDownProps>(props);
    console.log('ref :>> ', ref);
    useEffect(() => {
      ref.until = value.until;
      ref.id = value.id;
    });
    return ref;
  }

  useEffect(() => {
    const { until, id } = props
    const prevProps = {}
    if (props.until !== prevProps.until || props.id !== prevProps.id) {
      setLastUntil(until)
      setUntil(Math.max(prevProps.until, 0))
    }

    AppState.addEventListener('change', _handleAppStateChange);
    return () => {
      clearInterval(timer);
      AppState.removeEventListener('change', _handleAppStateChange);
    }
  })

  return (
    <View style={props.style}>
      {/* {renderCountDown()} */}
      <Text>Hello world</Text>
    </View>
  );
}

CountDown.defaultProps = {
  digitStyle: DEFAULT_DIGIT_STYLE,
  digitTxtStyle: DEFAULT_DIGIT_TXT_STYLE,
  timeLabelStyle: DEFAULT_TIME_LABEL_STYLE,
  timeLabels: DEFAULT_TIME_LABELS,
  separatorStyle: DEFAULT_SEPARATOR_STYLE,
  timeToShow: DEFAULT_TIME_TO_SHOW,
  showSeparator: false,
  until: 0,
  size: 15,
  running: true,
};

const styles = StyleSheet.create({
  timeCont: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  timeTxt: {
    color: 'white',
    marginVertical: 2,
    backgroundColor: 'transparent',
  },
  timeInnerCont: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  digitCont: {
    borderRadius: 5,
    marginHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doubleDigitCont: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  digitTxt: {
    color: 'white',
    fontWeight: 'bold',
    fontVariant: ['tabular-nums']
  },
  separatorTxt: {
    backgroundColor: 'transparent',
    fontWeight: 'bold',
  },
});

export default CountDown;
// export { CountDown };
