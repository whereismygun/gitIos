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
const ORDER_TITLES = ['返现红包','加息券'];
type Props = {
  navigator: Navigator;
};

const Bg1 = './imgs/discount/bg1.png';
const activeBg = './imgs/discount/bg.png';
const authBg = './imgs/discount/bg2.png';
const activeBg1 = './imgs/discount/bg3.png';
const authBg1 = './imgs/discount/bg4.png';

// const {} = require('../../actions
const more = [
  {
    title:'返现红包',
    scene:'MY_VOUCHER_COUPON_VIEW'
  },
  {
    title:'加息券',
    scene:'MY_INCREASE_COUPON_VIEW'
  }
]


class MyCouponView extends Component {

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
        let isUse,onPress,activeOpacity,textContain;
        let bgUrl = '';
        if (rowData.status === 'fetched' &&rowData.couponDiscountType==='bonus') {
            isUse = '立即使用';
            onPress = ()=> SceneUtils.gotoScene('TAB_VIEW::financing');
            textContain=(<Text style={styles.cellLeftText}>{parseFloat(rowData.amount)*100}<Text style={{color:FlyColors.white}}>%</Text></Text>)
            bgUrl = activeBg;
        }else {
            onPress = ()=> SceneUtils.gotoScene('TAB_VIEW::financing');
            textContain=( <Text  style={{color:FlyColors.white}}>¥<Text style={styles.cellLeftText}>{rowData.amount}</Text></Text>)
            bgUrl = Bg1;
            isUse = '立即使用';
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
                    <Text>{rowData.bonusRateCycleRule}</Text>
                    <Text style={styles.cellRight_row3}>{Utils.dateFormat(rowData.beginTime, "YYYY-MM-DD") + '至' + Utils.dateFormat(rowData.endTime, "YYYY-MM-DD")}</Text>
                  </View>
                  <View style={styles.cellLeft}>
                   {textContain}
                        <Text style={[styles.cellLeftDetail,styles.cellLeftTextCol]}>{isUse}</Text>
                  </View>
                </FlyImage>
           </TouchableOpacity>
         )

    }


    _reloadFetchConfig(type,couponType) {
        let cfg = {
            url: 'getUserCouponList',
            method:'POST',
            params:{
              status:couponType,
              couponDiscountType:type
            },
            isForm:true
        };
        return cfg;
    }

    render() {
        let leftItem = {
          type: "back",
        };
        let select = this.state.selectedIndex==0?more[0]:more[1];

      return (
        <View style={FlyStyles.container}>
          <FlyHeader foreground="dark" title={"我的优惠券"} leftItem={leftItem} borderBottom={true} backgroundColor={FlyColors.white}/>
          <FlyViewPagerWithTab count={2} backgroundColor={FlyColors.baseTextColor3} onSelectedIndexChange={(index)=>{this.setState({selectedIndex:index})}} selectedIndex={this.state.selectedIndex} lazyLoad={true} titles={ORDER_TITLES} ref={(viewpager)=>this.viewpager = viewpager}>
            <FlyRefreshListView
              tabLabel="返现红包"
              reloadFetchConfig={()=>this._reloadFetchConfig('coupon','fetched')}
              offsetText = 'pageIndex'
              limitText = 'pageSize'
              name='fetched'
              renderRow={this._renderCoupon}/>
            <FlyRefreshListView
              tabLabel="加息券"
              reloadFetchConfig={()=>this._reloadFetchConfig('bonus','fetched')}
              offsetText = 'pageIndex'
              limitText = 'pageSize'
              name='used'
              renderRow={this._renderCoupon}/>
          </FlyViewPagerWithTab>
          <TouchableOpacity style={{alignItems:'center'}} onPress={()=>{SceneUtils.gotoScene(select.scene)}}>
              <Text style={{marginTop:15,marginBottom:15}}>点击查看更多{select.title}</Text>
          </TouchableOpacity>
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
module.exports = connect(select)(MyCouponView);
