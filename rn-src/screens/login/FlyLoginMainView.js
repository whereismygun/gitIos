/**
 *
 *
 * @flow
 *
 */
'use strict';
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Alert,
    TouchableOpacity,
    Navigator,
    TextInput,
    InteractionManager,
    DeviceEventEmitter,
} from 'react-native';

import type {Tab}
  from '../../reducers/navigation';

const {
    login,
    switchTab,
    checkUserRegister,
  } = require('../../actions');

import {connect} from 'react-redux';

const Utils = require('Utils');

const env = require('env');

const FlyStyles = require('FlyStyles');
const FlyColors = require('FlyColors');
const FlyIconfonts = require('FlyIconfonts');
const FlyDimensions = require('FlyDimensions');
const FlyHeader = require('FlyHeader');
const FlyLoading = require('FlyLoading');
const FlyButton = require('FlyButton');

const FlyRegister = require('./FlyRegister');
const FlyFindPwd = require('./FlyFindPwd');

const SceneUtils = require('SceneUtils');
const TimerMixin = require('react-timer-mixin');
const FlyTextInput = require('FlyTextInput');
const {Text} = require('FlyText');
const NativeModuleUtils = require('NativeModuleUtils');
const FlyEditableScrollView = require('FlyEditableScrollView');
const dim = FlyDimensions.deviceDim;
const FlyImage = require('FlyImage');
const logo = './imgs/login/logo.png';



type Props = {
    navigator: Navigator;
    toTab?: Tab;
    username?: string;
};

class FlyLoginMainView extends Component {
    props : Props;

    constructor(props) {
        super(props);
        (this : any)._onUsernameChange = this._onUsernameChange.bind(this);
        (this : any)._toTabView = this._toTabView.bind(this);
        (this : any)._goNext = this._goNext.bind(this);
        this.unique_device_id = '';
        this.state = {
          username:props.username,
        }
    }


    _onUsernameChange(text) {
        this.setState({
          username: text,
        });
    }

    componentDidMount(){

      NativeModuleUtils.getUDID((data)=>{
        this.unique_device_id = data;
      });
    }

    _toTabView() {
        const {navigator} = this.props;
        if (navigator.getCurrentRoutes().length == 1) {
            this.refs.loading.close();
            SceneUtils.gotoScene('TAB_VIEW');
        } else {
            this.refs.loading.close();
            SceneUtils.goBack();
        }
    }

    _goNext(){

      if (!Utils.isEmpty(this.state.username)) {
        if (this.state.username.length == 11) {
          this.refs.loading.open();
          let username = this.state.username;
          let promise = this.props.dispatch(checkUserRegister(this.state.username,this.unique_device_id));
          promise.then((data)=>{
            this.refs.loading.close();
            if(data == true){
              SceneUtils.gotoScene('FLY_LOGIN_SECOND_VIEW',{username:username,isReload:this.props.isReload,reloadProps:this.props.reloadProps},'replace');
            }else{
              SceneUtils.gotoScene('FLY_FIND_PWD_OR_REGIST_FIRST',{username:username,type:'register'});
            }
          }).catch((err)=>{
            this.refs.loading.close();
          });
        }else {
          this.refs.loading.close();
          Utils.alert('手机号码格式不正确');
        }
      }else {
        Utils.alert('手机号码不能为空');
      }


    }

    renderUsername() {
      if(Utils.isEmpty(this.state.username) || (this.state.username && this.state.username.length == 11)){
        return (
          <View style={styles.inputGroup}>
              <View style={styles.inputCenter}>
                  <TextInput onChangeText={this._onUsernameChange}
                    ref="username"
                    style={[styles.textInput,{fontSize:FlyDimensions.fontSizeXxl}]}
                    placeholder="请输入手机号"
                    textAlign="center"
                    keyboardType="numeric"
                    clearButtonMode='always'
                    maxLength={11}/>
              </View>
          </View>
        );
      }else {
        return (
          <View style={styles.inputGroup}>
              <View style={styles.inputCenter}>
                  <TextInput onChangeText={this._onUsernameChange}
                    ref="username"
                    style={[styles.textInput1,{fontSize:FlyDimensions.fontSizeH4}]}
                    placeholder="请输入手机号"
                    textAlign="center"
                    keyboardType="numeric"
                    clearButtonMode='always'
                    maxLength={11}/>
              </View>
          </View>
        );
      }
    }

    render() {
        let leftHeaderItem;
        if (this.props.navigator) {
          leftHeaderItem = {
            image:'./imgs/login/close.png',
            imageWidth:18,
            style:{alignItems:'flex-end'},
            onPress:this._toTabView,
          };
        }
        return (
            <View style={FlyStyles.container}>
                <FlyHeader
                    title={'登录/注册'}
                    leftItem={leftHeaderItem}
                    foreground="dark">
                </FlyHeader>
                <FlyEditableScrollView ref={"editScrollView"} contentContainerStyle={styles.main}>
                  <View style={styles.logo}>
                      <FlyImage source={logo} style={styles.logoImg}/>
                  </View>
                  <View style={styles.row}>
                    {this.renderUsername()}
                  </View>

                  <View style={styles.btnWrapper}>
                      <FlyButton
                        text='下一步'
                        onPress={this._goNext}
                        type='base'
                        style={styles.btn} />
                  </View>
                </FlyEditableScrollView>

                <FlyLoading ref="loading" modalStyle={FlyStyles.loadingModal} text="加载中..."/>
            </View>
        )
    }

}

var styles = StyleSheet.create({
    main: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent:'center'
    },
    row: {
        paddingLeft: dim.width * 0.15,
        paddingRight: dim.width * 0.15,
        marginTop:dim.width * 0.1,
        width: FlyDimensions.deviceDim.width
    },
    logo: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:dim.width * 0.3
    },

    inputGroup: {
        flex: 1,
        borderBottomWidth:2,
        borderBottomColor:FlyColors.black,
    },

    inputCenter: {
        flex: 1,

    },
    textInput: {
      height:50,
      marginLeft: 5,
    },
    textInput1: {
      height:51,
      marginLeft: 5,
    },
    btnWrapper: {
      marginTop: dim.width * 0.16
    },
    btn: {
      width: FlyDimensions.deviceDim.width * 0.45,
      borderRadius:30,
      height:44
    },

    bigCardNoText: {
      fontSize: FlyDimensions.fontSizeHuge,
      color:'white'
    },
    logoImg:{
      height:dim.width * 0.25,
      width:dim.width * 0.25,
      borderRadius:30,
    }

});

function select(store) {
    return {
      username: store.user.username
    };
}

module.exports = connect(select)(FlyLoginMainView);
