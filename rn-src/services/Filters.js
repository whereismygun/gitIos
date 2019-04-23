/**
 *
 *
 * @providesModule Filters
 * @flow
 *
 */

'use strict';

const env = require('env');
const Utils = require('Utils');
const _ = require('lodash');

const Filters = {
  // 过滤器：html转码
  htmlEncode: (d) => {
    if (!Utils.isEmpty(d)) {
      return Utils.htmlEncode(d);
    }
    return d;
  },
  isEmoji:(str) => {

  let  d = str.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g,'');
   return d;
   },
  // 过滤器：html解码
  htmlDecode: (d) => {
    if (!Utils.isEmpty(d)) {
      return Utils.htmlDecode(d);
    }
    return d;
  },

  // 过滤器：html去除标签
  delTag: (d) => {
    if (!Utils.isEmpty(d)) {
      d = Utils.htmlDecode(d);
      d = d.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
      d = d.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
      d = d.replace(/\n[\s| | ]*\r/g, '\n'); //去除多余空行
      return d;
    }
    return d;
  },

  // 过滤器：字符串截断
  omitStr: (str, limitLen) => {
    if (str !== undefined && str !== null && _.isString(str)) {
      if (0 >= limitLen || str.length <= limitLen) {
        return str;
      } else {
        return str.substr(0, limitLen) + '...';
      }
    }
    return '--';
  },

  moneyFixedNumber: (d, def) => {
    var fixedNum = 2;
    if (!d) {
      if (def !== undefined) {
        return def;
      }
      return 0;
    }
    return (Math.round(d * Math.pow(10, fixedNum)) / Math.pow(10, fixedNum));
  },
  // 过滤器：money格式化
  moneyFixed: (d, def) => {
    var fixedNum = 2;
    if (!d) {
      if (def !== undefined) {
        return def;
      }
      return '0元';
    }
    return (Math.round(d * Math.pow(10, fixedNum)) / Math.pow(10, fixedNum)) +
      "元";
  },

   formatMoney:(num,places, symbol, thousand, decimal) => {
      places = !isNaN(places = Math.abs(places)) ? places : 2;
      symbol = symbol !== undefined ? symbol : "$";
      thousand = thousand || ",";
      decimal = decimal || ".";
      var number = num,
          negative = number < 0 ? "-" : "",
          i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
          j = (j = i.length) > 3 ? j % 3 : 0;
      return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
  },

  keepFixed: (d, num) => {
    var fixedNum = num;
    if (!d) {
      return 0;
    }
    if (num === undefined) {
      fixedNum = 2;
    }
    return Math.round(d * Math.pow(10, fixedNum)) / Math.pow(10, fixedNum);
  },



  billStatus: (d) => {
    if (d !== undefined && d !== null) {
        if (d === 'success')return '已完成';
        if (d === 'wait_confirmed')return '处理中';
        if (d === 'failed')return '交易失败';
    }
    return d;
  },

  waitHoldStatus: (d) => {
    if (d !== undefined && d !== null) {
      if (d === 'sign_after_aging') return '放款后自动签约';
      if (d === 'signed') return '签约完成';
      if (d === 'signing') return '签约审核中';
      if (d === 'sign_failed') return '签约失败';
      if (d === 'un_sign') return '未签订';
    }
    return d;

  },

  fundType: (d) => {
    if (d !== undefined && d !== null) {
      if (d === 'person_pingan') return '银行卡';
      if (d === 'person_alipay') return '支付宝';
    }
    return d;
  },
  //Coupon
  couponType: (d) => {
    if (d !== undefined && d !== null) {
      if (d === 'red_envelope') return '红包';
      if (d === 'shop_coupon') return '优惠券';
      if (d === 'service_fee_discount') return '还款券'
    }
    return d;
  },
  investmentBefore:(d) => {
    if (d !== undefined && d !==null) {
       if (d === true) return '是';
       if (d === false) return '否';
    }
    return d;
  },
  //还款计划过滤器
  scheduleStatus: (d) => {
    if (d !== undefined && d !== null) {
      if (d === 'wait_to_receive')return '等待回款';
      if (d === 'invest_finished')return '已回款';
    }
    return d;
  },

  // 还款类型
  scheduleType: (d) => {
    if (d !== undefined && d !== null) {
      if (d === 'acpi') return '等额本息';
      if (d === 'aecl')return '等额本金';
      if (d === 'fiaa') return '先息后本';
      if (d === 'epei')return '等本等息';
      if (d === 'mopai') return '到期还本付息';

    }
    return d;
  },

  //加入我们过滤器
  joinusStatus: (d) => {
    if (d !== undefined && d !== null) {
      if (d === 'audit_pass') return '你已经加入我们！';
      if (d === 'audit_fail') return '你已申请加入我们, 但审核失败！';
      if (d === 'wait_audit') return '你已申请加入我们, 申请正在审核中';
    }
    return d;
  },

  sex: (d) => {
    if (d !== undefined && d !== null) {
      if (d == '1') return '男';
      if (d == '0') return '女';
    }
    return d;
  },

  numShortHand: (targetNum) =>{
    var num = targetNum;
    var numRange = 0;
    var unit = '';

    if (void 0 === num || 0 === num) {
      return num;
    }

    if (targetNum > 100000) {

      if (targetNum > 100000000) {
        num = targetNum / Math.pow(10, 8);
        numRange = 2;
      } else {
        num = targetNum / Math.pow(10, 4);
        numRange = 1;
      }
    }

    switch (numRange) {
      case 1:
        unit = '万';
        break;
      case 2:
        unit = '亿';
        break;
      default :
        unit = '';
        break;
    }

    num = num + '';

    var arr = num.split('.'), reg = /(-?\d+)(\d{3})/;
    while (reg.test(arr[0])) {
      arr[0] = arr[0].replace(reg, '$1,$2');
    }
    if (1 < arr.length) {
        arr[1] = Math.round(Number('0.' + arr[1]) * Math.pow(10, 2));
        num = arr[0] + '.';
      if (0 < arr[1] && 10 > arr[1]) {
        num += '0' + arr[1];
      } else {
        num += arr[1];
      }

      return num + unit;
    }
    return arr[0] + unit;
  },

  // 过滤器：百分比
  percentage: (value,unit) => {
    var unit = unit || '%';
    var res = value || '';
    if (isNaN(res)) {
        return '--';
    }
    var calValue = Math.round(res * Math.pow(10, 4)) / Math.pow(10, 2);
    if (1000 < calValue) {
        calValue = Math.round(calValue);
    }
    if (5000 < calValue) {
        res = '>' + 5000 + unit;
    } else {
        res = calValue + unit;
    }
    return res;
  },

  // 标的状态
   financeStatus:(d) => {
      if (d !== undefined && d !== null) {
         if (d === 'new_p') return '新人专享';
         if (d === 'hot') return '热门标';
         if (d === "earn_double") return '双倍收益';
      }
     return d;
   },

   timeUnitStatus: (d) => {
      if (d !== undefined && d !== null) {
         if (d == 'day') return '天';
         if (d == 'month') return '个月';
         if (d == 'year')   return '年';
      }
      return d;
  },
  timeCycle:(d) => {
    if (d !== undefined && d !== null) {
      if (d == '0') {
      return '暂无';
    }else {
      return d+'个月';
    }
    }
    return d;
  },

  moneyFixed2: (d) => {
     if (d === undefined || d === null || d == 0) {
        return '0.00';
     }
     return parseFloat(d).toFixed(2);
  },

};

module.exports = Filters;
