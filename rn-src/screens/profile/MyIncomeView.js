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
  DeviceEventEmitter
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
const {getMyIncomeInfo,getEwallet,queryUserReceivingAmount} = require('../../actions');
const NativeModuleUtils = require('NativeModuleUtils');
const FlyModalBox = require('FlyModalBox');
const close = './imgs/base/close.png';
const updateBg = "./imgs/base/updateBg.png";
const NetworkService = require('NetworkService');
const Utils = require('Utils');
const {Text} = require('FlyText');
const LISTVIEWREF = 'listview';
const dim = FlyDimensions.deviceDim;
const FlyRefreshListView = require('FlyRefreshListView');
const Filters = require('Filters');
const income = './imgs/profit/income.png';
const FlyItem = require('FlyItem');


type Props = {
  navigator: Navigator;
};

class MyIncomeView extends React.Component {
  props: Props;

  constructor(props) {
    super(props);
    (this: any)._reloadFetchConfig = this._reloadFetchConfig.bind(this);
    (this: any)._renderCategoryItem = this._renderCategoryItem.bind(this);
    (this: any)._renderHeader = this._renderHeader.bind(this);
    this.state = {
      myIncome:null
    }
  }


  componentDidMount() {
    this.props.dispatch(getEwallet(true));
    let promise = this.props.dispatch(getMyIncomeInfo());
    promise.then((data)=>{
      this.setState({
        myIncome:data
      })
    }).catch((err)=>{

    })
    let promises = this.props.dispatch(queryUserReceivingAmount());
      promises.then((data)=>{
        this.setState({
          interest:data.interest
        });
      }).catch((err)=>{

      });
  }

  _reloadFetchConfig(){
    return{
      url: 'getMyIncome',
    };
  }


  _renderCategoryItem(rowData){
    return(
      <View style={{flexDirection:'row',marginBottom:10}}>
        <View style={styles.cell}>
          <Text style={styles.cellTitle}>{rowData.title}</Text>
          <Text style={styles.cellCreateTime}>{rowData.createTime}</Text>
        </View>
        <View style={styles.cellMoney}>
          <Text style={styles.amount}>+{Filters.moneyFixed(rowData.amount)}
          </Text>
        </View>
      </View>


    )

  }

  _renderHeadCell(title,money){
    return(
      <View style={styles.headCell}>
        <Text style={styles.headTitle}>{title}</Text>
        <Text style={styles.headMoney}>{Filters.keepFixed(money)}</Text>
      </View>
    )
  }

  _renderHeader(){
    let myIncome = this.state.myIncome,lastDayIncome='**',totalIncome='**';

    if(myIncome){
      lastDayIncome = Filters.keepFixed(myIncome.lastDayIncome);
      totalIncome = Filters.keepFixed(myIncome.totalIncome);
    }

    let leftIcon = {
      type:'img',
      source:income,
      style:{
        width:22,
        height:18,
        resizeMode:'stretch'
      }
    }

    return(
      <View>
        <View  style={styles.headContainer} width={dim.width}>
          {this._renderHeadCell('预计收益(元)',this.state.interest)}
          <View style={{height:dim.width * 0.06,backgroundColor:'#dddddd',width:1}}/>
          {this._renderHeadCell('累计收益(元)',totalIncome)}
        </View>
        <FlyItem leftIcon={leftIcon} text={'收益记录'} style={{backgroundColor:FlyColors.baseTextColor3}}/>
      </View>
    )
  }

  render() {
    let leftItem = {
      type:'back'
    };
    return (
      <View style={FlyStyles.container}>
        <FlyHeader title={'我的收益'} borderBottom={true} leftItem={leftItem}/>
        <FlyRefreshListView
             ref={'refreshListView'}
             renderHeader={this._renderHeader}
             enablePullToRefresh={true}
             style={{backgroundColor:FlyColors.baseTextColor3}}
             reloadFetchConfig={()=>this._reloadFetchConfig()}
             renderRow={this._renderCategoryItem}/>
      </View>
    )
  }
}



var styles = StyleSheet.create({
  headCell:{
    justifyContent:'center',
    alignItems:'center',
    flex:1,
    flexDirection:'column',
    padding:15,
    marginLeft:15
  },
  headTitle:{
    color:'white',
    fontSize:FlyDimensions.fontSizeLarge,
    marginBottom:5,
    backgroundColor:'rgba(0,0,0,0)',
  },
  headMoney:{
    color:'white',
    fontSize:FlyDimensions.fontSizeXxl,
    backgroundColor:'rgba(0,0,0,0)'
  },
  headContainer:{
    flexDirection:'row',
    alignItems:'center',
    backgroundColor:FlyColors.baseColor
  },
  cell:{
    backgroundColor:'white',
    padding:15,
    flex:6
  },
  cellTitle:{
    fontSize:FlyDimensions.fontSizeXl,
    // fontWeight:'700',
    marginBottom:10
  },
  cellCreateTime:{
    fontSize:FlyDimensions.fontSizeLarge,
    color:FlyColors.baseTextColor2
  },
  cellMoney:{
    backgroundColor:'#FFE3D3',
    flex:2,
    justifyContent:'center',
    alignItems:'center'
  },
  amount:{
    color:FlyColors.baseColor,
    fontSize:FlyDimensions.fontSizeXxl,
  }
});

function select(store) {
  return {
    ewalletInfo:store.profile.ewalletInfo
  };
}

module.exports = connect(select)(MyIncomeView);
