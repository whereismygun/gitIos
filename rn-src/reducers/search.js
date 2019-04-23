/**
 *
 *
 * @flow
 *
 */

'use strict';

import type {Action} from '../actions/types';

type State = {
  recom: string;
  hots: Array<string>;
  listSearchKeywordHistorys: Array<Object>;
  listPagedProductInfo: Array<Object>;
  listDefaultRecommand: Array<Object>;
};

const initialState: State = {
  recom: "",
  hots: [],
  listSearchKeywordHistorys: [],
  listPagedProductInfo: [],
  listDefaultRecommand: [],
};

function search(state: State = initialState, action: Action): State {
  switch (action.type) {
    case 'LOADED_SEARCH_KEYWORD_INFO':
      return {...state, recom: action.recom, hots: action.hots};
    case 'LIST_SEARCH_KEYWORD_HISTORYS':
      return {...state, listSearchKeywordHistorys: action.list};
    case 'LIST_PAGED_PRODUCT_INFO_FROM_SEARCH':
      return {...state, listPagedProductInfo: action.list};
    case 'LIST_DEFAULT_RECOMMAND':
      return {...state, listDefaultRecommand: action.list};
    default:
      return state;
  }
}


module.exports = search;
