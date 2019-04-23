'use strict'


import React,{Component} from 'react';

import {connect} from 'react-redux';

import ReactNative,{

  View,
  StyleSheet,
  InteractionManager,
  ListView
} from 'react-native';
const FlyHeader = require('FlyHeader');
const FlyRefreshListView = require('FlyRefreshListView');
const FlyContainer = require('FlyContainer');
const FlyDimensions = require('FlyDimensions');
const dim = FlyDimensions.deviceDim;
const FlyBase = require('FlyBase');
const {Text} = require('FlyText');
const FlyStyles = require('FlyStyles');
const FlyColors = require('FlyColors');
const NativeModuleUtils = require('NativeModuleUtils');
const Utils = require('Utils');
const {
    queryPushMsgData,

  } = require('../../actions');


type Props ={
   messageID:string,
   text:sting,
   createTime:string,

}

class  MessageDetailView extends React.Component{
  constructor(props) {
    super(props);

     (this:any).renderItem=this.renderItem.bind(this);

  }

    render(){

      let back = {
         type:'back'
      }

      return(
        <View style={{flex:1,backgroundColor:FlyColors.white}}>
           <FlyHeader title={'消息详情'} leftItem={back} borderBottom={true} />
           {this.renderItem()}
        </View>
      )
    }


    renderItem(){
      let detials = this.props.details;
      return(
        <View style={{backgroundColor:FlyColors.white,marginBottom:10}}>
           <View style={{marginLeft:15,marginRight:15,marginTop:15}}>
               <Text style={styles.desText}>尊敬的用户:</Text>
               <Text style={[styles.desText,{color:FlyColors.baseTextColor,lineHeight:20,marginLeft:15}]}>{Utils.htmlDecode(this.props.text)}</Text>
           </View>
           <View style={styles.bottomStyle}>
               <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start'}}>
               <Text style={styles.ttlText}>{detials}</Text>
               </View>
               <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end'}}>
               <Text style={styles.dateText}>{Utils.dateFormat(this.props.createTime, "YYYY-MM-DD HH:mm")}</Text>
               </View>

           </View>

        </View>
      );


    }




}

var styles = StyleSheet.create({
    ttlText:{
      color:FlyColors.baseBorderColor2,
      borderWidth:0.5,
      borderColor:FlyColors.baseBorderColor2,
      padding:5,
      borderRadius:2,
      fontSize:FlyDimensions.fontSizeLarge
    },
   dateText:{
     color:FlyColors.baseBorderColor2,
     fontSize:FlyDimensions.fontSizeLarge
   },
   desText:{
     marginTop:5,
     fontSize:FlyDimensions.fontSizeLarge,
     color:'rgba(60,60,60,1)'
   },
   bottomStyle:{
     flexDirection:'row',
     margin:15,
     alignItems:'center'
   },

});

function select (store){
  return{

  };
}


module.exports = connect(select)(MessageDetailView)
