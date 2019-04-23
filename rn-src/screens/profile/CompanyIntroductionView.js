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
    Linking
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
const company  = './imgs/profile/aboutus.png';

// const {} = require('../../actions');

class CompanyIntroductionView extends Component {

      constructor(props) {
          super(props);
          (this : any)._toNext = this._toNext.bind(this);
      }
      _callPhone() {
          Linking.openURL('tel:4001581996')
      }
    _toNext(sceneName) {
        SceneUtils.gotoScene(sceneName);
    }
    //'./imgs/profile/aboutUs.jpg'
    render() {

    let leftItem = {
      type:'back',
    };
      return (
        <View style={{flex:1,backgroundColor:FlyColors.white}}>

          <FlyHeader foreground="dark" title={"关于我们"} leftItem={leftItem} borderBottom={true} backgroundColor={FlyColors.white}/>
             <ScrollView>
               <FlyImage source={company} width={FlyDimensions.deviceDim.width}/>
             </ScrollView>
        </View>
      )
    }
}
var styles = StyleSheet.create({
  itemBottom:{
    borderBottomWidth:1,
    borderColor:FlyColors.baseBorderColor,
  }
});
function select(store) {
    return {

    };
}
module.exports = connect(select)(CompanyIntroductionView);
