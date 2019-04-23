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
  Navigator,
  View,
  ScrollView,
  InteractionManager,
  TouchableOpacity,
  Animated,
  NativeModules
}
from 'react-native';
const FlyModalBox = require('FlyModalBox');
var {connect} = require('react-redux');
const Filters = require('Filters');
const FlyStyles = require('FlyStyles');
const CertificationBox = require('CertificationBox')
const FlyColors = require('FlyColors');
const FlyDimensions = require('FlyDimensions');
const FlyImage = require('FlyImage');
const DXRefreshControl = require('DXRefreshControl');
const SceneUtils = require('SceneUtils');
const EnterViewPager = require('./EnterViewPager');
const TimerMixin = require('react-timer-mixin');
const Utils = require('Utils');
const EnterNavigationBar = require('./EnterNavigationBar');
const {OneLine, Text} = require('FlyText');
const news = './imgs/enter/news.png';
const newUser = './imgs/enter/new.png';
const hot = './imgs/enter/hot.png';
const bg = './imgs/enter/bg.png';
const ensure = './imgs/enter/ensure.png';
const layer = './imgs/enter/Layer.png';
const me = './imgs/enter/me.png';
const test = './imgs/enter/test.png';
const weal = './imgs/enter/weal.png';
const bt_bg = './imgs/enter/bt_bg.png';
const cg_bg = './imgs/enter/cg_bg.png'
const bankImge = './imgs/financing/bindBankCard.png';
const certification = './imgs/financing/certification.png'
const closeImg = './imgs/login/close.png'
const today = './imgs/enter/today.png';
const signOn ='https://wap.tongtongli.com/ttlcpg/signOn/index.html';
const shopping = './imgs/enter/shopping.png'
const newTag = './imgs/enter/newTag.png'
const activityClose = './imgs/invite/closed.png';

const {
  getStatData,
  queryPushMsgData,
  cheackUserIsnew,
  getListNewp,
  findUserStatus} = require('../../actions');

const DEFAULT_SIZE = {
  width: 640,
  height: 340,
};

const dim = FlyDimensions.deviceDim;
const marginTopAll = dim.width * 0.02;
const SCROLLVIEWREF = 'scrollview'
const newPerson = {

    left:'关于我们',
    leftImg:layer,
    leftSence:'https://wap.tongtongli.com/ttlcpg/aboutUs/app/index.html',
    right:'安全保障',
    rightImg:ensure,
    rightSence:'PROFILE_SAFE_VIEW',
    topic:'新人专享',
    topicImg:newUser,
    des:'新手专享',
}
const person = {
     left:'我的投资',
     leftImg:me,
     leftSence:'INVESTMENT_RECORD_VIEW',
     right:'我的福利',
     rightImg:weal,
     rightSence:'MY_VOUCHER_COUPON_VIEW',
     topic:'热门推荐',
     topicImg:hot,
     des:'消费金融',
}

class EnterMainView extends React.Component {
  props: Props;

  constructor(props) {

    super(props);

   (this:any)._onRefresh=this._onRefresh.bind(this);
   (this: any).handleHorizontalScroll = this.handleHorizontalScroll.bind(this);

    this.state={
      personState:{},
      statData:{},
      showFixHeader: false,
      anim: new Animated.Value(0),
      isNew:false,
      activityBegin:null,
      activityEnd:null,
      activityImg:null,
      activityUrl:null,
    }
  }


  componentDidMount() {


      InteractionManager.runAfterInteractions(() => {
      this._onRefresh(true)
       let promise = this.props.dispatch(getStatData(true));
       promise.then((data)=>{
        if (data&&data.popupWindow) {
         this.setState({
          activityImg:data.popupWindow.popupImage,
          activityUrl:data.popupWindow.linkUrl,
         })
         if (this.checkflow()) {
              this.refs.activity.open()
         }
        }
          return this.props.dispatch(getListNewp(true));
         })

        this.props.dispatch(getListNewp(true));
       if (this.props.isLoggedIn) {
         this.checkflow()
        }
       });

}


  TEST(){


  }
     


   componentWillReceiveProps(nextProps){

     if (nextProps.isLoggedIn!==this.props.isLoggedIn){
        this.reloadData(nextProps.isLoggedIn);
      }
  }

  checkflow(){
        this.props.dispatch(findUserStatus(true));
    if (this.props.userStatus&&!this.props.userStatus.isCertification) {
         this.refs.bindID.ModuleOpen()
         return false
       }else if (this.props.userStatus&&!this.props.userStatus.isTiedCard){
         this.refs.bindBank.ModuleOpen()
         return false
      }else{
          return true
      }
  }


  reloadData(status){
    this.perosnStatus(status);
    this.props.dispatch(getStatData());
    this.props.dispatch(getListNewp());
  }


  renderActivity(){
    return(
      <FlyModalBox positionNumber={150} ref={"activity"} style={styles.activity}>
       <View>
        <TouchableOpacity onPress={()=>{
          SceneUtils.gotoScene(Filters.htmlDecode(this.state.activityUrl))
         this.refs.activity.close()
        }}>
         <FlyImage source={this.state.activityImg} style={{width:dim.width*0.8,height:dim.height*0.45}}/>
        </TouchableOpacity> 
       </View>
         <TouchableOpacity onPress={()=>{this.refs.activity.close()}}>
             <FlyImage style={{marginTop:30}} source={activityClose} width={30}/>
         </TouchableOpacity> 
      </FlyModalBox>
      )
  }

     perosnStatus(status){
      if (status) {
        let promise = this.props.dispatch(cheackUserIsnew());
        promise.then((data) => {
          let state= data ? newPerson : person;
          this.setState({
              personState:state,
              isNew:data
          });
        });
      }else {
        this.setState({personState:newPerson});
      }
  }

    componentDidUpdate(props,state){
       let node = this.refs[SCROLLVIEWREF];
       DXRefreshControl.configureCustom(node,{
         headerViewClass:'UIRefreshControl',
       },this._onRefresh);
    }

    _onRefresh(ignore){
      this.perosnStatus(this.props.isLoggedIn);
      const node = this.refs[SCROLLVIEWREF];
      if (!ignore) {
        TimerMixin.setTimeout(()=>{
          DXRefreshControl.endRefreshing(node)
        }, 2000);
       }
    }

  renderHeadView(){
    return(
      <View>
        <EnterViewPager style={{width:dim.width,height:300}}/>
      </View>
    );
  }
   renderSelectView(){
   
       //      <TouchableOpacity style={styles.selectContent} onPress={()=>{SceneUtils.gotoScene(this.state.personState.rightSence)}}>
       //        <FlyImage source={shopping} width={40}/>
       //        <Text style={styles.details}>积分商城</Text>
        //       <FlyImage source={newTag} style={{position:'absolute',top:10,right:10}} width={30}/>
        //      </TouchableOpacity>

     return(
       <FlyImage source={bg} style={styles.selectMainV}>
           <TouchableOpacity style={styles.selectContent} onPress={()=>{SceneUtils.gotoScene(Utils.htmlDecode(signOn))}}>
               <FlyImage source={today} width={40}/>
               <Text style={styles.details}>签到</Text>
                <FlyImage source={newTag} style={{position:'absolute',top:10,right:20}} width={30}/>
            </TouchableOpacity>
             <TouchableOpacity style={styles.selectContent} onPress={()=>{SceneUtils.gotoScene(this.state.personState.leftSence)}}>
               <FlyImage source={this.state.personState.leftImg} width={40}/>
               <Text style={styles.details}>{this.state.personState.left}</Text>
           </TouchableOpacity>
           <TouchableOpacity style={styles.selectContent} onPress={()=>{SceneUtils.gotoScene(this.state.personState.rightSence)}}>
               <FlyImage source={this.state.personState.rightImg} width={40}/>
               <Text style={styles.details}>{this.state.personState.right}</Text>
            </TouchableOpacity>
       </FlyImage>
     );
   }
   renderProperty(){

     let newContent,changeCotent;
  
     if (this.props.isLoggedIn) {

     changeCotent=(
             <View style={styles.propery}>
               <Text style={styles.countText}>{Filters.formatMoney(this.props.statData.userCount,0,'')}</Text>
               <Text style={styles.propertyText}>平台用户数</Text>
            </View>
          )
     }else{
      changeCotent=(  
            <View style={styles.propery}>
                <Text style={styles.countText}>{Filters.formatMoney(this.props.statData.allInterest,2,'')}</Text>
               <Text style={styles.propertyText}>为客户盈利(元)</Text>
            </View>
        )   

     }

     return(
       <View style={styles.propertyMainV}>
            <View style={styles.propery}>
               <Text style={styles.countText}>{Filters.formatMoney(this.props.statData.allAmount,2,'')}</Text>
               <Text style={styles.propertyText}>累计投资金额(元)</Text>
            </View>
               <View style={styles.properyLine}/>
               {changeCotent}
       </View>
     );
   }
  goShopping(item){
    SceneUtils.gotoScene('FINANCING_DETAILS',{brId:item.id,title:item.loanTitle})
  }

  isAgent(){
    if(this.props.isLoggedIn&&this.props.userInfo){
      return this.props.userInfo.agent;
    }else{
      return false;
    }
  }

  renderTopic(){
    let listdata = this.props.listdata;
    if(listdata){
      let periodTxt;
      if(listdata.periodType=='month'){
        periodTxt = '个月';
      }else if(listdata.periodType=='year'){
        periodTxt = '年';
      }else{
        periodTxt = '天';
      }

      let baseInterest = "-",extraInterest = "-";
      let item = listdata;
      if(!this.isAgent()){
        baseInterest = Filters.percentage(item.interest);
        extraInterest = (item.normalExtraRate)?` +${Filters.percentage(item.normalExtraRate)}`:null;
      }else if(this.isAgent()&&item.agentInterest){
        baseInterest = Filters.percentage(item.agentInterest);
        extraInterest = (item.personalExtraRate)?` +${Filters.percentage(item.personalExtraRate)}`:null;
      }else if(this.isAgent()&&!item.agentInterest){
        baseInterest = Filters.percentage(item.interest);
        extraInterest = (item.personalExtraRate)?` +${Filters.percentage(item.personalExtraRate)}`:null;
      }


     return(
       <TouchableOpacity style={[styles.topicContianer,{width:dim.width}]}  activeOpacity={1} onPress={()=>this.goShopping(listdata)}>
             <View style={styles.topicMainV}>
                <Text style={styles.topic}>{this.state.personState.topic}</Text>
             </View>

            <FlyImage source={bt_bg} style={{resizeMode:'contain',marginRight:15,marginBottom:15,marginLeft:15,alignItems:'center',height:dim.height*0.2}} >
               <View style={{alignItems:'center',marginTop:marginTopAll}}>
                  <Text style={{marginTop:2,fontSize:FlyDimensions.fontSizeLarge,color:FlyColors.baseTextColor4,}}>{listdata.loanTitle}</Text>
               </View>
            <View style={[styles.detailsContainer,{marginTop:dim.width * 0.025}]}>
               <Text style={styles.years}>{baseInterest}<Text style={styles.threeP}>{extraInterest}</Text></Text>
               <Text style={styles.loan}>{listdata.period}<Text style={{fontSize:FlyDimensions.fontSizeBase}}>{periodTxt}</Text></Text>
               <Text style={styles.conversion}>{this.conversion((listdata.totalAmt - listdata.leftBAmt)/this.props.listdata.totalAmt*100)}%</Text>
            </View>
            <View style={styles.detailsContainer}>
               <Text style={[styles.yearsDetails,{textAlign:'left'}]}>预期年化利率</Text>
               <Text style={[styles.yearsDetails,{textAlign:'center'}]}>理财期限</Text>
               <Text style={[styles.yearsDetails,{textAlign:'right'}]}>已募集</Text>
            </View>

            <View style={styles.goShopping}>
                 <Text style={styles.goShoppingText}>立即申购</Text>
            </View>
            </FlyImage>

        </TouchableOpacity>
     );
   }
  }
  handleHorizontalScroll(e: any){
    let y = e.nativeEvent.contentOffset.y;
    this.state.anim.setValue(y);
     this.setState({
       showFixHeader: (y > 0),
       });
    if (y > FlyDimensions.navHeight) {
      SceneUtils.setStatusBarStyle('default', true);
    } else {
      SceneUtils.setStatusBarStyle('light-content', true);
    }
  }

  conversion(count){
    return parseFloat(count.toPrecision(4))
  }

  renderMainView(){
     return(
       <View style={{alignItems:'center'}}>
         {this.renderSelectView()}
         {this.renderProperty()}
         {this.renderTopic()}
         <FlyImage source={cg_bg} width={dim.width} style={{marginTop:10}}/>
       </View>

     );

  }
  _renderFixHeader() {

    if (!this.state.showFixHeader) {
      return null;
    }

    let transform = {
      opacity: this.state.anim.interpolate({
        inputRange: [0, FlyDimensions.navHeight],
        outputRange: [0, 0.9],
        extrapolate: 'clamp',
      })
    };
    return (
      <View style={styles.header}>
        <EnterNavigationBar navigator={this.props.navigator} isFix={true} transform={transform} />
      </View>
    );
  }

  render() {
    return(
      <View style={[FlyStyles.container, FlyStyles.bottomNavHeight]}>
        <ScrollView onScroll={this.handleHorizontalScroll}
                    showsVerticalScrollIndicator={false}
                    ref={SCROLLVIEWREF}
                    style={styles.scrollView}
                    automaticallyAdjustContentInsets={false}>
           {this.renderHeadView()}
           {this.renderMainView()}
        </ScrollView>
           <CertificationBox ref="bindBank" isBank={true}/>
           <CertificationBox ref="bindID" isID={true}/>
           <CertificationBox ref="bindOCR" isOCR={true}/>
          {this.renderActivity()}
      </View>
    );

    }
  }
var imgHeight = FlyDimensions.getImgHeightWithWidth(DEFAULT_SIZE);

var styles = StyleSheet.create({

  header: {
    position: 'absolute',
    top: 0,
    width: FlyDimensions.deviceDim.width,
    height: FlyDimensions.headerHeight,
  },
  bottomDescribe:{
    color:FlyColors.baseBorderColor2,
    fontSize:FlyDimensions.fontSizeBase,
    marginTop:marginTopAll*1,
    textAlign:'center',
    marginBottom:marginTopAll * 0.9
  },
  scrollView:{
    backgroundColor:FlyColors.baseBackgroundColor,
  },
  propertyMainV:{
    backgroundColor:'white',
    flexDirection:'row',
    marginTop:10,
    height:dim.width * 0.22,
    alignItems:'center'
  },
  propertyText:{
    marginTop:10,
    fontSize:FlyDimensions.fontSizeLarge,
    color:FlyColors.baseTextColor2
  },
  countText:{
   fontSize:FlyDimensions.fontSizeH0,
   fontWeight:'bold',
   color:FlyColors.baseTextColor4,
   fontFamily:"din alternate"
  },
  headMainV:{
    flexDirection:'row',
    justifyContent:'flex-end',
    paddingTop:20,
  },
  selectMainV:{
    flexDirection:'row',
    justifyContent:'center',
    backgroundColor:'white',
    height:dim.width * 0.23
  },
  selectContent:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
  },
  topicMainV:{
    marginTop:15,
    marginLeft:15,
    marginBottom:12,
  },
  topicText:{
     flex:1,
     justifyContent:'center',
     marginTop:dim.width * 0.1,
     marginBottom:10,
     marginLeft:15,
     marginRight:15,
  },
  goShopping:{
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:FlyColors.baseColor,
    height:dim.height*0.04,
    width:dim.width*0.4,
    borderRadius:15,
  },
  goShoppingText:{
    fontSize:FlyDimensions.fontSizeXxl,
    color:'white',
    paddingLeft:15,
    paddingRight:15,
  },
  propery:{
    justifyContent:'center',
    alignItems:'center',
    flex:1,
  },
  properyLine:{
    backgroundColor:FlyColors.baseBackgroundColor,
    width:1,
    height:dim.width * 0.08
  },
  topicContianer:{
    backgroundColor:'white',
    marginTop:10,
  },
  topicLine:{
    borderWidth:0.5,
    borderColor:FlyColors.baseTextColor3,
    width:dim.width * 0.92,
  },
  details:{
    marginTop:10,
    color:'#666666',
    fontSize:FlyDimensions.fontSizeLarge
  },
  topic:{
   fontSize:FlyDimensions.fontSizeXl,
   fontWeight:'500'
  },
  threeP:{
    color:FlyColors.baseColor,
    fontSize:FlyDimensions.fontSizeXxl,
    fontWeight:'bold',
    fontFamily:"din alternate",
    marginTop:dim.width * 0.02
  },
  years:{
    color:FlyColors.baseColor,
    fontSize:FlyDimensions.fontSizeH4,
    fontWeight:'bold',
    fontFamily:"din alternate",
    marginLeft:15,
    flex:1,
  },
  loan:{
    fontWeight:'bold',
    fontSize:FlyDimensions.fontSizeH0,
    fontFamily:"din alternate",
    textAlign:'center',
    paddingBottom:2,
    flex:1,
    color:FlyColors.baseTextColor4
  },
  conversion:{
    fontWeight:'bold',
    fontSize:FlyDimensions.fontSizeH0,
    fontFamily:"din alternate",
    flex:1,
    textAlign:'right',
    marginRight:15,
    paddingBottom:2,
    color:FlyColors.baseTextColor4
  },
  yearsDetails:{
    color:FlyColors.baseTextColor2,
    fontSize:FlyDimensions.fontSizeBase,
    marginTop:5,
    marginBottom:marginTopAll,
    flex:1,
    marginLeft:15,
    marginRight:15
  },
  detailsContainer:{
    flexDirection:'row',
    alignItems:'flex-end',
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
  activity:{
    width:dim.width*0.8,
    height:imgHeight,
    backgroundColor:'transparent',
    alignItems:'center'
  }
});

function select(store,props) {
  return {
    isNewPerson:store.enter.isNewPerson,
    statData:store.enter.statData,
    listdata:store.enter.listdata,
    isLoggedIn:store.user.isLoggedIn,
    userInfo:store.user.userInfo,
    userStatus:store.user.userStatus,
  };
}

module.exports = connect(select)(EnterMainView);
