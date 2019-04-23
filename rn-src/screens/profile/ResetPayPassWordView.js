import React, {Component} from 'react';
import {
    StyleSheet,
    Navigator,
    View,
    ScrollView,
    TouchableOpacity,
    DeviceEventEmitter,
    InteractionManager,
    Alert,
    Text,
    TouchableWithoutFeedback,
    Keyboard,
    Animated,
    NativeAppEventEmitter
} from 'react-native';
import {
Hidekeyboard,
Showkeyboard,
Encryption,
}from 'fly-react-native-ps-keyboard'

import {connect} from 'react-redux';
const FlyBase = require('FlyBase');
const TextInput = require('TextInput');
const FlyItem = require('FlyItem');
const FlyStyles = require('FlyStyles');
const FlyHeader = require('FlyHeader');
const FlyContainer = require('FlyContainer');
const FlyColors = require('FlyColors');
const FlyDimensions = require('FlyDimensions');
const FlyBottomButton = require('FlyBottomButton');
const Utils = require('Utils');
const SceneUtils = require('SceneUtils');
const TimerMixin = require('react-timer-mixin');
const FlyLabelItem = require('FlyLabelItem');
const FlyImage = require('FlyImage');
const FlyButton = require('FlyButton');
const {getStatusBarHeight} = require('fly-react-native-app-info');
const {updatePassword,resetPassword,getPasswordFactor,updatePayPass} = require('../../actions');

const dim = FlyDimensions.deviceDim;

type Props = {
  navigator: Navigator;
  name:String;
  identityNo:String;
  code:String;
  isReset:bool;

};

class ResetPayPassWordView extends Component {
    constructor(props) {
        super(props);
        (this: any).commit = this.commit.bind(this);
        (this: any).check = this.check.bind(this);
        (this: any).mainContent = this.mainContent.bind(this);

        this.state = {
          password:'',
          password_cipher:null,
          newPassword:'',
          newPassword_cipher:null,
          surePassword:'',
          surePassword_cipher:null,
          factor:null,
          loadStatus:'loading'
        }

    }

 componentDidMount(){
  let promise = this.props.dispatch(getPasswordFactor());

        promise.then((data) => {
          this.setState({
          factor:data,
          loadStatus:'loaded'
         })
        });

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
         }else {
          this.setState({
            password:response.password,
            password_cipher:response.cipher,
          });
          }
     });
  }

      commit(){

        if(this.check()){
       if (!this.props.isReset){
           let params={
            oldPassword:this.state.password_cipher,
            newPassword:this.state.newPassword_cipher,
            confirmPassword:this.state.surePassword_cipher,
           }
        
           let promise = this.props.dispatch(updatePayPass(params));
            promise.then((data) => {
                 Hidekeyboard();
                 SceneUtils.gotoScene('TAB_VIEW::profile')
              }).catch((err)=>{
              Utils.error(err.msg||'服务繁忙');
            })
       }else{
          let params ={
            name:this.props.name,
            identityNo:this.props.identityNo,
            code:this.props.code,
            password:this.state.newPassword_cipher,
            confirmPassword:this.state.surePassword_cipher,
          }
          
          let promises = this.props.dispatch(resetPassword(params));
              promises.then((data)=>{
              Hidekeyboard();
              SceneUtils.gotoScene('TAB_VIEW::profile')
            }).catch((err)=>{
            Utils.error(err.msg||'服务繁忙');
          })
       }
        
  
        }
    }

      check(){
        if (!this.props.isReset) {
          if(Utils.isEmpty(this.state.password)){
          Utils.alert('请输入原密码！');
          return false;
        }
        }
          if(Utils.isEmpty(this.state.newPassword)){
          Utils.alert('请输入新密码！');
          return false;
        }
        if(this.state.newPassword && this.state.newPassword.length <6){
          Utils.alert('密码不能少于6位！');
          return false;
        }
        if(this.state.newPassword_cipher !== this.state.surePassword_cipher){
          Utils.alert('新密码与重复密码不一致！');
          return false;
        }
        return true;
      }

    render() {

        let leftItem = {
            type: 'back',
            onPress:()=>{
              Hidekeyboard()
              SceneUtils.goBack()
            }
        };
        
        let title = this.props.isReset?'重置交易密码':'修改交易密码'

        return (
            <View style={FlyStyles.container}>
                <FlyHeader title={title} leftItem={leftItem} borderBottom={true} />
                 <FlyContainer renderContent={this.mainContent} loadStatus={this.state.loadStatus}/>
              
           </View>
        );
    }

    mainContent(){

        let PassWordContrain =(
                  <FlyLabelItem canEdit={true} labelWidth={70} text="原密码" showSegment={true} style={styles.labelItemW}>
                    <TextInput onFocus={()=>{Encryption({type:'old',factor:this.state.factor})}} style={styles.textInput} placeholder="请输入原密码" maxLength={6} secureTextEntry={true} defaultValue={this.state.password}/>
                  </FlyLabelItem>
              );
          if(this.props.isReset){ 
            PassWordContrain=null
            }

         return (
             <ScrollView style={{backgroundColor:FlyColors.baseTextColor3}}>
                      {PassWordContrain}
                  <FlyLabelItem canEdit={true} labelWidth={70} text="新密码:" showSegment={true} style={styles.labelItemW}>
                      <TextInput onFocus={()=>{Encryption({type:'new',factor:this.state.factor}) }} style={styles.textInput} placeholder="请输入新密码" maxLength={6} secureTextEntry={true} defaultValue={this.state.newPassword} />
                  </FlyLabelItem>
                  <FlyLabelItem canEdit={true} labelWidth={70} text="重复密码" style={styles.labelItemW}>
                      <TextInput onFocus={()=>{Encryption({type:'new_repeat',factor:this.state.factor})}} style={styles.textInput} placeholder="请再次输入新密码" maxLength={6} secureTextEntry={true} defaultValue={this.state.surePassword}/>
                  </FlyLabelItem>
                  <View style={styles.btnWrapper}>
                    <FlyButton text={'提交'} type={'base'} style={styles.btn} onPress={()=>this.commit()}/>
                  </View>
                </ScrollView>
          )

    }

 componentWillUnmount(){
     this.subscription.remove()
  }


}

var styles = StyleSheet.create({
  labelItemW:{
      width:dim.width,
  },
  top:{
    position:'absolute',
    width:dim.width,
    height:FlyDimensions.statusBarHeight,
    backgroundColor:FlyColors.baseBackgroundColor,
    elevation:3,
    position:'absolute',
    top:0
  },
  topToast:{
    position:'absolute',
    width:dim.width,
    height:30,
    backgroundColor:FlyColors.red,
    elevation:2
  },
  textInput: {
      flex:5,
      height: 50,
      fontSize: FlyDimensions.fontSizeXl,
      marginTop: 2,
  },
  btn: {
    width: FlyDimensions.deviceDim.width * 0.9,
    height:45
  },
  btnWrapper:{
    alignItems:'center',
    marginTop:FlyDimensions.deviceDim.width * 0.15
  }
})
function select(store) {
    return {};
}
module.exports = connect(select)(ResetPayPassWordView);
