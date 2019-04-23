/**
 * @providesModule FlySlideView
 * @flow
 */

'use strict';

import React,{Component} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
} from 'react-native';

const FlyBase = require('FlyBase');
const FlyStyles = require('FlyStyles');
const FlyColors = require('FlyColors');
const FlyImage = require('FlyImage');
const FlyDimensions = require('FlyDimensions');
const {Text} = require('FlyText');

const dim = FlyDimensions.deviceDim;
const WINDOW_WIDTH = dim.width;

export type Pager = {
  imgUrl: string;
};

export type Props = {
  viewPagerImgs: Array<Pager>;
};

class FlySlideView extends React.Component {

    props : Props;

    constructor(props) {
      super(props);

      (this: any)._renderPage = this._renderPage.bind(this);
      (this: any)._renderPageIndicator = this._renderPageIndicator.bind(this);
      (this: any)._onAnimationEnd = this._onAnimationEnd.bind(this);

      this.state = {
        currentX: 0,
        activePage: 0,
      };
    }

    _renderPage() {
      if (!this.props.viewPagerImgs) {
        return <View/>
      }
      return this.props.viewPagerImgs.map((item, i) => (
        <FlyImage
          key={i}
          source={item.imgUrl}
          style={styles.page} />
      ));
    }

    _renderPageIndicator() {
      if (!this.props.viewPagerImgs) {
        return <View/>
      }
      let len = this.props.viewPagerImgs.length;

      let activeText = {
        type:'bottom',
        height:FlyDimensions.fontSizeXxxl,
        fontSize:FlyDimensions.fontSizeXxxl,
      };

      let lenText = {
        type:'bottom',
        height:FlyDimensions.fontSizeXxxl,
        fontSize:FlyDimensions.fontSizeLarge,
      };

      return (
        <View style={styles.pageIndicatorWrapper}>
          <View style={styles.pageIndicator}>
            <Text style={styles.textActive} textAlignVertical={activeText}>{this.state.activePage+1}</Text>
            <Text style={styles.textLength} textAlignVertical={lenText}>/{len}</Text>
          </View>
        </View>
      );
    }

    _onAnimationEnd(e) {
      var activePage = e.nativeEvent.contentOffset.x / WINDOW_WIDTH;
      this.setState({
        currentX: e.nativeEvent.contentOffset.x,
        activePage: activePage
      });
    }

    render() {
      return (
        <View style={FlyStyles.container}>
          <ScrollView
            ref='scrollView'
            contentContainerStyle={styles.scrollView}
            automaticallyAdjustContentInsets={false}
            horizontal={true}
            pagingEnabled={true}
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={this._onAnimationEnd}>
            {this._renderPage()}
          </ScrollView>
          {this._renderPageIndicator()}
        </View>
      );
    }
}

var styles = StyleSheet.create({
  scrollView: {
    height: WINDOW_WIDTH,
  },
  page: {
    width: WINDOW_WIDTH,
    height: WINDOW_WIDTH,
  },
  pageIndicatorWrapper: {
    position : 'absolute',
    backgroundColor : 'transparent',
    bottom : 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: WINDOW_WIDTH,
  },
  pageIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 15,
    overflow: 'hidden',
    backgroundColor: FlyColors.baseTextColor2,
  },
  textActive: {
    color: FlyColors.white,
    fontWeight: FlyDimensions.fontWeightBold,
  },
  textLength: {
    color: FlyColors.baseTextColor3,
  }
});

module.exports = FlySlideView;
