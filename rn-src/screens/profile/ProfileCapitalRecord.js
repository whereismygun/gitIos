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
const {loadEnterTimeInfo,logout} = require('../../actions');
const NativeModuleUtils = require('NativeModuleUtils');
const FlyModalBox = require('FlyModalBox');
const bg = "./imgs/capitalRecord/bg.png";
const taxis = "./imgs/capitalRecord/taxis.png";
const NetworkService = require('NetworkService');
const Utils = require('Utils');
const {Text,OneLine} = require('FlyText');
const LISTVIEWREF = 'listview';
const FlyRefreshListView = require('FlyRefreshListView');
const Filters = require('Filters');
const dim = FlyDimensions.deviceDim;

type Props = {
  navigator: Navigator;
};

class ProfileCapitalRecord extends React.Component {
  props: Props;

  constructor(props) {
    super(props);
    (this: any)._reloadFetchConfig = this._reloadFetchConfig.bind(this);
    (this: any)._renderCategoryItem = this._renderCategoryItem.bind(this);
    this.state = {
      showDate:false,
      params:'all'
    }
   }


  componentWillUnmount(){

    TimerMixin.clearTimeout();
  }

  _reloadFetchConfig() {
      return {
        url: 'queryBilling',
        params:{
          filter:this.state.params
        }
      };
   }

  _renderCategoryItem(rowData){
    return(
      <View style={styles.cellContainer}>
        <View style={{flexDirection:'row'}}>
          <OneLine style={styles.title}>{rowData.memo}</OneLine>
          <Text style={styles.money}>{Filters.moneyFixed(rowData.transferAmount)}</Text>
        </View>
        <View style={{flexDirection:'row',marginTop:10}}>
          <Text style={styles.details1}>{rowData.createTime}</Text>
          <Text style={styles.details2}>{Filters.billStatus(rowData.status)}</Text>
        </View>

      </View>
    )
  }
  changeParams(showDate,type){
    let that = this;
    that.setState({
      showDate:!showDate,
      params:type
    });
    TimerMixin.setTimeout(()=>{
      let rlv = that.refs.refreshListView.getWrappedInstance();
      rlv.reloadData('header')
    },500)


  }
  render() {
    let leftItem = {
      type:"back",
        onPress:()=>{
         SceneUtils.goBack();
      }
    };
    let showDate = this.state.showDate;
    let rightItem = {
      image:taxis,
      imageWidth:20,
      onPress:() =>{
        this.setState({
          showDate:!showDate
        })
      }
    };

    let dateList = [
      {date:'本月',parms:'one_month'},
      {date:'近三个月',parms:'three_month'},
      {date:'近一年',parms:'one_year'},
      {date:'全部',parms:'all'}
    ];

    let bottomStyle = {
      borderBottomWidth:1,
      borderBottomColor:FlyColors.baseTextColor3
    }

    let dateItemView = dateList.map((item,idx)=>{
      if (idx == 3) {
        bottomStyle = null;
      }
      return(
        <TouchableOpacity key={idx} style={[styles.dateItem,bottomStyle]} onPress={()=>this.changeParams(showDate,item.parms)}>
          <Text style={{fontSize:FlyDimensions.fontSizeXl}}>{item.date}
          </Text>
        </TouchableOpacity>
      )
    });

    let dateView = (this.state.showDate == true) ? (
      <View style={styles.dateConatiner}>
        <FlyImage source={bg} style={styles.bgStyle}>
          <View style={{marginTop:dim.width * 0.06}}>
            {dateItemView}
          </View>

        </FlyImage>
      </View>
    ) : null;

    return (
      <View style={FlyStyles.container}>
        <FlyHeader title={'资金记录'} leftItem={leftItem} rightItem={rightItem} borderBottom={true} />
        <FlyRefreshListView
            ref={'refreshListView'}
            enablePullToRefresh={true}
            reloadFetchConfig={this._reloadFetchConfig}
            renderRow={this._renderCategoryItem}
            style={{backgroundColor:FlyColors.baseTextColor3}}
            />
        {dateView}
      </View>
    )
  }
}



var styles = StyleSheet.create({
  cellContainer:{
    paddingTop:10,
    paddingBottom:10,
    paddingLeft:15,
    paddingRight:15,
    borderBottomWidth:1,
    borderBottomColor:FlyColors.baseTextColor3,
    backgroundColor:FlyColors.white,
  },
  title:{
    flex:2,
    fontSize:FlyDimensions.fontSizeXl,
  },
  money:{
    flex:1,
    textAlign:'right',
    fontSize:FlyDimensions.fontSizeXxl,
    color:FlyColors.baseColor,

  },
  details1:{
    flex:2,
    color:FlyColors.baseTextColor2,
    fontSize:FlyDimensions.fontSizeLarge
  },
  details2:{
    flex:1,
    color:FlyColors.baseTextColor2,
    fontSize:FlyDimensions.fontSizeLarge,
    textAlign:'right',
  },
  dateConatiner:{
    backgroundColor:'rgba(0,0,0,0)',
    position: 'absolute',
    right:10,
    top:FlyHeader.height - 20
  },
  dateItem:{
    height:dim.width * 0.1,
    width:dim.width * 0.35,
    justifyContent:'center',
    alignItems:'center',
    marginLeft:dim.width * 0.03,
  },
  bgStyle:{
    width:dim.width * 0.4,
    height:dim.width * 0.5,
    resizeMode:'stretch'
  }
});

function select(store) {
  return {

  };
}

module.exports = connect(select)(ProfileCapitalRecord);
