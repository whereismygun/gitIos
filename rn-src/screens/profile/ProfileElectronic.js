
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
const FlyContainer = require('FlyContainer');
const FlyBase = require('FlyBase');
const FlyColors = require('FlyColors');
const CertificationBox = require('CertificationBox');
const FlyStyles = require('FlyStyles');
const FlyItem = require('FlyItem');
const FlyDimensions = require('FlyDimensions');
const FlyImage = require('FlyImage');
const SceneUtils = require('SceneUtils');
const env = require('env');
const FlyHeader = require('FlyHeader');
const {getBinding,chargeUserAccount,selectBankInfo,getElectaccount,chargeFromEAccount,getPasswordFactor,findUserStatus,getEwallet} = require('../../actions');
const NativeModuleUtils = require('NativeModuleUtils');
const FlyModalBox = require('FlyModalBox');
const NetworkService = require('NetworkService');
const Utils = require('Utils');
const {Text} = require('FlyText');
const dim = FlyDimensions.deviceDim;
const FlyTextInput = require('FlyTextInput');
const FlyButton = require('FlyButton');
const FlyEditableScrollView = require('FlyEditableScrollView');
const UrlHelper = require('UrlHelper');
const closeImg = './imgs/login/close.png'
const FlyLoading = require('FlyLoading');
const bankImge = './imgs/financing/bindBankCard.png';
const certification = './imgs/financing/certification.png';
const MTSafe = './imgs/profile/MTSafe.png'


type Props = {
  navigator: Navigator;
  type:string;
};

class ProfileElectronic extends React.Component {
  props: Props;

  constructor(props) {
    super(props);
    // (this: any).goRecharge = this.goRecharge.bind(this);
    (this: any).mainContent = this.mainContent.bind(this);

    this.state = {
      money:null,
      factor:null,
      passWord:'',
      passCipher:null,
      loadStatus:'loading',
      totalAmount:null,
      elecAcctAmount:null,
      elecAcct:null,
      warnDesc:'',
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    let next = nextProps;
    let moment = this.props;

    if (moment.userStatus&&(moment.userStatus.isCertification!=next.userStatus.isCertification||moment.userStatus.isTiedCard!=next.userStatus.isTiedCard||moment.userStatus.isSitePass!=next.userStatus.isSitePass)) {
         this.props.dispatch(findUserStatus())
     }

  }
  componentDidMount() {
     
      this.reloadData();

      // this.subscription = NativeAppEventEmitter.addListener('dealPassWord',(response)=>{
          
      //      if (response.password.length==6) {     
      //          this.setState({
      //             passCipher:response.cipher
      //          })
      //          this.CheckPassWord()
      //       }else{
      //         this.setState({
      //             passWord:response.password
      //         })
      //       }

      //  });
  }

  reloadData(){

       let Electaccount = this.props.dispatch(getElectaccount());

         Electaccount.then((data)=>{
         
              this.setState({
              	 elecAcct:data.elecAcct,
              	 elecAcctAmount:data.elecAcctAmount,
              	 totalAmount:data.totalAmount,
                 warnDesc:data.warnDesc,
              	 loadStatus:'loaded'
              })
         }).catch((err)=>{

         });

      this.props.dispatch(findUserStatus())
      let promise = this.props.dispatch(getPasswordFactor());
      promise.then((data) => {
          this.setState({
          factor:data,
        
         })
    });
  }




 // updateSelectBank(){
 //    let promise = this.props.dispatch(getBinding())
 //    let bankList,selectBank;
 //    promise.then((data) => {
 //    bankList=data.items
 //    selectBank=bankList.map((item,index)=>{
 //     if (item.accId===this.props.selectBankInfo.accId){
 //        this.props.dispatch(selectBankInfo(item)) 
 //       }
 //    })      
 //    }).catch((err)=>{})
 // }


  // CheckPassWord(){

  //    let infoID;
  //    if (this.props.selectBankInfo) {
  //     infoID =this.props.selectBankInfo.accId
  //    }
  //   let params = {
  //     chargeAmount:this.state.elecAcctAmount,
  //     paypass:this.state.passCipher,
  //   }
  //   this.refs.loading.open()
  //   this.closeModule()
  //   let promise = this.props.dispatch(chargeFromEAccount(params))
         
  //       promise.then((data)=>{  
  //        this.props.dispatch(getEwallet())   
  //        this.updateSelectBank()
         
  //                 let info={
  //                 title:'充值',
  //                 des:'充值成功',
  //                 status:true,
  //                 Top_Title:'完成',
  //                 onPress_frist:()=>{
  //                   SceneUtils.gotoScene('TAB_VIEW::profile',{timer:true},'replace')
  //                 },
  //               }
  //           this.refs.loading.close()
  //           Hidekeyboard()
  //           SceneUtils.gotoScene('FINANCING_STATUS',info,'replace') 
  //   }).catch((err)=>{
  //           Utils.alert(err.msg||'服务繁忙')
  //           this.refs.loading.close()
  //   })

  //  }




  // goRecharge(){

  //   if (this.props.userStatus&&!this.props.userStatus.isCertification) {
  //        this.refs.bindID.ModuleOpen()
  //      }else if (this.props.userStatus&&!this.props.userStatus.isTiedCard){
  //        this.refs.bindBank.ModuleOpen()
  //     }else if (this.props.userStatus&&!this.props.userStatus.isSitePass){
  //         SceneUtils.gotoScene('PROFILE_DEAL_PASS_WORD',null,'replace')
  //   }else{
  //     if (Number(this.state.money)<100) {
  //       Utils.alert('抱歉,充值金额必须大于100元')
  //     }else{
  //       Showkeyboard({factor:this.state.factor,deal:true})
  //      this.refs.password.open()
  //     }
  //   }

  // }



  closeModule(){
    Hidekeyboard()
    this.refs.password.close()

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
                   <Text style={{marginTop:10,fontSize:FlyDimensions.fontSizeLarge,color:FlyColors.baseTextColor2}}>充值</Text>
                   <Text style={{marginTop:15,fontSize:FlyDimensions.fontSizeH4}}>¥ {this.state.money}</Text> 
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

    submit(){
    	let params = {
    		chargeAmount:this.state.elecAcctAmount
    	}

      let promise = this.props.dispatch(chargeFromEAccount(params));

       promise.then((data)=>{
          Utils.alert('您的电子账户余额成功转入');
       	  this.props.dispatch(getEwallet());
          this.reloadData();
       }).catch((err)=>{
           Utils.alert(err.msg||'服务繁忙')
           // this.refs.loading.close()
       });
    }

    copyText(){
           Utils.alert('复制成功');

           NativeModuleUtils.pasteBoard(this.state.elecAcct);

    }


   mainContent(){
    

      let touchView = (
           <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
             <Text style={{marginRight:10}}>{this.state.elecAcct}</Text>
             <TouchableOpacity style={styles.copyStyle} onPress={()=>this.copyText()}>
                   <Text style={{color:FlyColors.baseColor}}>复制</Text>
             </TouchableOpacity>
           </View>
      	  )
   return(
        <View style={{flex:1,alignItems:'center',backgroundColor:FlyColors.baseBackgroundColor}}>

           <View style={{justifyContent:'center',alignItems:'center',backgroundColor:'white',width:dim.width,height:145}}>
              <FlyImage  source={MTSafe} width={130} />
           </View>
             <FlyItem style={{marginTop:10}}  text="可用余额"   otherText={this.state.totalAmount + '元'}/>
             <FlyItem style={{marginTop:10}}  text="电子账户余额"   otherText={this.state.elecAcctAmount + '元'}/>
           
              <FlyItem  style={{marginTop:10}} text="电子账户账号"  otherView={touchView}/>

              <Text style={{marginLeft:15,marginRight:15,marginTop:10,color:'#666666',fontSize:FlyDimensions.fontSizeS0}}>{'温馨提示: \n\n'+this.state.warnDesc}</Text>
   
       
          <View style={{flex:1,justifyContent:'flex-end'}}>
           <TouchableOpacity onPress={()=>this.submit()} style={{alignItems:'center',width:dim.width,backgroundColor:FlyColors.baseColor}}>
              <Text style={{marginTop:15,marginBottom:15,color:'white'}}>转入可用余额</Text>
           </TouchableOpacity>
           </View>
        </View>
       )

    }

  render() {
     let leftItem = {
      type: "back",
      onPress:()=>{
         Hidekeyboard()
         SceneUtils.goBack();
      }
    };

    return (
      <View style={FlyStyles.container}>
        <FlyHeader title={'存管账户'} leftItem={leftItem} borderBottom={true} />
           <FlyContainer renderContent={this.mainContent} loadStatus={this.state.loadStatus}/>
          {this.renderPassWord()}
            <CertificationBox ref="bindBank" isBank={true}/>
            <CertificationBox ref="bindID" isID={true}/>
            <CertificationBox ref="bindOCR" isOCR={true}/>
          <FlyLoading ref={'loading'} text={'请稍等..'}/> 
      </View>
    )
  }
}



var styles = StyleSheet.create({
  bank:{
    alignItems:'center',
    flexDirection:'row',
    paddingTop:10,
    paddingBottom:10,
    backgroundColor:'white'
  },
  bankName:{
    fontSize:FlyDimensions.fontSizeXl,
    marginBottom:5
  },
  accNo:{
    fontSize:FlyDimensions.fontSizeLarge,
    color:FlyColors.baseTextColor2
  },
  btnWrapper: {
    justifyContent:'center',
    alignItems:'center',
    marginTop:FlyDimensions.deviceDim.width * 0.15,
  },
  btn: {
    width: FlyDimensions.deviceDim.width - 30,
    height:50
  },
  selectBankCard:{
    marginLeft:dim.width*0.29,
    borderWidth:1,
    padding:5,
    borderColor:FlyColors.baseTextColor3
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
   borderRadius:10,
   alignItems:'center'
  },
  copyStyle:{
     borderWidth:1,
     borderColor:FlyColors.baseColor,
     paddingTop:5,
     paddingBottom:5,
     paddingLeft:10,
     paddingRight:10
  }

});

function select(store) {
  return {
    buildingInfo:store.user.buildingInfo,
    userStatus:store.user.userStatus,
    selectBankInfo:store.user.selectBankInfo,
  };
}

module.exports = connect(select)(ProfileElectronic);
