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
  DeviceEventEmitter
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
const {loadEnterTimeInfo} = require('../../actions');
const NativeModuleUtils = require('NativeModuleUtils');
const FlyModalBox = require('FlyModalBox');
const close = './imgs/base/close.png';
const updateBg = "./imgs/base/updateBg.png";
const NetworkService = require('NetworkService');
const Utils = require('Utils');
const {Text} = require('FlyText');
const LISTVIEWREF = 'listview';
const bank = './imgs/rich/bank.png';
const note = './imgs/rich/note.png';
const success = './imgs/rich/success.png';
const dim = FlyDimensions.deviceDim;


type Props = {
  navigator: Navigator;
};

class CashWithdrawal extends React.Component {
  props: Props;

  constructor(props) {
    super(props);
  }


  componentDidMount() {

  }

  componentWillUnmount() {

  }

  _renderCurrent(imgUrl,type,title,details){
    let lineView = (type != 'last') ? (<View style={styles.line}></View>) : null;
    return(
      <View style={{flexDirection:'row'}}>
        <View style={{marginLeft:15}}>
          <FlyImage source={imgUrl} width={50}/>
          {lineView}
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.details}>{details}</Text>
        </View>
      </View>
    )
  }

  render() {
    let leftItem = {
      layout: 'icon',
      icon: 'icon-left-arrow-l',
      onPress: ()=>SceneUtils.gotoScene('TAB_VIEW::profile')
    };
    return (
      <View style={FlyStyles.container}>
        <FlyHeader title={'提现中'} borderBottom={true} leftItem={leftItem}/>
        <View style={{marginTop:15}}>
          {this._renderCurrent(note,'nor','提现申请成功','您的提现已经成功受理')}
          {this._renderCurrent(bank,'nor','银行处理中','下午15:00前提现,T+1日到账;15:00后提现,T+2日到账')}
          {this._renderCurrent(success,'last','提现成功')}
        </View>
      </View>
    )
  }
}



var styles = StyleSheet.create({
  line:{
    height:dim.height * 0.15,
    marginLeft:25,
    backgroundColor:FlyColors.baseColor,
    width:2
  },
  titleContainer:{
    marginTop:10,
    marginLeft:15,
    flex:1
  },
  title:{
    fontSize:FlyDimensions.fontSizeXl,
    marginBottom:10,
  },
  details:{
    fontSize:FlyDimensions.fontSizeLarge,
    color:FlyColors.baseTextColor2,
    paddingRight:15
  }
});

function select(store) {
  return {

  };
}

module.exports = connect(select)(CashWithdrawal);
