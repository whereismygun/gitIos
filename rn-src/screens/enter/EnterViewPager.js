/**
 *
 *
 * @flow
 *
 */
'use strict';

import React from 'react';

import ReactNative, {
  StyleSheet,
  View,
  ScrollView,
  Navigator,
  InteractionManager,
  TouchableOpacity
} from 'react-native';

var {connect} = require('react-redux');

var TimerMixin = require('react-timer-mixin');

var FlyStyles = require('FlyStyles');
var FlyImage = require('FlyImage');
var FlyColors = require('FlyColors');
var FlyDimensions = require('FlyDimensions');
const {Text} = require('FlyText');
const SceneUtils = require('SceneUtils');
const Filters = require('Filters');
const EnterNavigationBar = require('./EnterNavigationBar');
import type { ViewPagerImg } from '../../reducers/enter';

var {
  loadEnterViewPagerImgs,
} = require('../../actions');

const DEFAULT_SIZE = {
  width: 640,
  height: 340,
};

const WINDOW_WIDTH = FlyDimensions.deviceDim.width;

type Props = {
  navigator: Navigator;
  info: Object;
  viewPagerImgs: Array<ViewPagerImg>;
};

class EnterViewPager extends React.Component {

  props: Props;

  constructor(props) {
    super(props);

    (this: any)._start = this._start.bind(this);
    (this: any)._onAnimationEnd = this._onAnimationEnd.bind(this);
    (this: any)._renderPageIndicator = this._renderPageIndicator.bind(this);
    (this: any).setInterval = TimerMixin.setInterval.bind(this);
    (this: any).clearInterval = TimerMixin.clearInterval.bind(this);

    this.state = {
      currentX: 0,
      activePage: 0,
      timer : 5000,
    };
  }

  _start(props) {
    let scrollView = this.refs.scrollView;
    let length = props.viewPagerImgs.length;

    if (this.timerFn) {
        this.clearInterval(this.timerFn);
    }

    this.timerFn = this.setInterval(function(){
      let activePage;
      if( (this.state.activePage + 1)  >= length){
          activePage = 0;
      }else{
          activePage = this.state.activePage + 1;
      }
      let currentX = WINDOW_WIDTH * activePage;
      scrollView.scrollResponderScrollTo({
        x: currentX,
        y: 0,
        animated: true,
      });
    }, this.state.timer);
  }

  componentDidMount() {
    let that = this;
    InteractionManager.runAfterInteractions(() => {
      that.props.dispatch(loadEnterViewPagerImgs());
    });
  }

  componentWillReceiveProps(nextProps: Props) {
    this._start(nextProps);
  }

  render() {

    var data = this.props.viewPagerImgs;

    return (
      <View style={styles.scrollViewWrapper}>
        <ScrollView
          ref='scrollView'
          contentContainerStyle={styles.scrollView}
          automaticallyAdjustContentInsets={false}
          horizontal={true}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={this._onAnimationEnd}>
          {this._renderPage(data)}
        </ScrollView>
        <View style={styles.header}>
          <EnterNavigationBar navigator={this.props.navigator} />
        </View>
        {this._renderPageIndicator()}
      </View>
    )
  }

  _renderPageIndicator() {
    var indicators = [],
        style;

    var data = this.props.viewPagerImgs;

    for (var i=0; i< data.length; i++) {
      style = i === this.state.activePage ? { color:FlyColors.baseColor, opacity:1 } : { color:FlyColors.white,opacity:0.7 };
      indicators.push(<Text key={i} style={[style, {fontSize: 32}]}>&bull;</Text>)
    }

    return (
      <View style={styles.pageIndicatorWrapper}>
        {indicators}
      </View>
    )
  }

  gotoNext(href){
    if (href) {
      SceneUtils.gotoScene(Filters.htmlDecode(href));
    }
  }

  _renderPage(data) {
    return data.map((item, i) => {
      let activeOpacity = item.href ? 0.7 : 1;
      return(
        <TouchableOpacity key={i} onPress={()=>this.gotoNext(item.hrefUrl)} activeOpacity={activeOpacity}>
          <FlyImage
            source={item.imgUrl}
            style={styles.page} />
        </TouchableOpacity>
      )
    });
  }

  _onAnimationEnd(e) {
    var activePage = e.nativeEvent.contentOffset.x / WINDOW_WIDTH;
    this.setState({
      currentX: e.nativeEvent.contentOffset.x,
      activePage: activePage
    });
  }
}

var imgHeight = FlyDimensions.getImgHeightWithWidth(DEFAULT_SIZE);

var styles = StyleSheet.create({
  scrollViewWrapper: {
    backgroundColor: FlyColors.white,
  },
  scrollView: {
    height: imgHeight,
  },
  page: {
    width: FlyDimensions.deviceDim.width,
    height: imgHeight
  },
  pageIndicatorWrapper: {
    position : 'absolute',
    backgroundColor : 'transparent',
    bottom : 0,
    flexDirection: 'row',
    justifyContent: 'center',
    width: FlyDimensions.deviceDim.width,
  },
  header: {
    position: 'absolute',
    top: 0,
    width: FlyDimensions.deviceDim.width,
    height: FlyDimensions.headerHeight,
  },
});

function select(store) {
  return {
    viewPagerImgs: store.enter.viewPagerImgs,
  };
}

module.exports = connect(select)(EnterViewPager);
