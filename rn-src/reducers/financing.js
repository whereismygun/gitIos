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
    investPurchaseList: Array,
    receivePurchaseList: Array,
    borrowUnderlyNewList: Array,
};

const initialState: State = {
    investPurchaseList: [],
    receivePurchaseList: [],
    borrowUnderlyNewList: [],
};

function financing(state: State = initialState, action: Action): State {
    switch (action.type) {
      case 'LOGOUT':
          return {
              ...state,
              investPurchaseList: [],
          };
      case 'BORROW_UNDERLY_NEW_LIST':
          return {
              ...state,
              borrowUnderlyNewList: action.items
          };
      case 'INVEST_PURCHASE_LIST':
          return {
              ...state,
              investPurchaseList: action.items
          };
      case 'RECEIVE_PURCHASE_LIST':
          return {
              ...state,
              receivePurchaseList: action.items
          };
        default:
            return state;
    }
}




module.exports = financing;
