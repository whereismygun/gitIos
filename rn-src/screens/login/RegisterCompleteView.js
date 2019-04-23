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
    Animated,
    InteractionManager,
    DeviceEventEmitter,
} from 'react-native';

import {connect} from 'react-redux';

const Utils = require('Utils');

const FlyStyles = require('FlyStyles');
const FlyColors = require('FlyColors');
const FlyIconfonts = require('FlyIconfonts');
const FlyDimensions = require('FlyDimensions');
const FlyHeader = require('FlyHeader');
const FlyLoading = require('FlyLoading');
const FlyTimerButton = require('FlyTimerButton');
const FlyButton = require('FlyButton');
const FlyImage = require('FlyImage');
const FlyRegister = require('./FlyRegister');
const FlyFindPwd = require('./FlyFindPwd');
const env = require('env');
const SceneUtils = require('SceneUtils');
const TimerMixin = require('react-timer-mixin');
const FlyTextInput = require('FlyTextInput');
const {Text} = require('FlyText');
const NativeModuleUtils = require('NativeModuleUtils');
const FlyEditableScrollView = require('FlyEditableScrollView');

const {login} = require('../../actions');

type Props = {
    navigator: Navigator;
};

class RegisterCompleteView extends Component {
    props : Props;

    constructor(props) {
        super(props);

        (this: any)._login = this._login.bind(this);

        this.lock = true;

        this.state = {
          fadeAnim: new Animated.Value(0),
          RC_View: new Animated.Value(0),
          finish: false,
        };
    }

    componentDidMount() {
      TimerMixin.setTimeout(()=>{
        Animated.timing(
          this.state.fadeAnim,//初始值
          {
            toValue: 20,
            duration: 300,
          }//结束值
        ).start();
        Animated.timing(
          this.state.RC_View,//初始值
          {
            toValue: - FlyDimensions.deviceDim.width,
            duration: 300,
          }//结束值
        ).start();
      }, 100);
      TimerMixin.setTimeout(()=>{
        this.setState({
          finish: true,
        })
      }, 400);
    }


    _login() {
      if (this.lock) {
        this.lock = false;
        this.refs.loading.open();
        let promise = this.props.dispatch(login(this.props.registerPhone, this.props.registerPass));
        promise.then((data) => {
          this.lock = true;
          this.refs.loading.close();
          SceneUtils.gotoScene('TAB_VIEW::');
          DeviceEventEmitter.emit(env.ListenerMap['LOGIN_EVENT']);
          DeviceEventEmitter.emit(env.ListenerMap['GUIDE_MODAL']);
          this.props.closeModal()
        }).catch((error) => {
          this.lock = true;
          this.refs.loading.close();
          Utils.alert(error.msg || "登录错误，请重试!");
        })
      }
    }

    render() {
      let phoneColor = (this.state.openPH) ? FlyColors.baseColor : '#DDDDDD';

      return (
        <View style={styles.shareWrapper}>
          <View style={{marginTop: 30,marginLeft: 15,marginRight: 15,flexDirection: 'row',alignItems: 'center',width: FlyDimensions.deviceDim.width - 30}}>
            <View style={{flex: 1,alignItems: 'center',justifyContent: 'flex-end',flexDirection: 'row'}}>
              <FlyImage source={'./imgs/login/Oval2.png'} resizeMode={'stretch'} style={{width: 30,height: 30,justifyContent: 'center',alignItems: 'center'}}>
                <Text style={{backgroundColor: 'rgba(0,0,0,0)',fontSize: FlyDimensions.fontSizeXxxl,color: FlyColors.white,fontWeight: 'bold'}}>1</Text>
              </FlyImage>
              <View style={{height: 5,backgroundColor: FlyColors.baseColor,width: 20}}>
              </View>
              <FlyImage source={'./imgs/login/Oval2.png'} resizeMode={'stretch'} style={{width: 30,height: 30,justifyContent: 'center',alignItems: 'center'}}>
                <Text style={{backgroundColor: 'rgba(0,0,0,0)',fontSize: FlyDimensions.fontSizeXxxl,color: FlyColors.white,fontWeight: 'bold'}}>2</Text>
              </FlyImage>
              <View style={{height: 5,backgroundColor: FlyColors.baseColor,width: 20}}>
              </View>
              <FlyImage source={'./imgs/login/Oval2.png'} resizeMode={'stretch'} style={{width: 30,height: 30,justifyContent: 'center',alignItems: 'center'}}>
                <Text style={{backgroundColor: 'rgba(0,0,0,0)',fontSize: FlyDimensions.fontSizeXxxl,color: FlyColors.white,fontWeight: 'bold'}}>3</Text>
              </FlyImage>
              <View style={{height: 5,backgroundColor: FlyColors.baseColor,width: 20}}>
                <Animated.View style={{backgroundColor:'#CCCCCC',height:5,transform:[{translateX:this.state.fadeAnim}]}}>
                </Animated.View>
              </View>
              {(this.state.finish) ? (
                <FlyImage source={'./imgs/login/finish.png'} style={{width: 90,height: 30,borderRadius: 15,justifyContent: 'center',alignItems: 'center'}}>
                  <Text style={{fontSize: FlyDimensions.fontSizeXxl,color: FlyColors.white,fontWeight: 'bold'}}>1888红包</Text>
                </FlyImage>
              ) : (
                <View style={{width: 90,height: 30,borderRadius: 15,backgroundColor: '#CCCCCC',justifyContent: 'center',alignItems: 'center'}}>
                  <Text style={{fontSize: FlyDimensions.fontSizeXxl,color: FlyColors.white,fontWeight: 'bold'}}>1888红包</Text>
                </View>
              )}
            </View>
          </View>
          <Animated.View style={[{transform:[{translateX:this.state.RC_View}]},{marginTop: 50,marginLeft: FlyDimensions.deviceDim.width + 15,marginRight: 15,width: FlyDimensions.deviceDim.width - 30}]}>
            <View style={{alignItems: 'center'}}>
              <FlyImage source={'./imgs/login/RedEnvelope.png'} width={FlyDimensions.deviceDim.width * 0.8}/>
            </View>
            <View style={{alignItems: 'center',marginTop: 20}}>
              <Text style={{fontSize: FlyDimensions.fontSizeXxl}}>恭喜您获得1888元红包</Text>
              <Text style={{marginTop: 10,fontSize: FlyDimensions.fontSizeXxl}}>请在<Text style={{color: FlyColors.baseColor}}>【我的优惠】</Text>中查看</Text>
            </View>
            <View style={{alignItems: 'center',marginTop: 50,flex: 1}}>
              <FlyButton text={'注册完成'} onPress={() => this._login()} style={styles.btn} size={'sm'} type={'self'} textColor={FlyColors.white}/>
            </View>
          </Animated.View>
          <FlyLoading ref="loading" modalStyle={FlyStyles.loadingModal} text="加载中..."/>
        </View>
      )
    }

}

var styles = StyleSheet.create({
  shareWrapper: {
    flex: 1,
    flexDirection: 'column',
  },
  btn: {
    width: FlyDimensions.deviceDim.width - 30,
    borderRadius: 25,
    height: 50,
    backgroundColor: FlyColors.baseColor
  },
  timerBtn: {
    borderRadius: 3,
    height: 41,
    width: 80,
    marginLeft: 2
  },
});

function select(store) {
    return {

    };
}

module.exports = connect(select)(RegisterCompleteView);
