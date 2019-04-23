/**
 * @providesModule FlySelectStar
 * @flow
 */

'use strict';
import React,{Component} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';

const FlyBase = require('FlyBase');
const FlyColors = require('FlyColors');
const FlyIconfonts = require('FlyIconfonts');
const FlyDimensions = require('FlyDimensions');
const {Text} = require('FlyText');

const DEFAULT_ITEM_HEIGHT = 30;

export type Item = {
  text: string;
  value: any;
  disabled: boolean;
};

export type Props = {
  title: string;
  type?:string;
  cellIdx:number;
  onSelectValue?: (num: number,type:string,cellIdx:number) => Void; //获取选中是第几个,和state值
  maxLine?: number; //数量的最大值
  iconName?: string; //字体的名称
  iconSize?: number; //FlyIcon的size
  iconSelectColor?: string;
  iconDefaultColor?: string;
  iconStyle?: any;  //FlyIcon的样式
  itemHeight?: number;
  showSegment?: boolean; // 显示组内分割线
};

class FlySelectStar extends React.Component {

  props : Props;

  constructor(props) {
    super(props);

    this.state = {
      iconSelectColor_1:props.iconDefaultColor,
      selectCount: null,
    }
  }

  onSelectValue(count,type,cellIdx) {
    let onSelectValue = this.props.onSelectValue;
    onSelectValue && onSelectValue(count,type,cellIdx);
  }

  onPressItem(idx,type,cellIdx) {
    for (var i = 0; i <= this.props.maxLine; i++) {
      this.setState({
        ['iconSelectColor_'+i]:this.props.iconDefaultColor,
      });
    }

    for (var i = 0; i <= idx; i++) {
        this.setState({
          ['iconSelectColor_'+i]:this.props.iconSelectColor,
          selectCount:idx
        });
    }
    this.onSelectValue(idx,type,cellIdx);

  }

  renderItem() {
    let max = this.props.maxLine || 5;
    let name = this.props.iconName || "icon-collection";
    let size = this.props.iconSize || 20;
    let starItem=[];

    for (var i = 1; i <= max; i++) {
      let key = i;
      let color = this.state.selectCount !=null ? this.state['iconSelectColor_'+key] : this.props.iconDefaultColor;
      starItem.push(
        <TouchableOpacity  key={i} style={{padding: 5}}  onPress={() => this.onPressItem(key,this.props.type,this.props.cellIdx)} activeOpacity={1}>
          <FlyIconfonts name={name} cellIdx={this.props.cellIdx} stateName={this.props.stateName} size={size}   color={color} style={this.props.iconStyle}/>
        </TouchableOpacity>
        )
      }
    return starItem;
  }

  renderMain() {
    let title = this.props.title;
    let height = this.props.itemHeight || 50;
    return (
      <View style={{flexDirection: 'row',height: height,paddingRight: 15}}>
        <View style={{justifyContent: 'center',flex: 3}}>
          <Text style={{fontSize: FlyDimensions.fontSizeXl}}>{title}</Text>
        </View>
        <View style={styles.starWrapperItem}>
          {this.renderItem()}
        </View>
      </View>
    );
  }

  render() {

    return (
      <View style={[styles.container,this.props.showSegment?styles.wrapperSegment:null]}>
        {this.renderMain()}
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    paddingLeft: 15,
    backgroundColor: FlyColors.white
  },
  wrapperSegment: {
    borderBottomWidth: 1,
    borderBottomColor: FlyColors.baseBorderColor
  },
  starWrapperItem: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flex: 7,
    alignItems: 'center',
  },
});

FlySelectStar.styles = styles;

module.exports = FlySelectStar;
