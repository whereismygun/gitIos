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
  ScrollView
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
const {queryReceivedScheduleInfo} = require('../../actions');
const NativeModuleUtils = require('NativeModuleUtils');
const FlyModalBox = require('FlyModalBox');
const close = './imgs/base/close.png';
const updateBg = "./imgs/base/updateBg.png";
const NetworkService = require('NetworkService');
const Utils = require('Utils');
const {Text} = require('FlyText');
const LISTVIEWREF = 'listview';
const FlyContainer = require('FlyContainer');
const Filters = require('Filters');
const dim = FlyDimensions.deviceDim;
const FlyProgress = require('../../components/FlyProgress');


type Props = {
  navigator: Navigator;
};

class RepaymentPlan extends React.Component {
  props: Props;

  constructor(props) {
    super(props);
    (this: any)._renderContent = this._renderContent.bind(this);
    this.state = {
      repaymentInfo:null
    }
  }

  componentDidMount(){
    let promise = this.props.dispatch(queryReceivedScheduleInfo(this.props.userInvestId));
    promise.then((data)=>{
      this.setState({
        repaymentInfo:data
      })
    }).catch((err)=>{

    });
  }

  _renderHeadCell(title,money,type){
    if (type == 'cell') {
      return(
        <View style={styles.headCell}>
          <Text style={styles.headTitle1}>{title}</Text>
          <Text style={styles.headMoney1}>{money}</Text>
        </View>
      )
    }else {
      return(
        <View style={styles.headCell}>
          <Text style={styles.headMoney}>{money}</Text>
          <Text style={styles.headTitle}>{title}</Text>
        </View>
      )
    }

  }

  _renderContent(){
    let repaymentInfo = this.state.repaymentInfo;
    let receiveScheduleDTOList = repaymentInfo.receiveScheduleDTOList;
    let stageView,currentAmount = '****';
    if (receiveScheduleDTOList && receiveScheduleDTOList.length > 0) {
      currentAmount = Filters.moneyFixed(receiveScheduleDTOList[0].totalAmount);
      stageView = receiveScheduleDTOList.map((item,idx)=>{
        return(
          <View style={styles.cellContainer}>
            <View style={styles.cell}>
              <Text style={styles.cellPeriod}>[第{item.currentPeriod + '/' + repaymentInfo.totalPeriod}期]</Text>
              <Text style={styles.status}>{Filters.scheduleStatus(item.status)}</Text>
            </View>
            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
              {this._renderHeadCell('回款本金',Filters.moneyFixed(item.amount),'cell')}
              <View style={styles.line}></View>
              {this._renderHeadCell('预期收益',Filters.moneyFixed(item.interest),'cell')}
              <View style={styles.line}></View>
              {this._renderHeadCell('时间',Utils.dateFormat(item.investDate,'YYYY-MM-DD'),'cell')}
            </View>
          </View>
        )
      });
    }
    let width = dim.width * 0.8;
    let toValue = (repaymentInfo.totalPeriod - repaymentInfo.remainPeriod) / repaymentInfo.totalPeriod * width;

    return(
      <ScrollView>
        <View style={styles.headContainer}>
          {this._renderHeadCell('回款本息',Filters.moneyFixed(repaymentInfo.totalAmount))}
          <View style={styles.line}/>
          {this._renderHeadCell('预期每期回款',currentAmount)}
        </View>
        <View style={{backgroundColor:'white',height:15,marginTop:20,justifyContent:'center',alignItems:'center'}}>
          <FlyProgress toValue={toValue} duration={1000} progressWidth={width}
           circleColor={'#30CE42'} backgroundColor={FlyColors.baseTextColor3}
           frontColor={'#30CE42'}/>
        </View>
        {stageView}
      </ScrollView>
    )
  }

  render() {
    let loadStatus = 'loading',title;
    if (this.state.repaymentInfo) {
      loadStatus = 'loaded';
      title = this.state.repaymentInfo.title;
    }
    let leftItem = {
      type:'back'
    };
    return (
      <View style={FlyStyles.container}>
        <FlyHeader title={title} borderBottom={true} leftItem={leftItem}/>
        <FlyContainer loadStatus={loadStatus} renderContent={this._renderContent}/>
      </View>
    )
  }
}



var styles = StyleSheet.create({
  headContainer:{
    flexDirection:'row',
    alignItems:'center',
    backgroundColor:'#FAFAFA'
  },
  headCell:{
    justifyContent:'center',
    alignItems:'center',
    flex:1,
    flexDirection:'column',
    padding:10,
  },
  headTitle:{
    color:FlyColors.baseTextColor2,
    fontSize:FlyDimensions.fontSizeLarge,
    backgroundColor:'rgba(0,0,0,0)',
    marginBottom:15,

  },
  headMoney:{
    color:FlyColors.baseColor,
    fontSize:FlyDimensions.fontSizeXxl,
    backgroundColor:'rgba(0,0,0,0)',
    marginTop:10,
    marginBottom:10
  },
  headTitle1:{
    color:FlyColors.baseTextColor2,
    fontSize:FlyDimensions.fontSizeLarge,
    backgroundColor:'rgba(0,0,0,0)',
    marginBottom:5,

  },
  headMoney1:{
    // color:FlyColors.baseColor,
    fontSize:FlyDimensions.fontSizeLarge,
    backgroundColor:'rgba(0,0,0,0)',
  },
  cellContainer:{
    marginLeft:15,
    marginRight:15,
    marginBottom:10,
    marginTop:5,
    paddingTop:10,
    backgroundColor:'#FAFAFA',
    borderWidth:1,
    borderColor:FlyColors.baseTextColor3
  },
  cell:{
    flexDirection:'row',
    borderBottomWidth:1,
    borderBottomColor:FlyColors.baseTextColor3
  },
  cellPeriod:{
    textAlign:'left',
    flex:1,
    paddingLeft:15,
    paddingRight:15,
    marginBottom:5
  },
  status:{
    textAlign:'right',
    flex:1,
    paddingLeft:15,
    paddingRight:15,
    color:'#30CE42'
  },
  line:{
    height:FlyDimensions.deviceDim.width * 0.05,
    width:1,
    borderWidth:1,
    borderColor:FlyColors.baseTextColor3
  }
});

function select(store) {
  return {

  };
}

module.exports = connect(select)(RepaymentPlan);
