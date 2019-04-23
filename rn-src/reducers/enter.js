/**
 *
 *
 * @flow
 *
 */

'use strict';

import type {Action} from '../actions/types';

export type ViewPagerImg = {
  imgUrl: string;
  href: string;
};

export type NoticeInfo = {
  content: string;
  linkContent: string;
  linkUrl: string;
  status: string;
}

export type ProductInfo = {
  mainProImgUrl: string;
  name: string;
  proSkuPrice: number;
  marketPrice: number;
  defaultEveryAmount: number;
  defaultPeriod: number;
}

export type BannerInfo = {
  bannerSrc: string;
  href: string;
  imgSize: Object;
}

export type MainInfo = {
  imgUrl: string;
  href: string;
}

export type FloorInfo = {
  floor: 'true' | 'false';
  title: string;
  categoryId: number;
}

export type isNewPerson = {
    isNewPerson:boolean;
}
export type statData = {
    allAmount:number;
    allInterest:number;
    overdueProbability:number;
    userCount:number;

}

type State = {
  viewPagerImgs: Array<ViewPagerImg>;
  saleInfo: Array<ProductInfo>;
  mainInfo: Array<MainInfo>;
  floorInfo: Array<FloorInfo>;
  bannerList: Array<Object>;
  timeInfo:number;
  isNewPerson:boolean;
  statData:Object;
  listdata:Object;
};

const initialState: State = {
  viewPagerImgs: [],
  saleInfo: [],
  mainInfo: [],
  floorInfo: [],
  bannerList: [],
  timeInfo:0,
  isNewPerson:true,
  statData:'',
  listdata:'',
};

function enter(state: State = initialState, action: Action): State {
  switch (action.type) {
    case 'LOADED_ENTER_VIEW_PAGER_IMGS':
      return {...state, viewPagerImgs: action.list};
    case 'LOADED_ENTER_SALE_INFO':
      return {...state, saleInfo: action.list};
    case 'LOADED_ENTER_BANNER_INFO':
      return {...state, bannerInfo: action.data};
    case 'LOADED_ENTER_MAIN_INFO':
      return {...state, mainInfo: action.list};
    case 'LOADED_ENTER_FLOOR_INFO':
      return {...state, floorInfo: action.list};
    case 'LOADED_ENTER_FLOOR_ITEM_INFO':
      let floorItemInfo = {};
      floorItemInfo["floorItemInfoCate"+action.categoryId] = action.list;
      return {...state, ...floorItemInfo};
    case 'LOADED_ENTER_NAVBANNER_LIST':
      return {...state, bannerList: action.list};
    case 'LOADED_ENTER_TIMESAVE':
      return {...state, timeInfo: action.timeInfo};
    case 'LOADED_ENTER_CHECK_USER_IS_NEW':
        return {...state,isNewPerson: action.isNewPerson};
    case 'LOADED_ENTER_GET_STAT_DATA':
       return {...state,statData: action.statData};
    case 'LOADED_ENTER_GET_LIST_NEW_P':
       return {...state,listdata: action.listdata};
    default:
      return state;
  }
}


module.exports = enter;
