/**
 *
 *
 * @providesModule FlyNavigator
 * @flow
 *
 */

'use strict';

import React, {Component} from 'react';
import ReactNative, { StyleSheet, Navigator } from 'react-native';
const { connect } = require('react-redux');

const GoldLog = require('GoldLog');
const env = require('env');

const SceneUtils = require('SceneUtils');

const FlyTabsView = require('FlyTabsView');
// const FlyLogin = require('../login/FlyLogin');
const FlyFindPwd = require('../login/FlyFindPwd');
const FlyRegister = require('../login/FlyRegister');
const FlyLoginMainView = require('../login/FlyLoginMainView');
const FlyLoginSecondView = require('../login/FlyLoginSecondView');
const FlyFindPwdOrRegistFirst = require('../login/FlyFindPwdOrRegistFirst');
// introduction
const IntroductionMainView = require('../introduction/IntroductionMainView');

//financing
const FinancingDetails = require('../financing/FinancingDetails');
const FinancingPastView = require('../financing/FinancingPastView');
const FinancingBuyingView = require('../financing/FinancingBuyingView');
const FinancingPastListView = require('../financing/FinancingPastListView');
const FinancingStatus = require('../financing/FinancingStatus');

//address
const AddressSelectPcaView = require('../address/AddressSelectPcaView');
const AnimatedTest = require('../financing/AnimatedTest');
const ProfileWebView = require('../profile/ProfileWebView');



// profile
const ProfileRecharge = require('../profile/ProfileRecharge');
const ProfileCapitalRecord = require('../profile/ProfileCapitalRecord');
const ProfileBrowserView = require('../profile/ProfileBrowserView');
const ProfileAddBankCard = require('../profile/ProfileAddBankCard');
const ProfileShowBankCard = require('../profile/ProfileShowBankCard');
const ProfilePureHtmlView = require('../profile/ProfilePureHtmlView');
const ProfileChooseBankName = require('../profile/ProfileChooseBankName');
const ProfileWithdrawals = require('../profile/ProfileWithdrawals');
const ProfileTotalAmount = require('../profile/ProfileTotalAmount');
const ResetPayPassWordView = require('../profile/ResetPayPassWordView')
const ProfileDealPassWord = require('../profile/ProfileDealPassWord');
const MyCouponView = require('../profile/MyCouponView');
const ProfileJoinView = require('../profile/ProfileJoinView');
const ProfileAboutView = require('../profile/ProfileAboutView');
const ProfileMessageView = require('../profile/ProfileMessageView');
const InvestmentRecordView = require('../profile/InvestmentRecordView');
const MyIncomeView = require('../profile/MyIncomeView');
const CashWithdrawal = require('../profile/CashWithdrawal');
const MessageDetailView = require('../profile/MessageDetailView');
const ProfileAboutMainView = require('../profile/ProfileAboutMainView');
const ProfileQTDescribeView = require('../profile/ProfileQTDescribeView');
const ProfileQuestionView = require('../profile/ProfileQuestionView');
const ProfileSafeView = require('../profile/ProfileSafeView');
const ProfileAdviceView = require('../profile/ProfileAdviceView');
const MotifyPassWordView = require('../profile/MotifyPassWordView');
const RepaymentPlan = require('../profile/RepaymentPlan');
const ProfileInviteView = require('../profile/ProfileInviteView');
const CompanyIntroductionView = require('../profile/CompanyIntroductionView');
const MyIncreaseCouponView = require('../profile/MyIncreaseCouponView');
const MyVoucherCouponView = require('../profile/MyVoucherCouponView');
const Calendar = require('../profile/Calendar');
const BackMoneyDetails = require('../profile/BackMoneyDetails')
const ProfileForgetPassWord = require('../profile/ProfileForgetPassWord')
const ProfileSelectBankCard = require('../profile/ProfileSelectBankCard')
const CertificationBox = require('../personalCenter/CertificationBox')
const ProfileElectronic = require('../profile/ProfileElectronic');

//personalCenter
const PersonalCenterView = require('../personalCenter/PersonalCenterView');
const PersonalIdentifyView = require('../personalCenter/PersonalIdentifyView');
const PersonalIdReader = require('../personalCenter/PersonalIdReader');
const CertificationProcessView = require('../personalCenter/CertificationProcessView');
const PersonalMTAgreement = require('../personalCenter/PersonalMTAgreement');
const MTAuthentication = require('../personalCenter/MTAuthentication');


const TAB_VIEW = 'TAB_VIEW';
const INTRODUCTION_MAIN_VIEW = 'INTRODUCTION_MAIN_VIEW';

const SceneType = {

  //'LOGIN': FlyLogin,
  'FLY_FIND_PWD':FlyFindPwd,
  'FLY_REGISTER':FlyRegister,
  'TAB_VIEW': FlyTabsView,
  'LOGIN':FlyLoginMainView,
  'FLY_LOGIN_SECOND_VIEW':FlyLoginSecondView,
  'FLY_FIND_PWD_OR_REGIST_FIRST':FlyFindPwdOrRegistFirst,
  'INTRODUCTION_MAIN_VIEW': IntroductionMainView,

  //financing
  'FINANCING_DETAILS':FinancingDetails,
  'ANIMATEDTEST':AnimatedTest,
  'FINANCING_PAST_VIEW':FinancingPastView,
  'FINANCING_BUYING_VIEW':FinancingBuyingView,
  'FINANCING_PAST_LIST_VIEW':FinancingPastListView,

  //address
  'ADDRESS_SELECT_PCA_VIEW':AddressSelectPcaView,

  // profile
  'COMPANY_INTRODUCTION_VIEW':CompanyIntroductionView,
  'PROFILE_CAPITAL_RECORD':ProfileCapitalRecord,
  'PROFILE_RECHARGE':ProfileRecharge,
  'PROFILE_BROWSER_VIEW':ProfileBrowserView,
  'PROFILE_ADD_BANK_CARD':ProfileAddBankCard,
  'PROFILE_SHOW_BANK_CARD':ProfileShowBankCard,
  'PROFILE_PURE_HTML_VIEW': ProfilePureHtmlView,
  'PROFILE_WEB_VIEW':ProfileWebView,
  'PROFILE_CHOOSE_BANK_NAME':ProfileChooseBankName,
  'PROFILE_WITH_DRAWALS':ProfileWithdrawals,
  'PROFILE_TOTAL_AMOUNT':ProfileTotalAmount,
  'MY_COUPON_VIEW': MyCouponView,
  'PROFILE_JOIN_VIEW':ProfileJoinView,
  'PROFILE_ABOUT_VIEW':ProfileAboutView,
  'PROFILE_MESSAGE_VIEW':ProfileMessageView,
  'INVESTMENT_RECORD_VIEW':InvestmentRecordView,
  'MY_INCOME_VIEW':MyIncomeView,
  'PROFILE_ABOUT_MAIN_VIEW':ProfileAboutMainView,
  'PROFILE_QUESTION_VIEW':ProfileQuestionView,
  'PROFILE_QT_DESCRIBE_VIEW':ProfileQTDescribeView,
  'PROFILE_SAFE_VIEW':ProfileSafeView,
  'PROFILE_ADVICE_VIEW':ProfileAdviceView,
  'REPAYMENT_PLAN':RepaymentPlan,
  'CASH_WITHDRAWAL':CashWithdrawal,
  'MOTIFY_PASSWORD_VIEW':MotifyPassWordView,
  'MESSAGE_DETAIL_VIEW':MessageDetailView,
  'PROFILE_INVITE_VIEW':ProfileInviteView,
  'MY_INCREASE_COUPON_VIEW':MyIncreaseCouponView,
  'MY_VOUCHER_COUPON_VIEW':MyVoucherCouponView,
  'CALENDAR':Calendar,
  'BACK_MONEY_DETAILS':BackMoneyDetails,
  'PERSONAL_ID_READER':PersonalIdReader,
  'RESET_PAY_PASS_WORD_VIEW':ResetPayPassWordView,
  'PROFILE_FORGET_PASS_WORD':ProfileForgetPassWord,
  'PROFILE_SELECT_BANK_CARD':ProfileSelectBankCard,
  'FINANCING_STATUS':FinancingStatus,
  'PROFILE_DEAL_PASS_WORD':ProfileDealPassWord,
  'CERTIFICATION_BOX':CertificationBox,
  'CERTIFICATION_PROCESS_VIEW':CertificationProcessView,
  'PROFILE_ELECTRONIC':ProfileElectronic,
  //person
  'PERSONAL_CENTER':PersonalCenterView,
  'PERSONAL_IDENTIFY':PersonalIdentifyView,
  'PERSONAL_MT_AGREEMENT':PersonalMTAgreement,
  'MT_AUTHENTICATION':MTAuthentication
};


var FlyNavigator = React.createClass({
  render: function() {

    // 跳转到首页或者欢迎页
    var initRoute = {
      type: (this.props.skipIntro) ? TAB_VIEW : INTRODUCTION_MAIN_VIEW
    };

    return (
      <Navigator
        ref="navigator"
        style={styles.container}
        configureScene={(route) => {
          if (route.animType) {
            return route.animType;
          }
          return Navigator.SceneConfigs.FloatFromRight;
        }}
        initialRoute={initRoute}
        renderScene={this.renderScene}
      />
    );
  },

  renderSceneFromRoute: (route, navigator) => {

    let Component = SceneType[route.type];
    if (Component) {
      return (
        <Component {...route.props} navigator={navigator} />
      );
    } else {
      return (
        <FlyTabsView navigator={navigator} />
      );
    }

  },

  renderScene: function(route, navigator) {

    let {type, props} = route;
    let tabType = null;
    if (type === TAB_VIEW) {
       tabType = this.props.tab || 'enter';
       }

    // GoldLog
    if (type) {
      let params = env.getGoldLogParams(
        ((type === TAB_VIEW) ? (type + '::' + tabType) : type),
        props
      );

      params && GoldLog.sendPV(params);
    }

    // 页面信息
    SceneUtils.setNavigator(navigator);
    var sceneInfo = {
      type: type,
    };
    if (type === TAB_VIEW) {
      sceneInfo.itemName = tabType;
    }
    SceneUtils.setSceneInfo(sceneInfo);

    // 状态栏
    SceneUtils.setStatusBarStyle();

    // 路由
    if (route.component) {
      let Component = route.component;
      return (
        <Component {...props} navigator={navigator} />
      );
    }

    return this.renderSceneFromRoute(route, navigator);
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
});

function select(store) {
  return {
    tab: store.navigation.tab,
    skipIntro: store.navigation.skipIntro,
  };
}

module.exports = connect(select)(FlyNavigator);
