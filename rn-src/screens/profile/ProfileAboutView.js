'use strict';
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    TouchableHighlight,
    ScrollView,
    ToastAndroid,
    TouchableOpacity,
    TouchableNativeFeedback,
    TouchableWithoutFeedback,
    InteractionManager,
    Linking,
    Clipboard
} from 'react-native';
import {connect} from 'react-redux';
const FlyHeader = require('FlyHeader');
const FlyColors = require('FlyColors');
const FlyDimensions = require('FlyDimensions');
const FlyStyles = require('FlyStyles');
const FlyImage = require('FlyImage');
const UrlHelper = require('UrlHelper');
const FlyButton = require('FlyButton');
const FlyBase = require('FlyBase');
const {OneLine, Text} = require('FlyText');
const NetworkService = require('NetworkService');
const SceneUtils = require('SceneUtils');
const FlyItem = require('FlyItem');
const Utils = require('Utils');
const NativeModuleUtils = require('NativeModuleUtils');
const {getBundleInfo} = require('fly-react-native-app-info')

class ProfileAboutView extends Component {

   constructor(props) {
      super(props);
      (this : any)._toNext = this._toNext.bind(this);
      this.state= {
        Version:''
      }
    }
    componentDidMount(){

    getBundleInfo((bundleInfo)=>{
    this.setState({
      Version: bundleInfo.packageVersion
    });
    });
   }

   _callPhone() {
      Linking.openURL('tel:4001581996')
   }

  _toNext(sceneName) {
        SceneUtils.gotoScene(sceneName);
  }

  render() {
      let leftItem = {
        type:'back',
      };
    let  otherView = (
        <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => {
        requestAnimationFrame(() => {
            this._callPhone();
        })
    }}>
          <Text style={{color:FlyColors.baseColor}}>400-158-1996</Text>
       </TouchableWithoutFeedback>
       </View>
  );

    let net =  (
        <View style={styles.container}>
      <TouchableOpacity onPress={() => {
        Linking.openURL('http://www.tongtongli.com')
    }}>
        <Text style={{color:FlyColors.baseColor}}>www.tongtongli.com</Text>
     </TouchableOpacity>
     </View>
  );


    let  wb = (
        <View style={styles.container}>
      <TouchableOpacity onPress={() => {
        requestAnimationFrame(() => {
             Clipboard.setString('通通理财');
        })
    }}>
         <Text style={{color:FlyColors.baseTextColor}}>通通理财</Text>
      </TouchableOpacity>
      </View>
  );

    let  fwh = (
        <View style={styles.container}>
      <TouchableOpacity onPress={() => {
        requestAnimationFrame(() => {
             Clipboard.setString('通通理');
        })
    }}>
         <Text style={{color:FlyColors.baseTextColor}}>通通理</Text>
       </TouchableOpacity>
      </View>
    );
    let  dyh = (
        <View style={styles.container}>
      <TouchableOpacity onPress={() => {
        requestAnimationFrame(() => {
             Clipboard.setString('通通理之家');
        })
      }}>
       <Text style={{color:FlyColors.baseTextColor}}>通通理之家</Text>
    </TouchableOpacity>
    </View>
  );
    let Version = (
      <View style={styles.container}>
          <Text style={{color:FlyColors.baseTextColor}}>{this.state.Version}</Text>
      </View>
    )

      return (
        <View style={{flex:1,backgroundColor:FlyColors.white}}>

          <FlyHeader foreground="dark" title={"关于我们"} leftItem={leftItem} borderBottom={true} backgroundColor={FlyColors.white}/>
          <ScrollView style={{flex:1}}>
            <FlyItem showSegment={true} text="公司介绍" onPress={() => this._toNext("COMPANY_INTRODUCTION_VIEW")}/>
            <FlyItem showSegment={true} text="客服热线" otherView={otherView}/>
            <FlyItem showSegment={true} text="官方网址" otherView={net}/>
            <FlyItem showSegment={true} text="官方微博" otherView={wb}/>
            <FlyItem showSegment={true} text="微信服务号" otherView={fwh}/>
            <FlyItem showSegment={true} text="微信订阅号" otherView={dyh}/>
          </ScrollView>
        </View>
      )
    }
}
var styles = StyleSheet.create({
  itemBottom:{
    borderBottomWidth:1,
    borderColor:FlyColors.baseBorderColor,
  },
  container:{
    flex:1,
    justifyContent:'center'
  }
});
function select(store) {
    return {

    };
}
module.exports = connect(select)(ProfileAboutView);
