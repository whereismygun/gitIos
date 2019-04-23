/**
 * @providesModule FlyViewPager
 * @flow
 */
'use strict';

import React,{Component} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ViewPagerAndroid,
  Platform,
} from 'react-native';

type Props = {
  count: number;
  selectedIndex: number;
  onSelectedIndexChange?: (index: number) => Void;
  bounces?: boolean;
  autoHeight?: boolean;
  lazyLoad?: boolean; // 懒加载
  children?: any;
  style?: any;
  backgroundColor?:string;
};

type State = {
  width: number;
  height: number;
  selectedIndex: number;
  initialSelectedIndex: number;
  scrollingTo: ?number;

  loadedViewIndex: Object;
};

class FlyViewPager extends React.Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    let loadedViewIndex = {};
    if (this.props.selectedIndex) {
      loadedViewIndex["i_"+this.props.selectedIndex] = true;
    } else {
      loadedViewIndex["i_0"] = true;
    }

    this.state = {
      width: 0,
      height: 0,
      selectedIndex: this.props.selectedIndex,
      initialSelectedIndex: this.props.selectedIndex,
      scrollingTo: null,

      loadedViewIndex: loadedViewIndex,
    };

    (this: any).handleHorizontalScroll = this.handleHorizontalScroll.bind(this);
    (this: any).adjustCardSize = this.adjustCardSize.bind(this);
  }

  render() {
    if (Platform.OS === 'ios') {
      return this.renderIOS();
    } else {
      return this.renderAndroid();
    }
  }

  renderIOS() {
    return (
      <ScrollView
        ref="scrollview"
        contentOffset={{
          x: this.state.width * this.state.initialSelectedIndex,
          y: 0,
        }}
        style={[styles.scrollview, this.props.style]}
        horizontal={true}
        pagingEnabled={true}
        bounces={!!this.props.bounces}
        scrollsToTop={false}
        onScroll={this.handleHorizontalScroll}
        scrollEventThrottle={100}
        automaticallyAdjustContentInsets={false}
        directionalLockEnabled={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        backgroundColor={this.props.backgroundColor}
        onLayout={this.adjustCardSize}>

        {this.renderContent()}
      </ScrollView>
    );
  }

  renderAndroid() {
    return (
      <ViewPagerAndroid
        ref="scrollview"
        scrollEnabled={this.props.scrollEnabled}
        initialPage={this.state.initialSelectedIndex}
        onPageSelected={this.handleHorizontalScroll}
        style={styles.container}>
        {this.renderContent()}
      </ViewPagerAndroid>
    );
  }

  adjustCardSize(e: any) {
    this.setState({
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height,
    });
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.selectedIndex !== this.state.selectedIndex) {

      let loadedViewIndex = this.state.loadedViewIndex;
      loadedViewIndex["i_"+nextProps.selectedIndex] = true;

      if (Platform.OS === 'ios') {
        this.refs.scrollview.scrollTo({
          x: nextProps.selectedIndex * this.state.width,
          animated: true,
        });
        this.setState({scrollingTo: nextProps.selectedIndex, loadedViewIndex});
      } else {
        this.refs.scrollview.setPageWithoutAnimation(nextProps.selectedIndex);
        this.setState({selectedIndex: nextProps.selectedIndex, loadedViewIndex});
      }
    }
  }

  renderContent(): Array<ReactElement> {
    var {width, height} = this.state;
    if (this.props.autoHeight) {
      height = null;
    }
    var style = Platform.OS === 'ios' && styles.card;

    var loadedViewIndex = this.state.loadedViewIndex;

    if (this.props.lazyLoad) {
      return React.Children.map(this.props.children, (child, i) => {
        return (
          <View style={[style, {width, height}]} key={'r_' + i}>
            {loadedViewIndex["i_"+i]?child:null}
          </View>
        );
      });
    } else {
      return React.Children.map(this.props.children, (child, i) => {
        return (
          <View style={[style, {width, height}]} key={'r_' + i}>
            {child}
          </View>
        );
      });
    }

  }

  handleHorizontalScroll(e: any) {

    var selectedIndex = e.nativeEvent.position;

    if (selectedIndex === undefined) {
      selectedIndex = Math.round(
        e.nativeEvent.contentOffset.x / this.state.width,
      );
    }
    if (selectedIndex < 0 || selectedIndex >= this.props.count) {
      return;
    }
    if (this.state.scrollingTo !== null && this.state.scrollingTo !== selectedIndex) {
      return;
    }
    if (this.state.selectedIndex !== selectedIndex || this.state.scrollingTo !== null) {
      let loadedViewIndex = this.state.loadedViewIndex;
      loadedViewIndex["i_"+selectedIndex] = true;
      this.setState({selectedIndex, scrollingTo: null, loadedViewIndex});
      const {onSelectedIndexChange} = this.props;
      onSelectedIndexChange && onSelectedIndexChange(selectedIndex);
    }
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  card: {
    backgroundColor: 'transparent',
  }
});

module.exports = FlyViewPager;
