/**
 *
 *
 * @flow
 *
 */
'use strict';
import React, {Component} from 'react';
import ReactNative, {
  StyleSheet,
  View,
  ListView,
  Animated,
  Navigator,
  TouchableOpacity,
  InteractionManager,
  DeviceEventEmitter,
  ScrollView,
  NativeAppEventEmitter,
  TextInput,
  Easing

} from 'react-native';

const {connect} = require('react-redux');
const {showIdRecognition} = require('fly-react-native-id-recognition')

const TimerMixin = require('react-timer-mixin');
const DXRefreshControl = require('DXRefreshControl');

const FlyBase = require('FlyBase');
const FlyColors = require('FlyColors');
const FlyStyles = require('FlyStyles');
const FlyDimensions = require('FlyDimensions');
const FlyImage = require('FlyImage');
const SceneUtils = require('SceneUtils');
const env = require('env');
const FlyHeader = require('FlyHeader');
const {getUserInfo,deliverImageToMT} = require('../../actions');
const NativeModuleUtils = require('NativeModuleUtils');
const FlyModalBox = require('FlyModalBox');
const close = './imgs/base/close.png';
const updateBg = "./imgs/base/updateBg.png";
const NetworkService = require('NetworkService');
const Utils = require('Utils');
const {Text} = require('FlyText');
const LISTVIEWREF = 'listview';
const FlyTextInput = require('FlyTextInput');
const FlyEditableScrollView = require('FlyEditableScrollView');
const FlyButton = require('FlyButton');
const FlyLoading = require('FlyLoading');
const  FlyItem = require('FlyItem');
const FlyLabelItem = require('FlyLabelItem');
const dim = FlyDimensions.deviceDim
const backBg = './imgs/personCenter/backBg.png'
const fontBg = './imgs/personCenter/fontBg.png'
const tip = './imgs/capitalRecord/tip.png'


type Props = {
  navigator: Navigator;
};

class PersonalIdReader extends React.Component {
  props: Props;

  constructor(props) {
    super(props);

    this.state = {
      name: null,
      idNumber: this.props.idNumber,
      topImg:this.props.topImg,
      bottomImg:this.props.bottomImg,
      FontInfo:null,
      BackInfo:null,
      Animated_progress: new Animated.Value(0),
      progress_number:0,
      Animated_loaed:false
    }
  }
  
  componentDidMount(){
      this.subscription = NativeAppEventEmitter.addListener('loading',(response)=>{
      this.refs.loade.open()
      });
      this.state.Animated_progress.addListener((state) => {
        let percentage = parseInt((state.value/250)*100);
        this.setState({
          progress_number:percentage
        })
        });
}

   renderProcessModule(){
     return(
        <FlyModalBox ref={'process'} style={styles.moduleStyle}>
           <View style={{flex:1}}>
               <Text style={{alignSelf:'center',marginTop:50}}>正在上传身份证信息,请稍等</Text>
              <Animated.View style={[styles.AnimatedStyle,{width:this.state.Animated_progress}]}>
                    <FlyImage style={{position:"absolute",top:-30,right:-20,alignItems:'center'}} source={tip} width={45}>
                       <Text style={{backgroundColor:'transparent',color:'white',marginTop:2}}>{this.state.progress_number}%</Text>
                    </FlyImage>
              </Animated.View>
           </View>
        </FlyModalBox>
      );

   }

     DidFinsh(){
     if (this.state.bottomImg && this.state.topImg) {
       if (!Utils.checkID(this.state.idNumber)) {
         Utils.alert('亲，你输入的身份证号格式错误，请重新输入！');
       }else{
          if (this.props.reback) {
           this.Listene = DeviceEventEmitter.emit(env.ListenerMap['PERSONAL_ID_ENTIFY_VIEW'],{reback:true,cardInfo:[this.state.idNumber,this.state.topImg,this.state.bottomImg]});
          }else{
           this.Listene= DeviceEventEmitter.emit(env.ListenerMap['PERSONAL_ID_ENTIFY_VIEW'],{reback:false,info:[this.state.FontInfo,this.state.BackInfo],cardInfo:[this.state.idNumber,this.state.topImg,this.state.bottomImg]});
          }
           let promise = this.props.dispatch(deliverImageToMT())
           this.refs.process.open() 
          
           promise.then((data) => {
              this.startAnimation() 
        
           }).catch((err) => {
              Utils.alert(err.msg || '服务繁忙,请稍后再试')
           })
       }
      }else{
        Utils.alert('请补全身份证照片');
      }
  
     }
     componentWillUnmount(){  
      this.subscription.remove();
     }

     startAnimation(){

        Animated.timing(this.state.Animated_progress, {
          toValue: 250,
          duration: 3000,
          easing: Easing.linear,// 线性的渐变函数
         }).start(()=>{
           Utils.info('提示','亲,您的身份证信息已提交成功!',()=>{SceneUtils.goBack()})
         });
     }

  render() {

    let leftItem = {
      type:"back"
    };
      let idCard = this.state.idNumber?this.state.idNumber:'';
      let fontimg,backimg;
      let idCardContarin=null;  
      fontimg = this.state.topImg ? this.state.topImg : fontBg;
      backimg = this.state.bottomImg ? this.state.bottomImg : backBg;
       idCardContarin= (
        <View style={{justifyContent:'center',alignItems:'center'}}>
          <Text style={{marginTop:20,color:'green'}}>请核对身份证号码</Text>
          <View style={{flexDirection:'row',width:dim.width*0.8,marginTop:10,padding:10,backgroundColor:FlyColors.baseBackgroundColor,justifyContent:'center',alignItems:'center'}}>
           <TextInput />    
            <TextInput ref={(textInput) => {this.textInput = textInput}}
                       style={{width:200,height:15}}    
                       defaultValue={idCard}
                       onChangeText={(text)=>this.setState({idNumber:text})}
                      />
            <Text style={{color:FlyColors.baseColor}}>修改</Text>
           </View>
         </View>
        )
     
    return (
      <View style={FlyStyles.container}>
        <FlyHeader title={'实名认证'} leftItem={leftItem} borderBottom={true} />
           <FlyEditableScrollView contentContainerStyle={styles.main} keyboardShouldPersistTaps={true}>
              <TouchableOpacity onPress={()=>{showIdRecognition({photoType:'ID_FRONT'},(response)=>{
              this.refs.loade.close()
              if (response.info.kOpenSDKCardResultTypeCardType == 0) {

              this.setState({
              topImg:response.image,
              FontInfo:response.info,
              idNumber:response.info.kOpenSDKCardResultTypeCardItemInfo.kCardItem0
            })

           }else{
             Utils.alert('请上传身份证正面照片');
           }
         })}}>
            <FlyImage  source={fontimg} style={{width:dim.width*0.9,height:dim.height*0.3,resizeMode:'contain',marginTop:20}} />
            </TouchableOpacity>
           <TouchableOpacity onPress={()=>{showIdRecognition({photoType:'ID_BACK'},(response)=>{
           this.refs.loade.close()
           if (response.info.kOpenSDKCardResultTypeCardType == 2) {
                 this.setState({
                 bottomImg:response.image,
                 BackInfo:response.info
              })
           }else{
              Utils.alert('请上传身份证背面照片');
           }     
        })}}>
           <FlyImage source={backimg} style={{width:dim.width*0.9,height:dim.height*0.3,resizeMode:'contain',marginTop:20}} />
          </TouchableOpacity>
            {idCardContarin}
          <TouchableOpacity style={{backgroundColor:FlyColors.baseColor,marginTop:20,paddingTop:10,paddingBottom:10,paddingRight:80,paddingLeft:80,borderRadius:20}} onPress={()=>this.DidFinsh()}>
              <Text style={{color:'white'}}>完成</Text>
           </TouchableOpacity>
        </FlyEditableScrollView>
        {this.renderProcessModule()}
         <FlyLoading ref={'loade'} text={'正在加载'} />     
      </View>
    )
  }




}



var styles = StyleSheet.create({
  btnWrapper:{
    alignItems:'center',
    marginTop:FlyDimensions.deviceDim.width * 0.2
  },
  btn: {
    width: FlyDimensions.deviceDim.width * 0.9,
    height:44
  },
  username:{
    flexDirection:'row',
    alignItems:"center",
    height:50
  },
  otherName:{
    fontSize:FlyDimensions.fontSizeLarge,
    marginLeft:5,
    color:'#666666'
  },
  main: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent:'center'
    },
    AnimatedStyle:{
      borderRadius:10,
      marginLeft:25,
      marginRight:25,
      height:20,
      backgroundColor:FlyColors.baseColor,
      marginTop:40
    },
    moduleStyle:{
      justifyContent:'center',
      width:300,
      height:200,
      backgroundColor:'white',
      borderRadius:10 
    }

});

function select(store) {
  return {
    userInfo:store.user.userInfo,
  };
}

module.exports = connect(select)(PersonalIdReader);
