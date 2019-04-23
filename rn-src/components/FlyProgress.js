
/**
 * @providesModule FlyProgress
 * 自定义条目
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
  ScrollView,
  TextInput,
  Text,
  NativeAppEventEmitter
} from 'react-native';

const {connect} = require('react-redux');
const FlyDimensions = require('FlyDimensions');
const FlyHeader = require('FlyHeader');
const dim = FlyDimensions.deviceDim;
const FlyColors = require('FlyColors');

export type Props = {
    toValue: number;
    duration: number;
    progressWidth:number;
    circleColor: string;
    backgroundColor:string;
    frontColor:string;
    style?:any;
    isCircle?:boolean;
    followTag:string;
    isFollowTag?:boolean;
};

class FlyProgress extends React.Component {
  state: { //可以不写，我这里写是为了去除flow警告
    fadeAnim: Object,
  };
  constructor(props) {
     super(props);
     this.state = {
         fadeAnim: new Animated.Value(0), //设置初始值
     };
   }
   componentDidMount() {

      this.state.fadeAnim.addListener((state) => {

        let percentage = parseInt((state.value/dim.width)*100);
        this.setState({
          progress_number:percentage
        })
        });

     Animated.timing(
       this.state.fadeAnim,//初始值
       {
         toValue: this.props.toValue,
         duration: this.props.duration,
       }//结束值
     ).start();//开始

   }

   componentWillReceiveProps(nextProps){
     if (this.props.toValue != nextProps.toValue) {
       Animated.timing(
         this.state.fadeAnim,//初始值
         {
           toValue: nextProps.toValue,
           duration: this.props.duration,
         }//结束值
       ).start();//开始
     }
   }


  render() {
    let isCircle = this.props.isCircle || false;
    let circleView;
    if (isCircle == false) {
      if (this.props.toValue != this.props.progressWidth || isCircle == false) {
        circleView = (
          <Animated.View style={[styles.circleStyle,{borderColor:this.props.circleColor,transform:[{translateX:this.state.fadeAnim}]}]}>
          </Animated.View>
        )
      }
    }
         let isFollowView;
      if (this.props.isFollowTag == true) {

         let left = this.state.progress_number>90 ? -30 : 2;
         isFollowView=(
          <Animated.View style={[{borderColor:this.props.circleColor,transform:[{translateX:this.state.fadeAnim}]}]}>
             <Text style={{fontSize:FlyDimensions.fontSizeBase,position:'absolute',top:-17,left:left,color:FlyColors.baseColor}}>{this.state.progress_number}%</Text>
          </Animated.View>
        )
     }
    return (
      <View style={[styles.flex,this.props.style]}>
        <View style={[styles.container,{width:this.props.progressWidth}]}>   
          <View style={[{backgroundColor:this.props.frontColor},styles.frontColor]}>
              <Animated.View style={{backgroundColor:this.props.backgroundColor,height:2,transform:[{translateX:this.state.fadeAnim}]}}>
              </Animated.View>
          </View>
          {circleView}
          {isFollowView}
        </View>
      </View>
    );
  }
}


var styles = StyleSheet.create({
  flex:{
    flex:1
  },
  container:{
    marginRight:15,
    marginLeft:15,
    borderRadius:3,
    justifyContent:'center',
  },
  frontColor:{
    height:2,
    borderRadius:5,
    justifyContent:'center',
    overflow:'hidden'
  },
  circleStyle:{
    backgroundColor:'white',
    position:'absolute',
    borderWidth:3,
    width:10,
    borderRadius:5,
    height:10,
    marginLeft:-5,
  }

});

function select(store) {
  return {
  };
}

module.exports = connect(select)(FlyProgress);
