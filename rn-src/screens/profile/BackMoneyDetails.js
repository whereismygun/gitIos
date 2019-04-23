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
  TouchableNativeFeedback,
  InteractionManager,
  DeviceEventEmitter,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';

const {connect} = require('react-redux');
import {
getSdkVersion
} from 'fly-react-native-app-info';
const TimerMixin = require('react-timer-mixin');
var FlyIconfonts = require('FlyIconfonts');

const {repaymentDayDetail} = require('../../actions');

const FlyBase = require('FlyBase');
const FlyColors = require('FlyColors');
const FlyStyles = require('FlyStyles');
const FlyDimensions = require('FlyDimensions');
const FlyImage = require('FlyImage');
const SceneUtils = require('SceneUtils');
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
const dim = FlyDimensions.deviceDim;
const itemTop = './imgs/myAssets/itemTop.png';

class BackMoneyDetails extends React.Component {
  props: Props;

  constructor(props) {
    super(props);
    (this: any).renderItem = this.renderItem.bind(this);
    (this: any).renderCell = this.renderCell.bind(this);
    var ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2});
    this.data = [];
    this.state = {
      dataSource:ds.cloneWithRows(this.data)
    }
}

  componentDidMount(){

    if(!Utils.isEmpty(this.props.day)){
      let promise = this.props.dispatch(repaymentDayDetail(this.props.day));

      promise.then((data)=>{

        if(data && !Utils.isEmptyArr(data.items)){

          this.setState({dataSource:this.state.dataSource.cloneWithRows(data.items)});
        }
        
        
      }).catch((err)=>{
      })
    }

  }

renderItem(text1,text2){
  return(
    <View style={styles.itemWrapper}>
      <Text style={styles.leftText}>
        {text1}
      </Text>
      <Text style={styles.rightText}>
        {text2}
      </Text>
    </View>
  );
}

renderCell(item){
    let tenderTime = item.tenderTime.replace(/-/g,'.');
  return(
    <View style={styles.mainWrapper}>
      <FlyImage source={itemTop} resizeMode={'stretch'} style={styles.itemTop}>
        <Text style={styles.topText}>
          {item.title+'第'+item.numberPeriod+'期'}
        </Text>
      </FlyImage>
        {this.renderItem('投资金额',item.tenderAmount+'元')}
      <View style={styles.line}/>
        {this.renderItem('投资收益',item.tenderInterest+'元')}
      <View style={styles.line}/>
        {this.renderItem('回款本金',item.repayAmount+'元')}
      <View style={styles.line}/>
        {this.renderItem('回款收益',item.repayInterest+'元')}
      <View style={styles.line}/>
        {this.renderItem('投资周期',item.cycle)}
      <View style={styles.line}/>
        {this.renderItem('投资时间',tenderTime)}


    </View>
  )

}


render(){
  let leftItem = {
      type:'back'
  };
  return(
    <View style={[FlyStyles.container,{backgroundColor:'white'}]}>
      <FlyHeader title={'回款标的'} leftItem={leftItem} borderBottom={true} />
      <View style={{flex:1,backgroundColor:'#f5f5f5'}}>
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderCell}
        />
       </View> 
    </View>
  );
}
}
var styles = StyleSheet.create({
  mainWrapper:{
    width:dim.width-30,
    alignSelf:'center',
    backgroundColor:FlyColors.white,
    marginTop:15,
    elevation:2,
    borderRadius:5,
    marginBottom:15
  },
  itemTop:{
    width:dim.width-30,
    flexDirection:'row',
    alignItems:'center',
    height:40,
    paddingLeft:10,
    paddingRight:10

  },
  topText:{
    color:FlyColors.white,
    fontSize:FlyDimensions.fontSizeXxl,
    backgroundColor:'transparent'
  },
  itemWrapper:{
    height:50,
    width:dim.width-30,
    paddingLeft:10,
    paddingRight:10,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'
  },
  leftText:{
    fontSize:FlyDimensions.fontSizeXxl,
    color:FlyColors.baseTextColor2,
  },
  rightText:{
    fontSize:FlyDimensions.fontSizeXxl,
    color:FlyColors.baseTextColor,
  },
  line:{
    width:dim.width-30,
    height:1,
    backgroundColor:FlyColors.baseTextColor3
  }
})

function select(store) {
  return {

  };
}

module.exports = connect(select)(BackMoneyDetails);
