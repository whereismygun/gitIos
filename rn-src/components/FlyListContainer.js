/**
 *
 * @providesModule FlyListContainer
 * @flow
 *
 */
'use strict';
import React,{Component} from 'react';
import {
  StyleSheet,
  Navigator,
  Platform,
  TouchableOpacity,
  NativeModules,
  View,
  Animated,
  Dimensions,
} from 'react-native'


const SceneUtils = require('SceneUtils');

const FlyStyles = require('FlyStyles');
const FlyDimensions = require('FlyDimensions');
const FlyColors = require('FlyColors');
const FlyHeader = require('FlyHeader');
const FlyParallaxBackground = require('FlyParallaxBackground');

import type {Item as HeaderItem} from 'FlyHeader';

type Props = {
  title: string;
  backgroundImage: string;
  backgroundColor: string;
  headerColor: string;
  leftItem?: HeaderItem; // 左按钮
  rightItem?: HeaderItem; // 右按钮
  rightItemStyle?: any;
  otherItem?: HeaderItem; // 右侧另一个按钮
  foreground?: string; // 头部颜色
  maxHeight: number; // 图片完整显示高度
  children: any;
  parallaxContent: any;
};

type State = {
  anim: Animated.Value;
  stickyHeaderHeight: number;
  statusBarStyle: string;
  headTextColor: string;
};

class FlyListContainer extends React.Component {
  props: Props;

  constructor(props: Props) {
    super(props);

    this.state = ({
      anim: new Animated.Value(0),
      stickyHeaderHeight: 0,
      statusBarStyle: null,
      headTextColor: FlyColors.white,
    }: State);

    (this: any).renderFakeHeader = this.renderFakeHeader.bind(this);
    (this: any).renderParallaxContent = this.renderParallaxContent.bind(this);
  }

  render() {
    let child = this.props.children;
    var distance = this.props.maxHeight - this.state.stickyHeaderHeight;
    const content =
        React.cloneElement(child, {
          onScroll: (e) => this.handleScroll(e),
          style: [styles.listView, {
            paddingTop: distance,
          }],
          showsVerticalScrollIndicator: false,
          scrollEventThrottle: 1,
          contentInset: {bottom: FlyDimensions.navHeight - 1, top: 0},
          automaticallyAdjustContentInsets: false,
          renderHeader: this.renderFakeHeader,
        });


    var distance2 = this.props.maxHeight - this.state.stickyHeaderHeight - FlyHeader.height;
    var transform = {
      opacity: this.state.anim.interpolate({
        inputRange: [distance2 - 50, distance2],
        outputRange: [0, 0.9],
        extrapolate: 'clamp',
      })
    };

    var headerBtn;
    if (this.props.leftItem || this.props.rightItem) {
      headerBtn = (
        <FlyHeader
          style={styles.headerBtn}
          foreground={this.props.foreground}
          textColor={this.state.headTextColor}
          leftItem={this.props.leftItem}
          rightItemStyle={this.props.rightItemStyle}
          rightItem={this.props.rightItem}
          otherItem={this.props.otherItem}>
        </FlyHeader>
      );
    }

    return (
      <View style={styles.container}>
        {content}
        <View style={styles.headerWrapper}>
          <FlyParallaxBackground
            minHeight={this.state.stickyHeaderHeight + FlyHeader.height}
            maxHeight={this.props.maxHeight}
            offset={this.state.anim}
            backgroundImage={this.props.backgroundImage}
            backgroundColor={this.props.backgroundColor}>
            {this.renderParallaxContent()}
          </FlyParallaxBackground>
          <FlyHeader
            title={this.props.title}
            style={styles.header}
            transform={transform}
            foreground={this.props.foreground}
            borderBottom={true}
            backgroundColor={this.props.headerColor}>
          </FlyHeader>
          {headerBtn}
        </View>
      </View>
    );
  }

  handleScroll(e: any) {

    try{
      let y = e.nativeEvent.contentOffset.y
      this.state.anim.setValue(y);

      var distance = this.props.maxHeight - this.state.stickyHeaderHeight - FlyHeader.height;
      var style = null;
      var textColor = null;
      if (y > distance - 20) {
        style = 'default';
        textColor = FlyColors.baseTextColor;
      } else {
        style = 'light-content';
        textColor = FlyColors.white;
      }

      var newStates = {};
      var hasChange = false;
      if (this.state.statusBarStyle !== style) {
        SceneUtils.setStatusBarStyle(style, true);
        newStates.statusBarStyle = style;
        hasChange = true;
      }
      if (this.state.headTextColor !== textColor) {
        newStates.headTextColor = textColor;
        hasChange = true;
      }

      if (hasChange) {
        this.setState(newStates);
      }
    } catch (e) {
    }
  }

  renderFakeHeader() {
    return <View />
  }

  renderParallaxContent() {
    return this.props.parallaxContent && this.props.parallaxContent();
  }

}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  header: {
    borderBottomWidth: 0.5,
    borderColor: FlyColors.baseBorderColor,
  },
  headerBtn: {
    position: 'absolute',
    top: 0,
    width: FlyDimensions.deviceDim.width,
  },
  listView: {
    backgroundColor: 'transparent',
    flex:1,
  },
});

module.exports = FlyListContainer;
