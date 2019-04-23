/**
 *
 * @providesModule FlyImage
 * @flow
 *
 */
'use strict';


import React,{Component} from 'react';
import {
  StyleSheet,
  Navigator,
  TouchableOpacity,
  View,
  Image,
  Animated,
} from 'react-native';

import RNFS, {
  DocumentDirectoryPath
} from 'fly-react-native-fs';

import {
  getAssetURL,
} from 'fly-react-native-app-info';

const FlyStyles = require('FlyStyles');
const Filters = require('Filters');
const Utils = require('Utils');

const DEFAULT_IMAGE = FlyStyles.DEFAULT_IMAGE;

const
  STATUS_NONE = 0,
  STATUS_LOADING = 1,
  STATUS_LOADED = 2,
  STATUS_UNLOADED = 3;

export type Props = {
  source: string;
  isAnimated: boolean;
  width: number;
  height: number;
};

class FlyImage extends React.Component {
  props: Props;

  constructor(props) {
    super(props);

    this.isUnmount = false;

    this.state = {
      localPath: null, //默认图片
      imgSize: null,
      remoteStatus: 'unload'
    };

  }

  componentWillMount() {
    if (!Utils.isEmpty(this.props.source)) {
      this.reload(this.props);
    }
  }

  componentWillReceiveProps(nextProp) {
    if (nextProp.source !== this.props.source) {
      if (!Utils.isEmpty(nextProp.source)) {
        this.reload(nextProp);
      }
    }
  }

  componentWillUnmount() {
    this.isUnmount = true;
  }

  loadFromLocal(localPath) {
    this.setState({
      localPath,
    });
  }

  reload(props) {
    let newSource = this._fixSource(props.source);
    let that = this;

    if (Utils.startWith(newSource, "./")) {
      getAssetURL(newSource, (localPath) => {
        if (localPath && !that.isUnmount) {
          that.loadFromLocal(localPath);

          if (props.width || props.height) {
            that._getImgSize(localPath);
          }
        }
      });
    } else {
      if (props.width || props.height) {
        this._getImgSize(newSource);
      }
    }
  }

  _fixSource(source) {
    let newSource = Filters.htmlDecode(source);
    if (Utils.startWith(newSource, "//")) {
      newSource = "https:" + newSource;
    }
    return newSource;
  }

  _getImgSize(source) {
    let that = this;
    // 如果设置了长或宽
    Image.getSize(source, (width, height) => {
      that.setState({
        imgSize: {
          width: width,
          height: height
        }
      });
    });
  }

  _getImgStyle() {
    if (this.props.width && this.props.height) {
      return {
        width: this.props.width,
        height: this.props.height
      };
    }

    let imgSize = this.state.imgSize;

    if ((this.props.width || this.props.height) && imgSize) {
      if (this.props.width) {
        let height = imgSize.height * this.props.width / imgSize.width;
        return {
          width: this.props.width,
          height: height
        };
      } else if (this.props.height) {
        let width = imgSize.width * this.props.height / imgSize.height;
        return {
          width: width,
          height: this.props.height
        };
      }
    }

    return null;
  }

  _getImageObject() {
    return (this.props.isAnimated) ? Animated.Image : Image;
  }

  render() {

    let { children, source, style, ...props } = this.props;
    source = this._fixSource(source);

    let Image = this._getImageObject();

    let sizeStyle = this._getImgStyle();

    if (Utils.startWith(source, "http")) {
      let newChildren = children;
      if (this.state.remoteStatus !== 'loaded') {
        newChildren = (
          <Image
            style={{width:60,height:20}}
            resizeMode={'center'}
            source={{uri:DEFAULT_IMAGE}}
            >
          </Image>
        );
      }
      return (
        <Image {...props} style={[style,sizeStyle,{justifyContent:'center', alignItems:'center'}]} source={{uri:source}} onLoadEnd={() => {
            this.setState({
              remoteStatus: 'loaded'
            });
          }}>
          {newChildren}
        </Image>
      );
    }

    if (this.state.localPath) {
      return (
        <Image {...props} style={[style,sizeStyle]} source={{uri:'file://'+this.state.localPath}}>
          {children}
        </Image>
      );
    }

    return (
      <Image
        {...props}
        style={[style,sizeStyle,{justifyContent:'center', alignItems:'center'}]}
        >
        <Image
          style={{width:60,height:20}}
          resizeMode={'center'}
          source={{uri:DEFAULT_IMAGE}}
          >
        </Image>
      </Image>
    );

  }
}

var styles = StyleSheet.create({

});

module.exports = FlyImage;
