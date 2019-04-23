/**
 *
 *
 * @providesModule UrlHelper
 * @flow
 *
 */

'use strict';

var env = require('env');

const serverURL = env.serverURL;
const assetBaseURL = env.assetBaseURL;

const urlMap = {

  //enter
 'queryEarnBanners':'/banner/queryBanners.json',
 'queryStatData':'/get_stat_data.json',
 'checkUserNew':'/user/check_user_isNew.json',
 'listNewp':'/underly/list_newp.json',


 //discovery
 //discovery
'activityBanner':'/banner/activityBanner.json',

//profile
'queryPushMsg':'/message/queryMessage.json',
'updateMessageToAllRead':'/message/updateMessageToAllRead.json',
'saveSuggestion':'/user/saveSuggestion.json',
'getAllProvinceList': "/region/getProvinceList.json",
'getCityListByProvince': "/region/getCityListByProvince.json", // provinceCode
'getAreaListByCity': "/region/getAreaListByCity.json", // provinceCode
'getApply':'/agent/get_apply.json',
'modifyApply':'/agent/modify_apply.json',
'getSpreeSpredUrl':'/w/spread/get_spree_spread_url.json',
'getInviteSpreeList':'/w/spread/get_invite_spree_listNew.json',
  // user
  'login': '/dologin.json',
  'logout': '/login_out.json',
  // 'getAreasCityCode': '/massfrog/common/get_areas_citycode.json',
  // 'getMsgCount': '/m/p/a/count_push_msg.json',
  // 'getCartCount': '/cart/quantity.json',
  'callCenterUserInfo': '/k/send_userJsonObject.json',
  'checkUserRegister':'/check_user_register.json',//检查是否注册
  'sendAuthCode':'/sendAuthCode0x01Fuck.json',
  'findPasswordCode':'/fetch_find_password_code.json',
  'validateAuthCode':'/validateAuthCode.json',
  'resetLoginPassword':'/reset_login_password.json',
  'setPassword':'/set_password.json',
  'registeredAgreement':'/xieyi/get.json',
  // profile
  'setApply':'/agent/apply.json',
  'getDelegate':'/agent/product/get.json',
  'queryBilling':'/ewallet/queryBilling.json',
  'getBinding':'/bankCard/getUserBindingCard.json',
  'getBankList':'/bankCard/getBankCardList.json',
  'confirmBind':'/bankCard/bindBankCard.json',
  'countUnReadMessage':'/message/countUnReadMessage.json',
  'queryUserReceivingAmount':'/user/queryUserReceivingAmount.json',
  'queryReceivingInvestment':'/user/queryReceivingInvestment.json',
  'queryReceivedInvestment':'/user/queryReceivedInvestment.json',
  'getMyIncome':'/ewallet/get_my_income_list.json',
  'getMyIncomeInfo':'/ewallet/get_my_income_info.json',
  'queryReceivedScheduleInfo':'/user/queryReceivedScheduleInfo.json',
  'updatePassword':'/update_password.json',
  'updateMessageToRead':'/message/updateMessageToRead.json',
  'getInviteFriendUrl':'/w/spread/get_invite_friend_url.json',
  'getInviteFriendList':'/w/spread/get_invite_friend_listNew.json',
  'investXieyi':'/xieyi/invest_xieyi.json', // 参数 invest_id
  'listSysNotice':'/listSysNotice.json',
  'generalizeSearch':'/activity/inviteIncomeList.json',
  'getMonthRepaymentInfo':'/repayment/calendar/month_repayment_info.json',
  'annualStatistics':'/repayment/calendar/annual_statistics.json',
  'repaymentDayDetail':'/repayment/calendar/repayment_day_detail.json',
  'searchBankCardByBankName':'/bankCard/searchBankCardByBankName.json',
  'sendMTBindCardCode':'/bankCard/sendMTBindCardCode.json',
  'getPasswordFactor':'/custody/funds/getPasswordFactor.json',
  'chargeUserAccount':'/custody/recharge/chargeUserAccount.json',
   'withdrawUserAccount':'/custody/withdraw/withdrawUserAccount.json',
   'sitePayPass':'/custody/funds/sitePayPass.json',
  // myCoupon
  'getUserCouponList':'/user/getUserCouponList.json',     //可使用代金券
  // Financing
  'getUserInfo':'/user/get_user_info.json',      //判断用户是否为代理
  'borrowUnderlyNew':'/underly/list_borrowUnderlyNew.json',   //查询理财产品
  'listInvestPurchase':'/underly/list_invest_purchase.json',    //往期标的 ——— 已还款
  'listReceivePurchase':'/underly/list_receive_purchase.json', ////往期标的 ——— 还款中
  'listSchedule':'/underly/list_schedule.json',   //还款计划
  'basicInfo':'/underly/basic_info.json',  //查询单个理财标信息
  'materialRelative':'/underly/material_relative.json',  //项目介绍
  'getXieYi':'/xieyi/get.json',   //本息保障协议
  'queryUserInvestmentByUnderlyId':'/user/queryUserInvestmentByUnderlyId.json', //投资记录
  'calculateProfit':'/underly/profit_calculator.json',  //收益计算器
  'buyTender': '/custody/investment/buyTender.json',
  'activateMTUser':'/minTai/auth/activateMTUser.json',//激活民泰
  'deliverImageToMT':'/minTai/auth/deliverImageToMT.json',
  'findUserStatus':'/custody/funds/findUserStatus.json',
  'WithdrawInfo':'/custody/withdraw/WithdrawInfo.json',
  'unbindBankCard':'/bankCard/unbindBankCard.json',
  'buyAgent':'/custody/agent/buyAgent.json',
  'updatePayPass':'/custody/funds/updatePayPass.json',
  'resetPassword':'/custody/funds/resetPassword.json',
  'checkUserOCRToMT':'/minTai/auth/checkExistUserOCRToMT.json',
  'sendPaySmsCode':'/custody/funds/sendPaySmsCode.json',
  'forgetPasswordVerification':'/custody/funds/forgetPasswordVerification.json',
  'sendCode':'/custody/agent/sendCode.json',
  'getElectaccount':'/ewallet/get_elect_account.json',
  'chargeFromEAccount':'/custody/recharge/chargeFromEAccount.json',


    // 购买页面
  'queryUserRemainAmount': '/user/queryUserRemainAmount.json',   //标的用户可购买额度
  'getEwallet': '/ewallet/get_ewallet.json',          //获得钱包(账户余额)
  'getBrUndlyUserCouponList':'/user/getBrUndlyUserCouponList.json',  //根据购买金额获得返券
  'getBrUndlyUserBonusList':'/user/getBrUndlyUserBonusList.json',


};

module.exports = {
    getUrl: (key) => (serverURL + urlMap[key]),
    getAssetUrl: (path) => (assetBaseURL + path)
};
