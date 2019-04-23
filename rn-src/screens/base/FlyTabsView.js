/**
 *
 *
 * @providesModule FlyTabsView
 * @flow
 *
 */
'use strict';

import React, {Component} from 'react';
import ReactNative, {
  StyleSheet,
  Navigator,
  TabBarIOS,
  TabBarItemIOS,
  DeviceEventEmitter,
  View
} from 'react-native';

import {
  assetsPath
} from 'fly-react-native-app-info';

const Utils = require('Utils');
const SceneUtils = require('SceneUtils');
const FlyColors = require('FlyColors');
const FlyIconfonts = require('FlyIconfonts');
const env = require('env');

const {switchTab} = require('../../actions');
const {connect} = require('react-redux');

const EnterMainView = require('../enter/EnterMainView');
const FinancingMainView = require('../financing/FinancingMainView');
const DiscoveryMainView = require('../discovery/DiscoveryMainView');
const ProfileMainView = require('../profile/ProfileMainView');


import type { Tab } from '../../reducers/navigation';

class FlyTabsView extends React.Component {

  props: {
    tab: Tab;
    onTabSelect: (tab: Tab, tabProps: Object) => void;
    navigator: Navigator;
  };

  constructor(props) {
    super(props);

    (this : any)._onTabSelect = this._onTabSelect.bind(this);
  }

  componentDidMount() {
    let that = this;
    this.tabChangeListener = DeviceEventEmitter.addListener(env.ListenerMap['ENTER_TAB_CHANGE'], (param) => {
      that._onTabSelect(param[0], param[1]);
    });
  }

  componentWillUnmount() {

    if (this.tabChangeListener) {
      this.tabChangeListener.remove();
    }
  }

  _onTabSelect(tab: Tab, props: Object) {
    if (this.props.tab !== tab) {
      if (!this.props.isLoggedIn && !SceneUtils.skipLoginCheckTab(tab)) {
        DeviceEventEmitter.emit(env.ListenerMap['LOGIN_MODAL']);
        // SceneUtils.gotoLogin({
        //   toTab: tab,
        //   toTabProps: props,
        // });
      } else {
        this.props.onTabSelect(tab, props);
      }

      if (tab == 'profile') {
        DeviceEventEmitter.emit(env.ListenerMap['RELOAD_GET_EWALLET']);
      }

      if (tab == 'financing') {
        DeviceEventEmitter.emit(env.ListenerMap['RELOAD_GET_FINANCING']);
      }
    }


  }

  componentWillMount() {
    FlyIconfonts.getImageSource('ios-settings', 30).then((source) => this.setState({ gearIcon: source }));
  }

  renderFromFont() {
    let navigator = this.props.navigator;
    let tabProps = this.props.tabProps || {};

    return (
      <TabBarIOS tintColor={FlyColors.baseColor} unselectedTintColor={FlyColors.baseTextColor} barTintColor={FlyColors.white}>
        <FlyIconfonts.TabBarItemIOS
          title="热门推荐"
          iconName="nav-enter"
          selectedIconName="nav-enter-active"
          selected={this.props.tab === 'enter'}
          onPress={()=>this._onTabSelect('enter')}>
          <EnterMainView navigator={navigator} {...tabProps} />
        </FlyIconfonts.TabBarItemIOS>

        <FlyIconfonts.TabBarItemIOS
          title="理财产品"
          iconName="nav-blanknote"
          selectedIconName="nav-blanknote-active"
          selected={this.props.tab === 'financing'}
          onPress={()=>this._onTabSelect('financing')}>
          <FinancingMainView navigator={navigator} {...tabProps} />
        </FlyIconfonts.TabBarItemIOS>

        <FlyIconfonts.TabBarItemIOS
          title="发现"
          iconName="nav-aging"
          selectedIconName="nav-aging-active"
          selected={this.props.tab === 'discovery'}
          onPress={()=>this._onTabSelect('discovery')}>
          <DiscoveryMainView navigator={navigator} {...tabProps} />
        </FlyIconfonts.TabBarItemIOS>

        <FlyIconfonts.TabBarItemIOS
          title="我的资产"
          iconName="nav-profile"
          selectedIconName="nav-profile-active"
          selected={this.props.tab === 'profile'}
          onPress={()=>this._onTabSelect('profile')}>
          <ProfileMainView navigator={navigator} {...tabProps} />
        </FlyIconfonts.TabBarItemIOS>
      </TabBarIOS>
      );
  }

  fixIconImg(source) {
    let _assetsPath = assetsPath();
    let _source = source;
    if (!Utils.isEmpty(_assetsPath)) {
      _source = _assetsPath + source.substring(1);
    }
    return {
      uri: "file://" + _source,
      scale: 4
    };
  }

  renderFromImg() {
    let navigator = this.props.navigator;
    let tabProps = this.props.tabProps || {};

    return (
      <TabBarIOS tintColor={FlyColors.baseColor} unselectedTintColor={FlyColors.baseTextColor} barTintColor={FlyColors.white}>
        <TabBarIOS.Item
          title="热门推荐"
          renderAsOriginal
          icon={this.fixIconImg('./imgs/nav/home.png')}
          selectedIcon={this.fixIconImg('./imgs/nav/home-in.png')}
          selected={this.props.tab === 'enter'}
          onPress={()=>this._onTabSelect('enter')}>
          <EnterMainView navigator={navigator} {...tabProps} />
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title="理财产品"
          renderAsOriginal
          icon={this.fixIconImg('./imgs/nav/financing.png')}
          selectedIcon={this.fixIconImg('./imgs/nav/financing-in.png')}
          selected={this.props.tab === 'financing'}
          onPress={()=>this._onTabSelect('financing')}>
          <FinancingMainView navigator={navigator} {...tabProps} />
        </TabBarIOS.Item>

        <TabBarIOS.Item
          title="发现"
          renderAsOriginal
          icon={this.fixIconImg('./imgs/nav/find.png')}
          selectedIcon={this.fixIconImg('./imgs/nav/find-in.png')}
          selected={this.props.tab === 'discovery'}
          onPress={()=>this._onTabSelect('discovery')}>
          <DiscoveryMainView navigator={navigator} {...tabProps} />
        </TabBarIOS.Item>

        <TabBarIOS.Item
          title="我的资产"
          renderAsOriginal
          icon={this.fixIconImg('./imgs/nav/me.png')}
          selectedIcon={this.fixIconImg('./imgs/nav/me-in.png')}
          selected={this.props.tab === 'profile'}
          onPress={()=>this._onTabSelect('profile')}>
          <ProfileMainView navigator={navigator} {...tabProps} />
        </TabBarIOS.Item>
      </TabBarIOS>
      );
  }

  render() {
    let fromFont = false;
    return fromFont ? this.renderFromFont() : this.renderFromImg();
  }
}

var styles = StyleSheet.create({

});

function select(store) {
  return {
    tab: store.navigation.tab,
    tabProps: store.navigation.tabProps,
    isLoggedIn: store.user.isLoggedIn,
  };
}

function actions(dispatch) {
  return {
    onTabSelect: (tab, tabProps) => dispatch(switchTab(tab, tabProps)),
  };
}

module.exports = connect(select, actions)(FlyTabsView);
