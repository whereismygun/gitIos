'use strict';
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    TouchableHighlight,
    ScrollView,
    ToastAndroid,
    TouchableOpacity,
    TouchableNativeFeedback,
    TouchableWithoutFeedback,
    InteractionManager,
} from 'react-native';
import {connect} from 'react-redux';
const FlyColors = require('FlyColors');
const FlyStyles = require('FlyStyles');
const FlyDimensions = require('FlyDimensions');
const FlyHeader = require('FlyHeader');
const Utils = require('Utils');
const FlyImage = require('FlyImage');
const FlyViewPagerWithTab = require('FlyViewPagerWithTab');
const FlyBase = require('FlyBase');
const Filters = require('Filters');
const {Text,OneLine} = require('FlyText');
const FlyRefreshListView = require('FlyRefreshListView');
const SceneUtils = require('SceneUtils');
const FlyContainer = require('FlyContainer');
const dim = FlyDimensions.deviceDim;
const ORDER_TITLES = ['可使用','已使用','已失效'];
type Props = {
  navigator: Navigator;
};
const Bg1 = './imgs/discount/bg1.png'
const activeBg = './imgs/discount/bg.png';
const authBg = './imgs/discount/bg2.png';
const activeBg1 = './imgs/discount/bg3.png';
const authBg1 = './imgs/discount/bg4.png';

// const {} = require('../../actions


class MyVoucherCouponView extends Component {

  constructor(props) {
      super(props);

      (this: any)._reloadFetchConfig = this._reloadFetchConfig.bind(this);
      (this: any)._renderCoupon = this._renderCoupon.bind(this);
      this.state={
        loadStatus:'loading',
        selectedIndex:0
      }
    }


    _renderCoupon(rowData){
        let isUse,onPress,activeOpacity;
        let bgUrl = '';
        if (rowData.status === 'fetched') {
          isUse = '立即使用';
          onPress = ()=> SceneUtils.gotoScene('TAB_VIEW::financing');
          if(rowData.couponType == 'investment_voucher'){
            bgUrl = Bg1;
          }else{
            bgUrl = Bg1;
          }
        }else if (rowData.status === 'used') {
            isUse = '已使用';
            if(rowData.couponType == 'investment_voucher'){
              bgUrl = authBg1;
            }else{
              bgUrl = activeBg1;
            }
        }else {
            isUse = '已过期';
            if(rowData.couponType == 'investment_voucher'){
              bgUrl = authBg1;
            }else{
              bgUrl = activeBg1;
            }
        }

        let rule = Utils.string2Json(rowData.rule);
        let description = rowData.description?(<OneLine style={styles.cellRight_row2}>*{rowData.description}</OneLine>):null;
         return(
           <TouchableOpacity activeOpacity={(onPress ? 0.7 : 1)} onPress={onPress} style={styles.cellContainer}>
                <FlyImage source={bgUrl} style={styles.baImages}>
                  <View style={styles.cellRight}>
                    <View style={{flexDirection:'row',justifyContent:'space-between',paddingRight:10}}>
                      <Text style={styles.cellRight_row1}>{rowData.couponName}</Text>
                    </View>
                    <View style={{flex:1}}>
                        <OneLine numberOfLines={2} style={styles.cellRight_row2}>{rowData.ruleString}</OneLine>
                        {description}
                    </View>
                    <Text style={styles.cellRight_row3}>{Utils.dateFormat(rowData.beginTime, "YYYY-MM-DD") + '至' + Utils.dateFormat(rowData.endTime, "YYYY-MM-DD")}</Text>
                  </View>
                  <View style={styles.cellLeft}>
                        <Text style={{color:FlyColors.white}}>¥<Text style={styles.cellLeftText}>{rowData.amount}</Text></Text>
                        <Text style={[styles.cellLeftDetail,styles.cellLeftTextCol]}>{isUse}</Text>
                  </View>
                </FlyImage>
           </TouchableOpacity>
         )

    }


    _reloadFetchConfig(couponType) {
        let cfg = {
            url: 'getUserCouponList',
            method:'POST',
            params:{
              status:couponType,
              couponDiscountType:'coupon'
            },
            isForm:true
        };
        return cfg;
    }

    render() {
        let leftItem = {
          type: "back",
        };
      return (
        <View style={FlyStyles.container}>
          <FlyHeader foreground="dark" title={"我的返现红包"} leftItem={leftItem} borderBottom={true} backgroundColor={FlyColors.white}/>
          <FlyViewPagerWithTab count={3} backgroundColor={FlyColors.baseTextColor3} onSelectedIndexChange={(index)=>{this.setState({selectedIndex:index})}} selectedIndex={this.state.selectedIndex} lazyLoad={true} titles={ORDER_TITLES} ref={(viewpager)=>this.viewpager = viewpager}>
            <FlyRefreshListView
              tabLabel="可使用"
              reloadFetchConfig={()=>this._reloadFetchConfig('fetched')}
              offsetText = 'pageIndex'
              limitText = 'pageSize'
              name='fetched'
              renderRow={this._renderCoupon}/>
            <FlyRefreshListView
              tabLabel="已使用"
              reloadFetchConfig={()=>this._reloadFetchConfig('used')}
              offsetText = 'pageIndex'
              limitText = 'pageSize'
              name='used'
              renderRow={this._renderCoupon}/>
            <FlyRefreshListView
              tabLabel="已失效"
              offsetText = 'pageIndex'
              limitText = 'pageSize'
              name='expired'
              reloadFetchConfig={()=>this._reloadFetchConfig('expired')}
              renderRow={this._renderCoupon}/>
          </FlyViewPagerWithTab>
        </View>
      );
    }
}
var styles = StyleSheet.create({
    baImages:{
      marginLeft:10,
      marginRight:10,
      height:(dim.width-20)/3,
      flexDirection:'row',
    },
    cellContainer:{
      marginTop:15,
    },
    gotoShop:{
      marginTop:10,
      color:'#96cd67'
    },
    cellLeft:{
      flex:1,
      justifyContent:'center',
      alignItems:'center',
      borderStyle:'dashed',
      borderRightWidth:2,
      borderRightColor:'#b2b2b2',
      paddingVertical:10,
      paddingHorizontal:5
    },
    cellLeftText:{
       fontSize:FlyDimensions.fontSizeHuge,
       color:FlyColors.white
    },
    cellLeftTextCol:{
       color:FlyColors.white
     },
     cellLeftDetail:{
        fontSize:FlyDimensions.fontSizeXl,
        position:'absolute',
        bottom:5,
        left:10
     },
     cellRight:{
        flex:2,
        paddingLeft:20,
        position:'relative'
     },
     cellRight_row1:{
       marginTop:10,
       fontSize:FlyDimensions.fontSizeLarge
     },
     cellRight_row2:{
        marginTop:5,
        marginBottom:10,
        fontSize:FlyDimensions.fontSizeLarge,
        color:FlyColors.baseTextColor2
     },
     cellRight_row3:{
        color:FlyColors.baseTextColor2,
        fontSize:FlyDimensions.fontSizeBase,
        marginBottom:10
     },
     prompt:{
        justifyContent:'center',
        alignItems:'center',
        marginTop:20
      }

});
function select(store) {
    return {

    };
}
module.exports = connect(select)(MyVoucherCouponView);
