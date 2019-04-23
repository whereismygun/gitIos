/**
 * @providesModule FlyViewPagerWithTab
 * @flow
 */

'use strict';

import React, {
  Component
}
from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
}
from 'react-native';

const FlyBase = require('FlyBase');
const FlyColors = require('FlyColors');
const FlyDimensions = require('FlyDimensions');
const {
  Text
} = require('FlyText');
const FlyViewPager = require('FlyViewPager');

export type Props = {
  count: number;
  selectedIndex: number;
  titles: Array < string > ;
  backgroundColor?:string;
  autoHeight ? : boolean;
  lazyLoad ? : boolean; // 懒加载
  onSelectedIndexChange ? : (index: number) => Void;
};

class FlyViewPagerWithTab extends Component {

  props: Props;

  constructor(props) {
    super(props);
    (this: any)
    .onSelectedIndexChange = this.onSelectedIndexChange.bind(this);

    this.state = {
      selectedIndex: this.props.selectedIndex,
    };
  }

  selectTab(index) {
    this.onSelectedIndexChange(index);
  }

  onSelectedIndexChange(index) {
    if (this.state.selectedIndex === index) {
      return;
    }
    this.setState({
      selectedIndex: index,
    });
    if (this.props.onSelectedIndexChange) {
      this.props.onSelectedIndexChange(index);
    }
  }

  render() {
    let selectedIndex = this.state.selectedIndex;
    let titleView = this.props.titles.map((title, index) => {
      return (
        <TouchableOpacity key={"t_"+index} style={[styles.title,(selectedIndex==index)?styles.titleSelected:null]} onPress={()=>this.onSelectedIndexChange(index)}>
          <Text style={[(selectedIndex==index)?styles.textSelected:styles.textColor,{fontSize:FlyDimensions.fontSizeXl}]}>{title}</Text>
        </TouchableOpacity>
      );
    });

    return (
      <View style={styles.container}>
        <View style={styles.titleWrapper}>
          {titleView}
        </View>
        <FlyViewPager
          ref={'FlyViewPager'}
          count={this.props.count}
          selectedIndex={selectedIndex}
          onSelectedIndexChange={this.onSelectedIndexChange}
          autoHeight={this.props.autoHeight}
          lazyLoad={this.props.lazyLoad}
          backgroundColor={this.props.backgroundColor}
          style={styles.mainWrapper}>
          {this.props.children}
        </FlyViewPager>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  titleWrapper: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: FlyColors.baseBorderColor,
  },

  title: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: FlyColors.white,
    backgroundColor: FlyColors.white,
  },
  titleSelected: {
    borderBottomColor: FlyColors.baseColor,
    backgroundColor: FlyColors.white
  },
  mainWrapper: {
    flex: 1,
  },

  textSelected: {
    color: FlyColors.baseColor,
  },
  textColor:{
    color:FlyColors.baseTextColor2
  }
});

module.exports = FlyViewPagerWithTab;
