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
  DeviceEventEmitter,
  ScrollView
} from 'react-native';

const {connect} = require('react-redux');

const DXRefreshControl = require('DXRefreshControl');
const men = './imgs/myAssets/men.png';
const women = './imgs/myAssets/women.png';
const settingNor = './imgs/myAssets/unlogin.png';
const FlyBase = require('FlyBase');
const FlyColors = require('FlyColors');
const FlyStyles = require('FlyStyles');
const FlyDimensions = require('FlyDimensions');
const FlyImage = require('FlyImage');
const SceneUtils = require('SceneUtils');
const env = require('env');
const FlyHeader = require('FlyHeader');
const {logout,findUserStatus} = require('../../actions')
const NativeModuleUtils = require('NativeModuleUtils');
const FlyModalBox = require('FlyModalBox');
const close = './imgs/base/close.png';
const updateBg = "./imgs/base/updateBg.png";
const NetworkService = require('NetworkService');
const Utils = require('Utils');
const {Text} = require('FlyText');
const FlyBottomButton = require('FlyBottomButton');
const FlyItem = require('FlyItem');
const UrlHelper = require('UrlHelper');
const dim = FlyDimensions.deviceDim;
const unfinished = './imgs/personCenter/unfinished.png';
const {injection} = require('fly-react-naitve-jpush');
const {getCacheFileSize} = require('fly-react-native-clean-cache');
const {cleanCache} = require('fly-react-native-clean-cache');
const {getBundleInfo} = require('fly-react-native-app-info')

type Props = {
  navigator: Navigator;
};

class PersonalCenterView extends React.Component {
  props: Props;

  constructor(props) {
    super(props);
    (this :any).goLoginOut = this.goLoginOut.bind(this);
    this.state = {
      authStatus:null,
      cacheSize:null,
      ocrState:null,
    }
  }


  componentDidMount() {
    let that = this;
    
  that.props.dispatch(findUserStatus())
   getCacheFileSize((respone)=>{
     this.setState({
      cacheSize:respone['cache']
     })
   });

  }

  componentWillReceiveProps(nextProps: Props) {
    let next = nextProps;
    let moment = this.props;

    if (moment.userStatus&&(moment.userStatus.passOCR != next.userStatus.passOCR||moment.userStatus.isCertification!=next.userStatus.isCertification||moment.userStatus.isTiedCard!=next.userStatus.isTiedCard||moment.userStatus.isSitePass!=next.userStatus.isSitePass)) {
         this.props.dispatch(findUserStatus())
     }

  }

  checkUserStatus(scene){

    if (this.props.userStatus&&!this.props.userStatus.isCertification) {
      Utils.confirm('提醒','亲，您没有进行认证，请先认证', ()=>SceneUtils.gotoScene('PERSONAL_IDENTIFY'),null,'前往');
    }else if (this.props.userStatus&&!this.props.userStatus.isTiedCard){
      Utils.confirm('提醒','亲，您没有进行绑定银行卡，请先绑定银行卡', ()=>SceneUtils.gotoScene('PROFILE_SHOW_BANK_CARD'),null,'前往');
    }else if (this.props.userStatus&&!this.props.userStatus.isSitePass){
       let params={
         title:'设置交易密码',
         step:2
       }
      SceneUtils.gotoScene('CERTIFICATION_PROCESS_VIEW',params);
    }else{
      SceneUtils.gotoScene(scene)
    }

  }


  goCertification(){
 SceneUtils.gotoScene('MT_AUTHENTICATION')
  if (this.props.userStatus&&this.props.userStatus.isCertification) {
         SceneUtils.gotoScene('PERSONAL_IDENTIFY',null,'前往');
        }else{
         let params={
             title:'实名认证',
             step:0
          }
         SceneUtils.gotoScene('MT_AUTHENTICATION',params)
        }   
  
      }

  goLoginOut(){
    if (this.props.isLoggedIn) {
      injection((respone)=>{});
      let loginOut = this.props.dispatch(logout());
      loginOut.then((data)=>{
        SceneUtils.gotoScene('TAB_VIEW');
      }).catch((err)=>{
        DeviceEventEmitter.emit(env.ListenerMap['LOGIN_MODAL']);
      })
    }else{
      DeviceEventEmitter.emit(env.ListenerMap['LOGIN_MODAL']);
    }

  }

  performCleanCache(){
    if (this.state.cacheSize === '0.00') {
      return;
    }
    Utils.confirm('提醒','您确定要清空缓存?',()=>{
      cleanCache((respone)=>{
       this.setState({
      cacheSize:respone['cache']
       })
      })
    },null,'确定');
  }

  render() {
    let bottomTitle = (this.props.isLoggedIn == true) ? '退出登录' : '登录';
    let leftItem ={
      type:'back',
    };
    let username = this.props.username;
    let name = '';
    let isAuth = '',isAuthColor;
    let authImage = null;
    let ocrDes = ''
    let ocrOnPress,ocrView;

    if(this.props.userStatus){
      isAuth = this.props.userStatus.isCertification ? '已认证' : '未认证';
      isAuthColor = this.props.userStatus.isCertification ? '#cccccc' : '#999999';
      authImage = (this.props.userStatus.isCertification) ? (<FlyImage source={'./imgs/personCenter/attestation.png'} resizeMode={'contain'} width={20} height={20}/>) : null;
      ocrDes = this.props.userStatus.passOCR ? '已上传' : '未上传'
      ocrOnPress = this.props.userStatus.passOCR ? null : ()=>{SceneUtils.gotoScene('PERSONAL_ID_READER')}
       if (this.props.userStatus.passOCR) {
         ocrView=(
           <View style={{flexDirection:'row',height:50,alignItems:'center',justifyContent:'center'}}>
            <Text style={{marginRight:15,color:'#cccccc'}}>已上传</Text>
          </View>  
          )
      }else{
         ocrView=(
          <View style={{flexDirection:'row',height:50,alignItems:'center',justifyContent:'center'}}>
            <FlyImage style={{marginRight:5}} source={unfinished} width={15}/>
            <Text style={{color:FlyColors.baseColor}}>未上传</Text>
          </View>
          )
      }
    }
    if(!Utils.isEmpty(username)){
       name =username.substring(0,3)+'****'+username.substring(username.length-4,username.length);
    }
    let otherView = (
      <View style={styles.username}>
        {authImage}
        <Text style={{fontSize:FlyDimensions.fontSizeXl,marginLeft:5}}>{name}</Text>
      </View>
    );
       let titleImage = settingNor;
      if (this.props.userInfo && this.props.userInfo.sex) {
          titleImage = (this.props.userInfo.sex == 1) ? men : women;
      }
    let headView = (
      <View style={{justifyContent:'center',height:65}}>
        <FlyImage source={titleImage} width={35}/>
      </View>
    )
   
    return (
      <View style={FlyStyles.container}>
        <FlyHeader title={'个人中心'} borderBottom={true} leftItem={leftItem}/>
        <ScrollView style={{marginBottom:50,backgroundColor:FlyColors.baseTextColor3}}>
          <FlyItem view={headView}  otherView={otherView} height={65}/>
          {FlyBase.SegmentView()}
          <FlyItem text="实名认证"   otherText={isAuth} otherTextColor={isAuthColor}  onPress={()=>this.goCertification()} showSegment={true} />
          <FlyItem text='身份证扫描' showSegment={true} otherView={ocrView} onPress={ocrOnPress}/>
          <FlyItem text="我的银行卡"   onPress={()=>{
            if (this.props.userStatus&&this.props.userStatus.isCertification) {
                 SceneUtils.gotoScene('PROFILE_SHOW_BANK_CARD');
             }else{
               Utils.confirm('提醒','亲，您没有进行认证，请先认证', ()=> SceneUtils.gotoScene('CERTIFICATION_PROCESS_VIEW',params),null,'前往');
                let params={
                title:'实名认证',
                step:0
              }
             }
            }}/>
          {FlyBase.SegmentView()}
          <FlyItem text="修改登录密码"    onPress={()=>{SceneUtils.gotoScene('MOTIFY_PASSWORD_VIEW')}} showSegment={true}/>
          <FlyItem text="修改交易密码"  showSegment={true} onPress={()=>this.checkUserStatus('RESET_PAY_PASS_WORD_VIEW')}/>
          <FlyItem text="忘记交易密码" onPress={()=>this.checkUserStatus('PROFILE_FORGET_PASS_WORD')}/>
           {FlyBase.SegmentView()}
          <FlyItem text="常见问题" onPress={()=>SceneUtils.gotoScene('PROFILE_QUESTION_VIEW')} />
           {FlyBase.SegmentView()}
          <FlyItem text='清空缓存' otherTextColor={'#cccccc'} otherText={this.state.cacheSize+"KB"} onPress={()=>{this.performCleanCache()}}/>
        </ScrollView>
        <TouchableOpacity style={styles.bottom} onPress={this.goLoginOut}>
          <Text style={styles.bottomText}>{bottomTitle}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}



var styles = StyleSheet.create({
  bottom:{
    position:'absolute',
    bottom:0,
    height:50,
    justifyContent:'center',
    alignItems:'center',
    width:FlyDimensions.deviceDim.width,
    backgroundColor:'white'
  },
  bottomText:{
    color:FlyColors.baseColor,
    fontSize:FlyDimensions.fontSizeXl
  },
  username:{
    flexDirection:'row',
    height:65,
    alignItems:"center"
  }
});

function select(store) {
  return {
    isLoggedIn:store.user.isLoggedIn,
    userInfo:store.user.userInfo,
    username:store.user.username,
    userStatus:store.user.userStatus,
  };
}

module.exports = connect(select)(PersonalCenterView);
