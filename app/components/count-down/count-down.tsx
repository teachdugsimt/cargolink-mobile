import React from 'react';
import PropTypes from 'prop-types';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  AppState
} from 'react-native';
import { CountDownProps } from './count-down.props';
import { sprintf } from 'sprintf-js';

const DEFAULT_DIGIT_STYLE = { backgroundColor: '#FAB913' };
const DEFAULT_DIGIT_TXT_STYLE = { color: '#000' };
const DEFAULT_TIME_LABEL_STYLE = { color: '#000' };
const DEFAULT_SEPARATOR_STYLE = { color: '#000' };
const DEFAULT_TIME_TO_SHOW = ['DD', 'HH', 'MM', 'SS'];
const DEFAULT_TIME_LABELS = {
  d: 'Days',
  h: 'Hours',
  m: 'Minutes',
  s: 'Seconds',
};

class CountDown extends React.Component<CountDownProps> {
  static propTypes = {
    id: PropTypes.string,
    digitStyle: PropTypes.object,
    digitTxtStyle: PropTypes.object,
    timeLabelStyle: PropTypes.object,
    separatorStyle: PropTypes.object,
    timeToShow: PropTypes.array,
    showSeparator: PropTypes.bool,
    size: PropTypes.number,
    until: PropTypes.number,
    onChange: PropTypes.func,
    onPress: PropTypes.func,
    onFinish: PropTypes.func,
  };

  state = {
    until: Math.max(this.props.until, 0),
    lastUntil: null,
    wentBackgroundAt: null,
  };

  constructor(props) {
    super(props);
    this.timer = setInterval(this.updateTimer, 1000);
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.until !== prevProps.until || this.props.id !== prevProps.id) {
      this.setState({
        lastUntil: prevState.until,
        until: Math.max(prevProps.until, 0)
      });
    }
  }

  _handleAppStateChange = currentAppState => {
    const { until, wentBackgroundAt } = this.state;
    if (currentAppState === 'active' && wentBackgroundAt && this.props.running) {
      const diff = (Date.now() - wentBackgroundAt) / 1000.0;
      this.setState({
        lastUntil: until,
        until: Math.max(0, until - diff)
      });
    }
    if (currentAppState === 'background') {
      this.setState({ wentBackgroundAt: Date.now() });
    }
  }

  getTimeLeft = () => {
    const { until } = this.state;
    return {
      seconds: until % 60,
      minutes: (until / 60) % 60,
      hours: (until / (60 * 60)) % 24,
      days: until / (60 * 60 * 24),
    };
  };

  updateTimer = () => {
    // Don't fetch these values here, because their value might be changed
    // in another thread
    // const {lastUntil, until} = this.state;

    if (this.state.lastUntil === this.state.until || !this.props.running) {
      return;
    }
    if (this.state.until === 1 || (this.state.until === 0 && this.state.lastUntil !== 1)) {
      if (this.props.onFinish) {
        this.props.onFinish();
      }
      if (this.props.onChange) {
        this.props.onChange(this.state.until);
      }
    }

    if (this.state.until === 0) {
      this.setState({ lastUntil: 0, until: 0 });
    } else {
      if (this.props.onChange) {
        this.props.onChange(this.state.until);
      }
      this.setState({
        lastUntil: this.state.until,
        until: Math.max(0, this.state.until - 1)
      });
    }
  };

  renderDigit = (d) => {
    const { digitStyle, digitTxtStyle, size } = this.props;
    return (
      <View style={[
        styles.digitCont,
        // { width: size * 2, height: size * 2 },
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

  renderLabel = label => {
    const { timeLabelStyle, size } = this.props;
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

  renderDoubleDigits = (label, digits) => {
    return (
      <View style={styles.doubleDigitCont}>
        <View style={styles.timeInnerCont}>
          {this.renderDigit(digits)}
        </View>
        {this.renderLabel(label)}
      </View>
    );
  };

  renderSeparator = () => {
    const { separatorStyle, size } = this.props;
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Text style={[
          styles.separatorTxt,
          { fontWeight: "bold" },
          separatorStyle,
        ]}>
          {':'}
        </Text>
      </View>
    );
  };

  getDigitTime = (digit, timeNeedded) => {
    // timeNeeded => days, hours, minutes, seconds
    const timeRef = this.getTimeLeft();
    const newTime = sprintf(`%0${digit}d`, timeRef[timeNeedded]).split(':');
    return newTime
  }

  renderCountDown = () => {
    const { timeToShow, timeLabels, showSeparator } = this.props;
    const Component = this.props.onPress ? TouchableOpacity : View;
    const digitOfDay = timeToShow.includes('DD') ? 2 : (timeToShow.includes('D') ? 1 : null)
    const digitOfHour = timeToShow.includes('HH') ? 2 : (timeToShow.includes('H') ? 1 : null)
    const digitOfMin = timeToShow.includes('MM') ? 2 : (timeToShow.includes('M') ? 1 : null)
    const digitOfSec = timeToShow.includes('SS') ? 2 : (timeToShow.includes('S') ? 1 : null)
    return (
      <Component
        style={styles.timeCont}
        onPress={this.props.onPress}
      >
        {digitOfDay ? this.renderDoubleDigits(timeLabels.d, this.getDigitTime(digitOfDay, 'days')) : null}
        {showSeparator && digitOfDay && digitOfHour ? this.renderSeparator() : null}
        {digitOfHour ? this.renderDoubleDigits(timeLabels.h, this.getDigitTime(digitOfHour, 'hours')) : null}
        {showSeparator && digitOfHour && digitOfMin ? this.renderSeparator() : null}
        {digitOfMin ? this.renderDoubleDigits(timeLabels.m, this.getDigitTime(digitOfMin, 'minutes')) : null}
        {showSeparator && digitOfMin && digitOfSec ? this.renderSeparator() : null}
        {digitOfSec ? this.renderDoubleDigits(timeLabels.s, this.getDigitTime(digitOfSec, 'seconds')) : null}
      </Component>
    );
  };

  render() {
    return (
      <View style={this.props.style}>
        {this.renderCountDown()}
      </View>
    );
  }
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
    color: '#000',
    // marginVertical: 2,
    backgroundColor: 'transparent',
  },
  timeInnerCont: {
    // flexDirection: 'row',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  digitCont: {
    // borderRadius: 5,
    // marginHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doubleDigitCont: {
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  digitTxt: {
    color: '#000',
    // fontWeight: 'bold',
    fontVariant: ['tabular-nums']
  },
  separatorTxt: {
    backgroundColor: 'transparent',
    // fontWeight: 'bold',
  },
});

export default CountDown;
export { CountDown };
