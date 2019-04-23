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
  NativeAppEventEmitter,
  ScrollView,
  Easing
} from 'react-native';

const FlyIconfonts = require('FlyIconfonts');
const {connect} = require('react-redux');

const TimerMixin = require('react-timer-mixin');
const DXRefreshControl = require('DXRefreshControl');

const FlyBase = require('FlyBase');
const FlyColors = require('FlyColors');
const FlyStyles = require('FlyStyles');
const FlyDimensions = require('FlyDimensions');
const FlyImage = require('FlyImage');
const SceneUtils = require('SceneUtils');
const CertificationBox = require('CertificationBox')
const env = require('env');
const FlyHeader = require('FlyHeader');
const NativeModuleUtils = require('NativeModuleUtils');
const FlyModalBox = require('FlyModalBox');
const NetworkService = require('NetworkService');
const Utils = require('Utils');
const {Text} = require('FlyText');
const LISTVIEWREF = 'listview';
const FlyContainer = require('FlyContainer');
const FlyButton = require('FlyButton');
const Filters = require('Filters');
const {getBinding,getUserInfo,getEwallet,sendAuthCode,getElectaccount,getMyIncomeInfo,checkUserOCRToMT,findUserStatus,getMsgCount} = require('../../actions');
const close = './imgs/base/close.png';
const updateBg = "./imgs/base/updateBg.png";
const setting = './imgs/myAssets/setting.png';
const men = './imgs/myAssets/men.png';
const women = './imgs/myAssets/women.png';
const settingNor = './imgs/myAssets/unlogin.png';
const noLogin = './imgs/myAssets/noLogin.png';
const eye = './imgs/myAssets/eye.png';
const eyeN = './imgs/login/eye.png';
const message = './imgs/myAssets/message.png';
const vip = './imgs/myAssets/v.png';
const down = './imgs/myAssets/down.png';
const up = './imgs/myAssets/up.png';
const login = './imgs/myAssets/login.png';
const closeImg = './imgs/login/close.png';
const bankImge = './imgs/financing/bindBankCard.png';
const certification = './imgs/financing/certification.png'
const guideShop= './imgs/profile/guideShop.png'
const IntegralMall = './imgs/profile/IntegralMall.png'
const mall = './imgs/guide/mall.png';
const guideDown = './imgs/guide/down.png';
const {getFirstTime} = require('fly-react-native-app-info');
const moneyGuide = './imgs/profile/moneyGuide.png'
// const e
const dim = FlyDimensions.deviceDim;
const itemWidth = Math.floor(dim.width / 4);
const SCROLLVIEWREF = 'scrollview'

type Props = {
  navigator: Navigator;
};

let mainNavRow1 = {
  type: 'navRow',
  items: [

      {
      label: '存管账户',
      pageName: 'PROFILE_ELECTRONIC',
      imgUrl: './imgs/profile/banksave.png',
      type:''
    },
    {
      label: '资金记录',
      pageName: 'PROFILE_CAPITAL_RECORD',
      imgUrl: './imgs/myAssets/notes.png',
      type:''
    },
    {
      label: '投资记录',
      pageName: 'INVESTMENT_RECORD_VIEW',
      imgUrl: './imgs/myAssets/invest.png',
      type:''
    },
    // {
    //   label: '积分商城',
    //    pageName: '#',
    //   imgUrl: IntegralMall
    // },



  ]
};

let mainNavRow2 = {
  type: 'navRow',
  items: [
           {
      label: '回款日历',
      pageName: 'CALENDAR',
      imgUrl: './imgs/myAssets/calendarIcon.png',
      type:''
    },
      {
      label: '邀请好友',
      pageName: 'https://wap.tongtongli.com/ttlcpg/privateFirends/index.html',
      imgUrl: './imgs/myAssets/users.png',
      type:''
    },

    {
      label: '我的优惠',
      pageName: 'MY_COUPON_VIEW',
      imgUrl: './imgs/myAssets/primeRate.png',
      type:''
    },

  ]
};

let mainNavRow3 = {
  type: 'navRow',
  items: [
      {
      label: '我要加盟',
      pageName: 'PROFILE_JOIN_VIEW',
      imgUrl: './imgs/myAssets/join_in.png',
      type:''
    },
    {
      label: '口令红包',
      pageName: 'https://wap.tongtongli.com/ttlcpg/pasdRed/index.html',
      imgUrl: './imgs/myAssets/redPacket.png',
      type:'redpacket'
    },
    {
      label: '关于我们',
      pageName: 'PROFILE_ABOUT_MAIN_VIEW',
      imgUrl: './imgs/myAssets/we.png',
      type:''
    },


  ]
};

class ProfileMainView extends React.Component {
  props: Props;

  constructor(props) {
    super(props);
    (this: any).renderNavRow = this.renderNavRow.bind(this);
    (this: any)._toNav = this._toNav.bind(this);
    (this: any).goNext = this.goNext.bind(this);
    (this: any)._onRefresh=this._onRefresh.bind(this);

    this.state = {
      isShowEye:true,
      isPrivate:false,
      guide:false,
      Animated: new Animated.Value(0),
      progress_number:0,
      speed_number:0,
      count:null,
      speed:null,
      myIncome:0,
      save:false,
      Electaccount:false,
    }
  }

  componentDidMount() {
   //  this.startAnimation()
 
    let that = this;
    InteractionManager.runAfterInteractions(() => {
      this.props.dispatch(findUserStatus(true));
      that.reloadData()
      that.reloadEwallet = DeviceEventEmitter.addListener(env.ListenerMap['RELOAD_GET_EWALLET'], () => {
        that.reloadData()
      });
    });
      this.performAnimated()
      this.HeaderRefresh()
        }


   HeaderRefresh(){
     let node = this.refs[SCROLLVIEWREF];
     DXRefreshControl.configureCustom(node,{
     headerViewClass:'UIRefreshControl',
     },this._onRefresh);
   }

   performAnimated(){

    this.state.Animated.addListener((state) => {
     this.setState({
     progress_number:state.value
     })
     });
    
   }



   performGuide(){
  
   getFirstTime((respone)=>{
       if (respone['first'] == 'true') {
        this.refs.money.open()
        TimerMixin.setTimeout(()=>{
        this.refs.money.close()
      },4000)
      }
    })

   }


  startAnimation(){

  let totalAmount,freezeAmount,totalInterest,total;

    if (this.props.ewalletInfo) {
       totalAmount = Filters.keepFixed(this.props.ewalletInfo.totalAmount);
       freezeAmount = Filters.keepFixed(this.props.ewalletInfo.freezeAmount);
       totalInterest = Filters.keepFixed(this.props.ewalletInfo.totalInterest);

        total = totalAmount+freezeAmount ;
        Animated.timing(this.state.Animated,{
        toValue:total,
        duration:1500,
        easing:Easing.linear
    }).start(()=>{
     });
    }

   }

   _onRefresh(ignore){
      let that = this 
      const node = that.refs[SCROLLVIEWREF];
      if (!ignore) {
        TimerMixin.setTimeout(()=>{
           this.reloadData();
          DXRefreshControl.endRefreshing(node)
        }, 2000);
       }
    }


  componentWillUnmount(){
      if (this.reloadEwallet) {
      this.reloadEwallet.remove();
    }

  }

  componentWillReceiveProps(nextProps: Props) {

    let next = nextProps
    let moment = this.props
    if ((moment.ewalletInfo)&&(next.ewalletInfo.totalAmount != moment.ewalletInfo.totalAmount||next.isLoggedIn != moment.isLoggedIn || next.msgCount != moment.msgCount)) {
        this.reloadData();
    }
     if (next.isLoggedIn != moment.isLoggedIn) {
         this.showModule()
        }

   
     
  if (moment.userStatus&&(moment.userStatus.isCertification!=next.userStatus.isCertification||moment.userStatus.isTiedCard!=next.userStatus.isTiedCard||moment.userStatus.isSitePass!=next.userStatus.isSitePass)) {
         this.props.dispatch(findUserStatus())
     }

  }

  reloadData(){
    this.props.dispatch(getUserInfo(true));
    this.props.dispatch(getBinding(true))
    this.props.dispatch(getMsgCount(true));
    let promise = this.props.dispatch(getEwallet(true));
    promise.then((data)=>{
     this.startAnimation()
    })
    let promises = this.props.dispatch(getMyIncomeInfo(true));

     let Electaccount = this.props.dispatch(getElectaccount());

         Electaccount.then((data)=>{
            if (data.elecAcctAmount!=0) {  
                  this.setState({
                  Electaccount:true
                })
              }else{
                 this.setState({
                  Electaccount:false
                })
              }
         }).catch((err)=>{

         });
    
    }

  showModule(){
  let promise = this.props.dispatch(findUserStatus())
      promise.then((data)=>{
     if (!data.isCertification) {
         this.refs.bindID.ModuleOpen()
         return
        }else if (!data.isTiedCard) {
         this.refs.bindBank.ModuleOpen()
         return
        }
      })
  }


  _toNav(pageName,title,type) {
    if (pageName == "#") {
      Utils.alert('尚未开放，敬请期待');
    }else{
      if (/^https:\/\//.test(pageName)) {
        SceneUtils.gotoScene("PROFILE_BROWSER_VIEW", {
          title: Utils.htmlDecode(title),
          uri: Utils.htmlDecode(pageName),
          type:type
        });
      }else if (/^http:\/\//.test(pageName)) {
        NativeModuleUtils.openURL(pageName)
      }else {
        SceneUtils.gotoScene(pageName);
      }
    }
  }

  renderNavRow(item) {
    var items = item.items;
    var content = items.map((btn, idx) => {
      var border = (idx != items.length-1) ? styles.navItemRightBorder : null;
      var image = (btn.imgUrl) ? (<FlyImage style={styles.navItemImg} source={btn.imgUrl} />) : (<View/>);
      if (btn.pageName) {
        return (
          <TouchableOpacity key={idx} style={[styles.navItemWrapper, border]} onPress={() => this._toNav(btn.pageName,btn.label,btn.type)}>
            <View style={styles.navItem}>
              {image}
              <Text style={styles.navItemText}>{btn.label}</Text>
            </View>
          </TouchableOpacity>
        );
      }else {
        return (
          <View key={idx} style={[styles.navItemWrapper, border]} underlayColor={FlyColors.baseBackgroundColor2}>
            <View style={styles.navItem}>
              {image}
              <Text style={styles.navItemText}>{btn.label}</Text>
            </View>
          </View>
        );
      }

    });

    return (
      <View style={styles.navRow}>
        {content}
      </View>
    );
  }

  _goLogin(){
    DeviceEventEmitter.emit(env.ListenerMap['LOGIN_MODAL']);
  }

  goNext(name){

    if (this.props.userStatus&&!this.props.userStatus.isCertification) {
         this.refs.bindID.ModuleOpen();
        }else if (this.props.userStatus&&!this.props.userStatus.isTiedCard){
         this.refs.bindBank.ModuleOpen()
       }else if (this.props.userStatus&&!this.props.userStatus.isSitePass){
      let params = {
         title:'设置交易密码',
         step:2
          }
         SceneUtils.gotoScene('CERTIFICATION_PROCESS_VIEW',params)
       }else{

       if (name == 'PROFILE_RECHARGE') {
         SceneUtils.gotoScene(name,{type:'profile'});
       }else {
       let promise = this.props.dispatch(checkUserOCRToMT())
        promise.then((data) => {
           if (data){
             SceneUtils.gotoScene(name);
           }else{
             this.refs.bindOCR.ModuleOpen()
           }
             }).catch((err)=>{
            Utils.alert(err.msg||'服务繁忙');
       })
     }
  }
}

  _renderDetails(money,title,type,textSize){


    let style = {},activeOpacity,onPress;
    switch (type) {
      case 'left':
        style = {flex:1,alignItems:'flex-start'};
        activeOpacity = 1;
        break;
      case 'center':
        style = {flex:1,alignItems:'center'};
        onPress = ()=>SceneUtils.gotoScene('MY_INCOME_VIEW');
        activeOpacity = 0.5;
        break;
      case 'right':
        style = {flex:1,alignItems:'flex-end'};
        activeOpacity = 1;
        break;
      default:
    }

    return(
      <TouchableOpacity style={style} activeOpacity={activeOpacity} onPress={onPress}>
        <Text style={[styles.money,{fontSize:textSize}]}>{(this.state.isShowEye == true) ? money : '****'}</Text>
        <Text style={{color:FlyColors.baseTextColor2,fontSize:FlyDimensions.fontSizeBase}}>{title}</Text>
      </TouchableOpacity>
    )
  }



  _renderPrivate(consultantAmount,promotionAmount){
    let isPrivate = this.state.isPrivate;
    return(
      <View style={{marginTop:dim.width * 0.08}}>
        <TouchableOpacity activeOpacity={0.9} style={styles.vipContianer} onPress={()=>{this.setState({isPrivate:!isPrivate})}}>
          <FlyImage source={vip} width={15}/>
          <Text style={styles.vipTitle}>私人银行收益</Text>
          <FlyImage source={(this.state.isPrivate == false) ? down : up} width={10}/>
        </TouchableOpacity>
        {this.state.isPrivate == true ? (
           <View style={styles.myAssert}>
                <View style={{alignItems:'flex-start',flex:1}}>
                  <Text style={styles.promotionAmount}>{(this.state.isShowEye == true) ? Filters.moneyFixed2(consultantAmount) : "****"}</Text>
                  <Text style={styles.navItemText1}>顾问收益(元)</Text>
                </View>
                <View style={{alignItems:'flex-end',flex:1}}>
                  <Text style={styles.promotionAmount}>{(this.state.isShowEye == true) ? Filters.moneyFixed2(promotionAmount) : "****"}</Text>
                  <Text style={styles.navItemText1}>推广收益(元)</Text>
                </View>
              </View>
        ): null}
      </View>
    )
  }

  _renderAmount(totalAmount,investAmount,freezeAmount,consultantAmount,promotionAmount){


     let myIncome = this.props.myIncome,lastDayIncome='';
    if(myIncome){
      lastDayIncome = Filters.keepFixed(myIncome.lastDayIncome);
    }

      let textSize = (freezeAmount.toString().length>8)||(lastDayIncome.toString().length>8)||(totalAmount.toString().length>8) ? FlyDimensions.fontSizeXxl : FlyDimensions.fontSizeXxxl


    return(
      <View>
        <View style={[styles.amountContianer,{marginTop:dim.width * 0.1}]}>
          {this._renderDetails(Filters.moneyFixed2(freezeAmount),'投资资产(元)','left',textSize)}
          <View style={styles.line}></View>
          {this._renderDetails(lastDayIncome,'昨日收益(元)','center',textSize)}
          <FlyImage style={{marginTop:10,marginLeft:-10,marginRight:10}} source={down} width={15} />
          <View style={styles.line}></View>
          {this._renderDetails(Filters.moneyFixed2(totalAmount),'可用余额(元)','right',textSize)}
        </View>

        {this.props.userInfo && this.props.userInfo.agent == true ? this._renderPrivate(consultantAmount,promotionAmount) : null}
        {this._renderButtom()}
      </View>
    )
  }



  _renderButtom(){
    return(
      <View style={styles.bottomContent}>
        <TouchableOpacity style={styles.btnWrapper1} onPress={()=>this.goNext('PROFILE_RECHARGE')}>
          <FlyImage source={'./imgs/myAssets/buttonHight.png'} style={styles.bottomStyle}>
            <Text style={styles.bottomTitle}>充值
            </Text>
          </FlyImage>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnWrapper2} onPress={()=>this.goNext('PROFILE_WITH_DRAWALS')}>
          <FlyImage source={'./imgs/myAssets/buttonNormal.png'} style={styles.bottomStyle}>
            <Text style={styles.bottomTitle}>提现
            </Text>
          </FlyImage>
        </TouchableOpacity>
      </View>
    )
  }
  
  // renderGuide(){
  //      return(
  //        <FlyModalBox backdropOpacity={0.8} ref={"guide"} positionNumber={205} style={styles.guide}>
  //             <View style={{flex:2,marginTop:20,alignItems:'flex-end',marginRight:1}}>
  //                <Text style={{fontSize:FlyDimensions.fontSizeXxl,width:200,color:'white'}}>「 使用积分兑换商品 」</Text>
  //                <FlyImage style={{marginTop:10,marginLeft:100}} source={guideDown} height={80}/>
  //              </View>
  //             <View style={{flex:1,marginBottom:25,justifyContent:"flex-end"}}>
  //                <TouchableOpacity >
  //                   <FlyImage source={mall} width={120}/>
  //                </TouchableOpacity>
  //             </View>
  //        </FlyModalBox>
  //       )
  // }

  renderMoneyGuide(){
         return(
         <FlyModalBox backdropOpacity={0.5} ref={"money"} position={'top'} style={styles.guide}>
              <TouchableOpacity onPress={()=>{this.refs.money.close()}}>
                 <FlyImage style={{width:dim.width,height:dim.height}} source={moneyGuide}/>
              </TouchableOpacity>
         </FlyModalBox>
        )


  }

  render() {
    

    if (this.state.Electaccount) {
        mainNavRow1.items[0].imgUrl='./imgs/profile/bank_save.png';
    }else{
        mainNavRow1.items[0].imgUrl='./imgs/profile/banksave.png';
    }
    if (this.props.userInfo && this.props.userInfo.agent == true) {
       mainNavRow2.items[1].pageName='https://wap.tongtongli.com/ttlcpg/privateFirends/index.html' 
    }else{
       mainNavRow2.items[1].pageName='https://wap.tongtongli.com/ttlcpg/ordinaryFirends/index.html'
    }

    let contentView,leftItemImg;
    let isShowEye = this.state.isShowEye;
    let ewalletInfo = this.props.ewalletInfo;
    let allAmount = 0,totalAmount = 0,freezeAmount = 0,investAmount = 0,promotionAmount = 0,consultantAmount = 0;
    if (ewalletInfo) {
      totalAmount = Filters.keepFixed(ewalletInfo.totalAmount);
      freezeAmount = Filters.keepFixed(ewalletInfo.freezeAmount);
      investAmount = Filters.keepFixed(ewalletInfo.investAmount);
      consultantAmount = Filters.keepFixed(ewalletInfo.consultantAmount);
      promotionAmount = Filters.keepFixed(ewalletInfo.promotionAmount);
      allAmount = this.state.progress_number;
    }
    
    if (this.props.isLoggedIn) {
    
      let Titleimge = settingNor;
     if (this.props.userInfo&&this.props.userInfo.sex) {
        Titleimge = (this.props.userInfo.sex==1) ? men : women ;
      }
      let font = (allAmount.toString().length > 7) ? FlyDimensions.fontSizeH0 :FlyDimensions.fontSizeH2

      leftItemImg = Titleimge;
      contentView = (
        <View style={{marginTop:15}}>
          <View style={styles.amountContianer}>
            <TouchableOpacity style={{width:dim.width * 0.5}} onPress={()=>this.goNext('PROFILE_TOTAL_AMOUNT')}>
              <Animated.Text style={[styles.amount,{fontSize:font}]}>{(this.state.isShowEye == true) ? allAmount.toFixed(2) : '****'}</Animated.Text>
                <View style={{flexDirection:'row'}}>
                <Text style={{color:FlyColors.baseTextColor2,fontSize:FlyDimensions.fontSizeBase}}>总资产(元)</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>this.setState({isShowEye:!isShowEye})} style={{paddingTop:8,paddingLeft:8,flex:1,alignItems:'flex-end'}}>
              <FlyImage source={(this.state.isShowEye == true) ? eye : eyeN} width={dim.width * 0.06}/>
            </TouchableOpacity>
          </View>
          {this._renderAmount(totalAmount,investAmount,freezeAmount,consultantAmount,promotionAmount)}
        </View>
      )
    }else {
      leftItemImg = settingNor;
      contentView = (
        <View style={{marginBottom:10}}>
          <FlyImage source={noLogin} width={dim.width}/>
          <TouchableOpacity onPress={this._goLogin} style={styles.btnWrapper}>
            <FlyImage source={login} style={{justifyContent:'center',alignItems:'center'}} height={55}>
              <Text style={styles.login}>立即登录体验
              </Text>
            </FlyImage>
          </TouchableOpacity>
        </View>
      )
    }

    let leftItem = {
      image:leftItemImg,
      imageWidth:35,
      onPress:()=>SceneUtils.gotoScene('PERSONAL_CENTER')
    };
    let rightItem = {
      image:message,
      count:this.props.msgCount,
      imageWidth:18,
      style:{alignItems:'flex-end'},
      onPress:() =>{
        SceneUtils.gotoScene('PROFILE_MESSAGE_VIEW');
      }
    };
    return (
      <View style={FlyStyles.container}>
        <FlyHeader leftItem={leftItem} rightItem={rightItem} title={'我的资产'} borderBottom={true} />
        <View/>
        <ScrollView ref={SCROLLVIEWREF} style={{marginBottom:50}} automaticallyAdjustContentInsets={false}>
          {contentView}
          {this.renderNavRow(mainNavRow1)}
          {this.renderNavRow(mainNavRow2)}
          {this.renderNavRow(mainNavRow3)}
        </ScrollView>
        <CertificationBox ref="bindBank" isBank={true}/>
        <CertificationBox ref="bindID" isID={true}/>
        <CertificationBox ref="bindOCR" isOCR={true}/>
         {this.renderMoneyGuide()}
      </View>
    )
  }
}



var styles = StyleSheet.create({
  navItemWrapper: {
    paddingBottom:5,
    borderBottomWidth: 0.5,
    borderBottomColor: FlyColors.baseBorderColor,
    flex:1,
  },
  navRow: {
    flex: 1,
    flexDirection: 'row',
  },
  navItem: {
    flex: 1,
    height: itemWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItemImg: {
    width: itemWidth * 0.34,
    height: itemWidth * 0.34,
    resizeMode:'contain'
  },
  navItemText: {
    marginTop: 10,
    fontSize: FlyDimensions.fontSizeLarge,
    fontWeight:'700'
  },
  navItemText1:{
    marginTop: 10,
    fontSize: FlyDimensions.fontSizeBase,
    color:FlyColors.baseBackgroundColor2,
  },
  btnWrapper: {
    marginTop: dim.width * 0.1,
    justifyContent:'center',
    alignItems:'center'
  },

  btnWrapper1: {
    justifyContent:'center',
    alignItems:'flex-start',
    flex:1,
    marginLeft:15
  },
  btnWrapper2: {
    justifyContent:'center',
    alignItems:'flex-end',
    flex:1,
    marginRight:15
  },

  btn: {
    width: FlyDimensions.deviceDim.width * 0.5,
    borderRadius:30,
    height:44
  },

  btn1: {
    width: FlyDimensions.deviceDim.width * 0.38,
    borderRadius:30,
    height:44,
  },

  amount:{
    flex:1,
    color:FlyColors.baseColor,
    fontWeight:'600',
    marginBottom:2,
    fontFamily:"din alternate",
  },
  amountContianer:{
    marginLeft:15,
    flexDirection:'row',
    marginRight:15,
  },
  amountDetils:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  },
  details:{
    flex:1,
    // alignItems:'center'
  },
  vipContianer:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center'
  },
  vipTitle:{
    color:FlyColors.baseColor,
    fontSize:FlyDimensions.fontSizeLarge,
    marginLeft:5,
    marginRight:5
  },
  myAssert:{
    flexDirection:'row',
    marginLeft:15,
    marginRight:15,
    marginTop:15
  },
  bottomStyle:{
    alignItems:'center',
    justifyContent:'center',
    width:dim.width * 0.4,
    height:dim.width * 0.13,
    resizeMode:'stretch',

  },
  bottomTitle:{
    fontSize:FlyDimensions.fontSizeXxl,
    backgroundColor:'rgba(0,0,0,0)',
    color:'white'
  },
  login:{
    color:'white',
    fontSize:FlyDimensions.fontSizeXl,
    backgroundColor:'rgba(0,0,0,0)',
    marginTop:-dim.width * 0.02
  },
  money:{
    marginBottom:5,
    fontWeight:'700',
    color:FlyColors.baseTextColor4,
    fontFamily:"din alternate",
  },
  promotionAmount:{
    fontSize:FlyDimensions.fontSizeXxxl,
    fontWeight:'700',
    color:FlyColors.baseTextColor4,
    fontFamily:"din alternate",
  },
  line:{
    height:30,
    width:1,
    borderColor:FlyColors.baseTextColor3,
    borderWidth:0.5
  },
    ModuleStyle:{
   width:dim.width*0.8,
   height:dim.height*0.4,
   borderRadius:10,
   alignItems:'center'
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
  bottomContent:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    marginTop:dim.width * 0.11,
    marginBottom:dim.width * 0.08
  },
  guide:{
   justifyContent:'center',
   width:dim.width,
   height:200,
   backgroundColor:'transparent',
   flexDirection:'row'
  }

});

function select(store) {
  return {
    isLoggedIn:store.user.isLoggedIn,
    userInfo:store.user.userInfo,
    msgCount:store.user.msgCount,
    ewalletInfo:store.profile.ewalletInfo,
    userStatus:store.user.userStatus,
    myIncome:store.profile.myIncome,
  };
}

module.exports = connect(select)(ProfileMainView);
