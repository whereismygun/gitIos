/**
 * @providesModule FlyLoading
 * @flow
 */

'use strict';
import React,{Component} from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native'

const FlyBase = require('FlyBase');
const FlyColors = require('FlyColors');
const FlyDimensions = require('FlyDimensions');
const {Text} = require('FlyText');

export type Props = {
  text: string;
  modalStyle: any;
  backdropPressToClose: boolean;
  backdropOpacity: number;
  backdropColor: any;
  backdrop: boolean;
};

class FlyLoading extends React.Component {
  props : Props;

  static defaultProps = {
    backdropPressToClose: false,
    backdropOpacity: 0.5,
    backdropColor: "black",
    backdrop: true,
  };

  constructor(props) {
    super(props);

    (this: any).open = this.open.bind(this);
    (this: any).close = this.close.bind(this);

    this.state = {
      isOpen: false,
    };
  }

  renderBackdrop() {
    var backdrop  = [];

    if (this.props.backdrop) {
      backdrop = (
        <TouchableWithoutFeedback onPress={this.props.backdropPressToClose ? this.close : null}>
          <View style={[styles.absolute, {backgroundColor:this.props.backdropColor, opacity: this.props.backdropOpacity}]}/>
        </TouchableWithoutFeedback>
      );
    }

    return backdrop;
  }

  open() {
    this.setState({
      isOpen: true
    });
  }

  close() {
    this.setState({
      isOpen: false
    });
  }

  render() {

    if (!this.state.isOpen) {
      return <View/>
    }

    let text = this.props.text || "正在拼命加载，请耐心等待...";

    return (
      <View style={[styles.transparent, styles.absolute, styles.wrapper, this.props.modalStyle]} pointerEvents={'box-none'}>
        {this.renderBackdrop()}
        <View style={styles.wrapper}>
          <ActivityIndicator color={FlyColors.baseTextColor3} />
          <Text style={styles.text}>{text}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  transparent: {
    backgroundColor: 'rgba(0,0,0,0)'
  },

  absolute: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },

  text: {
    marginTop: 10,
    color: FlyColors.baseTextColor3,
    fontWeight: FlyDimensions.fontWeightBolder,
    fontSize: FlyDimensions.fontSizeXl,
    fontStyle: "italic",
  }
});

module.exports = FlyLoading;
