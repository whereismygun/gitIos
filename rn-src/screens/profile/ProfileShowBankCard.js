/**
*
*
* @flow
*
*/
'use strict';

import React from 'react';

import ReactNative, {
  StyleSheet,
  Navigator,
  View,
  ScrollView,
  ListView,
  TouchableOpacity,
  InteractionManager,
  DeviceEventEmitter,
} from 'react-native';
import {
Hidekeyboard,
Showkeyboard,
Encryption,
}from 'fly-react-native-ps-keyboard'


import {connect} from 'react-redux';

const FlyColors = require('FlyColors');
const FlyStyles = require('FlyStyles');
const FlyDimensions = require('FlyDimensions');
const FlyHeader = require('FlyHeader');
const FlyImage = require('FlyImage');
const {Text} = require('FlyText');
const env = require('env');
const dim  = FlyDimensions.deviceDim;
const SceneUtils = require('SceneUtils');
const {getBinding} = require('../../actions');
const Filters = require('Filters');
const FlyBottomButton = require('FlyBottomButton');
const Utils = require('Utils');
const FlyLoading = require('FlyLoading');
const NativeModuleUtils = require('NativeModuleUtils');
const sina = './imgs/myAssets/sina.png'
const unselect = './imgs/personCenter/select.png';
const selected = './imgs/personCenter/selected.png';
type Props = {
  navigator: Navigator;
  buildingInfo:Object;
};
const agreeH = './imgs/login/agree.png';
const agreeN = './imgs/login/combinedShape.png';

var HEADER_HEIGHT = FlyDimensions.statusBarHeight + FlyDimensions.headerHeight;


class ProfileShowBankCard extends React.Component {
  props : Props;
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      isUnBind:false,
      selectID:null,
      selecBankInfo:null,
      agree:true
    };
    (this: any)._unBound = this._unBound.bind(this);

  }


  

  componentDidMount(){

    let that = this;
    InteractionManager.runAfterInteractions(() => {
      that.props.dispatch(getBinding());
      that.listener = DeviceEventEmitter.addListener(env.ListenerMap['PROFILE_UNBIND_BANK'], (pca) => {
        this.setState({
          isUnBind:false,
           selectID:null,
          })
      });

    });

  }

  _unBound(info){
    let buildingInfo = {
      type:'unBound',
      ...info
    }
    SceneUtils.gotoScene('PROFILE_ADD_BANK_CARD',{buildInfo:buildingInfo});
  }


  renderShowBank(){

   if (this.props.buildingInfo) {
      let showbank = this.props.buildingInfo.map((item,idx)=>{
       if (this.state.isUnBind) {
      let imgSource = (this.state.selectID == idx)?unselect:selected
          return(
          <TouchableOpacity  style={{flexDirection:'row',alignItems:'center'}} onPress={()=>{
             this.setState({
                selectID:idx,
                selecBankInfo:item
            })
          }}>
              <FlyImage style={{marginLeft:20,borderWidth:1,borderRadius:12,borderColor:FlyColors.baseTextColor2}} source={imgSource} width={25}/>
              <View style={[styles.cellContainer,styles.unBoundStyle,{width:dim.width,backgroundColor:item.sideColor}]}>
                <FlyImage source={item.imgUrl} width={40} style={{marginLeft:10}}/>
                <View>
                  <Text style={styles.bankName}>{item.bankName}</Text>
                  <Text style={styles.bankCard}>储蓄卡</Text>
                  <Text style={styles.bankAccNo}>{item.accNo}
                  </Text>
                </View>
              </View>
          </TouchableOpacity>
            )
       }else{
        let add = null
          if(this.props.buildingInfo&&this.props.buildingInfo.length==(idx+1)){
            let agreeImg = this.state.agree == true ? agreeH : agreeN;
            let allow ;
        if (this.state.agree) {
             allow = (
           <TouchableOpacity onPress={()=>SceneUtils.gotoScene('PROFILE_ADD_BANK_CARD')}>
            <View style={styles.addBtnWrapper}>
              <Text style={styles.text}>+ 添加银行卡</Text>
            </View>
          </TouchableOpacity>
              )
          }else{
            allow = (
           <TouchableOpacity  onPress={()=>{Utils.alert('同意第三方存管协议,才允许添加银行卡')}}>
            <View style={styles.addBtnWrapper}>
              <Text style={styles.text}>+ 添加银行卡</Text>
            </View>
          </TouchableOpacity>
              )
          }
             add = (
           <View>   
               {allow}
           <View style={[styles.agree]} >
             <TouchableOpacity onPress={()=>{this.setState({agree:!this.state.agree})}} activeOpacity={1}>
                <FlyImage source={agreeImg} width={15}/>
             </TouchableOpacity>
             <TouchableOpacity style={{flexDirection:"row"}} onPress={()=>{SceneUtils.gotoScene('PERSONAL_MT_AGREEMENT')}}>
                <Text style={styles.agreeTitle}>同意</Text>
                <Text style={[styles.agreeTitle,{color:FlyColors.baseColor}]}>《三方存管协议》</Text>
             </TouchableOpacity>
            </View>
          </View>
              )

         }

         let lines
         console.log(item)
         if (item&&item.limitFlag) {

          lines = (
                <View style={{flex:1,marginLeft:5,marginTop:5}}>
                   <Text style={{fontSize:FlyDimensions.fontSizeBase,marginLeft:10}}>可提现额度:<Text style={{color:FlyColors.baseColor}}> {item.limit}</Text></Text>
                </View>
            )
         }
        return(
         <View key={idx}>  
           <View style={[styles.cellContainer,{backgroundColor:item.sideColor}]}>
             <FlyImage source={item.imgUrl} width={40} style={{marginLeft:10}}/>

            <View>
               <Text style={styles.bankName}>{item.bankName}</Text>
               <Text style={styles.bankCard}>储蓄卡</Text>
               <Text style={styles.bankAccNo}>{item.accNo}</Text>
            </View>
            </View>
          {lines}

          {add}
       </View> 
        )
       }

    })
    return showbank
   }
   

  }
    componentWillUnmount() {
      if (this.listener) {
        this.listener.remove();
      }
  }


  addBankCard(){ 
   if (this.props.userStatus&&!this.props.userStatus.isSitePass){
      SceneUtils.gotoScene('PROFILE_ADD_BANK_CARD')
     }else{
     let params = {
         title:'绑定银行卡',
         step:1
      }
      SceneUtils.gotoScene('CERTIFICATION_PROCESS_VIEW',params);
     }
  }

  render() {
    
    let leftItem = {
      type: "back",
    };
    let buildingInfo = this.props.buildingInfo;
    let rightTitle = this.state.isUnBind?'取消':'解除绑定'
    let doUnbind = null;
     
     if ((this.props.buildingInfo&&this.props.buildingInfo.length>1)&&(this.state.selectID==0||this.state.selectID)){
       doUnbind = (
          <TouchableOpacity style={styles.unBindButton} onPress={()=>this._unBound(this.state.selecBankInfo)}>
             <Text style={{color:FlyColors.baseColor}}>解除绑定</Text>
          </TouchableOpacity>
        )
     }

    let rightItem = {
      title: rightTitle,
      color:FlyColors.baseColor,
      style:{alignItems:'flex-end'},
      onPress: () => {
       if (this.state.isUnBind) {
          this.setState({
          isUnBind:false,
          selectID:null,
          })

       }else{
          this.setState({
            isUnBind:true
        })
       }
        },
    };

    let content = null;

    if (this.props.buildingInfo&&this.props.buildingInfo.length==0) {
     content = (
          <TouchableOpacity onPress={()=>this.addBankCard()}>
            <View style={styles.addBtnWrapper}>
              <Text style={styles.text}>+ 添加银行卡</Text>
            </View>
          </TouchableOpacity>
      );
    }
 

    return(
      <View style={FlyStyles.container}>
        <FlyHeader
          title="银行卡"
          borderBottom={true}
          leftItem={leftItem}
          rightItem={(buildingInfo && buildingInfo.length>0) ? rightItem : null}
          leftItemStyle={styles.rightItemStyle}
          rightItemStyle={styles.rightItemStyle}>
        </FlyHeader>
        <ScrollView style={{backgroundColor:FlyColors.baseTextColor3,flex:1}}>
          {content}
          {this.renderShowBank()}
        </ScrollView>
        {doUnbind}
        <FlyLoading ref="loading" text="加载中..."/>
      </View>
    );
  }


}

var styles = StyleSheet.create({

  addBtnWrapper:{
    backgroundColor: FlyColors.baseBackgroundColor,
    height:60,
    alignItems:'center',
    justifyContent:'center',
    marginTop:10,
    marginRight:20,
    marginLeft:20,
    borderStyle:'dashed',
    borderWidth:1,
    borderColor:'#CCCCCC',
    borderRadius:5
  },
  text: {
    fontSize: FlyDimensions.fontSizeXl,

  },

  rightItemStyle: {
    width: 100,
  },

  cellContainer:{
    flexDirection:'row',
    paddingTop:10,
    paddingBottom:10,
    marginLeft:15,
    marginRight:15,
    marginTop:15,
    borderRadius:10
  },
  bankName:{
    fontSize:FlyDimensions.fontSizeXl,
    color:'white',
    marginLeft:10,
    marginBottom:5
  },
  bankCard:{
    fontSize:FlyDimensions.fontSizeLarge,
    color:'white',
    marginLeft:10,
  },
  bankAccNo:{
    fontSize:FlyDimensions.fontSizeXxl,
    color:'white',
    marginLeft:10,
    marginTop:FlyDimensions.deviceDim.width * 0.12
  },
  explain:{
    marginTop:20,
    justifyContent:'center',
    alignItems:'center',
  },
  explainTitle:{
    paddingRight:15,
    paddingLeft:15,
    color:FlyColors.baseTextColor,
    fontSize:FlyDimensions.fontSizeLarge
  },
  phone:{
    color:FlyColors.baseColor,
    fontSize:FlyDimensions.fontSizeLarge
  },
  sina:{
    flexDirection:'row',
    position:'absolute',
    bottom:30,
    alignItems:'center',
    justifyContent:'center',
    width:dim.width
  },
  sinaText:{
    fontSize:FlyDimensions.fontSizeLarge,
    color:FlyColors.baseTextColor4,
    marginLeft:10,
  },
  unBoundStyle:{
    borderBottomRightRadius:0,
    borderTopRightRadius:0,
    marginRight:0,
    marginLeft:20,
  },
  unBindButton:{
   justifyContent:'center',
   alignItems:'center',
   backgroundColor:'white',
   position:'absolute',
   top:dim.height-50,
   bottom:0,
   left:0,
   right:0
  },
    agree:{
    flexDirection:'row',
    marginTop:10,
    height:40,
    alignItems:'center',
    marginLeft:20,
    width: FlyDimensions.deviceDim.width,
  },
    agreeTitle:{
    fontSize:FlyDimensions.fontSizeBase,
    marginLeft:5
  }


});

function select(store) {
  return {
    buildingInfo: store.user.buildingInfo,
    };
}

module.exports = connect(select)(ProfileShowBankCard);
