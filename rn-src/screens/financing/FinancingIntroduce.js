/**
 *
 *
 * @flow
 *
 */
'use strict';
import React, {Component} from 'react';
import ReactNative, {
  StyleSheet,
  View,
  ListView,
  Animated,
  Navigator,
  TouchableOpacity,
  InteractionManager,
  DeviceEventEmitter
} from 'react-native';

const {connect} = require('react-redux');

const TimerMixin = require('react-timer-mixin');
const FlyBase = require('FlyBase');
const FlyColors = require('FlyColors');
const FlyStyles = require('FlyStyles');
const FlyDimensions = require('FlyDimensions');
const FlyImage = require('FlyImage');
const SceneUtils = require('SceneUtils');
const env = require('env');
const FlyHeader = require('FlyHeader');
const {loadEnterTimeInfo} = require('../../actions');
const NativeModuleUtils = require('NativeModuleUtils');
const FlyModalBox = require('FlyModalBox');
const close = './imgs/base/close.png';
const updateBg = "./imgs/base/updateBg.png";
const NetworkService = require('NetworkService');
const Utils = require('Utils');
const {Text} = require('FlyText');
const LISTVIEWREF = 'listview';
const FlyItem = require('FlyItem');
const FlyWebView = require('FlyWebView');
const {htmlDecode} = require('Filters');
const {getMaterial,getXieYi} = require('../../actions');
const q1 = './imgs/process/q1.png';
const q2 = './imgs/process/q2.png';
const q3 = './imgs/process/q3.png';
const FlyIconfonts = require('FlyIconfonts');


type Props = {
  navigator: Navigator;
  Uninfo:Boolean;
};

class FinancingIntroduce extends React.Component {
  props: Props;

  constructor(props) {
    super(props);
  (this: any).goScene = this.goScene.bind(this);
  (this: any).itemView = this.itemView.bind(this);

    this.state = {
      materialInfos:null,
      benxiProtocol:'',
      investProtocol:'',
      isShowIntroduce:false,
      isShowBenXiProtocol:false,
      isShowInvestProtocol:false,
    }
  }


  componentDidMount() {
    let that = this;
    InteractionManager.runAfterInteractions(() =>{
      // 项目简介
      let materialInfo = that.props.dispatch(getMaterial(this.props.info));
      materialInfo.then((data) => {
        that.setState({
          materialInfos:data
        });
      }).catch((err) => {
      });

    });
  }

  goScene(type,title){
    let params = {
      type:type
    };
    let ignoreLogin = false;
    if(type == 'benxi_baozhang_xieyi'){
      ignoreLogin = true;
    }
    let promise = this.props.dispatch(getXieYi(params,ignoreLogin));
    promise.then((data)=>{
      SceneUtils.gotoScene('PROFILE_WEB_VIEW', {
        title: title,
        html: data,
      });
    }).catch((err)=>{
      Utils.alert(err.msg)
    });
  }

  itemView(source,title,isTrue,data,onPress,type){
    let name = isTrue ?  'icon-down' : 'icon-up';
    let htmlType,webView;
    if (type == 'type1') {
      if (data) {
        webView = (isTrue) ? (
          <View style={{borderBottomWidth:1,borderColor:'#f5f5f5',}}>
            <FlyWebView html={data.content} webviewStyle={'div{line-height:120%;font-size:12px;}'} style={styles.flyWebView}/>
          </View>
        ) : null;
      }
    }

    if (type == 'type2') {
      if(data){
        webView = (isTrue) ? (
          <View style={{borderBottomWidth:1,borderColor:'#f5f5f5',}}>
            <FlyWebView html={data.content} webviewStyle={'body{line-height:120%;padding-Right:25px;font-size:12px;}'} style={styles.flyWebView}/>
            <View>
              <FlyItem text="保障方式" showSegment={true} otherText="安全保障" otherTextStyle={{color:FlyColors.baseBlueColor}} onPress={()=>this.goScene('benxi_baozhang_xieyi','安全保障')}/>
              <FlyItem text="服务协议"  otherText="查看协议" otherTextStyle={{color:FlyColors.baseBlueColor}} onPress={()=>this.goScene('touzi_zixun_xieyi','服务协议')}/>
            </View>
          </View>
        ) : null;
      }
    }

    if (type == 'type3') {
      if (data && data.length >0) {
        let view = data.map((item,id)=>{
          return(
            <FlyImage source={item.content} width={FlyDimensions.deviceDim.width}/>
          );
        });
        webView = (isTrue) ? (
          <View style={{borderBottomWidth:1,borderColor:'#f5f5f5',}}>
            {view}
          </View>
        ) : null;
      }
    }

    return(
      <View style={{marginLeft:15,marginRight:15,borderBottomWidth:1,borderBottomColor:FlyColors.baseTextColor3}}>
        <TouchableOpacity style={{flexDirection:'row',height:50,alignItems:'center'}} onPress={onPress}>
          <FlyImage resizeMode='stretch' source={source} style={styles.processImg}/>
          <Text style={styles.itemText}>{title}</Text>
          <FlyIconfonts name={name} style={{marginTop:12}} size={15}/>
        </TouchableOpacity>
        {webView}
      </View>
    )
  }



  render() {
    let materialInfos = this.state.materialInfos;

    let isShowIntroduce = this.state.isShowIntroduce;
    let isShowBenXiProtocol = this.state.isShowBenXiProtocol;
    let isShowInvestProtocol = this.state.isShowInvestProtocol;
    let onPress1,onPress2,onPress3

      onPress1 = ()=>this.setState({isShowIntroduce:!isShowIntroduce});
      onPress2 = ()=>this.setState({isShowBenXiProtocol:!isShowBenXiProtocol});
      onPress3 = this.props.isLoggedIn ? ()=>this.setState({isShowInvestProtocol:!isShowInvestProtocol}) : ()=>Utils.alert('您还未登录',()=>DeviceEventEmitter.emit(env.ListenerMap['LOGIN_MODAL']));
   if (this.props.Uninfo) {
      onPress1=null
      onPress2=null
      onPress3=null
    }
    if(materialInfos){
      return (
        <View style={FlyStyles.container}>
          <View style={{marginBottom:50}}>
            {this.itemView(q1,'项目介绍',isShowIntroduce,materialInfos.projectIntroduce,onPress1,'type1')}
            {this.itemView(q2,'保障措施',isShowBenXiProtocol,materialInfos.insuranceMeasure,onPress2,'type2')}
            {this.itemView(q3,'相关材料',isShowInvestProtocol,materialInfos.materialRelative,onPress3,'type3')}
          </View>
        </View>
      )
    }else{
      return FlyBase.LoadingView();
    }
  }
}



var styles = StyleSheet.create({
  flyItem:{
    paddingLeft:15,
    borderBottomWidth:1,
    borderColor:'#f5f5f5'
  },
  flyWebView:{
    marginTop:10,
    marginBottom:10,
  },
  bottomBorderStyle:{
    borderBottomWidth:1,
    borderColor:'#f5f5f5',
  },
  processImg:{
    width:27,
    height:25,
    marginRight:10,
    marginTop:5
  },
  itemText:{
    color:FlyColors.baseTextColor,
    fontSize:FlyDimensions.fontSizeXl,
    flex:1
  }

});

function select(store) {
  return {
    isLoggedIn:store.user.isLoggedIn
  };
}

module.exports = connect(select)(FinancingIntroduce);
