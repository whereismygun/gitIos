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
  ScrollView,
  ProgressViewIOS,
  ActivityIndicator,
  TextInput
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
const FlyItem = require('FlyItem');
const FlyViewPager = require('FlyViewPager');
const {queryUserInvestmentByUnderlyId} = require('../../actions');
const NativeModuleUtils = require('NativeModuleUtils');
const FlyModalBox = require('FlyModalBox');
const close = './imgs/base/close.png';
const updateBg = "./imgs/base/updateBg.png";
const NetworkService = require('NetworkService');
const Utils = require('Utils');
const {Text} = require('FlyText');
const LISTVIEWREF = 'listview';
const dim = FlyDimensions.deviceDim;
const FlyContainer = require('FlyContainer');
const FlyBottomButton = require('FlyBottomButton');
const FlyRefreshListView = require('FlyRefreshListView');
const {moneyFixed,percentage,financeStatus,scheduleType,keepFixed} = require('Filters');
const {checkBasicInfo,calculateProfit} = require('../../actions');
const FinancingIntroduce = require('./FinancingIntroduce');   //项目简介
const FinancingRepaymentPlan = require('./FinancingRepaymentPlan');   //还款计划
const FlyListContainer = require('FlyListContainer');
const FlyPureListView = require('FlyPureListView');
const FlyProgress = require('FlyProgress');
const FlyShare = require('FlyShare');
const bankImg = './imgs/financing/bindBankCard.png'
const cerImg = './imgs/financing/certification.png'
const ok = './imgs/profile/ok.png'


type Props = {
  navigator: Navigator;

};

class FinancingStatus extends React.Component {
  props: Props;

  constructor(props) {
    super(props);

    this.state = {

    }
  }
  

  render() {
    let leftItem = {
        type: 'back'
    };
    let FirstOnPress=null
    let SecondOnPress=null


    if (this.props.onPress_frist) {
       FirstOnPress=(
          <TouchableOpacity style={styles.ButtonStyle} onPress={this.props.onPress_frist}>
              <Text style={styles.ButtonText}>{this.props.Top_Title}</Text>
          </TouchableOpacity>
        )
    }
    if (this.props.onPress_second){
        SecondOnPress=(
           <TouchableOpacity style={[styles.ButtonStyle,{marginTop:30,backgroundColor:'white',borderColor:'rgba(220,220,220,1)',borderWidth:1}]} onPress={this.props.onPress_second}>
               <Text style={[styles.ButtonText,{color:FlyColors.baseColor}]}>{this.props.Middle_Title}</Text>
          </TouchableOpacity>
          )
    }
     return(
        <View style={FlyStyles.container}> 
            <FlyHeader leftItem={leftItem} title={this.props.title} borderBottom={true}/>
            <View style={{flex:1,alignItems:'center'}}>
             <FlyImage source={ok} style={{marginTop:71}} width={70}/>
             <Text style={{marginTop:25,fontSize:FlyDimensions.fontSizeXxxl}}>{this.props.des}</Text>
             {FirstOnPress}
             {SecondOnPress}
            </View>
        </View>
       )
    }
  }






var styles = StyleSheet.create({
 
   ButtonStyle:{
       marginTop:100,
       backgroundColor:FlyColors.baseColor,
       justifyContent:'center',
       alignItems:'center',
       width:340,
       height:50
   },
   ButtonText:{
      fontSize:FlyDimensions.fontSizeXxxl,
      color:'white'
   },
});

function select(store) {
  return {

  };
}

module.exports = connect(select)(FinancingStatus);
