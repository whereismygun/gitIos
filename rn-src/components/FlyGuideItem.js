/**
 *
 * @providesModule FlyGuideItem
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
    Easing,
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
const SceneUtils = require('SceneUtils');
const TimerMixin = require('react-timer-mixin');
const {Text} = require('FlyText');

export type Item = {
  Top?: number;
  Left?: number;
  Right?: number;
  Bottom?: number;
  imgTop?: boolean;
  imgUrl?: string;
  maxColor?: string;
  minColor?: string;
};

export type Props = {
  content: Item ;
  nextTimer?: number;
};

class FlyGuideItem extends Component {
    props : Props;

    constructor(props) {
      super(props);

      (this: any).setInterval = TimerMixin.setInterval.bind(this);
      (this: any).clearInterval = TimerMixin.clearInterval.bind(this);

      this.state = {
        fadeAnim: new Animated.Value(30),
        fadeAnim1: new Animated.Value(15),
        opacityAnim: new Animated.Value(0),
        timer: this.props.nextTimer || 40,
      }
    }

    componentDidMount() {
      Animated.timing(
        this.state.opacityAnim,
        {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear // 缓动函数
        }
      ).start();
      this.openAnimated();
    }

    openAnimated() {
      if (this.interval) {
        this.clearInterval(this.interval);
      }
      this.interval = this.setInterval(()=>{
        let countdown = this.state.timer - 1;
        if (countdown % 2 == 1) {
          Animated.timing(
            this.state.fadeAnim,//初始值
            {
              toValue: 40,
              duration: 400,
            }//结束值
          ).start();
          Animated.timing(
            this.state.fadeAnim1,//初始值
            {
              toValue: 20,
              duration: 400,
            }//结束值
          ).start();
        }else {
          Animated.timing(
            this.state.fadeAnim,//初始值
            {
              toValue: 30,
              duration: 400,
            }//结束值
          ).start();
          Animated.timing(
            this.state.fadeAnim1,//初始值
            {
              toValue: 15,
              duration: 400,
            }//结束值
          ).start();
        }
        this.setState({
          timer: countdown,
        })
        if (countdown <= 0) {
          this.clearInterval(this.interval);
        }
      }, 500);
    }

    render() {
      let inside = this.props.content.maxColor || '#FA7459';
      let outer = this.props.content.minColor || '#FFE60E';
      let top = (FlyDimensions.deviceDim.height < 600) ? this.props.content.Top : this.props.content.Top + 30;
      return (
        <Animated.View style={[styles.items,{opacity: this.state.opacityAnim},{top: top,left: 0,bottom: this.props.content.Bottom}]}>
          {(this.props.content.imgTop) ? (
            <FlyImage source={this.props.content.imgUrl} width={FlyDimensions.deviceDim.width * 0.6} style={{marginBottom: -15,marginLeft: 7}}/>
          ) : null}
          <View style={{height: 60,width: 60,justifyContent: 'center',alignItems: 'center'}}>
            <Animated.View style={[{marginLeft: 7,width: this.state.fadeAnim,height: this.state.fadeAnim,backgroundColor: outer,borderRadius: this.state.fadeAnim1,justifyContent: 'center',alignItems: 'center'}]}>
              <View style={[{width: 16,height: 16,backgroundColor: inside,borderRadius: 8,justifyContent: 'center',alignItems: 'center'}]}>
              </View>
            </Animated.View>
          </View>
          {(this.props.content.imgTop) ? null : (
            <FlyImage source={this.props.content.imgUrl} width={FlyDimensions.deviceDim.width * 0.6} style={{marginTop: -15}}/>
          )}
        </Animated.View>
      )
    }

}

var styles = StyleSheet.create({
  items: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: FlyDimensions.deviceDim.width,
    height: 100
  },
});

function select(store) {
    return {

    };
}

module.exports = connect(select)(FlyGuideItem);
