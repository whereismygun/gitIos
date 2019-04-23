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


export type Delivery = {
    addressId: number;
    name: string;
    address: string;
    phone: string;
    province: string;
    provinceCode: string;
    city: string;
    cityCode: string;
    area: string;
    areaCode: string;
}

export type Province = {
    provinceCode: string;
    provinceName: string;
}

export type City = {
    cityCode: string;
    cityName: string;
}

export type Area = {
    areaCode: string;
    areaName: string;
}

export type Street = {
    code: string;
    name: string;
}




export type School = {
    schoolCode: string;
    schoolName: string;
}

type State = {
    deliveryList: Array<Delivery> ;
    provinceList: Array<Province>;
    cityListMap: Object<string, Array<City>>;
    areaListMap: Object<string, Array<Area>>;
    schoolListMap: Object<string, Array<School>>;
    streetListMap:Object<string, Array<Street>>;
};

const initialState: State = {
    deliveryList: [],
    provinceList: [],
    cityListMap: {},
    areaListMap: {},
    schoolListMap: {},
    streetListMap:{},
};

function address(state: State = initialState, action: Action): State {
    switch (action.type) {
        case 'LOGOUT':
            return {
                ...state,
                deliveryList: [],
            };
        case 'LOADED_DELIVERY_LIST':
            return {
                ...state,
                deliveryList: action.list
            };
        case 'LOADED_ALL_PROVICE_LIST':
            return {
                ...state,
                provinceList: action.list
            };
        case 'LOADED_CITY_LIST_BY_PROVINCE':
            let cityListMap = Object.assign({}, state.cityListMap);
            cityListMap[action.provinceCode] = action.cityList;
            return {
                ...state,
                cityListMap
            };
        case 'LOADED_AREA_LIST_BY_CITY':
            let areaListMap = Object.assign({}, state.areaListMap);
            areaListMap[action.cityCode] = action.areaList;
            return {
                ...state,
                areaListMap
            };
        case 'LOADED_AREA_LIST_BY_AREA':
            let streetListMap = Object.assign({}, state.streetListMap);
            streetListMap[action.areaCode] = action.streetList;
            return {
                ...state,
                streetListMap
            };
        case 'LOADED_SCHOOL_LIST_BY_CITY':
            let schoolListMap = Object.assign({}, state.schoolListMap);
            schoolListMap[action.cityCode] = action.schoolList;
            return {
                ...state,
                schoolListMap
            };
        default:
            return state;
    }
}

module.exports = address;
