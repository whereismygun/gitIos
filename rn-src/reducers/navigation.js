/**
 *
 *
 * @flow
 *
 */

'use strict';

import type {Action} from '../actions/types';

export type Tab =
    'enter'
  | 'financing'
  | 'discovery'
  | 'profile'
  ;

type State = {
  tab: Tab,
  tabProps: Object,
  skipIntro: boolean;
};

const initialState: State = {
  tab: 'enter',
  skipIntro: false,
};

function navigation(state: State = initialState, action: Action): State {
  if (action.type === 'SWITCH_TAB') {
    return {...state, tab: action.tab, tabProps: action.tabProps};
  } else if (action.type === 'SKIP_INTRO') {
    return {...state, skipIntro: true};
  }
  return state;
}

module.exports = navigation;
