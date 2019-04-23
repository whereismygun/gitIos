/**
 *
 *
 * @flow
 *
 */
'use strict';
import React, { Component } from 'react';
import ReactNative, {
  StyleSheet,
  Navigator,
  View,
  ListView,
  TouchableHighlight,
  DeviceEventEmitter,
  InteractionManager
} from 'react-native';
import { connect } from 'react-redux';

import type { Province, City, Area } from '../../reducers/address';
import { getAllProvinceList, getCityListByProvince, getAreaListByCity,getStreetListByAreaCode } from '../../actions';

const FlyColors = require('FlyColors');
const FlyDimensions = require('FlyDimensions');
const FlyHeader = require('FlyHeader');
const FlyItem = require('FlyItem');
const TimerMixin = require('react-timer-mixin');
const SceneUtils = require('SceneUtils');
const Utils = require('Utils');
const FlyContainer = require('FlyContainer');
const env = require('env');

type Props = {
  navigator: Navigator;
  provinceList: Array<Province>;
  cityListMap: Object<string,Array<City>>;
  areaListMap: Object<string,Array<Area>>;

  provinceCode: string;
  cityCode: string;
  areaCode: string;
};

class AddressSelectPcaView extends Component {
  props : Props;

  constructor(props) {
    super(props);

    (this : any)._back = this._back.bind(this);
    (this : any)._renderRow = this._renderRow.bind(this);
    (this : any)._chooseProvince = this._chooseProvince.bind(this);
    (this : any)._chooseCity = this._chooseCity.bind(this);
    (this : any)._chooseArea = this._chooseArea.bind(this);


    this.ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.state = {
      provinceCode: props.provinceCode,
      provinceName: props.provinceName,
      cityCode: props.cityCode,
      cityName: props.cityName,
      areaCode: props.areaCode,
      areaName: props.areaName,

      pageStatus: 'province', // province, city, area
      loadStatus: 'unload',
    };
  }

  componentDidMount() {
    let that = this;
    InteractionManager.runAfterInteractions(() => {
      that.props.dispatch(getAllProvinceList());
      that._checkLoad(that.props);
    });
  }

  componentWillReceiveProps(nextProps) {
    this._checkLoad(nextProps);
  }

  _checkLoad(props) {
    if (props.provinceList) {
      this.setState({
        loadStatus: "loaded"
      });
    }
  }

  _back() {
    switch (this.state.pageStatus) {
      case "province":
        SceneUtils.goBack();
        break;
      case "city":
        this.setState({
          pageStatus: 'province',
        });
        break;
      case "area":
        this.setState({
          pageStatus: 'city',
        });
        break;
    }
  }

  _chooseProvince(item) {

    if (this.state.provinceCode == item.provinceCode) {
      this.setState({
        pageStatus: 'city',
      });
    } else {
      this.setState({
        provinceCode: item.provinceCode,
        provinceName: item.provinceName,
        cityCode: null,
        cityName: null,
        pageStatus: 'city',
      });
    }

    this.props.dispatch(getCityListByProvince(item.provinceCode));
    this.refs.container.refs.listView.scrollsToTop = true;
  }

  _chooseCity(item) {
    if (this.state.cityCode == item.cityCode) {
      this.setState({
        pageStatus: 'area',
      });
    } else {
      this.setState({
        cityCode: item.cityCode,
        cityName: item.cityName,
        pageStatus: 'area',
      });
    }

    this.props.dispatch(getAreaListByCity(item.cityCode));
    this.refs.container.refs.listView.scrollsToTop = true;
  }

  _chooseArea(item) {


    var params = {
      provinceCode: this.state.provinceCode,
      provinceName: this.state.provinceName,
      cityCode: this.state.cityCode,
      cityName: this.state.cityName,
      areaCode: item.areaCode,
      areaName: item.areaName,

    };

      DeviceEventEmitter.emit(env.ListenerMap['ADDRESS_CHOOSE_PCA'], params);
      SceneUtils.goBack();

  }


  _renderRow(rowData : [], sectionID : number, rowID : number) {

    let listName, leftIcon, itemSelected = false, pressFuction;

    switch (this.state.pageStatus) {
      case "province":
        listName = rowData.provinceName;
        itemSelected = (rowData.provinceCode == this.state.provinceCode);
        pressFuction = () => this._chooseProvince(rowData);
        break;
      case "city":
        listName = rowData.cityName;
        itemSelected = (rowData.cityCode == this.state.cityCode);
        pressFuction = () => this._chooseCity(rowData);
        break;
      case "area":
        listName = rowData.areaName;
        itemSelected = (rowData.areaCode == this.state.areaCode);
        pressFuction = () => this._chooseArea(rowData);
        break;

    }



    return (
      <FlyItem text={listName}  onPress={pressFuction} showSegment={true} />
    );
  }

  render() {
    let leftItem = {
      layout: 'icon',
      icon: 'icon-left-arrow-l',
      onPress: this._back
    };

    let title, dataSource, list;

    switch (this.state.pageStatus) {
      case "province":
        list = this.props.provinceList || [];
        title = "省份选择"
        break;
      case "city":
        let provinceCode = this.state.provinceCode;
        let cityListMap = this.props.cityListMap;
        list = cityListMap[provinceCode] || [];
        title = "城市选择"
        break;
      case "area":
        let cityCode = this.state.cityCode;
        let areaListMap = this.props.areaListMap;
        list = areaListMap[cityCode] || [];
        title = "区域选择"
        break;
    }
    dataSource = this.ds.cloneWithRows(list);

    return (
      <View style={styles.container}>
        <FlyHeader title={title} backgroundColor={FlyColors.white} leftItem={leftItem} foreground="dark" borderBottom={true}/>
        <FlyContainer ref="container" loadStatus={this.state.loadStatus} renderContent={() => (<ListView ref="listView" enableEmptySections={true} dataSource={dataSource} renderRow={this._renderRow}/>)}/>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: FlyColors.baseBackgroundColor
  },
  content: {
    backgroundColor: FlyColors.white,
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: 50,
    paddingLeft: 20,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: FlyColors.baseTextColor,
    fontSize: FlyDimensions.fontSizeXxxl,
    marginLeft: 40
  },
  itemText: {
    fontSize: FlyDimensions.fontSizeXxl,
    color: FlyColors.baseTextColor
  },
  border: {
    borderWidth: 0.5,
    borderColor: FlyColors.baseBorderColor
  }
});

function select(store) {
  return {
    provinceList: store.address.provinceList,
    cityListMap: store.address.cityListMap,
    areaListMap: store.address.areaListMap,
    streetListMap: store.address.streetListMap
  };
}

module.exports = connect(select)(AddressSelectPcaView);
