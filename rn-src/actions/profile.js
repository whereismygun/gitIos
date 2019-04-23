/**
 *
 *
 * @flow
 *
 */

'use strict';

import React from 'react';
import { Platform } from 'react-native';

import type { Action, ThunkAction } from './types';

var Utils = require('Utils');
var NetworkService = require('NetworkService');

function getEwallet(ignoreLogin): ThunkAction {
    return (dispatch, getState) => {

        let conf = {
            url: 'getEwallet',
            ignoreLogin:ignoreLogin,
        };

        let onSuccess = (data, dispatch) => {
          dispatch({type: "GET_EWALLET_INFO",data});
          return Promise.resolve(data);
        };

        let onFailure = (error, dispatch) => {
          return Promise.reject(error);
        };

        return dispatch(NetworkService.fetch(conf, onSuccess, onFailure))

    };
}
 function doSaveUserSuggestion(contentText): ThunkAction {

      return (dispatch,getState) => {

         let conf = {
           url:'saveSuggestion',
           params:{
             content:contentText,
             title:'',
           },
           method:'POST',
          //  isForm:true,
         }

         let onSuccess = (data,dispatch) => {

           return Promise.resolve(data);
         }
         let onFailure = (error,dispatch) => {

           return Promise.reject(error);
         }

         return dispatch(NetworkService.fetch(conf,onSuccess,onFailure));

      }

 }

function userGetApply():ThunkAction{

  return (dispatch,getState) => {
       let conf={
         url:'getApply',
         method:'GET'
       }

       let onSuccess = (data,dispatch) => {

         return Promise.resolve(data);
       }
       let onFailure = (error,dispatch) => {
         return Promise.reject(error);
       }
       return dispatch(NetworkService.fetch(conf,onSuccess,onFailure));
       }
  }

  function updateMessageToRead(id):ThunkAction{
    return (dispatch,getState) => {

      let params ={
         messageId:id
      }
      let conf ={
         url:'updateMessageToRead',
         params:params
      }
      let onSuccess = (data,dispatch) =>{
        return Promise.resolve(data);
      }
      let onFailure = (error,dispatch) => {
        return Promise.reject(error);
      }

      return dispatch(NetworkService.fetch(conf,onSuccess,onFailure));

    }
  }

  function queryPushMsgData(): ThunkAction {
      return (dispatch,getState)=>{
          let params = {
              isForm : true,
              limit :'10',
              offset:'1'
          }
         let conf = {
           url:'queryPushMsg',
           params : params,
         }

        let onSuccess = (data,dispatch)=>{
             let MsgCount = data.items.length
             dispatch({
               type:'MSG_INFO_COUNT',
               MsgCount:MsgCount
             });
          return Promise.resolve(data);
        }
        let onFailure = (data,dispatch)=>{
          return Promise.reject(error);
        }

        return dispatch(NetworkService.fetch(conf,onSuccess,onFailure));

      }

  }

function getDelegate():ThunkAction {

    return (dispatch,getState) => {
    let conf = {
      url:'getDelegate',

    }
    let onSuccess = (data,dispatch) => {

      return Promise.resolve(data);
    }
    let onFailure = (error,dispatch) => {

      return Promise.reject(error);
    }
     return dispatch(NetworkService.fetch(conf,onSuccess,onFailure));
    }


}





function getBankList(validCode,cardInfoId): ThunkAction {
    return (dispatch, getState) => {

        let conf = {
            url: 'getBankList',
        };

        let onSuccess = (data, dispatch) => {
            return Promise.resolve(data);
        };

        let onFailure = (error, dispatch) => {
            return Promise.reject(error)
        };

        return dispatch(NetworkService.fetch(conf, onSuccess, onFailure))

    };
}

function Apply(params):ThunkAction{

   return (dispatch,getState) => {
      let conf = {
            url:'setApply',
            isForm:true,
            method:'POST',
            params:params
      }
      let onSuccess = (data,dispatch) => {

        return Promise.resolve(data);
      }
      let onFailure = (error,dispatch) => {
         return Promise.reject(error);
      }
      return dispatch(NetworkService.fetch(conf,onSuccess,onFailure));
   }


}

function reApply(params): ThunkAction {
    return (dispatch, getState) => {

        let conf = {
            url: 'modifyApply',
            isForm:true,
            method:'POST',
            params:params
        };

        let onSuccess = (data, dispatch) => {
            return Promise.resolve(data);
        };

        let onFailure = (error, dispatch) => {
            return Promise.reject(error)
        };

        return dispatch(NetworkService.fetch(conf, onSuccess, onFailure))

    };
}

function confirmBind(params): ThunkAction {
    return (dispatch, getState) => {

        let conf = {
            url: 'confirmBind',
            params:params,
            method:'POST',
            isForm:true
        };

        let onSuccess = (data, dispatch) => {
            return Promise.resolve(data);
        };

        let onFailure = (error, dispatch) => {
            return Promise.reject(error)
        };

        return dispatch(NetworkService.fetch(conf, onSuccess, onFailure))

    };
}


function activateSinaUser(params): ThunkAction {
    return (dispatch, getState) => {

        let conf = {
            url: 'activateSinaUser',
        };

        let onSuccess = (data, dispatch) => {
            return Promise.resolve(data);
        };

        let onFailure = (error, dispatch) => {
            return Promise.reject(error)
        };

        return dispatch(NetworkService.fetch(conf, onSuccess, onFailure))

    };
}



function queryUserReceivingAmount(params): ThunkAction {
    return (dispatch, getState) => {

        let conf = {
            url: 'queryUserReceivingAmount',
        };

        let onSuccess = (data, dispatch) => {
            return Promise.resolve(data);
        };

        let onFailure = (error, dispatch) => {
            return Promise.reject(error)
        };

        return dispatch(NetworkService.fetch(conf, onSuccess, onFailure))

    };
}

function getMyIncomeInfo(ignoreLogin): ThunkAction {
    return (dispatch, getState) => {

        let conf = {
            url: 'getMyIncomeInfo',
            ignoreLogin:ignoreLogin
        };

        let onSuccess = (data, dispatch) => {

             dispatch({
               type:'INCOME_INFO',
               myIncome:data
             });

            return Promise.resolve(data);
        };

        let onFailure = (error, dispatch) => {
            return Promise.reject(error)
        };

        return dispatch(NetworkService.fetch(conf, onSuccess, onFailure))

    };
}

function queryReceivedScheduleInfo(userInvestmentId): ThunkAction {
    return (dispatch, getState) => {

        let conf = {
            url: 'queryReceivedScheduleInfo',
            params:{
              userInvestmentId:userInvestmentId
            }
        };

        let onSuccess = (data, dispatch) => {
            return Promise.resolve(data);
        };

        let onFailure = (error, dispatch) => {
            return Promise.reject(error)
        };

        return dispatch(NetworkService.fetch(conf, onSuccess, onFailure))

    };



}

function updatePassword(params): ThunkAction {
    return (dispatch, getState) => {

        let conf = {
            url: 'updatePassword',
            method:'POST',
            isForm:true,
            params:params
        };

        let onSuccess = (data, dispatch) => {
            return Promise.resolve(data);
        };

        let onFailure = (error, dispatch) => {
            return Promise.reject(error)
        };

        return dispatch(NetworkService.fetch(conf, onSuccess, onFailure))

    };
}


 function generalizeSearch(typeID): ThunkAction {
   return (dispatch,getState) => {

     let conf = {
          url:'generalizeSearch',
          params:{
            type:typeID
          }
     };
     let onSuccess = (data,dispatch) =>{

        return Promise.resolve(data);
     }
     let onFailure = (error,dispatch) => {
        return Promise.reject(error);
     }
     return dispatch(NetworkService.fetch(conf,onSuccess,onFailure))
   };

 }

function getInviteFriendUrl(): ThunkAction {
    return (dispatch, getState) => {

        let conf = {
            url: 'getInviteFriendUrl',
        };

        let onSuccess = (data, dispatch) => {
            return Promise.resolve(data);
        };

        let onFailure = (error, dispatch) => {
            return Promise.reject(error)
        };

        return dispatch(NetworkService.fetch(conf, onSuccess, onFailure))

    };
}

function getInviteFriendList(): ThunkAction {
    return (dispatch, getState) => {

        let conf = {
            url: 'getInviteFriendList',
            ignoreLogin:true
        };

        let onSuccess = (data, dispatch) => {
            return Promise.resolve(data);
        };

        let onFailure = (error, dispatch) => {
            return Promise.reject(error)
        };

        return dispatch(NetworkService.fetch(conf, onSuccess, onFailure))

    };
}

function investXieyi(id): ThunkAction {
    return (dispatch, getState) => {

        let conf = {
            url: 'investXieyi',
            params:{
              invest_id:id
            }
        };

        let onSuccess = (data, dispatch) => {
            return Promise.resolve(data);
        };

        let onFailure = (error, dispatch) => {
            return Promise.reject(error)
        };

        return dispatch(NetworkService.fetch(conf, onSuccess, onFailure))

    };
}

function getSpreeSpredUrl():ThunkAction {
  return (dispatch, getState) => {

      let conf = {
          url: 'getSpreeSpredUrl'
      };

      let onSuccess = (data, dispatch) => {
          return Promise.resolve(data);
      };

      let onFailure = (error, dispatch) => {
          return Promise.reject(error)
      };

      return dispatch(NetworkService.fetch(conf, onSuccess, onFailure))

  };
}

function updateMessageToAllRead():ThunkAction {

    return (dispatch, getState) => {
          let conf = {
              url: 'updateMessageToAllRead'
          };
          let onSuccess = (data, dispatch) => {
           dispatch({
               type:'MSG_COUNT',
               MsgCount:0
             });
              return Promise.resolve(data);
          };
          let onFailure = (error, dispatch) => {
              return Promise.reject(error)
          };

          return dispatch(NetworkService.fetch(conf, onSuccess, onFailure))

      }

}

function getInviteSpreeList():ThunkAction {

  return (dispatch, getState) => {

      let conf = {
          url: 'getInviteSpreeList'
      };

      let onSuccess = (data, dispatch) => {
          return Promise.resolve(data);
      };

      let onFailure = (error, dispatch) => {
          return Promise.reject(error)
      };

      return dispatch(NetworkService.fetch(conf, onSuccess, onFailure))

  }
}

function getMonthRepaymentInfo(month):ThunkAction{

   return (dispatch,getState) => {
      let conf = {
            url:'getMonthRepaymentInfo',
            ignoreLogin:false,
            params:{
              month:month
            }
      }
      let onSuccess = (data,dispatch) => {

        return Promise.resolve(data);
      }
      let onFailure = (error,dispatch) => {
         return Promise.reject(error);
      }
      return dispatch(NetworkService.fetch(conf,onSuccess,onFailure));
   }


}

function annualStatistics(offset,limit):ThunkAction{

   return (dispatch,getState) => {
      let conf = {
            url:'annualStatistics',
            ignoreLogin:false,
            params:{
              offset:offset,
              limit:limit
            }
      }
      let onSuccess = (data,dispatch) => {

        return Promise.resolve(data);
      }
      let onFailure = (error,dispatch) => {
         return Promise.reject(error);
      }
      return dispatch(NetworkService.fetch(conf,onSuccess,onFailure));
   }


}



function activateMTUser(params):ThunkAction{

   return (dispatch,getState) => {
      let conf = {
            url:'activateMTUser',
            method:'POST',
            params:params,
            
      }
      let onSuccess = (data,dispatch) => {

        return Promise.resolve(data);
      }
      let onFailure = (error,dispatch) => {
         return Promise.reject(error);
      }
      return dispatch(NetworkService.fetch(conf,onSuccess,onFailure));
   }


}
   




function repaymentDayDetail(day):ThunkAction{

   return (dispatch,getState) => {
      let conf = {
            url:'repaymentDayDetail',
            ignoreLogin:false,
            params:{
              day:day
            }
      }
      let onSuccess = (data,dispatch) => {

        return Promise.resolve(data);
      }
      let onFailure = (error,dispatch) => {
         return Promise.reject(error);
      }
      return dispatch(NetworkService.fetch(conf,onSuccess,onFailure));
   }


}
function searchBankCardByBankName(params):ThunkAction{

   return (dispatch,getState) => {
      let conf = {
            url:'searchBankCardByBankName',
            params:params,
            method:'POST',
            isForm:true,
      }
      let onSuccess = (data,dispatch) => {

        return Promise.resolve(data);
      }
      let onFailure = (error,dispatch) => {
         return Promise.reject(error);
      }
      return dispatch(NetworkService.fetch(conf,onSuccess,onFailure));
   }


}

function sendMTBindCardCode(params):ThunkAction{

   return (dispatch,getState) => {
      let conf = {
            url:'sendMTBindCardCode',
            params:params,
      }
      let onSuccess = (data,dispatch) => {

        return Promise.resolve(data);
      }
      let onFailure = (error,dispatch) => {
         return Promise.reject(error);
      }
      return dispatch(NetworkService.fetch(conf,onSuccess,onFailure));
   }

}

function getPasswordFactor():ThunkAction{

   return (dispatch,getState) => {
      let conf = {
            url:'getPasswordFactor',
      }
      let onSuccess = (data,dispatch) => {

        return Promise.resolve(data);
      }
      let onFailure = (error,dispatch) => {
         return Promise.reject(error);
      }
      return dispatch(NetworkService.fetch(conf,onSuccess,onFailure));
   }

}



function chargeUserAccount(params):ThunkAction{

   return (dispatch,getState) => {
      let conf = {
            url:'chargeUserAccount',
            params:params,
      }
      let onSuccess = (data,dispatch) => {

        return Promise.resolve(data);
      }
      let onFailure = (error,dispatch) => {
         return Promise.reject(error);
      }
      return dispatch(NetworkService.fetch(conf,onSuccess,onFailure));
   }

}



function WithdrawInfo():ThunkAction{

   return (dispatch,getState) => {
      let conf = {
            url:'WithdrawInfo',
      }
      let onSuccess = (data,dispatch) => {

        return Promise.resolve(data);
      }
      let onFailure = (error,dispatch) => {
         return Promise.reject(error);
      }
      return dispatch(NetworkService.fetch(conf,onSuccess,onFailure));
   }

}

function withdrawUserAccount(params):ThunkAction{

   return (dispatch,getState) => {
      let conf = {
            url:'withdrawUserAccount',
            method:'POST',
            isForm:true,
            params:params,
      }
      let onSuccess = (data,dispatch) => {

        return Promise.resolve(data);
      }
      let onFailure = (error,dispatch) => {
         return Promise.reject(error);
      }
      return dispatch(NetworkService.fetch(conf,onSuccess,onFailure));
   }

}

function unbindBankCard(params):ThunkAction{

   return (dispatch,getState) => {
      let conf = {
            url:'unbindBankCard',
            method:'POST',
            isForm:true,
            params:params,
      }
      let onSuccess = (data,dispatch) => {

        return Promise.resolve(data);
      }
      let onFailure = (error,dispatch) => {
         return Promise.reject(error);
      }
      return dispatch(NetworkService.fetch(conf,onSuccess,onFailure));
   }

}

function buyAgent(params):ThunkAction{

   return (dispatch,getState) => {
      let conf = {
            url:'buyAgent',
            params:params,
      }
      let onSuccess = (data,dispatch) => {

        return Promise.resolve(data);
      }
      let onFailure = (error,dispatch) => {
         return Promise.reject(error);
      }
      return dispatch(NetworkService.fetch(conf,onSuccess,onFailure));
   }

}
function updatePayPass(params):ThunkAction{

   return (dispatch,getState) => {
      let conf = {
            url:'updatePayPass',
            method:'POST',
            isForm:true,
            params:params,
      }
      let onSuccess = (data,dispatch) => {

        return Promise.resolve(data);
      }
      let onFailure = (error,dispatch) => {
         return Promise.reject(error);
      }
      return dispatch(NetworkService.fetch(conf,onSuccess,onFailure));
   }

}
function resetPassword(params):ThunkAction{

   return (dispatch,getState) => {
      let conf = {
            url:'resetPassword',
            method:'POST',
            isForm:true,
            params:params,
      }
      let onSuccess = (data,dispatch) => {

        return Promise.resolve(data);
      }
      let onFailure = (error,dispatch) => {
         return Promise.reject(error);
      }
      return dispatch(NetworkService.fetch(conf,onSuccess,onFailure));
   }

}



function getElectaccount():ThunkAction{

   return (dispatch,getState) => {
      let conf = {
            url:'getElectaccount',
      }
      let onSuccess = (data,dispatch) => {

        return Promise.resolve(data);
      }
      let onFailure = (error,dispatch) => {
         return Promise.reject(error);
      }
      return dispatch(NetworkService.fetch(conf,onSuccess,onFailure));
   }

}

function sendPaySmsCode(params):ThunkAction{

   return (dispatch,getState) => {
      let conf = {
            url:'sendPaySmsCode',
      }
      let onSuccess = (data,dispatch) => {

        return Promise.resolve(data);
      }
      let onFailure = (error,dispatch) => {
         return Promise.reject(error);
      }
      return dispatch(NetworkService.fetch(conf,onSuccess,onFailure));
   }

}
function forgetPasswordVerification(params):ThunkAction{

   return (dispatch,getState) => {
      let conf = {
            url:'forgetPasswordVerification',
            method:'POST',
            isForm:true,
            params:params,
      }
      let onSuccess = (data,dispatch) => {

        return Promise.resolve(data);
      }
      let onFailure = (error,dispatch) => {
         return Promise.reject(error);
      }
      return dispatch(NetworkService.fetch(conf,onSuccess,onFailure));
   }

}

function sendCode():ThunkAction{

   return (dispatch,getState) => {
      let conf = {
            url:'sendCode',
            }
      let onSuccess = (data,dispatch) => {

        return Promise.resolve(data);
      }
      let onFailure = (error,dispatch) => {
         return Promise.reject(error);
      }
      return dispatch(NetworkService.fetch(conf,onSuccess,onFailure));
   }

}
function sitePayPass(params):ThunkAction{

   return (dispatch,getState) => {
      let conf = {
            url:'sitePayPass',
            params:params,
            method:'POST',
            isForm:true,
            }
      let onSuccess = (data,dispatch) => {

        return Promise.resolve(data);
      }
      let onFailure = (error,dispatch) => {
         return Promise.reject(error);
      }
      return dispatch(NetworkService.fetch(conf,onSuccess,onFailure));
   }

}


function checkUserOCRToMT():ThunkAction{

   return (dispatch,getState) => {
      let conf = {
            url:'checkUserOCRToMT',
            }
      let onSuccess = (data,dispatch) => {

        return Promise.resolve(data);
      }
      let onFailure = (error,dispatch) => {
         return Promise.reject(error);
      }
      return dispatch(NetworkService.fetch(conf,onSuccess,onFailure));
   }

}

 function deliverImageToMT():Action{
       return (dispatch,getState) => {
      let conf = {
            url:'deliverImageToMT',
            }
      let onSuccess = (data,dispatch) => {

        return Promise.resolve(data);
      }
      let onFailure = (error,dispatch) => {
         return Promise.reject(error);
      }
      return dispatch(NetworkService.fetch(conf,onSuccess,onFailure));
   }


 }

  function chargeFromEAccount(params):Action{
       return (dispatch,getState) => {
      let conf = {
            url:'chargeFromEAccount',
            params:params
            }
      let onSuccess = (data,dispatch) => {

        return Promise.resolve(data);
      }
      let onFailure = (error,dispatch) => {
         return Promise.reject(error);
      }
      return dispatch(NetworkService.fetch(conf,onSuccess,onFailure));
   }


 }




 


module.exports = {
  getEwallet,getBankList,
  confirmBind,activateSinaUser,queryPushMsgData,
  getDelegate,Apply,doSaveUserSuggestion,queryUserReceivingAmount,getMyIncomeInfo,
  queryReceivedScheduleInfo,updatePassword,updateMessageToRead,
  getInviteFriendUrl,updateMessageToAllRead,investXieyi,reApply,
  repaymentDayDetail,getInviteSpreeList,getInviteFriendList,activateMTUser,
  userGetApply,annualStatistics,generalizeSearch,getSpreeSpredUrl,getMonthRepaymentInfo,
  searchBankCardByBankName,sendMTBindCardCode,getPasswordFactor,
  chargeUserAccount,WithdrawInfo,withdrawUserAccount,unbindBankCard,buyAgent,updatePayPass,
  sendPaySmsCode,forgetPasswordVerification,sendCode,sitePayPass,resetPassword,checkUserOCRToMT,
  deliverImageToMT,getElectaccount,chargeFromEAccount

};
