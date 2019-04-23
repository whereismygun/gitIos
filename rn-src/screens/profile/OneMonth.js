import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  PanResponder,
InteractionManager,
TouchableWithoutFeedback,
FlatList
} from 'react-native';
import Dimensions from 'Dimensions';
const dim = Dimensions.get('window');
const FlyColors = require('FlyColors');
const Utils = require('Utils');
const SceneUtils = require('SceneUtils');

 export default class OneMonth extends Component {
  constructor(props) {
    super(props);

    (this: any).showCell = this.showCell.bind(this);
    (this: any).isThisMonth = this.isThisMonth.bind(this);

    this.showToday = false;
    this.dayList = [];
    this.allCells = [];
    if(this.props.firstDay == 0){
      this.point1 = 7;
      this.point2 = 7+this.props.days;
    }else {
      this.point1 = this.props.firstDay;
      this.point2 = this.props.firstDay+this.props.days;
    }


    for(var i = 1;i<43;i++){
      if(i<this.point1){
        let day = {};
        day.isThisMonth = false;
        day.date = this.props.lastDays-this.point1+i+1;
        day.hasRepayment = false;
        this.allCells.push(day);
      }else if (i>= this.point1 && i< this.point2) {
        let day = {};
        day.isThisMonth = true;
        day.date = i-this.point1+1;
        day.hasRepayment = false;
        this.allCells.push(day);
      }else {
        let day = {};
        day.isThisMonth = false;
        day.hasRepayment = false;
        day.date = i-this.point1-this.props.days+1;
        this.allCells.push(day);
      }



    }
    if(!Utils.isEmptyArr(this.props.dayList)){
      this.dayList = this.props.dayList;
    if(!Utils.isEmptyArr(this.dayList)){
      for (var i = 0; i < this.allCells.length; i++) {
        let day = this.allCells[i];
        if(day.isThisMonth){
          this.allCells[i].hasRepayment = this.dayHasRepayment(day.date);
        }
      }

    }
  }
    this.state=({
      allCells:this.allCells,

    });
    this.isThisMonth();

  }
  componentWillReceiveProps(nextProps){
    
    if(this.props.dayList != nextProps.dayList){
      this.dayList = nextProps.dayList;
      if(!Utils.isEmptyArr(nextProps.dayList)){
        for (var i = 0; i < this.allCells.length; i++) {
          let day = this.allCells[i];
          if(day.isThisMonth){
            this.allCells[i].hasRepayment = this.dayHasRepayment(day.date);
          }
        }
        this.setState({allCells : this.allCells});
      }

    }
  }

  dayHasRepayment(date){

    for(var i = 0;i<this.dayList.length;i++){
      let daystr = this.dayList[i].substr(8,2);
      if(daystr.substr(0,1)=='0'){
        daystr = daystr.substr(1,1);
      }
      date = ''+date;

      if(date == daystr){
        return true;
      }
    }
    return false;
  }
  isThisMonth(){
    let date = new Date();
    this.year = date.getFullYear();
    this.month = date.getMonth();
    this.date = date.getDate();

    if(this.year == this.props.year && this.month+1 == this.props.month){
      this.showToday = true;

    }
  }

  showCell(items){

    let row =  items.map((item,index)=>{
    let day;
    let monthstr,datestr;
    if(this.props.month<10){
      monthstr = '0'+this.props.month;
    }else {
      monthstr = this.props.month;
    }
    if(item.date<10){
      datestr = '0'+item.date;
    }else {
      datestr = item.date;
    }

    let daystr = this.props.year+'-'+monthstr+'-'+datestr;
    if(!item.isThisMonth){
      day =  (
        <View>
        <Text style={[styles.item,{color:FlyColors.baseTextColor2}]}>
        {item.date}
        </Text>
        <View style={{height:6,width:6}}>
        </View>
        </View>
      );

    }else {

        if(item.date == this.date && this.showToday){
            if(item.hasRepayment){
            day= (
                <TouchableWithoutFeedback onPress={()=>{
                    if(!Utils.isEmpty(day)){
                      SceneUtils.gotoScene('BACK_MONEY_DETAILS',{day:daystr})
                    }else {
                      Utils.toast('网络错误！');
                    }

                    }}>

              <View style={{alignItems:'center'}}>
               <View style={[{width:30,height:30,borderRadius:15,justifyContent:'center',alignItems:'center',backgroundColor:'rgb(255,146,77)'}]}>
                <Text style={{color:FlyColors.black}}>
                   {item.date}
                 </Text>
              </View>
              <View style={{height:6,width:6,backgroundColor:'red',borderRadius:13}}>
              </View>
              </View>
              </TouchableWithoutFeedback>
            );
          }else {

            day= (
              <View style={{alignItems:'center'}}>
              <View style={[{width:30,height:30,justifyContent:'center',borderRadius:17,alignItems:'center',backgroundColor:'rgb(255,146,77)',color:FlyColors.white}]}>
                  <Text style={{color:'white'}}>
                   {item.date}
                  </Text>
              </View>
        
              <View style={{height:6,width:6}}>
              </View>
              </View>
            );
          }

        }else {

          if(item.hasRepayment){
            day =  (
              <TouchableWithoutFeedback onPress={()=>{
                  if(!Utils.isEmpty(day)){
                    SceneUtils.gotoScene('BACK_MONEY_DETAILS',{day:daystr})
                  }else {
                    Utils.toast('网络错误！');
                  }

                  }}>

              <View style={{alignItems:'center'}}>

              <Text style={[styles.item,{color:FlyColors.black}]}>
              {item.date}
              </Text>
              <View style={{height:5,width:5,backgroundColor:'red',borderRadius:10}}>
              </View>
              </View>
              </TouchableWithoutFeedback>
            );
          }else {
            day =  (
              <View >

              <Text style={[styles.item,{color:FlyColors.black}]}>
              {item.date}
              </Text>
              <View style={{height:6,width:6}}>
              </View>
              </View>
            );
          }
        }


    }
return(
  day
  );



    });
return row;
  }

  render(){
  return(
    <View  style={{width:dim.width}}>

     <View style={styles.container}>
       {this.showCell(this.state.allCells.slice(0,7))}
     </View>
     <View style={styles.container}>
       {this.showCell(this.state.allCells.slice(7,14))}
     </View>
     <View style={styles.container}>
       {this.showCell(this.state.allCells.slice(14,21))}
     </View>
     <View style={styles.container}>
       {this.showCell(this.state.allCells.slice(21,28))}
     </View>
     <View style={styles.container}>
       {this.showCell(this.state.allCells.slice(28,35))}
     </View>
     <View style={styles.container}>
       {this.showCell(this.state.allCells.slice(35,42))}
     </View>
       </View>
  )
  }
}
const styles = StyleSheet.create({
  container: {
    width:dim.width,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection:'row',
    paddingLeft:20,
    paddingRight:20,
    marginTop:2

  },
  item:{
    width:(dim.width)/10,
    height:(dim.width-40)/11,
    includeFontPadding:false,
    textAlign:'center',
    padding:6
  },

});
