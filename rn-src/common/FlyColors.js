/**
 *
 *
 * @providesModule FlyColors
 * @flow
 *
 */

'use strict';

var pad = (num, totalChars) => {
  var pad = '0';
  num = num + '';
  while (num.length < totalChars) {
    num = pad + num;
  }
  return num;
};

// Ratio is between 0 and 1
var changeColor = (color, ratio, darker) => {
  // Trim trailing/leading whitespace
  color = color.replace(/^\s*|\s*$/, '');

  // Expand three-digit hex
  color = color.replace(
    /^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i,
    '#$1$1$2$2$3$3'
  );

  // Calculate ratio
  var difference = Math.round(ratio * 256) * (darker ? -1 : 1),
    // Determine if input is RGB(A)
    rgb = color.match(new RegExp('^rgba?\\(\\s*' +
      '(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
      '\\s*,\\s*' +
      '(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
      '\\s*,\\s*' +
      '(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
      '(?:\\s*,\\s*' +
      '(0|1|0?\\.\\d+))?' +
      '\\s*\\)$', 'i')),
    alpha = !!rgb && rgb[4] != null ? rgb[4] : null,

    // Convert hex to decimal
    decimal = !!rgb ? [rgb[1], rgb[2], rgb[3]] : color.replace(
      /^#?([a-f0-9][a-f0-9])([a-f0-9][a-f0-9])([a-f0-9][a-f0-9])/i,
      function () {
        return parseInt(arguments[1], 16) + ',' +
          parseInt(arguments[2], 16) + ',' +
          parseInt(arguments[3], 16);
      }
    )
    .split(/,/),
    returnValue;

  // Return RGB(A)
  return !!rgb ?
    'rgb' + (alpha !== null ? 'a' : '') + '(' +
    Math[darker ? 'max' : 'min'](
      parseInt(decimal[0], 10) + difference, darker ? 0 : 255
    ) + ', ' +
    Math[darker ? 'max' : 'min'](
      parseInt(decimal[1], 10) + difference, darker ? 0 : 255
    ) + ', ' +
    Math[darker ? 'max' : 'min'](
      parseInt(decimal[2], 10) + difference, darker ? 0 : 255
    ) +
    (alpha !== null ? ', ' + alpha : '') +
    ')' :
    // Return hex
        [
            '#',
            pad(Math[darker ? 'max' : 'min'](
          parseInt(decimal[0], 10) + difference, darker ? 0 : 255
        )
        .toString(16), 2),
            pad(Math[darker ? 'max' : 'min'](
          parseInt(decimal[1], 10) + difference, darker ? 0 : 255
        )
        .toString(16), 2),
            pad(Math[darker ? 'max' : 'min'](
          parseInt(decimal[2], 10) + difference, darker ? 0 : 255
        )
        .toString(16), 2)
        ].join('');
};

const lighter = (color, ratio) => changeColor(color, ratio, false);
const darker = (color, ratio) => changeColor(color, ratio, false);

const DefaultBrandColor = {
  brandPrimary: '#337AB7',
  brandSuccess: '#5CB85C',
  brandInfo: '#5BC0DE',
  brandWarning: '#F0AD4E',
  brandDanger: '#D9534F',
};

const BaseColor = '#FF9759';

const FlyColors = {
  noticeText: '#34a0e7',
  noticeView: '#fdf1af',
  black: '#333333',
  white: '#FFFFFF',
  blue_green: '#00DDDD',
  explainColor: '#00FF00',
  aboutColor: '#00BBFF',
  usColor: '#FF0088',
  lightGreen: '#0fdd0f',
  deepGreen: '#55aa00',
  deepBlue:'',

  whiteBg: 'rgba(255,255,255,0.2)',

  baseColor: BaseColor,
  baseBorderColor: '#D8D8D8',
  baseBorderColor2: '#CCCCCC',
  baseBackgroundColor: '#F2F2F2',
  baseBackgroundColor2: '#999999',
  baseTextColor: '#333333',
  baseTextColor2: '#999999',
  baseTextColor3: '#F2F2F2',
  baseTextColor4:'#666666',
  

  errorTextColor: '#FF2D2D',
  errorBackground: 'rgba(217, 83, 79, 0.2)',
  toolbarTextColor: '#2828FF',
  baseBlueColor: '#006CB1',

  placeholderTextColor: '#CCCCCC',

  ...DefaultBrandColor,

  btnDefaultColor: '#333333',
  btnDefaultBg: '#FFFFFF',
  btnDefaultBorder: '#CCCCCC',

  btnBaseColor: '#FFFFFF',
  btnBaseBg: BaseColor,
  btnBaseBorder: darker(BaseColor, 0.05),

  btnPrimaryColor: '#FFFFFF',
  btnPrimaryBg: DefaultBrandColor.brandPrimary,
  btnPrimaryBorder: darker(DefaultBrandColor.brandPrimary, 0.05),

  btnSuccessColor: '#FFFFFF',
  btnSuccessBg: DefaultBrandColor.brandSuccess,
  btnSuccessBorder: darker(DefaultBrandColor.brandSuccess, 0.05),

  btnInfoColor: '#FFFFFF',
  btnInfoBg: DefaultBrandColor.brandInfo,
  btnInfoBorder: darker(DefaultBrandColor.brandInfo, 0.05),

  btnWarningColor: '#FFFFFF',
  btnWarningBg: DefaultBrandColor.brandWarning,
  btnWarningBorder: darker(DefaultBrandColor.brandWarning, 0.05),

  btnDangerColor: '#FFFFFF',
  btnDangerBg: DefaultBrandColor.brandDanger,
  btnDangerBorder: darker(DefaultBrandColor.brandDanger, 0.05),

  btnLinkColor: '#333333',
  btnLinkDisabledColor: '#777777',
  btnLinkBg: 'transparent',
  btnLinkBgTtl:'#F9F9F9',


  lighter: lighter,
  darker: darker,

};

module.exports = FlyColors;
