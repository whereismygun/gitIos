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
const {loadEnterTimeInfo} = require('../../actions');
const NativeModuleUtils = require('NativeModuleUtils');
const FlyModalBox = require('FlyModalBox');
const close = './imgs/base/close.png';
const updateBg = "./imgs/base/updateBg.png";
const NetworkService = require('NetworkService');
const Utils = require('Utils');
const {Text} = require('FlyText');
const LISTVIEWREF = 'listview';
const FlyLabelItem = require('FlyLabelItem');
const {getListSchedule} = require('../../actions');
const Filters = require('Filters')

type Props = {
  navigator: Navigator;
};

class FinancingRepaymentPlan extends React.Component {
  props: Props;

  constructor(props) {
    super(props);
    (this: any)._showSchedule = this._showSchedule.bind(this);

    this.state = {
      repaymentSchedule:[]
    }
  }


  componentDidMount() {
    InteractionManager.runAfterInteractions(() =>{
      // 还款计划
      let repaymentPlan = this.props.dispatch(getListSchedule(this.props.info,true));
      repaymentPlan.then((data) => {
        this.setState({
          repaymentSchedule:data.items
        });
      }).catch((err) => {
      });
    });
  }

  _changeShowState(){

  }



  _showSchedule(){
    if(this.state.repaymentSchedule && this.state.repaymentSchedule.length>0){
      let scheduleItem = this.state.repaymentSchedule.map((rowData,ind) => {
        return (
          <View style={{backgroundColor:FlyColors.baseBackgroundColor}}>
            <View style={styles.planItemWrapper}>
              <View style={styles.rowWrapper}>
                <Text style={[styles.planItemBaseText,{flex:1,color:FlyColors.baseBlueColor}]}>期次:{rowData.index}</Text>
                <Text style={styles.planItemBlcText}><Text>{Filters.scheduleType(rowData.repaymentWay)}</Text></Text>
              </View>
              <View style={styles.rowWrapper}>
                <Text style={[styles.planItemBaseText,{flex:1}]}>还款本金: <Text style={styles.planItemBlcText}>{Filters.moneyFixed(rowData.amount,null,true)}</Text></Text>
                <Text style={styles.planItemBaseText}>还款利息: <Text style={styles.planItemBlcText}>{Filters.moneyFixed(rowData.interestAmount,null,true)}</Text></Text>
              </View>
              <View style={styles.rowWrapper}>
                <Text style={[styles.planItemBaseText,{flex:1}]}>还款总额: <Text style={styles.planItemBlcText}>{Filters.moneyFixed(rowData.totalAmount,null,true)}</Text></Text>
                <Text style={styles.planItemBaseText}>到期时间: <Text style={styles.planItemBlcText}>{rowData.endTime.substr(0,10)}</Text></Text>
              </View>
            </View>
          </View>
        );
      });
      return scheduleItem;
    }else{
      return FlyBase.LoadingView();
    }
    return <View />
  }

  render() {
    return (
      <View style={[FlyStyles.container,{backgroundColor:FlyColors.baseTextColor3}]}>
        <View style={{paddingBottom:30}}>
          {this._showSchedule()}
        </View>
      </View>
    )
  }
}



var styles = StyleSheet.create({
  flyItem:{
    marginLeft:15,
    borderBottomWidth:1,
    borderColor:'#f5f5f5'
  },
  planItemWrapper:{
    backgroundColor:FlyColors.white,
    marginTop:10,
    marginHorizontal:10,
    paddingHorizontal:10,
    paddingBottom:10
  },
  rowWrapper:{
    flexDirection:'row',
    alignItems:'center'
  },
  planItemBaseText:{
    color:FlyColors.baseTextColor2,
    marginTop:10,
    fontSize:FlyDimensions.fontSizeLarge
  },
  planItemBlcText:{
    color:FlyColors.baseTextColor2,
    marginTop:10,
    fontSize:FlyDimensions.fontSizeLarge
  },
});

function select(store) {
  return {

  };
}

module.exports = connect(select)(FinancingRepaymentPlan);
