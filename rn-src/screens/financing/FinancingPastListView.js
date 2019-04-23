'use strict';
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    TouchableHighlight,
    ScrollView,
    ToastAndroid,
    TouchableOpacity,
    TouchableNativeFeedback,
    TouchableWithoutFeedback,
    InteractionManager
} from 'react-native';
import {connect} from 'react-redux';
const FlyHeader = require('FlyHeader');
const FlyColors = require('FlyColors');
const FlyDimensions = require('FlyDimensions');
const FlyStyles = require('FlyStyles');
const FlyImage = require('FlyImage');
const {moneyFixed,percentage,financeStatus,timeUnitStatus} = require('Filters');
const UrlHelper = require('UrlHelper');
const FlyButton = require('FlyButton');
const FlyProgress = require('FlyProgress');
const FlyIconfonts = require('FlyIconfonts');
const FlyBase = require('FlyBase');
const {OneLine, Text} = require('FlyText');
const NetworkService = require('NetworkService');
const SceneUtils = require('SceneUtils');
const Utils = require('Utils');
const dim = FlyDimensions.deviceDim;
const FlyRefreshListView = require('FlyRefreshListView');
const Rectangle = './imgs/financing/unRectangle.png';
const {investPurchase,receivePurchase,getUserInfo} = require('../../actions');

class FinancingPastListView extends Component {

    props: Props;

    constructor(props) {
      super(props);

      (this: any)._reloadFetchConfig = this._reloadFetchConfig.bind(this);
      (this: any)._renderItem = this._renderItem.bind(this);

      this.state={
        // loading:true,
      }
    }

    componentDidMount() {
      InteractionManager.runAfterInteractions(() => {
        this.props.dispatch(getUserInfo(true));
      });
    }

    isAgent(){
      if(this.props.isLoggedIn&&this.props.userInfo){
        return this.props.userInfo.agent;
      }else{
        return false;
      }
    }

    _showInterest(trueInterest,trueExtraRate){
      return (
        <View style={{flexDirection:'row'}}>
          <Text style={styles.trueInterest}>{trueInterest}</Text>
          <Text style={styles.trueExtraRate}>{trueExtraRate}</Text>
        </View>
      )
    }
    _showProgressBar(item){
      let percent = (item.totalAmt - item.leftBAmt)/item.totalAmt;
      let width = dim.width * 0.6;
      let toValue = width * percent;
      return(
        <View style={{flex:5}}>
          <View style={{width:width,height:2,backgroundColor:FlyColors.baseColor,marginTop:25,marginLeft:-11}}></View>
        </View>
      );
    }

    _renderItem(item,idx){
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
        let content,flag;
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
            let onpress = null;
            if (item.whetherToBuy) {
                onpress = () => SceneUtils.gotoScene('FINANCING_DETAILS',{brId:item.id,title:item.loanTitle,Uninfo:true})
            }else{
              onpress= () => {Utils.alert('仅购买过此标的用户才可以查看')}
            }

      return(
         <TouchableOpacity key={"item"+idx} style={styles.financialItem} onPress={onpress}>
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
    }
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


    _reloadFetchConfig() {
      let cfg = {};
      if(this.props.type=='invest'){
        cfg.url = 'listInvestPurchase';
      }else{
        cfg.url = 'listReceivePurchase';
      }

      cfg.ignoreLogin = true;
      return cfg;
    }

    render() {

      let leftItem = {
          type: 'back'
      };

      let title = (this.props.type=='invest')?'已还款':'还款中';

        return (
            <View style={FlyStyles.container}>
                <FlyHeader leftItem={leftItem} title={title} borderBottom={true}/>
                <FlyRefreshListView
                  reloadFetchConfig = {this._reloadFetchConfig}
                  renderRow = {this._renderItem}
                  style={{backgroundColor:FlyColors.baseTextColor3}}
                  />
            </View>
        )
    }
}

var styles = StyleSheet.create({
  financialItem:{
    paddingLeft:15,
    paddingTop:10,
    paddingBottom:10,
    paddingRight:10,
    backgroundColor:'white',
    borderTopWidth:1,
    borderTopColor:FlyColors.baseTextColor3
  },

  interestFlag:{
    flex:3,
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
  },
  annualYield:{
    color:FlyColors.baseTextColor2,
    fontSize:FlyDimensions.fontSizeBase,
    marginTop:5
  },
  progressView: {
     marginTop: 20,
  },
  periodTxt:{
    color:FlyColors.baseBorderColor2,
    fontSize:FlyDimensions.fontSizeLarge,
    borderWidth:1,
    borderColor:FlyColors.baseBorderColor2,
    paddingLeft:5,
    paddingRight:3,
    paddingTop:2,
    paddingBottom:1,
    borderRadius:2
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
    paddingLeft:5,
    paddingRight:5,
  },
  trueInterest:{
    color:FlyColors.baseBorderColor2,
    fontSize:FlyDimensions.fontSizeH4,
    fontWeight:'500',
    fontFamily:'din alternate'
  },
  trueExtraRate:{
    color:FlyColors.baseBorderColor2,
    fontFamily:'din alternate',
    fontSize:FlyDimensions.fontSizeXxl,
    textAlign:'auto',
    paddingTop:12,
  },
  rowStyle:{
    flexDirection:'row',
    alignItems:'center'
  },
  smallFont:{
    color:FlyColors.baseTextColor2,
    fontSize:FlyDimensions.fontSizeBase,
    marginTop:5
  },
    label:{
    position:'absolute',
    top:-3,
    justifyContent:'center',
    alignItems:'center'
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


});

function select(store) {
    return {
      investPurchaseList:store.financing.investPurchaseList,
      receivePurchaseList:store.financing.receivePurchaseList,
      userInfo:store.user.userInfo,
      isLoggedIn:store.user.isLoggedIn,
    };
}
module.exports = connect(select)(FinancingPastListView);
