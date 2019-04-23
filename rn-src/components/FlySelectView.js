/**
 * @providesModule FlySelectView
 * @flow
 */

'use strict';
import React,{Component} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';

const FlyBase = require('FlyBase');
const FlyColors = require('FlyColors');
const FlyDimensions = require('FlyDimensions');
const Utils = require('Utils');
const {Text} = require('FlyText');

const DEFAULT_ITEM_HEIGHT = 30;

export type Item = {
  text: string;
  value: any;
  disabled: boolean;
};

export type Props = {
  initValue: any;
  title?: string;
  items: Array<Item>;
  onPressItem?: (value: any, item: Item, idx: number) => Void;
  lineNumber?: number;
  maxLine?: number;
  flowItem?: boolean;
  itemSelected?: any;
  textSelected?: any;
  renderItemFn?: () => any;
  itemHeight?: number;
};

class FlySelectView extends Component {

  props : Props;

  static defaultProps = {
    lineNumber: 3,
  };

  constructor(props) {
    super(props);

    this.state = {
      showAll: false
    };

    (this: any).onPressItem = this.onPressItem.bind(this);
    (this: any).onPressTypeItem = this.onPressTypeItem.bind(this);
  }

  onPressItem(item, idx) {
    this.props.onPressItem && this.props.onPressItem(item.value, item, idx);
  }

  onPressTypeItem(item, idx) {
    if (item.type === 'more') {
      this.setState({
        showAll: true
      });
    } else if (item.type === 'fold') {
      this.setState({
        showAll: false
      });
    }
  }

  renderItem(item, idx) {

    let renderItemFn = this.props.renderItemFn;
    if (renderItemFn) {
      return renderItemFn(item, idx, this);
    }

    let selected = (item.value == this.props.initValue);
    let itemSelected = selected?(this.props.itemSelected||styles.itemSelected):null;
    let textSelected = selected?(this.props.textSelected||styles.textSelected):null;

    let itemHeight = this.props.itemHeight || DEFAULT_ITEM_HEIGHT;

    if (item.type) {
      return (
        <TouchableOpacity style={[styles.itemWrapper, {height:itemHeight}]} key={"item"+idx} onPress={()=>this.onPressTypeItem(item, idx)}>
          <View style={[styles.item, styles.typeItem, {height:itemHeight-2}]}>
            <Text>{item.text}</Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      if (item.disabled) {
        return (
          <View style={[styles.itemWrapper, {height:itemHeight}]} key={"item"+idx}>
            <View style={[styles.item, {height:itemHeight-2}, styles.itemDisabled]}>
              <Text style={styles.textDisabled}>{item.text}</Text>
            </View>
          </View>
        );
      } else {
        return (
          <TouchableOpacity style={[styles.itemWrapper, {height:itemHeight}]} key={"item"+idx} onPress={()=>this.onPressItem(item, idx)}>
            <View style={[styles.item, {height:itemHeight-2}, itemSelected]}>
              <Text style={textSelected}>{item.text}</Text>
            </View>
          </TouchableOpacity>
        );
      }
    }
  }

  renderFlowItem(item, idx) {

    let renderItemFn = this.props.renderItemFn;
    if (renderItemFn) {
      return renderItemFn(item, idx, this);
    }

    let selected = (item.value == this.props.initValue);
    let itemSelected = selected?(this.props.itemSelected||styles.itemSelected):null;
    let textSelected = selected?(this.props.textSelected||styles.textSelected):null;

    let itemHeight = this.props.itemHeight || DEFAULT_ITEM_HEIGHT;

    if (item.disabled) {
      return (
        <View style={[styles.flowItemWrapper, {height:itemHeight}]} key={"item"+idx}>
          <View style={[styles.item, {height:itemHeight-2}, styles.flowItem, styles.itemDisabled]}>
            <Text style={styles.textDisabled}>{item.text}</Text>
          </View>
        </View>
      );
    } else {
      return (
        <TouchableOpacity style={[styles.flowItemWrapper, {height:itemHeight}]} key={"item"+idx} onPress={()=>this.onPressItem(item, idx)}>
          <View style={[styles.item, {height:itemHeight-2}, styles.flowItem, itemSelected]}>
            <Text style={textSelected}>{item.text}</Text>
          </View>
        </TouchableOpacity>
      );
    }
  }

  renderMain() {
    let lineNum = this.props.lineNumber;
    let maxLine = this.props.maxLine;
    let items = this.props.items;

    if (items) {
      if (this.props.flowItem) {
        return items.map((item, idx) => {
          return this.renderFlowItem(item,idx);
        });
      }
      else {
        if (maxLine && maxLine > 0) {
          let maxItemNum = lineNum * maxLine;
          // 实际个数<最多显示个数, 直接显示
          if (items.length <= maxItemNum) {
            return this.renderMainNormal(items);
          } else {
            if (this.state.showAll) {
              return this.renderMainAll(items);
            } else {
              return this.renderMainFold(items);
            }
          }
        } else {
          return this.renderMainNormal(items);
        }
      }
    }
    return null;
  }

  renderMainAll(items) {
    let lineNum = this.props.lineNumber;
    let maxLine = this.props.maxLine;
    let maxItemNum = lineNum * maxLine;
    let newItems = items.concat([{
      text: "收起",
      type: "fold"
    }]);
    let rowView = [];
    for (let i=0; i<newItems.length;) {
      let cell = [];
      for (let j=0;j<lineNum; j++,i++) {
        if (newItems[i]) {
          cell.push(this.renderItem(newItems[i],i));
        } else {
          cell.push(
            <View style={styles.itemWrapper} key={"item"+i}>
            </View>
          );
        }
      }
      rowView.push(
        <View style={styles.row} key={"row"+i}>
          {cell}
        </View>
      );
    }
    return rowView;
  }

  renderMainFold(items) {
    let lineNum = this.props.lineNumber;
    let maxLine = this.props.maxLine;
    let maxItemNum = lineNum * maxLine;
    let newItems = items.slice(0,maxItemNum-1).concat([{
      text: "更多...",
      type: "more"
    }]);
    let rowView = [];
    for (let i=0; i<newItems.length;) {
      let cell = [];
      for (let j=0;j<lineNum; j++,i++) {
        if (newItems[i]) {
          cell.push(this.renderItem(newItems[i],i));
        } else {
          cell.push(
            <View style={styles.itemWrapper} key={"item"+i}>
            </View>
          );
        }
      }
      rowView.push(
        <View style={styles.row} key={"row"+i}>
          {cell}
        </View>
      );
    }
    return rowView;
  }

  renderMainNormal(items) {
    let lineNum = this.props.lineNumber;
    let rowView = [];
    for (let i=0; i<items.length;) {
      let cell = [];
      for (let j=0;j<lineNum; j++,i++) {
        if (items[i]) {
          cell.push(this.renderItem(items[i],i));
        } else {
          cell.push(
            <View style={styles.itemWrapper} key={"item"+i}>
            </View>
          );
        }
      }
      rowView.push(
        <View style={styles.row} key={"row"+i}>
          {cell}
        </View>
      );
    }
    return rowView;
  }

  render() {

    let wrapperStyle = (this.props.flowItem) ? styles.mainFlowWrapper : styles.mainWrapper;

    let titleView,paddingTop = 10;
    if (!Utils.isEmpty(this.props.title)) {
      paddingTop = 0;
      titleView = (
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>{this.props.title}</Text>
        </View>
      );
    }

    return (
      <View style={[styles.container,{paddingTop:paddingTop}]}>
        {titleView}
        <View style={wrapperStyle}>
          {this.renderMain()}
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    paddingLeft: 15,
    paddingRight: 15,
  },
  titleWrapper: {
    height: 50,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  title: {
    fontSize: FlyDimensions.fontSizeXl,
    fontWeight: FlyDimensions.fontWeightBolder,
    color: FlyColors.baseTextColor2,
  },
  mainWrapper: {
    flex: 1,
    flexDirection: 'column',
  },
  mainFlowWrapper: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  itemWrapper: {
    flex: 1,
    paddingLeft: 5,
    paddingRight: 5,
    height: DEFAULT_ITEM_HEIGHT,
  },
  flowItemWrapper: {
    paddingLeft: 5,
    paddingRight: 5,
    marginBottom: 10,
    height: DEFAULT_ITEM_HEIGHT,
  },
  item: {
    flex: 1,
    height: DEFAULT_ITEM_HEIGHT-2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    borderWidth: 1,
    borderColor: FlyColors.baseBorderColor,
  },
  typeItem: {
    backgroundColor: FlyColors.baseBackgroundColor
  },
  flowItem: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  itemSelected: {
    borderColor: FlyColors.baseColor,
  },
  text: {

  },
  textSelected: {
    color: FlyColors.baseColor,
  },
  itemDisabled: {
    borderColor: FlyColors.baseBorderColor,
    borderStyle: 'dashed',
  },
  textDisabled: {
    color: FlyColors.baseTextColor2,
  },
});

FlySelectView.styles = styles;

module.exports = FlySelectView;
