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
const FlyDimensions = require('FlyDimensions');
const FlyImage = require('FlyImage');
const SceneUtils = require('SceneUtils');
const env = require('env');
const FlyHeader = require('FlyHeader');
const {getBinding,chargeUserAccount,selectBankInfo,getPasswordFactor,findUserStatus,getEwallet} = require('../../actions');
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


type Props = {
  navigator: Navigator;
  type:string;
};

class ProfileRecharge extends React.Component {
  props: Props;

  constructor(props) {
    super(props);
    (this: any).goRecharge = this.goRecharge.bind(this);
    (this: any).mainContent = this.mainContent.bind(this);

    this.state = {
      money:null,
      factor:null,
      passWord:'',
      passCipher:null,
      loadStatus:'loading',
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
    
     let getBank = this.props.dispatch(getBinding());

       getBank.then((data)=>{
         if (!this.props.selectBankInfo&&data.items.length>=1){
             this.props.dispatch(selectBankInfo(data.items[0]))
          }  
       })
      this.props.dispatch(findUserStatus())
      let promise = this.props.dispatch(getPasswordFactor());
      promise.then((data) => {
          this.setState({
          factor:data,
          loadStatus:'loaded'
         })
    });

      this.subscription = NativeAppEventEmitter.addListener('dealPassWord',(response)=>{
          
           if (response.password.length==6) {     
               this.setState({
                  passCipher:response.cipher
               })
               this.CheckPassWord()
            }else{
              this.setState({
                  passWord:response.password
              })
            }

       });
  }

  componentWillUnmount() {
     this.subscription.remove()
  }



 updateSelectBank(){
    let promise = this.props.dispatch(getBinding())
    let bankList,selectBank;
    promise.then((data) => {
    bankList=data.items
    selectBank=bankList.map((item,index)=>{
     if (item.accId===this.props.selectBankInfo.accId){
        this.props.dispatch(selectBankInfo(item)) 
       }
    })      
    }).catch((err)=>{})
 }


  CheckPassWord(){

     let infoID;
     if (this.props.selectBankInfo) {
      infoID =this.props.selectBankInfo.accId
     }
    let params = {
      chargeAmount:this.state.money,
      paypass:this.state.passCipher,
      bankInfoId:infoID
    }
    this.refs.loading.open()
    this.closeModule()
    let promise = this.props.dispatch(chargeUserAccount(params))
         
        promise.then((data)=>{  
         this.props.dispatch(getEwallet())   
         this.updateSelectBank()
         
                  let info={
                  title:'充值',
                  des:'充值成功',
                  status:true,
                  Top_Title:'完成',
                  onPress_frist:()=>{
                    SceneUtils.gotoScene('TAB_VIEW::profile',{timer:true},'replace')
                  },
                }
            this.refs.loading.close()
            Hidekeyboard()
            SceneUtils.gotoScene('FINANCING_STATUS',info,'replace') 
    }).catch((err)=>{
            Utils.alert(err.msg||'服务繁忙')
            this.refs.loading.close()
    })

   }




  goRecharge(){

    if (this.props.userStatus&&!this.props.userStatus.isCertification) {
         this.refs.bindID.ModuleOpen()
       }else if (this.props.userStatus&&!this.props.userStatus.isTiedCard){
         this.refs.bindBank.ModuleOpen()
      }else if (this.props.userStatus&&!this.props.userStatus.isSitePass){
          SceneUtils.gotoScene('PROFILE_DEAL_PASS_WORD',null,'replace')
    }else{
      if (Number(this.state.money)<100) {
        Utils.alert('抱歉,充值金额必须大于100元')
      }else{
        Showkeyboard({factor:this.state.factor,deal:true})
       this.refs.password.open()
      }
    }

  }



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

    mainContent(){

    let bankView,buildingInfo = this.props.selectBankInfo;
    let lines
      if (this.props.selectBankInfo&&this.props.selectBankInfo.limitFlag) {
        lines = (
            <View>
              <View style={{backgroundColor:'#eeeeee',width:dim.width,height:1}}/> 
             <View style={{backgroundColor:'white',flexDirection:"row",alignItems:'center'}}>
                <Text style={{marginTop:10,marginLeft:10,marginBottom:10,color:FlyColors.baseTextColor2}}>可充值额度:<Text>{this.props.selectBankInfo.limit}</Text>元</Text>
             </View>
            </View>
          )
      }
    if (buildingInfo) {
      let accNo = buildingInfo.accNo.substr(buildingInfo.accNo.length - 4,4)
      bankView = (
        <View>
        <View style={styles.bank}>
          <FlyImage source={buildingInfo.imgUrl} style={{marginLeft:5}} width={50}/>
          <View style={{marginLeft:10}}>
            <Text style={styles.bankName}>{buildingInfo.bankName}</Text>
            <Text style={styles.accNo}>尾号{accNo}储蓄卡</Text>
          </View>
          <TouchableOpacity style={styles.selectBankCard} onPress={()=>SceneUtils.gotoScene('PROFILE_SELECT_BANK_CARD')}>
            <Text style={{color:FlyColors.baseColor}}>选择银行卡</Text>
          </TouchableOpacity>
        </View>

        </View>
      )
    }

return(
      
       <FlyEditableScrollView style={{backgroundColor:FlyColors.baseTextColor3}}>
          {bankView}
          <View style={{height:50,backgroundColor:'white',marginTop:15}}>
            <FlyTextInput  text="充值金额" labelWidth={80} keyboardType="numeric" onChangeText={(text) => this.setState({money: text})}  placeholder="请输入有效数字"/>
          </View>
          <View style={styles.btnWrapper}>
              <FlyButton
                text='立即充值'
                onPress={this.goRecharge}
                type='base'
                disabled = {this.state.money ? false : true}
                style={styles.btn} />
          </View>
        </FlyEditableScrollView>
       
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
        <FlyHeader title={'充值'} leftItem={leftItem} borderBottom={true} />
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
  }

});

function select(store) {
  return {
    buildingInfo:store.user.buildingInfo,
    userStatus:store.user.userStatus,
    selectBankInfo:store.user.selectBankInfo,
  };
}

module.exports = connect(select)(ProfileRecharge);
