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

const TimerMixin = require('react-timer-mixin');
const DXRefreshControl = require('DXRefreshControl');

const FlyBase = require('FlyBase');
const FlyColors = require('FlyColors');
const FlyStyles = require('FlyStyles');
const FlyDimensions = require('FlyDimensions');
const FlyImage = require('FlyImage');
const FlyLoading = require('FlyLoading');
const SceneUtils = require('SceneUtils');
const FlyModalBoxRefresh = require('FlyModalBoxRefresh');
const env = require('env');
const FlyHeader = require('FlyHeader');
const {loadEnterTimeInfo,generalizeSearch} = require('../../actions');
const NativeModuleUtils = require('NativeModuleUtils');
const FlyModalBox = require('FlyModalBox');
const updateBg = "./imgs/base/updateBg.png";
const NetworkService = require('NetworkService');
const Utils = require('Utils');
const {Text,OneLine} = require('FlyText');
const FlyContainer= require('FlyContainer');
const LISTVIEWREF = 'listview';
const dim = FlyDimensions.deviceDim;
const {getInviteFriendUrl,getInviteSpreeList,getUserInfo,getInviteFriendList,getSpreeSpredUrl} = require('../../actions');
const QRCode = require('fly-react-native-qrcode');
const qrCodeHight = dim.height * 0.5;
const qrCodeWidth = dim.width * 0.7;
const qrCodeMarginTop = dim.height * 0.25;
const weixin = './imgs/share/weixin.png';
const timeline = './imgs/share/timeline.png';
const Filters = require('Filters');
const close = './imgs/invite/closed.png';
const FlyShare = require('FlyShare');
const invite_bg = './imgs/invite/invite_bg.png';
const invite_group = './imgs/invite/invite_group.png';
const invite_list = './imgs/invite/invite_list.png';
const invite_reward = './imgs/invite/invite_reward.png';
const invite_gift = './imgs/invite/invite_gift.png';
const Bank = './imgs/invite/privateBank.png';
const promote = './imgs/invite/promote.png';
const consultant = './imgs/invite/consultant.png';
const module1 ='./imgs/invite/invite_model1.png';
const module2 ='./imgs/invite/invite_model2.png';
const normalRule='./imgs/invite/normal.png';
const privateRule = './imgs/invite/private.png';
const invite_normalBg = './imgs/invite/invite_normalBg.png';
const srcoll = './imgs/invite/srcoll.png';
const invite_list1 = './imgs/invite/invite_list1.png';
const noData = './imgs/invite/noData.png'

import {
  isInstalled as isInstalledWeixin,
  share as shareToWeixin,
  Scene as weixinScene,
  Type as weixinType,
} from 'fly-react-native-weixin';



type Props = {
  navigator: Navigator;
};

class ProfileInviteView extends React.Component {
  props: Props;

  constructor(props) {
    super(props);

   (this:any).renderItem=this.renderItem.bind(this);
   (this : any)._reloadFetchFriendList = this._reloadFetchFriendList.bind(this);
   (this : any)._renderFriendRow = this._renderFriendRow.bind(this);

   (this : any)._renderRow = this._renderRow.bind(this);

    this.state = {
      isBonus:false,
      url:null,
      generalize:null,
      counselor:null,
      friendList:null,
      agentFriendList:null,
    }

  }


  componentDidMount() {

    let that = this;
    InteractionManager.runAfterInteractions(()=>{
      that.reloadData();
    });
  }

  reloadData(){
    let that = this;
    let promise = that.props.dispatch(getUserInfo(true));
    let promises = that.props.dispatch(getInviteSpreeList());
    promises.then((data)=>{
      that.setState({
        agentFriendList:data.spreadFriendsVOList
      });
    }).catch((err)=>{
    });

      promise = that.props.dispatch(getInviteFriendList());
      promise.then((data)=>{
        that.setState({
          friendList:data.spreadFriendsVOList
        });
      }).catch((err)=>{
      });

  }

  componentWillReceiveProps(nextProps){
    if (this.props.isLoggedIn != nextProps.isLoggedIn) {
      this.reloadData();
    }
  }

  inviteFriend(){
    let userInfo = this.props.userInfo;
    if (this.props.isLoggedIn) {
      if (userInfo && userInfo.agent == true) {
        let promise = this.props.dispatch(getSpreeSpredUrl());
        promise.then((data)=>{
          this.setState({
            url:Utils.htmlDecode(data)
          });
          this.refs.share.open();
        }).catch((err)=>{
          Utils.alert(err.msg);
        });
      }else {
        let promise = this.props.dispatch(getInviteFriendUrl());
        promise.then((data)=>{
          this.setState({
            url:Utils.htmlDecode(data)
          });
          this.refs.share.open();
        }).catch((err)=>{
          Utils.alert(err.msg);
        });
      }
    }else {
      Utils.alert('您还未登录,请先登录',()=>DeviceEventEmitter.emit(env.ListenerMap['LOGIN_MODAL']));
    }
  }

  _reloadFetchEarnings(typeIndex){
   let cfg = {
             url:'generalizeSearch',
             params:{
             type:typeIndex
              }
            }
            return cfg;
  }
  _reloadFetchFriendList(){
    getInviteFriendList
       let url = this.props.userInfo&&this.props.userInfo.agent?'getInviteSpreeList':'getInviteFriendList'
       let cfg= {
           url:url
       }
       return cfg
  }

  _renderRow(rowData){

    return(
     <View style={{flexDirection:'row'}}>
        <View style={styles.baseTextContain}>
        <Text style={{marginLeft:10}}>{rowData.phone}</Text>
        </View>
        <View style={styles.baseTextContain}>
        <Text>{rowData.amount}</Text>
        </View>
        <View style={styles.baseTextContain}>
        <Text>{rowData.time}</Text>
        </View>
     </View>
    )
  }

  weixin(scene){
    let info = env.DEFAULT_SHARE_INFO;
    isInstalledWeixin((installed) => {
        if (installed) {
          let params = {};
          params.scene = scene;
          params.message = {
            title: info.title,
            description: info.description,
            thumb: info.thumb,
            media: {
              type: weixinType.WEBPAGE,
              webpageUrl: this.state.url,
            }
          };
          shareToWeixin(params, function () {
          }, function (reason) {
            Utils.alert("分享失败" + reason);
          });
        } else {
          Utils.alert("亲，您没有安装微信App，请安装后再进行分享。");
        }
    });
  }

  shareModal(){
    let url =Filters.htmlDecode(this.state.url);
    let shareInfo = {
      title: env.DEFAULT_SHARE_INFO.title,
      description: env.DEFAULT_SHARE_INFO.description,
      thumb: env.DEFAULT_SHARE_INFO.thumb,
      shareUrl: url
      }
    return(
        <FlyShare ref={'share'} style={{flex:1}} {...shareInfo} />
    )
  }

  _renderModal(){
    let friendList = this.state.friendList;
    if (friendList && friendList.length > 0) {
      return(
        <FlyModalBox style={styles.flyModalBox} swipeToClose={false}  position="top" ref="FriendModal" >
          <FlyImage source={invite_list_01} style={{alignItems:'center',justifyContent:'center'}} width={dim.width}>
            <ScrollView style={{width:dim.width}}>
              {this._renderCell(friendList)}
            </ScrollView>
          </FlyImage>
          <TouchableOpacity style={{alignItems:'center'}} onPress={()=>this.refs.FriendModal.close()}>
            <FlyImage  source={close} style={styles.closeImg}/>
          </TouchableOpacity>
        </FlyModalBox>
      )
    }
  }
  renderItem(rowData){

    return(
      <View style={{flexDirection:'row',marginLeft:30,marginTop:10,justifyContent:'space-around'}}>
           <Text>{rowData.phone}</Text>
           <Text>{rowData.amount}</Text>
           <Text>{rowData.time}</Text>
      </View>
    )
  }

  _renderCell(arr,type){
    let arrList = [];
    if (type == 'catMore') {
      arrList = arr.slice(0,4);
    }else {
      arrList =  arr;
    }
    let view = arrList.map((item,idx)=>{
      let updateTime;
      if (item.spreadRelation) {
        updateTime = Utils.dateFormat(item.spreadRelation.updateTime,'YYYY-MM-DD');
      }
      return (
        <View style={styles.cell}>
          <Text style={styles.friend}>{item.receivePhone}</Text>
          <Text style={styles.friend}>{updateTime}</Text>
          <Text style={styles.friend}>{Filters.investmentBefore(item.investmentBefore)}</Text>
        </View>
      )
    });
    return view;
  }



  _renderFriendList(){

   let friendList,normal,privateBank;
    normal={
       Imgsource:invite_list1,
       marginTop:60
    }
    privateBank={
       Imgsource:invite_list,
       marginTop:5
    }
   friendList=this.props.userInfo&&this.props.userInfo.agent? privateBank:normal
    return(
      <FlyImage source={friendList.Imgsource} style={{justifyContent:'center',marginTop:friendList.marginTop}} width={dim.width*0.9}>
        <View style={{flex:1,marginTop:dim.height*0.16,marginBottom:10}}>
         <FlyModalBoxRefresh
                    reloadFetchConfig={this._reloadFetchFriendList}
                    enablePullToRefresh={true}
                    noDataImg={noData}
                    renderRow={this._renderFriendRow}/>
        </View>
      </FlyImage>
    )

  }

  _renderFriendRow(rowData){

      let change ;
          change = this.props.userInfo&&this.props.userInfo.agent ? Filters.investmentBefore(rowData.investmentBefore):rowData.unBindTime;

     return (
      <View style={{flexDirection:'row'}}>
        <View style={{flex:1,marginLeft:10,alignItems:'center',marginTop:20,backgroundColor:'transparent'}}>
            <Text>{rowData.receivePhone}</Text>
        </View>
        <View style={{flex:1,marginLeft:5,alignItems:'center',marginTop:20,backgroundColor:'transparent'}}>
            <Text >{rowData.spreadRelation.updateTime.substr(0,10)}</Text>
        </View>
        <View style={{flex:1,alignItems:'center',marginTop:20,backgroundColor:'transparent'}}>
             <Text >{change}</Text>
        </View>
      </View>
     )
  }
  counselorModal(){
    let dataSource
    if (this.state.counselor) {
      dataSource = this.state.counselor.map((item,index) => {
        return (
          <View style={[{flexDirection:'row'},(index==0)?{marginTop:dim.height*0.03}:styles.changeMargin]}>
              <View style={styles.baseTextContain}>
                <Text style={styles.baseTextColor}>{item.phone}</Text>
              </View >
              <View style={styles.baseTextContain}>
                <Text style={styles.baseTextColor}>{item.amount}元</Text>
              </View>
              <View style={styles.baseTextContain}>
                <Text style={styles.baseTextColor}>{item.time}</Text>
              </View>
          </View>
        )
      })

    }
    return(
      <FlyModalBox style={styles.flyModalBox} swipeToClose={false}  position="top" ref="counselor" >
         <FlyImage source={module2} width={dim.width*0.9} style={{justifyContent:'center'}}>
            <View style={{flex:1,marginTop:dim.height*0.16,marginBottom:10}}>
            <FlyModalBoxRefresh
             reloadFetchConfig={()=>this._reloadFetchEarnings('2')}
             enablePullToRefresh={true}
             noDataImg={noData}
             renderRow={this._renderRow}/>
            </View>
        </FlyImage>
        <TouchableOpacity style={{alignItems:'center'}} onPress={()=>this.refs.counselor.close()}>
          <FlyImage  source={close} style={styles.closeImg}/>
        </TouchableOpacity>
      </FlyModalBox>
    )

  }

  GeneralizeModal(){
     let dataSource
     if (this.state.generalize) {
       dataSource = this.state.generalize.map((item,index) => {
         return (
           <View style={[{flexDirection:'row'},(index==0)?{marginTop:dim.height*0.03}:styles.changeMargin]}>
              <View style={styles.baseTextContain}>
                  <Text style={styles.baseTextColor}>{item.phone}</Text>
              </View >
              <View style={styles.baseTextContain}>
                  <Text style={styles.baseTextColor}>{item.amount}元</Text>
              </View>
              <View style={styles.baseTextContain}>
                   <Text style={styles.baseTextColor}>{item.time}</Text>
              </View>
           </View>
         )
       })

     }
      return(
        <FlyModalBox style={styles.flyModalBox} swipeToClose={false}  position="top" ref="generalize">
          <FlyImage source={module1} width={dim.width*0.9} style={{justifyContent:'center'}}>
            <View style={{flex:1,marginTop:dim.height*0.16,marginBottom:10}}>
             <FlyModalBoxRefresh
                reloadFetchConfig={()=>this._reloadFetchEarnings('1')}
                enablePullToRefresh={true}
                noDataImg={noData}
                renderRow={this._renderRow}/>
            </View>
          </FlyImage>
          <TouchableOpacity style={{alignItems:'center'}} onPress={()=>this.refs.generalize.close()}>
            <FlyImage  source={close} style={styles.closeImg}/>
          </TouchableOpacity>
        </FlyModalBox>
      )
  }

   clickOpenModel(type){
        if(type=='1'){
         this.refs.generalize.open();
       }else{
          this.refs.counselor.open();
       }
  }


  render() {
    let leftItem = {
      type:'back'
    };
    let privateBank,marginStyle,product,backgroundImg,privateTop;
       marginStyle={marginTop:400}
    if (this.props.userInfo&&this.props.userInfo.agent) {
       product=privateRule;
       backgroundImg=invite_bg;
       privateTop={marginTop:40}
       privateBank = (
       <View style={{marginTop:dim.height*0.5,alignItems:'center'}}>
        <FlyImage source={Bank} width={dim.width*0.6}/>
          <View style={styles.privateView}>
              <View style={{flex:1,alignItems:'center'}}>
                  <TouchableOpacity  onPress={()=>{this.clickOpenModel('1')}}>
                    <FlyImage source={promote} width={150}/>
                  </TouchableOpacity>
              </View>
              <View style={{flex:1,alignItems:'center'}}>
                 <TouchableOpacity onPress={()=>{this.clickOpenModel('2')}}>
                       <FlyImage source={consultant} width={150}/>
                   </TouchableOpacity>
              </View>
          </View>
        </View>
      )
    }else{
     product=normalRule
     backgroundImg=invite_normalBg
     privateTop={marginTop:60}
     privateBank = (
           <View style={{marginTop:dim.height*0.5,alignItems:'center'}}>
              <FlyImage source={invite_gift} width={dim.width*0.9}/>
              <FlyImage style={{marginTop:60}} source={invite_reward} width={dim.width*0.9}/>
            </View>
          )

    }

    let isBonus = this.state.isBonus;
    return (
      <View style={FlyStyles.container}>
         <FlyHeader title={'邀请好友'} leftItem={leftItem} borderBottom={true} />
          <ScrollView>
             <FlyImage source={backgroundImg}  width={dim.width} style={{alignItems:'center'}}>
                {privateBank}
                {this._renderFriendList()}
                <FlyImage source={product} style={{marginTop:60}} width={dim.width*0.9}/>
             </FlyImage>
          </ScrollView>
        <TouchableOpacity onPress={()=>this.inviteFriend()} style={{backgroundColor:'rgba(164,72,88,1)',alignItems:'center'}}>
          <Text style={{color:FlyColors.white,paddingTop:15,paddingBottom:15,fontSize:FlyDimensions.fontSizeXxxl}}>立即邀请</Text>
        </TouchableOpacity>
          {this.GeneralizeModal()}
          {this.counselorModal()}
          {this.shareModal()}


      </View>
    )
  }
}



var styles = StyleSheet.create({
  qrCodeContainer:{
    height:qrCodeHight,
    width:qrCodeWidth,
    marginTop:qrCodeMarginTop,
  },
  borderBottomStyle:{
    justifyContent:'center',
    alignItems:'center',
    marginTop:15,
    height:dim.height * 0.22,
  },
  weixinContainer:{
    flexDirection:'row',
    marginTop:10,
    marginBottom:10
  },
  weixinImg:{
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  weixinImgStyle:{
    height:50,
    width:50,
    resizeMode:'stretch'
  },
  modalBottom:{
    marginLeft:20,
    marginRight:10,
    color:FlyColors.baseColor,
    paddingTop:0
  },
  bottomText:{
    fontSize:FlyDimensions.fontSizeLarge,
    textAlign:'center',
    marginBottom:5,
    backgroundColor:'rgba(0,0,0,0)'
  },
  friend:{
    fontSize:FlyDimensions.fontSizeLarge,
    flex:1,
    textAlign:'center'
  },
  friend1:{
    fontSize:FlyDimensions.fontSizeXl,
    flex:1,
    textAlign:'center'
  },
  cell:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'rgba(0,0,0,0)',
  },
  bottomView:{
    position:'absolute',
    bottom:2,
    height:dim.width * 0.1,
    justifyContent:'center',
    backgroundColor:'rgba(0,0,0,0)',
    width:dim.width
  },
  catMore:{
    fontSize:FlyDimensions.fontSizeXl,
    color:'white',
    textAlign:'center'
  },
  flyModalBox: {
    width: FlyDimensions.deviceDim.width,
    height: FlyDimensions.deviceDim.height * 0.7,
    backgroundColor:'rgba(0,0,0,0)',
    marginTop:dim.width * 0.4,
    alignItems:'center'
  },
  closeImg:{
    height:FlyDimensions.deviceDim.height * 0.12,
    width:FlyDimensions.deviceDim.width * 0.12,
    marginTop:10,
    resizeMode:'contain',
  },
  privateText:{
    color:FlyColors.baseColor
  },
  privateTouch:{
    paddingTop:7,
    paddingBottom:7,
    paddingLeft:17,
    paddingRight:17
  },
  privateView:{
    width:dim.width,
    height:100,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center'
  },
  changeMargin:{
    marginTop:dim.height*0.05
  },
  baseTextColor:{
    color:'rgba(205,121,96,1)'
  },
  baseTextContain:{
    flex:1,
    alignItems:'center',
    marginTop:20
  },

});

function select(store) {
  return {
    isLoggedIn:store.user.isLoggedIn,
    userInfo:store.user.userInfo,
  };
}

module.exports = connect(select)(ProfileInviteView);
