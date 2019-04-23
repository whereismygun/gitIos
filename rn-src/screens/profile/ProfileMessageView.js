'use strict'


import React,{Component} from 'react';

import {connect} from 'react-redux';

import ReactNative,{

  View,
  Text,
  StyleSheet,
  InteractionManager,
  ListView,
  TouchableOpacity,
} from 'react-native';
const TimerMixin = require('react-timer-mixin');
const FlyHeader = require('FlyHeader');
const FlyRefreshListView = require('FlyRefreshListView');
const FlyContainer = require('FlyContainer');
const FlyDimensions = require('FlyDimensions');
const dim = FlyDimensions.deviceDim;
const FlyBase = require('FlyBase');
const FlyStyles = require('FlyStyles');
const FlyColors = require('FlyColors');
const NativeModuleUtils = require('NativeModuleUtils');
const Utils = require('Utils');
const SceneUtils = require('SceneUtils');
const {
    queryPushMsgData,
    updateMessageToRead,
    getMsgCount,
    updateMessageToAllRead

  } = require('../../actions');


class  ProfileMessageView extends React.Component{
  constructor(props) {
    super(props);

     (this:any).renderItem=this.renderItem.bind(this);


  }



    render(){

      let back = {
         type:'back'
      }
      let rightItem ={
         title:'全部已读',
         style:{width:100,marginRight:50},
         onPress:()=>{this.readAllMsg()}
      }

      return(
        <View style={{flex:1,backgroundColor:FlyColors.baseBackgroundColor}}>
           <FlyHeader title={'消息'} leftItem={back} rightItem={rightItem} borderBottom={true} backgroundColor={FlyColors.white} />

          <FlyRefreshListView
            ref={'refreshData'}
            enablePullToRefresh={true}
            reloadFetchConfig={() => this._reloadFetchConfig()}
            renderRow={this.renderItem}
            removeClippedSubviews={false}
             />
        </View>
      )
    }

     readAllMsg(){
         let promise = this.props.dispatch(updateMessageToAllRead())
               promise.then((data) =>{
                this.refs.refreshData.getWrappedInstance().flush()
             })

       }


    _reloadFetchConfig(){
      let params = {
          isForm : true,
      }
     return {
       url:'queryPushMsg',
       params : params,
     }

    }

    renderItem(rowData){
      var view = (rowData.readFlag === 'un_read') ?
      (
        <Text style={{color:FlyColors.baseColor,fontSize:FlyDimensions.fontSizeXxxl,paddingRight:2}}>&bull;
        </Text>
      ) : null;
      let details = this.props.details || '通通理财';
      return(
        <TouchableOpacity style={styles.cell} onPress={()=>this.readMessage(rowData)}>
           <View style={styles.header}>
              <View style={{flexDirection:'row'}}>
                {view}
               <Text style={styles.desText}>尊敬的用户:</Text>
              </View>
               <Text style={[styles.desText,{lineHeight:20,marginLeft:15}]}>{Utils.htmlDecode(rowData.text)}</Text>
           </View>
           <View style={styles.bottomStyle}>
               <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start'}}>
               <Text style={styles.ttlText}>{details}</Text>
               </View>
               <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end'}}>
                <Text style={styles.dateText}>{Utils.dateFormat(rowData.createTime, "YYYY-MM-DD HH:mm")}</Text>
               </View>
           </View>

        </TouchableOpacity>
      );


    }
    readMessage(rowData){
      let that  = this;
      let details = this.props.details || '通通理财';
      if (rowData.readFlag === 'un_read') {
          TimerMixin.setTimeout(()=>{
            let promise = that.props.dispatch(updateMessageToRead(rowData.id));
            promise.then((data)=>{
              that.props.dispatch(getMsgCount());
              that.refs.refreshData.getWrappedInstance().flush();
            });
        },300);
      }
      SceneUtils.gotoScene('MESSAGE_DETAIL_VIEW',{messageID:rowData.id,text:rowData.text,createTime:rowData.createTime,details:details});
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
     fontSize:FlyDimensions.fontSizeLarge,
   },
   desText:{
     marginTop:5,
     fontSize:FlyDimensions.fontSizeLarge,
   },
   cell:{
     backgroundColor:FlyColors.white,
     marginBottom:10
   },
   bottomStyle:{
     flexDirection:'row',
     margin:15,
     alignItems:'center'
   },
   header:{
     marginLeft:15,
     marginRight:15,
     marginTop:15,
   }

});

function select (props,store){
  return{

  };
}


module.exports = connect(select)(ProfileMessageView)
