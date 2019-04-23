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
  ActivityIndicator
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
const {moneyFixed,percentage,financeStatus} = require('Filters');
const {checkBasicInfo,isAgent} = require('../../actions');
const FlyListContainer = require('FlyListContainer');
const FlyPureListView = require('FlyPureListView');
const FlyProgress = require('FlyProgress');

type Props = {
  navigator: Navigator;
};

class FinancingCoupon extends React.Component {
  props: Props;

  constructor(props) {
    super(props);
    (this:any)._showCoupon = this._showCoupon.bind(this);
    (this:any)._showCouponTop = this._showCouponTop.bind(this);
    (this:any)._selectCoupon = this._selectCoupon.bind(this);
    (this:any)._notUseCoupon = this._notUseCoupon.bind(this);



    this.ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.state = {

    }
  }


  componentDidMount() {
    let that = this;
    InteractionManager.runAfterInteractions(() =>{


    });
  }

  componentWillUnmount(){

  }

  _showCouponTop(){
    if(this.props.couponList&&this.props.couponList.length>0){
      return (
        <TouchableOpacity style={styles.topItem} onPress={() => {this._notUseCoupon()}}>
          <Text style={{flex:1,paddingLeft:15}}>不使用返现红包</Text>
          {(this.props.defaultCoupon == '无可用返现红包')?<FlyImage source='./imgs/withdrawals/investmentFailure.png' width={15} style={{marginRight:15}}/> :
          <FlyImage source='./imgs/withdrawals/investmentSuccess.png' width={15} style={{marginRight:15}}/>}
        </TouchableOpacity>
      );
    }
    if(!this.props.couponList || this.props.couponList.length==0){
      <View style={styles.topItem}>
        <Text style={{flex:1,paddingLeft:15}}>抱歉，暂无返现红包</Text>
      </View>
    }
  }


  _showCoupon(){
    if(this.props.couponList && this.props.couponList.length>0){
      let couponItems = this.props.couponList.map((data,index) => {
          return (
            <TouchableOpacity key={"coupon_"+index} onPress={() => {this._selectCoupon(data)}}>
              <FlyImage source='./imgs/discount/bg.png' style={styles.FlyImageStyle}>
                <View style={styles.leftView}>
                  <Text style={{fontSize:FlyDimensions.fontSizeLarge}}>{data.ruleString}</Text>
                  <Text style={[styles.textStyle,styles.middleText]}>{data.couponName}</Text>
                  <View style={{flexDirection:'row'}}>
                    <Text style={styles.textStyle}>{data.beginTime.substr(0,10)}</Text>
                    <Text style={[styles.textStyle,styles.specialLine]}>~</Text>
                    <Text style={styles.textStyle}>{data.endTime.substr(0,10)}</Text>
                  </View>
                </View>
                <View style={{flex:2,backgroundColor: 'rgba(0,0,0,0)',justifyContent:'center',alignItems:'center'}}>
                  <Text style={{color:FlyColors.white,fontSize:FlyDimensions.fontSizeH1}}><Text style={{color:FlyColors.white,fontSize:FlyDimensions.fontSizeXl}}>￥</Text>{data.amount}</Text>
                  <Text style={{color:FlyColors.white,}}>返现红包</Text>
                </View>
              </FlyImage>
            </TouchableOpacity>
          );
      })
      return couponItems;
    }
  }

// 点击 发送监听
  _selectCoupon(data){
    if(data.mark=="USABLE"){
      DeviceEventEmitter.emit(env.ListenerMap['SELECT_FINANCING_COUPON'],data);
      SceneUtils.goBack();
    }
  }

  // 不使用优惠券
  _notUseCoupon(){
     DeviceEventEmitter.emit(env.ListenerMap['SELECT_FINANCING_COUPON']);
     SceneUtils.goBack();
  }

  render(){
    let leftItem = {
      layout: "icon",
      onPress: this._close,
      type: 'back'
    };
    return (
      <View style={FlyStyles.container}>
        <FlyHeader title={'我的返现红包'} borderBottom={true} leftItem={leftItem}/>
        <ScrollView style={{backgroundColor:FlyColors.baseBorderColor}}>
          <View>
            {this._showCouponTop()}
            {this._showCoupon()}
          </View>
        </ScrollView>
      </View>
    );
  }

}

var styles = StyleSheet.create({
  topItem:{
    backgroundColor:FlyColors.white,
    flexDirection:'row',
    width:dim.width*0.9,
    marginLeft:dim.width*0.05,
    marginRight:dim.width*0.05,
    paddingTop:10,
    paddingBottom:10,
    marginTop:10,
  },
  FlyImageStyle:{
    flexDirection:'row',
    marginLeft:dim.width*0.05,
    marginRight:dim.width*0.05,
    marginTop:15,
    paddingTop:8,
    paddingBottom:5,
  },
  leftView:{
    flex:4,
    paddingLeft:10,
    paddingRight:10,
    backgroundColor: 'rgba(0,0,0,0)'
  },
  rightView:{

  },
  textStyle:{
    fontSize:FlyDimensions.fontSizeBase,
    color:FlyColors.baseTextColor2,
    backgroundColor:FlyDimensions.transparent
  },
  middleText:{
    paddingTop:3,
    paddingBottom:3
  },
  specialLine:{
    paddingLeft:2,
    paddingRight:2
  },
  moneyStyle:{

  }
});

function select(store) {
  return {
    isLoggedIn : store.user.isLoggedIn,
  };
}

module.exports = connect(select)(FinancingCoupon);
