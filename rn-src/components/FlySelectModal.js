/**
 * @providesModule FlySelectModal
 * @flow
 */

'use strict';
import React,{Component} from 'react';
import {
  StyleSheet,
  View,
  TouchableHighlight,
} from 'react-native';

const FlyBase = require('FlyBase');
const FlyColors = require('FlyColors');
const FlyDimensions = require('FlyDimensions');

const FlyModalBox = require('FlyModalBox');
const {Text} = require('FlyText');

export type Item = {
  text: string;
  value: any;
  disabled: boolean;
};

export type Props = {
  initValue: any;
  items: Array<Item>;
  onPressItem?: (value: any, item: Item, idx: number) => Void;
};

class FlySelectModal extends React.Component {

  props : Props;

  constructor(props) {
    super(props);
    (this: any).onPressItem = this.onPressItem.bind(this);
    (this: any).open = this.open.bind(this);
    (this: any).close = this.close.bind(this);
  }

  onPressItem(item, idx) {
    this.props.onPressItem && this.props.onPressItem(item.value, item, idx);

    this.close();
  }

  open() {
    this.refs.modal.open();
  }

  close() {
    this.refs.modal.close();
  }

  render() {

    let items = this.props.items.map((item,idx)=>{
      return (
        <TouchableHighlight key={idx} style={styles.modalItemWrapper} underlayColor={FlyColors.baseBackgroundColor2} onPress={()=>this.onPressItem(item, idx)}>
          <View style={styles.modalItem}>
            <Text style={styles.modalText}>{item.text}</Text>
          </View>
        </TouchableHighlight>
      );
    });

    let height = 50 * (this.props.items.length+1) + 10;

    return (
      <FlyModalBox style={[styles.modal, {height:height}]} modalStyle={styles.modalWrapper} position={"bottom"} ref={"modal"}>
        {items}
        <TouchableHighlight style={[styles.modalItemWrapper, styles.modalClose]} underlayColor={FlyColors.baseBackgroundColor2} onPress={this.close}>
          <View style={styles.modalItem}>
            <Text style={styles.modalCloseText}>关闭</Text>
          </View>
        </TouchableHighlight>
      </FlyModalBox>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    flexDirection: 'column',
    height: 100,
    backgroundColor: 'rgba(0,0,0,0)',
    paddingLeft: 15,
    paddingRight: 15,
  },

  modalWrapper: {
    flex: 1,
  },

  modalItemWrapper: {
    flex: 1,
    marginBottom: 10,
    borderRadius: 5,
  },

  modalItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: FlyColors.white,
    borderRadius: 5,
  },

  modalClose: {
    marginTop: 10,
  },

  modalText: {
    fontSize: FlyDimensions.fontSizeXxl
  },

  modalCloseText: {
    color: FlyColors.toolbarTextColor,
    fontSize: FlyDimensions.fontSizeXl,
    fontWeight: FlyDimensions.fontWeightBolder,
  }
});

module.exports = FlySelectModal;
