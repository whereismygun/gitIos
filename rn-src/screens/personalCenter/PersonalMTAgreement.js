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
  ListView,
  Animated,
  Navigator,
  TouchableOpacity,
  InteractionManager,
  DeviceEventEmitter,
  ScrollView
} from 'react-native';

const {connect} = require('react-redux');

const TimerMixin = require('react-timer-mixin');
const DXRefreshControl = require('DXRefreshControl');

const FlyBase = require('FlyBase');
const FlyColors = require('FlyColors');
const FlyStyles = require('FlyStyles');
const FlyDimensions = require('FlyDimensions');
const FlyImage = require('FlyImage');
const SceneUtils = require('SceneUtils');
const env = require('env');
const FlyHeader = require('FlyHeader');
const NativeModuleUtils = require('NativeModuleUtils');
const FlyIconfonts = require('FlyIconfonts')
const FlyModalBox = require('FlyModalBox');
const NetworkService = require('NetworkService');
const Utils = require('Utils');
const {Text} = require('FlyText');
const LISTVIEWREF = 'listview';
const FlyTextInput = require('FlyTextInput');
const FlyEditableScrollView = require('FlyEditableScrollView');
const FlyButton = require('FlyButton');
const FlyItem = require('FlyItem');
const agreement = './imgs/personCenter/Agreement.png';
const dim = FlyDimensions.deviceDim

type Props = {
  navigator: Navigator;
};

class PersonalMTAgreement extends React.Component {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {

    }
  } 

  componentDidMount(){

  }

  render() {
    let leftItem = {
      type:"back"
    };

    return (
      <View style={FlyStyles.container}>
        <FlyHeader title={'银行存管三方协议'} leftItem={leftItem} borderBottom={true} />
         <ScrollView>
            <FlyImage source={agreement} width={dim.width}/>
         </ScrollView>
      </View>
    )
  }
}



var styles = StyleSheet.create({

});

function select(store) {
  return {
  };
}

module.exports = connect(select)(PersonalMTAgreement);
