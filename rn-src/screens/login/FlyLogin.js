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

const FlyRegister = require('./FlyRegister');
const FlyFindPwd = require('./FlyFindPwd');

const SceneUtils = require('SceneUtils');
const TimerMixin = require('react-timer-mixin');
const FlyTextInput = require('FlyTextInput');
const {Text} = require('FlyText');
const NativeModuleUtils = require('NativeModuleUtils');
const FlyEditableScrollView = require('FlyEditableScrollView');


type Props = {
    navigator: Navigator;
    toTab?: Tab;
    username?: string;
};

class FlyLogin extends Component {
    props : Props;

    constructor(props) {
        super(props);

        (this : any)._login = this._login.bind(this);
        (this : any)._toRegister = this._toRegister.bind(this);
        (this : any)._toFindPwd = this._toFindPwd.bind(this);

        (this : any)._clearUsername = this._clearUsername.bind(this);
        (this : any)._onUsernameChange = this._onUsernameChange.bind(this);
        (this : any)._showPassword = this._showPassword.bind(this);
        (this : any)._onPasswordChange = this._onPasswordChange.bind(this);
        (this : any)._checkCanLogin = this._checkCanLogin.bind(this);
        (this : any)._toTabView = this._toTabView.bind(this);
        (this : any)._toReloadView = this._toReloadView.bind(this);
        this.state = {
          showUsernameRemove: false,
          showPasswordEyes: false,
          canLogin: false,
          username: props.username || '',
          password: '',
          isSecureEntry:true,
        };
    }



    _clearUsername() {
        let editScrollView = this.refs.editScrollView;
        let username = editScrollView.getChild("username");
        username.clear();
        this.setState({
          username: '',
          showUsernameRemove: false,
        });
    }

    _onUsernameChange(text) {
        this.setState({
          username: text,
          showUsernameRemove: !Utils.isEmpty(text)
        });
    }

    _showPassword() {
      let isSecureEntry = this.state.isSecureEntry === true?false:true;
      this.setState({isSecureEntry: isSecureEntry});
    }

    _onPasswordChange(text) {
        this.setState({
          password: text,
          showPasswordEyes: !Utils.isEmpty(text)
        });
    }

    _checkCanLogin() {
        if (Utils.isEmpty(this.state.username)) {
            return false;
        }
        if (Utils.isEmpty(this.state.password)) {
            return false;
        }
        return true;
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

    _toReloadView() {
        const {reloadProps} = this.props;
        SceneUtils.gotoScene(reloadProps.type, reloadProps.props, 'replace');
    }

    _login() {
        var _self = this;
        this.refs.loading.open();

        let promise = this.props.dispatch(login(this.state.username, this.state.password));
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

    _resetLogin() {
        let editScrollView = this.refs.editScrollView;
        let password = editScrollView.getChild("password");
        password.clear();
        this.setState({
          password: '',
          showPasswordEyes: false,
        });
    }

    _toRegister() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({type: 'NORMAL', component: FlyRegister});
        }
    }

    _toFindPwd()
    {
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({type: 'NORMAL', component: FlyFindPwd});
        }
    }

    renderUsername() {

      let removeBtn = null;
      if (this.state.showUsernameRemove) {
        removeBtn = (
          <TouchableOpacity onPress={this._clearUsername}>
              <FlyIconfonts name="icon-delete" size={22} color={FlyColors.baseTextColor2}/>
          </TouchableOpacity>
        );
      }

      return (
        <View style={[styles.inputGroup, styles.withBottomBorder]}>
            <View style={styles.inputWrapper}>
                <View style={styles.inputLeft}>
                    <FlyIconfonts name="login-user" size={25} color={FlyColors.baseColor}/>
                </View>
                <View style={styles.inputCenter}>
                    <TextInput onChangeText={this._onUsernameChange}
                      ref="username"
                      style={styles.textInput}
                      placeholder="请输入手机号"
                      underlineColorAndroid="transparent"
                      keyboardType="numeric" />
                </View>
                <View style={styles.inputRight}>
                    {removeBtn}
                </View>
            </View>
        </View>
      );
    }

    renderPassword() {

      let showPwdBtn = null;
      if (this.state.showPasswordEyes) {
        showPwdBtn = (
          <TouchableOpacity onPress={this._showPassword}>
              <FlyIconfonts name="icon-eye" size={22} color={FlyColors.baseTextColor2}/>
          </TouchableOpacity>
        );
      }

      return (
        <View style={styles.inputGroup}>
            <View style={styles.inputWrapper}>
                <View style={styles.inputLeft}>
                    <FlyIconfonts name="login-pwd" size={25} color={FlyColors.baseColor}/>
                </View>
                <View style={styles.inputCenter}>
                    <TextInput onChangeText={this._onPasswordChange}
                      ref="password"
                      style={styles.textInput}
                      placeholder="请输入密码"
                      underlineColorAndroid="transparent"
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

        let leftHeaderItem;
        if (this.props.navigator) {
            leftHeaderItem = {
                layout: "icon",
                icon: "icon-cancel",
                onPress: this._toTabView
            };
        }

        return (
            <View style={FlyStyles.container}>
                <FlyHeader
                    leftItem={leftHeaderItem}
                    foreground="dark">
                </FlyHeader>
                <FlyEditableScrollView ref={"editScrollView"} contentContainerStyle={styles.main}>
                    <View style={styles.logo}>
                        <FlyIconfonts name="icon-logo" size={160} color={FlyColors.baseColor}/>
                    </View>

                    <View style={styles.row}>

                        <View style={styles.inputBorder}>
                            {this.renderUsername()}
                            {this.renderPassword()}
                        </View>

                    </View>

                    <View style={[ styles.row, styles.textWrapper ]}>

                        <TouchableOpacity style={{
                            flex: 1,
                            alignItems: 'flex-start'
                        }} onPress={this._toRegister}>
                            <Text style={styles.text}>现在注册</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{
                            flex: 1,
                            alignItems: 'flex-end'
                        }} onPress={this._toFindPwd}>
                            <Text style={styles.text}>忘记密码?</Text>
                        </TouchableOpacity>

                    </View>

                    <View style={styles.btnWrapper}>
                        <FlyButton
                          text='登录'
                          onPress={this._login}
                          disabled={!this._checkCanLogin()}
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
    container: {
        flex: 1,
        backgroundColor: FlyColors.baseBackgroundColor
    },
    text: {
        color: FlyColors.baseColor
    },
    main: {
        // marginTop: 20,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent:'center'
    },
    row: {
        paddingLeft: 30,
        paddingRight: 30,
        // marginTop:-30,
        width: FlyDimensions.deviceDim.width
    },
    logo: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputBorder: {
        height: 100,
        borderWidth: 1,
        backgroundColor: 'white',
        borderColor: FlyColors.baseBorderColor,
        borderRadius: 5,
        flexDirection: 'column'
    },
    inputGroup: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    withBottomBorder: {
        borderBottomWidth: 1,
        borderColor: FlyColors.baseBorderColor
    },
    inputWrapper: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
    },
    inputLeft: {
        width: 30,
        alignItems: 'flex-start'
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
      marginLeft: 5,

    },

    btnWrapper: {
      marginTop: 40
    },

    btn: {
      width: FlyDimensions.deviceDim.width - 60,
    }

});

function select(store) {
    return {
      username: store.user.username
    };
}

module.exports = connect(select)(FlyLogin);
