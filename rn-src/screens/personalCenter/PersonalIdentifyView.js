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
const {findUserStatus,getUserInfo,activateMTUser} = require('../../actions');
const NativeModuleUtils = require('NativeModuleUtils');
const FlyIconfonts = require('FlyIconfonts')
const FlyModalBox = require('FlyModalBox');
const close = './imgs/base/close.png';
const updateBg = "./imgs/base/updateBg.png";
const NetworkService = require('NetworkService');
const Utils = require('Utils');
const {Text} = require('FlyText');
const LISTVIEWREF = 'listview';
const FlyTextInput = require('FlyTextInput');
const FlyEditableScrollView = require('FlyEditableScrollView');
const FlyButton = require('FlyButton');
const  FlyItem = require('FlyItem');
const FlyLabelItem = require('FlyLabelItem');
const FlyLoading = require('FlyLoading');

type Props = {
  navigator: Navigator;
};

class PersonalIdentifyView extends React.Component {
  props: Props;

  constructor(props) {
    super(props);
    (this: any).doSubmit = this.doSubmit.bind(this);
    (this: any).check = this.check.bind(this);
    this.state = {
      realName:null,
      sex:null,
      identityCode:null,
      nationality:null,
      signOffice:null,
      validTime:null,
      address:null,
      topImg:null,
      bottomImg:null,

      // phone: null
    }
  } 

  componentDidMount(){
   this.props.dispatch(getUserInfo(true));
     this.Listene = DeviceEventEmitter.addListener(env.ListenerMap['PERSONAL_ID_ENTIFY_VIEW'],(response)=>{
       if (response.reback) {

           this.setState({
              identityCode:response.cardInfo[0],
              topImg:response.cardInfo[1],
              bottomImg:response.cardInfo[2],
           })
       }else{
           this.setState({
              realName:response.info[0].kOpenSDKCardResultTypeCardItemInfo.kCardItem1,
              sex:response.info[0].kOpenSDKCardResultTypeCardItemInfo.kCardItem2,
              identityCode:response.cardInfo[0],
              nationality:response.info[0].kOpenSDKCardResultTypeCardItemInfo.kCardItem3,
              signOffice:response.info[1].kOpenSDKCardResultTypeCardItemInfo.kCardItem15,
              validTime:response.info[1].kOpenSDKCardResultTypeCardItemInfo.kCardItem7,
              address:response.info[0].kOpenSDKCardResultTypeCardItemInfo.kCardItem5,
              topImg:response.cardInfo[1],
              bottomImg:response.cardInfo[2],
           })
       }
     });

  }

  doSubmit(){
    if (this.check()) {
      let params = {
      realName:this.state.realName,
      sex:this.state.sex,
      identityCode:this.state.identityCode,
      nationality:this.state.nationality,
      signOffice:this.state.signOffice,
      validTime:this.state.validTime,
      address:this.state.address,
      }
      this.refs.loading.open()
      let promise = this.props.dispatch(activateMTUser(params));
     promise.then((data)=>{
      this.props.dispatch(findUserStatus())
      this.refs.loading.close()
      Utils.alert('亲,恭喜您已经认证成功!');
      SceneUtils.gotoScene('PROFILE_ADD_BANK_CARD',null,'replace');
     }).catch((err)=>{ 
      this.refs.loading.close()
      Utils.info('激活失败',"亲，"+err.msg);
     })
    }


  }

  check() {
      if (Utils.isEmpty(this.state.realName)) {
          Utils.error("亲，姓名不能为空，请输入您的姓名！");
          return false;
      }
      if (Utils.isEmpty(this.state.identityCode)) {
          Utils.error("亲，身份证号不能为空，请输入您的身份证号！");
          return false;
      }
      if (!Utils.checkID(this.state.identityCode)) {
          Utils.error('亲，你输入的身份证号格式错误，请重新输入！');
          return false;
      }
      return true;
  }


  render() {
    let leftItem = {
      type:"back"
    };
    let labelWidth = 80;
    let contentView;
    if (this.props.userStatus&&this.props.userStatus.isCertification) {
      let userInfo = this.props.userInfo;
      if (userInfo) {
        let otherView = (
          <View style={styles.username}>
            <FlyImage source={'./imgs/personCenter/attestation.png'} resizeMode={'contain'} width={20} height={20}/>
            <Text style={styles.otherName}>{userInfo.name}</Text>
          </View>
        );
        contentView = (
          <ScrollView style={{backgroundColor:FlyColors.baseTextColor3}}>
            <FlyItem labelWidth={labelWidth}  showSegment={true} text="姓名" otherView={otherView}/>
            <FlyItem labelWidth={labelWidth}  showSegment={true} text="身份证" otherText={userInfo.identityNo} otherTextColor={'#666666'}/>
            <FlyItem labelWidth={labelWidth}  showSegment={true} text="手机号码" otherText={userInfo.phone} otherTextColor={'#666666'}/>
          </ScrollView>
        )
      }

    }else {
      let reback = this.state.identityCode?true:false;
      let params = {
         idNumber: this.state.identityCode,
         topImg:this.state.topImg,
         bottomImg:this.state.bottomImg,
         reback:reback

      }
      contentView = (
        <FlyEditableScrollView style={{backgroundColor:FlyColors.baseTextColor3}}>
          <FlyTextInput text="姓名:" labelWidth={labelWidth} showSegment={true} placeholder="请输入姓名"
             defaultValue={this.state.realName} onChangeText={(text) => this.setState({realName: text})} />
          <FlyTextInput text="身份证:" labelWidth={labelWidth} showSegment={true}  keyboardType="ascii-capable" placeholder="请输入身份证号码"
            defaultValue={this.state.identityCode} onChangeText={(text) => this.setState({identityCode: text})} editable={true}>        
            </FlyTextInput> 
          <View style={styles.btnWrapper}>
             <FlyButton
               text='提交'
               onPress={this.doSubmit}
               type='base'
               style={styles.btn} />
          </View>
        </FlyEditableScrollView>
      )
    }
    return (
      <View style={FlyStyles.container}>
        <FlyHeader title={'实名认证'} leftItem={leftItem} borderBottom={true} />
        {contentView}
        <FlyLoading ref="loading" text="请稍等..."/> 
      </View>
    )
  }
}



var styles = StyleSheet.create({
  btnWrapper:{
    alignItems:'center',
    marginTop:FlyDimensions.deviceDim.width * 0.2
  },
  btn: {
    width: FlyDimensions.deviceDim.width * 0.9,
    height:44
  },
  username:{
    flexDirection:'row',
    alignItems:"center",
    height:50
  },
  otherName:{
    fontSize:FlyDimensions.fontSizeLarge,
    marginLeft:5,
    color:'#666666'
  }
});

function select(store) {
  return {
    userInfo:store.user.userInfo,
    userStatus:store.user.userStatus,
  };
}

module.exports = connect(select)(PersonalIdentifyView);
