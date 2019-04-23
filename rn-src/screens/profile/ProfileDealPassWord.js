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
const {getBinding,sitePayPass,getPasswordFactor,findUserStatus} = require('../../actions');
const Filters = require('Filters');
const FlyBottomButton = require('FlyBottomButton');
const Utils = require('Utils');
const FlyLoading = require('FlyLoading');
const NativeModuleUtils = require('NativeModuleUtils');
const sina = './imgs/myAssets/sina.png'
const FlyIconfonts = require('FlyIconfonts');

type Props = {
  navigator: Navigator;
  buildingInfo:Object;
  name:string;
  identityNo:string;
  code:string;
  isReset:bool;
};

class ProfileDealPassWord extends React.Component {
  props : Props;
  constructor(props) {
    super(props);
    

    this.state={
       des:'设置交易密码',
       password:'',
       repeatPW:'',
       cipher:null,
       repateCipher:null,
       repate:false,
       isSame:true,
       factor:null,
    }
    
    
  }

  componentDidMount(){
      
      this.props.dispatch(getBinding());         
      let promise = this.props.dispatch(getPasswordFactor());
      promise.then((data)=>{
            Showkeyboard({
              factor:data
            })
      }).catch((err)=>{

      })
      this.subscription = NativeAppEventEmitter.addListener('sendPassWord',(response)=>{
            
        if (this.state.repate==false) {
          
       if (response.password.length===6) {
          this.setState({
          des:'请再次确认交易密码',
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
       
      });
  }


isMatch(){

    if (!(this.state.cipher==this.state.repateCipher)) {
  
      this.setState({
        isSame:false,
        repeatPW:'',
        repateCipher:null,
      })
    }else{
        this.refs.loading.open()
        let params ={
        password:this.state.cipher,
        confirmPassword:this.state.repateCipher,
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

      this.setState({
        isSame:true
      })
    }
}

    _renderPwd(password){
      let authCode = password;
      let authcItem = [];
      let borderStyle;
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
            <View style={[{backgroundColor:'white',justifyContent:'center',borderColor:'rgba(177,177,177,1)',height:50,width:50},borderStyle]}>
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

    let passWord=this.state.repate?this.state.repeatPW:this.state.password

    let prompt;
    if (this.state.isSame) {
      prompt=null;
    }else{

        prompt=(
           <View style={{marginTop:20,flexDirection:'row',alignItems:'center'}}>
             <FlyIconfonts  style={{marginRight:10}}name={"icon-warning"} size={15}/>
             <Text style={{color:FlyColors.baseTextColor2}}>
              俩次密码输入不一致
             </Text>
           </View>
          )
    }

   
    return(
      <View style={FlyStyles.container}>
        <FlyHeader
          title={'设置交易密码'}
          borderBottom={true}
          leftItem={leftItem}/>
         <View style={styles.Container}> 
            <View style={{marginTop:50}}>
              <Text style={styles.desTitle}>{this.state.des}</Text>
            </View>
            <View style={{flexDirection:'row',marginTop:100}}>
             {this._renderPwd(passWord)}
             </View>
            {prompt}
         </View> 
         <FlyLoading ref="loading" text='正在加载中'/>
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
