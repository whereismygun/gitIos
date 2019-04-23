/**
 *
 * @providesModule FlySearch
 * @flow
 *
 */
'use strict';

import React from 'react';

import ReactNative, {
  StyleSheet,
  Navigator,
  TouchableOpacity,
  View,
  InteractionManager
} from 'react-native';

const {connect} = require('react-redux');

const {OneLine,Text} = require('FlyText');

const FlyStyles = require('FlyStyles');
const FlyDimensions = require('FlyDimensions');
const FlyColors = require('FlyColors');
const FlyIconfonts = require('FlyIconfonts');

const {
  loadSearchKeywordInfo,
} = require('../../actions');

type Props = {
  navigator: Navigator;
  searchName: string;
};

class FlySearch extends React.Component {
  props: Props;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let that = this;
    InteractionManager.runAfterInteractions(()=>{
      that.props.dispatch(loadSearchKeywordInfo());
    });
  }

  render() {
    let searchName = this.props.searchName ? this.props.searchName : this.props.recom;
    return (
      <View style={styles.container}>
        <View style={styles.searchWrapper}>
          <View style={styles.searchIcon}>
            <FlyIconfonts name='icon-search' size={18} color={FlyColors.baseTextColor2} />
          </View>
          <View style={styles.searchInput}>
            <OneLine style={styles.searchInputText} textAlignVertical={{type:'center', height:30, fontSize:FlyDimensions.fontSizeLarge}}>
              {this.props.searchName || this.props.recom}
            </OneLine>
          </View>
        </View>
      </View>
    );

  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  searchWrapper: {
    backgroundColor: FlyColors.baseBackgroundColor,
    opacity: 0.8,
    borderRadius: 3,
    borderColor: FlyColors.baseBorderColor,
    borderWidth: 0.5,
    alignItems: 'flex-start',
    flexDirection: 'row',
    height: 30,
  },
  searchIcon: {
    backgroundColor: 'transparent',
    paddingTop: 6,
    paddingLeft: 6,
    width: 30,
  },
  searchInput: {
    backgroundColor: 'transparent',
    flex: 1,
    height: 30,
  },
  searchInputText: {
    color: FlyColors.baseTextColor2,
    backgroundColor: 'transparent',
  },
  spinner: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 25,
    height: 25,
    backgroundColor: 'transparent',
  },
});

function select(store, props) {
  return {
    recom: 'aaaa',
  };
}

module.exports = connect(select)(FlySearch);
