/**
 *
 * @providesModule FlyParallaxBackground
 * @flow
 *
 */
'use strict';
import React,{Component} from 'react';
import {
  StyleSheet,
  Navigator,
  TouchableOpacity,
  NativeModules,
  View,
  Animated,
  Dimensions
} from 'react-native';


const FlyStyles = require('FlyStyles');
const Image = require('FlyImage');

const SCREEN_WIDTH = Dimensions.get('window').width;

type Props = {
  maxHeight: number;
  minHeight: number;
  offset: Animated.Value;
  backgroundImage: string;
  backgroundColor: string;
  children: any;
}

class FlyParallaxBackground extends React.Component {
  props: Props;

  constructor(props: Props) {
    super(props);
  }

  render(): ReactElement {
    const {minHeight, maxHeight, offset, backgroundColor} = this.props;
    const height = offset.interpolate({
      inputRange: [0, maxHeight - minHeight],
      outputRange: [maxHeight, minHeight],
      extrapolateRight: 'clamp',
    });

    return (
      <Animated.View style={[styles.container, {height, backgroundColor}]}>
        {this.renderBackgroundImage()}
        {this.renderContent()}
      </Animated.View>
    );
  }

  renderBackgroundImage(): ?ReactElement {
    const {backgroundImage, minHeight, maxHeight, offset} = this.props;
    if (!backgroundImage) {
      return null;
    }

    var imageWidth = SCREEN_WIDTH;

    const length = maxHeight - minHeight;
    const translateY = offset.interpolate({
      inputRange: [0, length / 2, length],
      outputRange: [0, -length / 2, -length / 1.5],
      extrapolate: 'clamp',
    });
    const initialScale = 1; // TODO 未考虑多Tab偏移，造成初始缩放为1时，出现空白
    const scale = offset.interpolate({
      inputRange: [-length, 0],
      outputRange: [2, initialScale],
      extrapolateRight: 'clamp',
    });
    const transforms = { transform: [{translateY}, {scale}] };
    return (
      <Image
        source={backgroundImage}
        isAnimated={true}
        style={[transforms, {width: SCREEN_WIDTH, height: this.props.maxHeight}]}
      />
    );
  }

  renderContent(): ?ReactElement {
    if (React.Children.count(this.props.children) === 0) {
      return null;
    }
    const content = React.Children.only(this.props.children);

    const {minHeight, maxHeight, offset} = this.props;
    const length = maxHeight - minHeight;
    const opacity = offset.interpolate({
      inputRange: [0, length - 40],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    const translateY = offset.interpolate({
      inputRange: [0, length],
      outputRange: [0, -(length / 2)],
      extrapolate: 'clamp',
    });
    const transforms = { opacity, transform: [{translateY}] };

    return (

      <Animated.View
        style={[styles.contentContainer, {width: SCREEN_WIDTH, height: this.props.maxHeight}, transforms]}>
        {content}
      </Animated.View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    overflow: 'hidden',
  },
  contentContainer: {
    position: 'absolute',
    top: 0,
    backgroundColor: 'transparent',
  },
});


module.exports = FlyParallaxBackground;
