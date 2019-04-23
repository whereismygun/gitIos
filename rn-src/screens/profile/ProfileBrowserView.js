/**
 *
 *
 * @flow
 *
 */
'use strict';
import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Navigator,
  View,
  WebView
} from 'react-native';


import {connect} from 'react-redux';

const FlyStyles = require('FlyStyles');
const FlyHeader = require('FlyHeader');
const SceneUtils = require('SceneUtils');
const Utils = require('Utils');
const Filters = require('Filters')
const FlyShare = require('FlyShare');
const env = require('env')
const FlyColors = require('FlyColors');

type Props = {
  navigator: Navigator;
  title: string;
  backConfirmText: string;
  feedbackFn: () => Void;
  uri: string;
};

class ProfileBrowserView extends React.Component {
  props : Props;

  constructor(props) {
    super(props);

    (this: any).onBridgeMessage = this.onBridgeMessage.bind(this);
    this.state={
       title:'',
       description:'',
       shareUrl:'',
       thumb:'',
    }
  }

  onBridgeMessage(e) {
    let msg = 'failure';
    if(e && e.nativeEvent && e.nativeEvent.data){
        msg = e.nativeEvent.data;
       if (Utils.startWith(e.nativeEvent.data,'/share')) {
           let params = Utils.getRequestParam(e.nativeEvent.data)

            this.setState({
               title:params.title,
               description:params.description,
               shareUrl:params.shareUrl,
               thumb:params.thumb,
            })
           this.refs.share.open()
           }else{
           SceneUtils.gotoScene(Filters.htmlDecode(e.nativeEvent.data))
         }

      }
      let feedbackFn = this.props.feedbackFn;
      feedbackFn && feedbackFn(msg);
  }

  render() {
    let that = this;

     let  color = this.props.type == 'redpacket' ? '#CF3A3F':'white';
     let  borderBottom = this.props.type ? false : true ;
     let  backColor = this.props.type ? 'white' : FlyColors.baseTextColor;
     let  titleColor = this.props.type ? 'light' : ''
    let leftItem = {
      layout: "icon",
      icon: "icon-left-arrow-l",
      color:backColor,
      onPress: () => {
        let backConfirmText = that.props.backConfirmText;
        if (backConfirmText) {
          Utils.confirm(null, backConfirmText, () => {
            SceneUtils.goBack();
          });
        } else {
          SceneUtils.goBack();
        }
      }
    };

    let {title, uri, ...props} = this.props;
    let shareInfo = {
      title: this.state.title,
      description: this.state.description,
      thumb: this.state.thumb,
      shareUrl:this.state.shareUrl,
      type:this.state.type
    };

 
    return (
      <View style={FlyStyles.container}>
        <FlyHeader leftItem={leftItem} foreground={titleColor} backgroundColor={color} borderBottom={borderBottom} title={title} />
        <View style={{flex:1}}>
          <WebView
            style={styles.webview}
            onMessage={this.onBridgeMessage}
            source={{uri:uri}}
            />
        </View>
         <FlyShare ref={'share'} style={{flex:1}} {...shareInfo} />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  webview: {
    flex: 1,
  },
});

function select(store) {
  return {

  };
}

module.exports = connect(select)(ProfileBrowserView);
