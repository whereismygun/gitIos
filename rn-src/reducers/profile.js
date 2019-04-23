/**
 *
 *
 * @flow
 *
 */

'use strict';

import type {
    Action
} from '../actions/types';

type State = {
    ewalletInfo:Object;
    status:Object;
};

const initialState: State = {
    ewalletInfo:{},
    status:null,
  
};

function profile(state: State = initialState, action: Action): State {
  
    switch (action.type) {
      case 'LOGOUT':
          return {
              ...state,
              ewalletInfo: {},
          };
      case 'GET_EWALLET_INFO':
          return {
              ...state,
              ewalletInfo: action.data
          };
       case 'INCOME_INFO':   
           return {
               ...state,
              myIncome:action.myIncome
           };
        default:
        return state;
    }
}


module.exports = profile;
