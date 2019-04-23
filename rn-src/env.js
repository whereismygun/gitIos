/**
 *
 *
 * @providesModule env
 * @flow
 *
 */

'use strict';

const _ = require('lodash');

const DefaultStatusBarStyle = 'default';
const LightStatusBarStyle = 'light-content';

// 页面配置信息
const SceneTypeCfg = {
  'INTRODUCTION_MAIN_VIEW': {
    StatusBarStyle: {
      def: LightStatusBarStyle,
    }
  },
  'TAB_VIEW': {
    StatusBarStyle: {
      def: LightStatusBarStyle,
      // enter: LightStatusBarStyle,
      // blanknote: LightStatusBarStyle,
      // profile: LightStatusBarStyle,
    }
  }
};

const SPM_A = "app";

const SceneCfg = {
  "LOGIN": {
    url: "/login",
    spmb: "login" //H5没有spmb
  },

  'FLY_FIND_PWD_OR_REGIST_FIRST':{
    url: "/findPwdOrRegist/first",
    spmb: "findPwdOrRegist-first" //H5没有spmb
  },

  'FLY_LOGIN_SECOND_VIEW':{
    url: "/login/second",
    spmb: "login-second" //H5没有spmb
  },

  'FLY_FIND_PWD':{
    url: "/findPwd",
    spmb: "findPwd" //H5没有spmb
  },

  'FLY_REGISTER':{
    url: "/register",
    spmb: "register" //H5没有spmb
  },

  'INTRODUCTION_MAIN_VIEW':{
    url: "/introdction/main",
    spmb: "introdction-main" //H5没有spmb
  },

  "TAB_VIEW::enter": {
    url: "/enter/main",
    spmb: "enter-main"
  },
  "TAB_VIEW::financing": {
    url: "/financing/main",
    spmb: "financing-main"
  },
  "TAB_VIEW::discovery": {
    url: "/discovery/main",
    spmb: "discovery-main"
  },
  "TAB_VIEW::profile": {
    url: "/riches/main",
    spmb: "riches-main"
  },

  "FINANCING_DETAILS": {
    url: "/financing/details", //id=402
    spmb: "financing-details"
  },

  "FINANCING_PAST_VIEW": {
    url: "/financing/main/list",
    spmb: "financing-main-list"
  },

  "FINANCING_BUYING_VIEW": {
    url: "/financing/product",
    spmb: "financing-product"
  },

  "FINANCING_PAST_LIST_VIEW": {
    url: "/financing/main/category",
    spmb: "financing-main-category"
  },

  "ADDRESS_SELECT_PCA_VIEW": {
    url: "/profile/agent",
    spmb: "profile-agent"
  },

  'COMPANY_INTRODUCTION_VIEW':{
    url: "/company/introduction",
    spmb: "company-introduction"
  },

  'PROFILE_CAPITAL_RECORD':{
    url: "/capital/main",
    spmb: "capital-main"
  },

  'PROFILE_RECHARGE':{
    url: "/riches/main",
    spmb: "riches-main"
  },
  'PROFILE_ADD_BANK_CARD':{
    url: "/profile/res/card",
    spmb: "profile-res-card"
  },
  'PROFILE_SHOW_BANK_CARD':{
    url: "/profile/res/card",
    spmb: "profile-res-card"
  },

  'PROFILE_PURE_HTML_VIEW':{
    url: "/profile/help/limit;/profile/help/material;/profile/help/procedure;/profile/help/question;/profile/help/who;/profile/setting/connectus;/profile/setting/service;/profile/setting/us",
    spmb: "profile-pure-html"
  },

  'PROFILE_CHOOSE_BANK_NAME':{
    url: "/profile/res/card",
    spmb: "profile-res-card"
  },

  'PROFILE_WITH_DRAWALS':{
    url: "/riches/withdraw",
    spmb: "riches-withdraw"
  },

  'PROFILE_TOTAL_AMOUNT':{
    url: "/profile/total/amout",
    spmb: "profile-total-amout"
  },

  'MY_COUPON_VIEW':{
    url: "/riches/red/coupon",
    spmb: "riches-red-coupon"
  },

  'PROFILE_JOIN_VIEW':{
    url: "/profile/agent",
    spmb: "profile/agent"
  },

  'PROFILE_ABOUT_VIEW':{
    url: "/profile/aboutus",
    spmb: "profile-aboutus"
  },

  'PROFILE_MESSAGE_VIEW':{
    url: "/profile/msg",
    spmb: "profile-msg"
  },

  'INVESTMENT_RECORD_VIEW':{
    url: "/riches/investment/payment",
    spmb: "riches-investment-payment"
  },

  'MY_INCOME_VIEW':{
    url: "/my/income",
    spmb: "my-income"
  },

  'PROFILE_ABOUT_MAIN_VIEW':{
    url: "/profile/aboutus",
    spmb: "profile-aboutus"
  },

  'PROFILE_QUESTION_VIEW':{
    url: "/profile/help/question",
    spmb: "profile-help-question"
  },

  'PROFILE_QT_DESCRIBE_VIEW':{
    url: "/profile/describe",
    spmb: "profile-describe"
  },

  'PROFILE_SAFE_VIEW':{
    url: "/profile/safety",
    spmb: "profile-safety"
  },

  'PROFILE_ADVICE_VIEW':{
    url: "/profile/feedback",
    spmb: "profile-feedback"
  },

  'REPAYMENT_PLAN':{
    url: "/riches/investment/plan",
    spmb: "riches-investment-plan"
  },

  'CASH_WITHDRAWAL':{
    url: "/riches/main/center",
    spmb: "riches-main-center"
  },

  'MOTIFY_PASSWORD_VIEW':{
    url: "/profile/motify/loginPassword",
    spmb: "profile-motify-loginPassword"
  },

  'MESSAGE_DETAIL_VIEW':{
    url: "/profile/msg/details",
    spmb: "profile-msg-details"
  },

  'PROFILE_INVITE_VIEW':{
    url: "/profile/invite/friends",
    spmb: "profile-invite-friends"
  },

  'PERSONAL_CENTER':{
    url: "/profile/res",
    spmb: "profile-res"
  },

  'PERSONAL_IDENTIFY':{
    url: "/profile/auth",
    spmb: "profile-auth"
  },

};

// 场景和URl的Map
const SceneUrlMap = (function () {
  let name,
    value,
    urls,
    urlMap = {};
  for (name in SceneCfg) {
    if (SceneCfg.hasOwnProperty(name) && (value = SceneCfg[name])) {
      urls = value.url.split(';');
      urls.forEach((val, idx) => {
        urlMap[val] = name;
      });
    }
  }
  return urlMap;
})();

const SkipLoginCheckTabs = ['enter', 'financing', 'discovery', 'profile'];

// Listener
const ListenerMap = {
  'LOGIN_EVENT':'loginEvent',
  'CHOOSE_BANK_NAME':'chooseBankName',
  'RELOAD_GET_EWALLET':'reloadGetEwallet',
  'ENTER_TAB_CHANGE': 'enterTabChange',
  'ADDRESS_CHOOSE_PCA':'addressChoosePca',
  'SELECT_FINANCING_COUPON':'selectFinancingCoupon',
  'RELOAD_GET_FINANCING':'reloadFinaning',
  'REFRESH_FINANCING_DETAIL':'refreshFinancingDetail',
  'PERSON_AUTH':'presonAuth',
  'REFRESH_FINANCING_BUY':'refreshFinancingBuy',
  'PERSONAL_ID_ENTIFY_VIEW':'refreshIdentify',
  'PROFILE_UNBIND_BANK':'profileUnbindBank',
  'PROFILE_SELECT_BANK':'profileselectbank',
  'LOGIN_MODAL': 'loginModal',
  'GUIDE_MODAL': 'guideModal',
};

// share
const DefaultShareInfo = {
  title: "通通理财 - 诚信、安全、便捷的理财平台",
  description: "民泰商业银行存管，只为让你更放心！新手专享年化14.6%",
  thumb: "https://m.tongtongli.com/app/assets/imgs/weixin/share.png",
  baseUrl: "https://m.tongtongli.com/app/family/m/index.html#"
};

function getGoldLogParams(type, props) {


  let cfg = SceneCfg[type];
  if (cfg) {
    let paramStr = null;
    if (props) {
      let name,
        value,
        paramArr = [];
      for (name in props) {
        if (props.hasOwnProperty(name) && (value = props[name])) {
          if (_.isString(value) || _.isNumber(value)) {
            paramArr.push(name + '=' + value);
          }
        }
      }
      paramStr = paramArr.join('&');
    }

    return [
      [
        "spm",
        SPM_A + '.' + cfg.spmb
      ],
      [
        "url",
        type + (_.isEmpty(paramStr) ? "" : ('?' + paramStr))
      ]
    ];
  }

  return null;
}


module.exports = {
  appName: 'ttl',
  bundleVer: '2.4.6',
  fontFamily: undefined,
  serverURL: 'https://m.tongtongli.com',
  assetBaseURL: 'https://m.tongtongli.com/rn/assets/',
  wechatSeller: '1272239001',
  SceneTypeCfg: SceneTypeCfg,
  SceneUrlMap: SceneUrlMap,
  SkipLoginCheckTabs: SkipLoginCheckTabs,
  ListenerMap: ListenerMap,
  CodeEncryption:'E2Xa%N8r2E6N7YSObq8J&nIRWG5^UatmvNxmV&2@N5dx^QrL^H@lIhnfHK3knNSL',

  DEFAULT_SHARE_INFO: DefaultShareInfo,

  getGoldLogParams: getGoldLogParams,
};
