/**
 * @providesModule FlyTimerButton
 * @flow
 */

'use strict';

import React,{Component} from 'react';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
} from 'react-native';

import TimerMixin from 'react-timer-mixin';

const FlyBase = require('FlyBase');
const FlyColors = require('FlyColors');
const FlyDimensions = require('FlyDimensions');
const {Text} = require('FlyText');
const FlyButton = require('FlyButton');

export type Props = {
  text: string;
  style: any;
  countdown: number;
  autoStart: boolean;
  onPressStart: () => Void;
  onPressCancel: () => Void;
  type:string;
  isDisable:boolean;
  details?:string;
  cancelText?: string;
};

class FlyTimerButton extends Component {
  props : Props;

  static defaultProps = {
    countdown: 60,
  };

  constructor(props) {
    super(props);

    (this: any).start = this.start.bind(this);
    (this: any).cancel = this.cancel.bind(this);

    (this: any).setInterval = TimerMixin.setInterval.bind(this);
    (this: any).clearInterval = TimerMixin.clearInterval.bind(this);

    this.state = {
      status: 'inactive', // inactive, active
      text: props.text,
      countdown: props.countdown,
    };
  }

  start(skipFn) {

    if (this.props.onPressStart && !skipFn) {
      this.props.onPressStart();
    }

    this.setState({
      countdown: this.props.countdown,
      status: 'active'
    });

    if (this.interval) {
      this.clearInterval(this.interval);
    }

    this.interval = this.setInterval(()=>{
      let countdown = this.state.countdown - 1;
      let details = this.props.details  || "";
      this.setState({
        countdown: countdown,
        text: details + countdown + '秒',
      });
      if (countdown <= 0) {
        this.cancel();
      }
    }, 1000);
  }

  cancel(skipFn) {

    if (this.props.onPressCancel && !skipFn) {
      this.props.onPressCancel();
    }

    if (this.interval) {
      this.clearInterval(this.interval);
    }

    this.setState({
      text:  this.props.cancelText || '重新获取',
      status: 'inactive'
    });

  }

  render() {

    let {
      text,
      style,
      autoStart,
      countdown,
      startSelf,
      ...props
    } = this.props;

    if (autoStart && this.state.status === 'inactive') {
      this.start();
    }

    let type = this.props.type || 'primary';
    let size = this.props.size || 'sm';
    if(!startSelf){
      return (
        <FlyButton {...props}
          onPress={()=>{
            this.start();
          }}
          style={style}
          text={this.state.text}
          type={type}
          size={size}
          disabled={this.state.status === 'active'} />
      );
    }else {
      return (
        <FlyButton {...props}
          style={style}
          text={this.state.text}
          type={type}
          size={size}
          disabled={this.state.status === 'active'} />
      );
    }
  }
}

const styles = StyleSheet.create({

});

module.exports = FlyTimerButton;
