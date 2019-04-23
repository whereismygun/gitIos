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
  ScrollView,
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
const {getBinding,getEwallet,withdrawUserAccount,getPasswordFactor,WithdrawInfo,selectBankInfo} = require('../../actions');
const NativeModuleUtils = require('NativeModuleUtils');
const FlyModalBox = require('FlyModalBox');
const close = './imgs/base/close.png';
const updateBg = "./imgs/base/updateBg.png";
const NetworkService = require('NetworkService');
const Utils = require('Utils');
const {Text} = require('FlyText');
const FlyTextInput = require('FlyTextInput');
const FlyEditableScrollView = require('FlyEditableScrollView');
const FlyButton = require('FlyButton');
const Filters = require('Filters');
const UrlHelper = require('UrlHelper');
const FlyLoading = require('FlyLoading')
const closeImg = './imgs/login/close.png'
const dim = FlyDimensions.deviceDim;

type Props = {
  navigator: Navigator;
};

class ProfileWithdrawals extends React.Component {
  props: Props;

  constructor(props) {
    super(props);

    this.state = {
      withDrawTimes: "0",
      totalAmount: '0',
      money:null,
      feeAmount:'0',
      maxLimitCount:'0',
      userMonthWithdrawCount:'0',
      factor:null,
      passWord:'',
      passCipher:null,
      bankData:null,
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
    let that = this;
    InteractionManager.runAfterInteractions(()=>{
       let getBank = that.props.dispatch(getBinding());
       getBank.then((data)=>{
             this.setState({
              bankData:data.items
             })
         if (!this.props.selectBankInfo&&data.items.length>=1){
              that.props.dispatch(selectBankInfo(data.items[0]))
          }  
       })  
      let ewallet = that.props.dispatch(getEwallet());
      ewallet.then((data)=>{
        that.setState({
          totalAmount:data.totalAmount
        });
      }).catch((err)=>{

      });
      let promise = that.props.dispatch(WithdrawInfo());
      promise.then((data)=>{
        that.setState({
          feeAmount:data.feeAmount,
          maxLimitCount:data.maxLimitCount,
          userMonthWithdrawCount:data.userMonthWithdrawCount
        })
      }).catch((err)=>{

      });
    });
   this.getPassWord()


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

  Withdraw(){
    let params = {
      withdrawAmount:this.state.money,
      paypass:this.state.passCipher,
      bankInfoId:this.props.selectBankInfo.accId,
    }
     this.refs.loading.open()
     this.closeModule()
    let promise = this.props.dispatch(withdrawUserAccount(params))
     promise.then((data) => {
                 this.props.dispatch(getEwallet());
                 this.updateSelectBank()
                 let info={
                  title:'提现',
                  des:'提现成功',
                  status:true,
                  Top_Title:'完成',
                  onPress_frist:()=>{
                    SceneUtils.gotoScene('TAB_VIEW::profile',{timer:true},'replace')
                  },
                }
            this.refs.loading.close()
            Hidekeyboard()
            SceneUtils.gotoScene('FINANCING_STATUS',info,'replace') 

     }).catch((err) => {
      this.refs.loading.close()
        Utils.alert(err.msg||'服务繁忙')
     })
  }
  getPassWord(){
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
               this.Withdraw()
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

  check(bankCardId){
    if (Utils.isEmpty(this.state.money)) {
      Utils.alert('亲，请输入金额');
      return false;
    }

    if(this.state.money == 0 || this.state.money == "0"){
      Utils.alert('亲，请输入大于0的金额');
      return false;
    }

    if (Utils.isEmpty(bankCardId)) {
      Utils.confirm('提醒','亲，您还没有绑定银行卡，请先去绑定银行卡！',()=>SceneUtils.gotoScene('PROFILE_SHOW_BANK_CARD'),null,'前去绑卡');
      return false;
    }

    if (this.state.money && parseFloat(this.state.money) > parseFloat(this.state.totalAmount)) {
      Utils.alert('亲，您的账户余额不足，请重新输入！');
      return false;
    }
    if( this.props.userStatus&&!this.props.userStatus.isSitePass){
        SceneUtils.gotoScene('PROFILE_DEAL_PASS_WORD',null,'replace')
    }
    return true;
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
                   <Text style={{marginTop:10,fontSize:FlyDimensions.fontSizeLarge,color:FlyColors.baseTextColor2}}>提现</Text>
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


  doSubmit(bankCardId){
    let that = this;
     if (that.check(bankCardId)) {
        Showkeyboard({factor:this.state.factor,deal:true})
       this.refs.password.open()          
    }
  }

  render() {
      let leftItem = {
      type: "back",
      onPress:()=>{
         Hidekeyboard()
         SceneUtils.goBack();
      }
    };

    let bankView,buildingInfo = this.props.selectBankInfo,bankCardId;
        let lines
      if (this.props.selectBankInfo&&this.props.selectBankInfo.limitFlag) {

         let limit = this.props.selectBankInfo.limit;
         if (this.props.selectBankInfo.limit ===0) {
            limit = '0'
         }
        lines = (
            <View>
              <View style={{backgroundColor:'#eeeeee',width:dim.width,height:1}}/> 
             <View style={{backgroundColor:'white',flexDirection:"row",alignItems:'center'}}>
                <Text style={{marginTop:10,marginLeft:10,marginBottom:10,color:FlyColors.baseTextColor2}}>可提现额度:<Text>{limit}</Text>元</Text>
             </View>
            </View>
          )
      }

    if (buildingInfo) {
      let accNo = buildingInfo.accNo.substr(buildingInfo.accNo.length - 4,4);
      bankCardId = buildingInfo.accNo;
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
            {lines}
        </View>
      );
    }
    let totalAmount = this.state.totalAmount;
    let isDisabled = parseInt(totalAmount) > 0 ? false : true;
    let showAmount = (totalAmount == 0 || totalAmount == "0") ? "0" : Filters.keepFixed(totalAmount);
    return (
      <View style={FlyStyles.container}>
        <FlyHeader title={'提现'} borderBottom={true} leftItem={leftItem}/>
        <FlyEditableScrollView style={{backgroundColor:FlyColors.baseTextColor3}}>
          <View style={styles.headContianer}>
            <Text style={styles.titleMoney}>{showAmount}</Text>
            <Text style={styles.moneyDetails}>账户余额(元)
            </Text>
          </View>
          {bankView}
          {FlyBase.SegmentView()}
          <View style={{paddingLeft:15,backgroundColor:'white'}}>
            <View style={styles.drwalsContianer}>
              <Text style={styles.drwalsTitle}>提现额度</Text>
              <TouchableOpacity style={{alignItems:'flex-end',marginRight:15}} onPress={()=>this.setState({money:showAmount})}>
                <Text style={styles.allDrwals}>全部提现</Text>
              </TouchableOpacity>
            </View>
            <FlyTextInput text="￥" labelWidth={30} style={{marginLeft:-15}}  textInputStyle={{fontWeight:'400',fontSize:FlyDimensions.fontSizeH1}} showSegment={true}keyboardType="numeric" placeholder="请输入金额"
              value={(this.state.money) ? this.state.money + "" : ""}  onChangeText={(text) => this.setState({money: text})} />
            <Text style={styles.alertTitle}>{"用户每月前"+this.state.maxLimitCount+"次提现免手续费,超过"+this.state.maxLimitCount+"次需要支付手续费"+this.state.feeAmount+"元/笔"}</Text>
            <Text style={[styles.alertTitle,{marginBottom:10}]}>本月已提现<Text style={{color:'#0081BF'}}>{this.state.userMonthWithdrawCount}次</Text></Text>
          </View>
          <View style={styles.btnWrapper}>
             <FlyButton
               text='申请提现'
               disabled={isDisabled}
               onPress={()=>this.doSubmit(bankCardId)}
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
  titleMoney:{
    fontSize:FlyDimensions.fontSizeH4,
    color:'white',
    marginBottom:5,
  },
  moneyDetails:{
    fontSize:FlyDimensions.fontSizeLarge,
    color:'white',
  },
  headContianer:{
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:FlyColors.baseColor,
    height:FlyDimensions.deviceDim.width * 0.23
  },
  bank:{
    alignItems:'center',
    flexDirection:'row',
    paddingTop:15,
    paddingBottom:15,
    backgroundColor:'white',
  },
  bankName:{
    fontSize:FlyDimensions.fontSizeXl,
    marginBottom:5
  },
  accNo:{
    fontSize:FlyDimensions.fontSizeLarge,
    color:FlyColors.baseTextColor2
  },
  allDrwals:{
    color:FlyColors.baseColor,
    fontSize:FlyDimensions.fontSizeLarge,
  },
  drwalsTitle:{
    // marginLeft:15,
    textAlign:'left',
    fontSize:FlyDimensions.fontSizeLarge,
    color:"#333333",
    flex:1,
  },
  drwalsContianer:{
    marginTop:15,
    flexDirection:'row'
  },
  alertTitle:{
    fontSize:FlyDimensions.fontSizeLarge,
    color:FlyColors.baseTextColor2,
    marginTop:15,
    marginRight:15
  },
  btnWrapper: {
    backgroundColor:FlyColors.baseTextColor3,
    alignItems:'center',

  },
  btn: {
    marginTop:FlyDimensions.deviceDim.width * 0.15,
    width: FlyDimensions.deviceDim.width -30,
    height:50
  },
   selectBankCard:{
    marginLeft:dim.width*0.28,
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

});

function select(store) {
  return {
    buildingInfo:store.user.buildingInfo,
    userStatus:store.user.userStatus,
    selectBankInfo:store.user.selectBankInfo,
  };
}

module.exports = connect(select)(ProfileWithdrawals);
