import React, {Component} from 'react';
import {
    StyleSheet,
    Navigator,
    View,
    ScrollView,
    TouchableOpacity,
    DeviceEventEmitter,
    InteractionManager,
    Alert,
    Text,
    TouchableWithoutFeedback,
    Keyboard,
    Animated
} from 'react-native';
import {connect} from 'react-redux';
const FlyBase = require('FlyBase');
const TextInput = require('TextInput');
const FlyItem = require('FlyItem');
const FlyStyles = require('FlyStyles');
const FlyHeader = require('FlyHeader');
const FlyColors = require('FlyColors');
const FlyDimensions = require('FlyDimensions');
const FlyBottomButton = require('FlyBottomButton');
const Utils = require('Utils');
const SceneUtils = require('SceneUtils');
const TimerMixin = require('react-timer-mixin');
const FlyLabelItem = require('FlyLabelItem');
const FlyImage = require('FlyImage');
const FlyButton = require('FlyButton');
const {getStatusBarHeight} = require('fly-react-native-app-info');
const {updatePassword} = require('../../actions');

const dim = FlyDimensions.deviceDim;

class MotifyPassWordView extends Component {
    constructor(props) {
        super(props);
        (this: any).commit = this.commit.bind(this);
        (this: any).check = this.check.bind(this);
        this.state = {
          password:'',
          newPassword:'',
          surePassword:''
        }

    }

      commit(){

        if(this.check()){
          let params = {
            newPassword:this.state.newPassword,
            oldPassword:this.state.password
          }
          let promise = this.props.dispatch(updatePassword(params));
          promise.then(
            ()=>{
              Utils.alert('修改成功!');
              SceneUtils.goBack();
            }
          ).catch(
            (err)=>{
              Utils.alert(err.msg || '修改登录密码失败！')
            }
          );
        }

      }
      check(){
        if(Utils.isEmpty(this.state.password)){
          Utils.alert('请输入原密码！');
          return false;
        }
        if(Utils.isEmpty(this.state.newPassword)){
          Utils.alert('请输入新密码！');
          return false;
        }
        if(this.state.newPassword && this.state.newPassword.length <8){
          Utils.alert('密码不能少于8位！');
          return false;
        }
        if(this.state.newPassword !== this.state.surePassword){
          Utils.alert('新密码与重复密码不一致！');
          return false;
        }
        return true;
      }

    render() {
        let leftItem = {
            type: 'back'
        };


        return (
            <View style={FlyStyles.container}>
                <FlyHeader title={'修改登录密码'} leftItem={leftItem} borderBottom={true} />
                <ScrollView style={{backgroundColor:FlyColors.baseTextColor3}}>
                  <FlyLabelItem canEdit={true} labelWidth={70} text="原密码" showSegment={true} style={styles.labelItemW}>
                    <TextInput  style={styles.textInput} placeholder="请输入原密码" maxLength={20} secureTextEntry={true} onChangeText={(text) => this.setState({password: text})}/>
                  </FlyLabelItem>
                  <FlyLabelItem canEdit={true} labelWidth={70} text="新密码:" showSegment={true} style={styles.labelItemW}>
                      <TextInput  style={styles.textInput} placeholder="请输入新密码" maxLength={20} secureTextEntry={true} onChangeText={(text) => this.setState({newPassword: text})}/>
                  </FlyLabelItem>
                  <FlyLabelItem canEdit={true} labelWidth={70} text="重复密码" style={styles.labelItemW}>
                      <TextInput  style={styles.textInput} placeholder="请再次输入新密码" maxLength={20} secureTextEntry={true} onChangeText={(text) => this.setState({surePassword: text})}/>
                  </FlyLabelItem>
                  <View style={styles.btnWrapper}>
                    <FlyButton text={'提交'} type={'base'} style={styles.btn} onPress={()=>this.commit()}/>
                  </View>
                </ScrollView>


            </View>
        );
    }

}

var styles = StyleSheet.create({
  labelItemW:{
      width:dim.width,
  },
  top:{
    position:'absolute',
    width:dim.width,
    height:FlyDimensions.statusBarHeight,
    backgroundColor:FlyColors.baseBackgroundColor,
    elevation:3,
    position:'absolute',
    top:0
  },
  topToast:{
    position:'absolute',
    width:dim.width,
    height:30,
    backgroundColor:FlyColors.red,
    elevation:2
  },
  textInput: {
      flex:5,
      height: 50,
      fontSize: FlyDimensions.fontSizeXl,
      marginTop: 2,
  },
  btn: {
    width: FlyDimensions.deviceDim.width * 0.9,
    height:45
  },
  btnWrapper:{
    alignItems:'center',
    marginTop:FlyDimensions.deviceDim.width * 0.15
  }
})
function select(store) {
    return {};
}
module.exports = connect(select)(MotifyPassWordView);
