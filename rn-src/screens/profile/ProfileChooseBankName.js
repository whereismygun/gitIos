/**
 *
 *
 * @flow
 *
 */
'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  ListView,
  DeviceEventEmitter,
  InteractionManager
} from 'react-native';

const FlyImage = require('FlyImage');
const {connect} = require('react-redux');
const FlyColors = require('FlyColors');
const FlyDimensions = require('FlyDimensions');
const env = require('env');
const FlyHeader = require('FlyHeader');
const SceneUtils = require('SceneUtils');
const {OneLine, Text} = require('FlyText');
const FlyStyles = require('FlyStyles');
const Utils = require('Utils');
const FlyItem = require('FlyItem');
const FlyModalBox = require('FlyModalBox')
const FlyIconfonts = require('FlyIconfonts')

import { getBankList,searchBankCardByBankName} from '../../actions';
import type { SimpleProductDTOList,productInfo } from '../../reducers/recharge';
var HEADER_HEIGHT = FlyDimensions.statusBarHeight + FlyDimensions.headerHeight;

const dim = FlyDimensions.deviceDim;

type Props = {
  navigator: Navigator;
  bankCode:string;
};


class ProfileChooseBankName extends React.Component {
  props: Props;
 constructor(props) {
   super(props);
   (this: any)._renderRow = this._renderRow.bind(this);
   (this: any)._close = this._close.bind(this);
   (this: any).renderSearchRow = this.renderSearchRow.bind(this);

  //
   this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
   this.dss = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

   this.state = {
     bankList: [],
     bankCode:props.bankCode,
     searchBank:null,
     searchBankList:[],
   };
  }

  componentDidMount(){
    let that = this;
    InteractionManager.runAfterInteractions(()=>{
      let promise = this.props.dispatch(getBankList());
      promise.then((data)=>{
        if (data && data.items && data.items.length > 0) {
          that.setState({
            bankList:data.items
          });
        }
      }).catch((err)=>{
        Utils.error(err.msg || '服务器繁忙');
      });
    });
  }

  _renderRow(rowData) {
    let itemSelected = (this.state.bankCode == rowData.bankCode) ? true : false;
    let IconItem = {
      type:'img',
      source:rowData.imgUrl,
    };
     return (

      <TouchableOpacity onPress={()=>{this._close(rowData)}} style={{flexDirection:'row',alignItems:'center',borderBottomWidth:0.5,borderColor:'rgba(215,215,215,1)'}}> 
         <View style={{borderRightWidth:0.5,borderColor:'rgba(215,215,215,1)',backgroundColor:FlyColors.baseTextColor3,padding:15}}>
          <FlyImage source={rowData.imgUrl} width={40}/>
         </View>
          <Text style={{marginLeft:10,fontSize:FlyDimensions.fontSizeXl}}>{rowData.bankName}</Text>
      </TouchableOpacity>
           );
 }

 _close(rowData){
   DeviceEventEmitter.emit(env.ListenerMap['CHOOSE_BANK_NAME'],rowData);

   SceneUtils.goBack();
 }

  renderSearchBank(){

     let DataSource = this.dss.cloneWithRows(this.state.searchBankList)

    return(
     <FlyModalBox animationDuration={10} ref={'search'} position={'top'} style={{backgroundColor:'transparent',width:dim.width,height:dim.height}}>
          <View style={styles.searchContent}>
             <View style={styles.searchView}>
                 <FlyIconfonts style={{marginLeft:20,marginTop:3,marginBottom:3}} name={'icon-search-bank'} size={20}/>
                 <TextInput style={{marginLeft:15,alignSelf:'center',width:200,height:15}} placeholder="搜索开户行" maxLength={6} onChangeText={(text)=>{this.dosearch(text)}}/>
             </View>
             <TouchableOpacity style={{flex:1,marginTop:10}} onPress={()=>this.refs.search.close()}>
                <Text style={{color:FlyColors.baseColor}}>取消</Text>
             </TouchableOpacity>
          </View>
          <ListView
             dataSource={DataSource}
             renderRow={this.renderSearchRow}/>
     </FlyModalBox>
      )
  }

  renderSearchRow(rowData){
    return(
         <TouchableOpacity onPress={()=>{this._close(rowData)}}>
         <FlyItem text={rowData.bankName} showSegment={true} />
         </TouchableOpacity>
        )
  }
  dosearch(text){
   let params ={
    bankName:text
   }
   let promise = this.props.dispatch(searchBankCardByBankName(params))
   promise.then((data)=>{
      this.setState({
         searchBankList:data.items
      })
   })

   }

   render(){
     var leftItem = {
       type:'back'
     }
     let  rightItem = {
      layout: 'icon',
      icon: "icon-search-bank",
      onPress: () =>this.refs.search.open()
    };
     let dataSource = this.ds.cloneWithRows(this.state.bankList);
     return(
       <View style={FlyStyles.container}>
         <FlyHeader
           borderBottom={true}
           leftItem={leftItem}
           rightItem={rightItem}
           title='请选择银行卡'/>
         <ListView style={{height:dim.height-64}}
            dataSource={dataSource}
            removeClippedSubviews={false}
            renderRow={this._renderRow}  />
         {this.renderSearchBank()}
        </View>
     )
   }
}

var styles = StyleSheet.create({
    container:{
      height:50,
      borderBottomColor:FlyColors.baseTextColor3,
      borderBottomWidth:1,
      justifyContent:'center'
    },
    text:{
      fontSize:FlyDimensions.fontSizeXxl,
      marginLeft:30
    },
    searchView:{
     flex:8,
     borderRadius:5,
     flexDirection:'row',
     backgroundColor:FlyColors.baseBackgroundColor,
     alignItems:'center',
     marginRight:5,
     marginLeft:20,
     marginTop:10
    },
    searchContent:{
      height:HEADER_HEIGHT,
      flexDirection:'row',
      alignItems:'center',
      backgroundColor:'white'
    }

});

function select(store) {
  return {
  };
}


module.exports = connect(select)(ProfileChooseBankName);
