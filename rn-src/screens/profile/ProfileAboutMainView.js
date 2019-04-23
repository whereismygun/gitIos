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
const {getBundleInfo} = require('fly-react-native-app-info')

type Props = {
    navigator: Navigator;
};

class ProfileAboutMainView extends Component {
    props : Props;

    constructor(props) {
      super(props);
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

  render() {
    let back ={
      type:'back'
    }

        let Version = (
      <View style={styles.container}>
          <Text style={{color:FlyColors.baseTextColor}}>{this.state.Version}</Text>
      </View>
    )

      return (
        <View style={{flex:1,backgroundColor:FlyColors.baseBackgroundColor}}>
           <FlyHeader borderBottom={true} title={'关于我们'} leftItem={back} backgroundColor={FlyColors.white} />
           <View>
           <FlyItem text={'我要加盟'} showSegment={true} onPress={()=>{SceneUtils.gotoScene('PROFILE_JOIN_VIEW')}} />
           <FlyItem text={'关于我们'} showSegment={true} onPress={()=>{SceneUtils.gotoScene('PROFILE_ABOUT_VIEW')}} />
           <FlyItem text={'常见问题'} showSegment={true} onPress={()=>{SceneUtils.gotoScene('PROFILE_QUESTION_VIEW')}}/>
           <FlyItem text={'安全保障'} showSegment={true} onPress={()=>{SceneUtils.gotoScene('PROFILE_SAFE_VIEW')}}/>
           <FlyItem text={'意见反馈'} showSegment={true} onPress={()=>{SceneUtils.gotoScene('PROFILE_ADVICE_VIEW')}}/>
           <FlyItem showSegment={true} text="当前版本：" otherView={Version} />
           </View>
           <View style={{alignItems:'center',marginTop:25}}>
               <View style={{flexDirection:'row'}}>
                 <Text style={{color:FlyColors.baseTextColor2}}>客服热线:</Text>
                 <Text style={{color:FlyColors.baseColor}}>400-158-1996</Text>
               </View>
               <View style={{flexDirection:'row',marginTop:10}}>
                 <Text style={{color:FlyColors.baseTextColor2}}>微信订阅号:</Text>
                 <Text style={{color:FlyColors.baseColor}}>通通理之家</Text>
               </View>
           </View>


        </View>
      );
    }
}

var styles = StyleSheet.create({
  
  container:{
    flex:1,
    justifyContent:'center'
  }

});

function select(store) {
    return {

    };

}

module.exports = connect(select)(ProfileAboutMainView);
