'use strict';
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    TouchableHighlight,
    ScrollView,
    TouchableOpacity,
    InteractionManager,
    ListView,
    TextInput,
    DeviceEventEmitter,
    NativeAppEventEmitter,


} from 'react-native';

import {
Hidekeyboard,
Showkeyboard,
Encryption,
}from 'fly-react-native-ps-keyboard'


import {connect} from 'react-redux';
const TimerMixin = require('react-timer-mixin');
const FlyHeader = require('FlyHeader');
const FlyColors = require('FlyColors');
const FlyDimensions = require('FlyDimensions');
const FlyStyles = require('FlyStyles');
const FlyImage = require('FlyImage');
const FlyItem = require('FlyItem');
const DXRefreshControl = require('DXRefreshControl');
const Filters = require('Filters');
const UrlHelper = require('UrlHelper');
const FlyButton = require('FlyButton');
const FlyIconfonts = require('FlyIconfonts');
const FlyLabelItem = require('FlyLabelItem');
const FlyBase = require('FlyBase');
const {OneLine, Text} = require('FlyText');
const NetworkService = require('NetworkService');
const SceneUtils = require('SceneUtils');
const Utils = require('Utils');
const FlyWebView = require('FlyWebView');
const FlyCheckBox = require('FlyCheckBox');
const FlyModalBox = require('FlyModalBox');
const FlyContainer = require('FlyContainer');
const FlyEditableScrollView = require('FlyEditableScrollView');
const FlyLoading = require('FlyLoading');
const dim = FlyDimensions.deviceDim
const SCROLLVIEWREF = 'scrollview'

const img1 = './imgs/process/security-siren-alarm.png';
const img2 = './imgs/process/ecommerce-wallet.png';
const couponBgP = './imgs/discount/bg.png';
const couponBgN = './imgs/discount/bg3.png';
const couponBg1 = './imgs/discount/bg1.png';
const closeImg = './imgs/login/close.png'

const agreeH = './imgs/login/agree.png';
const agreeN = './imgs/login/combinedShape.png';
const {getUserInfo,buyTender,findUserStatus,getBrUndlyUserBonusList,getStatData,borrowUnderlyNewList,queryUserRemainAmount,getXieYi,getEwallet,getBrUndlyUserCouponList,getPasswordFactor} = require('../../actions');
const env = require('env');
class FinancingBuyingView extends Component {

    props: Props;

    constructor(props) {
      super(props);

      (this:any)._onRefresh=this._onRefresh.bind(this);
      (this: any).loadData = this.loadData.bind(this);
      (this: any).loadWallet = this.loadWallet.bind(this);
      (this: any).loadRemainAmount = this.loadRemainAmount.bind(this);
      (this: any).loadCoupon = this.loadCoupon.bind(this);
      (this: any).loadBonus = this.loadBonus.bind(this);
      (this: any).getMinBAmount = this.getMinBAmount.bind(this);
      (this: any).couponList = this.couponList.bind(this);
      (this: any).mainContent = this.mainContent.bind(this);
      (this: any).selectCoupon = this.selectCoupon.bind(this);
      (this: any).openList = this.openList.bind(this);
      (this: any).btnContent = this.btnContent.bind(this);
      (this: any).toBuy = this.toBuy.bind(this);
      (this: any).checkAmount = this.checkAmount.bind(this);
      (this: any).submit = this.submit.bind(this);
      (this: any).paySuccess = this.paySuccess.bind(this);
      (this: any).edtingEnd = this.edtingEnd.bind(this);


      this.buyAmountText = 0;
      this.couponId = null;
      this.bonusId= null;
      this.isOpen = false;

      this.state={
        basicInfo:null,
        materialRelative:null,
        introIndex:null,
        userRemainAmount:0,//剩余可购买额度
        btnStu:null, //'noRemain'购买额度已达上限;'noMoney'账户余额不足，请充值
        totalAmount:0,
        minBidAmt:0,
        defaultCoupon:null,
        couponItems:null,
        defaultBonus:null,
        bonusItems:null,
        selectedBonus:null,
        selectedCoupon:null,
        amount:null,
        btnDisabled:false,
        checked:false,
        loadStatus:'loading',
        factor:null,
        passCipher:null,
        passWord:'',
      }
    }

    componentDidMount() {
      let that = this;
      InteractionManager.runAfterInteractions(() => {
        that.loadData();
        that.refreshFinancingBuy = DeviceEventEmitter.addListener(env.ListenerMap['REFRESH_FINANCING_BUY'], () => {
          that.loadData();
        });
      });
      let promise = that.props.dispatch(getPasswordFactor());
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
               this.submit()
            }else{
              this.setState({
                  passWord:response.password
              })
            }

       });

        let node = this.refs[SCROLLVIEWREF];
       DXRefreshControl.configureCustom(node,{
         headerViewClass:'UIRefreshControl',
       },this._onRefresh);


    }

  componentWillReceiveProps(nextProps: Props) {
    let next = nextProps;
    let moment = this.props;

    if (moment.userStatus&&(moment.userStatus.isCertification!=next.userStatus.isCertification||moment.userStatus.isTiedCard!=next.userStatus.isTiedCard||moment.userStatus.isSitePass!=next.userStatus.isSitePass)) {
         this.props.dispatch(findUserStatus())
     }

  }


    loadData(){
      this.props.dispatch(getUserInfo(true));
      this.loadWallet();
      this.loadRemainAmount();
      this.getMinBAmount();
      this.loadCoupon('BRUNDLYCOUPONLIST');
      this.loadBonus('BRUNDLYBONUSLIST');
      this.props.dispatch(findUserStatus())
    }

    loadWallet(){
      let promise = this.props.dispatch(getEwallet());
      promise.then((data) => {
        if(data.totalAmount){
          this.setState({totalAmount:data.totalAmount});
        }else{
          this.setState({btnStu:'noMoney',totalAmount:0});
        }
      }).catch((error) => {
        Utils.alert(error.msg);
      });
    }
      _onRefresh(ignore){
      const node = this.refs[SCROLLVIEWREF];
          TimerMixin.setTimeout(()=>{
           this.loadData();
          DXRefreshControl.endRefreshing(node)
        }, 2000);
       
    }

    loadRemainAmount(){
      let promise = this.props.dispatch(queryUserRemainAmount(this.props.brId));
      promise.then((data) => {
        if(data.userRemainAmount<this.state.minBidAmt){
          this.setState({btnStu:'noRemain',btnDisabled:true});
        }
        this.setState({userRemainAmount:data.userRemainAmount,loadStatus:'loaded'});
      }).catch((error) => {
        Utils.alert(error.msg);
      });
    }

    toBuy(){
      if(Utils.isEmpty(this.state.buyAmount)){
        Utils.alert('请输入购买金额');
      }else if(parseInt(this.buyAmountText)>parseInt(this.state.totalAmount)){
        Utils.confirm('提醒','抱歉，您的余额不足，请充值或者重新输入',()=>SceneUtils.gotoScene('PROFILE_RECHARGE',{type:'buy'},'replace'),null,'去充值');
      }else{
          Showkeyboard({factor:this.state.factor,deal:true})
          this.refs.password.open()
      }

    }

    paySuccess(){
       SceneUtils.goBack();
       DeviceEventEmitter.emit(env.ListenerMap['REFRESH_FINANCING_DETAIL']);
       this.props.dispatch(borrowUnderlyNewList());
       this.props.dispatch(getUserInfo());
       this.props.dispatch(getStatData());
    }

    submit(){

      if(this.checkAmount()){
          this.refs.password.close()
           Hidekeyboard()
        this.refs.loading.open()

        let params = {
          buyAmount: Number(this.state.buyAmount),
          tenderOrderNo: this.props.basicInfo.borrowerNo,
          userCouponId:this.couponId,
          userBonusCouponId:this.bonusId,
          paypass:this.state.passCipher,
        }
      let promise = this.props.dispatch(buyTender(params));
        promise.then((data)=>{
           this.props.dispatch(getEwallet())   
                  let info={
                  title:'投资',
                  des:'投资成功',
                  status:true,
                  Top_Title:'完成',
                  Middle_Title:'继续投资',
                  onPress_frist:()=>{
                    SceneUtils.gotoScene('INVESTMENT_RECORD_VIEW',null,'replace')
                      },
                  onPress_second:()=>{
                    SceneUtils.gotoScene('TAB_VIEW::financing',null,'replace')
                    },
                }
              this.refs.loading.close()
              Hidekeyboard()
              SceneUtils.gotoScene('FINANCING_STATUS',info,'replace')       
       }).catch((err)=>{
           this.refs.loading.close()
           Utils.alert(err.msg || '服务繁忙')
         })
      }
    }

    checkAmount(){
      if(parseInt(this.state.buyAmount)>parseInt(this.props.basicInfo.leftBAmt)){
        Utils.alert('剩余金额不足，已自动帮您更改');
        this.setState({buyAmount:String(this.props.basicInfo.leftBAmt)});

          this.loadCoupon('BRUNDLYCOUPON',this.props.basicInfo.leftBAmt);
          this.loadCoupon('BRUNDLYCOUPONLIST',this.props.basicInfo.leftBAmt);
          this.loadBonus('BRUNDLYBONUS',this.props.basicInfo.leftBAmt);
          this.loadBonus('BRUNDLYBONUSLIST',this.props.basicInfo.leftBAmt);
          this.setState({
            selectedBonus:null,
            selectedCoupon:null,
          });

        return false;
      }

      if(parseInt(this.state.buyAmount)<parseInt(this.state.minBidAmt)){
        Utils.alert(`购买金额需${Filters.moneyFixed(this.state.minBidAmt,null,true)}起`);
        return false;
      }

      if(Number(this.state.buyAmount)%this.props.basicInfo.baseAmount!=0){
        Utils.alert('购买金额需要为'+this.props.basicInfo.baseAmount+'的倍数');
        return false;
      }

      return true;
    }

    getMinBAmount(){
      let basicInfo = this.props.basicInfo;
      if(basicInfo.minBidAmt >= basicInfo.leftBAmt){
        this.setState({minBidAmt:basicInfo.leftBAmt});
      }else{
        this.setState({minBidAmt:basicInfo.minBidAmt});
      }
    }

    isAgent(){
      if(this.props.isLoggedIn&&this.props.userInfo){
        return this.props.userInfo.agent;
      }else{
        return false;
      }
    }

    loadCoupon(requestSite,buyAmount){
      let params = {
        amount:buyAmount || 0,
        borrowNumber:this.props.basicInfo.borrowerNo,
        requestSite:requestSite
      };

      let promise = this.props.dispatch(getBrUndlyUserCouponList(params));
      promise.then((data) => {
        if(data && data.items){
          if(requestSite=='BRUNDLYCOUPON'){
            this.setState({defaultCoupon:data.items[0]});
          }else{
            this.setState({couponItems:data.items});
          }
        }
        this.refs.loading.close()
      }).catch((error) => {
        this.refs.loading.close()
        Utils.alert(error.msg);
      });
    }
    loadBonus(requestSite,buyAmount){
      let params = {
        amount:buyAmount || 0,
        borrowNumber:this.props.basicInfo.borrowerNo,
        requestSite:requestSite
      };
      let promise = this.props.dispatch(getBrUndlyUserBonusList(params));
      promise.then((data) => {
        if(data && data.items){
          if(requestSite=='BRUNDLYBONUS'){
            this.setState({defaultBonus:data.items[0]});
          }else{
            this.setState({bonusItems:data.items});
          }
        }
        this.refs.loading.close()
      }).catch((error) => {
        this.refs.loading.close()
        Utils.alert(error.msg);
      });
    }


    selectCoupon(item){
      if (item) {
        if(item.mark=='USABLE'){
          this.setState({selectedCoupon:item});
          this.list.close();
          this.isOpen = false;
        }else{
          Utils.alert('未达到返现红包使用要求');
        }
      }else {
        this.setState({selectedCoupon:null});
        this.setState({defaultCoupon:null});
        this.list.close();
      }
    }

    selectedBonus(item){
      if (item) {
        if(item.mark=='USABLE'){
          this.setState({selectedBonus:item});
          this.refs.bonus.close();
          this.isOpen = false;
        }else{
          Utils.alert('未达到加息券使用要求');
        }
      }else {
        this.setState({selectedBonus:null});
        this.setState({defaultBonus:null});
        this.refs.bonus.close();
      }
    }

    async openList(type){
      if (type=='bonus') {
        if(!Utils.isEmpty(this.state.buyAmount)){
          if(!Utils.isEmptyArr(this.state.bonusItems)){
            this.refs.bonus.open();
            this.isOpen = true;
          }else{
            Utils.alert('暂无可用加息券');
          }
        }else{
          Utils.alert('请先填写购买金额');
        }
      }else {
        if(!Utils.isEmpty(this.state.buyAmount)){
          if(!Utils.isEmptyArr(this.state.couponItems)){
            this.list.open();
            this.isOpen = true;
          }else{
            Utils.alert('暂无可用返现红包');
          }
        }else{
          Utils.alert('请先填写购买金额');
        }
      }

    }

    couponList(){

      let leftItem = {
          type: 'back',
          onPress: ()=>{
            this.list.close();
            this.isOpen = false;
          },
      };

      let list;
      if(!Utils.isEmptyArr(this.state.couponItems)){
        list = this.state.couponItems.map((item,idx)=>{
          let imageSource = (item.mark=='USABLE')?couponBg1:couponBgN;
          return(
            <TouchableOpacity key={idx} onPress={()=>this.selectCoupon(item)}>
              <FlyImage source={imageSource} style={styles.couponImg}>
                <View style={[styles.rowWrapper,{paddingHorizontal:15,paddingVertical:10}]}>
                  <View style={{flex:3}}>
                    <Text style={{color:FlyColors.baseTextColor,fontSize:FlyDimensions.fontSizeXxl}}>{item.couponName}</Text>
                    <Text style={styles.couponMiddle}><Text style={{fontSize:FlyDimensions.fontSizeXxxl,fontWeight:'bold'}}>&middot; </Text>{item.ruleString}</Text>
                    <Text style={{color:FlyColors.baseTextColor2}}><Text style={{fontSize:FlyDimensions.fontSizeXxxl,fontWeight:'bold'}}>&middot; </Text>{item.beginTime.substr(0,10)}至{item.endTime.substr(0,10)}</Text>
                  </View>
                  <View style={[styles.rowWrapper,{flex:1,justifyContent:'center'}]}>
                    <Text style={{fontSize:FlyDimensions.fontSizeH1,color:FlyColors.white}}><Text style={{fontSize:FlyDimensions.fontSizeXl,color:'white'}}>¥</Text>{Filters.moneyFixed(item.amount)}</Text>
                  </View>
                </View>
              </FlyImage>
            </TouchableOpacity>
          );
        });
      }

      let item = {};
      return(
        <FlyModalBox position={'top'} style={{backgroundColor:FlyColors.baseBackgroundColor,alignItems:'center'}} ref={(ref)=>this.list=ref} swipeToClose={false}>
            <FlyHeader leftItem={leftItem} title="我的返现红包" borderBottom={true} backgroundColor={FlyColors.white}/>
            <ScrollView showsVerticalScrollIndicator={false}>
              <TouchableOpacity style={styles.btnNoUsed} onPress={()=>this.selectCoupon()}>
                  <Text style={styles.useText}>不使用返现红包</Text>
              </TouchableOpacity>
              {list}
            </ScrollView>
        </FlyModalBox>
      );
    }
    componentWillUnmount() {

    this.subscription.remove()
   }

    bonusList(){
      let leftItem = {
          type: 'back',
          onPress: ()=>{
            this.refs.bonus.close();
            this.isOpen = false;
          },
      };

      let list;
      if(!Utils.isEmptyArr(this.state.bonusItems)){
        list = this.state.bonusItems.map((item,idx)=>{
          let imageSource = (item.mark=='USABLE')?couponBgP:couponBgN;
          return(
            <TouchableOpacity key={idx} onPress={()=>this.selectedBonus(item)}>
              <FlyImage source={imageSource} style={styles.couponImg}>
                <View style={[styles.rowWrapper,{paddingHorizontal:15,paddingVertical:10}]}>
                  <View style={{flex:3}}>
                    <Text style={{marginTop:5,color:FlyColors.baseTextColor,fontSize:FlyDimensions.fontSizeXxl}}>{item.couponName}</Text>
                    <Text style={styles.couponMiddle}><Text style={{fontSize:FlyDimensions.fontSizeXxxl,fontWeight:'bold'}}>&middot; </Text>{item.ruleString}</Text>
                    <Text style={{fontSize:FlyDimensions.fontSizeLarge}}>{item.bonusRateCycleRule}</Text>
                    <Text style={{color:FlyColors.baseTextColor2}}><Text style={{fontSize:FlyDimensions.fontSizeLarge,fontWeight:'bold'}}>&middot; </Text>{item.beginTime.substr(0,10)}至{item.endTime.substr(0,10)}</Text>
                  </View>
                  <View style={[styles.rowWrapper,{flex:1,justifyContent:'center'}]}>
                    <Text style={{fontSize:FlyDimensions.fontSizeXl,color:'white'}}><Text style={{fontSize:FlyDimensions.fontSizeH1,color:FlyColors.white}}>{parseFloat(item.amount)*100}</Text>%</Text>
                  </View>
                </View>
              </FlyImage>
            </TouchableOpacity>
          );
        });
      }

      let item = {};
      return(
        <FlyModalBox position="top"  style={{backgroundColor:FlyColors.baseBackgroundColor,alignItems:'center'}} ref={'bonus'} swipeToClose={false}>
            <FlyHeader leftItem={leftItem} title="我的加息券" borderBottom={true} backgroundColor={FlyColors.white}/>
            <ScrollView showsVerticalScrollIndicator={false}>
              <TouchableOpacity style={styles.btnNoUsed} onPress={()=>this.selectedBonus()}>
                  <Text style={styles.useText}>不使用加息券</Text>
              </TouchableOpacity>
              {list}
            </ScrollView>
        </FlyModalBox>
      );
    }

    btnContent(){
     let btnText,btnPressFunc;
     let btnColor = FlyColors.baseColor;
     if(this.state.btnStu=='noRemain'){
       btnText = '购买额度已达上限';
     }else if(this.state.btnStu=='noMoney'){
       btnText = '账户余额不足，请充值';
       btnColor = "#666666";
       btnPressFunc = ()=>{SceneUtils.gotoScene('PROFILE_RECHARGE',{type:'buy'},'replace')}
     }else{
       btnText = '立即购买';
       btnPressFunc = ()=>{
         this.toBuy();
       }
     }

      return(
        <View style={styles.btnWrapper}>
            <FlyButton
              text={btnText}
              onPress={btnPressFunc}
              disabled={!this.state.btnDisabled&&this.state.checked}
              type='base'
              style={styles.btn} />
        </View>
      );
    }

    headContent(){
      let item = this.props.basicInfo;
      let trueInterest,trueExtraRate;

      if(!this.isAgent()){
        trueInterest = Filters.percentage(item.interest);
        trueExtraRate = (item.normalExtraRate)?` +${Filters.percentage(item.normalExtraRate)}`:null;
      }else if(this.isAgent()&&item.agentInterest){
        trueInterest = Filters.percentage(item.agentInterest);
        trueExtraRate = (item.personalExtraRate)?` +${Filters.percentage(item.personalExtraRate)}`:null;
      }else if(this.isAgent()&&!item.agentInterest){
        trueInterest = Filters.percentage(item.interest);
        trueExtraRate = (item.personalExtraRate)?` +${Filters.percentage(item.personalExtraRate)}`:null;
      }

      return(
        <View style={styles.headWrapper}>
          <Text style={[styles.whiteFont,styles.title]}>{item.loanTitle}</Text>
          <View style={styles.rowWrapper}>
            <View style={styles.rowWrapper}>
              <Text style={[styles.whiteFont,{fontSize:FlyDimensions.fontSizeLarge}]}>预期年化收益率  </Text>
              <Text style={styles.whiteFont}>{Utils.NVL(trueInterest,"--")}<Text style={{color:'white',fontSize:FlyDimensions.fontSizeBase}}>{trueExtraRate}</Text></Text>
            </View>
            <View style={styles.splitLine}/>
            <Text style={[styles.whiteFont,{fontSize:FlyDimensions.fontSizeLarge}]}>{`理财期限  ${item.period+Filters.timeUnitStatus(item.periodType)}`}</Text>
          </View>
        </View>
      );
    }

    gotoProtol(){
      let params = {
        type:'regular_fuwu_xieyi',
        b_no:this.props.basicInfo.borrowerNo
      }
      let promise = this.props.dispatch(getXieYi(params,false));
      promise.then((data)=>{
        SceneUtils.gotoScene('PROFILE_WEB_VIEW', {
          title: '定期通服务协议',
          html: data,
          webviewStyle:'body{font-size:15px;line-height:150%;padding:10px;}',
        });
      }).catch((err)=>{
        Utils.alert(err.msg)
      });
    }

    renderCoupon(){
      let couponText;
      let couponData = this.state.defaultCoupon;
      let selCouponData = this.state.selectedCoupon;
      if(couponData && !selCouponData){
        let count=0;
        for (var i = 0; i < this.state.couponItems.length; i++) {
            if (this.state.couponItems[i].mark=='USABLE') {
              count=count+1
            }
        }
      let couponText =count==0?'暂无返现红包可用':'张可用返现红包';
        this.couponId =null;
        return(
            <FlyLabelItem otherTextStyle={{color:FlyColors.baseTextColor}} otherNote={count} otherText={couponText} labelWidth={80} text="优惠券" showSegment={true} showArrowIcon={true} onPress={this.openList}/>
        )
      }else if(selCouponData){
        couponText = selCouponData.couponName;
        this.couponId = selCouponData.userCouponId;
        return(
        <FlyLabelItem otherTextStyle={{color:FlyColors.baseTextColor}} otherText={couponText} labelWidth={80} text="优惠券" showSegment={true} showArrowIcon={true} onPress={this.openList}/>
        )
      }else{
        return null
      }
    }
    
    renderInterest(){
      let couponText;
      let couponData = this.state.defaultBonus;
      let selCouponData = this.state.selectedBonus;
      if(couponData && !selCouponData){
        let count=0;
        for (var i = 0; i < this.state.bonusItems.length; i++) {
            if (this.state.bonusItems[i].mark=='USABLE') {
              count=count+1
            }
        }
        let couponText =count==0?'暂无加息券可用':'张可用加息券';
        this.bonusId =null;
        return(
           <TouchableOpacity onPress={()=>{this.openList('bonus')}}>
            <FlyLabelItem otherTextStyle={{color:FlyColors.baseTextColor}} otherNote={count} otherText={couponText} labelWidth={80} text="加息券" showSegment={true}  showArrowIcon={true}/>
           </TouchableOpacity>
        )
      }else if(selCouponData){
        couponText = selCouponData.couponName;
        this.bonusId = selCouponData.userCouponId;
        return(
          <TouchableOpacity onPress={()=>{this.openList('bonus')}}>
        <FlyLabelItem otherTextStyle={{color:FlyColors.baseTextColor}} otherText={couponText} labelWidth={80} text="加息券" showSegment={true} showArrowIcon={true} />
         </TouchableOpacity>
        )
      }else{
        return null
      }
    }

    mainContent(){

     let couponAmount=this.state.selectedCoupon?parseInt(this.state.selectedCoupon.amount):0;

     let amout = Filters.moneyFixed(this.state.totalAmount,null,true)?Filters.moneyFixed(this.state.totalAmount,null,true):'0';

      let amtPlaceholder = `${Filters.moneyFixed(this.state.minBidAmt,null,true)}起投`;

      this.buyAmountText = Filters.moneyFixed((this.state.buyAmount-parseInt(couponAmount)),null,true);
      let checked = this.state.checked;
      let agreeImg = checked == true ?  agreeN : agreeH;

      return(
        <FlyEditableScrollView keyboardShouldPersistTaps='always' style={{flex:1,height:dim.height,backgroundColor:FlyColors.baseTextColor3}}>
  
          {this.headContent()}
          <View style={[styles.rowWrapper,styles.innerWrapper]}>
            <FlyImage source={img1} style={styles.iconImg}/>
            <Text style={{color:FlyColors.baseTextColor2}}>当前可购买最大额 {Filters.moneyFixed(this.state.userRemainAmount,null,true)}</Text>
          </View>
          <FlyLabelItem labelWidth={80} text="购买金额" >
            <TextInput value={this.state.buyAmount} onEndEditing={this.edtingEnd} keyboardType="numeric" placeholder={amtPlaceholder} style={{height:50}}/>
          </FlyLabelItem>
          <View style={[styles.rowWrapper,styles.innerWrapper]}>
            <FlyImage source={img2} style={styles.iconImg}/>
            <Text style={{color:FlyColors.baseTextColor2}}>账号余额 <Text style={{color:FlyColors.baseTextColor}}>{amout}</Text></Text>
          </View>
         {this.renderCoupon()}
         {this.renderInterest()}
          <FlyLabelItem otherText={this.buyAmountText} labelWidth={80} text="实付金额"/>

          {this.btnContent()}
          <View style={[styles.rowWrapper,{alignItems:'center',justifyContent:'center',flexDirection:'row',marginTop:20}]}>
            <TouchableOpacity style={styles.agree} onPress={()=>{this.setState({checked:!checked})}}>
              <FlyImage source={agreeImg} width={15}/>
              <Text style={styles.agreeTitle}>我已阅读并同意
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>this.gotoProtol()}>
              <Text style={{color:FlyColors.baseColor,fontSize:FlyDimensions.fontSizeLarge}}>《定期通服务协议》</Text>
            </TouchableOpacity>
          </View>
        </FlyEditableScrollView>
      );
    }

    edtingEnd(text){
      let amout =text.nativeEvent.text
      let that =this
      that.setState({selectedCoupon:null,selectedBonus:null,buyAmount:Number(amout)});

        that.loadCoupon('BRUNDLYCOUPON',amout);
        that.loadCoupon('BRUNDLYCOUPONLIST',amout);
        that.loadBonus('BRUNDLYBONUSLIST',amout);
        that.loadBonus('BRUNDLYBONUS',amout);
        this.refs.loading.open()


    }

 closeModule(){
    Hidekeyboard()
    this.refs.password.close()

  }


  renderPassWord(){

     let couponAmount=this.state.selectedCoupon?parseInt(this.state.selectedCoupon.amount):0;

    this.buyAmountText = Filters.moneyFixed((this.state.buyAmount-parseInt(couponAmount)),null,true);
       
  return (
           <FlyModalBox ref={'password'} positionNumber={150} style={styles.passwordModule}>
               <View style={styles.passwordHeader}>
                 <TouchableOpacity onPress={()=>{this.closeModule()}} style={{position:'absolute',left:15,top:20}} >
                  <FlyImage source={closeImg} width={15} />
                 </TouchableOpacity>
                  <Text style={{fontSize:FlyDimensions.fontSizeXxl}}>请输入交易密码</Text>
               </View>
               <View style={styles.passwordBottom}>
                   <Text style={{marginTop:10,fontSize:FlyDimensions.fontSizeLarge,color:FlyColors.baseTextColor2}}>购标</Text>
                   <Text style={{marginTop:15,fontSize:FlyDimensions.fontSizeH4}}>¥ {this.buyAmountText}</Text> 
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

    render() {

      let leftItem = {
          type: 'back',
          onPress:()=>{
         Hidekeyboard()
         SceneUtils.goBack();
      }
      };

        return (
           <View style={{flex:1}}>
            <FlyHeader leftItem={leftItem} title="购买" borderBottom={true} backgroundColor={FlyColors.white}/>

          <ScrollView ref={SCROLLVIEWREF}>
            <View style={FlyStyles.container}>
              <FlyContainer renderContent={this.mainContent} loadStatus={this.state.loadStatus}/>
            </View>
           </ScrollView>
               {this.renderPassWord()}
               {this.couponList()}
               {this.bonusList()}
            <FlyLoading ref="loading" text="请稍等..."/>
          </View>
        )
    }
}

var styles = StyleSheet.create({
  mainWrapper:{
    marginBottom:10,
    backgroundColor:FlyColors.white,
  },
  rowWrapper:{
    flexDirection:'row',
    alignItems:'center'
  },
  headWrapper:{
    backgroundColor:FlyColors.baseColor,
    paddingHorizontal:15,
    paddingVertical:20
  },
  whiteFont:{
    color:FlyColors.white,
    fontSize:FlyDimensions.fontSizeXxl
  },
  title:{
    fontSize:FlyDimensions.fontSizeXxl,
    marginBottom:15
  },
  splitLine:{
    backgroundColor:'#FFB386',
    height:15,
    width:1,
    marginHorizontal:25,
    alignSelf:'center'
  },
  iconImg:{
    width:20,
    height:20,
    marginRight:10
  },
  innerWrapper:{
    paddingVertical:10,
    paddingLeft:15,
    backgroundColor:FlyColors.baseTextColor3
  },
  couponImg:{
    width:FlyDimensions.deviceDim.width*0.97,
    height:FlyDimensions.deviceDim.width*0.97*345/1035,
    marginTop:10,
    marginBottom:5,
    justifyContent:'center',
    backgroundColor:'rgba(0,0,0,0)'
  },
  couponMiddle:{
    marginBottom:5,
    lineHeight:22,
    color:FlyColors.baseTextColor2,
    fontSize:FlyDimensions.fontSizeLarge,
    width:FlyDimensions.deviceDim.width*0.55,
    marginTop:2
  },
  couponUnit:{
    color:FlyColors.white,
    height:38,
    textAlignVertical:'bottom',
    fontSize:FlyDimensions.fontSizeH1
  },
  agreeTitle:{
    fontSize:FlyDimensions.fontSizeBase,
    marginLeft:5
  },
  agree:{
    justifyContent:'center',
    flexDirection:'row',
    alignItems:'center'
  },
  btnWrapper:{
    alignItems:'center',
    marginTop:FlyDimensions.deviceDim.width * 0.15
  },
  btn: {
    width: FlyDimensions.deviceDim.width * 0.9,
    height:45
  },
  flyModalBox: {
      width: FlyDimensions.deviceDim.width - 40,
      height: 180,
      borderRadius: 3,
      backgroundColor: FlyColors.baseBackgroundColor,
      marginTop: FlyDimensions.deviceDim.height * 0.2
  },
  noUsed:{
    height:50,
    // backgroundColor:'white',
    justifyContent:'center',
    // alignItems:'center'
  },
  useText:{
    fontSize:FlyDimensions.fontSizeXl,
    color:FlyColors.baseColor,
    // borderWidth:1,
  },
  btnNoUsed:{
    marginTop:10,
    width:FlyDimensions.deviceDim.width * 0.32,
    borderRadius:30,
    borderWidth:1,
    height:FlyDimensions.deviceDim.width * 0.09,
    alignItems:'center',
    justifyContent:'center',
    borderColor:'#DDDDDD'
  },
  passwordBottom:{
   backgroundColor:FlyColors.baseBackgroundColor,
   width:dim.width*0.8,
   height:dim.height*0.27,
   borderBottomLeftRadius:10,
   borderBottomRightRadius:10,
   alignItems:'center'
  },
    ModuleStyle:{
   width:dim.width*0.8,
   height:dim.height*0.4,
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
    passwordModule:{
   width:dim.width*0.8,
   height:dim.height*0.35,
   borderRadius:10
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
      userInfo:store.user.userInfo,
      isLoggedIn:store.user.isLoggedIn,
      userStatus:store.user.userStatus,
    };
}
module.exports = connect(select)(FinancingBuyingView);
