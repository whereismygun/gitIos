/**
 *
 * @providesModule FlyShare
 * @flow
 *
 */
'use strict';

import React, {Component} from 'react';
import ReactNative, {
  StyleSheet,
  Navigator,
  View,
  TouchableOpacity,
} from 'react-native';

import {
  isInstalled as isInstalledWeixin,
  share as shareToWeixin,
  Scene as weixinScene,
  Type as weixinType,
} from 'fly-react-native-weixin';

import {
  shareToQQ,
  shareToQzone,
  addToQQFavorites,
  checkClientInstalled,
} from 'fly-react-native-qq';

import {
  isInstalled as isInstalledWeibo,
  share as shareToWeibo,
} from 'fly-react-native-weibo';

const {OneLine, Text} = require('FlyText');

const FlyStyles = require('FlyStyles');
const FlyDimensions = require('FlyDimensions');
const FlyColors = require('FlyColors');
const FlyWebView = require('FlyWebView');
const FlyBase = require('FlyBase');
const Utils = require('Utils');
const FlyModalBox = require('FlyModalBox');
const FlyImage = require('FlyImage');

const itemWidth = Math.floor(FlyDimensions.deviceDim.width / 4);

type Props = {
  title: string;
  description: string;
  thumb: string;
  shareUrl: string;
};

const shareItems1 = [{
    img: './imgs/process/weChat.png',
    text: '微信好友',
    onPress: (props) => {
      isInstalledWeixin((installed) => {
        if (installed) {
          let params = {};
          params.scene = weixinScene.SESSION;

          params.message = {
            title: props.title,
            description: props.description,
            thumb: props.thumb,
            media: {
              type: weixinType.WEBPAGE,
              webpageUrl: props.shareUrl
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
  }, {
    img: './imgs/process/sina.png',
    text: '新浪微博',
    onPress: (props) => {
      isInstalledWeibo((installed) => {
        if (installed) {
          let params = {
              defaultText: props.title,
              title: props.title,
              description: props.description,
              imageUrl: props.thumb,
              url: props.shareUrl
          };
          shareToWeibo(params, function (msg) {
          }, function (msg) {
            Utils.alert("分享失败: " + msg);
          });
        } else {
          Utils.alert("亲，您没有安装新浪微博App，请安装后再进行分享。");
        }
      });
    }
  }];

const shareItems2 = [{
    img: './imgs/process/qq.png',
    text: 'QQ',
    onPress: (props) => {
      checkClientInstalled((installed) => {
        if (installed) {
          let params = {
            appName: "通通理",
            title: props.title,
            description: props.description,
            imageUrl: props.thumb,
            url: props.shareUrl
          };

          shareToQQ(params, function(msg){}, function(msg) {
            Utils.alert("分享失败: " + msg);
          });
        } else {
          Utils.alert("亲，您没有安装QQ App，请安装后再进行分享。");
        }
      });
    }
  }, {
    img: './imgs/process/line.png',
    text: '微信朋友圈',
    onPress: (props) => {
      isInstalledWeixin((installed) => {
        if (installed) {
          let params = {};

          params.scene = weixinScene.TIMELINE;

          params.message = {
            title: props.title,
            description: props.description,
            thumb: props.thumb,
            media: {
              type: weixinType.WEBPAGE,
              webpageUrl: props.shareUrl
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
  }];

class FlyShare extends React.Component {
  props: Props;

  constructor(props) {
    super(props);

    (this: any).open = this.open.bind(this);
    (this: any).close = this.close.bind(this);
    (this: any).onPressBtn = this.onPressBtn.bind(this);
  }

  componentDidMount() {
  }

  open() {
    this.refs.modal.open();
  }

  close() {
    this.refs.modal.close();
  }

  onPressBtn(item) {
    if (item.onPress) {
      item.onPress(this.props);
    }
  }

  renderRow(shareItems, rowStyle) {

    var content = shareItems.map((item,i) => {

      if (item.text) {
        return (
          <TouchableOpacity key={i} style={styles.shareItem} onPress={() => {
              this.onPressBtn(item);
            }}>
            <View style={styles.shareItemImgWrapper}>
              <FlyImage style={styles.shareItemImg} source={item.img} />
            </View>

          </TouchableOpacity>
        );
      } else {
        return (
          <View key={i} style={styles.shareItem}>
          </View>
        );
      }


    });

    return (
      <View style={[styles.shareRow, rowStyle]}>
        {content}
      </View>
    );
  }

  render() {

    return (
      <FlyModalBox style={styles.modal} swipeToClose={false} modalStyle={styles.modalWrapper} backdropColor={'white'} backdropOpacity={0.95} position={"bottom"} ref={"modal"}>
        <FlyImage source={'./imgs/share/halve.png'} style={{flex:1}} width={FlyDimensions.deviceDim.width}>
          <View style={styles.shareWrapper}>
            {this.renderRow(shareItems1, {
              marginBottom: 15
            })}
            {this.renderRow(shareItems2)}
            <TouchableOpacity style={styles.shareBtnWrapper} onPress={() => {
                this.close();
              }}>
                <FlyImage source={'./imgs/share/close.png'} width={20} />
            </TouchableOpacity>
          </View>
        </FlyImage>
      </FlyModalBox>
    );

  }
}

//

var styles = StyleSheet.create({
  modal: {
    flexDirection: 'column',
    height:FlyDimensions.deviceDim.height,
    backgroundColor: 'rgba(0,0,0,0)',
    // paddingLeft: 15,
    // paddingRight: 15,
  },
  modalWrapper: {
    flexDirection: 'row',
  },
  shareWrapper: {
    flex: 1,
    marginBottom: 15,
    borderRadius: 5,
    padding: 30,
    flexDirection: 'column',
    justifyContent:'center',
    alignItems:'center'
  },
  shareRow: {
    // flex: 1,
    flexDirection: 'row',
  },
  shareItem: {
    flex: 1,
    flexDirection: 'column',
    marginBottom:25,
    marginTop:25,
  },
  shareItemImgWrapper: {
    // flex: 1,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareItemImg: {
    width: itemWidth * 0.6,
    height: itemWidth * 0.6,
  },
  shareItemTextWrapper: {
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareBtnWrapper: {
    borderRadius: 5,
    alignItems: 'center',
    justifyContent:'center',
    position:'absolute',
    bottom:10,
    backgroundColor:'rgba(0,0,0,0)',
    width:FlyDimensions.deviceDim.width * 0.2,
    height:FlyDimensions.deviceDim.width * 0.2,
    // borderWidth:1
  },
  shareBtnText: {
    fontSize: FlyDimensions.fontSizeXl,
    color: FlyColors.brandPrimary
  }
});

function select(store, props) {
  return {
  };
}

module.exports = FlyShare;
