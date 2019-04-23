/**
 * @providesModule FlyFlyer
 * @flow
 * 飞行组件
 */

'use strict';

import React,{Component} from 'react';
import {
  TouchableHighlight,
  View,
  StyleSheet,
  Animated,
} from 'react-native'


import Easing from 'Easing';

const FlyStyles = require('FlyStyles');
const Image = require('FlyImage');

export type Props = {
    source: string; // 图片资源
    start: Object;
    end: Object;
    vertexRtop: number;
    duration: number;
};

class FlyFlyer extends React.Component {

    props : Props;

    constructor(props) {
      super(props);

      this.state = {
        isShow: false,
        translateX: new Animated.Value(0),
        translateY: new Animated.Value(0),
        scale: new Animated.Value(0),
      }
    }

    play() {

      this.state.translateX.setValue(0);
      this.state.translateY.setValue(0);
      this.state.scale.setValue(0);

      this.setState({
        isShow: true,
      });

      let that = this;

      let duration = this.props.duration || 500;

      Animated.parallel([
        Animated.timing(this.state.translateX, {
          duration: duration,
          toValue: 1
        }),
        Animated.timing(this.state.translateY, {
          duration: duration,
          easing: Easing.bezier(.26,.1,.27,.77),
          toValue: 1,
        }),
        Animated.timing(this.state.scale, {
          duration: duration,
          toValue: 1
        }),
      ]).start((data) => {
        that.setState({
          isShow: false,
        });
      });
    }

    render() {

      let start = this.props.start,
          end = this.props.end,
          vertexRtop = this.props.vertexRtop;

      let moveX = end.left - start.left,
          moveXCenter = moveX / 2,
          endY = end.top - start.top,
          s = end.width / start.width;

      let translateX = this.state.translateX.interpolate({
        inputRange: [0, 1],
        outputRange: [0, moveX],
        extrapolate: 'clamp',
      });

      let translateY = null;

      if (vertexRtop) {
          let topY = vertexRtop - start.top;
          translateY = this.state.translateY.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, topY, endY],
            extrapolate: 'clamp',
          });
      } else {
          translateY = this.state.translateY.interpolate({
            inputRange: [0, 1],
            outputRange: [0, endY],
            extrapolate: 'clamp',
          });
      }

      let scale = this.state.scale.interpolate({
        inputRange: [0, 1],
        outputRange: [1, s],
        extrapolateRight: 'clamp',
      });

      if (this.state.isShow) {
        return (
          <Image
            source={this.props.source}
            isAnimated={true}
            style={[
              {transform: [ {translateX}, {translateY}, {scale} ]},
              styles.wrapper,
              this.props.start]}
          />
        );
      } else {
        return (
          <View/>
        );
      }


    }
}

var styles = StyleSheet.create({
    wrapper: {
      position: 'absolute',
    }
});

module.exports = FlyFlyer;
