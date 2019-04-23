
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
  Text
} from 'react-native';

const {connect} = require('react-redux');
const FlyDimensions = require('FlyDimensions');
const FlyHeader = require('FlyHeader');
const dim = FlyDimensions.deviceDim;
const FlyColors = require('FlyColors');
const FlyProgress = require('FlyProgress');
class AnimatedTest extends React.Component {
  state: { //可以不写，我这里写是为了去除flow警告
    fadeAnim: Object,
  };
  constructor(props) {
     super(props);
   }

  render() {
    let leftItem = {
      type:'back'
    };

    let width = dim.width * 0.8;
    let toValue = width;
    let toValue1 = width * 0.5;
    return (
      <View style={styles.container}>
         <FlyHeader title={'动画'} leftItem={leftItem}/>
         <FlyProgress toValue={toValue} duration={1000} progressWidth={width}
          circleColor={'#30CE42'} backgroundColor={FlyColors.baseTextColor3}
          frontColor={'#30CE42'}/>
          <FlyProgress toValue={toValue1} duration={1000} progressWidth={width}
           circleColor={'#30CE42'} backgroundColor={FlyColors.baseTextColor3}
           frontColor={'#30CE42'}/>
      </View>
    );
  }
}


var styles = StyleSheet.create({
  container:{
    flex:1
  }

});

function select(store) {
  return {

  };
}

module.exports = connect(select)(AnimatedTest);
