/**
 * @providesModule FlyContainer
 * @flow
 */

'use strict';

import React, {
  Component
}
from 'react';
import {
  StyleSheet,
}
from 'react-native';

const FlyBase = require('FlyBase');
const FlyColors = require('FlyColors');
const FlyDimensions = require('FlyDimensions');
const FlyErrorPlacehoderComponent = require('FlyErrorPlacehoderComponent');

export type LoadStatus = 'unload' | 'loading' | 'loaded' | 'loadErr';

export type Props = {
  loadStatus: LoadStatus;
  errText: string;
  reloadData: any;
  renderContent: () => any;
  loadingViewStyle: any;
  loadingType: loadingType;
  modalStyle: style; //only loadingType = 'circle'
};

class FlyContainer extends Component {

  props: Props;

  render() {
    if (this.props.loadStatus === 'loadErr') {
      return (
        <FlyErrorPlacehoderComponent
              title={this.props.errText}
              desc={'重新加载'}
              onPress={this.props.reloadData}/>
      );
    } else if (this.props.loadStatus === 'loaded') {
      return this.props.renderContent();
    } else {
      return FlyBase.LoadingView(this.props.loadingViewStyle);
    }
  }
}

module.exports = FlyContainer;
