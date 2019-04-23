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
  ViewPagerAndroid
} from 'react-native';

const {connect} = require('react-redux');
const TimerMixin = require('react-timer-mixin');
var FlyIconfonts = require('FlyIconfonts');

import OneMonth from './OneMonth.js'

const FlyBase = require('FlyBase');
const FlyColors = require('FlyColors');
const FlyStyles = require('FlyStyles');
const FlyDimensions = require('FlyDimensions');
const FlyImage = require('FlyImage');
const SceneUtils = require('SceneUtils');
const env = require('env');
const FlyHeader = require('FlyHeader');
const FlyRefreshListView = require('FlyRefreshListView')
const NativeModuleUtils = require('NativeModuleUtils');
const FlyModalBox = require('FlyModalBox');
const NetworkService = require('NetworkService');
const Utils = require('Utils');
const {Text} = require('FlyText');
const LISTVIEWREF = 'listview';
const FlyContainer = require('FlyContainer');
const FlyButton = require('FlyButton');
const Filters = require('Filters');
const allMonth = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
const day = ['一','二','三','四','五','六','日'];
const dim = FlyDimensions.deviceDim;
const rightHeaderBg = './imgs/myAssets/headBg.png';
const itemTop = './imgs/myAssets/itemTop.png';
const leftTriangle = './imgs/myAssets/leftTriangle.png';
const rightTriangle = './imgs/myAssets/rightTriangle .png';
const VIEWABILITY_CONFIG = {
  minimumViewTime: 3000,
  viewAreaCoveragePercentThreshold: 50,
  waitForInteraction: true,
};

const {annualStatistics} = require('../../actions');
class CalendarRight extends React.Component {
  props: Props;

  constructor(props) {
    super(props);

    (this: any).annualStatistics = this.annualStatistics.bind(this);
    (this: any)._renderItemComponent = this._renderItemComponent.bind(this);
    (this: any).renderContain = this.renderContain.bind(this);
    (this: any).reloadFetchConfig = this.reloadFetchConfig.bind(this);



    this.loadOver = false;
    this.allYears = [];
    this.contarinYear={};
    this.sectionYear=[];
    this.limit = 10;
    this.offset =  1;
    this.state={
      sections:[],
      loadStatus:'loading'
    }
  }

    componentDidMount() {
      InteractionManager.runAfterInteractions(() => {
        this.annualStatistics();
      })
    }

    annualStatistics(){
      if(this.loadOver){
        Utils.alert('已全部加载！');
        return;
      }
      let section=[];

      let  promise = this.props.dispatch(annualStatistics(this.offset,this.limit));
      this.offset+=1;
      promise.then((data)=>{
        if(data && data.items){
          if(this.limit > data.items.length){
            this.loadOver = true;
          }
          for(var i = 0 ; i<data.items.length ; i++){
            let item = data.items[i];
            let month = item.monthDay.substr(0,2);
            let day = item.monthDay.substr(3,2);
            if(month.substr(0,1) == '0'){
              month = month.substr(1,1);
            }
            if(day.substr(0,1) == '0'){
              day = day.substr(1,1);
            }
     
         let d = {year:item.year,month:month,day:day,date:item.week,count:item.repayNum,principal:item.principal,interest:item.interest};
            section.push(d);
          }
         this.setState({sections:section,loadStatus:'loaded'});
        }else {
          this.loadOver = true;
        }

      }).catch((err)=>{
        if(sections.length == 0){
          this.setState({loadStatus:'loadErr'});
          alert(err.message);
        }else {
          alert(err.message || '网络错误！');
        }

      })
    }



    _renderItemComponent(item){
            let month = item.monthDay.substr(0,2);
            let dayy = item.monthDay.substr(3,2);
            if(month.substr(0,1) == '0'){
              month = month.substr(1,1);
            }
            if(dayy.substr(0,1) == '0'){
              dayy = dayy.substr(1,1);
            }

            if(month && month.length<2){
               month ='0' + month;
             }
           if(dayy && dayy.length<2){
              dayy = '0' + dayy
            }

           let day = item.year+'-'+month+'-'+dayy;
    
            let section;

            let contarinYear={}

              if (this.sectionYear.indexOf(item.year) !== -1) {
                   this.contarinYear[item.year]= (
                        <View/>
                        );
                   } else {
                   this.sectionYear.push(item.year)
                   this.contarinYear[item.year]=(
                     <View style={styles.sectionHeader}>
                      <Text style={{color:FlyColors.white}}>
                       {item.year+'年'}
                      </Text>
                     </View> 
                      )
                   }
       
              
      return( 
        <View>
         {this.contarinYear[item.year]}
        <TouchableWithoutFeedback onPress={()=>{
            if(!Utils.isEmpty(day)){
              SceneUtils.gotoScene('BACK_MONEY_DETAILS',{day:day})
            }else {
              Utils.alert('网络错误！');
            }
            }}>

        <View style={styles.itemWrapper}>
          <FlyImage source={itemTop} resizeMode={'stretch'} style={styles.itemTop}>
            <Text style={styles.topText}>
              {month+'月'+dayy+'日'}
            </Text>
            <Text style={[styles.topText,{marginLeft:10}]}>
              {item.week}
            </Text>
            <View style={{flex:1}}>
            </View>
            <Text style={styles.topText}>
              查看详情
            </Text>
          </FlyImage>

          <View style={styles.itemMain}>
            <View style={styles.itemCellWrapper}>
              <Text style={styles.blackText}>
                {item.repayNum+'个'}
              </Text>
              <Text style={styles.grayText}>
                回款项目
              </Text>
            </View>

            <View style={{width:1,height:30,backgroundColor:FlyColors.baseTextColor3}}>
            </View>

            <View style={styles.itemCellWrapper}>
              <Text style={styles.blackText}>
                {item.principal+'元'}
              </Text>
              <Text style={styles.grayText}>
                本金
              </Text>
            </View>
            <View style={{width:1,height:30,backgroundColor:FlyColors.baseTextColor3}}>
            </View>

            <View style={styles.itemCellWrapper}>
              <Text style={styles.blackText}>
                {item.interest+'元'}
              </Text>
              <Text style={styles.grayText}>
                收益
              </Text>
            </View>
          </View>
        </View>
        </TouchableWithoutFeedback>
        </View> 
      )
    }



    render(){
      return(
        <FlyContainer loadStatus={this.state.loadStatus} renderContent={this.renderContain} />
      )
    }

    renderContain(){

    return(
       <View style={styles.rightWapper}>
          <FlyImage source={rightHeaderBg} resizeMode={'stretch'} style={styles.rightHeaderBg}/>
          <FlyRefreshListView
             reloadFetchConfig={this.reloadFetchConfig}
             renderRow={this._renderItemComponent}
             headerPress={()=>{
              this.sectionYear=[]
            }}
           />
         
       </View>
      )

    }


    reloadFetchConfig(){

        let cfg = {
         url:'annualStatistics',
          ignoreLogin:false,
            params:{
              offset:this.offset,
              limit:this.limit
            }
       }
     
     return cfg
    }
}

function select(store) {
  return {
  };
}

var styles = StyleSheet.create({
  rightWapper:{
    flex:1,
    backgroundColor:FlyColors.baseBackgroundColor
  },
  itemWrapper:{
    width:dim.width-40,
    alignSelf:'center',
    marginBottom:20,
    borderColor:FlyColors.baseTextColor3,
    borderWidth:0.5,
    borderRadius:5,
    padding:0.5

  },
  itemTop:{
    width:dim.width-40,
    flexDirection:'row',
    alignItems:'center',
    height:50,
    paddingLeft:10,
    paddingRight:10,
    marginLeft:-0.5,
    marginTop:-0.5,
    borderTopLeftRadius:15,
    borderTopRightRadius:15,
  },
  topText:{
    color:FlyColors.white,
    fontSize:FlyDimensions.fontSizeXl,
    backgroundColor:'transparent'
  },
  itemMain:{
    flexDirection:'row',
    alignItems:'center',
    backgroundColor:FlyColors.white,
    borderBottomLeftRadius:5,
    borderBottomRightRadius:5,
    justifyContent:'space-around',
    flex:1,
    marginLeft:-0.5,
    marginBottom:-0.5

  },
  itemCellWrapper:{
  alignItems:'center',
  marginBottom:20,
  marginTop:20
},
blackText:{
  fontSize:FlyDimensions.fontSizeXxl,
  color:FlyColors.black,
  fontWeight:'bold',
},
grayText:{
  color:'rgb(211,211,211)',
  fontSize:FlyDimensions.fontSizeXl
},
button:{
    width:(dim.width-80)/4,
    height:40,
    margin:10,
    textAlignVertical:'center',
    textAlign:'center',
    borderColor:FlyColors.baseTextColor3,
    borderWidth:0.5,
    borderRadius:2,
    includeFontPadding:false
  },
  modalYear:{
    fontSize:FlyDimensions.fontSizeXxl,
    color:FlyColors.black,
    includeFontPadding:false,
    textAlign:'center'
  },
  sectionHeader:{
    height:28,
    width:80,
    backgroundColor:'rgb(129,127,139)',
    marginTop:10,
    marginBottom:10,
    justifyContent:'center',
    alignItems:'center',
    marginLeft:20,
    fontSize:FlyDimensions.fontSizeXl
  },
  rightHeaderBg:{
    width:dim.width,
    height:98,
    position:'absolute',
    top:0
  },
})

module.exports = connect(select)(CalendarRight);
