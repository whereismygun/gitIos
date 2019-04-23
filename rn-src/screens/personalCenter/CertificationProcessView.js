/**
*
* @providesModule
* @flow
*
*/
'use strict';

import React from 'react';

import ReactNative, {
  StyleSheet,
  Navigator,
  View,
  ScrollView,
  ListView,
  TouchableOpacity,
  InteractionManager,
  DeviceEventEmitter,
  TextInput,
  NativeAppEventEmitter,
} from 'react-native';

import {
Hidekeyboard,
Showkeyboard,
Encryption,
}from 'fly-react-native-ps-keyboard'


import {connect} from 'react-redux';

const FlyEditableScrollView = require('FlyEditableScrollView')
const FlyLabelItem = require('FlyLabelItem')
const FlyTimerButton =require('FlyTimerButton')
const FlyColors = require('FlyColors');
const FlyStyles = require('FlyStyles');
const FlyDimensions = require('FlyDimensions');
const FlyHeader = require('FlyHeader');
const FlyImage = require('FlyImage');
const FlyButton = require('FlyButton');
const FlyItem = require('FlyItem');
const {Text} = require('FlyText');
const FlyBase = require('FlyBase')
const env = require('env');
const FlyModalBox = require('FlyModalBox');
const dim  = FlyDimensions.deviceDim;
const {sendMTBindCardCode,checkUserOCRToMT,selectBankInfo,activateMTUser,sitePayPass,getPasswordFactor,findUserStatus,getBinding,confirmBind} = require('../../actions');

const SceneUtils = require('SceneUtils');
const Filters = require('Filters');
const FlyBottomButton = require('FlyBottomButton');
const Utils = require('Utils');
const FlyLoading = require('FlyLoading');
const CertificationBox = require("CertificationBox");
const NativeModuleUtils = require('NativeModuleUtils');
const FlyTextInput = require('FlyTextInput');
const sina = './imgs/myAssets/sina.png'
const closeImg = './imgs/login/close.png';
const bankImge = './imgs/financing/bindBankCard.png';
const certification = './imgs/financing/certification.png'

const bindBank_bt = './imgs/certification/bindBank_bt.png';
const bindBank = './imgs/certification/bindBank.png';
const bindID_bt = './imgs/certification/bindID_bt.png';
const bindID = './imgs/certification/bindID.png';
const certification_bg = './imgs/certification/Certification_bg.png';
const bindBank_bg = './imgs/certification/bindBank_bg.png';
const copy = './imgs/certification/copy.png'
const ocr = './imgs/certification/ocr.png';
const complete = './imgs/certification/select.png'
const uncomplete = './imgs/personCenter/uncomplete.png'
const agreeH = './imgs/login/agree.png';
const agreeN = './imgs/login/combinedShape.png';
const upload = './imgs/certification/upload.png';



const scale = Math.min(dim.width / 375, 1);

const Steps = [
    {
      title:'实名认证',
    },
    {
      title:'绑定银行卡',
    },
    {
      title:'设置密码',
    }
]

type Props = {
  navigator: Navigator;
  title:String;
  stup:number;
};

class CertificationProcessView extends React.Component {
  props : Props;
  constructor(props) {
    super(props);

     (this:any)._checkNext = this._checkNext.bind(this);
     (this:any)._submit = this._submit.bind(this);
     (this:any).accIdValidate = this.accIdValidate.bind(this);
     (this:any)._submitToCertification = this._submitToCertification.bind(this);


    this.state={
       realName:null,
       identityCode:null,
       bankName:null,
       bankAccNo:null,
       msgCode:null,
       phone:'',
       title:this.props.title,
       factor:null,
       newPassword:null,
       newPassword_cipher:null,
       surePassword:null,
       surePassword_cipher:null,
       img0:uncomplete,
       img1:uncomplete,
       img2:uncomplete,
       step:this.props.step,
       agree:true
    }     
  }


    componentDidMount() {
      InteractionManager.runAfterInteractions(() => {
      this.bankName = DeviceEventEmitter.addListener(env.ListenerMap['CHOOSE_BANK_NAME'],(data)=>{
        this.setState({
          bankName:data.bankName,
          bankCode:data.id
          });
      });
    });

        let promise = this.props.dispatch(getPasswordFactor());
        promise.then((data) => {
          this.setState({
          factor:data,
         })
        });

      this.checkImgStatus(this.props.step)
      this.subscription = NativeAppEventEmitter.addListener('sendPassWord',(response)=>{
           if (response.type=='new') {
             this.setState({
             newPassword:response.password,
             newPassword_cipher:response.cipher,
           });

         }else if (response.type=='new_repeat'){
          this.setState({
            surePassword:response.password,
            surePassword_cipher:response.cipher,
          });
         }
     });
  }


  render(){
    let back = {
        type: 'back',
         onPress:()=>{
              Hidekeyboard()
              SceneUtils.goBack()
            }
        };    return (
        <View style={{flex:1,backgroundColor:FlyColors.baseBackgroundColor}}>
            <FlyHeader borderBottom={true} title={this.state.title} leftItem={back} backgroundColor={FlyColors.white} />
               {this.renderSteps()}
               {this.renderInputContent()}
               {this.renderOcrBox()}
              <FlyLoading ref="loading" text='请稍等,信息提交中...'/>
         </View>   
        )

   }


   renderInputContent(){

     switch (this.state.step) {
         case 0 :
          return this.renderCertification()
         case 1 :
          return this.renderBank()
         default: 
          return this.renderPassWord()
     }
   }


   renderCertification(){
     
    return(
        <View  style={{marginTop:10,alignItems:'center'}}> 
          <View  style={{overflow:'hidden',borderWidth:1,borderColor:'rgba(230,230,230,1)',borderRadius:5,justifyContent:'center',alignItems:'center'}}> 
                 <FlyTextInput labelWidth={80}
                     text={'真实姓名:'}
                     textStyle={{fontSize:10}}
                     placeholder={'请输入本人真实姓名'}
                     placeholderTextColor={FlyColors.baseTextColor2}
                     height={55}
                     style={{width:dim.width-30,height:55}}
                     onChangeText={(text) => this.setState({realName: text})}/>      
               <FlyTextInput labelWidth={80}
                     text={'身份证号:'}
                     placeholder={'请输入本人的身份证号码'}
                     placeholderTextColor={FlyColors.baseTextColor2}
                     height={60}
                     showSegment={true}
                     style={{width:dim.width-30,height:65}}
                     onChangeText={(text) => this.setState({identityCode: text})}/>
           </View>
          {this.renderClickBt()}
        </View>

      )
   }

   accIdValidate(){
   
       if (this.checkMobile()) {
         this.refs.timer.start(true);
        let promise = this.props.dispatch(sendMTBindCardCode({phone:this.state.phone}));
        promise.then((data)=>{
        }).catch((err)=>{
          Utils.error('抱歉，发送验证码失败，' + err.msg)
        });
      }
    }
   

   renderBank(){
    let otherTextStyle,bankName;
        bankName = this.state.bankName ? this.state.bankName : '点击获取开户行';
       if (Utils.isEmpty(this.state.bankName)) {
         otherTextStyle = {color: FlyColors.placeholderTextColor};
       }
       bankImge = <FlyImage source={complete} width={10} /> 

    return(
        <FlyEditableScrollView contentContainerStyle={{marginTop:10,marginLeft:15,marginRight:15}}>
                <View style={{overflow:'hidden',borderWidth:1,borderColor:'rgba(230,230,230,1)',borderRadius:5}}>
                  <FlyTextInput labelWidth={80}
                     text={'银行卡号:'}
                     textStyle={{fontSize:10}}
                     placeholder={'请输入本人储蓄卡'}
                     placeholderTextColor={FlyColors.placeholderTextColor}
                     height={55}
                     style={{width:dim.width-30,height:55}}
                     onChangeText={(text) => this.setState({bankAccNo: text})}/> 
                  <FlyTextInput labelWidth={80}
                     text={'手机号码:'}
                     textStyle={{fontSize:10}}
                     placeholder={'请输入银行预留手机号'}
                     placeholderTextColor={FlyColors.placeholderTextColor}
                     height={60}
                     style={{width:dim.width-30,height:60}}
                     showSegment={true}
                     onChangeText={(text) => this.setState({phone: text})}/>
                   <View style={{marginLeft:20,width:dim.width*0.85,height:0.5,backgroundColor:'rgba(216,216,216,1)'}}/>
                    <FlyLabelItem labelWidth={80} text="开户行:" otherTextStyle={otherTextStyle} otherText={bankName}
                           hideArrowIcon={false} showSegment={true} onPress={()=>{this._chooseBank()}}>
                    </FlyLabelItem>    
                   <FlyTextInput text="验证码:" labelWidth={80}  placeholder="请填写短信验证码"
                           keyboardType="numeric"  maxLength={6} onChangeText={(text) => this.setState({msgCode: text})}>
                  <FlyTimerButton ref="timer" startSelf={true} countdown={60} text="获取验证码"  type={'gray'}  size={'xl'} style={styles.validateBtn} onPress={()=>this.accIdValidate()}/>
                  </FlyTextInput>
                 </View> 
                 {this.renderClickBt()}               
          </FlyEditableScrollView>
      )
   }


  _chooseBank(){
    let bankCode = this.state.bankCode;
    SceneUtils.gotoScene('PROFILE_CHOOSE_BANK_NAME',{bankCode:bankCode});
  }
   renderPassWord(){

      return(
        <View style={{marginTop:30}}> 
          <View style={{overflow:'hidden',borderWidth:1,borderColor:'rgba(230,230,230,1)',borderRadius:5,marginLeft:15,marginRight:15}}>
                  <FlyLabelItem canEdit={true} labelWidth={70} text="交易密码:" showSegment={true} style={{height:55}}>
                      <TextInput onFocus={()=>{
                        Encryption({type:'new',factor:this.state.factor}) }} style={styles.textInput} placeholder="请输入6位数字交易密码" maxLength={6} secureTextEntry={true} defaultValue={this.state.newPassword} />
                  </FlyLabelItem>
                  <FlyLabelItem canEdit={true} labelWidth={70} text="重复密码:" style={{height:55}}>
                      <TextInput onFocus={()=>{
                        Encryption({type:'new_repeat',factor:this.state.factor})}} style={styles.textInput} placeholder="请再次输入交易密码" maxLength={6} secureTextEntry={true} defaultValue={this.state.surePassword}/>
                  </FlyLabelItem>     
          </View>
          {this.renderClickBt()}
        </View>
        )
   }

   renderClickBt(){
     let allow ;
     let agreeImg = this.state.agree == true ? agreeH : agreeN;
      if (this.state.step == 1) {
        allow = (
            <View style={[styles.agree]} >
             <TouchableOpacity onPress={()=>{this.setState({agree:!this.state.agree})}} activeOpacity={1}>
                <FlyImage source={agreeImg} width={15}/>
             </TouchableOpacity>
             <TouchableOpacity style={{flexDirection:"row"}} onPress={()=>{SceneUtils.gotoScene('PERSONAL_MT_AGREEMENT')}}>
                <Text style={styles.agreeTitle}>同意</Text>
                <Text style={[styles.agreeTitle,{color:FlyColors.baseColor}]}>《三方存管协议》</Text>
             </TouchableOpacity>
          </View>
          )
      }
     return(
          <View>
            <View style={{alignItems:'center',marginTop:50}}>
              <FlyButton
                 text='下一步'
                 onPress={this._submit}
                 disabled={!this._checkNext()}
                 type='base'
                 style={styles.btn} />
            </View>
            {allow}
            <View style={{alignItems:'center',marginTop:25,marginLeft:16,marginRight:16}}>
              <FlyImage source={copy} width={dim.width*0.9}/>
            </View>
          </View>
      )
   }
   _submit(){
          switch (this.state.step) {
         case 0 :
          return this._submitToCertification()
         case 1 :
          return this._submitToBindBank()
         default: 
          return this._submitToPassWord()
     }

   }


   _submitToPassWord(){

       this.refs.loading.open()
      if (this.state.newPassword_cipher!==this.state.surePassword_cipher) {
        Utils.alert('抱歉,俩次密码不一致,请重新输入');
        this.refs.loading.close()
      }else if(this.state.newPassword.length<6||this.state.surePassword.length<6){
        Utils.alert('抱歉,请设置6位密码');
        this.refs.loading.close()
      } else{
       let params ={
        password:this.state.newPassword_cipher,
        confirmPassword:this.state.surePassword_cipher,
      }
       let promises = this.props.dispatch(sitePayPass(params));  
        promises.then((data) => {   
              this.props.dispatch(findUserStatus())
              this.refs.loading.close()
              Hidekeyboard()
              SceneUtils.goBack();     
        }).catch((err) => {
              Utils.alert(err.msg);
             this.refs.loading.close()
        });
      }
 

   }

   _submitToBindBank(){
        this.refs.loading.open()
        let params={
          bankCode:this.state.bankAccNo,
          phone:this.state.phone,
          smsCode:this.state.msgCode,
          bankInfoId:this.state.bankCode,
        }
        let promise = this.props.dispatch(confirmBind(params));
        promise.then((data)=>{
        this.refs.loading.close()
        this.reloadView()
        this.props.dispatch(findUserStatus())
        let pro = this.props.dispatch(getBinding());
        pro.then((data)=>{
        if (data && (data.items.length==1 || !this.props.selectBankInfo)) {
               this.props.dispatch(selectBankInfo(data[0]))
            }      
           })
        }).catch((err)=>{
          this.refs.loading.close()
          Utils.error(err.msg||'抱歉，绑定失败');
        });

   }


   _submitToCertification(){


         let params = {
          realName:this.state.realName,
          identityCode:this.state.identityCode,
           }
          this.refs.loading.open()
          let promise = this.props.dispatch(activateMTUser(params));
          promise.then((data)=>{
               this.reloadView()
               this.props.dispatch(findUserStatus())
               this.refs.loading.close() 
               this.bindOCR.open()
                  }).catch((err)=>{ 
             this.refs.loading.close()
             Utils.info('激活失败',"亲，"+err.msg);
          })
          
   }


   renderOcrBox(){


     return(
           <FlyModalBox numberPostion={10} ref={(bindOCR)=>{this.bindOCR=bindOCR}} style={styles.ModuleStyle}>
               <FlyImage style={{justifyContent:'flex-end'}} source={upload} width={dim.width*0.8}>
                 <View style={{flexDirection:'row',width:dim.width*0.8,height:40}}>
                  <TouchableOpacity style={[styles.ModuleBt,{borderRightWidth:1}]} onPress={()=>{this.bindOCR.close()}}>
                      <Text>以后上传</Text>
                   </TouchableOpacity>
                  <TouchableOpacity style={styles.ModuleBt} onPress={()=>{
                   this.bindOCR.close()
                   SceneUtils.gotoScene('PERSONAL_ID_READER')}}>
                      <Text>立即上传</Text>
                   </TouchableOpacity>
                  </View>
                </FlyImage>
          </FlyModalBox>         
             )

   }

   reloadView(){
     if (this.state.step == 0 ) {
       this.setState({step:1,title:'绑定银行卡'})
        this.checkImgStatus(1)
     }else if (this.state.step == 1) {
      this.setState({step:2,title:'设置交易密码'})
      this.checkImgStatus(2)
     }else {
      SceneUtils.goBack()
     }
   }


   _checkNext(){
      
    if (this.state.step == 0 && this.checkCertification()) {
      return true;
    }else if (this.state.step == 1 && this.checkCardInfo() ) {
      return true;
    }else if (this.state.step == 2 && this.checkPassWord()){
      return true;
    }else{
      return false;
    }
  }


  checkPassWord(){
   
    if (this.state.surePassword_cipher&&this.state.newPassword_cipher) {
      return true
    }
    return false

  }


    checkCertification() {
      if (Utils.isEmpty(this.state.realName)) {
          return false;
      }
      if (Utils.isEmpty(this.state.identityCode)) {
          return false;
      }
      return true;
  }

  checkCardInfo() {

    if(Utils.isEmpty(this.state.bankName)) {
        return false;
    }if (Utils.isEmpty(this.state.bankAccNo)) {
        return false;
    }if(!Utils.checkMobile(this.state.phone)){
        return false;
    }if(Utils.isEmpty(this.state.msgCode)){
        return false;
    }if (!this.state.agree) {
        return false;
    }
    return true;
}
 

 checkMobile(){
   if(!Utils.checkMobile(this.state.phone)){
       Utils.alert('手机号码有误,请重新填写');
        return false;
    }
    return true;
 }

   renderSteps(){

      let content = Steps.map((item,index)=>{
        return this.renderStepStyle(item,index) 
      });

    return(
      <View style={{marginBottom:20}}>
        <View style={[styles.rowStyle,{marginTop:35}]}>
            {content}
        </View>
        <View style={[styles.rowStyle,{alignItems:'center'}]}>
           <View style={styles.tipsText}>
              <Text style={styles.TextStyle}>实名认证</Text>
           </View>
           <View style={styles.tipsText}>  
              <Text style={styles.TextStyle}>银行卡绑定</Text>
           </View>
           <View style={styles.tipsText}>  
              <Text style={styles.TextStyle}>设置交易密码</Text>
           </View> 
        </View>
       </View> 
      )
   }

   checkImgStatus(index){
      if (index == 0){
          this.setState({
            img0:complete,
            img1:uncomplete,
            img2:uncomplete,
          })
      }else if (index == 1){
           this.setState({
            img0:complete,
            img1:complete,
            img2:uncomplete,
           })
      }else {
           this.setState({
            img0:complete,
            img1:complete,
            img2:complete,
           })
      }
   }

   renderStepStyle(item,index){
   
          
         switch (index) {
            case 0:
            let color_fir ='#cccccc';
             if (this.state.step >= 0 ) {
                color_fir = FlyColors.baseColor
             }

              return (
                <View style={styles.tipsContent}>
                     <FlyImage source={this.state.img0} width={25}/>
                     <View style={[styles.lineStyle,{backgroundColor:color_fir,marginLeft:10}]}/>
                </View>
                )
            case 1:
             let color_sec ='#cccccc';
             if (this.state.step >= 1 ) {
                color_sec = FlyColors.baseColor
             }
    
               return (
                  <View style={styles.tipsContent}>
                     <View style={[styles.lineStyle,{backgroundColor:color_sec,marginRight:10}]}/>
                     <FlyImage source={this.state.img1} width={25}/>
                     <View style={[styles.lineStyle,{backgroundColor:color_sec,marginLeft:10}]}/>
                 </View>
                )
            default:

              let color_thir ='#cccccc';
             if (this.state.step == 2 ) {
                color_thir = FlyColors.baseColor
             }
                return(
                  <View style={styles.tipsContent}>
                      <View style={[styles.lineStyle,{backgroundColor:color_thir,marginRight:10}]}/>
                      <FlyImage source={this.state.img2} width={25}/>
                     </View>
                  )

         }
   }



  componentWillUnmount() {
    this.subscription.remove()
    if (this.bankName) {
      this.bankName.remove()
    }
  }
}

var styles = StyleSheet.create({

   lineStyle:{
      width:40,
      height:1,

   },
   tipStyle:{
     width:24,
     height:24,
     borderRadius:12
   },
   tipsContent:{
     flexDirection:'row',
     justifyContent:'center',
     alignItems:'center'
   },
   tipsText:{
    flex:1,
    alignItems:'center',
    marginTop:15
   },
   TextStyle:{
   color:'rgba(116,116,116,1)',
   fontSize:FlyDimensions.fontSizeLarge
   },
   rowStyle:{
    flexDirection:'row',
    justifyContent:'center'
   },
   btn:{
    width:dim.width-30,
    height:45
   },
   statement:{
    fontSize:FlyDimensions.fontSizeS0,
    color:FlyColors.baseTextColor2
   },
   validateBtn: {
    height: 30,
    marginTop: 10,
    width:dim.width * 0.25,
    marginRight: 15,
    borderRadius:4,
    backgroundColor:'white'
  },
    textInput: {
      height: 50,
      fontSize: FlyDimensions.fontSizeXl,
      marginTop: 2,
  },
    labelItemW:{
      width:dim.width,
  },
   agree:{
    flexDirection:'row',
    marginTop:10,
    height:40,
    alignItems:'center',
    marginLeft:5,
    width: FlyDimensions.deviceDim.width,
  },
    agreeTitle:{
    fontSize:FlyDimensions.fontSizeBase,
    marginLeft:5
  },
  ModuleStyle:{
   width:dim.width*0.8,
   height:dim.height*0.4,
   borderRadius:10,
   alignItems:'center',
   backgroundColor:'transparent'
  },
  ModuleBt:{
  justifyContent:'center',
  alignItems:'center',
  borderColor:'rgba(216,216,216,1)',
  borderTopWidth:1,
  flex:1
  }





});

function select(store) {
  return {
    
  };
}

module.exports = connect(select)(CertificationProcessView);
