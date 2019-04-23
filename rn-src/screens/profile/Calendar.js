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
  SectionList,
} from 'react-native';

const {connect} = require('react-redux');
var FlyIconfonts = require('FlyIconfonts');
const FlyViewPagerWithTab = require('FlyViewPagerWithTab');
import OneMonth from './OneMonth.js';
import CalendarRight from './CalendarRight.js';
const TimerMixin = require('react-timer-mixin');
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
const FlyViewPager = require('FlyViewPager');
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
const left = './imgs/myAssets/left.png';
const right = './imgs/myAssets/right.png';

const VIEWABILITY_CONFIG = {
  minimumViewTime: 3000,
  viewAreaCoveragePercentThreshold: 50,
  waitForInteraction: true,
};
const {getMonthRepaymentInfo} = require('../../actions');
class Calendar extends React.Component {
  props: Props;

  constructor(props) {
    super(props);

    (this: any).onMomentumScrollEnd = this.onMomentumScrollEnd.bind(this);
    (this: any)._onScrollBeginDrag = this._onScrollBeginDrag.bind(this);
    (this: any)._renderItem = this._renderItem.bind(this);
    (this: any).getMonth = this.getMonth.bind(this);
    (this: any).renderAllMonth = this.renderAllMonth.bind(this);
    (this: any).watchMonth = this.watchMonth.bind(this);
    (this: any).getMonthInfo = this.getMonthInfo.bind(this);
    (this: any).selectCalendar = this.selectCalendar.bind(this);

    this.allDays = [];
    this.allYears = [];
    this.sections = [];
    this.limit = 10;
    this.offset =  1;
    this.loadOver = false;
    this.getMonth();
    this.initIndex = true;
    this.ds = new ListView.DataSource({rowHasChanged:(r1,r2)=> r1 !== r2});
    this.state={
      isChooseLeft:true,
      year:this.year,
      month:this.toMonth+1,
      monthSelect : this.toMonth+1,
      yearSelect : this.year,
      allDays:[],
      monthInterest:'0.00',
      monthPrincipal:'0.00',
      sections:[],
      selectedIndex:0,
      loadType:'loading',
      all:[],
    }

  }


  init(){
    for(var i = 2017 ; i < 2020 ; i++){
    for(var j = 1 ; j< 13; j++){
      let item = {};
      let d = new Date(i,j,0);
      let d2;
      if(j==1){
        d2 = new Date(i-1,12,0)
      }else {
       d2 = new Date(i,j-1,0);
      }

      item.days = d.getDate();
      item.year = i;
      item.month = j;
      d.setDate(1);
      item.firstDay = d.getDay();
      item.lastDays = d2.getDate();
      item.dayList = [];

      this.allDays.push(item);
    }
  }
  this.state.allDays = this.allDays;

  }

  componentDidMount() {

    InteractionManager.runAfterInteractions(() => {
 
     this.init();
     this.initFirst();
    });
  }
  initFirst(){
    let time = new Date();
    let y = time.getFullYear();
    let m = time.getMonth()+1;
   
    this.getMonthInfo(y,m);


  }


  getMonthInfo(y,m){
    let index = (y-2017)*12+m-1;

    if(m<10){
      m = "0"+m;
    }
     let month = y+'-'+m;

      let promise = this.props.dispatch(getMonthRepaymentInfo(month));
      promise.then(
        (data)=>{
          if(!Utils.isEmpty(data) && !Utils.isEmptyArr(data.dayList)){
            this.allDays[index].dayList = data.dayList;
            this.setState({
              all:this.allDays,
              monthInterest : data.monthInterest,
              monthPrincipal : data.monthPrincipal,
              loadType:'loaded'
            })    
          
          }else {
            this.allDays[index].dayList = data.dayList;
            this.setState({
              all:this.allDays,
              loadType:'loaded',
              monthInterest : 0,
              monthPrincipal :0
            });
          }
          if(this.initIndex){
            this.initIndex = false;
            TimerMixin.setTimeout(()=>{
              this.refs.FlatList.scrollTo({x:this.index*dim.width,y:0,animated:false});
            },50);
            
          }
        }
      ).catch(
        (err)=>{
         Utils.toast(err.msg  || '网络错误');
        }
      );
  }

  _onScrollBeginDrag(event){
  }

onMomentumScrollEnd(event){
   let x = event.nativeEvent.contentOffset.x+1;
   this.index = parseInt(x/dim.width);

   this.setState({
     year:2017+parseInt(this.index/12),
     month:(this.index)%12+1,
     monthSelect:(this.index)%12+1,
     yearSelect:2017+parseInt(this.index/12),

   });
   this.getMonthInfo(2017+parseInt(this.index/12),(this.index)%12+1);


}
getMonth(){
    let date = new Date();
    this.year = date.getFullYear();
    this.toMonth = date.getMonth();
    this.date = date.getDate();
    this.month = (this.year-2017)*12 + this.toMonth;
    this.index = (this.year-2017)*12 + this.toMonth ;
  }

_renderItem(item){
  let date = new Date();
  let year = date.getFullYear();　
  let month = date.getMonth();
  this.date = date.getDate();
  return(
　
    <OneMonth dayList={item.dayList} firstDay={item.firstDay} days={item.days} lastDays={item.lastDays} year={item.year} month={item.month} />

  );
}


renderAllMonth(){
let months = allMonth.map((item,index)=>{
    let backgroundColor = (this.state.monthSelect == index+1) ? 'rgb(255,146,77)' : FlyColors.white;
    let color = (this.state.monthSelect == index+1) ? FlyColors.white : FlyColors.baseTextColor2;
  return(
    <TouchableOpacity style={[{backgroundColor:backgroundColor},styles.button]} onPress={()=>{this.setState({monthSelect:index+1})}}>
    <Text style={[{color:color,fontSize:FlyDimensions.fontSizeLarge}]}>
      {item}
    </Text>
    </TouchableOpacity>
  );
});

return months;


}

watchMonth(){
  this.index = (this.state.yearSelect-2017)*12 + this.state.monthSelect-1 ;
  this.setState({month:this.state.monthSelect,year:this.state.yearSelect});
  this.refs.FlatList.scrollTo({x:this.index*dim.width,y:0,animated:false});
  this.getMonthInfo(this.state.yearSelect,this.state.monthSelect);
  this.refs.modal.close();
}
showListHeader(){

let row =  day.map((item,index)=>{


return(
    <Text key={index} style={[styles.item,{color:FlyColors.baseTextColor}]}>
    {item}
    </Text>);
  });
return row;
}
selectCalendar(type){

  let month = this.state.monthSelect;
  let year = this.state.yearSelect;
  if(type == 'left'){
  if(!(this.state.year===2017&&this.state.month===1)){
         if(month == 1){
      month = 12;
      year = year -1;
    }else {
      month = month - 1;
    }
     } 
  }else if(!(this.state.year===2019&&this.state.month===12)){
    if(month == 12){
      month = 1;
      year = year +1;
    }else {
      month = month + 1;
    }
  }

  this.index = (year-2017)*12 + month-1 ;
  //this.setState({month:month,year:year});
  this.state.monthSelect = month;
  this.state.yearSelect = year;
  //this.refs.FlatList.scrollToIndex({viewPosition: 0, index: this.index});
  this.refs.FlatList.scrollTo({x:this.index*dim.width,y:0,animated:false});
   this.getMonthInfo(2017+parseInt(this.index/12),(this.index)%12+1);
  this.setState({
    monthSelect:month,
    yearSelect: year,
    month:month,
    year:year
  })

}


renderLeft(){

   let source = this.ds.cloneWithRows(this.state.all);
  return(
    <View style={{flex:1}}>
      <View style={styles.calendarHeader}>

      <View style={{flex:1}} >
        <TouchableWithoutFeedback onPress={()=>{ this.selectCalendar('left')}}>
          <View style={{paddingLeft:10,paddingRight:10}}>
        <FlyImage source={leftTriangle} resizeMode={'stretch'} style={{width:8,height:12,marginLeft:10}}/>
        </View>

      </TouchableWithoutFeedback>
        </View>
        <TouchableWithoutFeedback onPress={()=>{this.refs.modal.open()}}>

        <View style={styles.monthWrapper}>
          <Text style={styles.monthText}>
            {this.state.month}月
          </Text>
          <Text style={styles.yearText}>
            {this.state.year}
          </Text>
        </View>
          </TouchableWithoutFeedback>
        <View style={{flex:1}}/>
        <TouchableWithoutFeedback onPress={()=>{ this.selectCalendar('right')}}>
          <View style={{paddingLeft:10,paddingRight:10}}>
          <FlyImage source={rightTriangle} resizeMode={'stretch'} style={{width:8,height:12,marginRight:10}}/>
          </View>
        </TouchableWithoutFeedback>
      </View>
            <View style={styles.container}>
          {this.showListHeader()}
            </View>
              <ListView
                ref="FlatList"
                style={{backgroundColor:FlyColors.white}}
                pagingEnabled={true}
                showsHorizontalScrollIndicator={false}
                automaticallyAdjustContentInsets={true}
          dataSource={source}
          horizontal={true}
          initialScrollIndex={this.month}
          getItemLayout={(data, index) => ( {length: dim.width, offset: dim.width * index, index} )}
          renderRow={this._renderItem }
          onMomentumScrollEnd={this.onMomentumScrollEnd}
        />
      <View style={{flex:999}}>
        {FlyBase.SegmentView()}
        <View style={{backgroundColor:FlyColors.white}}>
          <View style={styles.footItem}>
            <Text style={styles.footLeftText}>
              本月回款本金
            </Text>
            <View style={{flex:1}}>
            </View>
            <Text style={styles.footRightText1}>
              {this.state.monthPrincipal}
            </Text>
            <Text style={styles.footRightText2}>
              元
            </Text>
          </View>
          <View style={styles.line}>
          </View>
          <View style={styles.footItem}>
            <Text style={styles.footLeftText}>
              本月回款收益
            </Text>
            <View style={{flex:1}}>
            </View>
            <Text style={styles.footRightText1}>
              {this.state.monthInterest}
            </Text>
            <Text style={styles.footRightText2}>
              元
            </Text>
          </View>
        </View>
        <View style={styles.empty}>
        </View>


</View>
    </View>
  );
}
_renderItemComponent(item){
  if(item.item.month && item.item.month.length<2){
    item.item.month ='0' + item.item.month;
  }
  if(item.item.day && item.item.day.length<2){
    item.item.day = '0' + item.item.day
  }
  let day = item.item.year+'-'+item.item.month+'-'+item.item.day;
  return(

    <TouchableWithoutFeedback onPress={()=>{
        if(!Utils.isEmpty(day)){
          SceneUtils.gotoScene('BACK_MONEY_DETAILS',{day:day})
        }else {
          Utils.toast('网络错误！');
        }

        }}>

    <View style={styles.itemWrapper}>
      <FlyImage source={itemTop} resizeMode={'stretch'} style={styles.itemTop}>
        <Text style={styles.topText}>
          {item.item.month+'月'+item.item.day+'日'}
        </Text>
        <Text style={[styles.topText,{marginLeft:10}]}>
          {item.item.date}
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
            {item.item.count+'个'}
          </Text>
          <Text style={styles.grayText}>
            回款项目
          </Text>
        </View>

        <View style={{width:1,height:30,backgroundColor:FlyColors.baseTextColor3}}>
        </View>

        <View style={styles.itemCellWrapper}>
          <Text style={styles.blackText}>
            {item.item.principal+'元'}
          </Text>
          <Text style={styles.grayText}>
            本金
          </Text>
        </View>
        <View style={{width:1,height:30,backgroundColor:FlyColors.baseTextColor3}}>
        </View>

        <View style={styles.itemCellWrapper}>
          <Text style={styles.blackText}>
            {item.item.interest+'元'}
          </Text>
          <Text style={styles.grayText}>
            收益
          </Text>
        </View>
      </View>
    </View>
    </TouchableWithoutFeedback>
  )
}
_renderSectionHeader(section){
  return(
    <Text style={styles.sectionHeader}>
      {section.section.key+'年'}
    </Text>
  )
}



modalRender(){
let leftIcon = 'icon-left-arrow-l';
let rightIcon = 'icon-right-arrow-l';

  return(
    <View >
      <View style={{flex:1}}>
      </View>
      <View style={{backgroundColor:FlyColors.white}}>

      <View style={{height:40,width:dim.width,alignItems:'center',flexDirection:'row',justifyContent:'center'}}>
        <View style={{alignItems:'center',flexDirection:'row'}}>
          <TouchableWithoutFeedback onPress={()=>{
                if(this.state.yearSelect != 2017){
                  this.setState({yearSelect:this.state.yearSelect-1})
                }
              }}>

              <FlyImage  style={{marginRight:20}} width={10} source={left}/>
          </TouchableWithoutFeedback>
          <Text style={styles.modalYear}>
            {this.state.yearSelect}
          </Text>
          <TouchableWithoutFeedback onPress={()=>{
                if(this.state.yearSelect != 2019){
                  this.setState({yearSelect:this.state.yearSelect+1})
                }
              }}>
           <FlyImage  style={{marginLeft:20}} width={10} source={right}/>   
           </TouchableWithoutFeedback>
        </View>

        <TouchableWithoutFeedback onPress={this.watchMonth}>
        <Text style={{fontSize:FlyDimensions.fontSizeXxl,position:'absolute',right:20,padding:10,color:FlyColors.baseColor}}>
          确定
        </Text>
          </TouchableWithoutFeedback>
      </View>
   <View style={{width:dim.width,height:0.5,backgroundColor:'rgb(221,221,221)'}}>
   </View>
   <View style={{flexDirection:'row',justifyContent:'center',flexWrap:'wrap',width:dim.width,paddingTop:dim.height*0.008,paddingBottom:dim.height*0.008}}>
       {this.renderAllMonth()}
   </View>
</View>
    </View>
  );
}
  render(){

    let leftItem = {
        type:'back'
    }

    return(
       <View style={FlyStyles.container}>
          <FlyHeader title={'回款日历'} borderBottom={true} leftItem={leftItem}/>
            <FlyViewPagerWithTab count={2} lazyLoad={true} selectedIndex={0} titles={['回款日历','年度统计']}>
               {this.renderLeft()}
               <CalendarRight/>
            </FlyViewPagerWithTab>
             <FlyModalBox position={'bottom'} style={{height:dim.height*0.35}} ref="modal">
              {this.modalRender()}
             </FlyModalBox>
       </View>
      )

  }

}

var HEADER_HEIGHT = FlyDimensions.statusBarHeight + FlyDimensions.headerHeight;


var styles = StyleSheet.create({
  header:{
    backgroundColor: FlyColors.white,
    height: HEADER_HEIGHT,
    paddingTop: FlyDimensions.statusBarHeight,
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  headerWrapper:{
    marginBottom:0,
    height:FlyDimensions.headerHeight,
    width:FlyDimensions.deviceDim.width,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconItemWrapper: {
      justifyContent:'center',
      width:FlyDimensions.deviceDim.width/8,
      alignItems: 'center',
      alignSelf:'center',
      position:'absolute',
      left:0
  },
  headerText:{
    fontSize:FlyDimensions.fontSizeXxl
  },
  centerWrapper:{
    flexDirection:'row',
  },
  calendarHeader:{
    alignItems:'center',
    flexDirection:'row',
    backgroundColor:'rgb(245,245,245)',
    height:40
  },
  monthWrapper:{
    flexDirection:'row',

  },
  monthText:{
    fontSize:18,
    color:FlyColors.baseTextColor
  },
  yearText:{
    fontSize:14,
    color:FlyColors.baseTextColor,
    alignSelf:'flex-end'
  },
  item:{
    width:(dim.width-40)/9,
    height:(dim.width-40)/9,
    textAlignVertical:'center',
    includeFontPadding:false,
    textAlign:'center',
    marginTop:10
  },
  container: {
    width:dim.width,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection:'row',
    paddingLeft:20,
    paddingRight:20,
    backgroundColor:FlyColors.white
  },
  footItem:{
    flexDirection:'row',
    paddingLeft:20,
    paddingRight:20,
    alignItems:'center',
    height:50
  },
  footLeftText:{
    color:FlyColors.baseTextColor,
    fontSize:FlyDimensions.fontSizeXl
  },
  footRightText1:{
    color:FlyColors.baseColor,
    fontSize:FlyDimensions.fontSizeXl,
    fontWeight:'bold',

  },
  footRightText2:{
    color:FlyColors.baseTextColor2,
    fontSize:FlyDimensions.fontSizeXl
  },
  line:{
    backgroundColor:FlyColors.baseTextColor3,
    height:1,
    width:dim.width-20,
    alignSelf:'flex-end'
  },
  empty:{
    backgroundColor:FlyColors.baseBackgroundColor,
    flex:1
  },
  rightWapper:{
    flex:1,
    backgroundColor:FlyColors.white
  },
  rightHeaderBg:{
    width:dim.width,
    height:98,
    position:'absolute',
    top:0
  },
  sectionHeader:{
    height:28,
    width:80,
    borderRadius:14,
    backgroundColor:'rgb(129,127,139)',
    color:FlyColors.white,
    marginTop:10,
    marginBottom:10,
    marginLeft:20,
    textAlign:'center',
    fontSize:FlyDimensions.fontSizeXl
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
    width:(dim.width-dim.width*0.25)/4,
    height:dim.height*0.06,
    margin:10,
    padding:10,
    borderColor:FlyColors.baseTextColor3,
    borderWidth:1,
    justifyContent:'center',
    alignItems:'center',
  },
  modalYear:{
    fontSize:FlyDimensions.fontSizeXxl,
    color:FlyColors.black,
    includeFontPadding:false,
    textAlign:'center'
  }
})
function select(store) {
  return {
    isLoggedIn:store.user.isLoggedIn,
    userInfo:store.user.userInfo,
    msgCount:store.user.msgCount,
    ewalletInfo:store.financing.ewalletInfo,
    calendar:store.profile.calendar,
  };
}

module.exports = connect(select)(Calendar);
