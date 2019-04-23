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
  ProgressViewIOS,
  ActivityIndicator,
  TextInput
} from 'react-native';

const {connect} = require('react-redux');

const TimerMixin = require('react-timer-mixin');
const DXRefreshControl = require('DXRefreshControl');

const FlyBase = require('FlyBase');
const CertificationBox = require('CertificationBox')
const FlyColors = require('FlyColors');
const FlyStyles = require('FlyStyles');
const FlyDimensions = require('FlyDimensions');
const FlyImage = require('FlyImage');
const SceneUtils = require('SceneUtils');
const env = require('env');
const FlyHeader = require('FlyHeader');
const FlyItem = require('FlyItem');
const FlyViewPager = require('FlyViewPager');
const {queryUserInvestmentByUnderlyId,findUserStatus} = require('../../actions');
const NativeModuleUtils = require('NativeModuleUtils');
const FlyModalBox = require('FlyModalBox');
const close = './imgs/base/close.png';
const updateBg = "./imgs/base/updateBg.png";
const NetworkService = require('NetworkService');
const Utils = require('Utils');
const {Text} = require('FlyText');
const LISTVIEWREF = 'listview';
const dim = FlyDimensions.deviceDim;
const FlyContainer = require('FlyContainer');
const FlyBottomButton = require('FlyBottomButton');
const FlyRefreshListView = require('FlyRefreshListView');
const {moneyFixed,percentage,financeStatus,scheduleType,keepFixed} = require('Filters');
const {checkBasicInfo,calculateProfit} = require('../../actions');
const titleArr = ['项目简介','投资记录','还款计划'];
const FinancingIntroduce = require('./FinancingIntroduce');   //项目简介
const FinancingRepaymentPlan = require('./FinancingRepaymentPlan');   //还款计划
const FlyListContainer = require('FlyListContainer');
const FlyPureListView = require('FlyPureListView');
const FlyProgress = require('FlyProgress');
const FlyShare = require('FlyShare');
const bankImge = './imgs/financing/bindBankCard.png';
const certification = './imgs/financing/certification.png';
const closeImg = './imgs/login/close.png'


type Props = {
  navigator: Navigator;
  Uninfo:Boolean;
};

class FinancingDetails extends React.Component {
  props: Props;

  constructor(props) {
    super(props);
    (this: any)._onSelectedIndexChange = this._onSelectedIndexChange.bind(this);
    (this: any).titleView = this.titleView.bind(this);
    (this: any).renderContent = this.renderContent.bind(this);
    (this: any)._showInterest = this._showInterest.bind(this);
    (this: any)._showPeriod = this._showPeriod.bind(this);
    (this: any)._renderInvestItem = this._renderInvestItem.bind(this);
    (this: any).showButtonView = this.showButtonView.bind(this);
    (this: any)._renderRow = this._renderRow.bind(this);
    (this: any)._onEndReached = this._onEndReached.bind(this);
    (this: any).renderInvestHeader = this.renderInvestHeader.bind(this);
    (this: any).renderFooter = this.renderFooter.bind(this);
    (this: any)._showCalculator = this._showCalculator.bind(this);
    (this: any)._changeMoney = this._changeMoney.bind(this);
    (this: any).toBuy = this.toBuy.bind(this);

    this.ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.limit = 10;
    this.offset = 1;
    this.state = {
      dataSource:  this.ds.cloneWithRows(['row 1']),
      basicInfos:null,
      selectedIndex:0,
      investRecordArr: [],
      firstShow:false,
      isData:false,
      lastShow:false,
      isRefreshing:false,
      profit:0,
      result:0,
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
    that.props.dispatch(findUserStatus())

    InteractionManager.runAfterInteractions(() =>{
       this._checkUser();
      that._reloaderData(1);
      that.refreshFinancing = DeviceEventEmitter.addListener(env.ListenerMap['REFRESH_FINANCING_DETAIL'], () => {
         that._reloaderData(1);
      });
    });
  }

  componentWillUnmount(){
    this.offset = 1;
    if (this.refreshFinancing) {
      this.refreshFinancing.remove();
    }
  }

  _reloaderData(offset){
      let investRecordArr = this.state.investRecordArr;
      let promise = this.props.dispatch(queryUserInvestmentByUnderlyId(this.props.brId,10,offset));
      promise.then((data)=>{
        if (data && data.items && data.items.length > 0) {
          data.items.map((item,idx)=>{
            investRecordArr.push(item);
          });
        }
        if (offset == 1) {
          if (data && data.items && data.items.length < 10) {
            this.setState({
              firstShow:true,
              isData:false
            })
          }else if (!data  || (data && data.items && data.items.length == 0)) {
            this.setState({
              firstShow:false,
              isData:true
            })
          }
        }

        if (offset > 1) {
          if (data && data.items && data.items.length > 0) {
            this.setState({
              lastShow:false
            })
          }else {
            this.setState({
              lastShow:true
            })
          }
        }

        this.setState({
          investRecordArr:investRecordArr,
          isRefreshing:false
        });
      }).catch((err)=>{
        this.setState({
          isRefreshing:false
        })
      });
  }

  // 判断用户是否为代理
    _checkUser(){
      let basicInfoForm = this.props.dispatch(checkBasicInfo(this.props.brId,true));
      basicInfoForm.then((data) => {
        this.setState({
          basicInfos:data,
        });
      }).catch((err) => {
      });
    }

  _onSelectedIndexChange(index) {
      this.setState({
        selectedIndex: index,
        dataSource: this.ds.cloneWithRows(['row 1'])
      });
    }


  titleView() {
    let title = titleArr.map((data,index) => {
      return (
        <TouchableOpacity key={"titleView"+index} style={[{width: dim.width/titleArr.length},styles.title,(this.state.selectedIndex == index) ? styles.titleSelected : null]} onPress={() => this._onSelectedIndexChange(index)}>
          <Text style={[(this.state.selectedIndex == index) ? styles.textSelected : styles.textBase,{marginTop:1}]}>{data}</Text>
        </TouchableOpacity>
      )
    });
    return (
      <View style={{height: 50,flexDirection: 'row',backgroundColor:FlyColors.white}}>
        {title}
      </View>
    );
}

_timeLine(){
    if(!Utils.isEmpty(this.state.basicInfos)){
      let data = this.state.basicInfos;
      return(
        <View style={{height:dim.width * 0.28,backgroundColor:FlyColors.white,alignItems:'center',paddingHorizontal:15,justifyContent:'center'}}>
          <View style={styles.rowWrapper}>
            <Text style={[styles.itemText,{fontSize:null}]}>投资</Text>
            <Text style={[styles.itemText,{textAlign:'center',fontSize:null}]}>开始计息</Text>
            <Text style={[styles.itemText,{textAlign:'right',fontSize:null}]}>本息到账</Text>
          </View>
          <View style={{justifyContent:'center',height:8,marginVertical:5}}>
            <FlyImage source={'./imgs/supermarket/time-line.png'} style={styles.timeLineImg}/>
            <View style={{flexDirection:'row',position:'absolute',top:0,right:0,left:0,bottom:0}}>
              <View style={{flex:1}}>
                <View style={styles.timeLineOval}/>
              </View>
              <View style={{flex:1}}>
                <View style={[styles.timeLineOval,{alignSelf:'center'}]}/>
              </View>
              <View style={{flex:1}}>
                <View style={[styles.timeLineOval,{alignSelf:'flex-end'}]}/>
              </View>
            </View>
          </View>
          <View style={styles.rowWrapper}>
            <Text style={[styles.itemText,{fontSize:FlyDimensions.fontSizeLarge}]}>{data.createTime.substr(0,10)}</Text>
            <Text style={[styles.itemText,{textAlign:'center',fontSize:FlyDimensions.fontSizeLarge}]}>{data.earnBeginTime.substr(0,10)}</Text>
            <Text style={[styles.itemText,{textAlign:'right',fontSize:FlyDimensions.fontSizeLarge}]}>{data.earnEndTime.substr(0,10)}</Text>
          </View>
        </View>
      );
    }
  }


renderContent(){
  let haveInvested = 0,minBidAmt,leftBAmt,basicInfos=this.state.basicInfos,progressView,repaymentWay;
  if (basicInfos) {
    haveInvested = (basicInfos.totalAmt - basicInfos.leftBAmt)/basicInfos.totalAmt;
    minBidAmt = basicInfos.minBidAmt;
    leftBAmt = basicInfos.leftBAmt;
    repaymentWay = basicInfos.repaymentWay;
    progressView = (
      <FlyProgress toValue={haveInvested * (dim.width - 30)} duration={1000} progressWidth={dim.width - 30}
       circleColor={'white'} backgroundColor={'#FFB386'}
       frontColor={'white'} style={{marginBottom:10}} isCircle={true}/>
    )
  }


  return(
    <View style={styles.header}>
      <View style={{justifyContent:'center',alignItems:'center'}}>
        <Text style={{color:'#FFDECB',fontSize:FlyDimensions.fontSizeBase}}>预期年化收益率</Text>
        {this._showInterest()}
      </View>
      <View style={{flexDirection:'row',paddingBottom:15}}>
        {this._showPeriod()}
        <View style={{height:20,borderWidth:0.5,borderColor:'white'}} opacity={0.3}>
        </View>
        <View style={styles.periodStyle}>
          <Text style={{color:'#FFDECB',paddingBottom:5,fontSize:FlyDimensions.fontSizeBase}}>起投金额</Text>
          <Text style={styles.textStyle1}>{minBidAmt}<Text style={{fontSize:FlyDimensions.fontSizeBase,color:'white'}}>元</Text></Text>
        </View>
      </View>
      <View>
        {progressView}
        <View style={{alignItems:'center'}}>
          <Text style={styles.progressText}>已投资{percentage(haveInvested)},剩余可投{leftBAmt}元</Text>
        </View>
      </View>
      {this._timeLine()}
      {FlyBase.SegmentView()}
      <View style={styles.backMoney}>
        <Text style={{paddingLeft:15,fontSize:FlyDimensions.fontSizeXl}}>还款方式</Text>
        <Text style={{color:FlyColors.baseTextColor4,fontSize:FlyDimensions.fontSizeXl,marginRight:15}}>{scheduleType(repaymentWay)}</Text>
      </View>
    </View>
  );
}

isAgent(){
    if(this.props.isLoggedIn&&this.props.userInfo){
      return this.props.userInfo.agent;
    }else{
      return false;
    }
  }

// 年化利率
  _showInterest(){
    let baseInterest = "-",extraInterest = "-";
    let item = this.state.basicInfos;
    if(item){
      if(!this.isAgent()){
        baseInterest = percentage(item.interest);
        extraInterest = (item.normalExtraRate)?` +${percentage(item.normalExtraRate)}`:null;
      }else if(this.isAgent()&&item.agentInterest){
        baseInterest = percentage(item.agentInterest);
        extraInterest = (item.personalExtraRate)?` +${percentage(item.personalExtraRate)}`:null;
      }else if(this.isAgent()&&!item.agentInterest){
        baseInterest = percentage(item.interest);
        extraInterest = (item.personalExtraRate)?` +${percentage(item.personalExtraRate)}`:null;
      }
    }


    return (
      <View style={{flexDirection:'row',alignItems:'center',paddingBottom:10,paddingTop:5}}>
        <Text style={{color:FlyColors.white,fontSize:FlyDimensions.fontSizeHuge,fontWeight:'500',fontFamily:'din alternate'}}>{baseInterest}</Text>
        <Text style={{color:FlyColors.white,fontFamily:'din alternate',fontSize:FlyDimensions.fontSizeXl}}>{extraInterest}</Text>
      </View>
    );
  }

  _onEndReached(){
    if (this.state.selectedIndex == 1) {
      if (this.state.firstShow == true || this.state.lastShow == true || this.state.isData == true) {
        return;
      }else{
        this.setState({
          isRefreshing:true
        });
        this.offset ++ ;
        this._reloaderData(this.offset);
      }
    }
  }

  // 理财期限
  _showPeriod(){
    let basicInfos = this.state.basicInfos,periodTxt,periodTime,period;
    if (basicInfos) {
      period = basicInfos.period;
      if(basicInfos.periodType=='month'){
        periodTxt = '个月';
      }else if(basicInfos.periodType=='year'){
        periodTxt = '年';
      }else{
        periodTxt = '天';
      }

      return(
        <View style={styles.periodStyle}>
          <Text style={{color:'#FFDECB',paddingBottom:5,fontSize:FlyDimensions.fontSizeBase}}>理财期限</Text>
          <Text style={styles.textStyle1}>{period}<Text style={{color:'white',fontSize:FlyDimensions.fontSizeBase}}>{periodTxt}</Text></Text>
        </View>
      );
    }
    return <View/>
   }


  toBuy(){
    if(this.props.isLoggedIn){
     if (this.props.userStatus&&!this.props.userStatus.isCertification) {
         this.refs.bindID.ModuleOpen()
       }else if (this.props.userStatus&&!this.props.userStatus.isTiedCard){
         this.refs.bindBank.ModuleOpen()
      }else if (this.props.userStatus&&!this.props.userStatus.isSitePass){
          let params={
         title:'设置交易密码',
         step:2
       }
      SceneUtils.gotoScene('CERTIFICATION_PROCESS_VIEW',params);
      }else{
          SceneUtils.gotoScene('FINANCING_BUYING_VIEW',{basicInfo:this.state.basicInfos,brId:this.props.brId});
      }
    }else{
         DeviceEventEmitter.emit(env.ListenerMap['LOGIN_MODAL']);
    //  SceneUtils.gotoLogin({isReload:true});
  }
}
// 底部button
  showButtonView(){
    let basicInfos = this.state.basicInfos,disabled,onPress,activeOpacity,text='加载中...';
    if(basicInfos){
      if(basicInfos.leftBAmt == 0){
        disabled = true;
        text = '已购完';
        onPress = null;
        activeOpacity = 1;
      }else{
        text=(basicInfos.canBuy) ? '立即投资': basicInfos.msg;
        disabled =  (basicInfos.canBuy) ? false : true;
        onPress = (basicInfos.canBuy) ? () => this.toBuy() : null;
        activeOpacity = 0.7;
      }
    }

    let backgroundColor = disabled ? FlyColors.baseTextColor2 : FlyColors.baseColor;
    return (
      <View style={{flex:1,position:'absolute',bottom:0,flexDirection:'row'}}>
        <TouchableOpacity onPress={() => this.refs.inputInvest.open()} style={styles.calculator}>
          <FlyImage source='./imgs/financing/calculator@2x.png' style={styles.calculator}/>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={activeOpacity} style={{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:backgroundColor}} onPress={onPress}>
          <Text style={{fontSize:FlyDimensions.fontSizeXxl,color:'white'}}>{text}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }


  _renderRow(rowData){

  
    switch (this.state.selectedIndex) {
      case 0:
        return (
          <View style={styles.pageView}>
            <FinancingIntroduce Uninfo={this.props.Uninfo} navigator={this.props.navigator} info={this.props.brId}/>
          </View>
        )
        break;
      case 1:
        return (
          <View>
            {this.renderInvestHeader()}
            {this._renderInvestItem()}
          </View>
        )
        break;
      case 2:
        return (
          <View style={styles.pageView}>
            <FinancingRepaymentPlan navigator={this.props.navigator} info={this.props.brId} />
          </View>
        )
        break;
      default:
    }
  }

    renderInvestHeader(){
      return(
        <View style={{flexDirection:'row',backgroundColor:'#f5f5f5',paddingTop:15,paddingBottom:15}}>
          <View style={styles.titleCell}>
            <Text style={styles.titleText}>投资人</Text>
          </View>
          <View style={styles.titleCell}>
            <Text style={styles.titleText}>投资金额</Text>
          </View>
          <View style={styles.titleCell}>
            <Text style={styles.titleText}>投资时间</Text>
          </View>
        </View>
      )
    }

    _renderInvestItem(){
      let investRecordArr = this.state.investRecordArr;
      if (investRecordArr && investRecordArr.length > 0) {
        return investRecordArr.map((rowData,idx)=>{
          return(
            <View key={idx} style={styles.investPerson}>
              <View style={styles.titleCell}>
                <Text style={{color:FlyColors.baseTextColor}}>{rowData.phone}</Text>
              </View>
              <View style={styles.titleCell}>
                <Text style={{color:FlyColors.baseTextColor2}}>{moneyFixed(rowData.investAmt)}</Text>
              </View>
              <View style={[styles.titleCell,{flex:1,justifyContent:'center'}]}>
                   <Text style={{color:FlyColors.baseTextColor2}}>{rowData.investTime.substring(0,10)}</Text>
                   <Text style={{color:FlyColors.baseTextColor2}}>{rowData.investTime.substring(10,19)}</Text>
               </View>
            </View>
          )
        })
      }
    }

    renderFooter(){
      // firstShow,lastShow
      let text;
      if (this.state.selectedIndex == 1) {

        if (this.state.firstShow == true || this.state.lastShow == true) {
          text = "亲，没有更多了";
        }else if (this.state.isData == true) {
          text = "暂无数据";
        }

        if (this.state.isRefreshing == true && (this.state.firstShow == false || this.state.lastShow == false || this.state.isData == false)) {
          return(
            <View style={styles.appendLoading}>
              <ActivityIndicator size='small'/>
              <Text style={{marginLeft:5,color:FlyColors.baseTextColor2}}>{'加载中...'}</Text>
            </View>
          );
        }else {
          return(
            <View style={{width:FlyDimensions.deviceDim.width,marginTop:10,alignItems:'center',marginBottom:10}}>
              <Text style={styles.noMoreText}>{text}
              </Text>
            </View>
          )
        }
      }
    }

_showCalculator(){
  return(
    <FlyModalBox position="top"  ref="inputInvest" style={styles.flyModalBox}>
      <View>
        <View style={{flexDirection:'row',paddingTop:15,paddingBottom:10,borderBottomWidth:1,borderColor:FlyColors.baseBorderColor}}>
          <FlyImage source='./imgs/financing/icon@2x.png' style={{width:20,height:20,marginLeft:15}} />
          <Text style={{flex:1,textAlign:'center',fontSize:FlyDimensions.fontSizeXl}}>收益计算器</Text>
          <TouchableOpacity onPress={() => this.refs.inputInvest.close()}>
            <FlyImage source='./imgs/financing/closeCalculator@2x.png' style={{width:15,height:15,marginRight:15}}/>
          </TouchableOpacity>
        </View>
        <View style={styles.textView}>
          <FlyImage source='./imgs/financing/money@2x.png' style={{width:20,height:20,marginLeft:15,marginRight:15,marginTop:15,}}/>
          <TextInput style={{flex:1,justifyContent:'flex-end',textAlign: 'right',fontSize:FlyDimensions.fontSizeXxl,}}
              placeholder={'请输入投资金额'}
              maxLength={12}
              autoFocus={true}
              keyboardType="numeric"
              onChangeText={(text) => this._changeMoney(text)}/>
          <Text style={{paddingLeft:10,paddingRight:15,paddingTop:15}}>元</Text>
        </View>
        <View style={{flexDirection:'row',paddingLeft:15,marginTop:20,alignItems:'center'}}>
          <Text style={{flex:1}}>预期收益(元)</Text>
          <Text style={{fontSize:FlyDimensions.fontSizeH2,justifyContent:'flex-end',marginRight:15,color:FlyColors.baseColor}}>{this.state.result}</Text>
        </View>

      </View>
    </FlyModalBox>
  );
}

// 计算利率
_changeMoney(text){
  let that = this;
  if(isNaN(text)){
    Utils.alert('请输入正确的金额');
  }else {
    let profits = that.props.dispatch(calculateProfit(this.props.brId,text));
    profits.then((data) => {
      that.setState({result:data});
    }).catch((err) => {
      Utils.alert(err.msg);
    })
  }

}

  render() {
    let leftItem = {
        type: 'back'
    };

    const BG_SIZE = {
      width: FlyDimensions.deviceDim.width,
      height: FlyDimensions.deviceDim.height * 0.35,
    };
    let  rightItem = {
      layout: 'icon',
      icon: "icon-share",
      onPress: () =>this.refs.share.open()
    };

    let shareInfo = {
      title: env.DEFAULT_SHARE_INFO.title,
      description: env.DEFAULT_SHARE_INFO.description,
      thumb: env.DEFAULT_SHARE_INFO.thumb,
      shareUrl: env.DEFAULT_SHARE_INFO.baseUrl + Utils.getUrlWithParams("/financing/product", {
        id: this.props.brId,
      })
    };
 //   alert(shareInfo.shareUrl);

    return (
      <View style={FlyStyles.container}>
          <FlyHeader title={this.props.title} borderBottom={true} rightItem={rightItem} leftItem={leftItem}/>
          <ListView stickyHeaderIndices={[1]}
                    ref={'ListView'}
                    style={{marginBottom:50,backgroundColor:FlyColors.baseTextColor3}}
                    renderSectionHeader={this.titleView}
                    removeClippedSubviews={false}
                    dataSource={this.state.dataSource}
                    renderHeader={this.renderContent}
                    renderRow={this._renderRow}
                    renderFooter={this.renderFooter}
                    onEndReached={this._onEndReached}
                    onEndReachedThreshold = {10}/>
          {this.showButtonView()}
          {this._showCalculator()}
          <CertificationBox ref="bindBank" isBank={true}/>
          <CertificationBox ref="bindID" isID={true}/>
          <CertificationBox ref="bindOCR" isOCR={true}/>

          <FlyShare ref={'share'} style={{flex:1}} {...shareInfo} />
      </View>

    )
  }
}



var styles = StyleSheet.create({
  header:{
    backgroundColor:FlyColors.baseColor,
    paddingTop:dim.width * 0.05,
    marginBottom:10,
  },
  periodStyle:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },

  textStyle1:{
    color:FlyColors.white,
    fontSize:FlyDimensions.fontSizeXxl,
    fontWeight:'600'
  },
  progressView:{
    paddingTop:4,
    marginBottom:10
  },
  progressText:{
    color:FlyColors.white,
    paddingBottom:10,
    fontSize:FlyDimensions.fontSizeBase
  },
  title: {
    justifyContent: 'center',
    alignItems:'center',
    borderBottomWidth: 1,
    borderBottomColor: FlyColors.baseBackgroundColor,
  },
  titleSelected: {
    borderBottomColor: FlyColors.baseColor,
    borderBottomWidth: 2,
  },
  textBase:{
    color:FlyColors.baseTextColor2,
    fontSize:FlyDimensions.fontSizeXl,
    marginTop:-8
  },
  textSelected:{
    color:FlyColors.baseColor,
    fontSize:FlyDimensions.fontSizeXl,
    marginTop:-8
  },
  pageView:{
    backgroundColor: FlyColors.baseTextColor3,
  },
  backMoney:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    backgroundColor:'white',
    height:50
  },
  titleCell:{
    flex:1,
    alignItems:'center'
  },
  titleText:{
    color:'#666'
  },
  noMoreText: {
    color: FlyColors.baseTextColor2,
  },
  appendLoading: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    width:FlyDimensions.deviceDim.width
  },
  flyModalBox: {
      width: FlyDimensions.deviceDim.width - 40,
      height: 180,
      borderRadius: 3,
      backgroundColor: FlyColors.baseBackgroundColor,
      marginTop: FlyDimensions.deviceDim.height * 0.2
  },
  calculator:{
    width:50,
    height:50,
  },
  textView:{
    height:50,
    marginTop:15,
    width:(dim.width-40)*0.9,
    marginLeft:(dim.width-40)*0.05,
    marginRight:(dim.width-40)*0.05,
    flexDirection:'row',
    borderColor:FlyColors.baseBorderColor,
    borderWidth:1,
    backgroundColor:'#f8f8f8'
  },
  rowWrapper:{
    flexDirection:'row',
    alignItems:'center',
    paddingBottom:5,
    paddingTop:5
  },
  itemText:{
    flex:1,
    color:FlyColors.baseTextColor,
    fontSize:FlyDimensions.fontSizeXl
  },
  timeLineOval:{
    width:8,
    height:8,
    borderRadius:4,
    backgroundColor:FlyColors.baseColor
  },
  timeLineImg:{
    width:FlyDimensions.deviceDim.width*0.9,
    height:FlyDimensions.deviceDim.width*4/690*0.9
  },
  investPerson:{
    flexDirection:'row',
    backgroundColor:FlyColors.white,
    paddingTop:10,
    justifyContent:"center",
    alignItems:'center',
    paddingBottom:10,
    borderBottomWidth:1,
    borderColor:'#f5f5f5',
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
});

function select(store) {
  return {
    isLoggedIn : store.user.isLoggedIn,
    userInfo:store.user.userInfo,
    userStatus:store.user.userStatus
  };
}

module.exports = connect(select)(FinancingDetails);
