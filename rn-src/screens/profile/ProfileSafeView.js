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
    Text,
    ScrollView,
    WebView,
} from 'react-native';

import {connect} from 'react-redux';

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
const dim=FlyDimensions.deviceDim


const Imgs =[
   {
     source:'./imgs/profile/floor-top.png',
     height:dim.height*0.29,
   },
   {
     source:'./imgs/profile/floor01-01.png',
     height:dim.height*0.48,
   },
   {
     source:'./imgs/profile/floor01-02.png',
     height:dim.height*0.38,
   },
   {
     source:'./imgs/profile/floor01-03.png',
     height:dim.height*0.37,
   },
   {
     source:'./imgs/profile/floor02-01.png',
     height:dim.height*0.4,
   },
   {
     source:'./imgs/profile/floor02-02.png',
     height:dim.height*0.32,
   },
   {
     source:'./imgs/profile/floor02-03.png',
     height:dim.height*0.28,
   },
   {
     source:'./imgs/profile/floor03.png',
     height:dim.height*0.65,
   },
   {
     source:'./imgs/profile/floor04.png',
     height:dim.height*0.75,
   },
   {
     source:'./imgs/profile/floor05.png',
     height:dim.height*0.81,
   },
   {
     source:'./imgs/profile/floor06.png',
     height:dim.height*0.44,
   },
   {
     source:'./imgs/profile/floor07.png',
     height:dim.height,
   },



]


type Props = {
    navigator: Navigator;
};

class ProfileSafeView extends Component {
    props : Props;

    constructor(props) {
      super(props);

    }

    renderImgs(){
    let content =Imgs.map((item,idx)=>{
      return(
        <FlyImage height={item.height} source={item.source}/>
      );
    });

    return(
      <View>
      {content}
      </View>
    );

    }

  render() {
    let back ={
      type:'back'
    }
      return (
        <View style={{flex:1,backgroundColor:FlyColors.baseBackgroundColor}}>
           <FlyHeader borderBottom={true} title={'安全保障'} leftItem={back} backgroundColor={FlyColors.white} />
           <WebView scalePageToFit={true} renderError={()=>this._renderError()}  source={{uri:'https://wap.tongtongli.com/ttlcpg/safety/app/index.html',method:'GET'}}/>
        </View>
      );
    }
}

var styles = StyleSheet.create({

});

function select(store) {
    return {

    };

}

module.exports = connect(select)(ProfileSafeView);
