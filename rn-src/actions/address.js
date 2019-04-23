/**
 *
 *
 * @flow
 *
 */

'use strict';

import React from 'react';
import { Platform } from 'react-native';

import type {
    Action,
    ThunkAction
} from './types';

const NetworkService = require('NetworkService');


function getAllProvinceList(): ThunkAction {
    return (dispatch, getState) => {
        let conf = {
            url: 'getAllProvinceList',
            ignoreLogin: true
        };

        let onSuccess = (data, dispatch) => {
            let list = data.items;
            return dispatch({
                type: "LOADED_ALL_PROVICE_LIST",
                list: list
            })
        };

        let onFailure = (error, dispatch) => {
        };

        return dispatch(NetworkService.fetch(conf, onSuccess, onFailure))

    };
}


function getCityListByProvince(provinceCode): ThunkAction {
    return (dispatch, getState) => {

        let conf = {
            url: 'getCityListByProvince',
            ignoreLogin: true,
            params: {
                provinceCode: provinceCode
            }
        };

        let onSuccess = (data, dispatch) => {
            let list = data.items;
            return dispatch({
                type: "LOADED_CITY_LIST_BY_PROVINCE",
                cityList: list,
                provinceCode: provinceCode
            })
        };

        let onFailure = (error, dispatch) => {
        };

        return dispatch(NetworkService.fetch(conf, onSuccess, onFailure))

    };

   
}

function getAreaListByCity(cityCode): ThunkAction {
    return (dispatch, getState) => {

        let conf = {
            url: 'getAreaListByCity',
            ignoreLogin: true,
            params: {
                cityCode: cityCode
            }
        };

        let onSuccess = (data, dispatch) => {
            let list = data.items;
            return dispatch({
                type: "LOADED_AREA_LIST_BY_CITY",
                areaList: list,
                cityCode: cityCode
            })
        };

        let onFailure = (error, dispatch) => {

        };

        return dispatch(NetworkService.fetch(conf, onSuccess, onFailure))

    };
}

function getStreetListByAreaCode(areaCode): ThunkAction {
    return (dispatch, getState) => {

        let conf = {
            url: 'getStreetListByAreaCode',
            ignoreLogin: true,
            params: {
                areaCode: areaCode
            }
        };

        let onSuccess = (data, dispatch) => {
            let list = [];
            if(data && data.items && data.items.length > 0){
              list = data.items;
            }
            dispatch({
                  type: "LOADED_AREA_LIST_BY_AREA",
                  streetList: list,
                  areaCode: areaCode
            });
              return Promise.resolve(data);

        };

        let onFailure = (error, dispatch) => {
            return Promise.reject(error);
        };

        return dispatch(NetworkService.fetch(conf, onSuccess, onFailure))

    };
}

module.exports = {

getAllProvinceList,
getCityListByProvince,
getAreaListByCity,
getStreetListByAreaCode

}
