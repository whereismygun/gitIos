/**
 *
 *
 * @flow
 *
 */
'use strict';
import React, {Component} from 'react';
import ReactNative, {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  InteractionManager
} from 'react-native';

const {getMsgCount, getCartCount} = require('../../actions');

const {connect} = require('react-redux');
const message = './imgs/myAssets/message.png';
const FlyStyles = require('FlyStyles');
const FlyColors = require('FlyColors');
const FlyDimensions = require('FlyDimensions');
const FlyHeader = require('FlyHeader');
const FlySearch = require('FlySearch');
const SceneUtils = require('SceneUtils');
const dim = FlyDimensions.deviceDim;
type Props = {
  navigator: Navigator;
  isFix: boolean;
  transform: any;
  msgCount: number;
  cartCount: number;
};

class EnterNavigationBar extends React.Component {
  props: Props;

  constructor(props) {
    super(props);
  }

  componentDidMount(){
    InteractionManager.runAfterInteractions(() => {
      this.props.dispatch(getMsgCount());
    });
  }


  render() {

    let rightItem = {
      image:message,
      count:this.props.msgCount,
      imageWidth:18,
      style:{alignItems:'flex-end'},
      onPress:() =>{
        SceneUtils.gotoScene('PROFILE_MESSAGE_VIEW');
      }
    };

    if (this.props.isFix) {
      return (
        <FlyHeader
          foreground="dark"
          contentStyle={FlyStyles.headerContent}
          backgroundColor={FlyColors.white}
          style={styles.fixedHeader}
          transform={this.props.transform}
          borderBottom={true}
          rightItem={rightItem}/>

      );
    } else {
      return (
        <FlyHeader
          foreground="light"
          contentStyle={FlyStyles.headerContent}
          rightItem={rightItem}/>
      );
    }
  }
}

var styles = StyleSheet.create({
  fixedHeader: {
    borderBottomColor: FlyColors.baseBorderColor,
    borderBottomWidth: 0.5
  }
});

function select(store) {
  return {
    msgCount: store.user.msgCount,
  };
}

module.exports = connect(select)(EnterNavigationBar);
