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
    sendAuthCode,
    findPasswordCode,
    validateAuthCode,
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
const FlyFindPwd = require('./FlyFindPwd');
const {getMD5str} = require('fly-react-native-app-info');
const SceneUtils = require('SceneUtils');
const TimerMixin = require('react-timer-mixin');
const FlyTextInput = require('FlyTextInput');
const {Text} = require('FlyText');
const NativeModuleUtils = require('NativeModuleUtils');
const FlyEditableScrollView = require('FlyEditableScrollView');
const dim = FlyDimensions.deviceDim;
const FlyTimerButton = require('FlyTimerButton');
const head = './imgs/nav/head.png';

type Props = {
    navigator: Navigator;
    toTab?: Tab;
    username?: string;
};

class FlyFindPwdOrRegistFirst extends Component {
    props : Props;

    constructor(props) {
        super(props);
        (this : any)._onPasswordChange = this._onPasswordChange.bind(this);
        (this : any).getAuthCode = this.getAuthCode.bind(this);


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
          authCode: '',
          isSecureEntry:true,
        };
    }

    componentDidMount() {

    }


    _onPasswordChange(text) {
        this.setState({
          authCode: text,
          showPasswordEyes: !Utils.isEmpty(text)
        });
        if (text && text.length == 6) {
           let promise = this.props.dispatch(validateAuthCode(text,this.props.username));
           promise.then((data)=>{
             if (this.props.type == 'register'){
               SceneUtils.gotoScene('FLY_REGISTER',{username:this.props.username});
             }else {
               SceneUtils.gotoScene('FLY_FIND_PWD',{username:this.props.username})
             }
           }).catch((err)=>{
             Utils.alert(err.msg || '服务器繁忙')
           });
        }
    }

    getAuthCode(){
      if (this.props.type == 'register') {

       var timestamp3 = new Date().getTime();
      let secret = env.CodeEncryption;
      let md5_str =this.props.username+timestamp3+secret;
      getMD5str({md5_str:md5_str},(respone)=>{
        let params = {
                phone: this.props.username,
                signature:respone,
                timestamp:timestamp3,
        }
       let promise = this.props.dispatch(sendAuthCode(params));
      promise.then((data) => {
          this.refs.timer.start(true);
      }).catch((err) => {
        Utils.alert(err.msg || '请重新获取验证码')
      });
      })
      }else{
        let promise = this.props.dispatch(findPasswordCode(this.props.username));
        promise.then((data)=>{
          this.refs.timer.start(true);
        }).catch((err)=>{
          Utils.alert(err.msg || '请重新获取验证码')
        });
      }

    }


    renderPassword() {
      return (
        <View style={styles.inputGroup}>
          <View style={styles.inputCenter}>
              <TextInput onChangeText={this._onPasswordChange}
                ref="authCode"
                caretHidden={true}
                maxLength={6}
                keyboardType={"numeric"}
                style={styles.textInput}
                secureTextEntry={this.state.isSecureEntry} />
          </View>
        </View>
      );
    }

    _renderPwd(){
      let authCode = this.state.authCode;
      let authcItem = [];
      for (var i = 0; i < 6; i++) {
        authcItem.push(
          <View key={i} style={{paddingLeft:6,paddingRight:6}}>
            <View style={{borderBottomWidth:2,height:35,width:25}}>
              <Text style={{fontSize:FlyDimensions.fontSizeH1,textAlign:'center'}}>{authCode[i]}
              </Text>
            </View>
          </View>
        )
      }
      return authcItem;
    }

    render() {
        let leftItem = {
          type:'back'
        };
        let title = (this.props.type == 'register') ? '注册' : '忘记密码';
        return (
            <View style={FlyStyles.container}>
                <FlyHeader leftItem={leftItem} title={title}/>
                <FlyEditableScrollView ref={"editScrollView"} contentContainerStyle={styles.main}>
                    <View style={styles.logo}>
                        <FlyImage source={head} style={styles.logoImg}/>
                        <Text style={{fontSize:FlyDimensions.fontSizeXl,marginTop:-5,color:FlyColors.baseTextColor2}}>{Utils.hideFour(this.props.username)}</Text>
                    </View>

                    <View style={styles.row}>
                      <View style={{flexDirection:'row',justifyContent:'center'}}>
                        {this._renderPwd()}
                      </View>
                      {this.renderPassword()}
                    </View>
                    <FlyTimerButton ref="timer" startSelf={true} details={'重新获取'} countdown={60} type={'gray'} text="获取验证码" style={styles.btnWrapper} onPress={() => this.getAuthCode()}/>

                </FlyEditableScrollView>
                <FlyLoading ref="loading" modalStyle={FlyStyles.loadingModal} text="加载中..."/>
            </View>
        )
    }

}

var styles = StyleSheet.create({

    text: {
        color: FlyColors.baseColor
    },
    main: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent:'center'
    },
    row: {
        paddingLeft: 30,
        paddingRight: 30,
        marginTop:dim.width * 0.09,
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
        alignItems: 'center',
        marginTop:-dim.width * 0.1
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
      fontSize: 1,
      color:'white',
      backgroundColor:'rgba(0,0,0,0)',
      marginLeft:dim.width * 0.1,
      width:dim.width * 0.65,
    },
    btnWrapper: {
      marginTop: dim.width * 0.1,
      width:dim.width * 0.4,
      backgroundColor:'white'
    },
    btn: {
      fontSize:FlyDimensions.fontSizeXxl,
      color:FlyColors.baseColor
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

module.exports = connect(select)(FlyFindPwdOrRegistFirst);
