/**
 *
 * @providesModule FlyGuideModal
 * @flow
 *
 */
'use strict';
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Alert,
    TouchableOpacity,
    Navigator,
    TextInput,
    Animated,
    InteractionManager,
    DeviceEventEmitter,
} from 'react-native';

import {connect} from 'react-redux';

const Utils = require('Utils');

const FlyStyles = require('FlyStyles');
const FlyColors = require('FlyColors');
const FlyIconfonts = require('FlyIconfonts');
const FlyDimensions = require('FlyDimensions');
const FlyImage = require('FlyImage');
const env = require('env');
const FlyGuideItem = require('FlyGuideItem');
const SceneUtils = require('SceneUtils');
const TimerMixin = require('react-timer-mixin');
const {Text} = require('FlyText');

export type Props = {
  content: Array < Item > ;
  nextTimer?: number;
};

class FlyGuideModal extends Component {
    props : Props;

    constructor(props) {
      super(props);

      (this: any).setInterval = TimerMixin.setInterval.bind(this);
      (this: any).clearInterval = TimerMixin.clearInterval.bind(this);

      this.state = {
        fadeAnim: new Animated.Value(60),
        fadeAnim1: new Animated.Value(30),
        timer: this.props.nextTimer || 4,
        selectIndex: 0,
      }
    }

    componentDidMount() {
      InteractionManager.runAfterInteractions(() => {
        this.openAnimated()
      });
    }

    openAnimated() {
      if (this.interval) {
        this.clearInterval(this.interval);
      }
      this.interval = this.setInterval(()=>{
        let countdown = this.state.timer - 1;

        this.setState({
          timer: countdown,
        })
        if (countdown <= 0) {
          this.clearInterval(this.interval);
          this.setState({
            timer: this.props.nextTimer || 6,
            selectIndex: this.state.selectIndex + 1
          })
          if (this.state.selectIndex == this.props.content.length) {
            this.props.closeGuide();
          }else {
            this.openAnimated();
          }
        }
      }, 500);
    }

    contentView() {
      let Guide = this.props.content.map((item, index) => {
        if (this.state.selectIndex == index) {
          return (
            <FlyGuideItem content={item}/>
          )
        }else {
          return null;
        }
      })
      return Guide;
    }

    render() {

      return (
        <TouchableOpacity style={styles.shareWrapper} activeOpacity={1} onPress={() => {
            if (this.interval) {
              this.clearInterval(this.interval);
            }
            this.setState({
              selectIndex: this.state.selectIndex + 1,
              timer: this.props.nextTimer || 6,
            });
            if (this.state.selectIndex + 1 == this.props.content.length) {
              this.props.closeGuide();
            }else {
              this.openAnimated();
            }
          }}>
          {this.contentView()}
        </TouchableOpacity>
      )
    }

}

var styles = StyleSheet.create({
  shareWrapper: {
    flex: 1,
    flexDirection: 'column',
  },
});

function select(store) {
    return {

    };
}

module.exports = connect(select)(FlyGuideModal);
