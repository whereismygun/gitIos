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
    noticeInfo:Array<Object>;
};

const initialState: State = {
    noticeInfo:[],

};

function discovery(state: State = initialState, action: Action): State {
    switch (action.type) {
      case 'LOGOUT':
          return {
              ...state,
              noticeInfo: [],
          };
      case 'LOADED_NOTICE_INFO':
          return {...state, noticeInfo: action.list};
        default:
            return state;
    }
}


module.exports = discovery;
