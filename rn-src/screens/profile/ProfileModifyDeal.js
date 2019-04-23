/**
*
*
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
  NativeAppEventEmitter,
} from 'react-native';
import {
Hidekeyboard,
Showkeyboard,
testCallBack
}from 'fly-react-native-ps-keyboard'


import {connect} from 'react-redux';

const FlyColors = require('FlyColors');
const FlyStyles = require('FlyStyles');
const FlyDimensions = require('FlyDimensions');
const FlyHeader = require('FlyHeader');
const FlyImage = require('FlyImage');
const {Text} = require('FlyText');
const env = require('env');
const dim  = FlyDimensions.deviceDim;
const SceneUtils = require('SceneUtils');
const {getBinding,updatePayPass,sitePayPass,vailPayPass} = require('../../actions');
const Filters = require('Filters');
const FlyBottomButton = require('FlyBottomButton');
const Utils = require('Utils');
const FlyLoading = require('FlyLoading');
const NativeModuleUtils = require('NativeModuleUtils');
const sina = './imgs/myAssets/sina.png'
type Props = {
  navigator: Navigator;
  buildingInfo:Object;
};

class ProfileDealPassWord extends React.Component {
  props : Props;
  constructor(props) {
    super(props);
    


    this.state={
       title:'请输入原交易密码,以验证身份',
       oldPw:'',
       oldCipher:null,
       password:null,
       repeatPW:'',
       cipher:null,
       repateCipher:null,
       repate:false,
       isSame:true,
       isConfirm:false,
       Confirmstatus:true,
       ConfirmDes:'',
    }
    
    
  }

  componentDidMount(){
    
      this.subscription = NativeAppEventEmitter.addListener('sendPassWord',(response)=>{
         this.checkPassWord(response);
        });
            Showkeyboard()


  }

  checkPassWord(response){
       if (this.state.isConfirm) {
          if (this.state.repate==false) {         
          if (response.password.length===6) {
          this.setState({
          title:'请再次填写以确认交易密码',
          repate:true,
        })
       }
           this.setState({
            password:response.password,
            cipher:response.cipher,
        })
        
        }else{
          this.setState({
            repeatPW:response.password,
            repateCipher:response.cipher
           })
          if (response.password.length===6) {
                this.isMatch()
           }
     
        }
       
          }else{
           if(response.password.length===6){
             Hidekeyboard();
               this.refs.loading.open()
              let params = {
               oldPassword:response.cipher
                }
         
            let promise  = this.props.dispatch(vailPayPass(params))

                promise.then((data) => {

                  this.refs.loading.close()
                  
                  if (data&&data===true) {
                       Showkeyboard()
                     this.setState({
                     isConfirm:true,
                     title:'请输入新交易密码,用于支付验证',
                     Confirmstatus:true,
                   })
                  }else{
                       Showkeyboard()
                      this.setState({
                      Confirmstatus:false,
                     })

                  }
                       

                }).catch((error) => {
                    this.refs.loading.close()
                });
           }

             this.setState({
              oldPw:response.password,
              oldCipher:response.cipher,
             })
          
          }
  }


   isMatch(){

    if (!(this.state.cipher==this.state.repateCipher)) {

      this.setState({
        isSame:false,
        repeatPW:null,
        repateCipher:null,
      })
    }else{

      let params ={
        oldPassword:this.state.oldCipher,
        newPassword:this.state.cipher,
        confirmPassword:this.state.repateCipher,
      }
      let promises = this.props.dispatch(updatePayPass(params));
        promises.then((data)=>{
      
         if(data){
          Hidekeyboard()
          SceneUtils.goBack();
         this.setState({
           isSame:true
          })
      }

        }).catch((err)=>{

        })

  
    }
}
    _renderPwd(password){
      let authCode = password;
      let authcItem = [];
      for (var i = 0; i < 6; i++) {
        authcItem.push(
          <View key={i}>
            <View style={{backgroundColor:'white',justifyContent:'center',borderWidth:0.5,borderColor:'rgba(177,177,177,1)',height:50,width:50}}>
              <Text style={{fontSize:FlyDimensions.fontSizeH1,textAlign:'center'}}>{authCode[i]}
              </Text>
            </View>
          </View>
        )
      }
      return authcItem;
    }

  render() {
    let leftItem = {
      type: "back",
      onPress:()=>{
         Hidekeyboard()
         SceneUtils.goBack();
      }
    };

     let passWord;
     if (this.state.isConfirm) {
          passWord=this.state.repate?this.state.repeatPW:this.state.password;
     }else{
          passWord=this.state.oldPw;
     }
    
     let prompt;
     if (this.state.isConfirm){
      if (this.state.isSame) {
           prompt=null;
        }else{

        prompt=(
           <View>
             <Text>
              俩次密码不一致
             </Text>
           </View>
          )
        }
     }else{
        if (this.state.Confirmstatus){
          prompt =null
        }else{
          prompt=(
           <View>
             <Text>
                密码错误
             </Text>
           </View>
          )

        }       
     }


    return(
      <View style={FlyStyles.container}>
        <FlyHeader
          title="修改交易密码"
          borderBottom={true}
          leftItem={leftItem}/>
         <View style={styles.Container}> 
            <View style={{marginTop:50}}>
              <Text style={styles.desTitle}>{this.state.title}</Text>
            </View>
            <View style={{flexDirection:'row',marginTop:100}}>
             {this._renderPwd(passWord)}
             </View>
            {prompt}
         </View> 
         <FlyLoading ref="loading" />
    </View>
    );
  }
  componentWillUnmount(){
     this.subscription.remove()
  }


}

var styles = StyleSheet.create({

  desTitle:{
    color:FlyColors.baseColor,
    fontSize:FlyDimensions.fontSizeXxl
  },
  Container:{
   alignItems:'center',
   backgroundColor:FlyColors.baseBackgroundColor,
   flex:1
  },
  passWord:{
    marginTop:100,
    backgroundColor:'white',
    width:dim.width*0.8,
    height:50,
    justifyContent:'center'
  }


});

function select(store) {
  return {

  };
}

module.exports = connect(select)(ProfileDealPassWord);
