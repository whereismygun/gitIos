/**
 * @providesModule FlyEditableScrollView
 * 自定义条目
 */
'use strict'
import React, {Component} from 'react';
import ReactNative, {
  View,
  StyleSheet,
  ScrollView,
  Animated,
  Easing,
  TouchableOpacity,
  DeviceEventEmitter,
  UIManager,
  TextInput,
} from 'react-native';

const FlyColors = require('FlyColors');
const FlyDimensions = require('FlyDimensions');
const FlyStyles = require('FlyStyles');
const {Text} = require('FlyText');
const FlyTextInput = require('FlyTextInput');
const Utils = require('Utils');
const TimerMixin = require('react-timer-mixin');
const KEYBOARD_TOOLBAR_HEIGHT = 40;


export type Props = {
  containerStyle: any;
  AnimationClose: boolean;
};

class FlyEditableScrollView extends Component {
    props : Props;

    static defaultProps = {
      AnimationClose: true
    };

    constructor(props) {
      super(props);

      (this : any).updateKeyboardSpace = this.updateKeyboardSpace.bind(this);
      (this : any).resetKeyboardSpace = this.resetKeyboardSpace.bind(this);
      (this : any).scrollToCenter = this.scrollToCenter.bind(this);
      (this : any).previousChild = this.previousChild.bind(this);
      (this : any).nextChild = this.nextChild.bind(this);
      (this : any).setTimeout = TimerMixin.setTimeout.bind(this);

      this.state = {
        heightAnim: new Animated.Value(0),
        activeChildrenIndex: null,
      };

      this.canEditMaxIndex = -1;
      this.canEditTypes = [];
      this.refsMap = {};

      this.ignoreResetKeyboardSpace = false;

    }

    componentDidMount() {
      DeviceEventEmitter.addListener('keyboardWillShow',(frames)=>this.updateKeyboardSpace(frames));
      DeviceEventEmitter.addListener('keyboardWillHide',(frames)=>this.resetKeyboardSpace(frames));
    }

    componentWillUMount(){
      DeviceEventEmitter.removeListener('keyboardWillShow');
      DeviceEventEmitter.removeListener('keyboardWillHide');
    }

    updateKeyboardSpace(frames) {
      const keyboardSpace = frames.endCoordinates.height;
      const duration = frames.duration;
      this.changeHeight(keyboardSpace+KEYBOARD_TOOLBAR_HEIGHT, duration);
    }

    checkChildrenRef(ref) {
      return this.refsMap[ref] || ref;
    }

    getChild(ref) {
      return this.refs[this.checkChildrenRef(ref)];
    }

    resetKeyboardSpace(frames) {
      if (!this.ignoreResetKeyboardSpace) {
        const duration = frames.duration;
        this.changeHeight(0, duration);
      }
    }

    changeHeight(height, duration) {
      let that = this;
      Animated.timing(
        this.state.heightAnim,
        {
          toValue: height,
          duration: duration,
          easing: Easing.inOut(Easing.ease)
        }
      ).start(() => {
        if (this.props.AnimationClose) {
          if (height && height > 0) {
            that.setTimeout(() => {
              that.scrollToCenter();
            },0);
          }
        }
      });
    }

    scrollToCenter() {
      let idx = this.state.activeChildrenIndex;
      if (idx) {
        let ref = this.refs["idx_"+idx];
        let scrollView = this.refs.scrollView;
        if (!ref || !scrollView) {
          return;
        }
        let scrollViewHandle = ReactNative.findNodeHandle(scrollView);
        let targetHandle = ReactNative.findNodeHandle(ref);
        UIManager.measure(scrollViewHandle, (sx, sy, sw, sh) => {
          UIManager.measureLayout(
            targetHandle,
            scrollViewHandle,
            (e) => {},
            (x, y, w, h) => {
              let scrollTo = Math.max(0,y+h/2-sh/2);
              scrollView.scrollTo({y:scrollTo,animated:true});
            });
        });
      }
    }

    renderToolbar() {

      let previousView = this.checkFirstChild() ?
        (
          <View style={styles.keyboardToolbarLeft}><Text style={[styles.keyboardToolbarText,styles.keyboardToolbarTextDisable]}>前一个</Text></View>
        ) : (
          <TouchableOpacity onPress={()=>this.previousChild()} style={styles.keyboardToolbarLeft}>
            <View>
              <Text style={styles.keyboardToolbarText}>前一个</Text>
            </View>
          </TouchableOpacity>
        );

      let nextView = this.checkLastChild() ?
        (
          <View style={styles.keyboardToolbarLeft}><Text style={[styles.keyboardToolbarText,styles.keyboardToolbarTextDisable]}>后一个</Text></View>
        ) : (
          <TouchableOpacity onPress={()=>this.nextChild()} style={styles.keyboardToolbarLeft}>
            <View>
              <Text style={styles.keyboardToolbarText}>后一个</Text>
            </View>
          </TouchableOpacity>
        );

      return (
        <Animated.View style={[styles.keyboardWrapper,{height:this.state.heightAnim}]}>
          <View style={styles.keyboardToolbarWrapper}>
            {previousView}
            {nextView}
            <TouchableOpacity onPress={()=>this.finishEdit()} style={styles.keyboardToolbarRight}>
              <View>
                <Text style={styles.keyboardToolbarText}>完成</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>
      );
    }

    checkFirstChild() {
      if (this.canEditMaxIndex > -1) {
        return (this.state.activeChildrenIndex === 0)
      }
      return true;
    }

    checkLastChild() {
      if (this.canEditMaxIndex > -1) {
        return (this.canEditMaxIndex === this.state.activeChildrenIndex)
      }
      return true;
    }

    previousChild() {
      let idx = this.state.activeChildrenIndex;
      if (idx !== null && this.canEditMaxIndex > -1) {
        let editIdx = Math.max(0, idx-1);
        this.activeChildren(editIdx);
      }
    }

    nextChild() {
      let idx = this.state.activeChildrenIndex;

      if (idx !== null && this.canEditMaxIndex > -1) {
        let editIdx = Math.min(this.canEditMaxIndex, idx+1);
        this.activeChildren(editIdx);
      }
    }

    checkTextInput(type) {
      if (type === "FlyTextInput" || type === "TextInput") {
        return true;
      }
      return false;
    }

    activeChildren(nextIdx) {
      let childType = this.canEditTypes[nextIdx];
      let ref = this.refs["idx_"+nextIdx];

      if (this.checkTextInput(childType)) {
        if (ref && ref.focus) {
          ref.focus();
        }
      } else {
        if (ref && ref.props && ref.props.onPress) {
          ref.props.onPress();
        }
      }
    }

    finishEdit() {
      this.changeActiveChildren(null);
    }

    changeActiveChildren(nextIdx) {

      this.ignoreResetKeyboardSpace = false;
      let idx = this.state.activeChildrenIndex;
      let theChild = this.refs["idx_"+idx];
      let nextChild = this.refs["idx_"+nextIdx];
      let theType = this.canEditTypes[idx];
      let nextType = this.canEditTypes[nextIdx];

      if (idx !== null && theChild) {
        if (this.checkTextInput(theType)) {
          if (nextIdx !== null && nextChild) {
            if (nextChild && nextChild.props && nextChild.props.pickerHeight) {
              this.ignoreResetKeyboardSpace = true;
            }
            if (!this.checkTextInput(nextType)) {
              theChild.blur();
            }
          } else {
            theChild.blur();
          }
        } else {
          theChild.props.onClose && theChild.props.onClose();
        }
      }

      this.setState({
        activeChildrenIndex: nextIdx
      });
    }

    renderChild(child, idx, keyPrefix) {

      let that = this;

      if (child === null || child === undefined || !Utils.isObject(child)) {
        return child;
      } else if (Array.isArray(child)) {
        let newChildren = [];
        let newKeyPrefix = keyPrefix+idx+"_";
        child.map((subChild, idx) => {
          newChildren.push(that.renderChild(subChild, idx, newKeyPrefix));
        });
        return newChildren;
      }

      let props = child.props;
      if (child.type === FlyTextInput || child.type === TextInput) {

        this.canEditMaxIndex++;
        this.canEditTypes[this.canEditMaxIndex] = (child.type === FlyTextInput)?"FlyTextInput":"TextInput";

        let _onFocus = props.onFocus;
        let _onBlur = props.onBlur;
        let _editIndex = this.canEditMaxIndex;

        if (child.ref) {
          this.refsMap[child.ref] = 'idx_'+this.canEditMaxIndex;
        }

        return React.cloneElement(child, {
          key: keyPrefix+idx,
          ref: 'idx_'+that.canEditMaxIndex,
          onFocus: () => {
            if (that.state.activeChildrenIndex !== _editIndex) {
              that.changeActiveChildren(_editIndex);
              _onFocus && _onFocus();
            }
          },
          onBlur: () => {
            _onBlur && _onBlur();
          },
        });
      } else if (props.onPress && props.canEdit) {

        this.canEditMaxIndex++;
        this.canEditTypes[this.canEditMaxIndex] = "FlyEditable";

        let _onPress = props.onPress;
        let _onClose = props.onClose;
        let _editIndex = this.canEditMaxIndex;

        if (child.ref) {
          this.refsMap[child.ref] = 'idx_'+this.canEditMaxIndex;
        }

        return React.cloneElement(child, {
          key: keyPrefix+idx,
          ref: 'idx_'+that.canEditMaxIndex,
          onPress: () => {
            if (that.state.activeChildrenIndex !== _editIndex) {
              that.changeActiveChildren(_editIndex);
              if (props.pickerHeight) {
                that.changeHeight(props.pickerHeight+KEYBOARD_TOOLBAR_HEIGHT, 0);
              }
            }
            _onPress && _onPress();
          },
          onClose: () => {
            if (props.pickerHeight) {
              that.changeHeight(0, 0);
            }
            _onClose && _onClose();
          },
        });
      } else {
        let subChildren = null;
        if (props.children) {
          subChildren = that.renderChildren(props.children, keyPrefix+idx+"_");
        }
        return React.cloneElement(child, {
          key: keyPrefix+idx,
          children: subChildren
        });
      }
    }

    renderChildren(children, keyPrefix) {
      let that = this;
      if (children) {
        if (children == null || Utils.isString(children)) {
          return children;
        }
        else if (Array.isArray(children)) {
          let newChildren = [];
          children.map((child, idx) => {
            newChildren.push(that.renderChild(child, idx, keyPrefix));
          });
          return newChildren;
        } else {
          return this.renderChild(children, 0, keyPrefix);
        }
      }
    }

    render() {

        let {style, containerStyle, children, ...props} = this.props;

        this.canEditMaxIndex = -1;
        this.canEditTypes = [];
        this.refsMap = {};

        return (
          <View style={[styles.container, containerStyle]}>
              <ScrollView ref={"scrollView"} style={[styles.scrollView, style]} {...props}>
                {this.renderChildren(children,'key_')}
              </ScrollView>
              {this.renderToolbar()}
          </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
    },
    scrollView: {
      flex: 1,
    },
    keyboardWrapper: {

    },
    keyboardToolbarWrapper: {
      height: KEYBOARD_TOOLBAR_HEIGHT,
      flexDirection: 'row',
      backgroundColor: FlyColors.baseBackgroundColor,
      borderTopWidth: 1,
      borderColor: FlyColors.baseBorderColor,
      paddingLeft: 15,
      paddingRight: 15,
    },
    keyboardToolbarLeft: {
      height: KEYBOARD_TOOLBAR_HEIGHT,
      width: FlyDimensions.normalize(60),
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    keyboardToolbarRight: {
      height: KEYBOARD_TOOLBAR_HEIGHT,
      flex: 1,
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
    keyboardToolbarText: {
      fontWeight: FlyDimensions.fontWeightBolder,
      fontSize: FlyDimensions.fontSizeXl,
      color: FlyColors.toolbarTextColor,
    },
    keyboardToolbarTextDisable: {
      color: FlyColors.baseTextColor2,
    }
});

module.exports = FlyEditableScrollView;
