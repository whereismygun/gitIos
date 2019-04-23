/**
*
*
* @flow
*
*/
'use strict';

import React from 'react';

import ReactNative, {
 StyleSheet,
 Navigator,
 View,
 Switch,
 TouchableOpacity,
} from 'react-native';

const {connect} = require('react-redux');
const {skipIntro} = require('../../actions');
const FlyDimensions = require('FlyDimensions');

import FlyAppIntro from 'FlyAppIntro';
import SceneUtils from 'SceneUtils';
const dim = FlyDimensions.deviceDim;

type Props = {
  navigator: Navigator;
};

class IntroductionMainView extends React.Component {

  props: Props;

  constructor(props) {
    super(props);

    (this: any).nextBtnHandle = this.nextBtnHandle.bind(this);
    (this: any).doneBtnHandle = this.doneBtnHandle.bind(this);
    (this: any).onSkipBtnHandle = this.onSkipBtnHandle.bind(this);
    (this: any).onSlideChangeHandle = this.onSlideChangeHandle.bind(this);
  }

  gotoTabView() {

    this.props.dispatch(skipIntro());
    SceneUtils.gotoScene('TAB_VIEW', null, "resetTo");
  }

  nextBtnHandle(index) {

  }

  doneBtnHandle() {
    this.gotoTabView();
  }

  onSkipBtnHandle(index) {
    this.gotoTabView();
  }

  onSlideChangeHandle(index, total) {

  }

  render() {

    const pageArray = [{
      title: '',
      img: './imgs/intro/cg_intro1.png',
      imgStyle: {
        height: dim.height,
        width: dim.width,
        borderWidth:1
      },
      descriptionStyle: {
        fontSize: 22,
      },
      backgroundColor: '#333333',
      fontColor: '#3ea3fc',
      level: 10,
    }, {
      title: '',
      img: './imgs/intro/cg-intro2.png',
      imgStyle: {
        height: dim.height,
        width: dim.width,
      },
      descriptionStyle: {
        fontSize: 22,
      },
      backgroundColor: 'white',
      fontColor: '#3ea3fc',
      level: 10,
    }, {
      title: '',
      img: './imgs/intro/cg-intro3.png',
      imgStyle: {
        height: dim.height,
        width: dim.width,
        borderWidth:1
      },
      descriptionStyle: {
        fontSize: 22,
      },
      backgroundColor: 'white',
      fontColor: '#3ea3fc',
      level: 10,
    },
    {
      title: '',
      img: './imgs/intro/cg_intro4.png',
      imgStyle: {
        marginTop:dim.height * 0.42,
        height: dim.height,
        width: dim.width,
        borderWidth:1
      },
      descriptionStyle: {
        fontSize: 22,
      },
      backgroundColor: 'white',
      fontColor: '#3ea3fc',
      level: 10,
    }

    ];

    return (
      <FlyAppIntro
        skipBtnLabel={'跳过'}
        doneBtnLabel={'立即体验'}
        onNextBtnClick={this.nextBtnHandle}
        onDoneBtnClick={this.doneBtnHandle}
        onSkipBtnClick={this.onSkipBtnHandle}
        onSlideChange={this.onSlideChangeHandle}
        pageArray={pageArray}
        rightTextColor={'#999999'}
        leftTextColor={'#999999'}
        activeDotColor={'#3ea3fc'}
        dotColor={'#cccccc'}
      />
    )
  }
}



var styles = StyleSheet.create({

});

function select(store, props) {
  return {

  };
}

module.exports = connect(select)(IntroductionMainView);
