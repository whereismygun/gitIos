/**
 * @providesModule FlyPicker
 * 条目选择器
 */
'use strict'
import React, {Component, findNodeHandle} from 'react';
import ReactNative, {
  View,
  StyleSheet,
  ScrollView,
  Picker,
  TouchableOpacity,
  UIManager,
} from 'react-native';

const FlyColors = require('FlyColors');
const FlyDimensions = require('FlyDimensions');
const FlyStyles = require('FlyStyles');
const FlyIconfonts = require('FlyIconfonts');
const FlyModalBox = require('FlyModalBox');
const {Text} = require('FlyText');
const TimerMixin = require('react-timer-mixin');

const dim = FlyDimensions.deviceDim;

export type Props = {
    height?: number;

    showToolbar?: boolean;

    pickerParent?: any;
    pickerParentDim?: Object;

    items: Array;
    selectedValue?: string;
    onValueChange?: () => Void;
};

const DEFAULT_HEIGHT = 300;

class FlyPicker extends Component {
    props : Props;

    static defaultProps = {
      height: DEFAULT_HEIGHT,
      showToolbar: true,
    };

    constructor(props) {
      super(props);

      (this : any).setTimeout = TimerMixin.setTimeout.bind(this);
      (this : any).finish = this.finish.bind(this);

      this.state = {
        selectedValue: props.selectedValue,
        pickerParentDim: props.pickerParentDim
      };
    }

    componentWillUpdate(nextProps, nextState) {
      if (nextProps.selectedValue != this.props.selectedValue) {
        this.setState({
          selectedValue: nextProps.selectedValue
        });
      }
      if (nextProps.pickerParentDim && nextProps.pickerParentDim != this.props.pickerParentDim) {
        this.setState({
          pickerParentDim: nextProps.pickerParentDim
        });
      }
      if (nextProps.pickerParent && nextProps.pickerParent != this.props.pickerParent) {
        this.measureParentDim(nextProps.pickerParent);
      }
    }

    measureParentDim(pickerParent) {
      if (!pickerParent) {
        return;
      }
      let that = this;

      this.setTimeout(() => {
        UIManager.measure(ReactNative.findNodeHandle(pickerParent), (x, y, w, h) => {
          that.setState({
            pickerParentDim: {
              width: w,
              height: h
            }
          });
        });
      },0);

    }

    finish() {

      let selectedValue = this.state.selectedValue;

      if (selectedValue === null && this.props.items && this.props.items.length > 0) {
        selectedValue = this.props.items[0].value;
      }

      if (selectedValue !== this.props.selectedValue) {
        let onValueChange = this.props.onValueChange;
        onValueChange && onValueChange(selectedValue);
      }

      this.close();
    }

    open() {
      this.refs.PickerModalBox.open();
    }

    close() {
      this.refs.PickerModalBox.close();
    }

    render() {
      let {height, items, showToolbar, pickerParentDim, pickerParent, selectedValue, onValueChange, ...props} = this.props;

      let _parentDim = this.state.pickerParentDim || dim;

      let pickerItems = items.map((item, idx) => {
        return (
          <Picker.Item key={idx} label={item.label} value={item.value} />
        );
      });

      let toolbar = showToolbar ? (
        <View style={styles.pickTitle}>
          <TouchableOpacity onPress={()=>this.finish()}>
            <View>
              <Text style={styles.modalClose}>完成</Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : null;

      let realHeight = height || DEFAULT_HEIGHT;

      if (!showToolbar) {
        realHeight = realHeight - 40;
      }

      let picker = (
        <Picker style={styles.pickStyle} selectedValue={this.state.selectedValue} onValueChange={(val) => this.setState({selectedValue:val})} {...props}>
          {pickerItems}
        </Picker>
      );

      return (
        <FlyModalBox style={[styles.modalBoxStyle,{height:realHeight,width:_parentDim.width}]} modalStyle={[styles.modalStyle,{top:_parentDim.height-realHeight}]}
          swipeToClose={false} position={'top'} ref={'PickerModalBox'}>
          <View style={styles.pickWrapper}>
            {toolbar}
            {picker}
          </View>
        </FlyModalBox>
      );
    }
}

var styles = StyleSheet.create({
  modalBoxStyle: {
    height: DEFAULT_HEIGHT,
    backgroundColor: FlyColors.white,
    borderTopWidth: 1,
    borderColor: FlyColors.baseBorderColor,
  },
  modalStyle: {
  },
  pickWrapper: {
    flex: 1,
    flexDirection: 'column'
  },
  pickTitle: {
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: FlyColors.baseBackgroundColor,
    borderBottomWidth: 0.5,
    borderColor: FlyColors.baseBorderColor,
    paddingRight: 15,
  },
  modalClose: {
    fontWeight: FlyDimensions.fontWeightBolder,
    fontSize: FlyDimensions.fontSizeXl,
    color: FlyColors.toolbarTextColor,
  },

  pickStyle: {
    flex: 1,
    justifyContent: 'center',
  },
});

FlyPicker.height = DEFAULT_HEIGHT;
FlyPicker.contentHeight = DEFAULT_HEIGHT - 40;

module.exports = FlyPicker;
