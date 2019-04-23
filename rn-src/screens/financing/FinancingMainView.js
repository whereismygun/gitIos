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
  ProgressViewIOS
} from 'react-native';

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
const {loadEnterTimeInfo} = require('../../actions');
const NativeModuleUtils = require('NativeModuleUtils');
const FlyModalBox = require('FlyModalBox');
const close = './imgs/base/close.png';
const updateBg = "./imgs/base/updateBg.png";
const NetworkService = require('NetworkService');
const Utils = require('Utils');
const {Text} = require('FlyText');
const LISTVIEWREF = 'listview';
const FlyRefreshListView = require('FlyRefreshListView');
const FlyIconfonts = require('FlyIconfonts');
const ScrollView = require('ScrollView');
const FlyButton = require('FlyButton');
const dim = FlyDimensions.deviceDim;
const {moneyFixed,
       percentage,
       financeStatus,
       timeUnitStatus} = require('Filters');
const {borrowUnderlyNewList,cheackUserIsnew,
} = require('../../actions');
const FlyProgress = require('FlyProgress');
const Rectangle = './imgs/financing/Rectangle.png';
const SCROLLVIEWREF = 'scrollview'


type Props = {
  navigator: Navigator;
};

const iconImg = [
  "./imgs/supermarket/group.png",
  "./imgs/supermarket/weal.png",
  "./imgs/supermarket/short.png",
  "./imgs/supermarket/centre.png",
  "./imgs/supermarket/long.png",
];

class FinancingMainView extends React.Component {
  props: Props;

  constructor(props) {
    super(props);
    (this:any)._loadFinancialItem  = this._loadFinancialItem.bind(this);
    (this:any)._showInterest = this._showInterest.bind(this);
    (this:any)._showProgressBar = this._showProgressBar.bind(this);
    (this:any)._onRefresh=this._onRefresh.bind(this);

    this.state = {
      isNew:true,
    }
  }

  reloadData(){
    if (this.props.isLoggedIn) {
    let promise = this.props.dispatch(cheackUserIsnew());
        promise.then((data) => {
          this.setState({
              isNew:data
          });
        });
    }else{
      this.setState({
          isNew:true
      })
    }
     this.props.dispatch(borrowUnderlyNewList());
    }

    componentDidUpdate(){
       let node = this.refs[SCROLLVIEWREF];
       DXRefreshControl.configureCustom(node,{
         headerViewClass:'UIRefreshControl',
       },this._onRefresh);
    }

    _onRefresh(ignore){
      const node = this.refs[SCROLLVIEWREF];
      if (!ignore) {
        TimerMixin.setTimeout(()=>{
          this.reloadData();
          DXRefreshControl.endRefreshing(node)
        }, 2000);
       }
    }

  

  componentDidMount() {
    let that = this;
      this.reloadData();
      InteractionManager.runAfterInteractions(() =>{
      that.reloadFinaning = DeviceEventEmitter.addListener(env.ListenerMap['RELOAD_GET_FINANCING'], () => that.reloadData());
      });

  }


  componentWillUnmount(){
    if (this.reloadFinaning) {
      this.reloadFinaning.remove();
    }
  }




// 年化利率
  _showInterest(trueInterest,trueExtraRate,idx){
    return (
      <View key={idx} style={{flexDirection:'row'}}>
        <Text style={styles.trueInterest}>{trueInterest}</Text>
        <Text style={styles.trueExtraRate}>{trueExtraRate}</Text>
      </View>)
  }

// 进度条
_showProgressBar(item,idx){
  let percent = (item.totalAmt - item.leftBAmt)/item.totalAmt;

  let width = dim.width;
  let toValue = width * percent;
  return(
    <View style={{flex:5}} key={idx}>
        <FlyProgress followTag={(percent*100).toFixed(2)+"%"} 
         toValue={toValue} 
         isFollowTag={true}
         isCircle={true} 
         duration={1000} 
         progressWidth={width}
         backgroundColor={'#FFEADE'}
         frontColor={'#FF975A'} 
         style={{marginTop:20,marginLeft:-dim.width * 0.08}}/>
    </View>
  );
}

isAgent(){
  if(this.props.isLoggedIn && this.props.userInfo){
    return this.props.userInfo.agent;
  }else{
    return false;
  }
}

  _loadFinancialItem() {
    let itemList= [],newBorrow = [],borrowUnderlyNewList = this.props.borrowUnderlyNewList;
        
     if (this.state.isNew) {
       newBorrow = borrowUnderlyNewList;
     }else{
      for(var i=0;i<borrowUnderlyNewList.length;i++){
      if(i != 0){
      newBorrow.push(borrowUnderlyNewList[i]);
     }
      }
     }


    if(!Utils.isEmptyArr(newBorrow)){

      let loanCategories = newBorrow.map((data,index) => {
        let loanItem;
        if(!Utils.isEmptyArr(data.borrowUnderlyDTOList)){
          loanItem = data.borrowUnderlyDTOList.map((item,idx) => {
            let periodTxt = item.period + timeUnitStatus(item.periodType);
            let trueInterest,trueExtraRate;
            if(!this.isAgent()){
              trueInterest = percentage(item.interest);
              trueExtraRate = (item.normalExtraRate)?` +${percentage(item.normalExtraRate)}`:null;
            }else if(this.isAgent()&&item.agentInterest){
              trueInterest = percentage(item.agentInterest);
              trueExtraRate = (item.personalExtraRate)?` +${percentage(item.personalExtraRate)}`:null;
            }else if(this.isAgent()&&!item.agentInterest){
              trueInterest = percentage(item.interest);
              trueExtraRate = (item.personalExtraRate)?` +${percentage(item.personalExtraRate)}`:null;
            }
            let label;
            if(!Utils.isEmpty(item.flag)){
              let flag,content;
              if(item.flag && item.flag.indexOf(';') > 0){
                flag = item.flag.substring(0,item.flag.indexOf(';'));
              }
              if(flag == 'hot' || flag == 'new_p' || flag == 'earn_double'){
                content = financeStatus(flag);
              }else{
                content = flag;
              }
              label = (
                   <FlyImage key={idx}  style={styles.label} source={Rectangle} height={22}>
                      <Text style={styles.activeText}>{content}</Text>
                   </FlyImage>
                  );
            }
            let Style = label ? {left:69} :  {left:0}
        
            return (
                 <TouchableOpacity key={"item"+idx} style={styles.financialItem} onPress={() => SceneUtils.gotoScene('FINANCING_DETAILS',{brId:item.id,title:item.loanTitle})}>
                  <View style={{flexDirection:'row',alignItems:'center'}}>
                        <View style={[Style,styles.topickTxt]}>
                        <Text style={[styles.loanTitle]}>{item.loanTitle}</Text>
                     </View> 
                    {label}
                  </View>
                  <View style={{}}>
                   <View style={[styles.itemLeft]}>
                         <View style={{flex:2,marginLeft:30,flexDirection:'row',alignItems:'center'}}>
                           <View>
                           {this._showInterest(trueInterest,trueExtraRate,idx)}
                           <Text style={[styles.annualYield,{flex:1}]}>预期年化利率</Text>
                           </View>
                         </View>
                         <View style={[{marginLeft:80,marginTop:8,flex:3}]}>
                          <View style={{flexDirection:'row',alignItems:'center'}}>
                            <Text style={{color:'rgba(195,195,195,1)',marginRight:8}}>理财期限</Text>
                            <Text>{periodTxt}</Text>
                         </View>
                            {(item.leftBAmt == 0) ? (
                              <Text style={[styles.annualYield,{flex:1,color:FlyColors.baseColor}]}>已售罄</Text>
                            ) : (
                             <View style={{flexDirection:'row',marginTop:10,alignItems:'center'}}>
                                <Text style={{color:'rgba(195,195,195,1)',marginRight:5}}>剩余金额</Text>
                                <Text> {(item.leftBAmt)/10000}万元</Text>
                             </View>
                             )}
                         </View>
                    </View>
                  </View> 
                 {this._showProgressBar(item,idx)}
                 <View style={{marginLeft:-20,width:dim.width*1.2,height:3,backgroundColor:FlyColors.baseBackgroundColor}}/>
                </TouchableOpacity>

              );
          });
        }
        if (!Utils.isEmptyArr(data.borrowUnderlyDTOList)) {
          return (
            <View key={"_k"+index} style={{backgroundColor:'white',marginBottom:3}}>
              <View style={styles.category}>
                 <Text style={styles.dateTxt}>{data.borrowType}</Text>
              </View>
              {loanItem}
            </View>
          )
        }
        return <View key={'_key'+index} />;
    });
      return loanCategories;
    }else{
      return FlyBase.LoadingView();
    }
    return <View />;
}


  render() {
    return (
      <View style={FlyStyles.container}>
        <FlyHeader title={'理财产品'} borderBottom={true} />
        <ScrollView ref={SCROLLVIEWREF} style={{backgroundColor:FlyColors.baseBackgroundColor,marginBottom:50}} automaticallyAdjustContentInsets={false}>
          {this._loadFinancialItem()}
          <View style={styles.btnWrapper}>
            <FlyButton text="查看更多往期理财" textColor={'#cccccc'} disabled={false} type='ttl' style={styles.button} onPress={() => SceneUtils.gotoScene('FINANCING_PAST_VIEW')} />
          </View>
        </ScrollView>

      </View>
    );
  }

}


var styles = StyleSheet.create({
  category:{
    flexDirection:'row',
    marginLeft:15,
    alignItems:'center',
    height:45,
  },
  financialItem:{
    marginLeft:15,
    paddingTop:10,
    paddingRight:10,
    backgroundColor:'white',
    borderTopWidth:1,
    borderTopColor:FlyColors.baseTextColor3
  },

  interestFlag:{
    flex:2.5,
    alignItems:'flex-end',
    overflow: 'hidden',
  },
  flagText:{
    fontSize:FlyDimensions.fontSizeBase,
    paddingTop:4,
    paddingBottom:3,
    paddingRight:5,
    paddingLeft:5,
    textAlign:'right',
    color:FlyColors.baseColor,
    borderRadius:10,
    borderWidth:1,
    borderColor:FlyColors.baseColor,

  },
  itemLeft:{
    flexDirection:'row',
    paddingTop:dim.width * 0.08,
    // paddingBottom:5,
  },
  annualYield:{
    color:'rgba(195,195,195,1)',
    fontSize:FlyDimensions.fontSizeBase,
    marginTop:5,
  },
  progressView: {
     marginTop: 20,
  },
  button:{
    width:dim.width*0.9,
    height:45,
    borderWidth:1,
    borderColor:FlyColors.baseBackgroundColor,
    borderRadius:5
  },
  periodTxt:{
    color:'#006CB1',
    fontSize:FlyDimensions.fontSizeLarge,

  },
  loanTitle:{
    fontSize:FlyDimensions.fontSizeBase,
    color:FlyColors.baseTextColor2,
    marginTop:4,
    marginBottom:4,
    marginLeft:14,
    marginRight:10,
  },
  paddingLoan:{
    paddingTop:3,
    paddingBottom:3,
    paddingLeft:2,
    paddingRight:2,
  },
  trueInterest:{
    color:FlyColors.baseColor,
    fontSize:FlyDimensions.fontSizeH4,
    fontWeight:'500',
    fontFamily:'din alternate'
  },
  trueExtraRate:{
    color:FlyColors.baseColor,
    fontFamily:'din alternate',
    fontSize:FlyDimensions.fontSizeXxl,
    textAlign:'auto',
    paddingTop:12,
  },
  totalAmt:{
    color:FlyColors.baseTextColor2,
    fontSize:FlyDimensions.fontSizeBase
  },
  btnWrapper:{
    backgroundColor:'white',
    justifyContent:'center',
    alignItems:'center',
    height:60,
  },
  activeText:{
    color:'white',
    backgroundColor:'transparent',
    fontSize:FlyDimensions.fontSizeBase,
  },
  topickTxt:{
    position:'absolute',
    top:-3,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:FlyColors.baseBackgroundColor
  },
  label:{
    position:'absolute',
    top:-3,
    justifyContent:'center',
    alignItems:'center'
  },
  dateTxt:{
    fontWeight:'600',
    fontSize:FlyDimensions.fontSizeXl
  }

});

function select(store) {
  return {
    isLoggedIn:store.user.isLoggedIn,
    userInfo:store.user.userInfo,
    borrowUnderlyNewList:store.financing.borrowUnderlyNewList
  };
}

module.exports = connect(select)(FinancingMainView);
