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
  NativeAppEventEmitter
} from 'react-native';


import {
Hidekeyboard,
Showkeyboard,
Encryption,
}from 'fly-react-native-ps-keyboard'


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
const {sendMTBindCardCode,confirmUnBinding,selectBankInfo,getPasswordFactor,findUserStatus,getBinding,confirmBind,unbindBankCard} = require('../../actions');
const NativeModuleUtils = require('NativeModuleUtils');
const FlyModalBox = require('FlyModalBox');
const close = './imgs/base/close.png';
const updateBg = "./imgs/base/updateBg.png";
const NetworkService = require('NetworkService');
const Utils = require('Utils');
const {Text} = require('FlyText');
const LISTVIEWREF = 'listview';
const closeImg = './imgs/login/close.png'
const FlyEditableScrollView = require('FlyEditableScrollView');
const FlyLabelItem = require('FlyLabelItem');
const FlyTextInput = require('FlyTextInput');
const FlyTimerButton = require('FlyTimerButton');
const FlyButton = require('FlyButton');
const FlyLoading = require('FlyLoading')
const dim = FlyDimensions.deviceDim;
type Props = {
  navigator: Navigator;
  buildInfo:Object;
  type:string;
};

class ProfileAddBankCard extends React.Component {
  props: Props;

  constructor(props) {
    super(props);
    (this: any)._chooseBank = this._chooseBank.bind(this);
    (this: any).accIdValidate = this.accIdValidate.bind(this);
    (this: any).doSubmit = this.doSubmit.bind(this);

    this.state = {
      bankAccNo:null,
      bankName:null,
      msgCode:null,
      bankCode:null,
      phone:null,
      passCipher:null,
      passWord:'',
      factor:null,
    }
  }


  componentDidMount() {
    this.props.dispatch(findUserStatus())
    let that = this;
    InteractionManager.runAfterInteractions(() => {
      that.bankName = DeviceEventEmitter.addListener(env.ListenerMap['CHOOSE_BANK_NAME'],(data)=>{
        that.setState({
          bankName:data.bankName,
          bankCode:data.id
          });
      });
    });
       this.props.dispatch(findUserStatus())
        let promise = this.props.dispatch(getPasswordFactor());
      promise.then((data) => {
          this.setState({
          factor:data
         })
    });   
      this.subscription = NativeAppEventEmitter.addListener('dealPassWord',(response)=>{
          
           if (response.password.length==6) {     
               this.setState({
                  passCipher:response.cipher
               })
               this.doUnBind()
            }else{
              this.setState({
                  passWord:response.password
              })
            }

       })
   
  }

  componentWillUnmount() {

    this.subscription.remove()
    if (this.bankName) {
      this.bankName.remove()
    }
  }
closeModule(){
    Hidekeyboard()
    this.refs.password.close()

  }
  doUnBind(){
        let params = {
          pwd:this.state.passCipher,
          bindingInfoId:this.props.buildInfo.accId,
      }
      this.refs.loading.open()
       let promise = this.props.dispatch(unbindBankCard(params))
         promise.then((data) => {
        let pro = this.props.dispatch(getBinding())
        pro.then((data) => {
            if (data && (data.items.length==1 || this.props.buildInfo.accId == this.props.selectBankInfo.accId)) {
               this.props.dispatch(selectBankInfo(data[0]))
            }
        })
       DeviceEventEmitter.emit(env.ListenerMap['PROFILE_UNBIND_BANK']);
       this.refs.loading.close()
       Hidekeyboard()
       SceneUtils.goBack()
     }).catch((err)=>{
       this.refs.loading.close()
        Utils.alert(err.msg || '服务繁忙')
     })

    
   }



  renderPassWord(){
       
  return (
           <FlyModalBox ref={'password'} positionNumber={150} style={styles.passwordModule}>
               <View style={styles.passwordHeader}>
                 <TouchableOpacity onPress={()=>{this.closeModule()}} style={{position:'absolute',left:15,top:20}} >
                  <FlyImage source={closeImg} width={15} />
                 </TouchableOpacity>
                  <Text style={{fontSize:FlyDimensions.fontSizeXxl}}>请输入交易密码</Text>
               </View>
               <View style={styles.passwordBottom}>
                   <Text style={{marginTop:dim.height*0.05,fontSize:FlyDimensions.fontSizeLarge,color:FlyColors.baseTextColor2}}>解绑银行卡</Text>
                      <View style={{flexDirection:'row'}}>
                     {this._renderPwd()}
                     </View>
               </View>
             </FlyModalBox>       
          )
  }

   _renderPwd(){
      let authCode = this.state.passWord;
      let authcItem = [];
      let borderStyle = null;
      for (var i = 0; i < 6; i++) {
        if (i==0) {
          borderStyle={borderWidth:1,borderTopLeftRadius:5,borderBottomLeftRadius:5}
         }else if(i==5){
          borderStyle={borderTopWidth:1,borderRightWidth:1,borderBottomWidth:1,borderTopRightRadius:5,borderBottomRightRadius:5}
         }else{
          borderStyle={borderTopWidth:1,borderRightWidth:1,borderBottomWidth:1}
         }
        authcItem.push(
          <View key={i}>
            <View style={[styles.passwordBorder,borderStyle]}>
              <Text style={{fontSize:FlyDimensions.fontSizeXxl,textAlign:'center'}}>{authCode[i]}
              </Text>
            </View>
          </View>
        )
      }
      return authcItem;
    }

  _chooseBank(){
    let bankCode = this.state.bankCode;
    SceneUtils.gotoScene('PROFILE_CHOOSE_BANK_NAME',{bankCode:bankCode});
  }

  doSubmit(){
        let buildInfo = this.props.buildInfo;
    if(buildInfo && buildInfo.type == 'unBound'){

    if (this.props.userStatus&&!this.props.userStatus.isSitePass){
         SceneUtils.gotoScene('PROFILE_DEAL_PASS_WORD',null,'replace')
    }else{
       this.refs.password.open()
        Showkeyboard({factor:this.state.factor,deal:true})
    }

    }else {
      if (this.checkCardInfo() && this.checkAutoCode()) {
        let params={
          bankCode:this.state.bankAccNo,
          phone:this.state.phone,
          smsCode:this.state.msgCode,
          bankInfoId:this.state.bankCode,
        }
        this.refs.loading.open()
        let promise = this.props.dispatch(confirmBind(params));
        promise.then((data)=>{
          this.refs.loading.close()
          let pro = this.props.dispatch(getBinding());
              pro.then((data)=>{
           if (data && (data.items.length==1 || !this.props.selectBankInfo)) {
               this.props.dispatch(selectBankInfo(data[0]))
            }      
           })

        if (this.props.userStatus&&!this.props.userStatus.isSitePass){
            SceneUtils.gotoScene('PROFILE_DEAL_PASS_WORD',null,'replace')
          }else{
            if (this.props.isselect){
              DeviceEventEmitter.emit(env.ListenerMap['PROFILE_SELECT_BANK']);
            }
             SceneUtils.goBack();
            
          }
        }).catch((err)=>{
          this.refs.loading.close()
          Utils.error(err.msg||'抱歉，绑定失败');
        });
      }

    }
  }

  checkAutoCode(){
    if(Utils.isEmpty(this.state.msgCode)){
        Utils.error('请填写短信验证码');
        return false;
    }
    return true;
  }

  checkCardInfo() {
    if (Utils.isEmpty(this.state.bankName)) {
        Utils.error("请选择相应的银行");
        return false;
    }
    if (Utils.isEmpty(this.state.bankAccNo)) {
        Utils.error("请输入要绑定的银行卡号!");
        return false;
    }
    if (!Utils.checkCardNo(this.state.bankAccNo)) {
        Utils.error("银行卡号输入有误!");
        return false;
    }if(!Utils.checkMobile(this.state.phone)){
         Utils.error("手机号码输入有误")
         return false;
    }
    return true;
}

  accIdValidate(){
    if (this.props.buildInfo && this.props.buildInfo.type == 'unBound') {

    }else {
      if (this.checkCardInfo()) {
         this.refs.timer.start(true);
        let promise = this.props.dispatch(sendMTBindCardCode({phone:this.state.phone}));
        promise.then((data)=>{
        }).catch((err)=>{
          Utils.error('抱歉，发送验证码失败，' + err.msg)
        });
      }
    }

  }

  render() {
    let leftItem = {
      type:'back',
      onPress:()=>{
           Hidekeyboard()
           SceneUtils.goBack()
      }
    };
    let labelWidth = 70,title;
    let bankName,isEdit,bankAccNo,otherTextStyle,onPress;
    let Content = null;
     let buildInfo = this.props.buildInfo;
    if (this.props.buildInfo && this.props.buildInfo.type == 'unBound') {
      bankName = buildInfo.bankName;
      isEdit = false;
      bankAccNo = buildInfo.accNo;
      title = "解除银行卡";

    }else {
      isEdit = true;
       bankName = this.state.bankName ? this.state.bankName : '请选择对应的银行';
       if (Utils.isEmpty(this.state.bankName)) {
         otherTextStyle = {color: FlyColors.placeholderTextColor};
       }
       title = "绑定银行卡";
       onPress = () => this._chooseBank();
       Content=(
          <View>
            <FlyTextInput text="手机号" labelWidth={labelWidth} showSegment={true} editable={isEdit} keyboardType="numeric" placeholder="请填写手机号码"
               defaultValue={bankAccNo} onChangeText={(text) => this.setState({phone: text})} />

              <FlyTextInput text="验证码" labelWidth={labelWidth}  placeholder="请填写短信验证码"
                           keyboardType="numeric" maxLength={6} onChangeText={(text) => this.setState({msgCode: text})}>
                  <FlyTimerButton ref="timer" startSelf={true} countdown={60} text="获取验证码"  type={'gray'}  size={'xl'} style={styles.validateBtn} onPress={this.accIdValidate}/>
           </FlyTextInput>
           </View>
        )
    }

    return (
      <View style={FlyStyles.container}>
        <FlyHeader title={title} leftItem={leftItem} borderBottom={true} />
        <FlyEditableScrollView style={{backgroundColor:FlyColors.baseTextColor3}}>
            <FlyLabelItem labelWidth={labelWidth} showSegment={true} text="开户行"  otherText={bankName} otherTextStyle={otherTextStyle}
                           hideArrowIcon={!isEdit} onPress={onPress}/>
            <FlyTextInput text="银行卡号" labelWidth={labelWidth} showSegment={true} editable={isEdit} keyboardType="numeric" placeholder="请填写银行卡号"
               defaultValue={bankAccNo} onChangeText={(text) => this.setState({bankAccNo: text})} />
               {Content}
           <View style={styles.btnWrapper}>
               <FlyButton
                 text='提交'
                 onPress={this.doSubmit}
                 disabled={false}
                 type='base'
                 style={styles.btn} />
           </View>
        </FlyEditableScrollView>
        {this.renderPassWord()}
       <FlyLoading ref={'loading'} text={'请稍等..'}/> 
      </View>
    )
  }
}



var styles = StyleSheet.create({
  validateBtn: {
    height: 30,
    marginTop: 10,
    width:dim.width * 0.25,
    marginRight: 15,
    borderRadius:4,
    backgroundColor:'white'
  },
  btn: {
    width: FlyDimensions.deviceDim.width * 0.9,
    height:45
  },
  btnWrapper:{
    alignItems:'center',
    marginTop:FlyDimensions.deviceDim.width * 0.15
  },
   passwordBorder:{
   backgroundColor:'white',
   justifyContent:'center',
   borderColor:'rgba(177,177,177,1)',
   height:dim.height*0.06,
   width:dim.width*0.12,
   marginTop:20
  },
  ModuleStyle:{
   width:dim.width*0.8,
   height:dim.height*0.4,
   borderRadius:10
  },
    passwordModule:{
   width:dim.width*0.8,
   height:dim.height*0.35,
   borderRadius:10
  },
    passwordHeader:{
   backgroundColor:'white',
   width:dim.width*0.8,
   height:dim.height*0.08,
   borderTopLeftRadius:10,
   borderTopRightRadius:10,
   justifyContent:'center',
   alignItems:'center'
  },
    passwordBottom:{
   backgroundColor:FlyColors.baseBackgroundColor,
   width:dim.width*0.8,
   height:dim.height*0.27,
   borderBottomLeftRadius:10,
   borderBottomRightRadius:10,
   alignItems:'center'
  },

});

function select(store) {
  return {
     userStatus:store.user.userStatus,
     selectBankInfo:store.user.selectBankInfo,
  };
}

module.exports = connect(select)(ProfileAddBankCard);
