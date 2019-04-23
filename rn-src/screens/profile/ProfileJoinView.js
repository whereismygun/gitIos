/**
 *
 *
 * @flow
 *
 */
'use strict';
import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Navigator,
  View,
  ScrollView,
  Alert,
  InteractionManager,
  TouchableOpacity,
  DeviceEventEmitter,
  TextInput,

} from 'react-native';


import {connect} from 'react-redux';

const {
  getDelegate,Apply,buyAgent,userGetApply,sendCode,reApply,getDelegateInfo,getEwallet
} = require('../../actions');

const FlyTimerButton =require('FlyTimerButton')
const FlyContainer = require('FlyContainer');
const FlyColors = require('FlyColors');
const FlyStyles = require('FlyStyles');
const NetworkService = require('NetworkService');
const FlyDimensions = require('FlyDimensions');
const FlySysNotice = require('FlySysNotice');
const FlyHeader = require('FlyHeader');
const FlyImage = require('FlyImage');
const FlyButton = require('FlyButton');
const Filters = require('Filters');
const Utils = require('Utils');
const {Text} = require('FlyText');
const FlyTextInput = require('FlyTextInput');
const SceneUtils = require('SceneUtils');
const dim=FlyDimensions.deviceDim;
const join = './imgs/join/copy.png';
const env = require('env');
const UrlHelper = require('UrlHelper');
const FlyModalBox = require('FlyModalBox');
const agentImg = './imgs/join/agent.png';
const approved = './imgs/join/approved.png';
const waitingAudit = './imgs/join/waitingAudit.png';
const paidSuccess = './imgs/join/paidSuccess.png';
const TimerMixin = require('react-timer-mixin');
const FlyEditableScrollView = require('FlyEditableScrollView')


type Props = {
  navigator: Navigator;
  getUser: Object;
  userUs: Object;
};

class ProfileJoinView extends React.Component {
  props : Props;

  constructor(props) {
      super(props);

      (this:any).userNameChange=this.userNameChange.bind(this);
      (this:any).userPhoneChange=this.userPhoneChange.bind(this);
      (this:any).mainContent=this.mainContent.bind(this);
      (this : any).setTimeout = TimerMixin.setTimeout.bind(this);
      this.code=null;
  this.state = {
    joinState:null,
    agentProductId:null,
    userName:null,
    userPhone:null,
    areaCode:null,
    areaName:null,
    cityCode:null,
    cityName:null,
    provinceCode:null,
    provinceName:null,
    isRefused:false,
    loadStatus:'loading',
    agent:false,
    phone:null,
    join:join
  }

  }

  componentDidMount(){
    this.reloadData();
    let that = this
    InteractionManager.runAfterInteractions(()=>{
      that.listener = DeviceEventEmitter.addListener(env.ListenerMap['ADDRESS_CHOOSE_PCA'], (pca) => {
        that.setState({
          areaCode:pca.areaCode,
          areaName:pca.areaName,
          cityCode:pca.cityCode,
          cityName:pca.cityName,
          provinceCode:pca.provinceCode,
          provinceName:pca.provinceName,
        });

      });
    });
   
  }

  reloadData(){
    this.props.dispatch(getEwallet(true));
    let promises = this.props.dispatch(getDelegateInfo());
    promises.then((data)=>{
      this.setState({
        phone:data.phone
      });
    if (data.agent === true) {
    this.setState({
      agent:data.agent,
      loadStatus:'loaded',
      join:agentImg
    });
  } else {
    let promise = this.props.dispatch(getDelegate());
    promise.then((data)=>{
    this.setState({
          agentProductId:data.id
        });
     })
     let pro = this.props.dispatch(userGetApply());
     pro.then((data)=>{
       this.setState({
         joinState:data,
         loadStatus:'loaded'
       });
       if (data) {
         this.setState({
           isRefused:data.refused
         });
       }
       if (data.refused) {
         Utils.alert('抱歉，您的私人赢行申请没有通过,原因:'+data.auditMemo+'非常感谢您的支持，如有疑问，请致电VIP客服：0571-81958816')
       }

     });

  }
    });


  }
   renderFillInfo(){

     let address ;
     if (this.state.areaName&&this.state.cityName&&this.state.provinceName) {
       address=this.state.provinceName+this.state.cityName+this.state.areaName
     }else {
        address='请选择省市区'
     }
     return(
       <View style={styles.textContain}>
       <FlyTextInput labelWidth={70}
                     text={'姓名:'}
                     placeholder={'请填写真实姓名'}
                     placeholderTextColor={FlyColors.baseTextColor2}
                     height={45}
                     style={styles.inputText}
                     onChangeText={this.userNameChange}/>

        <FlyTextInput labelWidth={70}
                      text={'号码:'}
                      placeholder={this.state.phone}
                      placeholderTextColor={FlyColors.baseTextColor2}
                      editable={false}
                      style={styles.inputText}
                      height={45}
                      onChangeText={this.userPhoneChange}/>

        <TouchableOpacity  onPress={()=>SceneUtils.gotoScene('ADDRESS_SELECT_PCA_VIEW')}>
         <FlyTextInput labelWidth={70}
                       editable={false}
                       height={45}
                       text={'省市区:'}
                       placeholderTextColor={FlyColors.baseTextColor2}
                       placeholder={address}
                       style={styles.inputText}/>
        </TouchableOpacity>
      </View>
     );
   }


   renderJoinState(){
     let contain;

     if (this.state.joinState === null&&this.state.agent===false) {
       contain=(
           <View>
          {this.renderFillInfo()}
           </View>
       )
     }else {
       if (this.state.joinState&&this.state.joinState.waitingAudit){
         contain=(
           <View style={{alignItems:'center',marginTop:30}}>
              <FlyImage source={waitingAudit} width={40} />
              <Text style={{marginTop:15}}>资料已提交成功,请等待审核</Text>
           </View>
         )
       }
       if(this.state.joinState&&this.state.joinState.refused) {

          contain = (
            <View>
              {this.renderFillInfo(this.state.joinState.refused)}
             </View>
          )
       }
       if (this.state.joinState&&this.state.joinState.approved) {

           contain=(
             <View style={{alignItems:'center',marginTop:30}}>
                 <FlyImage source={approved} width={40} />
                 <Text style={{marginTop:10}}>您的资料已审核通过</Text>
                 <Text style={{marginTop:5}}>支付保证金即可成为私人银行行长</Text>
                <TouchableOpacity style={styles.clickPayBt} onPress={()=>this.payment()}>
                       <Text style={styles.payTextDes}>支付成为行长</Text>
                </TouchableOpacity>
             </View>
           )
       }
       if (this.state.joinState&&this.state.joinState.paidSuccess) {
         contain=(
            <View style={{alignItems:'center',marginTop:35}}>
               <FlyImage source={paidSuccess} width={270}/>
            </View>
         )
       }
       if (this.state.agent){

         contain=null;
       }

     }

      return(
      <View>
       {contain}
      </View>
      )
   }

  lessTip(){
       return(
        <FlyModalBox ref={'lessTip'} style={{borderRadius:10,width:dim.width*0.8,height:dim.height*0.3}}>
            <View style={{borderTopLeftRadius:10,borderTopRightRadius:10,justifyContent:'center',alignItems:'center',width:dim.width*0.8,height:dim.height*0.08,backgroundColor:FlyColors.baseColor}}> 
               <Text style={{color:'white'}}>提示</Text>
            </View>
            <View style={{flex:1}}>
                 <View style={{flex:2,justifyContent:'center',alignItems:'center'}}>
                    <Text style={{fontSize:FlyDimensions.fontSizeXxl,color:FlyColors.baseTextColor2}}>您的账户余额不足,请前往充值</Text>
                 </View>
                 <View style={{flex:1,flexDirection:'row'}}>
                    <TouchableOpacity style={{borderColor:FlyColors.baseTextColor3,flex:1,justifyContent:'center',alignItems:'center',borderTopWidth:1}} onPress={()=>this.refs.lessTip.close()}>
                       <Text style={{fontSize:FlyDimensions.fontSizeXxl,color:FlyColors.baseTextColor2}}>取消</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{borderColor:FlyColors.baseTextColor3,flex:1,justifyContent:'center',alignItems:'center',borderTopWidth:1,borderLeftWidth:1}} onPress={()=>{
                      SceneUtils.gotoScene('PROFILE_RECHARGE');
                      this.refs.lessTip.close();
                    }}>
                        <Text style={{fontSize:FlyDimensions.fontSizeXxl,color:FlyColors.baseColor}}>立即充值</Text>
                    </TouchableOpacity>
                 </View>
            </View>
        </FlyModalBox>
        )

   }
    join(){
     if(Utils.isEmpty(this.code)){
       Utils.alert('请输入验证码！');
       return;
     }
     let params ={
          code : this.code
     }
     let promise = this.props.dispatch(buyAgent(params));
     promise.then((data)=>{
       if(data){
            this.reloadData();
            this.refs.payTip.close()
       }else {
         Utils.alert('服务器繁忙！')
       }
     }).catch((err)=>{
       Utils.alert(err.msg || '服务器繁忙！')
      })
   }

   getCode(){

   let promise = this.props.dispatch(sendCode())
   this.refs.timer.start(true)
   promise.then((data)=>{

   }).catch((err)=>{
    Utils.alert('验证码发送失败,请稍后重新尝试')
   })
   }

   payTip(){

       let phone ;
   if (this.props.userInfo&&this.props.userInfo.phone) {
     phone = this.props.userInfo.phone;
   }

      return(
           <FlyModalBox ref={'payTip'} style={{width:dim.width,height:dim.height,backgroundColor:'transparent',alignItems:'center'}}>
            <FlyEditableScrollView contentContainerStyle={{width:dim.width,height:dim.height,backgroundColor:'transparent',alignItems:'center'}}>
             <View style={{marginTop:dim.height*0.3,backgroundColor:'white',borderRadius:10,width:dim.width*0.8,height:dim.height*0.4}}>
            <View style={{borderTopLeftRadius:10,borderTopRightRadius:10,justifyContent:'center',alignItems:'center',width:dim.width*0.8,height:dim.height*0.08,backgroundColor:FlyColors.baseColor}}> 
               <Text style={{color:'white'}}>提示</Text>
            </View>
            <View style={{flex:1}}>
                 <View style={{flex:3,alignItems:'center'}}>
                    <Text style={{marginLeft:10,marginRight:10,fontSize:FlyDimensions.fontSizeXxl,marginTop:20,color:FlyColors.baseTextColor2}}>支付验证码短信发送至{phone}请输入正确验证码进行开通</Text>
                    <View style={{flexDirection:'row',alignItems:'center',marginTop:15,width:dim.width*0.7,height:dim.height*0.07,backgroundColor:FlyColors.baseBackgroundColor}}>
                        <TextInput/>
                        <TextInput
                          style={{width:dim.width*0.42}}
                          onChangeText={(text) => this.code = text}
                         
                         />
                         <FlyTimerButton ref="timer" startSelf={true} countdown={60} text="获取验证码" style={{backgroundColor:FlyColors.baseBackgroundColor,height:20,width:90}} type={'gray'} size={'xl'} onPress={()=>{
                          this.getCode()
                          }}/>
                    </View>
                 </View>
                 <View style={{flex:1,flexDirection:'row'}}>
                    <TouchableOpacity style={{borderColor:FlyColors.baseTextColor3,flex:1,justifyContent:'center',alignItems:'center',borderTopWidth:1}} onPress={()=>this.refs.payTip.close()}>
                       <Text style={{fontSize:FlyDimensions.fontSizeXxl,color:FlyColors.baseTextColor2}}>取消</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{borderColor:FlyColors.baseTextColor3,flex:1,justifyContent:'center',alignItems:'center',borderTopWidth:1,borderLeftWidth:1}} onPress={()=>{
                      this.join()
                      }}>
                        <Text style={{fontSize:FlyDimensions.fontSizeXxl,color:FlyColors.baseColor}}>确认开通</Text>
                    </TouchableOpacity>
                 </View>
            </View>
            </View>
            </FlyEditableScrollView>
        </FlyModalBox>      
          )
   }

   payment(){
    let ewalletInfo = this.props.ewalletInfo;
     let totalAmount = 0;
    if (ewalletInfo) {
      totalAmount = Filters.moneyFixedNumber(ewalletInfo.totalAmount);
    }

    if(totalAmount < 30000){
        this.refs.lessTip.open();
      return;
    }
    this.refs.payTip.open();
   }

  render() {
    let leftItem = {
        type: "back",
    };

    return (
      <View style={FlyStyles.container}>
          <FlyHeader leftItem={leftItem} title={"加入我们"} style={FlyStyles.header} borderBottom={true}/>
          <FlyContainer renderContent={this.mainContent} loadStatus={this.state.loadStatus}/>
         {this.lessTip()}
         {this.payTip()} 
      </View>
    );
  }

  mainContent(){

    let joinButton
     if (this.state.joinState===null && this.state.agent===false || this.state.isRefused) {
       joinButton = (
         <TouchableOpacity style={{width:dim.width,alignItems:'center',backgroundColor:FlyColors.baseColor}} onPress={()=>this.clickToJoin()}>
               <Text style={{paddingTop:15,paddingBottom:15,color:'white'}}>我要加盟</Text>
         </TouchableOpacity>
       )
     }
    return(
      <View style={{flex:1}}>
      <ScrollView>
          <FlyImage ref={'imgae'} source={this.state.join} width={dim.width}>
          {this.renderJoinState()}
          </FlyImage>
      </ScrollView>
       {joinButton}


      </View>
    )
  }


 clickToJoin(){


  if (!this.state.userName) {
    Utils.alert('请输入姓名');
  }else if (!this.state.provinceCode) {
    Utils.alert('请选择省市区');
  }else {
    let params = {
      agentProductId:this.state.agentProductId,
      city:this.state.cityCode,
      district:this.state.areaCode,
      province:this.state.provinceCode,
      userName:this.state.userName
    }
      let promise
     if (this.state.isRefused) {
         promise = this.props.dispatch(reApply(params));
     }else {
         promise = this.props.dispatch(Apply(params));
     }


    promise.then((data)=>{
      Utils.alert('申请成功，等待审核');
      this.reloadData();
    }).catch((err)=>{
     Utils.alert(err.msg||'服务器繁忙');
    });
  }

 }

 userNameChange(text){
   this.setState({
     userName:text
   })
 }
 userPhoneChange(text){
   this.setState({
     userPhone:text
   })
 }


  componentWillUnmount() {
      if (this.listener) {
        this.listener.remove();
      }
  }
}

var styles = StyleSheet.create({

  inputText:{
  backgroundColor:FlyColors.baseBackgroundColor,
  marginBottom:15
 },
  addressTouchable:{
    width:100,
    height:100,
    borderWidth:1,
    flexDirection:'row',
    backgroundColor:'rgba(56,56,56,1)',

  },
  textContain:{
    marginLeft:30,
    marginRight:30,
    marginTop:30
  },
  clickPayBt:{
    borderColor:FlyColors.baseColor,
    borderWidth:1,
    marginTop:15
  },
  payTextDes:{
    color:FlyColors.baseColor,
    paddingTop:5,
    paddingBottom:5,
    paddingLeft:25,
    paddingRight:25
  }

});

function select(store) {
  return {
    userInfo:store.user.userInfo,
    ewalletInfo:store.profile.ewalletInfo,
  };
}

module.exports = connect(select)(ProfileJoinView);
