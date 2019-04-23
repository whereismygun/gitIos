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
  ScrollView
} from 'react-native';

const {connect} = require('react-redux');

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
const {queryUserReceivingAmount,investXieyi} = require('../../actions');
const NativeModuleUtils = require('NativeModuleUtils');
const FlyModalBox = require('FlyModalBox');
const NetworkService = require('NetworkService');
const Utils = require('Utils');
const {Text} = require('FlyText');
const LISTVIEWREF = 'listview';
const bg = "./imgs/capitalRecord/bg.png";
const taxis = "./imgs/capitalRecord/taxis.png";
const layer = "./imgs/investmentRecord/layer.png";
const titian = "./imgs/investmentRecord/titian.png";
const dim = FlyDimensions.deviceDim;
const Filters = require('Filters');
const FlyViewPagerWithTab = require('FlyViewPagerWithTab');
const recordTitle = ['计息中','投资完成'];
const FlyRefreshListView = require('FlyRefreshListView');
const down = './imgs/myAssets/down.png';
const up = './imgs/myAssets/up.png';
const FlyIconfonts = require('FlyIconfonts');
const headImg = './imgs/totalAssets/bg.png';
const FlyWebView = require('FlyWebView');
const close = './imgs/investmentRecord/closed.png';

type Props = {
  navigator: Navigator;
};

let dateList = [
  {date:'按回款时间',parms:'参数1'},
  {date:'按购买时间',parms:'参数2'},
];

class InvestmentRecordView extends React.Component {
  props: Props;

  constructor(props) {
    super(props);
    (this: any)._renderCategoryItem = this._renderCategoryItem.bind(this);
    (this: any)._reloadFetchConfig = this._reloadFetchConfig.bind(this);
    (this: any)._getItemFn = this._getItemFn.bind(this);


    this.state = {
      showDate:null,
      amount:null,
      interest:null,
      selectedIndex:0,
      contract:null,
    }
  }


  componentDidMount() {
    let that = this;
    InteractionManager.runAfterInteractions(()=>{
      let promise = that.props.dispatch(queryUserReceivingAmount());
      promise.then((data)=>{
        that.setState({
          amount:data.amount,
          interest:data.interest
        });
      }).catch((err)=>{

      });
    });
  }

  componentWillUnmount() {

  }

  _renderHeadCell(title,money,imgUrl){
    return(
      <View style={styles.headCell}>
        <FlyImage source={imgUrl} width={dim.width * 0.08} style={{marginTop:-2}}/>
        <View style={{marginLeft:15}}>
          <Text style={styles.headTitle}>{title}</Text>
          <Text style={styles.headMoney}>{Filters.keepFixed(money)}</Text>
        </View>
      </View>
    )
  }

  _reloadFetchConfig(type){
    if (type == 'complete') {
      return{
        url: 'queryReceivedInvestment',
      };
    }else {
      return{
        url: 'queryReceivingInvestment',
      };
    }

  }

  // _rowChages(userInvestId){
  //   let promise = this.props.dispatch(investXieyi(userInvestId));
  //   promise.then((data)=>{
  //     this.setState({
  //       contract:data
  //     });
  //     this.refs.planModal.open();
  //   }).catch((err)=>{
  //     Utils.error(err.msg || '服务器繁忙');
  //   })
  //
  // }
  //
    _rowChages(userInvestId){
      let promise = this.props.dispatch(investXieyi(userInvestId));
      promise.then((data)=>{
        SceneUtils.gotoScene('PROFILE_WEB_VIEW', {
          title: '投资合同',
          html: data,
        });
      }).catch((err)=>{
        Utils.error(err.msg || '服务器繁忙');
      })
    }

  _renderCategoryItem(rowData){
    return(
      <View style={styles.cellContainer}>
        <View style={styles.cellTitle}>
          <Text style={styles.title}>{rowData.title}</Text>
          <TouchableOpacity style={{alignItems:'flex-end'}} onPress={()=>SceneUtils.gotoScene('REPAYMENT_PLAN',{userInvestId:rowData.userInvestId})}>
            <Text style={styles.contract}>回款计划</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cellRow}>
          <Text style={styles.interest}>预期年化收益:<Text style={styles.amountBack}>{Filters.percentage(rowData.interest)}</Text></Text>
          <Text style={styles.amount}>投资本金:<Text style={styles.amountBack}>{Filters.moneyFixed(rowData.amount)}</Text></Text>
        </View>
        <View style={[styles.cellRow,{marginTop:15}]}>
          <Text style={styles.interest}>加息利率:<Text style={styles.interestAmt}>{Filters.percentage(rowData.bonusRate)}</Text></Text>
          <Text style={styles.amount}>加息周期:<Text style={styles.amountBack}>{Filters.timeCycle(rowData.bonusPeriod)}</Text></Text>
        </View>
        <View style={[styles.cellRow,{marginTop:15}]}>
          <Text style={styles.interest}>预计收益:<Text style={styles.interestAmt}>{Filters.moneyFixed(rowData.interestAmt)}</Text></Text>
          <Text style={styles.amount}>回款时间:<Text style={styles.amountBack}>{Utils.dateFormat(rowData.repaymentDate,'YYYY-MM-DD')}</Text></Text>
        </View>
        <TouchableOpacity style={styles.plan} onPress={()=>this._rowChages(rowData.userInvestId)}>
          <FlyIconfonts name={"icon-t"} size={15} color={FlyColors.btnLinkDisabledColor}/>
          <Text style={styles.planText}>投资合同</Text>
        </TouchableOpacity>
      </View>
    )
  }

  _getItemFn(data) {
    return data.receiveUnderlyDTOs || [];
  }

  renderModal(){
    if(this.state.contract){
      return (
          <FlyModalBox style={styles.flyModalBox} swipeToClose={false}  position="top" ref="planModal" backdropOpacity={0.8} backdropColor={"white"}>
            <ScrollView style={{backgroundColor:'rgba(0,0,0,0)',marginTop:dim.width * 0.1}}>
              <FlyWebView  html={this.state.contract} webviewStyle={'body{line-height:110%;font-size:12px;}'}/>
            </ScrollView>
            <TouchableOpacity style={{alignItems:'center'}} onPress={()=>this.refs.planModal.close()}>
              <FlyImage source={close} style={styles.closeImg}/>
            </TouchableOpacity>
          </FlyModalBox>
      );
    }
  }

  render() {
    let leftItem = {
      type:'back'
    };
    let rightItem = {
      image:taxis,
      imageWidth:20,
      onPress:() =>{
        this.setState({
          showDate:!showDate
        })
      }
    };
    let bottomStyle = {
      borderBottomWidth:1,
      borderBottomColor:FlyColors.baseTextColor3
    };

    let showDate = this.state.showDate;
    let dateItemView = dateList.map((item,idx)=>{
      if (idx == 1) {
        bottomStyle = null;
      }
      return(
        <TouchableOpacity key={idx} style={[styles.dateItem,bottomStyle]} onPress={()=>{
          alert('发送请求');
          this.setState({showDate:!showDate})
        }}>
          <Text>{item.date}
          </Text>
        </TouchableOpacity>
      )
    });

    let dateView = (this.state.showDate == true) ? (
      <View style={styles.dateConatiner}>
        <FlyImage source={bg} style={styles.bgStyle}>
          <View style={{marginTop:dim.width * 0.06}}>
            {dateItemView}
          </View>
        </FlyImage>
      </View>
    ) : null;


    return (
      <View style={FlyStyles.container}>
        <FlyHeader title={'投资记录'} borderBottom={true} leftItem={leftItem} />
        <View style={styles.headContainer}>
          {this._renderHeadCell('待收本金(元)',this.state.amount,titian)}
          <View style={{height:dim.width * 0.1,backgroundColor:FlyColors.baseTextColor3,width:1}}>
          </View>
          {this._renderHeadCell('待收利息(元)',this.state.interest,layer)}
        </View>
        <FlyViewPagerWithTab
          ref={'FlyViewPager'}
          count={2}
          selectedIndex={this.state.selectedIndex}
          titles = {recordTitle}
          style={{flex:1}}
          lazyLoad={true}>
          <FlyRefreshListView
               ref={'refreshListView1'}
               enablePullToRefresh={true}
               getItemFn={this._getItemFn}
               style={{backgroundColor:FlyColors.baseTextColor3}}
               text={'还没购买过理财产品'}
               btnText={'去理财列表逛逛'}
               reloadFetchConfig={()=>this._reloadFetchConfig('remittance')}
               btnonPress={()=>SceneUtils.gotoScene('TAB_VIEW::financing')}
               renderRow={this._renderCategoryItem}/>

          <FlyRefreshListView
               ref={'refreshListView2'}
               enablePullToRefresh={true}
               style={{backgroundColor:FlyColors.baseTextColor3}}
               reloadFetchConfig={()=>this._reloadFetchConfig('complete')}
               getItemFn={this._getItemFn}
               text={'还没投资过理财产品'}
               btnText={'去理财列表逛逛'}
               btnonPress={()=>SceneUtils.gotoScene('TAB_VIEW::financing')}
               renderRow={this._renderCategoryItem}/>
        </FlyViewPagerWithTab>
        {dateView}
        {this.renderModal()}
      </View>
    )
  }
}



var styles = StyleSheet.create({
  dateConatiner:{
    backgroundColor:'rgba(0,0,0,0)',
    position: 'absolute',
    right:10,
    top:FlyHeader.height - 20
  },
  dateItem:{
    height:30,
    width:dim.width * 0.35,
    justifyContent:'center',
    alignItems:'center',
    marginLeft:dim.width * 0.03,
  },
  bgStyle:{
    width:dim.width * 0.4,
    height:dim.width * 0.3,
    resizeMode:'stretch'
  },
  headContainer:{
    flexDirection:'row',
    alignItems:'center',
    borderBottomWidth:1,
    borderBottomColor:FlyColors.baseTextColor3,
    // backgroundColor:FlyColors.baseColor
  },
  headCell:{
    flexDirection:'row',
    flex:1,
    padding:15,
  },
  headTitle:{
    color:FlyColors.baseTextColor2,
    fontSize:FlyDimensions.fontSizeLarge,
    marginBottom:5,
    backgroundColor:'rgba(0,0,0,0)'
  },
  headMoney:{
    color:FlyColors.baseColor,
    fontSize:FlyDimensions.fontSizeXxl,
    backgroundColor:'rgba(0,0,0,0)',
    marginTop:5
  },
  cellContainer:{
    marginLeft:15,
    marginRight:15,
    marginTop:10,
    flex:1,
    backgroundColor:'white',
    paddingBottom:15,
    borderColor:'#DDDDDD',
    borderWidth:1
  },
  cellTitle:{
    padding:15,
    flexDirection:'row',
    borderBottomWidth:1,
    borderBottomColor:FlyColors.baseTextColor3,
  },
  title:{
    flex:1,
    fontSize:FlyDimensions.fontSizeXl,
    fontWeight:'700'
  },
  contract:{
    fontSize:FlyDimensions.fontSizeXl,
    color:FlyColors.baseColor,
    fontWeight:'700'
  },
  cellRow:{
    flexDirection:'row',
    marginLeft:15,
    marginRight:15,
    marginTop:10
  },
  interest:{
    fontSize:FlyDimensions.fontSizeLarge,
    textAlign:'left',
    flex:1,
    color:FlyColors.baseTextColor2
  },
  amount:{
    fontSize:FlyDimensions.fontSizeLarge,
    textAlign:'right',
    flex:1,
    color:FlyColors.baseTextColor2
  },
  interestAmt:{
    color:FlyColors.baseColor,
    fontSize:FlyDimensions.fontSizeLarge
  },
  amountBack:{
    fontSize:FlyDimensions.fontSizeLarge
  },
  plan:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    paddingTop:15,
  },
  planText:{
    fontSize:FlyDimensions.fontSizeLarge,
    marginLeft:5,
    marginRight:5
  },
  flyModalBox: {
    width: FlyDimensions.deviceDim.width,
    height: FlyDimensions.deviceDim.height,
    backgroundColor:'rgba(0,0,0,0)',
  },
  closeImg:{
    height:FlyDimensions.deviceDim.height * 0.12,
    width:FlyDimensions.deviceDim.width * 0.12,
    marginTop:10,
    resizeMode:'contain'
  },
});

function select(store) {
  return {

  };
}

module.exports = connect(select)(InvestmentRecordView);
