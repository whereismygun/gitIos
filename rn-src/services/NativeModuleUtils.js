/**
 *
 *
 * @providesModule NativeModuleUtils
 * @flow
 *
 */

'use strict';

const env = require('env');

import {
  Platform,
}
from 'react-native';

const Utils = require('Utils');

import {
  getUDID,
}
from 'fly-react-native-udid';


import {
  openURL,
  getBundleInfo,
  phoneCall,
  pasteBoard,
  getDeviceToken,
  getCurrentDevice,
  openLocationURL
}
from 'fly-react-native-app-info';

// import {
//   showImagePicker,
// } from 'fly-react-native-camera';

import ImagePicker from 'fly-react-native-camera';

import Contacts from 'fly-react-native-contacts';


import {
  initAmaplocation,
  removeAmaplocation,
  getCurrentPosition,
}
from 'fly-react-native-amaplocation';

import {
  initUmeng,
}
from 'fly-react-native-umeng';

import {
  initWeixin,
}
from 'fly-react-native-weixin';

import {
  initQQ,
}
from 'fly-react-native-qq';

import {
  initWeibo,
}
from 'fly-react-native-weibo';


const NativeModuleUtils = {
  initNativeModules: () => {
    // amap
    initAmaplocation();

    // Umeng
    initUmeng();

    // Weixin
    initWeixin();

    // QQ
    initQQ();

    // Weibo
    initWeibo();

  },

  removeNativeModules: () => {
    removeAmaplocation();
  },

  // 获得定位信息
  getLocation: (onSuccess, onError) => {
    getCurrentPosition().then((data) => {
        onSuccess(data);
    }).catch((err) => {
        onError(err);
    });
  },

  phoneCall: (phoneNum) => {
    phoneCall(phoneNum);
  },

  pasteBoard: (pasteStr) => {
    pasteBoard(pasteStr);
  },

  openURL: (url) => {
    openURL(url);
  },

  // openLocationURL: (url) => {
  //   openLocationURL(url);
  // },


  contactUs: (sdkToken, userInfo) => {
    contactUs(sdkToken, userInfo);
  },


  getUDID: (onSuccess) => {
    getUDID(onSuccess);
  },

  getDeviceToken: (onSuccess) => {
    getDeviceToken(onSuccess);
  },

  getCurrentDevice: (onSuccess) => {
    getCurrentDevice(onSuccess);
  },

  showImagePicker: (type, options, onSuccess) => {
    switch (type) {
    case 'launchCamera':
      ImagePicker.launchCamera(options, onSuccess);
      break;
    case 'launchImageLibrary':
      ImagePicker.launchImageLibrary(options, onSuccess);
      break;
    default:
      ImagePicker.showImagePicker(options, onSuccess);
    }
  },

  getCookie: (url, onSuccess) => {
    get(url, onSuccess);
  },


  getContacts: (onSuccess, onError) => {
    Contacts.getAll((err, contacts) => {
      if (err && err.type) {
        if (onError) {
          onError(err);
        } else {
          let msg = "";
          err.type === 'permissionDenied'
          if (Platform.OS === 'ios') {
            msg = "未获得通讯录授权，请在系统[设置]-[隐私]-[通讯录]中设置允许[零零期]使用通讯录。";
          } else {
            msg =
              "未获得通讯录授权，请在系统[设置]-[应用管理]-[零零期]-[权限管理]中设置允许其[获取联系人信息]。";
          }
          let data = {
            type:'permissionDenied',
            msg:msg
          };
          onError && onError(err);
        }
      } else {
        let contactsList = [],
          eachContact;
        if (contacts && contacts.length > 0) {
          for (let i = 0; i < contacts.length; i++) {
            eachContact = contacts[i];
            contactsList.push({
              frName: getName(eachContact),
              company: getCompany(eachContact.company),
              phone: getPhones(eachContact.phoneNumbers),
              otherInfo: getOtherInfo(eachContact)
            });
          }
        }
        onSuccess && onSuccess(contactsList);
      }
    });

    function getCompany(comp) {
      let company = null;
      if (comp) {
        company = comp;
      }
      return company;
    }

    function getName(eachContact) {
      let name;
      if (eachContact.familyName) {
        name = eachContact.familyName + eachContact.givenName;
      } else {
        name = eachContact.givenName;
      }
      return name;
    }

    function getPhones(phones) {

      let number = null;
      if (phones && phones.length > 0) {
        number = "";
        for (let i = 0; i < phones.length; i++) {
          if (i > 0) {
            number = number + ";";
          }
          number = number + phones[i];
        }
      }

      return number;

    }

    function getOtherInfo(eachContact) {
      let info = {};
      if (eachContact.note) {
        info['note'] = eachContact.note;
      }
      if (eachContact.address && eachContact.address.length > 0) {
        info['addresses'] = eachContact.address;
      }
      if (eachContact.emailAddresses && eachContact.emailAddresses.length >
        0) {
        info['emails'] = eachContact.emailAddresses;
      }
      if (eachContact.jobTitle) {
        info['jobTitle'] = eachContact.jobTitle;
      }
      return JSON.stringify(info);

    }
  },

  getContact: (onSuccess) => {
    Contacts.pickContact(onSuccess);
  },

  getBundleInfo: (onSuccess) => {
    getBundleInfo(onSuccess);
  },

};

module.exports = NativeModuleUtils;
