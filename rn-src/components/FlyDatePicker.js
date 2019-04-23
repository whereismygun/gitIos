/**
 * @providesModule FlyDatePicker
 * 日期选择器
 */
'use strict'
import React, {Component, findNodeHandle} from 'react';
import ReactNative, {
  View,
  StyleSheet,
  DatePickerIOS,
  TouchableOpacity,
  UIManager,
} from 'react-native';

const FlyColors = require('FlyColors');
const FlyDimensions = require('FlyDimensions');
const FlyStyles = require('FlyStyles');
const FlyIconfonts = require('FlyIconfonts');
const FlyModalBox = require('FlyModalBox');
const {Text} = require('FlyText');

const dim = FlyDimensions.deviceDim;

export type Props = {
    height?: number;

    showToolbar?: boolean;

    pickerParent?: any;
    pickerParentDim?: Object;

    // DatePickerIOS属性
    date?: Date;
    onDateChange?: () => Void;
    mode?: string; // date,time,datetime
    maximumDate?: Date;
    minimumDate?: Date;
    minuteInterval?: any;
    timeZoneOffsetInMinutes?: number;

};

const DEFAULT_HEIGHT = 300;

class FlyDatePicker extends Component {
    props : Props;

    static defaultProps = {
      height: DEFAULT_HEIGHT,
      showToolbar: true,
    };

    constructor(props) {
      super(props);

      (this : any).finish = this.finish.bind(this);
      (this : any)._onDateChange = this._onDateChange.bind(this);

      this.defaultDate = new Date();

      this.state = {
        date: props.date,
        pickerParentDim: props.pickerParentDim
      };
    }

    componentWillUpdate(nextProps, nextState) {
      if (nextProps.date != this.props.date) {
        this.setState({
          date: nextProps.date
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

      let selectedDate = this.state.date || this.defaultDate;

      if (selectedDate !== this.props.date) {
        let onDateChange = this.props.onDateChange;
        onDateChange && onDateChange(selectedDate);
      }

      this.close();
    }

    _onDateChange(date) {
      this.setState({
        date: date,
      });
    }

    open() {
      this.refs.PickerModalBox.open();
    }

    close() {
      this.refs.PickerModalBox.close();
    }

    render() {
      let {height, date, onDateChange, showToolbar, pickerParentDim, pickerParent, ...props} = this.props;

      let _parentDim = this.state.pickerParentDim || dim;

      let toolbar = showToolbar ? (
        <View style={styles.pickTitle}>
          <TouchableOpacity onPress={()=>this.finish()}>
            <Text style={styles.modalClose}>完成</Text>
          </TouchableOpacity>
        </View>
      ) : null;

      let realHeight = height || DEFAULT_HEIGHT;

      if (!showToolbar) {
        realHeight = realHeight - 40;
      }

      let selectedDate = this.state.date || this.defaultDate;

      return (
        <FlyModalBox style={[styles.modalBoxStyle,{height:realHeight,width:_parentDim.width}]} modalStyle={[styles.modalStyle,{top:_parentDim.height-realHeight}]}
          swipeToClose={false} position={'top'} ref={'PickerModalBox'}>
          <View style={styles.pickWrapper}>
            {toolbar}
            <DatePickerIOS style={styles.pickStyle} date={selectedDate} onDateChange={(date) => this._onDateChange(date)} {...props} />
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

FlyDatePicker.height = DEFAULT_HEIGHT;
FlyDatePicker.contentHeight = DEFAULT_HEIGHT - 40;

module.exports = FlyDatePicker;
