'use strict';
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    TouchableHighlight,
    ScrollView,
    ToastAndroid,
    TouchableOpacity,
    TouchableNativeFeedback,
    TouchableWithoutFeedback,
    InteractionManager,
    ListView,
    ActivityIndicator
} from 'react-native';
import {connect} from 'react-redux';
const FlyHeader = require('FlyHeader');
const FlyColors = require('FlyColors');
const FlyDimensions = require('FlyDimensions');
const FlyStyles = require('FlyStyles');
const FlyImage = require('FlyImage');
const UrlHelper = require('UrlHelper');
const FlyButton = require('FlyButton');
const {OneLine, Text} = require('FlyText');
const NetworkService = require('NetworkService');
const SceneUtils = require('SceneUtils');
const Utils = require('Utils');
const FlyRefreshListView = require('FlyRefreshListView');
const volume = './imgs/discovery/volume.png';
const FlyIconfonts = require('FlyIconfonts');
const exercise = './imgs/discovery/exercise.png';
const dim = FlyDimensions.deviceDim;
const {activityBanner} = require('../../actions');
const FlyNoticeView  = require('./FlyNoticeView')
const activity = './imgs/discovery/activityBanner.png'
const end = './imgs/discovery/end.png'
const start = './imgs/discovery/start.png'
const favourable = './imgs/discovery/favourable.png'
const integral = './imgs/discovery/integral.png'
const invite = './imgs/discovery/invite.png'
const message = './imgs/discovery/message.png'


class DiscoveryMainView extends Component {
  constructor(props){
    super(props);
    (this : any)._reloadFetchConfig = this._reloadFetchConfig.bind(this);
    (this : any)._renderItem = this._renderItem.bind(this);
    (this : any).renderMessageView = this.renderMessageView.bind(this);

  }


  _reloadFetchConfig() {
    let cfg = {
        url: 'activityBanner',
        ignoreLogin: true
    };
    return cfg;
  }

  _renderItem(rowData,sectionID, rowID) {
     let img;
     if(rowData.status && rowData.status !== 'enabled'){
          return;
     }
     if (rowData.activityStatus &&  rowData.activityStatus === '进行中') {
        img=start;
     }else {
        img=end;
     }

     let activeOpacity = rowData.hrefUrl ? 0.7 : 1;

     return(
       <TouchableOpacity style={{marginBottom:8,alignItems:'center'}} activeOpacity={activeOpacity} actvieOpa onPress={()=>this.clickToActive(rowData)}>
            <FlyImage source={Utils.htmlDecode(rowData.imgUrl)} style={{borderRadius:10,width:dim.width-20,height:200}} />
            <FlyImage source={img} style={{position:'absolute',top:20,right:3}} width={70}>
               <Text style={{marginTop:10,backgroundColor:'transparent',fontSize:FlyDimensions.fontSizeXl,alignSelf:'center',color:FlyColors.white}}>
                   {rowData.activityStatus}
               </Text>
            </FlyImage>
        </TouchableOpacity>
       );
  }


  clickToActive(rowData){
    if (rowData.hrefUrl) {
      SceneUtils.gotoScene(Utils.htmlDecode(rowData.hrefUrl));
    }
  }

  

  renderMessageView(){
  //   积分商城
  //   {this.renderActivity()}

    return(
       <View style={{backgroundColor:FlyColors.baseBackgroundColor}}>
        <FlyNoticeView title_image={message}/>
       <View style={styles.activeView}>
         <View style={{marginLeft:10,flex:3,flexDirection:'row',alignItems:'center'}}>
          <View style={{backgroundColor:FlyColors.baseColor,height:15,width:3}} />
           <Text style={{fontWeight:'700',marginLeft:10}}>热门活动</Text>
          </View>
          <View style={{alignItems:'center',flexDirection:'row',flex:1,justifyContent:'center'}}>
             <Text style={{marginLeft:5,color:'rgba(125,125,125,1)'}}>往期活动</Text>
          </View>
       </View>
       </View>
    );
  }

  renderActivity(){

    return(
     <View style={styles.activityContent}>
         <TouchableOpacity style={{marginTop:15}}>
            <FlyImage source={activity} width={dim.width-30}/>
         </TouchableOpacity>
         <View style={{flexDirection:'row',marginTop:18}}>
             <TouchableOpacity style={styles.topicStyle}>
                <FlyImage source={favourable} width={44}/>
                <Text style={styles.desText}>特价优惠</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.topicStyle}>
                 <FlyImage source={invite} width={44}/>
                 <Text style={styles.desText}>邀请好友</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.topicStyle}>
                 <FlyImage source={integral} width={44}/>
                 <Text style={styles.desText}>赚取积分</Text>
             </TouchableOpacity>
         </View>

     </View>
      )
  }
  render() {
    return (
      <View style={{flex:1,backgroundColor:FlyColors.baseBackgroundColor}}>
        <FlyHeader title={'发现'} borderBottom={true}/>
         <FlyRefreshListView
            reloadFetchConfig={this._reloadFetchConfig}
            renderHeader={this.renderMessageView}
            style={{backgroundColor:'white',marginBottom:30}}
            renderRow={this._renderItem}/>
      </View>
    )
  }
}
var styles = StyleSheet.create({
  MessageView:{
    flexDirection:'row',
    height:49,
    backgroundColor:'white',
    alignItems:'center'

  },
  activeView:{
    marginTop:10,
    flexDirection:'row',
    backgroundColor:'white',
    height:49,
  },
  activeText:{
    backgroundColor:'rgba(255,255,255,0)',
    color:'white',
    fontSize:FlyDimensions.fontSizeSmall
  },
  noMoreWrapper: {
    height: 40,
    flexDirection:'row',
    alignItems: 'center',
    backgroundColor: FlyColors.baseBackgroundColor,
    width:FlyDimensions.deviceDim.width
  },
  activityContent:{
    backgroundColor:'white',
    marginBottom:10,
    alignItems:'center',
  },
  topicStyle:{
    flex:1,
    alignItems:'center'
  },
  desText:{
    marginBottom:20,
    marginTop:10,
    color:'rgba(105,105,105,1)',
    fontSize:FlyDimensions.fontSizeLarge
  }
});
function select(store) {
    return {

    };
}
module.exports = connect(select)(DiscoveryMainView);
