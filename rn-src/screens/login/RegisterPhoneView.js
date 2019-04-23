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
    WebView
} from 'react-native';

import {connect} from 'react-redux';

const Utils = require('Utils');

const FlyStyles = require('FlyStyles');
const FlyColors = require('FlyColors');
const FlyIconfonts = require('FlyIconfonts');
const FlyDimensions = require('FlyDimensions');
const FlyHeader = require('FlyHeader');
const FlyLoading = require('FlyLoading');
const FlyButton = require('FlyButton');
const FlyImage = require('FlyImage');
const FlyModalBox = require('FlyModalBox');
const FlyRegister = require('./FlyRegister');
const FlyFindPwd = require('./FlyFindPwd');
const env = require('env');
const SceneUtils = require('SceneUtils');
const TimerMixin = require('react-timer-mixin');
const FlyTextInput = require('FlyTextInput');
const {Text} = require('FlyText');
const NativeModuleUtils = require('NativeModuleUtils');
const FlyEditableScrollView = require('FlyEditableScrollView');
const agreeH = './imgs/login/agree.png';
const agreeN = './imgs/login/combinedShape.png';
const dim = FlyDimensions.deviceDim
const {checkUserRegister,registeredAgreement} = require('../../actions');

type Props = {
    navigator: Navigator;
    type: String; // 'RPH_back' 启动返回动画
};

class RegisterPhoneView extends Component {
    props : Props;

    constructor(props) {
        super(props);

        (this: any).gotoScene = this.gotoScene.bind(this);

        this.unique_device_id='';
        this.lock = true;

        this.state = {
          fadeAnim: new Animated.Value(0),
          progress: true,
          openPH:false,
          RPH_title: new Animated.Value(0),
          RPH_text: new Animated.Value(0),
          RPH_phone: null,
          agree:true,
          html:''
        };
    }

    componentDidMount() {
      if (this.props.type == 'RPH_back') {
        TimerMixin.setTimeout(()=>{
          Animated.timing(
            this.state.fadeAnim,//初始值
            {
              toValue: -20,
              duration: 200,
            }//结束值
          ).start();
          Animated.timing(
            this.state.RPH_text,//初始值
            {
              toValue: FlyDimensions.deviceDim.width,
              duration: 300,
            }//结束值
          ).start();
        }, 100);
      }else {
        TimerMixin.setTimeout(()=>{
          Animated.timing(
            this.state.RPH_title,//初始值
            {
              toValue: -FlyDimensions.deviceDim.width,
              duration: 300,
            }//结束值
          ).start();
          Animated.timing(
            this.state.RPH_text,//初始值
            {
              toValue: -FlyDimensions.deviceDim.width,
              duration: 300,
            }//结束值
          ).start();
        }, 100);
      }

      NativeModuleUtils.getUDID((data)=>{
        this.unique_device_id = data;
      });
        let promise = this.props.dispatch(registeredAgreement({type:'invest_register'}));
        promise.then((data)=>{
           this.setState({
            html:data
           })
        })

      this.keyboardWillShow=DeviceEventEmitter.addListener('keyboardWillShow',()=>this.keyOpen());
      this.keyboardWillHide=DeviceEventEmitter.addListener('keyboardWillHide',()=>this.keyClose());
    }

    componentWillUnmount() {
      if (this.keyboardWillShow) {
        this.keyboardWillShow.remove();
      }
      if (this.keyboardWillHide) {
        this.keyboardWillHide.remove();
      }
    }

    keyOpen() {
      this.setState({
        openPH: this.refs.editable.refs.idx_0.isFocused(),
      })
    }

    keyClose() {
      this.setState({
        openPH: this.refs.editable.refs.idx_0.isFocused(),
      })
    }

    gotoScene(type) {
        Animated.timing(
          this.state.RPH_title,//初始值
          {
            toValue: FlyDimensions.deviceDim.width,
            duration: 0,
          }//结束值
        ).start();
        Animated.timing(
          this.state.RPH_text,//初始值
          {
            toValue: FlyDimensions.deviceDim.width,
            duration: 0,
          }//结束值
        ).start();
        this.props.gotoScene(type,'LG_back')
    }

    checkBtn() {
      if (Utils.isEmpty(this.state.RPH_phone)) {
        return false;
      }
      if (this.state.RPH_phone.length < 11) {
        return false;
      }
      if (!this.state.agree) {
        return false;
      }
      return true;
    }

    checkPhone() {
      if (this.lock) {
        this.lock = false;
        this.refs.loading.open();
        if (Utils.checkMobile(this.state.RPH_phone)) {
          let promise = this.props.dispatch(checkUserRegister(this.state.RPH_phone,this.unique_device_id));
          promise.then((data)=>{
            this.lock = true;
            if(data == true){
              this.refs.loading.close();
              Utils.alert('该账号已注册，请直接进行登录!');
            }else{
              this.props.gotoScene('register-code',null,{registerPhone: this.state.RPH_phone})
            }
          }).catch((err)=>{
            this.lock = true;
            this.refs.loading.close();
            Utils.alert('服务器繁忙！请重试');
          });
        }else {
          this.lock = true;
          this.refs.loading.close();
          Utils.alert('手机号码格式不正确');
        }
      }
    }

  renderModal(){
    let leftItem = {
      type:'back',
      onPress:()=>{
        this.refs.xiyi.close()
      }
    };
       return(
      <FlyModalBox ref={'xiyi'} style={{width:dim.width,height:dim.height}}>
           <FlyHeader title={'注册协议'} borderBottom={true} leftItem={leftItem} />
          <WebView
          style={{padding:15}}
          source={{html:Utils.htmlDecode(this.state.html)}}
          />

      </FlyModalBox>
    )

  }
    render() {
      let margin = (this.props.type == 'RPH_back') ? (-FlyDimensions.deviceDim.width + 15) : (FlyDimensions.deviceDim.width + 15);
      let marginTitle = (this.props.type == 'RPH_back') ? 15 : (FlyDimensions.deviceDim.width + 15);
      let marginBtn = (this.props.type == 'RPH_back') ? (-FlyDimensions.deviceDim.width + 15) : (FlyDimensions.deviceDim.width -30);
      let phoneColor = (this.state.openPH) ? FlyColors.baseColor : '#DDDDDD';

      let agreeImg = this.state.agree == true ? agreeH : agreeN;
      return (
        <View style={styles.shareWrapper}>
          <Animated.View style={[{transform:[{translateX:this.state.RPH_title}]},{marginTop: 30,marginLeft: marginTitle,marginRight: 15,flexDirection: 'row',alignItems: 'center',width: FlyDimensions.deviceDim.width - 30}]}>
            <TouchableOpacity style={{flex: 1}} onPress={() => this.gotoScene('login')}>
              <FlyIconfonts name={'icon-right-arrow-m'} size={25} color={FlyColors.baseTextColor4}/>
            </TouchableOpacity>
            <View style={{flex: 9,alignItems: 'center',justifyContent: 'flex-end',flexDirection: 'row'}}>
              <View style={{height: 5,backgroundColor: '#CCCCCC',width: 20}}>
                {(this.props.type == 'RPH_back') ? (
                  <Animated.View style={{backgroundColor:FlyColors.baseColor,height:5,transform:[{translateX:this.state.fadeAnim}]}}>
                  </Animated.View>
                ) : null}
              </View>
              <View style={{width: 30,height: 30,borderRadius: 15,backgroundColor: '#CCCCCC',justifyContent: 'center',alignItems: 'center'}}>
                <Text style={{backgroundColor: 'rgba(0,0,0,0)',fontSize: FlyDimensions.fontSizeXxxl,color: FlyColors.white,fontWeight: 'bold'}}>2</Text>
              </View>
              <View style={{height: 5,backgroundColor: '#CCCCCC',width: 20}}>
              </View>
              <View style={{width: 30,height: 30,borderRadius: 15,backgroundColor: '#CCCCCC',justifyContent: 'center',alignItems: 'center'}}>
                <Text style={{backgroundColor: 'rgba(0,0,0,0)',fontSize: FlyDimensions.fontSizeXxxl,color: FlyColors.white,fontWeight: 'bold'}}>3</Text>
              </View>
              <View style={{height: 5,backgroundColor: '#CCCCCC',width: 20}}>
              </View>
              <View style={{width: 90,height: 30,borderRadius: 15,backgroundColor: '#CCCCCC',justifyContent: 'center',alignItems: 'center'}}>
                <Text style={{backgroundColor: 'rgba(0,0,0,0)',fontSize: FlyDimensions.fontSizeXl,color: FlyColors.white,fontWeight: 'bold'}}>1888红包</Text>
              </View>
              <FlyImage source={'./imgs/login/Oval2.png'} resizeMode={'stretch'} style={{width: 30,height: 30,justifyContent: 'center',alignItems: 'center',position: 'absolute',right: 210}}>
                <Text style={{fontSize: FlyDimensions.fontSizeXxxl,color: FlyColors.white,fontWeight: 'bold'}}>1</Text>
              </FlyImage>
            </View>
          </Animated.View>
          <FlyEditableScrollView ref={'editable'} AnimationClose={false} scrollEnabled={false}>
            <Animated.View style={[{transform:[{translateX:this.state.RPH_text}]},{marginTop: 10,marginLeft: margin,marginRight: 15}]}>
              <View style={{marginTop: 35,width: FlyDimensions.deviceDim.width}}>
                <Text style={{fontSize: FlyDimensions.fontSizeH0}}>请输入您的手机号码</Text>
              </View>
              <View style={{width: FlyDimensions.deviceDim.width-30,marginTop: 50,alignItems: 'center',flexDirection: 'row',borderBottomWidth: 1,borderBottomColor: phoneColor,paddingBottom: 10,flex: 1}}>
                <FlyIconfonts name={'icon-invite'} size={20} color={FlyColors.baseTextColor4} style={{marginRight: 10}}/>
                <TextInput
                  style={[{width: FlyDimensions.deviceDim.width - 70,height: 30},(this.state.openPH) ? {fontSize: 24} : null]}
                  placeholder="手机号码"
                  placeholderTextColor={'#CCCCCC'}
                  maxLength={11}
                  clearButtonMode={'while-editing'}
                  keyboardType={'number-pad'}
                  onChangeText={(text) => this.setState({RPH_phone: text})}/>
              </View>
              <View style={{alignItems: 'center',marginTop: 50,height: 50}}>
                <FlyButton text={'下一步'} onPress={() => this.checkPhone()} disabled={!this.checkBtn()} style={[styles.btn,{marginLeft: marginBtn},(!this.checkBtn()) ? {backgroundColor: '#FAC6A7'} : {backgroundColor: FlyColors.baseColor}]}
                  size={'sm'} type={'self'} textColor={FlyColors.white}/>
              </View>
              <View style={{marginTop:10,width:dim.width,flexDirection:'row',alignItems:'center'}}>
                <TouchableOpacity style={[styles.agree]} onPress={()=>{this.setState({agree:!this.state.agree})}} activeOpacity={1}>
                  <FlyImage source={agreeImg} width={15}/>
                </TouchableOpacity>
                 <TouchableOpacity onPress={()=>{
                  this.refs.xiyi.open()
                                     //   SceneUtils.gotoScene('PROFILE_WEB_VIEW',{title:'注册协议',html:this.state.html})
                }}>
                  <Text style={styles.agreeTitle}>注册并同意通通理网站注册协议 </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </FlyEditableScrollView>
          <FlyLoading ref="loading" modalStyle={FlyStyles.loadingModal} text="加载中..."/>
          {this.renderModal()}
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
  agree:{

  },
  agreeTitle:{
    fontSize:FlyDimensions.fontSizeBase,
    marginLeft:5
  }
});

function select(store) {
    return {

    };
}

module.exports = connect(select)(RegisterPhoneView);
