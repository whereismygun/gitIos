/**
 *
 *
 * @flow
 *
 */
'use strict';

import React,{Component} from 'react';
import {
    StyleSheet,
    Navigator,
    TouchableOpacity,
    View,
    InteractionManager,

} from 'react-native';

import {connect} from 'react-redux';
const {Text} = require('FlyText');
const FlyColors = require('FlyColors');
const FlyStyles = require('FlyStyles');
const FlyDimensions = require('FlyDimensions');
const FlyListContainer = require('FlyListContainer');
const FlyImage = require('FlyImage');
const FlyBase = require('FlyBase');
const FlyButton = require('FlyButton');
const FlyHeader = require('FlyHeader');
const SceneUtils = require('SceneUtils');
const FlyItem = require('FlyItem');

type Props = {
    navigator: Navigator;
};

class ProfileQuestionView extends Component {
    props : Props;

    constructor(props) {
      super(props);

    }

  render() {
    let back ={
      type:'back'
    }
      return (
        <View style={{flex:1,backgroundColor:FlyColors.baseBackgroundColor}}>
           <FlyHeader borderBottom={true} title={'常见问题'} leftItem={back} backgroundColor={FlyColors.white} />
           <View>
             <FlyItem text={'注册及认证问题'} showSegment={true} onPress={()=>{this.nextScene('注册及认证问题')}} />
             <FlyItem text={'账户问题'} showSegment={true} onPress={()=>{this.nextScene('账户问题')}} />
             <FlyItem text={'银行卡问题'} showSegment={true} onPress={()=>{this.nextScene('银行卡问题')}}/>
             <FlyItem text={'提现问题'} showSegment={true} onPress={()=>{this.nextScene('提现问题')}}/>
             <FlyItem text={'活动问题'} showSegment={true} onPress={()=>{this.nextScene('活动问题')}}/>
             <FlyItem text={'安全保障'} showSegment={true} onPress={()=>{this.nextScene('安全保障')}}/>
           </View>
        </View>
      );
    }
    nextScene(item){

         SceneUtils.gotoScene('PROFILE_QT_DESCRIBE_VIEW',{
           title:item,

         });

    }
}

var styles = StyleSheet.create({

});

function select(store) {
    return {

    };

}

module.exports = connect(select)(ProfileQuestionView);
