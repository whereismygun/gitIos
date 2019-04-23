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
const {getEwallet} = require('../../actions');
const NativeModuleUtils = require('NativeModuleUtils');
const FlyModalBox = require('FlyModalBox');
const close = './imgs/base/close.png';
const updateBg = "./imgs/base/updateBg.png";
const combinedShape = "./imgs/myAssets/combinedShape.png";
const NetworkService = require('NetworkService');
const Utils = require('Utils');
const {Text} = require('FlyText');
const FlyItem = require('FlyItem');
const FlyContainer = require('FlyContainer');
const dim = FlyDimensions.deviceDim;
const Filters = require('Filters');

type Props = {
  navigator: Navigator;
};

class ProfileTotalAmount extends React.Component {
  props: Props;

  constructor(props) {
    super(props);
    (this: any)._renderContent = this._renderContent.bind(this);

    this.state = {
      ewalletInfo:null,
      loadStatus:'loading'
    }
  }


  componentDidMount() {
    let that = this;
    InteractionManager.runAfterInteractions(()=>{
      let promise = that.props.dispatch(getEwallet(true));
      promise.then((data)=>{
        that.setState({
          ewalletInfo:data,
          loadStatus:'loaded'
        });
      }).catch((err)=>{

      });
    });
  }

  componentWillUnmount() {

  }

  _renderContent(){
    let ewalletInfo = this.state.ewalletInfo;
      let arr = [
        {
          backgroundColor:'#EF7266',
          title:'可用余额',
          otherText:Filters.moneyFixed(ewalletInfo.totalAmount),
          hideArrowIcon:true,
          onPress:null,
        },
        {
          backgroundColor:'#518BEF',
          title:'投资资产',
          otherText:Filters.moneyFixed(ewalletInfo.freezeAmount),
          hideArrowIcon:true,
          onPress:null,
        },
        {
          backgroundColor:'#64C2B2',
          title:'我的收益',
          otherText:Filters.moneyFixed(ewalletInfo.investAmount) || "0",
          hideArrowIcon:false,
          onPress:()=>SceneUtils.gotoScene('MY_INCOME_VIEW')
        },
        {
          backgroundColor:'#CD82F2',
          title:'我的优惠',
          otherText:"",
          hideArrowIcon:false,
          onPress:()=>SceneUtils.gotoScene('MY_COUPON_VIEW')
        },
        {
          backgroundColor:'#FF9455',
          title:'我的提现',
          otherText:"",
          hideArrowIcon:false,
          onPress:()=>SceneUtils.gotoScene('PROFILE_WITH_DRAWALS')
        },
      ];

      let content = arr.map((item,idx)=>{
        let view = (
          <View key={idx} style={{alignItems:'center',flexDirection:'row',height:50}}>
            <View style={{height:10,width:10,backgroundColor:item.backgroundColor}}></View>

            <Text style={styles.title}>{item.title}
            </Text>
          </View>
        )
        return(
          <FlyItem key={idx} showSegment={true} hideArrowIcon={item.hideArrowIcon} view={view} otherText={item.otherText} onPress={item.onPress}/>
        )
      });

      let allAmount = ewalletInfo.totalAmount + ewalletInfo.freezeAmount;
      return(
        <ScrollView style={{flex:1}}>
          <View style={styles.shapeContianer}>
            <FlyImage source={combinedShape} width={dim.width * 0.5} style={styles.shape}>
              <Text style={styles.totalText}>总资产(元)</Text>
              <Text style={styles.totalAmount}>{Filters.keepFixed(allAmount)}
              </Text>
            </FlyImage>
          </View>
          <View style={{backgroundColor:FlyColors.baseTextColor3,height:5}}>
          </View>
          {content}
        </ScrollView>
      )

  }

  render() {
    let leftItem = {
      type:'back'
    };


    return (
      <View style={FlyStyles.container}>
        <FlyHeader title={'资产总览'} borderBottom={true} leftItem={leftItem}/>
        <FlyContainer loadStatus={this.state.loadStatus} renderContent={this._renderContent}/>
      </View>
    )
  }
}



var styles = StyleSheet.create({
  title:{
    marginLeft:10,
    fontSize:FlyDimensions.fontSizeXl
  },
  shape:{
    justifyContent:'center',
    alignItems:'center',
    marginBottom:dim.width * 0.08,
  },
  shapeContianer:{
    alignItems:'center',
    marginTop:dim.width * 0.08,
  },
  totalText:{
    fontSize:FlyDimensions.fontSizeLarge,
    color:FlyColors.baseTextColor2,
    backgroundColor:'rgba(0,0,0,0)'
  },
  totalAmount:{
    fontSize:FlyDimensions.fontSizeH1,
    marginTop:5,
    backgroundColor:'rgba(0,0,0,0)'
  }
});

function select(store) {
  return {

  };
}

module.exports = connect(select)(ProfileTotalAmount);
