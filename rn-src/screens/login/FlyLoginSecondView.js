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
const FlyImage = require('FlyImage');

const FlyRegister = require('./FlyRegister');
const SceneUtils = require('SceneUtils');
const TimerMixin = require('react-timer-mixin');
const FlyTextInput = require('FlyTextInput');
const {Text} = require('FlyText');
const NativeModuleUtils = require('NativeModuleUtils');
const FlyEditableScrollView = require('FlyEditableScrollView');
const dim = FlyDimensions.deviceDim;
const head = './imgs/nav/head.png';
const eye = './imgs/myAssets/eye.png';
const eyeN = './imgs/login/eye.png';


type Props = {
    navigator: Navigator;
    toTab?: Tab;
    username?: string;
};

class FlyLoginSecondView extends Component {
    props : Props;

    constructor(props) {
        super(props);

        (this : any)._login = this._login.bind(this);
        (this : any)._toFindPwd = this._toFindPwd.bind(this);
        (this : any)._onPasswordChange = this._onPasswordChange.bind(this);
        (this : any)._toTabView = this._toTabView.bind(this);
        (this : any)._toReloadView = this._toReloadView.bind(this);

        // 用户定位设备信息
        this.otherInfo = {
          device_token: '',
          unique_device_id: '',
          location: {},
          channel:'',
        };

        this.state = {
          showPasswordEyes: false,
          canLogin: false,
          password: '',
          isSecureEntry:true,
        };
    }

    componentDidMount() {
      let that = this;

      InteractionManager.runAfterInteractions(() => {
        that.initOtherInfo();
      });
    }

    initOtherInfo() {
      NativeModuleUtils.getBundleInfo(bundleInfo=>{
        this.otherInfo.channel = bundleInfo.appChannel;
      });
      NativeModuleUtils.getDeviceToken((data) => {
        this.otherInfo.device_token = data;
      });
      NativeModuleUtils.getUDID((data) => {
        this.otherInfo.unique_device_id = data;
      });
      NativeModuleUtils.getLocation((data) => {
        this.otherInfo.location = data;
      });
    }

    _onPasswordChange(text) {
        this.setState({
          password: text,
          showPasswordEyes: !Utils.isEmpty(text)
        });
    }


    _toTabView() {
        const {navigator} = this.props;
        if (navigator.getCurrentRoutes().length == 3) {
            this.refs.loading.close();
            SceneUtils.gotoScene('TAB_VIEW');
        } else {
            this.refs.loading.close();
            SceneUtils.goBack();
            // navigator.popToRoute(this.props.navigator.getCurrentRoutes()[0])
        }

    }

    _toReloadView() {
        const {reloadProps} = this.props;
        SceneUtils.gotoScene(reloadProps.type, reloadProps.props, 'replace');
    }

    _login() {
      if (Utils.isEmpty(this.state.password)) {
        Utils.alert('请输入密码');
      }else {
        var _self = this;
        this.refs.loading.open();

        let promise = this.props.dispatch(login(this.props.username, this.state.password, this.otherInfo));
        promise.then(function(data){

          DeviceEventEmitter.emit(env.ListenerMap['LOGIN_EVENT']);

          if (_self.props.toTab) {
              _self.props.dispatch(switchTab(_self.props.toTab, _self.props.toTabProps));
          }

          if (_self.props.isReload && _self.props.reloadProps) {
              _self._toReloadView();
          } else {
              _self._toTabView();
          }
        }).catch(function(err){
          _self.refs.loading.close();
          Utils.info('登录错误', err.msg || "登录错误，请重试!");
          _self._resetLogin();
        });
      }
    }

    _resetLogin() {
        let editScrollView = this.refs.editScrollView;
        let password = editScrollView.getChild("password");
        password.clear();
        this.setState({
          password: '',
          showPasswordEyes: false,
        });
    }

    _toFindPwd(){
      SceneUtils.gotoScene('FLY_FIND_PWD_OR_REGIST_FIRST',{username:this.props.username,type:'findPwd'})
    }


    renderPassword() {
      let showPwdBtn = null;
      let isSecureEntry = this.state.isSecureEntry;
      let imgUrl = isSecureEntry ? eyeN : eye;
      showPwdBtn = (
        <TouchableOpacity style={{padding:5}} onPress={()=>this.setState({isSecureEntry:!isSecureEntry})}>
            <FlyImage source={imgUrl} width={20}/>
        </TouchableOpacity>
      );

      return (
        <View style={styles.inputGroup}>
            <View style={styles.inputWrapper}>
                <View style={styles.inputCenter}>
                    <TextInput onChangeText={this._onPasswordChange}
                      ref="password"
                      style={styles.textInput}
                      keyboardType={"ascii-capable"}
                      textAlign="center"
                      placeholder="请输入密码"
                      secureTextEntry={this.state.isSecureEntry} />
                </View>
                <View style={styles.inputRight}>
                    {showPwdBtn}
                </View>
            </View>
        </View>
      );
    }

    render() {
        let leftItem = {
          type:'back'
        };

        return (
            <View style={FlyStyles.container}>
                <FlyHeader leftItem={leftItem} title={'登录'}/>
                <FlyEditableScrollView ref={"editScrollView"} contentContainerStyle={styles.main}>
                    <View style={styles.logo}>
                        <FlyImage source={head} style={styles.logoImg}/>
                        <Text style={{fontSize:FlyDimensions.fontSizeXl,marginTop:-5,color:FlyColors.baseTextColor2}}>{Utils.hideFour(this.props.username)}</Text>
                    </View>

                    <View style={styles.row}>
                      {this.renderPassword()}
                      <View style={{backgroundColor:'black',height:2,width:FlyDimensions.deviceDim.width * 0.7}}>
                      </View>
                    </View>

                    <View style={[ styles.row, styles.textWrapper ]}>

                        <View style={{flex: 1,alignItems: 'flex-start'}}>
                            <Text></Text>
                        </View>

                        <TouchableOpacity style={{
                            flex: 1,
                            alignItems: 'flex-end'
                        }} onPress={this._toFindPwd}>
                            <Text style={styles.findPwd}>忘记密码?</Text>
                        </TouchableOpacity>

                    </View>

                    <View style={styles.btnWrapper}>
                        <FlyButton
                          text='登录'
                          onPress={this._login}
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

    findPwd: {
        color: FlyColors.baseColor,
        // fontSize:FlyDimensions.normalize
    },
    main: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent:'center'
    },
    row: {
        paddingLeft: dim.width * 0.15,
        paddingRight: dim.width * 0.15,
        marginTop:dim.width * 0.05,
        width: FlyDimensions.deviceDim.width
    },
    logo: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:dim.width * 0.3
    },
    inputGroup: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    inputWrapper: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
    },

    inputCenter: {
        flex: 1,
        alignItems: 'center'
    },
    inputRight: {
        width: 30,
        alignItems: 'flex-end',
    },
    textWrapper: {
        flexDirection: 'row',
        marginTop: 15,
    },
    textInput: {
      height:50,
      fontSize: FlyDimensions.fontSizeXxl,
      marginLeft: dim.width * 0.1,
    },
    btnWrapper: {
      marginTop: dim.width * 0.09
    },
    btn: {
      width: FlyDimensions.deviceDim.width * 0.45,
      borderRadius:30,
      height:44
    },
    logoImg:{
      height:dim.width * 0.25,
      width:dim.width * 0.25,
      borderRadius:30,
    }

});

function select(store) {
    return {
    };
}

module.exports = connect(select)(FlyLoginSecondView);
