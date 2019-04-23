/**
 *
 *
 * @flow
 *
 */

'use strict';

import React from 'react';
import { Platform, Alert } from 'react-native';

import type { Action, ThunkAction } from './types';

var Utils = require('Utils');
var NetworkService = require('NetworkService');

function loadSearchKeywordInfo(): ThunkAction {
  return (dispatch, getState) => {

    let conf = {
      url: 'getSearchKeywordRecoms',
      ignoreLogin: true,
    };

    let onSuccess = (data, dispatch) => {
      let recom = "",
        hots = [];
      if (data) {
        recom = data.llq_product_recom || "";
        if (data.llq_product_hot) {
          hots = data.llq_product_hot.split(",");
        }
      }
      return dispatch({
        type: "LOADED_SEARCH_KEYWORD_INFO",
        recom: recom,
        hots: hots,
      });
    };

    let onFailure = (error, dispatch) => {

    };

    return dispatch(NetworkService.fetch(conf, onSuccess, onFailure));
  };
}

function listSearchKeywordHistorys(): ThunkAction {
  return (dispatch, getState) => {

    let conf = {
      url: 'listSearchKeywordHistorys',
      ignoreLogin: true,
    };

    let onSuccess = (data, dispatch) => {
      let list = data.items;
      return dispatch({
        type: "LIST_SEARCH_KEYWORD_HISTORYS",
        list: list
      });
    };

    let onFailure = (error, dispatch) => {

    };

    return dispatch(NetworkService.fetch(conf, onSuccess, onFailure));
  };
}

function listPagedProductInfoFromSearch(promotionType,offset,brandId,categoryId,limit): ThunkAction {
  return (dispatch, getState) => {
    let params = {
      brandId:brandId,
      categoryId:categoryId,
      limit: limit,
      promotionType: promotionType,
      offset: offset
    };

    let conf = {
      url: 'listPagedProductInfoFromSearch',
      method: 'POST',
      isForm: true,
      ignoreLogin: true,
      params: params
    };

    let onSuccess = (data, dispatch) => {
      // let list = data.items;
      //   dispatch({
      //   type: "LIST_PAGED_PRODUCT_INFO_FROM_SEARCH",
      //   list: list
      // });

       return Promise.resolve(data);

    };

    let onFailure = (error, dispatch) => {
      return Promise.reject(error);
    };

    return dispatch(NetworkService.fetch(conf, onSuccess, onFailure));
  };
}


function clearSearchKeywordHistorys(): ThunkAction {
  return (dispatch, getState) => {

    let conf = {
      url: 'clearSearchKeywordHistorys',
      ignoreLogin: true,
    };

    let onSuccess = (data, dispatch) => {
       return Promise.resolve(data);
    };

    let onFailure = (error, dispatch) => {
      return Promise.reject(error);
    };

    return dispatch(NetworkService.fetch(conf, onSuccess, onFailure));
  };
}

function loadDefaultRecommand(): ThunkAction {
  return (dispatch, getState) => {

    let conf = {
      url: 'doQueryRecommandDataByUser',
      ignoreLogin: true,
      params: {
        limit: 40,
        offset: 1,
        promotionType: 'aging'
      }
    };

    let onSuccess = (data, dispatch) => {
      let list = data.items;
      return dispatch({
        type: "LIST_DEFAULT_RECOMMAND",
        list: list
      });
    };

    let onFailure = (error, dispatch) => {

    };

    return dispatch(NetworkService.fetch(conf, onSuccess, onFailure));
  };
}


module.exports = {
  loadSearchKeywordInfo,
  listSearchKeywordHistorys,
  listPagedProductInfoFromSearch,
  clearSearchKeywordHistorys,
  loadDefaultRecommand,
};
