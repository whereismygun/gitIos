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
const {getBinding,findUserStatus,selectBankInfo} = require('../../actions');
const Filters = require('Filters');
const FlyBottomButton = require('FlyBottomButton');
const Utils = require('Utils');
const FlyLoading = require('FlyLoading');
const NativeModuleUtils = require('NativeModuleUtils');
const sina = './imgs/myAssets/sina.png'
const selected = './imgs/personCenter/selected.png';
const agreeH = './imgs/login/agree.png';
const agreeN = './imgs/login/combinedShape.png';


type Props = {
  navigator: Navigator;
  buildingInfo:Object;
};

class ProfileSelectBankCard extends React.Component {
  props : Props;
  constructor(props) {
    super(props);
       this.state = {
       isCertification:false,
       agree:true
    };
    }

  componentDidMount(){

     this.listener = DeviceEventEmitter.addListener(env.ListenerMap['PROFILE_SELECT_BANK'], () => {
            this.props.dispatch(getBinding());
      });

     let getBind = this.props.dispatch(getBinding());
         getBind.then((data)=>{
      if (data.items&&data.items.length==1){
         this.props.dispatch(selectBankInfo(data.items[0]))
       }  
    })
     this.props.dispatch(findUserStatus())

  }


  renderBankCell(){
  
    let BankeContent = this.props.buildingInfo.map((item,index)=>{
        let selectContent=null;

         if (item.accId === this.props.selectBankInfo.accId) {
          selectContent=(
              <View style={styles.selectView}>
                <FlyImage  source={selected} width={30}/> 
              </View>
            )
         }
         let lines
         if (item&&item.limitFlag) {

          lines = (
                <View style={{marginLeft:5,marginTop:5}}>
                   <Text style={{fontSize:FlyDimensions.fontSizeBase,marginLeft:10}}>可提现额度:<Text style={{color:FlyColors.baseColor}}>  {item.limit}</Text></Text>
                </View>
            )
         }

     return(
        <View>
         <TouchableOpacity style={[styles.cellContainer,{backgroundColor:item.sideColor}]} onPress={()=>this.selectBank(item)}>
          <FlyImage source={item.imgUrl} width={40} style={{marginLeft:10}}/>
           <View>
             <Text style={styles.bankName}>{item.bankName}</Text>
             <Text style={styles.bankCard}>储蓄卡</Text>
             <Text style={styles.bankAccNo}>{item.accNo}
            </Text>
          </View>
             {selectContent}
          </TouchableOpacity>
          {lines}
        </View> 
       
      )

    })
       return BankeContent
  }

  selectBank(buildingInfo){
   this.props.dispatch(selectBankInfo(buildingInfo))
   SceneUtils.goBack()
  }

  render() {

    let leftItem = {
      type: "back",
    };
    let buildingInfo = this.props.buildingInfo;
    let params = {
      isselect:true
    } ;
         
      let agreeImg = this.state.agree == true ? agreeH : agreeN;
      let allow ;
        if (this.state.agree) {
             allow = (
           <TouchableOpacity onPress={()=>SceneUtils.gotoScene('PROFILE_ADD_BANK_CARD',params)}>
            <View style={styles.addBtnWrapper}>
              <Text style={styles.text}>+ 添加银行卡</Text>
            </View>
          </TouchableOpacity>

              )
          }else{
            allow = (
           <TouchableOpacity onPress={()=>{Utils.alert('同意第三方存管协议,才允许添加银行卡')}}>
            <View style={styles.addBtnWrapper}>
              <Text style={styles.text}>+ 添加银行卡</Text>
            </View>
          </TouchableOpacity>
              )
          }

    return(
      <View style={FlyStyles.container}>
        <FlyHeader
          title="选择银行卡"
          borderBottom={true}
          leftItem={leftItem}
          leftItemStyle={styles.rightItemStyle}>
        </FlyHeader>
        <View style={{backgroundColor:FlyColors.baseTextColor3,flex:1}}>
         {this.renderBankCell()}
           <View>   
               {allow}
           <View style={[styles.agree]} >
             <TouchableOpacity onPress={()=>{this.setState({agree:!this.state.agree})}} activeOpacity={1}>
                <FlyImage source={agreeImg} width={15}/>
             </TouchableOpacity>
             <TouchableOpacity style={{flexDirection:'row'}} onPress={()=>{SceneUtils.gotoScene('PERSONAL_MT_AGREEMENT')}}>
                   <Text style={styles.agreeTitle}>同意</Text>
                   <Text style={[styles.agreeTitle,{color:FlyColors.baseColor}]}>《三方存管协议》</Text>
             </TouchableOpacity>
            </View>
          </View>

          </View>
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
   unBoundStyle:{
    borderTopRightRadius:0,
    borderBottomRightRadius:0,
    marginRight:0,
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
  unBoundContent:{
   justifyContent:'center',
   alignItems:'center',
   width:dim.white,
   height:50,
   backgroundColor:FlyColors.baseBackgroundColor3
  },
  selectView:{
    position:"absolute",
    top:0,
    bottom:0,
    left:0,
    right:0,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'rgba(50,50,50,0.6)',
    borderRadius:10
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
    userStatus:store.user.userStatus,
    selectBankInfo:store.user.selectBankInfo,
  };
}

module.exports = connect(select)(ProfileSelectBankCard);
