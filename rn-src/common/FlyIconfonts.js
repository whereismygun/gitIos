/**
 *
 *
 * @providesModule FlyIconfonts
 * @flow
 *
 */

'use strict';

import {
  createIconSet
}
from 'fly-react-native-vector-icons';

const iconMap = {

  "icon-right-arrow-double": 58880,

  "nav-aging": 58895,
  "nav-aging-active": 58893,

  "icon-left-arrow-l": 58883,
  "icon-right-arrow-l": 58885,
  "icon-cancel":58890,
  "icon-t":58891,
  "icon-down1":58894,


  "icon-up":58884,
  "icon-down":58897,

  "icon-share": 58881,

  "icon-left-arrow-m": 58888,
  "icon-right-arrow-m": 58889,
  "icon-cream": 58898,
  "icon-search-bank": 58899,
  "icon-warning": 58900,
  "icon-eyes": 58901,
  "icon-lock": 58902,
  "icon-lock-repeat":58908,
  "icon-invite":58907,
  "icon-msg": 58903,
  "icon-user": 58904,
  "icon-open-eye": 58905,

};

let Iconfonts = createIconSet(iconMap, 'iconfont', null, iconMap["icon-empay"]);

module.exports = Iconfonts;
module.exports.iconMap = iconMap;
