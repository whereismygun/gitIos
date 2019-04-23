/**
 * @providesModule FlyNumber
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
const {Text} = require('FlyText');


export type Props = {
    initCount: number;
    minCount: number;
    maxCount: number;
    onChangeValue?: (num: number) => Void;
    height: number;
};

class FlyNumber extends React.Component {

    props : Props;

    constructor(props) {
      super(props);

      (this: any).onPressMinus = this.onPressMinus.bind(this);
      (this: any).onPressAdd = this.onPressAdd.bind(this);

      this.state = {
        count: props.initCount || 1,
        minCount: props.minCount || 1,
        maxCount: props.maxCount || 10,
      }
    }

    componentWillReceiveProps(nextProps: Props) {
      if (nextProps.initCount !== this.props.initCount) {
        this.setState({
          count: nextProps.initCount || 1
        });
      }
    }

    getCount() {
      return this.state.count;
    }

    checkMinusBtn() {
      return (this.state.count > this.state.minCount);
    }

    checkAddBtn() {
      return (this.state.count < this.state.maxCount);
    }

    onChangeValue(count) {
      let onChangeValue = this.props.onChangeValue;
      onChangeValue && onChangeValue(count);
    }

    onPressMinus() {
      let count = --this.state.count;
      this.onChangeValue(count);
      this.setState({
        count: count
      });
    }

    onPressAdd() {
      let count = ++this.state.count;
      this.onChangeValue(count);
      this.setState({
        count: count
      });
    }

    getHeightStyle() {
      let style = null;
      if (this.props.height) {
        style = {
          height: this.props.height,
        };
      }
      return style;
    }

    renderMinus() {
      if (this.checkMinusBtn()) {
        return (
          <TouchableOpacity onPress={this.onPressMinus}
            underlayColor={FlyColors.baseBackgroundColor2}>
            <View style={[styles.textWrapper, styles.minus, styles.selected, this.getHeightStyle()]}>
              <Text style={[styles.text, styles.selectedText]}>-</Text>
            </View>
          </TouchableOpacity>
        );
      } else {
        return (
          <View style={[styles.textWrapper, styles.minus, this.getHeightStyle()]}>
            <Text style={[styles.text]}>-</Text>
          </View>
        );
      }
    }

    renderAdd() {
      if (this.checkAddBtn()) {
        return (
          <TouchableOpacity onPress={this.onPressAdd}
            underlayColor={FlyColors.baseBackgroundColor2}>
            <View style={[styles.textWrapper, styles.add, styles.selected, this.getHeightStyle()]}>
              <Text style={[styles.text, styles.selectedText]}>+</Text>
            </View>
          </TouchableOpacity>
        );
      } else {
        return (
          <View style={[styles.textWrapper, styles.add, this.getHeightStyle()]}>
            <Text style={[styles.text]}>+</Text>
          </View>
        );
      }
    }

    render() {
        return (
          <View style={styles.numberWrapper}>
              {this.renderMinus()}
              <View style={[styles.textWrapper, styles.count, this.getHeightStyle()]}>
                <Text style={[styles.text, styles.selectedText]}>{this.state.count}</Text>
              </View>
              {this.renderAdd()}
          </View>
        );
    }
}

var styles = StyleSheet.create({
  numberWrapper: {
    flexDirection: 'row',
  },
  textWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    paddingLeft: 15,
    paddingRight: 15,
    borderColor: FlyColors.baseBorderColor,
  },
  minus: {
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
  },
  count: {
    borderWidth: 1,
    width: 50,
    paddingLeft: 0,
    paddingRight: 0,
    borderColor: FlyColors.baseColor,
  },
  add: {
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  selected: {
    borderColor: FlyColors.baseColor,
  },
  text: {
    fontSize: FlyDimensions.fontSizeXxl,
    color: FlyColors.baseTextColor2,
  },
  selectedText: {
    color: FlyColors.baseTextColor,
  },
});

module.exports = FlyNumber;
